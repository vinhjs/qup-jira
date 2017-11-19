var keys = 'QTX-19993,QTX-19992,QTX-19986,QTX-19985,QTX-19984,QTX-19983,QTX-19982,QTX-19980,QTX-19942,QTX-19935,QTX-19930,QTX-19918,QTX-19917,QTX-19916,QTX-19868,QTX-19846,QTX-19615,QTX-19614,QTX-20021,QTX-20022,QTX-19610,QTX-19609,QTX-20031,QTX-20032,QTX-19563,QTX-20023,QTX-20024,QTX-19561,QTX-20033,QTX-20034,QTX-19513,QTX-19512,QTX-19511,QTX-19509,QTX-20025,QTX-20026,QTX-20027,QTX-20028,QTX-20029,QTX-20030,QTX-19401,QTX-19370,QTX-20035,QTX-20036,QTX-19183,QTX-20018,QTX-20019,QTX-20020,QTX-18914,QTX-17652,QTX-19209,QTX-19210,QTX-19211,QTX-19945';
var request = require('request');
var async = require('async');
module.exports = function(params){
    var startAt = 0;
    var total = 50  
    async.whilst(
        function () { return startAt < total; },
        function (callback) {
            request({
                url: 'https://issues.qup.vn/rest/api/2/search?startAt='+startAt+'&jql=key in ('+keys+')',
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
                    async.forEachLimit(result.issues, 10, function(issue, cback){ 
                        console.log(issue.key + ' => ' + issue.fields.status.name);
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
            // workbook.commit()
            // .then(function () {
            //     console.log('end write stream: %s %s', new Date().toISOString());
            //     // the stream has been written
            //     console.log(result.excel);
            // });
        }
    );
}