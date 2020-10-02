var currentDate2 = new Date();
$(document).ready(function () {
    interval2 = setInterval(() => {
        if (ready1 && ready2 && ready3 && ready4 && ready5) {
            $('#loading').hide();
            clearInterval(interval2);
            clearInterval(interval);
            setDefault2();
        }
    }, 100);
    
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
    setText2();
    $(".show-datePickcc").on("click", function () {
        $("#datePickcc").datepicker("show");
    });
    $("#menu-navicc button").on("click", onClickMove2);
    $("#menu-itemcc input").on("click", onClickMenu2);
    let select2 = document.getElementById("brandsMulti");
    dataDepartmentMaster.forEach((item) => {
        listDepartment.push(item.name.value);
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
function loadData2() {
    dataToExport = [];
    $("#showRecord2").html("");
    var listStaff = [];
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
                listStaff.push(staff.chatworkid.value);
        });
    });
    listDepartment.forEach((item) => {
        let i = 0;
        dataStaffMaster.forEach((staff) => {
            if (staff.department.value == item) {
                i++;
            }
        });
        coutStaff.push(i);
    });

    var index = 0;
    totalStaff = listStaff.length;
    $(".totalStaff").text(totalStaff + "人");
    listStaff.forEach((staff) => {
        var dataToExportStaff = [];
        var rc = "even";
        if (index % 2 == 0) {
            rc = "odd";
        }
        index++;
        var tr = $("<tr></tr>");
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
                    `<td style="text-align:left;" class="stn">` +
                    staffInfo.staffname.value +
                    "</td>"
                )
            );
            tr.append($("<td>" + staffInfo.department.value + "</td>"));
            tr.append($('<td class="wt">' + stafflWorkTime + "</td>"));
            tr.append($('<td class="ot">' + staffOT + "</td>"));
            tr.append($('<td class="offtime">' + staffOffTime + "</td>"));
            tr.append(
                $(
                    `<td class=\"chatworkid\" chatworkid=\"` +
                    staffInfo.chatworkid.value +
                    `\" ><i class="fas fa-caret-down"></i><i style="display:none" class="fas fa-caret-up"></i> </td>`
                )
            );
        } else {
            tr.append(
                $(
                    `<td style="text-align:left;" class="stn">` +
                    staffInfo.staffname.value +
                    "</td>"
                )
            );
            tr.append($("<td>" + staffInfo.department.value + "</td>"));
            tr.append($('<td class="wt">&nbsp-&nbsp</td>'));
            tr.append($('<td class="ot">&nbsp-&nbsp</td>'));
            tr.append($('<td class="offtime">' + staffOffTime + "</td>"));
            tr.append(
                $(
                    `<td class=\"chatworkid\" chatworkid=\"` +
                    staffInfo.chatworkid.value +
                    `\" ><i class="fas fa-caret-down"></i><i style="display:none" class="fas fa-caret-up"></i> </td>`
                )
            );
        }
        $(".fa-caret-down")
            .off("click")
            .on("click", function () {
                var chatworkid = $(this)
                    .parent(".chatworkid")
                    .attr("chatworkid");
                $tr = $(this).parents("tr");
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

                $(this).parents('tr').next().hide();
            });
    });
}
function viewDetail2($tr, chatworkid) {
    $tr.find('.fa-caret-down').hide();
    $tr.find('.fa-caret-up').show();
    console.log(dataStaffMaster);
    $table = $("<div class='border'></div>");
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
        var tr = $('<div class="row divEdit" style="width:100%"></div>');
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
        var datec = daye.toISOString().substring(0, 10);
        if (dataHolidayMaster.length > 0) {
            dataHolidayMaster.forEach((item) => {
                // nếu là ngày nghỉ lễ
                if (item.date.value == datec) {
                    tr.append(
                        $(
                            '<div class="first holiday col-md-2 col-sm-6">' +
                            fm(daye.getMonth() + 1) +
                            "/" +
                            fm(daye.getDate()) +
                            " (" +
                            thu[daye.getDay()] +
                            ") </br><span style='font-size:12px;color:red;'>(" +
                            item.description.value +
                            ")</span></td>"
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
                    '<div class="first col-md-2 col-sm-6">' +
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
                        '<div class="col-md-2 col-sm-6">' +
                        `<span class="badge gradient-bloody text-white shadow">Off</span>` +
                        "</div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="reason col-md-7 col-sm-10">' +
                        obj.reason.value +
                        "</div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="col-md-1 col-sm-2">' +
                        '<i class="fa fa-pencil" aria-hidden="true"></i><i class="fa fa-save" style="display:none"></i>' +
                        "</div>"
                    )
                );
                tr.append(
                    $('<div style="display:none">' + obj.$id.value + "</div>")
                );
            } // làm việc bth
            else {
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
                        '<div class="col-md-2 col-sm-6">' +
                        `<span ` +
                        normal +
                        ` class="badge gradient-quepal text-white shadow">Normal</span>` +
                        "&nbsp" +
                        `<span ` +
                        checkfull +
                        ` class="badge notfull text-white shadow">Not Full</span>` +
                        "&nbsp" +
                        `<span  ` +
                        checkot +
                        `  class="badge gradient-blooker text-white shadow">OT</span>` +
                        "</div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="startTime col-md-2 col-sm-6">' +
                        obj.starttime.value +
                        "</div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="endTime col-md-2 col-sm-6">' +
                        obj.endtime.value +
                        "</div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="col-md-1 col-sm-3">' +
                        obj.breaktime.value +
                        "</div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="col-md-1 col-sm-3">' +
                        obj.worktime.value +
                        "</div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="col-md-1 col-sm-3">' +
                        obj.overtime.value +
                        "</div>"
                    )
                );
                tr.append(
                    $(
                        '<div class="col-md-1 col-sm-3">' +
                        '<i class="fa fa-pencil" aria-hidden="true"></i><i class="fa fa-save" style="display:none"></i>' +
                        "</div>"
                    )
                );
                tr.append(
                    $('<div style="display:none">' + obj.$id.value + "</div>")
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
                    '<div class="col-md-2 col-sm-6">' +
                    `<span class="badge notset text-white shadow ">No Data</span>` +
                    "</div>"
                )
            );
            tr.append(
                $(
                    '<div class="col-md-2 col-sm-6">' +
                    "&nbsp&nbsp-&nbsp&nbsp" +
                    "</div>"
                )
            );
            tr.append(
                $(
                    '<div class="col-md-2 col-sm-6">' +
                    "&nbsp&nbsp-&nbsp&nbsp" +
                    "</div>"
                )
            );
            tr.append(
                $(
                    '<div class="col-md-1 col-sm-3">' +
                    "&nbsp&nbsp-&nbsp&nbsp" +
                    "</div>"
                )
            );
            tr.append(
                $(
                    '<div class="col-md-1 col-sm-3">' +
                    "&nbsp&nbsp-&nbsp&nbsp" +
                    "</div>"
                )
            );
            tr.append(
                $(
                    '<div class="col-md-1 col-sm-3">' +
                    "&nbsp&nbsp-&nbsp&nbsp" +
                    "</div>"
                )
            );
            tr.append($('<div class="col-md-1 col-sm-3"></div>'));
            tr.append($('<div style="display:none"></div>'));
        }

        $table.append(tr);
    }

    // nút chỉnh sửa
    $("div i.fa-pencil")
        .off("click")
        .on("click", function () {
            $tr = $(this).parents(".divEdit");
            $id = $tr.find("div:last()").text();
            // nếu là ngày xin nghỉ
            if ($tr.find("div:nth-child(5)").text() == $id) {
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
            $(this).next("i.fa-save").show();
        });
    // nút lưu
    $("div i.fa-save")
        .off("click")
        .on("click", function () {
            $tr = $(this).parents(".divEdit");
            $id = $tr.find("div:last()").text();
            // ngày xin nghỉ
            if ($tr.find("div:nth-child(5)").text() == $id) {
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
    $newtr = $("<tr></tr>");
    $newtd = $(`<td colspan="6"></td>`);
    $cc = $(`<div class="row bg-dark" style="margin-bottom: 15px;padding:10px 15px;color:white;">
    <div class="col-md-2 col-sm-6 mdday"></div>
    <div class="col-md-2 col-sm-6 mdtype"></div>
    <div class="col-md-2 col-sm-6 mdstart"><i class="fa fa-sign-in" aria-hidden="true"></i> 
    </div>
    <div class="col-md-2 col-sm-6 mdend"><i class="fa fa-sign-out" aria-hidden="true"></i>
        </div>
    <div class="col-md-1 col-sm-3 mdrest"></div>
    <div class="col-md-1 col-sm-3 mdwork"></div>
    <div class="col-md-1 col-sm-3 mdot"></div>
    <div class="col-md-1 col-sm-3"></div>
    </div>`);
    $newtd.append($cc);
    $newtd.append($table);
    $newtr.append($newtd);
    $newtr.insertAfter($tr.closest("tr"));
    $(".mdday").text("日付");
    $(".mdtype").text("タグ");
    $(".mdstart").text("出勤時刻");
    $(".mdend").text("退勤時刻");
    $(".mdrest").text("休憩時間");
    $(".mdwork").text("労働時間");
    $(".mdot").text("残業時間");
}
