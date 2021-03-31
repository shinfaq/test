var listAppId = {
    Report: kintone.app.getId(),
    AttendanceManagement: kintone.app.getId() - 1,
    DepartmentMaster: kintone.app.getId() - 5,
    HolidayMaster: kintone.app.getId() - 7,
    StaffMaster: kintone.app.getId() - 4,
    LeaveOffManagement: kintone.app.getId() - 3,
    ShiftMaster: kintone.app.getId() - 8,
    OTManagement: kintone.app.getId() - 2,
};
var dataToShow = [];
var listDepartment = [];
var dataReport = [];
var dataAttendanceManagement = [];
var dataDepartmentMaster = [];
var dataHolidayMaster = [];
var dataStaffMaster = [];
var dataHolidayManagement = [];
var datepickerText = {};
var currentDate = new Date();
var viewName = "month";
$(document).ready(function () {
    changeLanguage();
    fetchRecords(listAppId.DepartmentMaster).then(function (records) {
        dataDepartmentMaster = records;
        onClickMenu();
        let select2 = document.getElementById("brandsMulti");
        if (select2) {
            dataDepartmentMaster.forEach((item) => {
                listDepartment.push(item.department_id.value);
                var option = document.createElement("option");
                option.value = item.department_id.value;
                option.text = item.department_name.value;
                select2.appendChild(option);
            });
            let cccc = new vanillaSelectBox("#brandsMulti");
            var year = new Date().getFullYear();
            $("#datePickcc").datepicker({
                changeMonth: true,
                changeYear: true,
                onSelect: function (date) {
                    currentDate = new Date(date);
                    setText();
                },
                maxDate: new Date(year, 11, 31),
            });
            $(".show-datePickcc").on("click", function () {
                $("#datePickcc").datepicker("show");
            });
            $("#menu-navicc button").on("click", onClickMove);
            $("#menu-itemcc input").on("click", onClickMenu);
            setText();
            Search();
        }
    });
    $("body").removeClass("body-top");
});

function fm(n) {
    return n < 10 ? "0" + n : n;
}

function Search() {
    dataAttendanceManagement = [];
    dataHolidayManagement = [];
    dataStaffMaster = [];
    readyAttendanceManagement = false;
    readyHolidayManagement = false;
    $("#loading").show();
    var param = getParam();
    var startDate = param.start;
    var endDate = param.end;
    var departments = param.list.length == 0 ? listDepartment : param.list;
    dataToShow = [];
    getListStaff(listAppId.StaffMaster, departments).then(function (
        staffRecords
    ) {
        dataStaffMaster = staffRecords;
        var staffLength = dataStaffMaster.length;
        var list_cw_id = [];
        if (staffLength == 0) {
            $("#showRecord2").html("");
            $("#loading").hide();
        } else {
            dataStaffMaster.forEach((staff) => {
                let data = {
                    name: staff.staff_name.value,
                    cw_id: staff.cw_id.value,
                    listReport: [],
                };
                list_cw_id.push(staff.cw_id.value);
                dataDepartmentMaster.forEach((department) => {
                    if (
                        department.department_id.value ==
                        staff.department_id.value
                    )
                        data.department_name = department.department_name.value;
                });
                dataToShow.push(data);
            });
            fetchRecordsFromTo(
                listAppId.Report,
                list_cw_id,
                startDate,
                endDate
            ).then(function (reportRecords) {
                dataToShow.forEach((data) => {
                    reportRecords.forEach((report) => {
                        if (report.cw_id.value == data.cw_id) {
                            data.listReport.push(report);
                        }
                    });
                });
                loadData(dataToShow);
            });
        }
    });
}

