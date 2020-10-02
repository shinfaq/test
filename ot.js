(function () {
    'use strict';
    kintone.events.on('app.record.detail.process.proceed', function (event) {
        console.log(event);
        var cwToken = "98b4cb2714f0ded7c49363fb9f72c313";
        var roomReply = "195007576";
        var appStaff = "5017";
        var appTimeSheet = "5015";
        var id = event.record.idfromdate.value;
        var chatworkid = event.record.chatworkid.value;
        var nextStt = event.nextStatus.value;
        var date = event.record.date.value;
        var overtime = event.record.overtime.value;
        var code = event.record.$id.value;
        var type = event.record.$id.type;
        var body = {
            "app": kintone.app.getId()
        };

        kintone.api(kintone.api.url('/k/v1/app/status', true), 'GET', body, function (resp) {
            var nextAssignee;
            console.log(resp);
            console.log(nextStt);
            var states = resp.states;
            states = Object.values(states);
            for (var j = 0; j < states.length; j++) {
                if (states[j].name == nextStt) {
                    if (states[j].assignee.entities.length > 0)
                        nextAssignee = states[j].assignee.entities[0].entity.code;
                    else
                        nextAssignee = '';
                }
            }
            console.log(nextAssignee);
            if (nextAssignee !== '') {
                var body = {
                    "app": appStaff,
                    "query": "loginid = \"" + nextAssignee + "\"",
                    "fields": ["chatworkid", "chatbotroom"]
                };
                kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function (resp) {

                    var cwId = resp.records[0].chatworkid.value;
                    var room = resp.records[0].chatbotroom.value;
                    var messages = "[piconname:" + chatworkid + "] の「" + id + "」のOT申請をご承認してください。";
                    var messagesEncode = encodeURIComponent(messages);
                    var link = "https://kintoneivsdemo.cybozu.com/k/5022/show#record=" + code;
                    var linkEndcode = encodeURIComponent(link);
                    var headers = { "X-ChatWorkToken": cwToken };
                    var body = "[To:" + cwId + "]%0A" + messagesEncode + "%0A" + linkEndcode;
                    var url = 'https://api.chatwork.com/v2/rooms/' + roomReply + '/messages?body=' + body;
                    kintone.proxy(url, 'POST', headers, {}, function (body, status, headers) {

                    });

                });
            }
            else {
                var bdstaff = {
                    "app": appStaff,
                    "query": "chatworkid=\"" + chatworkid + "\"",
                    "feilds": ["chatbotroom", "$id", "compensatoryOff"]
                };
                kintone.api(kintone.api.url('/k/v1/records', true), 'GET', bdstaff, function (resp) {
                    if (type=="支払") {
                        var strDate = date;//2020-07-30
                        var d2 = strDate.split('-');
                        strDate = d2[0] + '年' + d2[1] + '月' + d2[2] + '日';
                        var strOvertime = overtime;
                        strOvertime = strOvertime.replace(':', '時間');
                        strOvertime = strOvertime + '分';
                        var messages = strDate + " " + strOvertime + "の残業時間を登録しました。申し込み番号 =「" + id + "」";
                        var messagesEncode = encodeURIComponent(messages);
                        var headers = { "X-ChatWorkToken": cwToken };
                        var bd = "[To:" + chatworkid + "]%0A" + messagesEncode;
                        var url = 'https://api.chatwork.com/v2/rooms/' + roomReply + '/messages?body=' + bd;
                        kintone.proxy(url, 'POST', headers, {}, function (body, status, headers) {
                            console.log(status, JSON.parse(body), headers);
                        });
                        var bdtimeshett = {
                            "app": appTimeSheet,
                            "query": "(chatworkid=\"" + chatworkid + "\") and (date =\"" + date + "\")",
                            "feilds": ["$id", "staffname"]
                        };
                        kintone.api(kintone.api.url('/k/v1/records', true), 'GET', bdtimeshett, function (resp) {
                            var id = resp.records[0].$id.value;
                            var timeshett = {
                                "app": appTimeSheet,
                                "id": id,
                                "record": {
                                    "overtime": {
                                        "value": overtime
                                    }
                                }
                            }
                            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', timeshett, function (resp) {
                            });
                        });
                    }
                    else{
                        var listOT = overtime.split(":")
                        var OT = parseInt(listOT[0])+  parseInt(listOT[1])/60
                        var idStaff = resp.records[0].$id.value;
                        var compensatoryOff =  resp.records[0].compensatoryOff.value;
                        var bdtimeshett = {
                            "app": appTimeSheet,
                            "query": "(chatworkid=\"" + chatworkid + "\") and (date =\"" + date + "\")",
                            "feilds": ["$id", "coefficient"]
                        };
                        kintone.api(kintone.api.url('/k/v1/records', true), 'GET', bdtimeshett, function (resp) {
                            var coefficient = resp.records[0].coefficient.value;
                            var bdstaff = {
                                "app": appStaff,
                                "id":idStaff,
                                "record":{
                                    "compensatoryOff":{
                                        "value":compensatoryOff+ OT*coefficient
                                    }
                                }
                            }
                            console.log(bdstaff)
                            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', bdstaff, function (resp) {
                            });
                        });
                    
                    }

                });

            }
        });


    });

})();