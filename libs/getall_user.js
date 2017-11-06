var prompt = require('prompt');
var schema = {
    properties: {
      username: {
        default: 'vinh.tran',  
        required: true
      },
      csv: {
          description: 'input csv name',
          default: 'get_all_issues_with_user'
      }
    }
  };
  prompt.start();
 
  // 
  // Get two properties from the user: email, password 
  // 
  prompt.get(schema, function (err, result) {
    // 
    // Log the results. 
    // 
    console.log('Command-line input received:');
    console.log('  username: ' + result.username);
    console.log('  csv: ' + result.csv);
  });