var currentDate = new Date();
var viewName = "month";
var staffData = [];
var listDepartment = [];

$(document).ready(function () {
    //   $('#datetimepicker1').datetimepicker({
    //                 format: 'L'});
    
    
$.datepicker.setDefaults( {
	closeText: "閉じる",
	prevText: "&#x3C;前",
	nextText: "次&#x3E;",
	currentText: "今日",
	monthNames: [ "1月","2月","3月","4月","5月","6月",
	"7月","8月","9月","10月","11月","12月" ],
	monthNamesShort: [ "1月","2月","3月","4月","5月","6月",
	"7月","8月","9月","10月","11月","12月" ],
	dayNames: [ "日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日" ],
	dayNamesShort: [ "日","月","火","水","木","金","土" ],
	dayNamesMin: [ "日","月","火","水","木","金","土" ],
	weekHeader: "週",
	dateFormat: "yy/mm/dd",
	firstDay: 0,
	isRTL: false,
	showMonthAfterYear: true,
	yearSuffix: "年" } );
    
     var year = (new Date).getFullYear();
     $( "#datePick" ).datepicker({
      changeMonth: true,
      changeYear: true,
      onSelect: function(date) {
            currentDate = new Date(date);
             setText();
      },
      maxDate: new Date(year, 11, 31)
    });
    
    $('.show-datePick').on('click', function(){
        $("#datePick").datepicker("show");
    });


    $('#menu-item input').on('click', onClickMenu);
    $('#menu-navi button').on('click', onClickMove);

    var body = {
        "app": 5081,
        "query": "$id!=\"\"",
        "fields": ["$id", "name", "code"]
    };
    kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function (resp) {
        $('#example-post').html("");
        resp.records.forEach(item => {
            listDepartment.push(item.name.value);
            $option = $("<option></option>");
            $option.text(item.name.value);
            $option.attr("value", item.name.value);
            $('#example-post').append($option);
        })
        $('#example-post').multiselect({
            includeSelectAllOption: true,
            buttonClass: 'btn btn-light',
            enableFiltering: true,
            selectAllText: "すべて",
            filterPlaceholder: "探索",
            nonSelectedText: "なし",
            allSelectedText: "すべて選択済み",
            nSelectedText: "選択済み",
            onDropdownHide: function (e) {
                loadData();
            },
            templates: {
                ul: '<ul class="multiselect-container dropdown-menu"></ul>',
                filter: '<li class="multiselect-item filter"><div class="input-group"><input class="form-control multiselect-search" type="text"></div></li>',
                filterClearBtn: '<button class="btn btn-default multiselect-clear-filter" type="button"><i class="fas fa-times"></i></button>',
                li: '<li><a href="javascript:void(0);"><label></label></a></li>',
                divider: '<li class="multiselect-item divider"></li>',
                liGroup: '<li class="multiselect-item group"><label class="multiselect-group"></label></li>'
            }
        });
        var listName = [];
        var listStaff = [];
        var options2;
        listDepartment.forEach(item => {
            var body = {
                "app": 5017,
                "query": "department = \"" + item + "\"",
                "fields": ["$id", "chatworkid", "staffname"]
            };
            // lay tong so nhan vien trong phong ban
            kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function (resp) {
                // list ten phong ban
                listName.push(item);
                // list so luong nhan vien
                listStaff.push(resp.records.length)
                options2 = {
                    series: listStaff,
                    chart: {
                        width: 380,
                        type: 'pie',
                    },
                    labels: listName,
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                };
            });

        })
        setTimeout(() => {
            //chart tong so nhan vien
            var chart2 = new ApexCharts(document.querySelector("#chart2"), options2);
            chart2.render();
        }, 1500);

        setText();
    });



});
// load data cua report
function loadData() {
    // lay thong tin ngay bat dau, ket thuc, danh sach phong ban
    var param = getParam();
    var start = param['start'];
    var end = param['end'];
    var dep = (param['list'].length == 0) ? listDepartment : param['list'];
    $('.gaia-argoui-app-index-pager-content').hide();

    var strListDepartment = ''
    // neu danh sach phong ban >0
    if (dep.length > 0) {
        strListDepartment = 'and department in ('
        for (let i = 0; i < dep.length - 1; i++)
            strListDepartment += ("\"" + dep[i] + "\",");
        strListDepartment += ("\"" + dep[dep.length - 1] + "\")")

    }
    // tong thoi gian lam viec cua cac phong ban duoc chon trong thoi gian chon
    var allWorkTime = 0;
    // tong thoi gian ot cua cac phong ban duoc chon trong thoi gian chon
    var allOverTime = 0;
    // tong thoi gian nghi co phep cua cac phong ban duoc chon trong thoi gian chon
    var totalOffTime = 0;
    // tong thoi gian nghi khong phep cua cac phong ban duoc chon trong thoi gian chon    
    var totalOffTime2 = 0;
    var body = {
        "app": 5017,
        "query": "$id!=\"\" " + strListDepartment + " order by $id asc limit 100 offset 0",
        "fields": ["$id", "chatworkid", "staffname", "department"]
    };
    //--------Danh sách nhân viên trong danh sách phòng ban truyền vào-----
    kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function (resp) {
        var totalStaff = resp.records.length;
        // reset html
        $("#showRecord").html("");
        $('.totalStaff').text("0人");
        $('.totalStaff').text(totalStaff + "人");
        $(".totalOffTime").text(0 + "時間-" + 0 + "時間");
        $(".totalWorkTime").text(0 + "時間")
        $(".totalOverTime").text(0 + "時間")
        var index = 0;
        var indexAll = 0;
        var dateArray = [];
        var reslle = resp.records.length;
        if (resp.records != null) {
            //duyet qua moi nhan vien
            resp.records.forEach(item => {

                index++;

                var rc = "even";
                if (index % 2 == 0) {
                    rc = "odd";
                }
                var tr = $('<tr></tr>');
                tr.addClass(rc);




                body = {
                    "app": 5016,
                    "query": "chatworkid=\"" + item.chatworkid.value + "\" and date>=\"" + start + "\" and date<=\"" + end + "\" and Status =\"Approved\" order by date asc limit 100 offset 0",
                    "fields": ["$id", "Status", "date"]
                };
                //------------------Danh sách xin nghỉ được duyệt của 1 nhân viên------------
                kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function (resp) {
                    // successc
                    var cout = resp.records.length;
                    var body = {
                        "app": 5017,
                        "query": "chatworkid=\"" + item.chatworkid.value + "\"",
                        "fields": ["$id", "sessionworkid"]
                    };
                    // ---------------------Ca làm việc của nhân viên-----------
                    kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function (resp) {

                        if (resp.records[0].sessionworkid.value == "1") {

                            totalOffTime += 8 * cout;


                            $(".totalOffTime").text(totalOffTime + "時間-" + totalOffTime2 + "時間");
                        }
                        else {

                            totalOffTime += 4 * cout;


                            $(".totalOffTime").text(totalOffTime + "時間-" + totalOffTime2 + "時間");
                        }

                    });


                });
                body = {
                    "app": 5016,
                    "query": "chatworkid=\"" + item.chatworkid.value + "\" and date>=\"" + start + "\" and date<=\"" + end + "\" and Status !=\"Approved\" order by date asc limit 100 offset 0",
                    "fields": ["$id", "Status", "date"]
                };
                //------------------Danh sách xin nghỉ chưa đưỢc duyệt của 1 nhân viên------------
                kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function (resp) {
                    // successc
                    var cout = resp.records.length;
                    var body = {
                        "app": 5017,
                        "query": "chatworkid=\"" + item.chatworkid.value + "\"",
                        "fields": ["$id", "sessionworkid"]
                    };
                    // ---------------------Ca làm việc của nhân viên-----------
                    kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function (resp) {

                        if (resp.records[0].sessionworkid.value == "1") {

                            totalOffTime2 += 8 * cout;


                            $(".totalOffTime").text(totalOffTime + "時間-" + totalOffTime2 + "時間");
                        }
                        else {

                            totalOffTime2 += 4 * cout;


                            $(".totalOffTime").text(totalOffTime + "時間-" + totalOffTime2 + "時間");
                        }

                    });


                });
                var body = {
                    "app": 5015,
                    "query": "chatworkid=\"" + item.chatworkid.value + "\" and date>=\"" + start + "\" and date<=\"" + end + "\"  order by date asc limit 100 offset 0",
                    "fields": ["$id", "worktime", "overtime", "date", "starttime", "endtime", "startbreaktime", "endbreaktime", "chatworkid", "coefficient", "breaktime", "sessionbegintime", "sessionendtime", "staffname"]
                };
                //------------Danh sách điểm danh của 1 nhân viên---------
                kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function (resp) {
                    var jsons = JSON.stringify(resp.records);
                    // tổng giờ làm của 1 nhân viên
                    var ttWorkTime = 0;
                    // tổng giờ ot của 1 nhân viên
                    var ttOverTime = 0;
                    if (resp.records.length > 0) {
                        // duyệt qua mỗi lần điểm danh
                        resp.records.forEach(i => {
                            // giờ làm của 1 lần điểm danh
                            var workItem = 0;
                            // giờ ot của 1 lần điểm danh
                            var overItem = 0;
                            // giờ làm của 1 lần điểm danh dã nhân hệ số
                            var otHour = 0;

                            var strwt = i.worktime.value;
                            var lwt = strwt.split(":");
                            ttWorkTime += parseInt(lwt[0]) + parseInt(lwt[1]) / 60;
                            workItem = parseInt(lwt[0]) + parseInt(lwt[1]) / 60;

                            if (i.overtime.value != null) {
                                var strot = i.overtime.value;
                                var lot = strot.split(":");
                                ttOverTime += parseInt(lot[0]) + parseInt(lot[1]) / 60;
                                overItem = parseInt(lot[0]) + parseInt(lot[1]) / 60;
                                otHour = overItem * i.coefficient.value;
                            }
                            // thêm vào mảng để vẽ đồ chart
                            checkExistDate(dateArray, i.date.value, workItem, overItem, otHour);
                            // xuất data số giờ nghỉ
                            getOffTime(item.chatworkid.value, start, end, tr)


                        })




                        allWorkTime += ttWorkTime;
                        allOverTime += ttOverTime;
                        $(".totalWorkTime").text(allWorkTime + "時間")
                        $(".totalOverTime").text(allOverTime + "時間")
                        tr.append($(`<td style="text-align:left;" class="stn">` + item.staffname.value + '</td>'));
                        tr.append($('<td>' + item.department.value + '</td>'));
                        tr.append($('<td class="wt">' + ttWorkTime + '</td>'));
                        tr.append($('<td class="ot">' + ttOverTime + '</td>'));
                        tr.append($('<td class="offtime"></td>'));
                        tr.append($('<td class="chatworkid" chatworkid="' + item.chatworkid.value + '"  data=\'' + jsons + '\'><i class="fas fa-eye"></i> </td>'));


                    }
                    else {

                        tr.append($(`<td style="text-align:left;" class="stn">` + item.staffname.value + '</td>'));
                        tr.append($('<td>' + item.department.value + '</td>'));
                        tr.append($('<td class="wt">&nbsp-&nbsp</td>'));
                        tr.append($('<td class="ot">&nbsp-&nbsp</td>'));
                        tr.append($('<td class="offtime">&nbsp-&nbsp</td>'));
                        tr.append($('<td class="chatworkid"  chatworkid="' + item.chatworkid.value + '" data=\'' + jsons + '\'><i class="fas fa-eye"></i> </td>'));
                    }

                    // thông tin chi tiết
                    $('.fa-eye').off('click').on('click', function () {
                        var chatworkid = $(this).parent('.chatworkid').attr('chatworkid');
                        var data = $(this).parent('.chatworkid').attr('data');
                        var ot = $(this).parents('tr').find(".ot").text();
                        var wt = $(this).parents('tr').find(".wt").text();
                        var offtime = $(this).parents('tr').find(".offtime").text();
                        viewDetail(chatworkid, data, wt, ot, offtime);
                    });










                    if (indexAll == reslle) {

                    }


                });
                $tb = $("#showRecord");
                $tb.append(tr);

                indexAll = indexAll + 1;

            })

        }
        // vẽ chart số giờ làm, ot
        setTimeout(() => {
            drawChart1(dateArray);
        }, 1000);

    });





    //////// Table AllStaff by Department



}

