require('dotenv').config();
require('./config/config');

// var env = process.env.NODE_ENV;
// if (env == undefined) {
//   process.env['NODE_ENV'] = 'development';
// }
// console.log('env*** ' + process.env.NODE_ENV);

// if (process.env.NODE_ENV == 'development') {
//   process.env['PORT'] = 3000;
//   process.env['MONGODB_URI'] = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//   process.env['PORT'] = 3000;
//   process.env['MONGODB_URI'] = 'mongodb://localhost:27017/TodoAppTest'; // now tests use a different database
// }

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose'); // using destructruing
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');
var { upload, listBucketContents, downloadFile } = require('./aws/s3-ops');

var app = express();
const port = process.env.PORT; // || 3000;

app.use(bodyParser.json());

// just for testing upload image
app.get('/', function (req, res) {
  console.log(__dirname);
  res.sendFile(__dirname + '/index.html');
});

app.get('/download', async (req, res) => {
  const result = await downloadFile('Screenshot.png');
  res
    .status(200)
    .contentType('image/png')
    .send(result);
});

app.get('/list', function (req, res) {
  var resp = new Promise((resolve, reject) => {
    //var result = listBucketContents();
    //console.log(`back from resolve with result ${result}`);
    resolve(listBucketContents());
  })
    .then(result => {
      console.log(`back from call with ${result}`);
      res.sendFile(__dirname + '/index.html');
    })
    .catch(e => {
      console.log(e);
    });
});

app.post('/upload', upload.array('file', 1), function (req, res, next) {
  res.send('Uploaded!');
});

app.post('/todos', authenticate, (req, res) => {
  console.log(`inside post`);
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(
    todos => {
      res.send({
        todos
      });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      } else {
        res.status(200).send({ todo });
      }
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  console.log(`deleting id ${id}`);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      res.status(200).send({ todo });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // findOneAndUpdate
  Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.post('/users', (req, res) => {

  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
    //res.send(user);
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })

});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {

  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    })
  }).catch((e) => {
    res.status(400).send();
  });


});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };
