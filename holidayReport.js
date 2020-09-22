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
$(document).ready(function () {
    $('body').removeClass('body-top');
    appendOption()

    fetchRecords(listAppId.StaffMaster).then(function (records) {
        dataStaffMaster = records;
    });
    var year = $('#selectYear').val();
    getData(currDay.getFullYear());
    setTimeout(() => {
        showData(year)
    }, 500);
    $('#selectYear').change(function(){
        setData()
    })
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
    for (let i = startReportYear; i <= currDay.getFullYear(); i++) {
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
        return allRecords;
    });
}
function showData(year) {
    $showData = $("#showData");
    $showData.html('');
    console.log(dataHolidayManagement);
    dataStaffMaster.forEach(staff => {
        var staffHoliday = [];
        dataHolidayManagement.forEach(item =>{
            if(item.chatworkid.value==staff.chatworkid.value){
                item.month =parseInt(item.date.value.substr(5,2));
                staffHoliday.push(item);
            }

        })
        $div = $(`<div class="row"></div>`);
        $div1 = $(`<div class="col-6 row"></div>`);
        $div1.append(`<div class="col-3">` + staff.staffname.value + `</div>`);
        $div1.append(`<div class="col-3">` + staff.department.value + `</div>`);
        $div1.append(`<div class="col-3">` + staff.startworkdate.value + `</div>`);
        var selectYearBegin = new Date(year, 0, 2)
        var startWorkDay = new Date(staff.startworkdate.value)
        var monthsWork = 0;
        if(startWorkDay.getFullYear()>year){
            monthsWork = 0;
        }
        else if (startWorkDay > selectYearBegin)
            monthsWork = 12 - (startWorkDay.getMonth() - 1);
        else 
            monthsWork = 12;
        $div1.append(`<div class="col-1">` + monthsWork + `</div>`);
        $div1.append(`<div class="col-1">` + monthsWork + `</div>`);
        $div2 = $(`<div class="col-6 row"></div>`);
        var totalOff = 0;
        for(let i = 1;i<=12;i++){
            var cout = 0;
            staffHoliday.forEach(holiday =>{
                if(holiday.month==i)
                    cout++;
            })
            totalOff+= cout
            $div2.append(`<div class="col-1">` + cout + `</div>`);
        }
        var remaining = monthsWork- totalOff
        $div1.append(`<div class="col-1">` +remaining + `</div>`);
        $showData.append($div1);
        $showData.append($div2);
    })
}
function setData() {
    var year = $('#selectYear').val();
    getData(year);
    setTimeout(() => {
        showData(year);
    }, 500);
}