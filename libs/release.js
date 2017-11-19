var request = require('request');
var prompt = require('prompt');
var async = require('async');
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
module.exports = function(params){
    var labels = "4.6.17.2";
    prompt.start();
    var keys = '';
    var issuesKeys = [];
    prompt.get(schema, function (err, result) {
        var startAt = 0;
        var total = 50  
        async.whilst(
            function () { return startAt < total; },
            function (callback) {
               request({
                    url: 'https://issues.qup.vn/rest/api/2/search?startAt='+startAt+'&jql=key in (QTX-20007, QTX-20009, QTX-19990, QTX-18890, QTX-19935, QTX-20004, QTX-20008, QTX-20005, QTX-19998, QTX-19997, QTX-19966, QTX-19968, QTX-19574, QTX-19846, QTX-18793, QTX-19222, QTX-18730, QTX-19705, QTX-19871, QTX-19563, QTX-19562, QTX-19623, QTX-19750, QTX-19909, QTX-19709, QTX-19956, QTX-19979, QTX-19948, QTX-19974, QTX-19920, QTX-19787, QTX-19899, QTX-19900, QTX-19866, QTX-19917, QTX-20038, QTX-20040, QTX-20070, QTX-20071, QTX-20073, QTX-20042, QTX-20043, QTX-20045, QTX-20046, QTX-20047, QTX-20051, QTX-20058, QTX-20059, QTX-20060, QTX-20061, QTX-20063, QTX-20065, QTX-20067, QTX-20069, QTX-20072, QTX-20075, QTX-20076, QTX-20077, QTX-20078, QTX-20079, QTX-20080, QTX-20081)',
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
                            keys += issue.key +","; 
                            issuesKeys.push(issue.key);
                            if (issue.fields.subtasks.length) {
                                issue.fields.subtasks.forEach(function(subTask){
                                    keys += subTask.key +",";
                                    issuesKeys.push(subTask.key);
                                })
                            }
                            cback();                     
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
                console.log(keys)
                async.forEachLimit(issuesKeys, 1, function(key, cback){
                    request({
                        url: 'https://issues.qup.vn/rest/api/2/issue/' + key,
                        timeout: 10000,
                        json: true,
                        method: "PUT",
                        body: {
                            "update": {
                                "labels": [
                                    {
                                        "add": "4.6.17.2"
                                    }
                                ]
                            }
                        },
                        'auth': {
                            'user': params.username,
                            'pass': params.password
                        }
                    }, function(error, response, result){
                        if (!error) {
                            console.log(key, response.statusCode);
                            cback();
                        } else {
                            console.log(key);
                            console.log(error);
                            cback();
                        }
                    })
                }, function(){
                    console.log('set label done');
                })
                // workbook.commit()
                // .then(function () {
                //     console.log('end write stream: %s %s', new Date().toISOString());
                //     // the stream has been written
                //     console.log(result.excel);
                // });
            }
        );
        
    });
}