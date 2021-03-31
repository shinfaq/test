var listAppId = {
    AttendanceManagement: kintone.app.getId() - 1,
    DepartmentMaster: kintone.app.getId() - 5,
    HolidayMaster: kintone.app.getId() - 7,
    StaffMaster: kintone.app.getId() - 4,
    HolidayManagement: kintone.app.getId() - 3,
    ShiftMaster: kintone.app.getId() - 8,
};
var listDepartment2 = [];
var dataAttendanceManagement2 = [];
var dataDepartmentMaster2 = [];
var dataHolidayMaster2 = [];
var dataStaffMaster2 = [];
var dataHolidayManagement2 = [];
var dataShiftMaster2 = [];
var readyStaffMaster = false;
var readyAttendanceManagement = false;
var readyDepartmentMaster = false;
var readyHolidayMaster = false;
var readyHolidayManagement = false;
var readyShiftMaster = false;
var currentDate2 = new Date();
var datepickerText = {};
$(document).ready(function () {
    changeLanguage();
    getDefaultData();
    interval2 = setInterval(() => {
        if (
            readyShiftMaster &&
            readyHolidayMaster &&
            readyStaffMaster &&
            readyDepartmentMaster
        ) {
            clearInterval(interval2);
            clearInterval(interval);
            setDefault2();
        }
    }, 100);
    $("body").removeClass("body-top");
});
function changeLanguage() {
    var e = document.getElementById("lang");
    var lang = e.value;
    switch (lang) {
        case "en": {
            $(".dpm").text("Department");
            $(".ttReport").text("Report");
            $(".opt1").text("Day");
            $(".opt2").text("Week");
            $(".opt3").text("Month");
            $(".move-today").text("Now");
            $(".p4name").text("Staff Name");
            $(".p4dpm").text("Department");
            $(".p4wt").text("Working Hours");
            $(".p4ot").text("Overtime Hours");
            $(".p4off").text("Leave Off Hours");
            $(".mdday").text("Date");
            $(".mdtype").text("Type");
            $(".mdstart").text("Time In");
            $(".mdend").text("Time Out");
            $(".mdrest").text("Break Time Hours");
            $(".mdwork").text("Working Hours");
            $(".mdot").text("Overtime Hours");
            datepickerText = {
                closeText: "Close",
                prevText: "&#x3C;Previous",
                nextText: "Next&#x3E;",
                currentText: "Today",
                monthNames: [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                ],
                monthNamesShort: [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                ],
                dayNames: [
                    "Sunday",
                    "Monday",
                    "Tueday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                ],
                dayNamesShort: [
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                ],
                dayNamesMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                weekHeader: "Week",
                yearSuffix: "",
            };
            thu = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            $(".txtSearch").text("Search");
            $(".mdReason").text("Reason");
            $(".dlcsv").text("Export CSV");
            $(".download").text("Export CSV");
            $(".detail").text("Detail");
            $.datepicker.setDefaults({
                closeText: datepickerText.closeText,
                prevText: datepickerText.prevText,
                nextText: datepickerText.nextText,
                currentText: datepickerText.currentText,
                monthNames: datepickerText.monthNames,
                monthNamesShort: datepickerText.monthNamesShort,
                dayNames: datepickerText.dayNames,
                dayNamesShort: datepickerText.dayNamesShort,
                dayNamesMin: datepickerText.dayNamesMin,
                weekHeader: datepickerText.weekHeader,
                dateFormat: "yy/mm/dd",
                firstDay: 0,
                isRTL: false,
                showMonthAfterYear: true,
                yearSuffix: datepickerText.yearSuffix,
            });
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
            break;
        }
        case "vn": {
            $(".dpm").text("Phòng Ban");
            $(".ttReport").text("Báo Cáo");
            $(".opt1").text("Ngày");
            $(".opt2").text("Tuần");
            $(".opt3").text("Tháng");
            $(".move-today").text("Hiện Tại");
            $(".p4name").text("Tên Nhân Viên");
            $(".p4dpm").text("Phòng Ban");
            $(".p4wt").text("Số Giờ Làm Việc");
            $(".p4ot").text("Số Giờ Tăng Ca");
            $(".p4off").text("Số Giờ Nghỉ");
            $(".mdday").text("Ngày");
            $(".mdtype").text("Loại");
            $(".mdstart").text("Giờ Vào");
            $(".mdend").text("Giờ Ra");
            $(".mdrest").text("Số Giờ Nghỉ Giải Lao");
            $(".mdwork").text("Số Giờ Làm Việc");
            $(".mdot").text("Số Giờ Tăng Ca");
            datepickerText = {
                closeText: "Đóng",
                prevText: "&#x3C;Trước",
                nextText: "Sau&#x3E;",
                currentText: "Hiện Tại",
                monthNames: [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                ],
                monthNamesShort: [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                ],
                dayNames: ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
                dayNamesShort: ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
                dayNamesMin: ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
                weekHeader: "Week",
                yearSuffix: "",
            };
            thu = ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"];
            $(".txtSearch").text("Tìm Kiếm");
            $(".mdReason").text("Lý Do");
            $(".dlcsv").text("Xuất CSV");
            $(".download").text("Xuất CSV");
            $(".detail").text("Chi Tiết");
            $.datepicker.setDefaults({
                closeText: datepickerText.closeText,
                prevText: datepickerText.prevText,
                nextText: datepickerText.nextText,
                currentText: datepickerText.currentText,
                monthNames: datepickerText.monthNames,
                monthNamesShort: datepickerText.monthNamesShort,
                dayNames: datepickerText.dayNames,
                dayNamesShort: datepickerText.dayNamesShort,
                dayNamesMin: datepickerText.dayNamesMin,
                weekHeader: datepickerText.weekHeader,
                dateFormat: "yy/mm/dd",
                firstDay: 0,
                isRTL: false,
                showMonthAfterYear: true,
                yearSuffix: datepickerText.yearSuffix,
            });
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
            break;
        }
    }
}
function getDefaultData() {
    fetchRecords2(listAppId.ShiftMaster).then(function (records) {
        dataShiftMaster2 = records;
        readyShiftMaster = true;
    });
    fetchRecords2(listAppId.HolidayMaster).then(function (records) {
        dataHolidayMaster2 = records;
        readyHolidayMaster = true;
    });
    fetchRecords2(listAppId.StaffMaster).then(function (records) {
        dataStaffMaster2 = records;
        readyStaffMaster = true;
    });
    fetchRecords2(listAppId.DepartmentMaster).then(function (records) {
        dataDepartmentMaster2 = records;
        readyDepartmentMaster = true;
    });
}
function fetchRecords2(appId, opt_offset, opt_limit, opt_records) {
    var offset = opt_offset || 0;
    var limit = opt_limit || 100;
    var allRecords = opt_records || [];
    var params = { app: appId, query: "limit " + limit + " offset " + offset };
    return kintone.api("/k/v1/records", "GET", params).then(function (resp) {
        allRecords = allRecords.concat(resp.records);
        if (resp.records.length === limit) {
            return fetchRecords2(appId, offset + limit, limit, allRecords);
        }
        return allRecords;
    });
}
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
        var week = getWeek2();
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
function getWeek2(start) {
    start = start || 0;
    var day = currentDate2.getDay() - start;
    var date = currentDate2.getDate() - day;
    var StartDate = new Date(currentDate2.setDate(date));
    var EndDate = new Date(StartDate.getTime() + 6 * 24 * 3600000);
    return [StartDate, EndDate];
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
    if (select2) {
        dataDepartmentMaster2.forEach((item) => {
            listDepartment2.push(item.name.value);
            var option = document.createElement("option");
            option.value = item.name.value;
            option.text = item.name.value;
            select2.appendChild(option);
        });
    }
    let cccc = new vanillaSelectBox("#brandsMulti");
    setText2();
    Search();
}
function setText2() {
    $("#dateRange").text("");
    if (viewName == "month") {
        text =
            currentDate2.getFullYear() + "/" + fm(currentDate2.getMonth() + 1);
    }
    if (viewName == "week") {
        var week = getWeek2();
        var start =
            week[0].getFullYear() +
            "/" +
            fm(week[0].getMonth() + 1) +
            "/" +
            fm(week[0].getDate());
        var end =
            week[1].getFullYear() +
            "/" +
            fm(week[1].getMonth() + 1) +
            "/" +
            fm(week[1].getDate());
        text = start + "~" + end;
    }
    if (viewName == "day") {
        text =
            currentDate2.getFullYear() +
            "/" +
            fm(currentDate2.getMonth() + 1) +
            "/" +
            fm(currentDate2.getDate());
    }
    $("#dateRange").text(text);
}
function Search() {
    dataAttendanceManagement2 = [];
    dataHolidayManagement2 = [];
    readyAttendanceManagement = false;
    readyHolidayManagement = false;
    $("#loading").show();
    var param = getParam2();
    var startDate = param.start;
    var endDate = param.end;
    var departments = param.list.length == 0 ? listDepartment2 : param.list;
    var text = "";

    fetchRecordsFromTo(
        listAppId.AttendanceManagement,
        startDate,
        endDate,
        departments
    ).then(function (records) {
        dataAttendanceManagement2 = records;
        readyAttendanceManagement = true;
    });
    fetchRecordsFromTo(listAppId.HolidayManagement, startDate, endDate).then(
        function (records) {
            dataHolidayManagement2 = records;
            readyHolidayManagement = true;
        }
    );
    interval3 = setInterval(() => {
        if (
            readyShiftMaster &&
            readyHolidayMaster &&
            readyStaffMaster &&
            readyDepartmentMaster &&
            readyHolidayManagement &&
            readyAttendanceManagement
        ) {
            $("#loading").hide();
            clearInterval(interval3);
            loadData2(startDate, endDate, departments);
        }
    }, 100);
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
function toUnicode(str) {
    return str
        .split("")
        .map(function (value, index, array) {
            var temp = value.charCodeAt(0).toString(16).toUpperCase();
            if (temp.length > 2) {
                return "\\u" + temp;
            }
            return value;
        })
        .join("");
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
    setText2();
}
function fetchRecordsFromTo(
    appId,
    from,
    to,
    dep,
    opt_offset,
    opt_limit,
    opt_records
) {
    var strListDepartment = "";
    if (dep) {
        strListDepartment = "and department in (";
        for (let i = 0; i < dep.length - 1; i++)
            strListDepartment += '"' + dep[i] + '",';
        strListDepartment += '"' + dep[dep.length - 1] + '")';
    }
    var offset = opt_offset || 0;
    var limit = opt_limit || 100;
    var allRecords = opt_records || [];
    var params = {
        app: appId,
        query:
            'date<="' +
            to +
            '" and date>="' +
            from +
            '" ' +
            strListDepartment +
            " limit " +
            limit +
            " offset " +
            offset,
    };
    return kintone.api("/k/v1/records", "GET", params).then(function (resp) {
        allRecords = allRecords.concat(resp.records);
        if (resp.records.length === limit) {
            return fetchRecordsFromTo(
                appId,
                from,
                to,
                dep,
                offset + limit,
                limit,
                allRecords
            );
        } else ready = true;
        return allRecords;
    });
}
function download2() {
    var param = getParam2();
    var startDate = param.start;
    var endDate = param.end;
    var departments = param.list.length == 0 ? listDepartment2 : param.list;
    var headers = {
        stt: "STT",
        chatworkid: "chatworkid",
        date: "date",
        staffname: "staffname",
        department: "department",
        sessionbegintime: "sessionbegintime",
        sessionendtime: "sessionendtime",
        starttime: "starttime",
        endtime: "endtime",
        worktime: "worktime",
        overtime: "overtime",
        reason: "reason",
        offType: "offType",
        startOff: "startOff",
        endOff: "startOff",
    };
    var fileTitle = "Report_" + startDate + "-" + endDate + "_" + departments;

    exportCSVFile(headers, dataToExport, fileTitle);
}
function downloadStaff2(chatworkid) {
    var st = 1;
    var param = getParam2();
    var startDate = new Date(param.start);
    var endDate = new Date(param.end);
    var dataExport = [];
    var staffInfo = null;
    dataStaffMaster2.forEach((item) => {
        if (item.chatworkid.value == chatworkid) staffInfo = item;
    });
    dataAttendanceManagement2.forEach((item) => {
        var itemDate = new Date(item.date.value);
        if (
            item.chatworkid.value == chatworkid &&
            itemDate >= startDate &&
            itemDate <= endDate
        ) {
            dataExport.push({
                stt: "",
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
            });
        }
    });
    dataHolidayManagement2.forEach((item) => {
        var itemDate = new Date(item.date.value);
        if (
            item.chatworkid.value == chatworkid &&
            itemDate >= startDate &&
            itemDate <= endDate
        ) {
            dataExport.push({
                stt: "",
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
            });
        }
    });
    dataExport.sort((a, b) => {
        if (a.date > b.date) return 1;
        else return -1;
    });
    dataExport.forEach((item) => {
        item.stt = st;
        st++;
    });
    var name = "pháppp";
    name = JSON.stringify(name);
    var headers = {
        stt: name,
        chatworkid: "chatworkid",
        date: "date",
        staffname: "staffname",
        department: "department",
        sessionbegintime: "sessionbegintime",
        sessionendtime: "sessionendtime",
        starttime: "starttime",
        endtime: "endtime",
        worktime: "worktime",
        overtime: "overtime",
        reason: "reason",
        offType: "offType",
        startOff: "startOff",
        endOff: "startOff",
    };
    var fileTitle =
        "Report_" +
        param.start +
        "-" +
        param.end +
        "_" +
        staffInfo.staffname.value;

    exportCSVFile(headers, dataExport, fileTitle);
}
function loadData2(startDate, endDate, departments) {
    dataToExport = [];
    $("#showRecord2").html("");
    var listStaff2 = [];
    var dateArray = [];

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
        dataStaffMaster2.forEach((staff) => {
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
        var tr = $("<div class='row data custom-hover'></div>");
        tr.addClass(rc);
        var staffAttendanceData = [];
        var staffLeaveOffData = [];
        var staffInfo = null;
        var stafflWorkTime = 0;
        var staffOT = 0;
        var staffShift = 0;
        var staffOffTime = 0;
        dataStaffMaster2.forEach((item) => {
            if (item.chatworkid.value == staff) staffInfo = item;
        });
        var staffShiftEndStr = staffInfo.endtime.value;
        var staffShiftStartStr = staffInfo.starttime.value;
        var arrStart = staffShiftStartStr.split(":");
        var startShift = parseInt(arrStart[0]) + parseInt(arrStart[1]) / 60;
        var arrEnd = staffShiftEndStr.split(":");
        var endShitf = parseInt(arrEnd[0]) + parseInt(arrEnd[1]) / 60;
        staffShift = endShitf - startShift > 8 ? 8 : endShitf - startShift;
        dataAttendanceManagement2.forEach((item) => {
            var itemWorkTime = 0;
            var itemOT = 0;
            if (item.chatworkid.value == staff) {
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
                });
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
        dataHolidayManagement2.forEach((item) => {
            if (item.chatworkid.value == staff) {
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
                });
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
        if (staffOffTime == 0) staffOffTime = "&mdash;";
        else staffOffTime = staffOffTime.toFixed(2);
        if (staffOT == 0) staffOT = "&mdash;";
        else staffOT = staffOT.toFixed(2);
        if (stafflWorkTime == 0) stafflWorkTime = "&mdash;";
        else stafflWorkTime = stafflWorkTime.toFixed(2);
        if (staffAttendanceData.length != 0) {
            tr.append(
                $(
                    `<div style="text-align:left;" class="stn col-2  pl-0 pr-0 bd">` +
                        staffInfo.staffname.value +
                        "</div>"
                )
            );
            tr.append(
                $(
                    "<div class='col-2  pl-0 pr-0 bd'>" +
                        staffInfo.department.value +
                        "</div>"
                )
            );
            divcc = $("<div class='col-5  pl-0 pr-0 row bd'></div>");
            divcc.append(
                $('<div class="wt col-4 bdr">' + stafflWorkTime + "</div>")
            );
            divcc.append($('<div class="ot col-4 bdr">' + staffOT + "</div>"));
            divcc.append(
                $('<div class="offtime col-4">' + staffOffTime + "</div>")
            );
            tr.append(divcc);
            var div = $("<div class='col-3  pl-0 pr-0 row bd'></div>");
            div.append(
                $(
                    `<div class='col-6 px-0 bdr'>
                        <a href="javascript:void(0)" onClick="downloadStaff2(` +
                        staffInfo.chatworkid.value +
                        `)">csv</a>
                    </div>`
                )
            );
            div.append(
                $(
                    `<div class="chatworkid col-6  pl-0 pr-0" chatworkid=\"` +
                        staffInfo.chatworkid.value +
                        `\" >
                        <i class="fas fa-expand-arrows-alt"></i> 
                    </div>`
                )
            );
            tr.append(div);
        } else {
            tr.append(
                $(
                    `<div style="text-align:left;" class="stn col-2  pl-0 pr-0 bd">` +
                        staffInfo.staffname.value +
                        "</div>"
                )
            );

            tr.append(
                $(
                    "<div class='col-2 px-0 bd'>" +
                        staffInfo.department.value +
                        "</div>"
                )
            );
            divcc = $("<div class='col-5 px-0 row bd'></div>");
            divcc.append($('<div class="wt col-4 bdr">&mdash;</div>'));
            divcc.append($('<div class="ot col-4 bdr">&mdash;</div>'));
            divcc.append(
                $('<div class="offtime col-4">' + staffOffTime + "</div>")
            );
            tr.append(divcc);
            var div = $("<div class='col-3 px-0 row bd'></div>");
            div.append(
                $(
                    `<div class='col-6 px-0 bdr'>
                        <a href="javascript:void(0)" onClick="downloadStaff2(` +
                        staffInfo.chatworkid.value +
                        `)">
                          csv
                        </a>
                    </div>`
                )
            );
            div.append(
                $(
                    `<div class="chatworkid col-6  px-0" chatworkid=\"` +
                        staffInfo.chatworkid.value +
                        `\" >
                        <i class="fas fa-expand-arrows-alt"></i>
                    </div>`
                )
            );
            tr.append(div);
        }
        $(".fa-expand-arrows-alt")
            .off("click")
            .on("click", function () {
                var chatworkid = $(this)
                    .parent(".chatworkid")
                    .attr("chatworkid");
                $tr = $(this).parents(".data");
                viewDetail2($tr, chatworkid);
            });
        $tb = $("#showRecord2");
        $tb.append(tr);
        // $(".fa-caret-up")
        //     .off("click")
        //     .on("click", function () {
        //         $(this).parent(".chatworkid").find(".fa-caret-down").show();
        //         $(this).parent(".chatworkid").find(".fa-caret-up").hide();

        //         $(this).parents(".data").next().hide();
        //     });
        dataToExportStaff.sort((a, b) => {
            if (a.date > b.date) return 1;
            else return -1;
        });
        dataToExport = dataToExport.concat(dataToExportStaff);
    });
}
function viewDetail2($tr, chatworkid) {
    // $tr.find(".fa-caret-down").hide();
    // $tr.find(".fa-caret-up").show();
    var staffInfo = null;
    dataStaffMaster2.forEach((item) => {
        if (item.chatworkid.value == chatworkid) staffInfo = item;
    });

    $table = $("<div class=''></div>");
    var param = getParam2();
    var attendanceData = [];
    var leaveOffData = [];
    var start = new Date(param.start);
    var end = new Date(param.end);
    var staffInfo = null;
    dataStaffMaster2.forEach((item) => {
        if (item.chatworkid.value == chatworkid) staffInfo = item;
    });
    dataAttendanceManagement2.forEach((item) => {
        var itemDate = new Date(item.date.value);
        if (
            item.chatworkid.value == chatworkid &&
            itemDate >= start &&
            itemDate <= end
        ) {
            attendanceData.push(item);
        }
    });
    dataHolidayManagement2.forEach((item) => {
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
        var tr = $('<div class="row col-12 px-0 py-0 divEdit"></div>');
        if (daye.getDay() == 6) {
            tr.addClass("sat");
        }
        if (daye.getDay() == 0) {
            tr.addClass("sun");
        }
        if (index % 2 == 0) {
            tr.addClass("even custom-hover");
        } else {
            tr.addClass("odd custom-hover");
        }
        index++;
        var check = false;
        var datec = daye.toISOString().substring(0, 10);
        if (dataHolidayMaster2.length > 0) {
            dataHolidayMaster2.forEach((item) => {
                // nếu là ngày nghỉ lễ
                if (item.date.value == datec) {
                    tr.append(
                        $(
                            '<div class="first holiday col-2 custom-border3">' +
                                fm(daye.getMonth() + 1) +
                                "/" +
                                fm(daye.getDate()) +
                                " (" +
                                thu[daye.getDay()] +
                                ") " +
                                "</br>" +
                                "<span style='font-size:12px;color:red;'>(" +
                                item.description.value +
                                ")</span>" +
                                "</div>"
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
                    '<div class="first col-2 px-0 custom-border3">' +
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
                tr.append(
                    $(
                        '<div class="col-2 px-0 custom-border3">' +
                            `<span class="badge custom-badge gradient-bloody text-white ">Off</span>` +
                            "</div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="reason col-7 px-0 custom-border3">' +
                            obj.reason.value +
                            "</div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="col-1 px-0 custom-border3-3">' +
                            `<i class="fa fa-pencil trung-pencil" aria-hidden="true"></i>
                          <i class="fa fa-save trung-save" style="display:none"></i>` +
                            "</div></div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="enddiv" style="display:none">' +
                            obj.$id.value +
                            "</div>"
                    )
                );
            } // làm việc bth
            else {
                var otHour = 0;
                var checkot = "";
                var checkfull = "hidden";
                var normal = "";
                if (
                    obj.overtime.value == null ||
                    obj.overtime.value == "00:00"
                ) {
                    checkot = "hidden";
                    obj.overtime.value = "00:00";
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
                        '<div class="col-2 px-0 custom-border3">' +
                            `<span ` +
                            normal +
                            ` class="badge custom-badge gradient-quepal text-white ">Normal</span>
                          <span ` +
                            checkfull +
                            ` class="badge custom-badge custom-notfull text-white ">Not Full</span>
                          <span  ` +
                            checkot +
                            `  class="badge custom-badge gradient-blooker text-white ">OT</span>` +
                            "</div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="row col-4 px-0 py-0">' +
                            '<div class="startTime col-4 px-0 custom-border3">' +
                            obj.starttime.value +
                            "</div>" +
                            '<div class="endTime col-4 px-0 custom-border3">' +
                            obj.endtime.value +
                            "</div>" +
                            '<div class="col-4 px-0 custom-border3">' +
                            obj.breaktime.value +
                            "</div>" +
                            "</div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="row col-4 px-0 py-0">' +
                            '<div class="col-4 px-0 custom-border3">' +
                            obj.worktime.value +
                            "</div>" +
                            '<div class="col-4 px-0 custom-border3">' +
                            obj.overtime.value +
                            "</div>" +
                            '<div class="col-4 px-0 custom-border3-3">' +
                            '<i class="fa fa-pencil trung-pencil" aria-hidden="true"></i>' +
                            '<i class="fa fa-save trung-save" style="display:none"></i>' +
                            "</div>" +
                            "</div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="enddiv" style="display:none">' +
                            obj.$id.value +
                            "</div>"
                    )
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
            tr.append(
                $(
                    '<div class="col-2 px-0 custom-border3">' +
                        `<span class="badge custom-badge custom-notset text-white">No Data</span>` +
                        "</div>"
                )
            );
            tr.append(
                $(
                    '<div class="row col-4 px-0 py-0">' +
                        '<div class=" col-4 px-0 custom-border3">' +
                        "&mdash;" +
                        "</div>" +
                        '<div class=" col-4 px-0 custom-border3">' +
                        "&mdash;" +
                        "</div>" +
                        '<div class=" col-4 px-0 custom-border3">' +
                        "&mdash;" +
                        "</div>" +
                        "</div>"
                )
            );
            tr.append(
                $(
                    '<div class="row col-4 px-0 py-0">' +
                        '<div class="col-4 px-0 custom-border3">' +
                        "&mdash;" +
                        "</div>" +
                        '<div class="col-4 px-0 custom-border3">' +
                        "&mdash;" +
                        "</div>" +
                        '<div class="col-4 px-0 custom-border3-3"></div>' +
                        "</div>"
                )
            );
            tr.append($('<div class="enddiv" style="display:none"></div>'));
        }

        $table.append(tr);
    }

    $newtr = $("<div class='container-fluid pl-0 pr-0 custom-modal'></div>");
    $newdiv = $(`<div ></div>`);
    $cc = $(`
      <div class="user-info__top">
        <div class="user-info__box">
          <div class="user-info"></div>
          <div class="btn--close-modal" onClick="closeModal()"></div>
        </div>
      </div>
      <div class="col-12 px-0 py-0 row titleHide text-center">
        <div class="col-2 px-0 mdday custom-border2"></div>
        <div class="col-2 px-0 mdtype custom-border2"></div>
        <div class="row col-4 px-0 py-0">
          <div class=" col-4 px-0 mdstart custom-border2">
            <i class="fa fa-sign-in" aria-hidden="true"></i> 
          </div>
          <div class="col-4 px-0 mdend custom-border2">
            <i class="fa fa-sign-out" aria-hidden="true"></i>
          </div>
          <div class="col-4 px-0 mdrest custom-border2"></div>
        </div>
      <div class="row col-4 px-0 py-0">
        <div class="col-4 px-0 mdwork custom-border2"></div>
        <div class="col-4 px-0 mdot custom-border2"></div>
        <div class="col-4 px-0 mdedit custom-border2-2"></div>
      </div>
    </div>`);

    $newdiv.append($cc);
    $newdiv.append($table);
    $newtr.append($newdiv);
    $newtr.insertAfter($tr.closest(".data"));

    $(".user-info").html(
        staffInfo.department.value +
            " -<span> " +
            staffInfo.staffname.value +
            "</span> (Chatwork ID︰ " +
            chatworkid +
            ")" +
            " - [" +
            staffInfo.starttime.value +
            " ~ " +
            staffInfo.endtime.value +
            "]"
    );
    var e = document.getElementById("lang");
    var lang = e.value;
    if (lang == "en") {
        $(".mdday").text("Date");
        $(".mdtype").text("Type");
        $(".mdstart").text("Time In");
        $(".mdend").text("Time Out");
        $(".mdrest").text("Break Time Hours");
        $(".mdwork").text("Working Hours");
        $(".mdot").text("Overtime Hours");
        $(".mdReason").text("Reason");
        $(".mdedit").text("Edit");
    }
    if (lang == "vn") {
        $(".mdday").text("Ngày");
        $(".mdtype").text("Loại");
        $(".mdstart").text("Giờ Vào");
        $(".mdend").text("Giờ Ra");
        $(".mdrest").text("Số Giờ Nghỉ Giải Lao");
        $(".mdwork").text("Số Giờ Làm Việc");
        $(".mdot").text("Số Giờ Tăng Ca");
        $(".mdReason").text("Lý Do");
        $(".mdedit").text("Chỉnh Sửa");
    }
    // nút chỉnh sửa
    $(".trung-pencil")
        .off("click")
        .on("click", function () {
            $tr = $(this).parents(".divEdit");
            $id = $tr.find("div:last()").text();
            // nếu là ngày xin nghỉ
            if ($tr.find(".badge").text() == "Off") {
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
            if ($tr.find(".badge").text() == "Off") {
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
                    function (resp) {}
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
                    function (resp) {}
                );
            }
            $(this).hide();
            $(this).prev().show();
        });
    $(".btn--close-modal")
        .off("click")
        .on("click", function () {
            $(".custom-modal").hide();
        });
}
