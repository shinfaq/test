var currentDate = new Date();
var viewName = "month";
var listDepartment = [];
var dataAttendanceManagement = [];
var dataDepartmentMaster = [];
var dataHolidayMaster = [];
var dataStaffMaster = [];
var dataHolidayManagement = [];
var dataShiftMaster = [];
var coutStaff = [];
var totalStaff = 0;
var dataToExport = [];
var stt = 1;
var listAppId = {
    AttendanceManagement: "5015",
    DepartmentMaster: "5081",
    HolidayMaster: "5073",
    StaffMaster: "5017",
    HolidayManagement: "5016",
    ShiftMaster: "5013",
};
$(document).ready(function () {
    $('body').removeClass('body-top');
    getAllData();
    setTimeout(() => {
        setDefaults();
        drawChart2();
    }, 1000);


});
// lấy hết data của các app
async function getAllData() {
    fetchRecords(listAppId.AttendanceManagement).then(function (records) {
        dataAttendanceManagement = records;
    });
    fetchRecords(listAppId.ShiftMaster).then(function (records) {
        dataShiftMaster = records;
    });
    fetchRecords(listAppId.HolidayManagement).then(function (records) {
        dataHolidayManagement = records;
    });
    fetchRecords(listAppId.HolidayMaster).then(function (records) {
        dataHolidayMaster = records;
    });
    fetchRecords(listAppId.StaffMaster).then(function (records) {
        dataStaffMaster = records;
    });
    fetchRecords(listAppId.DepartmentMaster).then(function (records) {
        dataDepartmentMaster = records;
    })
}
function setDefaults() {
    $.datepicker.setDefaults({
        closeText: "閉じる",
        prevText: "&#x3C;前",
        nextText: "次&#x3E;",
        currentText: "今日",
        monthNames: ["1月", "2月", "3月", "4月", "5月", "6月",
            "7月", "8月", "9月", "10月", "11月", "12月"],
        monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月",
            "7月", "8月", "9月", "10月", "11月", "12月"],
        dayNames: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
        dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
        dayNamesMin: ["日", "月", "火", "水", "木", "金", "土"],
        weekHeader: "週",
        dateFormat: "yy/mm/dd",
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: "年"
    });

    var year = (new Date).getFullYear();
    $("#datePick").datepicker({
        changeMonth: true,
        changeYear: true,
        onSelect: function (date) {
            currentDate = new Date(date);
            setText();
        },
        maxDate: new Date(year, 11, 31)
    });

    $('.show-datePick').on('click', function () {
        $("#datePick").datepicker("show");
    });


    $('#menu-item input').on('click', onClickMenu);
    $('#menu-navi button').on('click', onClickMove);

    $('#example-post').html("");
    dataDepartmentMaster.forEach(item => {
        $option = $("<option></option>");
        $option.text(item.name.value);
        $option.attr("value", item.name.value);
        $('#example-post').append($option);
        listDepartment.push(item.name.value);
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
        onChange: function(option, checked, select, event) {
            loadData()
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
    setText();
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
function getWeek(start) {
    start = start || 0;
    var day = currentDate.getDay() - start;
    var date = currentDate.getDate() - day;
    var StartDate = new Date(currentDate.setDate(date));
    var EndDate = new Date(StartDate.getTime() + (6 * 24 * 3600000));
    return [StartDate, EndDate];
}
function setText() {
    var text = "";
    if (viewName == 'month') {
        text = currentDate.getFullYear() + "年" + fm(currentDate.getMonth() + 1) + "月";
    }
    if (viewName == 'week') {
        var week = getWeek();
        var start = week[0].getFullYear() + "年" + fm(week[0].getMonth() + 1) + "月" + fm(week[0].getDate()) + "日";
        var end = week[1].getFullYear() + "年" + fm(week[1].getMonth() + 1) + "月" + fm(week[1].getDate()) + "日";
        text = start + "～" + end;
    }
    if (viewName == 'day') {
        text = currentDate.getFullYear() + "年" + fm(currentDate.getMonth() + 1) + "月" + fm(currentDate.getDate()) + "日";
    }
    $('#renderRange').text(text);
    loadData();
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
function fm(n) {
    return n < 10 ? "0" + n : n;
}
function fetchRecords(appId, opt_offset, opt_limit, opt_records) {
    var offset = opt_offset || 0;
    var limit = opt_limit || 100;
    var allRecords = opt_records || [];
    var params = { app: appId, query: 'limit ' + limit + ' offset ' + offset };
    return kintone.api('/k/v1/records', 'GET', params).then(function (resp) {
        allRecords = allRecords.concat(resp.records);
        if (resp.records.length === limit) {
            return fetchRecords(appId, offset + limit, limit, allRecords);
        }
        return allRecords;
    });
}
function checkExistDate(list, date, workTime, overTime) {
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
        });
    } else {
        list[indexFound].workTime += workTime;
        list[indexFound].overTime += overTime;
    }

}
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
function drawChart2() {
    var options2 = {
        series: coutStaff,
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: listDepartment,
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
    var chart2 = new ApexCharts(document.querySelector("#chart2"), options2);
    chart2.render();
}
function loadData() {
    dataToExport = [];
    $("#showRecord").html('');
    var listStaff = [];
    var param = getParam();
    var startDate = new Date(param.start);
    var endDate = new Date(param.end);
    var dateArray = [];
    var departments = (param.list.length == 0) ? listDepartment : param.list;
    var totalOffTimeA = 0;
    var totalOffTimeB = 0;
    var totalWorkTime = 0;
    var totalOverTime = 0;
    $('.gaia-argoui-app-index-pager-content').hide();
    $("#showRecord").html("");
    $('.totalStaff').text("0人");
    $(".totalOffTime").text(0 + "時間-" + 0 + "時間");
    $(".totalWorkTime").text(0 + "時間");
    $(".totalOverTime").text(0 + "時間");
    departments.forEach(dep => {
        dataStaffMaster.forEach(staff => {
            if (staff.department.value == dep)
                listStaff.push(staff.chatworkid.value);
        });
    });
    listDepartment.forEach(item => {
        let i = 0;
        dataStaffMaster.forEach(staff => {
            if (staff.department.value == item) {
                i++;
            }
        })
        coutStaff.push(i);
    })

    var index = 0;
    totalStaff = listStaff.length;
    $('.totalStaff').text(totalStaff + "人");
    listStaff.forEach(staff => {
        var dataToExportStaff = [];
        var rc = "even";
        if (index % 2 == 0) {
            rc = "odd";
        }
        index++;
        var tr = $('<tr></tr>');
        tr.addClass(rc);
        var staffAttendanceData = [];
        var staffLeaveOffData = [];
        var staffInfo = null;
        var stafflWorkTime = 0;
        var staffOT = 0;
        var staffShift = 0;
        var staffOffTime = 0;
        dataStaffMaster.forEach(item => {
            if (item.chatworkid.value == staff)
                staffInfo = item;
        });
        var staffShiftEndStr = staffInfo.endtime.value;
        var staffShiftStartStr = staffInfo.starttime.value;
        var arrStart = staffShiftStartStr.split(":");
        var startShift = parseInt(arrStart[0]) + parseInt(arrStart[1]) / 60;
        var arrEnd = staffShiftEndStr.split(":");
        var endShitf = parseInt(arrEnd[0]) + parseInt(arrEnd[1]) / 60;
        staffShift = (endShitf - startShift) > 8 ? 8 : (endShitf - startShift);
        dataAttendanceManagement.forEach(item => {
            var itemWorkTime = 0;
            var itemOT = 0;
            var itemDate = new Date(item.date.value)
            if ((item.chatworkid.value == staff) && (itemDate >= startDate) && (itemDate <= endDate)) {
                dataToExportStaff.push({
                    stt: stt,
                    chatworkid: staffInfo.chatworkid.value,
                    date: item.date.value,
                    staffname: staffInfo.staffname.value,
                    department: staffInfo.department.value,
                    sessionbegintime: staffInfo.starttime.value,
                    sessionendtime: staffInfo.endtime.value,
                    starttime: item.starttime.value,
                    endtime: item.endtime.value,
                    worktime: item.worktime.value,
                    overtime: item.overtime.value ? item.overtime.value : "",
                    reason: "",
                    offType: "",
                    startOff: "",
                    endOff: "",
                })
                stt++
                staffAttendanceData.push(item);
                let strWorkTime = item.worktime.value;
                let listWorkTime = strWorkTime.split(":");
                itemWorkTime = parseInt(listWorkTime[0]) + parseInt(listWorkTime[1]) / 60;
                if (item.overtime.value != null) {
                    let strOT = item.overtime.value;
                    let listOT = strOT.split(":");
                    itemOT = parseInt(listOT[0]) + parseInt(listOT[1]) / 60;
                }
                checkExistDate(dateArray, item.date.value, itemWorkTime, itemOT);
            }

            stafflWorkTime += itemWorkTime;
            staffOT += itemOT
        })
        dataHolidayManagement.forEach(item => {
            var itemDate = new Date(item.date.value)
            if ((item.chatworkid.value == staff) && (itemDate >= startDate) && (itemDate <= endDate)) {
                dataToExportStaff.push({
                    stt: stt,
                    chatworkid: staffInfo.chatworkid.value,
                    date: item.date.value,
                    staffname: staffInfo.staffname.value,
                    department: staffInfo.department.value,
                    sessionbegintime: staffInfo.starttime.value,
                    sessionendtime: staffInfo.endtime.value,
                    starttime: "",
                    endtime: "",
                    worktime: "",
                    overtime: "",
                    reason: item.reason.value,
                    offType: "",
                    startOff: "",
                    endOff: "",
                })
                stt++
                staffLeaveOffData.push(item)
            }

        })
        staffLeaveOffData.forEach(item => {
            if (item.Status.value == "Approved")
                totalOffTimeA += staffShift;
            else
                totalOffTimeB += staffShift;
        })
        staffOffTime = staffLeaveOffData.length * staffShift;
        totalWorkTime += stafflWorkTime;
        totalOverTime += staffOT;
        if (staffOffTime == 0)
            staffOffTime = "-";
        if (staffOT == 0)
            staffOT = "-"
        if (staffAttendanceData.length != 0) {
            tr.append($(`<td style="text-align:left;" class="stn">` + staffInfo.staffname.value + '</td>'));
            tr.append($('<td>' + staffInfo.department.value + '</td>'));
            tr.append($('<td class="wt">' + stafflWorkTime + '</td>'));
            tr.append($('<td class="ot">' + staffOT + '</td>'));
            tr.append($('<td class="offtime">' + staffOffTime + '</td>'));
            tr.append($(`<td class=\"chatworkid\" chatworkid=\"` + staffInfo.chatworkid.value + `\" ><i class="fas fa-eye"></i> </td>`));
            tr.append($(`<td><button class="btn" onClick="downloadStaff(`+staffInfo.chatworkid.value +`)"><i class="fas fa-file-csv"></i></button></td>`))
        }
        else {
            tr.append($(`<td style="text-align:left;" class="stn">` + staffInfo.staffname.value + '</td>'));
            tr.append($('<td>' + staffInfo.department.value + '</td>'));
            tr.append($('<td class="wt">&nbsp-&nbsp</td>'));
            tr.append($('<td class="ot">&nbsp-&nbsp</td>'));
            tr.append($('<td class="offtime">' + staffOffTime + '</td>'));
            tr.append($(`<td class=\"chatworkid\" chatworkid=\"` + staffInfo.chatworkid.value + `\" ><i class="fas fa-eye"></i> </td>`));
            tr.append($(`<td><button class="btn" onClick="downloadStaff(`+staffInfo.chatworkid.value +`)"><i class="fas fa-file-csv"></i></button></td>`))
        }
        $('.fa-eye').off('click').on('click', function () {
            var chatworkid = $(this).parent('.chatworkid').attr('chatworkid');
            var ot = $(this).parents('tr').find(".ot").text();
            var wt = $(this).parents('tr').find(".wt").text();
            var offtime = $(this).parents('tr').find(".offtime").text();
            viewDetail(chatworkid, wt, ot, offtime);
        });
        $(".totalWorkTime").text(totalWorkTime + "時間")
        $(".totalOverTime").text(totalOverTime + "時間")
        $(".totalOffTime").text(totalOffTimeA + "時間-" + totalOffTimeB + "時間");
        $tb = $("#showRecord");
        $tb.append(tr);
        dataToExportStaff.sort((a, b) => {
            if (a.date > b.date)
                return 1;
            else
                return -1
        });
        dataToExport = dataToExport.concat(dataToExportStaff);

    });
    drawChart1(dateArray);
}
function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function download() {
    var param = getParam();
    var startDate = param.start;
    var endDate = param.end;
    var departments = (param.list.length == 0) ? listDepartment : param.list;
    var headers = {
        stt: 'STT',
        chatworkid: 'chatworkid',
        date: 'date',
        staffname: 'staffname',
        department: 'department',
        sessionbegintime: 'sessionbegintime',
        sessionendtime: 'sessionendtime',
        starttime: 'starttime',
        endtime: 'endtime',
        worktime: 'worktime',
        overtime: 'overtime',
        reason: "reason",
        offType: "offType",
        startOff: "startOff",
        endOff: "startOff",
    };
    var fileTitle = 'Report_'+startDate+"-"+endDate+"_"+departments;

    exportCSVFile(headers, dataToExport, fileTitle);
}
function downloadStaff(chatworkid){
    var st = 1;
    var param = getParam();
    var startDate = new Date(param.start);
    var endDate = new Date(param.end);
    var dataExport = []
    var staffInfo = null;
    dataStaffMaster.forEach(item => {
        if (item.chatworkid.value == chatworkid)
            staffInfo = item;
    });
    dataAttendanceManagement.forEach(item => {
        var itemDate = new Date(item.date.value)
        if ((item.chatworkid.value == chatworkid) && (itemDate >= startDate) && (itemDate <= endDate)) {
            dataExport.push({
                stt:'',
                chatworkid: staffInfo.chatworkid.value,
                date: item.date.value,
                staffname: staffInfo.staffname.value,
                department: staffInfo.department.value,
                sessionbegintime: staffInfo.starttime.value,
                sessionendtime: staffInfo.endtime.value,
                starttime: item.starttime.value,
                endtime: item.endtime.value,
                worktime: item.worktime.value,
                overtime: item.overtime.value ? item.overtime.value : "",
                reason: "",
                offType: "",
                startOff: "",
                endOff: "",
            })
        }
    })
    dataHolidayManagement.forEach(item => {
        var itemDate = new Date(item.date.value)
        if ((item.chatworkid.value == chatworkid) && (itemDate >= startDate) && (itemDate <= endDate)) {
            dataExport.push({
                stt:'',
                chatworkid: staffInfo.chatworkid.value,
                date: item.date.value,
                staffname: staffInfo.staffname.value,
                department: staffInfo.department.value,
                sessionbegintime: staffInfo.starttime.value,
                sessionendtime: staffInfo.endtime.value,
                starttime: "",
                endtime: "",
                worktime: "",
                overtime: "",
                reason: item.reason.value,
                offType: "",
                startOff: "",
                endOff: "",
            })
        }

    })
    dataExport.sort((a, b) => {
        if (a.date > b.date)
            return 1;
        else
            return -1
    });
    dataExport.forEach(item =>{
        item.stt = st;
        st++;
    })
    var headers = {
        stt: 'STT',
        chatworkid: 'chatworkid',
        date: 'date',
        staffname: 'staffname',
        department: 'department',
        sessionbegintime: 'sessionbegintime',
        sessionendtime: 'sessionendtime',
        starttime: 'starttime',
        endtime: 'endtime',
        worktime: 'worktime',
        overtime: 'overtime',
        reason: "reason",
        offType: "offType",
        startOff: "startOff",
        endOff: "startOff",
    };
    var fileTitle = 'Report_'+param.start+"-"+param.end+"_"+staffInfo.staffname.value;

    exportCSVFile(headers, dataExport, fileTitle);
}
function viewDetail(chatworkid, wt, ot, offtime) {

    var param = getParam();

    var attendanceData = [];
    var leaveOffData = [];
    var start = new Date(param.start);
    var end = new Date(param.end);
    var staffInfo = null;
    dataStaffMaster.forEach(item => {
        if (item.chatworkid.value == chatworkid)
            staffInfo = item;
    });
    dataAttendanceManagement.forEach(item => {
        var itemDate = new Date(item.date.value)
        if ((item.chatworkid.value == chatworkid) && (itemDate >= start) && (itemDate <= end)) {
            attendanceData.push(item);
        }
    })
    dataHolidayManagement.forEach(item => {
        var itemDate = new Date(item.date.value)
        if ((item.chatworkid.value == chatworkid) && (itemDate >= start) && (itemDate <= end))
            leaveOffData.push(item)
    })
    var detail = $('#detail');
    detail.html("");
    var thu = [
        "日", "月", "火", "水", "木", "金", "土"
    ];
    $("#title").html(staffInfo.department.value + " -<span class='stn'> " + staffInfo.staffname.value + "</span> (Chatwork ID︰ " + chatworkid + ")"
        + " - [" + staffInfo.starttime.value + " ~ " + staffInfo.endtime.value + "]")

    // add OffDay to timeSheetData
    var stDay = start.toISOString().substring(0, 10);
    var enDay = end.toISOString().substring(0, 10);
    // thêm thông tin phụ
    var div = $('.infor');
    div.html("労働時間︰ " + wt + ", 残業時間︰ " + ot + ", 休憩時間︰ " + offtime)


    var index = 0;
    for (var daye = start; daye <= end; daye.setDate(daye.getDate() + 1)) {
        var tr = $('<div class="row divEdit" style="height: 40px;"></div>');
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
        if (dataHolidayMaster.length > 0) {
            dataHolidayMaster.forEach(item => {
                // nếu là ngày nghỉ lễ
                if (item.date.value == datec) {
                    tr.append($('<div class="first holiday col-md-2 col-sm-6">' + fm(daye.getMonth() + 1) + "/" + fm(daye.getDate()) + " (" + thu[daye.getDay()] + ") </br><span style='font-size:12px;color:red;'>(" + item.description.value + ')</span></td>'));
                    check = true;
                }
            })
        }
        // không phải là ngày nghỉ lễ
        if (check == false)
            tr.append($('<div class="first col-md-2 col-sm-6">' + fm(daye.getMonth() + 1) + "/" + fm(daye.getDate()) + " (" + thu[daye.getDay()] + ")" + '</div>'));

        var obj = null;
        // nếu có data trong ngày thì gán data cho obj
        for (var x = 0; x < attendanceData.length; x++) {
            var v1 = daye.getFullYear() + "-" + fm(daye.getMonth() + 1) + "-" + fm(daye.getDate());
            if (v1 === attendanceData[x].date.value) {
                obj = attendanceData[x];
                break;
            }
        }
        for (var x = 0; x < leaveOffData.length; x++) {
            var v1 = daye.getFullYear() + "-" + fm(daye.getMonth() + 1) + "-" + fm(daye.getDate());
            if (v1 === leaveOffData[x].date.value) {
                obj = leaveOffData[x];
                break;
            }
        }
        // có data 
        if (obj !== null) {
            // ngày xin nghỉ phép
            if (obj.reason != null) {

                tr.append($('<div class="col-md-2 col-sm-6">' + `<span class="badge gradient-bloody text-white shadow">Off</span>` + '</div>'));
                tr.append($('<div class="reason col-md-7 col-sm-10">' + obj.reason.value + '</div>'));
                tr.append($('<div class="col-md-1 col-sm-2">' + '<i class="fa fa-pencil" aria-hidden="true"></i><i class="fa fa-save" style="display:none"></i>' + '</div>'));
                tr.append($('<div style="display:none">' + obj.$id.value + '</div>'));
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

                tr.append($('<div class="col-md-2 col-sm-6">' + `<span ` + normal + ` class="badge gradient-quepal text-white shadow">Normal</span>` + '&nbsp' +
                    `<span ` + checkfull + ` class="badge notfull text-white shadow">Not Full</span>` + '&nbsp' +
                    `<span  ` + checkot + `  class="badge gradient-blooker text-white shadow">OT</span>` + '</div>'));
                tr.append($('<div class="startTime col-md-2 col-sm-6">' + obj.starttime.value + '</div>'));
                tr.append($('<div class="endTime col-md-2 col-sm-6">' + obj.endtime.value + '</div>'));
                tr.append($('<div class="col-md-1 col-sm-3">' + obj.breaktime.value + '</div>'));
                tr.append($('<div class="col-md-1 col-sm-3">' + obj.worktime.value + '</div>'));
                tr.append($('<div class="col-md-1 col-sm-3">' + obj.overtime.value + '</div>'));
                tr.append($('<div class="col-md-1 col-sm-3">' + '<i class="fa fa-pencil" aria-hidden="true"></i><i class="fa fa-save" style="display:none"></i>' + '</div>'));
                tr.append($('<div style="display:none">' + obj.$id.value + '</div>'));
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
            tr.append($('<div class="col-md-2 col-sm-6">' + `<span class="badge notset text-white shadow ">No Data</span>` + '</div>'))
            tr.append($('<div class="col-md-2 col-sm-6">' + '&nbsp&nbsp-&nbsp&nbsp' + '</div>'));
            tr.append($('<div class="col-md-2 col-sm-6">' + '&nbsp&nbsp-&nbsp&nbsp' + '</div>'));
            tr.append($('<div class="col-md-1 col-sm-3">' + '&nbsp&nbsp-&nbsp&nbsp' + '</div>'));
            tr.append($('<div class="col-md-1 col-sm-3">' + '&nbsp&nbsp-&nbsp&nbsp' + '</div>'));
            tr.append($('<div class="col-md-1 col-sm-3">' + '&nbsp&nbsp-&nbsp&nbsp' + '</div>'));
            tr.append($('<div class="col-md-1 col-sm-3"></div>'));
            tr.append($('<div style="display:none"></div>'));

        }






        detail.append(tr);




    }


    // nút chỉnh sửa
    $('div i.fa-pencil').off('click').on('click', function () {

        $tr = $(this).parents('.divEdit');
        $id = $tr.find('div:last()').text();
        // nếu là ngày xin nghỉ
        if ($tr.find('div:nth-child(5)').text() == $id) {
            $reason = $tr.find('.reason');
            var reasonVal = $.trim($reason.text());
            var $reasonInput = $('<textarea class="editText reason" ></textarea>');
            $reasonInput.val(reasonVal);
            $reason.html($reasonInput);

        }// ngày làm bth
        else {
            var $start = $tr.find('.startTime');
            var $end = $tr.find('.endTime');
            var startVal = $.trim($start.text());
            var endVal = $.trim($end.text());

            var $startInput = $('<input class="editText startTime" />');
            var $endInput = $('<input class="editText endTime" />');
            $startInput.val(startVal);
            $endInput.val(endVal);


            $start.html($startInput);
            $end.html($endInput);


        }



        $(this).hide();
        $(this).next('i.fa-save').show();
    });
    // nút lưu
    $('div i.fa-save').off('click').on('click', function () {
        $tr = $(this).parents('.divEdit');
        $id = $tr.find('div:last()').text();
        // ngày xin nghỉ
        if ($tr.find('div:nth-child(5)').text() == $id) {
            $reason = $tr.find('.reason');
            var reasonVal = $.trim($reason.find('textarea').val());
            $reason.html(reasonVal);
            var body = {
                "app": listAppId.HolidayManagement,
                "id": $id,
                "record": {
                    "reason": {
                        "value": reasonVal
                    }
                }
            };
            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', body, function (resp) {
            });
        }// ngày làm bth
        else {
            var $startDate = $tr.find('.startTime');
            var $endDate = $tr.find('.endTime');
            var startVal = $.trim($startDate.find('input').val());
            var endVal = $.trim($endDate.find('input').val());
            $startDate.html(startVal);
            $endDate.html(endVal);
            var body = {
                "app": listAppId.AttendanceManagement,
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
            });
        }
        $(this).hide();
        $(this).prev().show();
    });
    $(".bd-example-modal-xl").modal('show');

}
