var request = require('request');
var prompt = require('prompt');
var async = require('async');
var Excel = require('exceljs');
var jql = 'key in (QTX-18850, QTX-19647, QTX-18494, QTX-18482, QTX-18859, QTX-18994, QTX-18963, QTX-18778, QTX-19511, QTX-19512, QTX-19513, QTX-19509, QTX-19561, QTX-17652, QTX-19183, QTX-19614, QTX-19615, QTX-19916, QTX-19370, QTX-19609, QTX-19610, QTX-19918, QTX-19868, QTX-18687, QTX-19265, QTX-19134, QTX-18646, QTX-18914, QTX-18883, QTX-19401, QTX-19386, QTX-20037, QTX-20000, QTX-20007, QTX-20009, QTX-19971, QTX-19960, QTX-19990, QTX-19996, QTX-19994, QTX-19941, QTX-19959, QTX-19969, QTX-19954, QTX-19953, QTX-19961, QTX-19876, QTX-19786, QTX-19628, QTX-19677, QTX-19809, QTX-19869, QTX-19915, QTX-19936, QTX-19940, QTX-19970, QTX-19942, QTX-19943, QTX-19930, QTX-19947, QTX-19980, QTX-19981, QTX-19982, QTX-19983, QTX-19984, QTX-19985, QTX-19986, QTX-19992, QTX-19993, QTX-20049, QTX-20053, QTX-19967, QTX-19785, QTX-19952, QTX-19950, QTX-18890, QTX-19972, QTX-19951, QTX-19973, QTX-19935, QTX-19958, QTX-19987, QTX-20011, QTX-20039, QTX-19838, QTX-20001, QTX-20003, QTX-20004, QTX-20006, QTX-20008, QTX-20005, QTX-17782, QTX-19995, QTX-19998, QTX-19997, QTX-19966, QTX-19968, QTX-19663, QTX-19574, QTX-19846, QTX-19774, QTX-16252, QTX-20041, QTX-19999, QTX-18793, QTX-19988, QTX-19835, QTX-17338, QTX-19749, QTX-19731, QTX-19222, QTX-19030, QTX-18692, QTX-18772, QTX-18730, QTX-18938, QTX-19855, QTX-19705, QTX-19704, QTX-19871, QTX-19563, QTX-19562, QTX-19753, QTX-19754, QTX-19154, QTX-19758, QTX-19759, QTX-16408, QTX-19623, QTX-18792, QTX-19339, QTX-19768, QTX-19775, QTX-19777, QTX-19750, QTX-19887, QTX-19591, QTX-19927, QTX-19730, QTX-19771, QTX-19909, QTX-19709, QTX-19602, QTX-19956, QTX-20002, QTX-18886, QTX-18885, QTX-19979, QTX-19908, QTX-19830, QTX-19948, QTX-19974, QTX-19977, QTX-19877, QTX-19879, QTX-19913, QTX-19914, QTX-19928, QTX-19910, QTX-19939, QTX-19962, QTX-19920, QTX-19912, QTX-19925, QTX-19978, QTX-19937, QTX-19885, QTX-19787, QTX-19899, QTX-19900, QTX-19976, QTX-19866, QTX-19702, QTX-19635, QTX-19917, QTX-20038, QTX-20040, QTX-20070, QTX-20071, QTX-20073, QTX-20074, QTX-20055, QTX-20042, QTX-20043, QTX-20045, QTX-20046, QTX-20047, QTX-20048, QTX-20050, QTX-20051, QTX-20052, QTX-20054, QTX-20056, QTX-20057, QTX-20058, QTX-20059, QTX-20060, QTX-20061, QTX-20062, QTX-20063, QTX-20064, QTX-20065, QTX-20066, QTX-20067, QTX-20068, QTX-20069, QTX-20072, QTX-20075, QTX-20076, QTX-20077, QTX-20078, QTX-20079, QTX-20080, QTX-20081, QTX-20084, QTX-20083, QTX-20085, QTX-20086, QTX-20087, QTX-20088, QTX-20089, QTX-20090, QTX-20091, QTX-20092, QTX-17139, QTX-20093, QTX-20094, QTX-20095, QTX-20096, QTX-20097, QTX-20098)';
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
var array_sheet = ['BUG', 'TASK' , 'APPCLONING', 'FULL', 'vinh.tran', 'thuan.ho', 'trinh.nguyent', 'song.truong', 'quynh.hoang', 'phuong.tran', 'nguyen.tran', 'minh.nguyen', 'linh.tranh', 'hoang.nguyen', 'hao.le', 'duy.phan', 'dat.pham', 'dat.huynh', 'chuong.vo', 'chuong.nguyen'];
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
                    url: 'https://issues.qup.vn/rest/api/2/search?startAt='+startAt+'&jql=' + jql,
                    timeout: 20000,
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
                                eta: issue.fields.timeestimate,
                                assignee: issue.fields.assignee.name,
                                status: issue.fields.status.name,
                            }
                            setRow('FULL', rowData);  
                            if (["Bug", "Bug - New Feature", "Bug - Regression"].indexOf(issue.fields.issuetype.name)!=-1){
                                setRow('BUG', rowData);  
                            } else if (issue.fields.summary.indexOf('App cloning')!=-1) {
                                setRow('APPCLONING', rowData);  
                            } else {
                                setRow('TASK', rowData);  
                            }
                            setRow(rowData.assignee, rowData);    
                            if (issue.fields.issuetype.name == 'Task' && issue.fields.issuelinks.length) { 
                                var keys = '';                              
                                async.forEach(issue.fields.issuelinks, function(linkIssue, cback){
                                    var newKey = linkIssue.outwardIssue ? linkIssue.outwardIssue.key : linkIssue.inwardIssue.key;
                                    if (linkIssue.type.name == 'Relates' && newKey.indexOf('QD')!= -1) {
                                        //get issues detail 
                                        keys += ',' + newKey;
                                        cback();
                                    } else {
                                        cback();
                                    }                                    
                                }, function(){
                                    if (keys) {
                                        keys = keys.substr(1);
                                        request({
                                            url: 'https://issues.qup.vn/rest/api/2/search?jql=key in ('+keys+')',
                                            timeout: 20000,
                                            json: true,
                                            'auth': {
                                                'user': params.username,
                                                'pass': params.password
                                            }
                                        }, function(error, response, result){
                                            console.log('request dev done', 'https://issues.qup.vn/rest/api/2/search?jql=key in ('+ keys);
                                            if (result && result.total) {
                                                async.forEachLimit(result.issues, 1, function(issueDev, cback){  
                                                    if (issueDev.fields.subtasks.length) {
                                                        var rowData = {
                                                            key: { text: issue.key + ' => ' + issueDev.key, hyperlink: 'https://issues.qup.vn/browse/' + issueDev.key },
                                                            summary: issueDev.fields.summary,
                                                            issuetype: issueDev.fields.issuetype.name,
                                                            eta: issueDev.fields.timeestimate,
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
                                                                    timeout: 20000,
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
                                                                                eta: subTaskDev.fields.timeestimate,
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
                                                            eta: issueDev.fields.timeestimate,
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
                                                console.log('CANNOT GET ISSUES DETAIL');
                                                if (error) {
                                                    console.log(error);
                                                }
                                                console.log(result);
                                                console.log(response.statusCode);
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
        { header: 'ETA', width: 17 },
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
    if (worksheets[sheetName]) {
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
    } else {
        console.log('worksheet not found', sheetName);
    }     
}