/**
 * 
 * @param {*} list 
 * @param {*} date 
 * @param {*} workTime 
 * @param {*} overTime 
 */
// thêm data để vẽ chart
function checkExistDate(list, date, workTime, overTime, otHour) {
    var addNew = true;
    var indexFound = null;
    for (var i = 0; i < list.length; i++) {
        if (list[i].date == date) {
            addNew = false;
            indexFound = i;
        }
    }

    if (addNew) {
        list.push({
            date: date,
            workTime: workTime,
            overTime: overTime,
            otHour: otHour
        });
    } else {
        list[indexFound].workTime += workTime;
        list[indexFound].overTime += overTime;
        list[indexFound].otHour += otHour;
    }

}

function onClickMove(e) {
    var action = $(this).attr('data-action');
    if (action == "show-pick") {
        return false;
    }
    if (action == "move-next") {
        if (viewName == 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        if (viewName == 'week') {
            currentDate.setTime(currentDate.getTime() + (7 * 24 * 3600000));
        }
        if (viewName == 'day') {
            currentDate.setTime(currentDate.getTime() + (1 * 24 * 3600000));
        }
    }
    if (action == "move-prev") {
        if (viewName == 'month') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        }
        if (viewName == 'week') {
            currentDate.setTime(currentDate.getTime() - (7 * 24 * 3600000));
        }
        if (viewName == 'day') {
            currentDate.setTime(currentDate.getTime() - (1 * 24 * 3600000));
        }

    }
    if (action == "move-today") {
        currentDate = new Date();
    }
    setText();
}

