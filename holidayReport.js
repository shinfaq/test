var listAppId = {
    AttendanceManagement: "5015",
    DepartmentMaster: "5081",
    HolidayMaster: "5073",
    StaffMaster: "5017",
    HolidayManagement: "5016",
    ShiftMaster: "5013",
};
var dataHolidayManagement = [];
var dataStaffMaster = [];
var startReportYear = 2000;
var currDay = new Date();
var ready = false;
var optionVal = "type2"
var listId = Object.keys(cybozu.data.page.FORM_DATA.schema.table.fieldList)
$(document).ready(function () {
    $('.gaia-argoui-app-index-pager-content').hide();
    if (cybozu.data['LOGIN_USER'].locale == 'en') {
        var listText = [
            "レコード番号",
            "Updated by",
            "Created by",
            "Updated datetime",
            "Created datetime",
            "Status",
            "Assignee",
            "Categories",
            "Chatwork ID",
            "日付",
            "理由",
            "Staff Infor",
            "Id",
            "分類"
        ];
        for (let i = 0; i < listId.length; i++) {
            let lb = ".label-" + listId[i];
            $(lb).find(".recordlist-header-label-gaia").text(listText[i])
        }
        $('.title').html("振替休・有休管理/Compensatory leave・Anual Leave Management");
        $('.txtYear').text("年度")
        $('.txtOption1').text(" 振替休")
        $('.txtOption2').text(" 有休")
        $('.txtName').text("名前/Name")
        $('.txtDpm').text("部署/Department")
        $('.txtStartWork').text("入社日/Starting date")
        $('.txtWorkMonth').text("働いた月数/Number of months worked")
        $('.txtOff').text("有休日数/Number of paid leave")
        $('.txtOffUsed').text("有休残高/Paid leave balance")
        $('.txtMonthly').text("毎月の使用日数/Monthly usage days")
        $('.txtRp').text("報告日/Report date: ")
        $('.pdf').text("PDF")
    }
    if (cybozu.data['LOGIN_USER'].locale == 'ja') {
        console.log(JSON.stringify(cybozu.data.page.FORM_DATA.schema.table.fieldList));
        var listText = [
            "レコード番号(jp)",
            "Updated by(jp)",
            "Created by(jp)",
            "Updated datetime(jp)",
            "Created datetime(jp)",
            "Status(jp)",
            "Assignee(jp)",
            "Categories(jp)",
            "Chatwork ID(jp)",
            "日付(jp)",
            "理由(jp)",
            "Staff Infor(jp)",
            "Id(jp)",
            "分類(jp)"
        ];
        for (let i = 0; i < listId.length; i++) {
            let lb = ".label-" + listId[i];
            $(lb).find(".recordlist-header-label-gaia").text(listText[i])
        }
        $('.title').html("振替休・有休管理/Compensatory leave・Anual Leave Management");
        $('.txtYear').text("年度(jp)")
        $('.txtOption1').text(" 振替休(jp)")
        $('.txtOption2').text(" 有休(jp)")
        $('.txtName').text("名前/Name")
        $('.txtDpm').text("部署/Department")
        $('.txtStartWork').text("入社日/Starting date")
        $('.txtWorkMonth').text("働いた月数/Number of months worked")
        $('.txtOff').text("有休日数/Number of paid leave")
        $('.txtOffUsed').text("有休残高/Paid leave balance")
        $('.txtMonthly').text("毎月の使用日数/Monthly usage days")
        $('.txtRp').text("報告日/Report date: ")
        $('.pdf').text("PDF")
    }
    $(".txtRpDay").text(formatDay(currDay))
    $('body').removeClass('body-top');
    appendOption()

    fetchRecords(listAppId.StaffMaster).then(function (records) {
        dataStaffMaster = records;
    });
    var year = $('#selectYear').val();
    getData(currDay.getFullYear());
    interval = setInterval(() => {
        if (ready == true) {
            showData(year);
            clearInterval(interval)
        }
    }, 10);
    $('#selectYear').change(function () {
        setData()
    })
    $("#type1")
        .change(function () {
            if ($(this).is(":checked")) {
                optionVal = $(this).val();

                setData()
            }
        });
    $("#type2")
        .change(function () {
            if ($(this).is(":checked")) {
                optionVal = $(this).val();

                setData()
            }
        });
});
function getData(year) {
    var startDate = new Date(year, 0, 2);
    var startStr = startDate.toISOString().substr(0, 10);
    var endDate = new Date(year, 11, 32);
    var endStr = endDate.toISOString().substr(0, 10);
    fetchRecordsFromTo(listAppId.HolidayManagement, startStr, endStr).then(function (records) {
        dataHolidayManagement = records;
    });
}
function appendOption() {
    for (let i = currDay.getFullYear(); i >= startReportYear; i--) {
        let selected = "";
        if (i == currDay.getFullYear())
            selected = " selected";
        let option = `<option` + selected + ` value="` + i + `">` + i + `</option>`;
        $("#selectYear").append(option);
    }

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
function fetchRecordsFromTo(appId, from, to, opt_offset, opt_limit, opt_records) {
    var offset = opt_offset || 0;
    var limit = opt_limit || 100;
    var allRecords = opt_records || [];
    var params = { app: appId, query: 'date<="' + to + '" and date>="' + from + '" limit ' + limit + ' offset ' + offset };
    return kintone.api('/k/v1/records', 'GET', params).then(function (resp) {
        allRecords = allRecords.concat(resp.records);
        if (resp.records.length === limit) {
            return fetchRecordsFromTo(appId, from, to, offset + limit, limit, allRecords);
        }
        else ready = true;
        return allRecords;
    });
}
function showData(year) {
    $showData = $("#showData");
    $showData.html('');
    var index = 1;
    if (optionVal == "type2")
        $('.txtOff').text("有休日数/Number of paid leave")
    if (optionVal == "type1")
        $('.txtOff').text("振替休日数/Number of Compensatory leave")
    dataStaffMaster.forEach(staff => {
        var staffHoliday = [];
        dataHolidayManagement.forEach(item => {
            if (item.chatworkid.value == staff.chatworkid.value) {
                item.month = parseInt(item.date.value.substr(5, 2));
                staffHoliday.push(item);
            }
        })
        $div = $(`<div class="row rmv line "></div>`);
        if (index % 2 == 0) {
            $div.addClass('even')
        }
        else
            $div.addClass('odd')
        index++
        $div1 = $(`<div class="col-12 row col-sm-3 rmv pl-0 pr-0"></div>`);
        $div1.append(`<div class="col-4 col-sm-4 bd stn pl-0 pr-0">` + staff.staffname.value + `</div>`);
        $div1.append(`<div class="col-4 col-sm-4 bd pl-0 pr-0">` + staff.department.value + `</div>`);
        $div1.append(`<div class="col-4 col-sm-4 bd pl-0 pr-0">` + staff.startworkdate.value + `</div>`);
        var startWorkDay = new Date(staff.startworkdate.value)
        var monthsWork = 0;
        var totalMonthsWork = 0;
        if (optionVal == "type2") {
            if (year == currDay.getFullYear()) {
                if (startWorkDay.getFullYear() == year) {
                    monthsWork = currDay.getMonth() - startWorkDay.getMonth() + 1;
                }
                else if (startWorkDay.getFullYear() == (year - 1)) {
                    monthsWork = currDay.getMonth() + 12 - startWorkDay.getMonth();
                }
                else if (startWorkDay.getFullYear() < (year - 1)) {
                    monthsWork = 12;
                }
                else {
                    monthsWork = currDay.getMonth() + 1;
                }

            }
            else if (year == startWorkDay.getFullYear()) {
                monthsWork = 12 - startWorkDay.getMonth();
            }
            else if (startWorkDay.getFullYear() < year)
                monthsWork = 12;
            else
                monthsWork = "-";
            var extendMonth = Math.floor((year - startWorkDay.getFullYear()) / 5);
            if (extendMonth > 0)
                monthsWork += extendMonth
            // if(year >= startWorkDay.getFullYear()){
            //     if(startWorkDay.getFullYear() == currDay.getFullYear()){
            //         monthsWork = currDay.getMonth() - startWorkDay.getMonth() + 1;
            //     }
            //     else monthsWork = 12;
            // }
            // else
            //     monthsWork = 0;
        }
        if (startWorkDay.getFullYear() == currDay.getFullYear()) {
            totalMonthsWork = currDay.getMonth() + 1;
        }
        else {
            totalMonthsWork = currDay.getMonth() + 1 + 12 * (currDay.getFullYear() - startWorkDay.getFullYear() - 1) + 12 - (startWorkDay.getMonth() + 1);
        }
        // if(optionVal=="type1"){
        //     monthsWork=parseInt( staff.compensatoryOff.value)/8;
        // }
        // else
        //     monthsWork=parseInt( staff.annualOff.value)/8;
        $div1a = $(`<div class="col-12 row col-sm-3 rmv pl-0 pr-0"></div>`);
        $div1a.append(`<div class="col-4 bd pl-0 pr-0">` + totalMonthsWork + `</div>`);
        $div1a.append(`<div class="col-4 bd pl-0 pr-0">` + monthsWork + `</div>`);

        $div2 = $(`<div class="col-12 row col-sm-6 rmv pl-0 pr-0"></div>`);
        var totalOff = 0;
        for (let i = 1; i <= 12; i++) {
            var cout = 0;
            staffHoliday.forEach(holiday => {
                if (holiday.month == i)
                    cout++;
            })
            totalOff += cout
            if (cout == 0)
                $div2.append(`<div class="col-1 bd pl-0 pr-0">` + "-" + `</div>`);
            else
                $div2.append(`<div class="col-1 bd pl-0 pr-0">` + cout + `</div>`);
        }
        var remaining;
        if (monthsWork != '-')
            remaining = monthsWork - totalOff;
        else
            remaining = "-";
        if (remaining < 0 && remaining != "-")
            $div1a.append(`<div class="col-4 bd pl-0 pr-0 negative">` + remaining + `</div>`);
        else
            $div1a.append(`<div class="col-4 bd pl-0 pr-0">` + remaining + `</div>`);
        $div.append($div1);
        $div.append($div1a);
        $div.append($div2);
        $('#loading').hide();
        $showData.append($div);

    })
}
function setData() {
    ready = false;
    var year = $('#selectYear').val();
    $('#loading').show();
    getData(year);
    interval = setInterval(() => {
        if (ready == true) {
            showData(year);
            clearInterval(interval)
        }
    }, 10);

}
function formatDay(day) {
    dayToFormat = new Date(day);
    return dayToFormat.getFullYear() +
        "年" +
        fm(dayToFormat.getMonth() + 1) +
        "月" +
        fm(dayToFormat.getDate()) +
        "日";
}
function fm(n) {
    return n < 10 ? "0" + n : n;
}
function exportPDF() {
    var text = "Report_" + currDay.toISOString().substr(0, 10) + ".pdf";
    var opt = {
        margin: 1,
        filename: text,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    const exportData = document.getElementById("pdfData");
    html2pdf().set(opt).from(exportData).save();
}    