function loadData(dataToShow) {
    $("#showRecord2").html("");

    var index = 0;
    dataToShow.forEach((staff) => {
        var rc = "even";
        if (index % 2 == 0) {
            rc = "odd";
        }
        index++;
        var tr = $("<div class='row data custom-hover'></div>");
        tr.addClass(rc);
        let totalWorkingHour = "";
        let totalOTHour = "";
        let totalOffHour = "";
        staff.listReport.forEach((report) => {
            totalWorkingHour = addHour(
                totalWorkingHour,
                report.work_hour.value
            );
            totalOTHour = addHour(totalOTHour, report.ot_hour.value);
            totalOffHour = addHour(totalOffHour, report.off_hour.value);
        });
        tr.append(
            $(
                `<div style="text-align:left;" class="stn col-2  pl-0 pr-0 bd">` +
                    staff.name +
                    "</div>"
            )
        );
        tr.append(
            $(
                "<div class='col-2  pl-0 pr-0 bd'>" +
                    staff.department_name +
                    "</div>"
            )
        );
        divcc = $("<div class='col-5  pl-0 pr-0 row bd'></div>");
        divcc.append(
            $(
                '<div class="wt col-4 bdr">' +
                    timeToHour(totalWorkingHour) +
                    "</div>"
            )
        );
        divcc.append(
            $('<div class="ot col-4 bdr">' + timeToHour(totalOTHour) + "</div>")
        );
        divcc.append(
            $(
                '<div class="offtime col-4">' +
                    timeToHour(totalOffHour) +
                    "</div>"
            )
        );
        tr.append(divcc);
        var div = $("<div class='col-3  pl-0 pr-0 row bd'></div>");
        div.append(
            $(
                `<div class='col-6 px-0 bdr'>
                        <a href="javascript:void(0)" onClick="downloadStaff2(` +
                    staff.cw_id +
                    `)">csv</a>
                    </div>`
            )
        );
        div.append(
            $(
                `<div class="chatworkid col-6  pl-0 pr-0" chatworkid=\"` +
                    staff.cw_id +
                    `\" >
                        <i class="fas fa-expand-arrows-alt" onClick="clickView(` +
                    staff.cw_id +
                    `)"></i>
                    </div>`
            )
        );
        tr.append(div);
        $(".fa-expand-arrows-alt")
            .off("click")
            .on("click", function () {
                var chatworkid = $(this)
                    .parent(".chatworkid")
                    .attr("chatworkid");
                $tr = $(this).parents(".data");
                clickView($tr, chatworkid);
            });
        $tb = $("#showRecord2");
        $tb.append(tr);
        $("#loading").hide();
    });
}
function clickView(chatworkid) {
    $table = $("<div class=''></div>");
    var param = getParam();
    var startDate = param.start;
    var endDate = param.end;
    fetchRecordsFromTo(
        listAppId.AttendanceManagement,
        [chatworkid],
        startDate,
        endDate
    ).then(function (attendanceRecords) {
        fetchRecordsFromTo(
            listAppId.LeaveOffManagement,
            [chatworkid],
            startDate,
            endDate
        ).then(function (leaveRecords) {
            fetchRecordsFromTo(
                listAppId.OTManagement,
                [chatworkid],
                startDate,
                endDate
            ).then(function (OTRecords) {
                fetchRecords(listAppId.HolidayMaster).then(function (
                    HolidayMaster
                ) {
                    viewDetail(
                        attendanceRecords,
                        leaveRecords,
                        OTRecords,
                        HolidayMaster
                    );
                });
            });
        });
    });
}
function ExportCSV() {
    var param = getParam();
    var start = moment(param.start);
    var end = moment(param.end);

    var file_name =
        start.format("YYYYMMDD") +
        "-" +
        end.format("YYYYMMDD") +
        "-SALES SUMMARY REPORT" +
        ".xls";
    var tab_text =
        '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"></head><body>';

    tab_text =
        tab_text +
        `<div
                style="
                    font-weight: bold;
                    font-size: 20px;
                    text-align: center;
                    padding-bottom: 10px;"
                > BÁO CÁO TỔNG HỢP/SUMMARY REPORT</div>`;
    tab_text =
        tab_text +
        `<div
                style="
                    font-weight: bold;
                    font-size: 16px;
                    text-align: center;
                    padding-bottom: 10px;
                "
            >
                Thời gian/Timming: ` +
        start.format("YYYY/MM/DD") +
        "-" +
        end.format("YYYY/MM/DD") +
        `
            </div>`;
    var header =
        `<table border="1"><tr style="font-size: 18px;
                font-weight: bold;
                background-color: #f1d769;">` +
        `<td  style="width: 200px;;text-align: center;">Staff Name</td>` +
        `<td  style="width: 200px;;text-align: center;">Department</td>` +
        `<td  style="width: 200px;;text-align: center;">Working Hours</td>` +
        `<td  style="width: 200px;;text-align: center;">Overtime Hours</td>` +
        `<td  style="width: 200px;;text-align: center;">Leave Off Hours</td>` +
        `<td  style="width: 200px;;text-align: center;">Salary Hours</td></tr>`;
    tab_text = tab_text + header;
    dataToShow.forEach((staff) => {
        var staffRow = "<tr>";
        let totalWorkingHour = "";
        let totalOTHour = "";
        let totalOffHour = "";
        staff.listReport.forEach((report) => {
            totalWorkingHour = addHour(
                totalWorkingHour,
                report.work_hour.value
            );
            totalOTHour = addHour(totalOTHour, report.ot_hour.value);
            totalOffHour = addHour(totalOffHour, report.off_hour.value);
        });
        staffRow =
            staffRow +
            `<td style="width: 100px;text-align: center;font-size: 16px;">` +
            staff.name +
            `</td>`;
        staffRow =
            staffRow +
            `<td style="width: 100px;text-align: center;font-size: 16px;">` +
            staff.department_name +
            `</td>`;
        staffRow =
            staffRow +
            `<td style="width: 100px;text-align: center;font-size: 16px;">` +
            timeToHour(totalWorkingHour) +
            `</td>`;
        staffRow =
            staffRow +
            `<td style="width: 100px;text-align: center;font-size: 16px;">` +
            timeToHour(totalOTHour) +
            `</td>`;
        staffRow =
            staffRow +
            `<td style="width: 100px;text-align: center;font-size: 16px;">` +
            timeToHour(totalOffHour) +
            `</td>`;
        staffRow =
            staffRow +
            `<td style="width: 100px;text-align: center;font-size: 16px;">` +
            "0" +
            `</td></tr>`;
        tab_text = tab_text + staffRow;
    });
    tab_text = tab_text + "</table></body></html>";
    var universalBOM = "\uFEFF";
    var data_type = "data:application/vnd.ms-excel,charset=utf-8";
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        txtArea1.document.open("txt/html", "replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus();
        sa = txtArea1.document.execCommand("SaveAs", true, file_name);
    } else {
        var a = document.createElement("a");
        a.href = data_type + ", " + encodeURIComponent(universalBOM + tab_text);
        a.download = file_name;
        a.click();
        a.remove();
    }
}
function viewDetail(attendanceRecords, leaveRecords, OTRecords, HolidayMaster) {
    var param = getParam();
    var start = moment(param.start);
    var end = moment(param.end);

    // console.log(start)
    // console.log(end)
    // console.log(OTRecords)

    var index = 0;
    while (start <= end) {
        var tr = $('<div class="row col-12 px-0 py-0 divEdit"></div>');
        if (start.day() == 6) {
            tr.addClass("sat");
        }
        if (start.day() == 0) {
            tr.addClass("sun");
        }
        if (index % 2 == 0) {
            tr.addClass("even custom-hover");
        } else {
            tr.addClass("odd custom-hover");
        }
        index++;
        var check = false;
        var thisDate = start.clone();
        if (HolidayMaster.length > 0) {
            HolidayMaster.forEach((item) => {
                // nếu là ngày nghỉ lễ
                if (item.date.value == thisDate.format("YYYY-MM-DD")) {
                    tr.append(
                        $(
                            '<div class="first holiday col-2 custom-border3">' +
                                thisDate.format("MM/DD") +
                                " (" +
                                thisDate.format("ddd") +
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
        if (check == false)
            tr.append(
                $(
                    '<div class="first col-2 px-0 custom-border3">' +
                        thisDate.format("MM/DD") +
                        " (" +
                        thisDate.format("ddd") +
                        ") " +
                        "</div>"
                )
            );

        start.add(1, "days");
    }
    return;
    for (
        var thisDay = start;
        thisDay <= end;
        thisDay.setDate(thisDay.getDate() + 1)
    ) {
        var check = false;
        var datec = thisDay.toISOString().substring(0, 10);

        // không phải là ngày nghỉ lễ
        if (check == false)
            tr.append(
                $(
                    '<div class="first col-2 px-0 custom-border3">' +
                        fm(thisDay.getMonth() + 1) +
                        "/" +
                        fm(thisDay.getDate()) +
                        " (" +
                        thu[thisDay.getDay()] +
                        ")" +
                        "</div>"
                )
            );

        var obj = null;
        // nếu có data trong ngày thì gán data cho obj
        for (var x = 0; x < attendanceData.length; x++) {
            var v1 =
                thisDay.getFullYear() +
                "-" +
                fm(thisDay.getMonth() + 1) +
                "-" +
                fm(thisDay.getDate());
            if (v1 === attendanceData[x].date.value) {
                obj = attendanceData[x];
                break;
            }
        }
        for (var x = 0; x < leaveOffData.length; x++) {
            var v1 =
                thisDay.getFullYear() +
                "-" +
                fm(thisDay.getMonth() + 1) +
                "-" +
                fm(thisDay.getDate());
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
            ")"
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
                    app: listAppId.LeaveOffManagement,
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
function changeLanguage() {
    var e = document.getElementById("lang");
    if (e) {
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
                    dayNamesMin: [
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                    ],
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
                        currentDate = new Date(date);
                        setText();
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
                    dayNamesShort: [
                        "CN",
                        "Hai",
                        "Ba",
                        "Tư",
                        "Năm",
                        "Sáu",
                        "Bảy",
                    ],
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
                        currentDate = new Date(date);
                        setText();
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
}
function onClickMove(e) {
    var action = $(this).attr("data-action");
    if (action == "show-pick") {
        return false;
    }
    if (action == "move-next") {
        if (viewName == "month") {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        if (viewName == "week") {
            currentDate.setTime(currentDate.getTime() + 7 * 24 * 3600000);
        }
        if (viewName == "day") {
            currentDate.setTime(currentDate.getTime() + 1 * 24 * 3600000);
        }
    }
    if (action == "move-prev") {
        if (viewName == "month") {
            currentDate.setMonth(currentDate.getMonth() - 1);
        }
        if (viewName == "week") {
            currentDate.setTime(currentDate.getTime() - 7 * 24 * 3600000);
        }
        if (viewName == "day") {
            currentDate.setTime(currentDate.getTime() - 1 * 24 * 3600000);
        }
    }
    if (action == "move-today") {
        currentDate = new Date();
    }
    setText();
}
function getListStaff(appId, dep, opt_offset, opt_limit, opt_records) {
    var offset = opt_offset || 0;
    var limit = opt_limit || 100;
    var allRecords = opt_records || [];
    var strListDepartment = "";
    if (dep) {
        strListDepartment = "department_id in (";
        for (let i = 0; i < dep.length - 1; i++)
            strListDepartment += '"' + dep[i] + '",';
        strListDepartment += '"' + dep[dep.length - 1] + '")';
    }
    var query = strListDepartment + " limit " + limit + " offset " + offset;
    var params = { app: appId, query: query };
    return kintone.api("/k/v1/records", "GET", params).then(function (resp) {
        allRecords = allRecords.concat(resp.records);
        if (resp.records.length === limit) {
            return getListStaff(appId, dep, offset + limit, limit, allRecords);
        } else ready = true;
        return allRecords;
    });
}
function fetchRecordsFromTo(
    appId,
    list_cw_id,
    from,
    to,
    opt_offset,
    opt_limit,
    opt_records
) {
    var offset = opt_offset || 0;
    var limit = opt_limit || 100;
    var allRecords = opt_records || [];
    var query = "";
    strListStaff = "and cw_id in (";
    for (let i = 0; i < list_cw_id.length - 1; i++)
        strListStaff += '"' + list_cw_id[i] + '",';
    strListStaff += '"' + list_cw_id[list_cw_id.length - 1] + '")';
    if (from && to)
        query =
            'date<="' +
            to +
            '" and date>="' +
            from +
            '" ' +
            strListStaff +
            " limit " +
            limit +
            " offset " +
            offset;
    else
        query =
            'date="' +
            moment().format("YYYY-MM-DD") +
            '" ' +
            'and cw_id = "' +
            cw_id +
            '"';
    " limit " + limit + " offset " + offset;

    var params = {
        app: appId,
        query: query,
    };
    return kintone.api("/k/v1/records", "GET", params).then(function (resp) {
        allRecords = allRecords.concat(resp.records);
        if (resp.records.length === limit) {
            return fetchRecordsFromTo(
                appId,
                cw_id,
                from,
                to,
                offset + limit,
                limit,
                allRecords
            );
        } else ready = true;
        return allRecords;
    });
}
function onClickMenu(e) {
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
    setText();
}
function setText() {
    $("#dateRange").text("");
    if (viewName == "month") {
        text = currentDate.getFullYear() + "/" + fm(currentDate.getMonth() + 1);
    }
    if (viewName == "week") {
        var week = getWeek();
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
            currentDate.getFullYear() +
            "/" +
            fm(currentDate.getMonth() + 1) +
            "/" +
            fm(currentDate.getDate());
    }
    $("#dateRange").text(text);
}
function getParam() {
    var start = "";
    var end = "";
    if (viewName == "month") {
        var firstDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );
        start =
            firstDate.getFullYear() +
            "-" +
            fm(firstDate.getMonth() + 1) +
            "-" +
            fm(firstDate.getDate());
        var lastDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
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
            currentDate.getFullYear() +
            "-" +
            fm(currentDate.getMonth() + 1) +
            "-" +
            fm(currentDate.getDate());
        end =
            currentDate.getFullYear() +
            "-" +
            fm(currentDate.getMonth() + 1) +
            "-" +
            fm(currentDate.getDate());
    }
    return {
        start: start,
        end: end,
        list: $("#brandsMulti").val(),
    };
}
function getWeek(start) {
    start = start || 0;
    var day = currentDate.getDay() - start;
    var date = currentDate.getDate() - day;
    var StartDate = new Date(currentDate.setDate(date));
    var EndDate = new Date(StartDate.getTime() + 6 * 24 * 3600000);
    return [StartDate, EndDate];
}
function fetchRecords(appId, opt_offset, opt_limit, opt_records) {
    var offset = opt_offset || 0;
    var limit = opt_limit || 100;
    var allRecords = opt_records || [];
    var query = "limit " + limit + " offset " + offset;
    var params = { app: appId, query: query };
    return kintone.api("/k/v1/records", "GET", params).then(function (resp) {
        allRecords = allRecords.concat(resp.records);
        if (resp.records.length === limit) {
            return fetchRecords(appId, offset + limit, limit, allRecords);
        }
        return allRecords;
    });
}
function addHour(timeA, timeB) {
    let minuteA = 0;
    let minuteB = 0;
    if (timeA != null && timeA != "") {
        arrA = timeA.split(":");
        minuteA = Number(arrA[0]) * 60 + Number(arrA[1]);
    }
    if (timeB != null && timeB != "") {
        arrB = timeB.split(":");
        minuteB = Number(arrB[0]) * 60 + Number(arrB[1]);
    }
    let total = minuteA + minuteB;
    let hour = parseInt(total / 60);
    let minute = total - hour * 60;
    return fm(hour) + ":" + fm(minute);
}
function timeToHour(time) {
    if (time == "00:00" || time == null || time == "") return 0;
    let arrTime = time.split(":");
    return (Number(arrTime[0]) + Number(arrB[1]) / 60).toFixed(1);
}
function formatData(data) {
    if (data == "" || data == "00:00" || data == null) return "-";
    return data;
}
