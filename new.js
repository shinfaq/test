$(document).ready(function () {
    var listId = Object.keys(cybozu.data.page.FORM_DATA.schema.table.fieldList)
    console.log(JSON.stringify(cybozu.data.page.FORM_DATA.schema.table.fieldList));
    if (cybozu.data['LOGIN_USER'].locale == 'en') {
        var listText = [
            "Id",
            "Updated by",
            "Created by",
            "Updated datetime",
            "Created datetime",
            "Status",
            "Assignee",
            "Categories",
            "Shift Name",
            "Start Time",
            "End Time"
        ];
        for (let i = 0; i < listId.length; i++) {
            let lb = ".label-" + listId[i];
            $(lb).find(".recordlist-header-label-gaia").text(listText[i])
        }
    }
    if (cybozu.data['LOGIN_USER'].locale == 'ja') {
        var listText = [
            "レコード番号",
            "Updated by",
            "Created by",
            "Updated datetime",
            "Created datetime",
            "Status",
            "Assignee",
            "Categories",
            "シフト名",
            "開始時刻",
            "終了時刻",


        ];
        for (let i = 0; i < listId.length; i++) {
            let lb = ".label-" + listId[i];
            $(lb).find(".recordlist-header-label-gaia").text(listText[i])
        }
    }
})