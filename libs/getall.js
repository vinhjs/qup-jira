module.exports = function(params){
    var request = require('request');
    var prompt = require('prompt');
    var async = require('async');
    var schema = {
        properties: {
            status: {
                default: 'all'
            },
            csv: {
                description: 'input csv name',
                default: 'get_all_issues_with_user.csv'
            }
        }
    };
    prompt.start();
    prompt.get(schema, function (err, result) {
        var startAt = 0;
        var total = 50
        var count = 1;
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
                    if (result && result.total) {                        
                        total = result.total;
                        startAt += 50;
                        async.forEach(result.issues, function(issue, cback){
                            console.log(count++, issue.key);
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

            }
        );
        
    });
}