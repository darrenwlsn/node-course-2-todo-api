const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  })
});

var hashedPassword = '$2a$10$tE6jU1qKxMYDAxFW2jrhiOZuOqUwPCg2YwLLJx7VNNjRRb8oHleQG';

bcrypt.compare(password, hashedPassword, (err, result) => {
  if (err) console.log('error');
  console.log(result);
});







// var message = "I am user number 3";
// var hash = SHA256(message).toString();

// console.log(`message: ${message} becomes: ${hash}`)

// var data = {
//   id: 4
// };
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // mim attack  changes data
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();


// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Dont trust');
// }

// var data = {
//   id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);
