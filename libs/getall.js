module.exports = function(params){
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
    prompt.start();
    prompt.get(schema, function (err, result) {
        var startAt = 0;
        var total = 50
        var count = 1;
        var options = {
            filename:  './'+result.excel,
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
            firstSheet: 0, activeTab: 1, visibility: 'visible'
            }
        ];
        workbook.addWorksheet('FULL', {properties: {tabColor: {argb: 'FFC0000'}}});
        var worksheet = workbook.getWorksheet('FULL');
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
        async.whilst(
            function () { return startAt < total; },
            function (callback) {
               request({
                    url: 'https://issues.qup.vn/rest/api/2/search?startAt='+startAt+'&jql=key in (QTX-19439, QTX-19865, QTX-19511, QTX-19512, QTX-19513, QTX-19509, QTX-19561, QTX-19759, QTX-19758, QTX-17652, QTX-19154, QTX-19183, QTX-19754, QTX-19753, QTX-19562, QTX-19563, QTX-19614, QTX-19615, QTX-19871, QTX-19916, QTX-19370, QTX-19609, QTX-19610, QTX-19704, QTX-19705, QTX-19855, QTX-19663, QTX-19917, QTX-19574, QTX-19918, QTX-18890, QTX-19846, QTX-19774, QTX-17782, QTX-17826, QTX-16252, QTX-16385, QTX-17200, QTX-18806, QTX-17268, QTX-18716, QTX-18544, QTX-17232, QTX-17338, QTX-19749, QTX-19731, QTX-18876, QTX-18914, QTX-18938, QTX-19864, QTX-19838, QTX-19850)',
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
                            var row = worksheet.getRow(++count);
                            row.getCell(1).value = { text: issue.key, hyperlink: 'https://issues.qup.vn/browse/' + issue.key };
                            row.getCell(2).value =issue.fields.summary;
                            row.getCell(3).value =issue.fields.issuetype.name;
                            row.getCell(4).value =issue.fields.timeestimate + '-' + issue.fields.duedate;                            
                            row.getCell(5).value = '';                                                                                
                            row.getCell(6).value = '';                                                                                
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
                                                async.forEach(result.issues, function(issueDev, cback){  
                                                    if (issueDev.fields.subtasks.length) {
                                                        var row = worksheet.getRow(++count);                                                        
                                                        row.getCell(1).value = { text: issue.key + ' => ' + issueDev.key, hyperlink: 'https://issues.qup.vn/browse/' + issueDev.key };
                                                        row.getCell(2).value =issueDev.fields.summary;
                                                        row.getCell(3).value =issueDev.fields.issuetype.name;
                                                        row.getCell(4).value =issueDev.fields.timeestimate + '-' + issueDev.fields.duedate;                            
                                                        row.getCell(5).value = issueDev.fields.assignee.name;
                                                        row.getCell(6).value = issueDev.fields.status.name;
                                                        row.commit();
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
                                                                            var row = worksheet.getRow(++count);
                                                                            row.getCell(1).value = { text: issue.key + ' => ' + issueDev.key + ' => ' + subTaskDev.key, hyperlink: 'https://issues.qup.vn/browse/' + subTaskDev.key };
                                                                            row.getCell(2).value =subTaskDev.fields.summary;
                                                                            row.getCell(3).value =subTaskDev.fields.issuetype.name;
                                                                            row.getCell(4).value =subTaskDev.fields.timeestimate + '-' + subTaskDev.fields.duedate;                            
                                                                            row.getCell(5).value = subTaskDev.fields.assignee.name;
                                                                            row.getCell(6).value = subTaskDev.fields.status.name;
                                                                            row.commit();
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
                                                        var row = worksheet.getRow(++count);
                                                        row.getCell(1).value = { text: issue.key + ' => ' + issueDev.key, hyperlink: 'https://issues.qup.vn/browse/' + issueDev.key };
                                                        row.getCell(2).value =issueDev.fields.summary;
                                                        row.getCell(3).value =issueDev.fields.issuetype.name;
                                                        row.getCell(4).value =issueDev.fields.timeestimate + '-' + issueDev.fields.duedate;                            
                                                        row.getCell(5).value = issueDev.fields.assignee.name;
                                                        row.getCell(6).value = issueDev.fields.status.name;
                                                        row.commit();
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
                                row.getCell(5).value =issue.fields.assignee.name;
                                row.getCell(6).value =issue.fields.status.name;
                                row.commit(); 
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