var prompt = require('prompt');
var schema = {
    properties: {
      username: {
        description: "login jira",
        default: 'vinh.tran',  
        required: true
      },
      password: {
        hidden: true,
        default: 'r0binh00d@235',  
      },
      action: {
          description: 'What do you want?\
          \n1. get all issues\
          \n2. get all user with user',
          required: true,
        default: '1',
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
    switch (result.action) {
        case '1': 
            require('./libs/getall')(result);
            break;
        case '2':
            require('./libs/getall_user');
            break; 
    }
  });