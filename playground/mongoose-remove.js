const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

//Todo.findOneAndRemove()
//Todo.findByIdAndRemove

// Todo.findOneAndRemove({_id: '5bbd985b7bc45ea83c5c7a20'}).then((todo) => {

// });

Todo.findByIdAndRemove('5bbd9b9d7bc45ea83c5c7aa6').then((todo) => {
    console.log(todo);
});