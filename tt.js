(function() {

    'use strict';

    /* global $ */
    /* global kintone */
    /* global XLSX */
    /* global saveAs */
    /* global Blob */
    var CYB = {};
    
    // Kintone fields to export in the xlsx file
    CYB.cols = ['chatworkid', 'staffname'];

    // Create element
    var createElement = function(parent, element, id, objcss, objattr, html) {
        var el = $('<' + element + '>');

        el.attr('id', id);
        if (objcss) { el.css(objcss); }
        if (objattr) { el.attr(objattr); }
        if (html) { el.html(html); }
        $(parent).append(el);
    };

    // Search within the Kintone records
    function fetchRecords(appId, query, opt_offset, opt_limit, opt_records) {
        var offset = opt_offset || 0,
            limit = opt_limit || 100,
            allRecords = opt_records || [],
            params = {app: appId, query: query + ' limit ' + limit + ' offset ' + offset};

        return kintone.api('/k/v1/records', 'GET', params).then(function(resp) {
            allRecords = allRecords.concat(resp.records);
            if (resp.records.length === limit) {
                return fetchRecords(appId, query, offset + limit, limit, allRecords);
            }
            return allRecords;
        });
    }

    // String to array buffer
    var s2ab = function(s) {
        var buf = new ArrayBuffer(s.length),
            view = new Uint8Array(buf);

        for (var i = 0; i !== s.length; i += 1) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }

        return buf;
    };

    // Create the xlsx file
    var makeExcelFile = function() {
        var wopts, workbook, wbout, nodelist, node;

        wopts = {
            bookType: 'xlsx',
            bookSST: false,
            type: 'binary'
        };

        workbook = {SheetNames: [], Sheets: {}};
        nodelist = document.querySelectorAll('table.table-to-export');
        node = Array.prototype.slice.call(nodelist, 0);

        node.forEach(function(currentValue, index) {
            var n = currentValue.getAttribute('data-sheet-name');

            if (!n) { n = 'Sheet' + index; }
            workbook.SheetNames.push(n);
            workbook.Sheets[n] = XLSX.utils.table_to_sheet(currentValue, wopts);
        });

        wbout = XLSX.write(workbook, wopts);

        saveAs(new Blob([s2ab(wbout)], {type: 'application/octet-stream'}), 'test.xlsx');
    };

    // Operations to run when the Excel export view is opened
    var indexDisplayMakeExcelElement = function(el) {
        var tab, trname, tdname;

        $('#dl-xlsx').click(makeExcelFile);

        // Get all Kintone data
        return fetchRecords(kintone.app.getId(), '$id>0').then(function(resrec) {

            if (resrec.length < 1) {

                throw new Error('There are no records');

            } else {

                tab = $('#tabrecs')[0];

                // Export Kintone data to a table
                for (var i = 0; i < resrec.length; i += 1) {

                    trname = 'tr' + i;
                    createElement(tab, 'tr', trname);

                    for (var j = 0; j < CYB.cols.length; j += 1) {
                        tdname = trname + 'td' + j;
                        createElement($('#' + trname)[0], 'td', tdname,
                            {'border-width': 'thin', 'border-style': 'solid'},
                            null, resrec[i][CYB.cols[j]].value.replace(/\r?\n/g, '<br>'));
                    }
                }
            }

            return;

        }).catch(function(dep) {

            console.log(dep);

        });

    };

    
    // List view show event
    kintone.events.on(['app.record.index.show'], function(ev) {
        if ($('#dl-xlsx').length > 0) {indexDisplayMakeExcelElement();}
        return;
    });

})();