function onClickMenu(e) {
    var action = $(this).attr('data-action');
    switch (action) {
        case 'toggle-daily':
            viewName = 'day';
            break;
        case 'toggle-weekly':
            viewName = 'week';
            break;
        case 'toggle-monthly':
            viewName = 'month';
            break;
        default:
            break;
    }
    currentDate = new Date();
    setText();
}

function setText() {
    var text = "";
    if (viewName == 'month') {
        text = currentDate.getFullYear() + "年" + fm(currentDate.getMonth() + 1) + "月";
    }
    if (viewName == 'week') {
        var week = getWeek();
        var start = week[0].getFullYear() + "年" + fm(week[0].getMonth() + 1) + "月" + fm(week[0].getDate())+"日";
        var end = week[1].getFullYear() + "年" + fm(week[1].getMonth() + 1) + "月" + fm(week[1].getDate())+"日";
        text = start + "～" + end;
    }
    if (viewName == 'day') {
        text = currentDate.getFullYear() + "年" + fm(currentDate.getMonth() + 1) + "月" + fm(currentDate.getDate())+"日";
    }
    $('#renderRange').text(text);
    loadData();
}

function fm(n) {
    return n < 10 ? "0" + n : n;
}
function getFm(n) {
    return n < 10 ? "0" + n : n;
}



