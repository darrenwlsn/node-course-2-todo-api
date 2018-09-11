const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB server');

    

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b9517c8c665c7133185ee0d')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    //     }, {
    //         returnOriginal: false
    //     }).then((result) => {
    //         console.log(result);
    //     });
    
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b93b6e4c9feed252d4c3452')
    }, {
        $set: {
            name: 'Matilda'
        },
        $inc: {
            age: 1
        },
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        });

    
    

    //db.close();
});