var request = require('request');
var prompt = require('prompt');
var async = require('async');
var Excel = require('exceljs');
var schema = {
    properties: {
        status: {
            default: 'all'
        },
        excel: {
            description: 'input csv name',
            default: 'full.xlsx'
        }
    }
};
var options = {
    filename:  './full.xlsx',
    useStyles: true,
    useSharedStrings: true
};
var workbook = new Excel.stream.xlsx.WorkbookWriter(options);
workbook.creator = 'Me';
workbook.lastModifiedBy = 'Me';
workbook.created = new Date();
workbook.modified = new Date();
workbook.views = [
    {
    x: 0, y: 0, width: 10000, height: 20000,
    firstSheet: 0, activeTab: 0, visibility: 'visible'
    }
];
var array_sheet = ['FULL', 'vinh.tran', 'thuan.ho', 'trinh.nguyent', 'song.truong', 'quynh.hoang', 'phuong.tran', 'nguyen.tran', 'minh.nguyen', 'linh.tranh', 'hoang.nguyen', 'hao.le', 'duy.phan', 'dat.pham', 'dat.huynh', 'chuong.vo', 'chuong.nguyen'];
var worksheets = {};
var row_count = {};
array_sheet.forEach(function(sheetName){
    addWorkSheet(workbook, sheetName);
    worksheets[sheetName] = workbook.getWorksheet(sheetName);
    row_count[sheetName] = 1;
})
module.exports = function(params){
    
    prompt.start();
    prompt.get(schema, function (err, result) {
        var startAt = 0;
        var total = 50  
        async.whilst(
            function () { return startAt < total; },
            function (callback) {
               request({
                    url: 'https://issues.qup.vn/rest/api/2/search?startAt='+startAt+'&jql=key in (QTX-19865, QTX-19511, QTX-19512, QTX-19513, QTX-19509, QTX-19561, QTX-19759, QTX-19758, QTX-17652, QTX-19154, QTX-19183, QTX-19754, QTX-19753, QTX-19562, QTX-19563, QTX-19614, QTX-19615, QTX-19871, QTX-19916, QTX-19370, QTX-19609, QTX-19610, QTX-19704, QTX-19705, QTX-19855, QTX-19663, QTX-19917, QTX-19574, QTX-19918, QTX-19846, QTX-19774, QTX-16252, QTX-19868, QTX-17338, QTX-19749, QTX-19731, QTX-18914, QTX-18938, QTX-19838, QTX-19950, QTX-19942, QTX-19943, QTX-18890, QTX-19972, QTX-19951, QTX-19973, QTX-19930, QTX-19935, QTX-19947, QTX-19958, QTX-19980, QTX-19981, QTX-19982, QTX-19983, QTX-19984, QTX-19985, QTX-19986, QTX-19987)',
                    timeout: 10000,
                    json: true,
                    'auth': {
                        'user': params.username,
                        'pass': params.password
                    }
                }, function(error, response, result){
                    console.log('request qup done');
                    if (result && result.total) {                        
                        total = result.total;
                        startAt += 50;
                        async.forEachLimit(result.issues, 1, function(issue, cback){  
                            var rowData = {
                                key: { text: issue.key, hyperlink: 'https://issues.qup.vn/browse/' + issue.key },
                                summary: issue.fields.summary,
                                issuetype: issue.fields.issuetype.name,
                                eta: issue.fields.timeestimate + '-' + issue.fields.duedate,
                                assignee: issue.fields.assignee.name,
                                status: issue.fields.status.name,
                            }
                            setRow('FULL', rowData);  
                            setRow(rowData.assignee, rowData);    
                            if (issue.fields.issuetype.name == 'Task' && issue.fields.issuelinks.length) { 
                                var keys = '';                              
                                async.forEach(issue.fields.issuelinks, function(linkIssue, cback){
                                    if (linkIssue.type.name == 'Relates') {
                                        //get issues detail 
                                        keys += ',' + (linkIssue.outwardIssue ? linkIssue.outwardIssue.key : linkIssue.inwardIssue.key);
                                        cback();
                                    } else {
                                        cback();
                                    }                                    
                                }, function(){
                                    if (keys) {
                                        keys = keys.substr(1);
                                        request({
                                            url: 'https://issues.qup.vn/rest/api/2/search?jql=key in ('+keys+')',
                                            timeout: 10000,
                                            json: true,
                                            'auth': {
                                                'user': params.username,
                                                'pass': params.password
                                            }
                                        }, function(error, response, result){
                                            console.log('request dev done', keys);
                                            if (result && result.total) {
                                                async.forEachLimit(result.issues, 1, function(issueDev, cback){  
                                                    if (issueDev.fields.subtasks.length) {
                                                        var rowData = {
                                                            key: { text: issue.key + ' => ' + issueDev.key, hyperlink: 'https://issues.qup.vn/browse/' + issueDev.key },
                                                            summary: issueDev.fields.summary,
                                                            issuetype: issueDev.fields.issuetype.name,
                                                            eta: issueDev.fields.timeestimate + '-' + issueDev.fields.duedate,
                                                            assignee: issueDev.fields.assignee.name,
                                                            status: issueDev.fields.status.name,
                                                        }
                                                        setRow('FULL', rowData); 
                                                        setRow(rowData.assignee, rowData); 
                                                        var subTasksKeys = '';
                                                        async.forEach(issueDev.fields.subtasks, function(subTask, cback){
                                                            subTasksKeys += ',' + subTask.key;
                                                            cback();
                                                        }, function(){
                                                            if (subTasksKeys) {
                                                                subTasksKeys = subTasksKeys.substr(1);
                                                                request({
                                                                    url: 'https://issues.qup.vn/rest/api/2/search?jql=key in ('+subTasksKeys+')',
                                                                    timeout: 10000,
                                                                    json: true,
                                                                    'auth': {
                                                                        'user': params.username,
                                                                        'pass': params.password
                                                                    }
                                                                }, function(error, response, result){
                                                                    console.log('request dev-subtasks done', subTasksKeys);
                                                                    if (result && result.total) {
                                                                        async.forEach(result.issues, function(subTaskDev, cback){  
                                                                            var rowData = {
                                                                                key: { text: issue.key + ' => ' + issueDev.key + ' => ' + subTaskDev.key, hyperlink: 'https://issues.qup.vn/browse/' + subTaskDev.key },
                                                                                summary: subTaskDev.fields.summary,
                                                                                issuetype: subTaskDev.fields.issuetype.name,
                                                                                eta: subTaskDev.fields.timeestimate + '-' + subTaskDev.fields.duedate,
                                                                                assignee: subTaskDev.fields.assignee.name,
                                                                                status: subTaskDev.fields.status.name,
                                                                            }
                                                                            setRow('FULL', rowData);
                                                                            setRow(rowData.assignee, rowData); 
                                                                            cback();
                                                                        }, function(){
                                                                            cback();
                                                                        })
                                                                    } else {
                                                                        cback();
                                                                    }
                                                                })
                                                            } else {
                                                                cback();
                                                            }
                                                        })
                                                    } else {
                                                        var rowData = {
                                                            key: { text: issue.key + ' => ' + issueDev.key, hyperlink: 'https://issues.qup.vn/browse/' + issueDev.key },
                                                            summary: issueDev.fields.summary,
                                                            issuetype: issueDev.fields.issuetype.name,
                                                            eta: issueDev.fields.timeestimate + '-' + issueDev.fields.duedate,
                                                            assignee: issueDev.fields.assignee.name,
                                                            status: issueDev.fields.status.name,
                                                        }
                                                        setRow('FULL', rowData);
                                                        setRow(rowData.assignee, rowData); 
                                                        cback();
                                                    }                                                    
                                                }, function(){
                                                    cback();
                                                })
                                            } else {
                                                console.log('CANNOT GET ISSUES DETAIL', (linkIssue.outwardIssue ? linkIssue.outwardIssue.key : linkIssue.inwardIssue.key));
                                                cback();
                                            }
                                        })
                                    } else {
                                        cback()
                                    }
                                }) 
                            } else {
                                cback(); 
                            }                           
                        }, function(){
                            callback();
                        })
                    } else {
                        callback(error || response.statusCode);
                    }
                })
            },
            function (err, n) {
                if (err) {
                    console.log(err);
                }
                console.log('DONE');
                workbook.commit()
                .then(function () {
                    console.log('end write stream: %s %s', new Date().toISOString());
                    // the stream has been written
                    console.log(result.excel);
                });
            }
        );
        
    });
}
function addWorkSheet(workbook, sheetName){
    workbook.addWorksheet(sheetName, {properties: {tabColor: {argb: 'FFC0000'}}});
    var worksheet = workbook.getWorksheet(sheetName);
    var columns = [
        { header: 'Key', width: 30 },
        { header: 'Summary', width: 50 },
        { header: 'Type', width: 17 },
        { header: 'ETA-Duedate', width: 17 },
        { header: 'Assignee', width: 17 },
        { header: 'Status', width: 10 },
    ]
    worksheet.columns = columns;
    var headerRow = worksheet.getRow(1)
    headerRow.fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'a7a4a3'}
    };
    headerRow.height = 30;
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.font = {bold: true, size: 12, color: {argb: 'ffffff'}};
}
function setRow(sheetName, data){
    var row = worksheets[sheetName].getRow(++row_count[sheetName]);
    row.getCell(1).value = data.key;
    row.getCell(2).value = data.summary;
    row.getCell(3).value = data.issuetype;
    row.getCell(4).value = data.eta;                            
    row.getCell(5).value = data.assignee;                                                                                
    row.getCell(6).value = data.status;
    //
    if (data.status == 'In Progress') {
        row.fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'33FF33'}
        };
    }
    if (data.status == 'Resolved' || data.status == 'In Review') {
        row.fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'00FFFF'}
        };
    }
    row.commit(); 
}