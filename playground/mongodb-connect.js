//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);


// const user = {name: 'andrew', age: 25};
// const {name} = user;  // es6 object destructuring
// console.log(name);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //   if (err) {
    //       return console.log('Unable to insert todo', err);
    //   } 
      
    //   console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // insert new doc into Users (name, age, location)
    // db.collection('Users').insertOne({
    //     name: 'Matilda',
    //     age: 13,
    //     location: 'Cleveland'
    // }, (err, result) => {
    //   if (err) {
    //       return console.log('Unable to insert User', err);
    //   } 
      
    //   console.log(JSON.stringify(result.ops, undefined, 2));
    //   console.log(result.ops[0]._id.getTimestamp());
    // });

    

    db.close();
});