function getWeek(start) {
    start = start || 0;
    var day = currentDate.getDay() - start;
    var date = currentDate.getDate() - day;
    var StartDate = new Date(currentDate.setDate(date));
    var EndDate = new Date(StartDate.getTime() + (6 * 24 * 3600000));
    return [StartDate, EndDate];
}
function getParam() {
    var start = "";
    var end = "";
    if (viewName == 'month') {
        var firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        start = firstDate.getFullYear() + "-" + fm(firstDate.getMonth() + 1) + "-" + fm(firstDate.getDate());
        var lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        end = lastDate.getFullYear() + "-" + fm(lastDate.getMonth() + 1) + "-" + fm(lastDate.getDate());
    }
    if (viewName == 'week') {
        var week = getWeek();
        start = week[0].getFullYear() + "-" + fm(week[0].getMonth() + 1) + "-" + fm(week[0].getDate());
        end = week[1].getFullYear() + "-" + fm(week[1].getMonth() + 1) + "-" + fm(week[1].getDate());
    }
    if (viewName == 'day') {
        start = currentDate.getFullYear() + "-" + fm(currentDate.getMonth() + 1) + "-" + fm(currentDate.getDate());
        end = currentDate.getFullYear() + "-" + fm(currentDate.getMonth() + 1) + "-" + fm(currentDate.getDate());
    }
    return {
        "start": start,
        "end": end,
        "list": $('#example-post').val()
    }
}
// vẽ chart thời gian làm, ot
function drawChart1(dateArray) {
    $('#chart').html("")
    var listDate = [];
    var listwt = [];
    var litot = []
    var listhour = []
    dateArray.sort(function (a, b) {
        if (a.date < b.date) { return -1; }
        if (a.date > b.date) { return 1; }
        return 0;
    })
    for (let i = 0; i < dateArray.length; i++) {
        let date = dateArray[i].date;
        let list = date.split("-")
        listDate.push(list[2]);
        listwt.push(dateArray[i].workTime);
        litot.push(dateArray[i].overTime);
        listhour.push(dateArray[i].otHour)
    }
    var options = {
        series: [{
            name: '労働時間',
            data: listwt
        }, {
            name: '残業時間',
            data: litot
        }],
        legend: {
            show: false
        },
        chart: {
            height: 350,
            type: 'area',
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {

            categories: listDate
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        },
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}
async function viewDetail(chatworkid, dataStr, wt, ot, offtime) {
    var param = getParam();
    var timeSheetData = JSON.parse(dataStr);
    var start = new Date(param.start);
    var end = new Date(param.end);
    var detail = $('#detail');
    detail.html("");
    var thu = [
        "日", "月", "火", "水", "木", "金", "土"
    ];
    var body = {
        "app": 5017,
        "query": "chatworkid = \"" + chatworkid + "\"",
        "fields": ["$id", "staffname", "department", "starttime", "endtime"]
    };
    // thêm title thông tin nhân viên
    kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function (resp) {
        // success
        $("#title").html(resp.records[0].department.value + " -<span class='stn'> " + resp.records[0].staffname.value + "</span> (Chatwork ID︰ " + chatworkid + ")"
            + " - [" + resp.records[0].starttime.value + " ~ " + resp.records[0].endtime.value + "]")
    }, function (error) {
        // error
        console.log(error);
    });

    // add OffDay to timeSheetData
    var stDay = start.toISOString().substring(0, 10);
    var enDay = end.toISOString().substring(0, 10);


    var listHoliday = [];
    body = {
        app: 5073,
        query: ' date!=""',
        fields: ["description", "date"]
    };
    //------------------Danh sách ngày nghỉ ------------
    kintone.api(kintone.api.url("/k/v1/records", true), "GET", body, function (resp) {
        listHoliday = resp.records;
    });

    // thêm thông tin phụ
    var div = $('.infor');
    div.html("労働時間︰ " + wt + ", 残業時間︰ " + ot + ", 休憩時間︰ " + offtime)



    body = {
        app: 5016,
        query:
            'chatworkid="' +
            chatworkid +
            '" and date>="' +
            stDay +
            '" and date<="' +
            enDay +
            '" and Status ="Approved" order by date asc limit 100 offset 0',
        fields: ["$id", "date", "reason"],
    };
    //------------------Danh sách xin nghỉ của 1 nhân viên------------
    kintone.api(kintone.api.url("/k/v1/records", true), "GET", body, function (resp) {
        // gắn thêm ngày nghỉ vào data
        resp.records.forEach(item => {
            timeSheetData.push(item);
        })
        var index = 0;
        //for từ đầu ngày chọn đến cuối ngày chọn
        for (var daye = start; daye <= end; daye.setDate(daye.getDate() + 1)) {
            var tr = $('<tr></tr>');
            if ((daye.getDay()) == 6) {
                tr.addClass("sat");
            }
            if ((daye.getDay()) == 0) {
                tr.addClass("sun");
            }
            if (index % 2 == 0) {
                tr.addClass("even");
            }
            else {
                tr.addClass("odd");
            }
            index++;
            var check = false;
            var datec = daye.toISOString().substring(0, 10);
            if (listHoliday.length > 0) {
                listHoliday.forEach(item => {
                    // nếu là ngày nghỉ lễ
                    if (item.date.value == datec) {
                        tr.append($('<td class="first holiday">' + getFm(daye.getMonth() + 1) + "/" + getFm(daye.getDate()) + " (" + thu[daye.getDay()] + ") </br><span style='font-size:12px;color:red;'>(" + item.description.value + ')</span></td>'));
                        check = true;
                    }
                })
            }
            // không phải là ngày nghỉ lễ
            if (check == false)
                tr.append($('<td class="first">' + getFm(daye.getMonth() + 1) + "/" + getFm(daye.getDate()) + " (" + thu[daye.getDay()] + ")" + '</td>'));

            var obj = null;
            // nếu có data trong ngày thì gán data cho obj
            for (var x = 0; x < timeSheetData.length; x++) {
                var v1 = daye.getFullYear() + "-" + getFm(daye.getMonth() + 1) + "-" + getFm(daye.getDate());
                if (v1 === timeSheetData[x].date.value) {
                    obj = timeSheetData[x];
                    break;
                }
            }
            // có data 
            if (obj !== null) {
                // ngày xin nghỉ phép
                if (obj.reason != null) {

                    tr.append($('<td>' + `<span class="badge gradient-bloody text-white shadow">Off</span>` + '</td>'));
                    tr.append($('<td colspan ="5">' + obj.reason.value + '</td>'));


                    tr.append($('<td>' + '<i class="fa fa-pencil" aria-hidden="true"></i><i class="fa fa-save" style="display:none"></i>' + '</td>'));
                    tr.append($('<td style="display:none">' + obj.$id.value + '</td>'));
                }// làm việc bth
                else {
                    var otHour = 0;
                    var checkot = "";
                    var checkfull = "hidden";
                    var normal = "";
                    if (obj.overtime.value == null) {
                        obj.overtime.value = "00:00";
                        checkot = "hidden";
                    }
                    else {
                        var arrOt = obj.overtime.value.split(":");
                        otHour = ((parseInt(arrOt[0]) + parseInt(arrOt[1]) / 60) * obj.coefficient.value).toFixed(1);
                    }
                    console.log(obj.coefficient.value);
                    if (obj.starttime.value > obj.sessionbegintime.value || obj.endtime.value < obj.sessionendtime.value) {
                        checkfull = "";
                        normal = "hidden";
                    }
                    if (obj.worktime.value == null) {
                        obj.worktime.value = "00:00";
                    }
                    if (obj.endtime.value == null) {
                        obj.endtime.value = "00:00";
                    }
                    if (obj.starttime.value == null) {
                        obj.starttime.value = "00:00";
                    }
                    if (obj.breaktime.value == null) {
                        obj.breaktime.value = "00:00";
                    }

                    tr.append($('<td>' + `<span ` + normal + ` class="badge gradient-quepal text-white shadow">Normal</span>` + '&nbsp' +
                        `<span ` + checkfull + ` class="badge notfull text-white shadow">Not Full</span>` + '&nbsp' +
                        `<span  ` + checkot + `  class="badge gradient-blooker text-white shadow">OT</span>` + '</td>'));
                    tr.append($('<td>' + obj.starttime.value + '</td>'));
                    tr.append($('<td>' + obj.endtime.value + '</td>'));

                    tr.append($('<td>' + obj.breaktime.value + '</td>'));
                    tr.append($('<td>' + obj.worktime.value + '</td>'));
                    tr.append($('<td>' + obj.overtime.value + '</td>'));
                    tr.append($('<td hidden>' + otHour + '</td>'));
                    tr.append($('<td>' + '<i class="fa fa-pencil" aria-hidden="true"></i><i class="fa fa-save" style="display:none"></i>' + '</td>'));
                    tr.append($('<td style="display:none">' + obj.$id.value + '</td>'));
                    var otnew = obj.overtime.value;
                    var wtnew = obj.worktime.value;
                    var hour = 0;
                    var minute = 0;
                    if (otnew == null) {
                        otnew = "00:00";
                    }
                    if (wtnew == null) {
                        wtnew = "00:00";
                    }


                }

            } // không có data
            else {
                tr.append($('<td>' + `<span class="badge notset text-white shadow ">No Data</span>` + '</td>'))
                tr.append($('<td>' + '&nbsp&nbsp-&nbsp&nbsp' + '</td>'));
                tr.append($('<td>' + '&nbsp&nbsp-&nbsp&nbsp' + '</td>'));
                tr.append($('<td>' + '&nbsp&nbsp-&nbsp&nbsp' + '</td>'));
                tr.append($('<td>' + '&nbsp&nbsp-&nbsp&nbsp' + '</td>'));
                tr.append($('<td hidden>' + '&nbsp&nbsp-&nbsp&nbsp' + '</td>'));
                tr.append($('<td>' + '&nbsp&nbsp-&nbsp&nbsp' + '</td>'));
                tr.append($('<td></td>'));

            }






            detail.append(tr);




        }


        // nút chỉnh sửa
        $('td i.fa-pencil').off('click').on('click', function () {

            $tr = $(this).parents('tr');
            $id = $tr.find('td:last()');
            // nếu là ngày xin nghỉ
            if ($tr.find('td:nth-child(4)').text() == '') {
                $reason = $tr.find('td:nth-child(3)');
                var reasonVal = $.trim($reason.text());
                console.log(reasonVal);
                var $reasonInput = $('<textarea class="editText" style="width:600px"></textarea>');
                $reasonInput.val(reasonVal);
                $reason.html($reasonInput);

            }// ngày làm bth
            else {
                var $start = $tr.find('td:nth-child(3)');
                var $end = $tr.find('td:nth-child(4)');
                var startVal = $.trim($start.text());
                var endVal = $.trim($end.text());

                var $startInput = $('<input class="editText" />');
                var $endInput = $('<input class="editText" />');
                $startInput.val(startVal);
                $endInput.val(endVal);


                $start.html($startInput);
                $end.html($endInput);


            }



            $(this).hide();
            $(this).next('i.fa-save').show();
        });
        // nút lưu
        $('td i.fa-save').off('click').on('click', function () {
            $tr = $(this).parents('tr');
            $id = $tr.find('td:last()').text();
            console.log($tr.find('td:nth-child(4)').val());
            // ngày xin nghỉ
            if ($tr.find('td:nth-child(5)').text() == $id) {
                $reason = $tr.find('td:nth-child(3)');
                var reasonVal = $.trim($reason.find('textarea').val());
                $reason.html(reasonVal);
                var body = {
                    "app": 5016,
                    "id": $id,
                    "record": {
                        "reason": {
                            "value": reasonVal
                        }
                    }
                };

                kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', body, function (resp) {
                    // success
                    console.log(resp);
                }, function (error) {
                    // error
                    console.log(error);
                });



            }// ngày làm bth
            else {


                var $startDate = $tr.find('td:nth-child(3)');
                var $endDate = $tr.find('td:nth-child(4)');
                var startVal = $.trim($startDate.find('input').val());
                var endVal = $.trim($endDate.find('input').val());

                $startDate.html(startVal);
                $endDate.html(endVal);

                var body = {
                    "app": 5015,
                    "id": $id,
                    "record":
                    {
                        "starttime": {
                            "value": startVal
                        },
                        "endtime": {
                            "value": endVal
                        }
                    }
                }
                kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', body, function (resp) {
                    // success
                    console.log(resp);
                }, function (error) {
                    // error
                    console.log(error);
                });


            }
            $(this).hide();
            $(this).prev().show();

        });


    });


    $(".bd-example-modal-xl").modal('show');



}



// xuất data số giờ nghỉ
function getOffTime(chatworkid, start, end, tr) {
    var ttOffTime = 0;
    body = {
        "app": 5016,
        "query": "chatworkid=\"" + chatworkid + "\" and date>=\"" + start + "\" and date<=\"" + end + "\" and Status =\"Approved\" order by date asc limit 100 offset 0",
        "fields": ["$id", "Status", "date"]
    };
    //------------------Danh sách xin nghỉ của 1 nhân viên------------
    kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function (resp) {
        // successc
        var cout = resp.records.length;
        var body = {
            "app": 5017,
            "query": "chatworkid=\"" + chatworkid + "\"",
            "fields": ["$id", "sessionworkid"]
        };
        // ---------------------Ca làm việc của nhân viên-----------
        kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function (resp) {

            if (resp.records[0].sessionworkid.value == "1") {
                ttOffTime = 8 * cout;
            }
            else {
                ttOffTime = 4 * cout;




            }

            tr.find('.offtime').text(ttOffTime);

        });


    });

}
