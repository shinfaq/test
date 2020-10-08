var currentDate2 = new Date();
var listId = Object.keys(cybozu.data.page.FORM_DATA.schema.table.fieldList)
$(document).ready(function () {
    if (cybozu.data['LOGIN_USER'].locale == 'en') {
        var listText = [
            'レコード番号',
            "Updated by",
            "Created by",
            "Updated datetime",
            "Created datetime",
            "Status",
            "Assignee",
            "Categories",
            'Chatwork ID',
            '日付',
            '社員名',
            '出勤時刻',
            "退勤時刻",
            "労働時間",
            "休憩開始時刻",
            "休憩終了時刻",
            "休憩時間",
            "開始時刻",
            "終了時刻",
            "残業時間",
            "Coefficient OT",
            "SalaryHour",
            "Department",
            "スタッフ情報",
            "出席情報",
            "Field group",
        ];
        for (let i = 0; i < listId.length; i++) {
            let lb = ".label-" + listId[i];
            $(lb).find(".recordlist-header-label-gaia").text(listText[i])
        }
        $(".condition").text("検索条件");
        $(".dpm").text("部門");
        $(".ttReport").text("レポート");
        $(".opt1").text("日");
        $(".opt2").text("週");
        $(".opt3").text("月");
        $(".move-today").text("今日");
        $(".staff").text("社員");
        $(".ttw").text("労働時間の合計");
        $(".ttot").text("残業時間の合計");
        $(".ttoff").text("休憩時間の合計");
        $(".charttime").text("タイムチャート");
        $(".charttimework").text("労働");
        $(".charttimeot").text("残業");
        $(".chartdpm").text("スタッフチャート");
        $(".liststaff").text("社員一覧");
        $(".p4name").text("社員名");
        $(".p4dpm").text("部門");
        $(".p4wt").text("労働時間");
        $(".p4ot").text("残業時間");
        $(".p4off").text("休憩時間");
        $(".mdday").text("日付");
        $(".mdtype").text("タグ");
        $(".mdstart").text("出勤時刻");
        $(".mdend").text("退勤時刻");
        $(".mdrest").text("休憩時間");
        $(".mdwork").text("労働時間");
        $(".mdot").text("残業時間");
        datepickerText = {
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
            yearSuffix: "年"
        }
        txtDay = "日";
        txtYear = "年";
        txtMonth = "月";
        txtChart1 = "労働時間";
        txtChart2 = "残業時間";
        txtPeople = "人";
        txtHour = "時間";
        txtTtOff = "休憩時間";
        thu = [
            "日", "月", "火", "水", "木", "金", "土"
        ];
        $('.txtSearch').text("探す")
        $('.mdReason').text("理由")
        $('.dlcsv').text("csv")
        $('.download').text("エクスポート");
        $('.detail').text("詳細")
    }
    if (cybozu.data['LOGIN_USER'].locale == 'ja') {
        var listText = [
            'レコード番号(jp)',
            "Updated by(jp)",
            "Created by(jp)",
            "Updated datetime(jp)",
            "Created datetime(jp)",
            "Status(jp)",
            "Assignee(jp)",
            "Categories(jp)",
            'Chatwork ID(jp)',
            '日付(jp)',
            '社員名(jp)',
            '出勤時刻(jp)',
            "退勤時刻(jp)",
            "労働時間(jp)",
            "休憩開始時刻(jp)",
            "休憩終了時刻(jp)",
            "休憩時間(jp)",
            "開始時刻(jp)",
            "終了時刻(jp)",
            "残業時間(jp)",
            "Coefficient OT(jp)",
            "SalaryHour(jp)",
            "Department(jp)",
            "スタッフ情報(jp)",
            "出席情報(jp)",
            "Field group(jp)",
        ]
        for (let i = 0; i < listId.length; i++) {
            let lb = ".label-" + listId[i];
            $(lb).find(".recordlist-header-label-gaia").text(listText[i])
        }
        $(".condition").text("検索条件(jp)");
        $(".dpm").text("部門(jp)");
        $(".ttReport").text("レポート(jp)");
        $(".opt1").text("日");
        $(".opt2").text("週");
        $(".opt3").text("月");
        $(".move-today").text("今日(jp)");
        $(".staff").text("社員(jp)");
        $(".ttw").text("労働時間の合計(jp)");
        $(".ttot").text("残業時間の合計(jp)");
        $(".ttoff").text("休憩時間の合計(jp)");
        $(".charttime").text("タイムチャート(jp)");
        $(".charttimework").text("労働(jp)");
        $(".charttimeot").text("残業(jp)");
        $(".chartdpm").text("スタッフチャート(jp)");
        $(".liststaff").text("社員一覧(jp)");
        $(".p4name").text("社員名(jp)");
        $(".p4dpm").text("部門(jp)");
        $(".p4wt").text("労働時間(jp)");
        $(".p4ot").text("残業時間(jp)");
        $(".p4off").text("休憩時間(jp)");
        $(".mdday").text("日付(jp)");
        $(".mdtype").text("タグ(jp)");
        $(".mdstart").text("出勤時刻(jp)");
        $(".mdend").text("退勤時刻(jp)");
        $(".mdrest").text("休憩時間(jp)");
        $(".mdwork").text("労働時間(jp)");
        $(".mdot").text("残業時間(jp)");
        datepickerText = {
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
            yearSuffix: "年"
        }
        txtDay = "日";
        txtYear = "年";
        txtMonth = "月";
        txtChart1 = "労働時間";
        txtChart2 = "残業時間";
        txtPeople = "人";
        txtHour = "時間(jp)";
        txtTtOff = "休憩時間(jp)";
        thu = [
            "日", "月", "火", "水", "木", "金", "土"
        ];
        $('.txtSearch').text("探す(jp)")
        $('.mdReason').text("理由(jp)")
        $('.dlcsv').text("csv(jp)")
        $('.download').text("エクスポート(jp)");
        $('.detail').text("詳細(jp)")
    }
    interval2 = setInterval(() => {
        if (ready1 && ready2 && ready3 && ready4 && ready5) {
            $('#loading').hide();
            clearInterval(interval2);
            clearInterval(interval);
            setDefault2();
            setText2();
        }
    }, 100);

    $('body').removeClass('body-top');
});
function getParam2() {
    var start = "";
    var end = "";
    if (viewName == "month") {
        var firstDate = new Date(
            currentDate2.getFullYear(),
            currentDate2.getMonth(),
            1
        );
        start =
            firstDate.getFullYear() +
            "-" +
            fm(firstDate.getMonth() + 1) +
            "-" +
            fm(firstDate.getDate());
        var lastDate = new Date(
            currentDate2.getFullYear(),
            currentDate2.getMonth() + 1,
            0
        );
        end =
            lastDate.getFullYear() +
            "-" +
            fm(lastDate.getMonth() + 1) +
            "-" +
            fm(lastDate.getDate());
    }
    if (viewName == "week") {
        var week = getWeek();
        start =
            week[0].getFullYear() +
            "-" +
            fm(week[0].getMonth() + 1) +
            "-" +
            fm(week[0].getDate());
        end =
            week[1].getFullYear() +
            "-" +
            fm(week[1].getMonth() + 1) +
            "-" +
            fm(week[1].getDate());
    }
    if (viewName == "day") {
        start =
            currentDate2.getFullYear() +
            "-" +
            fm(currentDate2.getMonth() + 1) +
            "-" +
            fm(currentDate2.getDate());
        end =
            currentDate2.getFullYear() +
            "-" +
            fm(currentDate2.getMonth() + 1) +
            "-" +
            fm(currentDate2.getDate());
    }
    return {
        start: start,
        end: end,
        list: $("#brandsMulti").val(),
    };
}
function setDefault2() {
    var year = new Date().getFullYear();
    $("#datePickcc").datepicker({
        changeMonth: true,
        changeYear: true,
        onSelect: function (date) {
            currentDate2 = new Date(date);
            setText2();
        },
        maxDate: new Date(year, 11, 31),
    });
    $(".show-datePickcc").on("click", function () {
        $("#datePickcc").datepicker("show");
    });
    $("#menu-navicc button").on("click", onClickMove2);
    $("#menu-itemcc input").on("click", onClickMenu2);
    let select2 = document.getElementById("brandsMulti");
    dataDepartmentMaster.forEach((item) => {
        var option = document.createElement("option");
        option.value = item.name.value
        option.text = item.name.value
        select2.appendChild(option);
    });
    let cccc = new vanillaSelectBox("#brandsMulti");
    setText2();
}
function setText2() {
    var text = "";
    if (viewName == "month") {
        text =
            currentDate2.getFullYear() +
            "年" +
            fm(currentDate2.getMonth() + 1) +
            "月";
    }
    if (viewName == "week") {
        var week = getWeek();
        var start =
            week[0].getFullYear() +
            "年" +
            fm(week[0].getMonth() + 1) +
            "月" +
            fm(week[0].getDate()) +
            "日";
        var end =
            week[1].getFullYear() +
            "年" +
            fm(week[1].getMonth() + 1) +
            "月" +
            fm(week[1].getDate()) +
            "日";
        text = start + "～" + end;
    }
    if (viewName == "day") {
        text =
            currentDate2.getFullYear() +
            "年" +
            fm(currentDate2.getMonth() + 1) +
            "月" +
            fm(currentDate2.getDate()) +
            "日";
    }
    $("#dateRange").text(text);
    loadData2();
}
function onClickMove2(e) {
    var action = $(this).attr("data-action");
    if (action == "show-pick") {
        return false;
    }
    if (action == "move-next") {
        if (viewName == "month") {
            currentDate2.setMonth(currentDate2.getMonth() + 1);
        }
        if (viewName == "week") {
            currentDate2.setTime(currentDate2.getTime() + 7 * 24 * 3600000);
        }
        if (viewName == "day") {
            currentDate2.setTime(currentDate2.getTime() + 1 * 24 * 3600000);
        }
    }
    if (action == "move-prev") {
        if (viewName == "month") {
            currentDate2.setMonth(currentDate2.getMonth() - 1);
        }
        if (viewName == "week") {
            currentDate2.setTime(currentDate2.getTime() - 7 * 24 * 3600000);
        }
        if (viewName == "day") {
            currentDate2.setTime(currentDate2.getTime() - 1 * 24 * 3600000);
        }
    }
    if (action == "move-today") {
        currentDate2 = new Date();
    }
    setText2();
}
function onClickMenu2(e) {
    var action = $(this).attr("data-action");
    switch (action) {
        case "toggle-daily":
            viewName = "day";
            break;
        case "toggle-weekly":
            viewName = "week";
            break;
        case "toggle-monthly":
            viewName = "month";
            break;
        default:
            break;
    }
    currentDate2 = new Date();
    setText2();
}
function download2() {
    var param = getParam2();
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
    var fileTitle = 'Report_' + startDate + "-" + endDate + "_" + departments;

    exportCSVFile(headers, dataToExport, fileTitle);
}
function downloadStaff2(chatworkid) {
    var st = 1;
    var param = getParam2();
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
                stt: '',
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
                stt: '',
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
    dataExport.forEach(item => {
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
    var fileTitle = 'Report_' + param.start + "-" + param.end + "_" + staffInfo.staffname.value;

    exportCSVFile(headers, dataExport, fileTitle);
}
function loadData2() {
    dataToExport = [];
    $("#showRecord2").html("");
    var listStaff2 = [];
    var param = getParam2();
    var startDate = new Date(param.start);
    var endDate = new Date(param.end);
    var dateArray = [];
    var departments = param.list.length == 0 ? listDepartment : param.list;
    var totalOffTimeA = 0;
    var totalOffTimeB = 0;
    var totalWorkTime = 0;
    var totalOverTime = 0;
    $(".gaia-argoui-app-index-pager-content").hide();
    $("#showRecord2").html("");
    $(".totalStaff").text("0" + txtPeople);
    $(".totalOffTime").text(0 + txtHour + "-" + 0 + txtHour);
    $(".totalWorkTime").text(0 + txtHour);
    $(".totalOverTime").text(0 + txtHour);
    departments.forEach((dep) => {
        dataStaffMaster.forEach((staff) => {
            if (staff.department.value == dep)
                listStaff2.push(staff.chatworkid.value);
        });
    });
    var index = 0;
    listStaff2.forEach((staff) => {
        var dataToExportStaff = [];
        var rc = "even";
        if (index % 2 == 0) {
            rc = "odd";
        }
        index++;
        var tr = $("<div class='row data'></div>");
        tr.addClass(rc);
        var staffAttendanceData = [];
        var staffLeaveOffData = [];
        var staffInfo = null;
        var stafflWorkTime = 0;
        var staffOT = 0;
        var staffShift = 0;
        var staffOffTime = 0;
        dataStaffMaster.forEach((item) => {
            if (item.chatworkid.value == staff) staffInfo = item;
        });
        var staffShiftEndStr = staffInfo.endtime.value;
        var staffShiftStartStr = staffInfo.starttime.value;
        var arrStart = staffShiftStartStr.split(":");
        var startShift = parseInt(arrStart[0]) + parseInt(arrStart[1]) / 60;
        var arrEnd = staffShiftEndStr.split(":");
        var endShitf = parseInt(arrEnd[0]) + parseInt(arrEnd[1]) / 60;
        staffShift = endShitf - startShift > 8 ? 8 : endShitf - startShift;
        dataAttendanceManagement.forEach((item) => {
            var itemWorkTime = 0;
            var itemOT = 0;
            var itemDate = new Date(item.date.value);
            if (
                item.chatworkid.value == staff &&
                itemDate >= startDate &&
                itemDate <= endDate
            ) {
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
                stt++;
                staffAttendanceData.push(item);
                let strWorkTime = item.worktime.value;
                let listWorkTime = strWorkTime.split(":");
                itemWorkTime =
                    parseInt(listWorkTime[0]) + parseInt(listWorkTime[1]) / 60;
                if (item.overtime.value != null) {
                    let strOT = item.overtime.value;
                    let listOT = strOT.split(":");
                    itemOT = parseInt(listOT[0]) + parseInt(listOT[1]) / 60;
                }
                checkExistDate(
                    dateArray,
                    item.date.value,
                    itemWorkTime,
                    itemOT
                );
            }

            stafflWorkTime += itemWorkTime;
            staffOT += itemOT;
        });
        dataHolidayManagement.forEach((item) => {
            var itemDate = new Date(item.date.value);
            if (
                item.chatworkid.value == staff &&
                itemDate >= startDate &&
                itemDate <= endDate
            ) {
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
                stt++;
                staffLeaveOffData.push(item);
            }
        });
        staffLeaveOffData.forEach((item) => {
            if (item.Status.value == "Approved") totalOffTimeA += staffShift;
            else totalOffTimeB += staffShift;
        });
        staffOffTime = staffLeaveOffData.length * staffShift;
        totalWorkTime += stafflWorkTime;
        totalOverTime += staffOT;
        if (staffOffTime == 0) staffOffTime = "-";
        if (staffOT == 0) staffOT = "-";
        if (staffAttendanceData.length != 0) {
            tr.append(
                $(
                    `<div style="text-align:left;" class="stn col-2  pl-0 pr-0 bd">` +
                    staffInfo.staffname.value +
                    "</div>"
                )
            );
            tr.append($("<div class='col-2  pl-0 pr-0 bd'>" + staffInfo.department.value + "</div>"));
            divcc = $("<div class='col-5  pl-0 pr-0 row bd'></div>")
            divcc.append($('<div class="wt col-4 bdr">' + stafflWorkTime + "</div>"));
            divcc.append($('<div class="ot col-4 bdr">' + staffOT + "</div>"));
            divcc.append($('<div class="offtime col-4">' + staffOffTime + "</div>"));
            tr.append(divcc)
            var div = $("<div class='col-3  pl-0 pr-0 row bd'></div>")
            div.append($(`<div class='col-6  pl-0 pr-0 bdr'><a href="javascript:void(0)" onClick="downloadStaff2(` + staffInfo.chatworkid.value + `)">csv</a></div>`))
            div.append(
                $(
                    `<div class="chatworkid col-6  pl-0 pr-0" chatworkid=\"` +
                    staffInfo.chatworkid.value +
                    `\" ><i class="fas fa-caret-down"></i><i style="display:none" class="fas fa-caret-up"></i> </div>`
                )
            );
            tr.append(div)
        } else {
            tr.append(
                $(
                    `<div style="text-align:left;" class="stn col-2  pl-0 pr-0 bd">` +
                    staffInfo.staffname.value +
                    "</div>"
                )
            );

            tr.append($("<div class='col-2  pl-0 pr-0 bd'>" + staffInfo.department.value + "</div>"));
            divcc = $("<div class='col-5  pl-0 pr-0 row bd'></div>")
            divcc.append($('<div class="wt col-4 bdr">&nbsp-&nbsp</div>'));
            divcc.append($('<div class="ot col-4 bdr">&nbsp-&nbsp</div>'));
            divcc.append($('<div class="offtime col-4">' + staffOffTime + "</div>"));
            tr.append(divcc)
            var div = $("<div class='col-3  pl-0 pr-0 row bd'></div>")
            div.append($(`<div class='col-6  pl-0 pr-0 bdr'><a href="javascript:void(0)" onClick="downloadStaff2(` + staffInfo.chatworkid.value + `)">csv</a></div>`))
            div.append(
                $(
                    `<div class="chatworkid col-6  pl-0 pr-0" chatworkid=\"` +
                    staffInfo.chatworkid.value +
                    `\" ><i class="fas fa-caret-down"></i><i style="display:none" class="fas fa-caret-up"></i> </div>`
                )
            );
            tr.append(div)
        }
        $(".fa-caret-down")
            .off("click")
            .on("click", function () {
                var chatworkid = $(this)
                    .parent(".chatworkid")
                    .attr("chatworkid");
                $tr = $(this).parents(".data");
                viewDetail2($tr, chatworkid);
            });
        $(".totalWorkTime").text(totalWorkTime + txtHour);
        $(".totalOverTime").text(totalOverTime + txtHour);
        $(".totalOffTime").text(
            totalOffTimeA + "時間-" + totalOffTimeB + txtHour
        );
        $tb = $("#showRecord2");
        $tb.append(tr);
        $(".fa-caret-up")
            .off("click")
            .on("click", function () {
                $(this).parent(".chatworkid").find(".fa-caret-down").show();
                $(this).parent(".chatworkid").find(".fa-caret-up").hide();

                $(this).parents('.data').next().hide();
            });
        dataToExportStaff.sort((a, b) => {
            if (a.date > b.date)
                return 1;
            else
                return -1
        });
        dataToExport = dataToExport.concat(dataToExportStaff);
    });
}
function Search() {
    // setText2();

}
function viewDetail2($tr, chatworkid) {
    $tr.find('.fa-caret-down').hide();
    $tr.find('.fa-caret-up').show();
    $table = $("<div class=''></div>");
    var param = getParam2();
    var attendanceData = [];
    var leaveOffData = [];
    var start = new Date(param.start);
    var end = new Date(param.end);
    var staffInfo = null;
    dataStaffMaster.forEach((item) => {
        if (item.chatworkid.value == chatworkid) staffInfo = item;
    });
    dataAttendanceManagement.forEach((item) => {
        var itemDate = new Date(item.date.value);
        if (
            item.chatworkid.value == chatworkid &&
            itemDate >= start &&
            itemDate <= end
        ) {
            attendanceData.push(item);
        }
    });
    dataHolidayManagement.forEach((item) => {
        var itemDate = new Date(item.date.value);
        if (
            item.chatworkid.value == chatworkid &&
            itemDate >= start &&
            itemDate <= end
        )
            leaveOffData.push(item);
    });

    // add OffDay to timeSheetData
    var index = 0;
    for (var daye = start; daye <= end; daye.setDate(daye.getDate() + 1)) {
        var tr = $('<div class="row divEdit"></div>');
        if (daye.getDay() == 6) {
            tr.addClass("sat");
        }
        if (daye.getDay() == 0) {
            tr.addClass("sun");
        }
        if (index % 2 == 0) {
            tr.addClass("even");
        } else {
            tr.addClass("odd");
        }
        index++;
        var check = false;
        tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdday"></div>`)
        var datec = daye.toISOString().substring(0, 10);
        if (dataHolidayMaster.length > 0) {
            dataHolidayMaster.forEach((item) => {
                // nếu là ngày nghỉ lễ
                if (item.date.value == datec) {
                    tr.append(
                        $(
                            '<div class="first holiday col-md-2 col-9 col-sm-6">' +
                            fm(daye.getMonth() + 1) +
                            "/" +
                            fm(daye.getDate()) +
                            " (" +
                            thu[daye.getDay()] +
                            ") </br><span style='font-size:12px;color:red;'>(" +
                            item.description.value +
                            ")</span></div>"
                        )
                    );
                    check = true;
                }
            });
        }
        // không phải là ngày nghỉ lễ
        if (check == false)
            tr.append(
                $(
                    '<div class="first col-md-2 col-9 col-sm-6">' +
                    fm(daye.getMonth() + 1) +
                    "/" +
                    fm(daye.getDate()) +
                    " (" +
                    thu[daye.getDay()] +
                    ")" +
                    "</div>"
                )
            );

        var obj = null;
        // nếu có data trong ngày thì gán data cho obj
        for (var x = 0; x < attendanceData.length; x++) {
            var v1 =
                daye.getFullYear() +
                "-" +
                fm(daye.getMonth() + 1) +
                "-" +
                fm(daye.getDate());
            if (v1 === attendanceData[x].date.value) {
                obj = attendanceData[x];
                break;
            }
        }
        for (var x = 0; x < leaveOffData.length; x++) {
            var v1 =
                daye.getFullYear() +
                "-" +
                fm(daye.getMonth() + 1) +
                "-" +
                fm(daye.getDate());
            if (v1 === leaveOffData[x].date.value) {
                obj = leaveOffData[x];
                break;
            }
        }
        // có data
        if (obj !== null) {
            // ngày xin nghỉ phép
            if (obj.reason != null) {
                tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdtype col-sm-6"></div>`)
                tr.append(
                    $(
                        '<div class="col-md-2 col-9 col-sm-6">' +
                        `<span class="badge gradient-bloody text-white shadow">Off</span>` +
                        "</div>"
                    )
                );
                tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdReason "></div>`)
                tr.append(
                    $(
                        '<div class="reason col-md-7 col-9 col-sm-12">' +
                        obj.reason.value +
                        "</div>"
                    )
                );
                tr.append(`<div class="d-block bgnew divEnd text-white d-sm-none col-3  pl-0 pr-0"></div>`)
                tr.append(
                    $(
                        '<div class="col-md-1 col-9 col-sm-12">' +
                        '<i class="fa fa-pencil trung-pencil" aria-hidden="true"></i><i class="fa fa-save trung-save" style="display:none"></i>' +
                        "</div>"
                    )
                );
                tr.append(
                    $('<div class="enddiv" style="display:none">' + obj.$id.value + "</div>")
                );
            } // làm việc bth
            else {
                tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdtype"></div>`)
                var otHour = 0;
                var checkot = "";
                var checkfull = "hidden";
                var normal = "";
                if (obj.overtime.value == null) {
                    obj.overtime.value = "00:00";
                    checkot = "hidden";
                } else {
                    var arrOt = obj.overtime.value.split(":");
                    otHour = (
                        (parseInt(arrOt[0]) + parseInt(arrOt[1]) / 60) *
                        obj.coefficient.value
                    ).toFixed(1);
                }
                if (
                    obj.starttime.value > obj.sessionbegintime.value ||
                    obj.endtime.value < obj.sessionendtime.value
                ) {
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

                tr.append(
                    $(
                        '<div class="col-md-2 col-9 col-sm-6">' +
                        `<span ` +
                        normal +
                        ` class="badge gradient-quepal text-white shadow">Normal</span>
                        <span ` +
                        checkfull +
                        ` class="badge notfull text-white shadow">Not Full</span>
                        <span  ` +
                        checkot +
                        `  class="badge gradient-blooker text-white shadow">OT</span>` +
                        "</div>"
                    )
                );
                tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0  mdstart"><i class="fa fa-sign-in" aria-hidden="true"></div>`)
                tr.append(
                    $(
                        '<div class="startTime col-md-2 col-9 col-sm-6">' +
                        obj.starttime.value +
                        "</div>"
                    )
                );
                tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdend"><i class="fa fa-sign-out" aria-hidden="true"></div>`)
                tr.append(
                    $(
                        '<div class="endTime col-md-2 col-9 col-sm-6">' +
                        obj.endtime.value +
                        "</div>"
                    )
                );
                tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdrest"></div>`)
                tr.append(
                    $(
                        '<div class="col-md-1 col-9 col-sm-3">' +
                        obj.breaktime.value +
                        "</div>"
                    )
                );
                tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdwork"></div>`)
                tr.append(
                    $(
                        '<div class="col-md-1 col-9 col-sm-3">' +
                        obj.worktime.value +
                        "</div>"
                    )
                );
                tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdot"></div>`)
                tr.append(
                    $(
                        '<div class="col-md-1 col-9 col-sm-3">' +
                        obj.overtime.value +
                        "</div>"
                    )
                );
                tr.append(`<div class="d-block bgnew divEnd text-white d-sm-none col-3  pl-0 pr-0"></div>`)
                tr.append(
                    $(
                        '<div class="col-md-1 col-9 col-sm-3">' +
                        '<i class="fa fa-pencil trung-pencil" aria-hidden="true"></i><i class="fa fa-save trung-save" style="display:none"></i>' +
                        "</div>"
                    )
                );
                tr.append(
                    $('<div class="enddiv" style="display:none">' + obj.$id.value + "</div>")
                );
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
            tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdtype"></div>`)
            tr.append(
                $(
                    '<div class="col-md-2 col-9 col-sm-6">' +
                    `<span class="badge notset text-white shadow ">No Data</span>` +
                    "</div>"
                )
            );
            tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdstart"><i class="fa fa-sign-in" aria-hidden="true"></div>`)
            tr.append(
                $(
                    '<div class="col-md-2 col-9 col-sm-6">' +
                    "&nbsp&nbsp-&nbsp&nbsp" +
                    "</div>"
                )
            );
            tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdend"><i class="fa fa-sign-out" aria-hidden="true"></div>`)
            tr.append(
                $(
                    '<div class="col-md-2 col-9 col-sm-6">' +
                    "&nbsp&nbsp-&nbsp&nbsp" +
                    "</div>"
                )
            );
            tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdrest"></div>`)
            tr.append(
                $(
                    '<div class="col-md-1 col-9 col-sm-3">' +
                    "&nbsp&nbsp-&nbsp&nbsp" +
                    "</div>"
                )
            );
            tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdwork"></div>`)

            tr.append(
                $(
                    '<div class="col-md-1 col-9 col-sm-3">' +
                    "&nbsp&nbsp-&nbsp&nbsp" +
                    "</div>"
                )
            );
            tr.append(`<div class="d-block bgnew text-white d-sm-none col-3  pl-0 pr-0 mdot"></div>`)

            tr.append(
                $(
                    '<div class="col-md-1 col-9 col-sm-3">' +
                    "&nbsp&nbsp-&nbsp&nbsp" +
                    "</div>"
                )
            );
            tr.append(`<div class="d-block bgnew divEnd text-white d-sm-none col-3  pl-0 pr-0"></div>`)
            tr.append($('<div class="col-md-1 col-9 col-sm-3"></div>'));
            tr.append($('<div class="enddiv" style="display:none"></div>'));
        }

        $table.append(tr);
    }

    $newtr = $("<div class='container-fluid'></div>");
    $newdiv = $(`<div  style="padding:0px !important;"></div>`);
    $cc = $(`<div class="row titleHide text-center">
    <div class="col-md-2 col-6  pl-0 pr-0 mdday"></div>
    <div class="col-md-2 col-6  pl-0 pr-0 mdtype"></div>
    <div class="col-md-2 col-6  pl-0 pr-0 mdstart"><i class="fa fa-sign-in" aria-hidden="true"></i> 
    </div>
    <div class="col-md-2 col-6  pl-0 pr-0 mdend"><i class="fa fa-sign-out" aria-hidden="true"></i>
        </div>
    <div class="col-md-1 col-3  pl-0 pr-0 mdrest"></div>
    <div class="col-md-1 col-3  pl-0 pr-0 mdwork"></div>
    <div class="col-md-1 col-3  pl-0 pr-0 mdot"></div>
    <div class="col-md-1 col-3  pl-0 pr-0 mdedit"></div>
    </div>`);
    $newdiv.append($cc);
    $newdiv.append($table);
    $newtr.append($newdiv);
    $newtr.insertAfter($tr.closest(".data"));
    if (cybozu.data['LOGIN_USER'].locale == 'ja') {
        $(".mdday").text("日付(jp)");
        $(".mdtype").text("タグ(jp)");
        $(".mdstart").text("出勤時刻(jp)");
        $(".mdend").text("退勤時刻(jp)");
        $(".mdrest").text("休憩時間(jp)");
        $(".mdwork").text("労働時間(jp)");
        $(".mdot").text("残業時間(jp)");
        $('.mdReason').text("理由(jp)");
        $('.mdedit').text("編集(jp)");
    }
    if (cybozu.data['LOGIN_USER'].locale == 'en') {
        $(".mdday").text("日付");
        $(".mdtype").text("タグ");
        $(".mdstart").text("出勤時刻");
        $(".mdend").text("退勤時刻");
        $(".mdrest").text("休憩時間");
        $(".mdwork").text("労働時間");
        $(".mdot").text("残業時間");
        $('.mdReason').text("理由");
        $('.mdedit').text("編集");
    }
    // nút chỉnh sửa
    $(".trung-pencil")
        .off("click")
        .on("click", function () {
            $tr = $(this).parents(".divEdit");
            $id = $tr.find("div:last()").text();
            // nếu là ngày xin nghỉ
            if ($tr.find("div:nth-child(9)").text() == $id) {
                $reason = $tr.find(".reason");
                var reasonVal = $.trim($reason.text());
                var $reasonInput = $(
                    '<textarea class="editText reason" ></textarea>'
                );
                $reasonInput.val(reasonVal);
                $reason.html($reasonInput);
            } // ngày làm bth
            else {
                var $start = $tr.find(".startTime");
                var $end = $tr.find(".endTime");
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
            $(this).next("i.fa-save.trung-save").show();
        });
    // nút lưu
    $(".trung-save")
        .off("click")
        .on("click", function () {
            $tr = $(this).parents(".divEdit");
            $id = $tr.find("div:last()").text();
            // ngày xin nghỉ
            if ($tr.find("div:nth-child(9)").text() == $id) {
                $reason = $tr.find(".reason");
                var reasonVal = $.trim($reason.find("textarea").val());
                $reason.html(reasonVal);
                var body = {
                    app: listAppId.HolidayManagement,
                    id: $id,
                    record: {
                        reason: {
                            value: reasonVal,
                        },
                    },
                };
                kintone.api(
                    kintone.api.url("/k/v1/record", true),
                    "PUT",
                    body,
                    function (resp) { }
                );
            } // ngày làm bth
            else {
                var $startDate = $tr.find(".startTime");
                var $endDate = $tr.find(".endTime");
                var startVal = $.trim($startDate.find("input").val());
                var endVal = $.trim($endDate.find("input").val());
                $startDate.html(startVal);
                $endDate.html(endVal);
                var body = {
                    app: listAppId.AttendanceManagement,
                    id: $id,
                    record: {
                        starttime: {
                            value: startVal,
                        },
                        endtime: {
                            value: endVal,
                        },
                    },
                };
                kintone.api(
                    kintone.api.url("/k/v1/record", true),
                    "PUT",
                    body,
                    function (resp) { }
                );
            }
            $(this).hide();
            $(this).prev().show();
        });

}
