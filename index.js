const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const mongoDB = require('mongodb');
const mongoose = require('mongoose');
const mongoClient = mongoDB.MongoClient;
const ObjectID = mongoDB.ObjectID;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/example.html'));
});

http.listen(process.env.PORT || 3000);

var gameInstance = null;
var timeStamp = null;
var currentPlayer = null;
var GameSession = {
  gameInstance: null,
  id: 0,
  currentPlayer: 1, //starts with null
  player1: 'ip address',
  player2: 'ip address',
};

mongoose.connect('mongodb://localhost:27017/connectx');

var db = mongoose.connection; 
var dbCollection = db.collections;
var userSchema = mongoose.Schema({
  username: {
      type: String,
      lowercase: true
    },
    email: {
      type: String,
      lowercase: true
    }
}, { runSettersOnQuery: true });

var gameSchema = mongoose.Schema({
  id: Number,
  player1: String,
  player2: String,
  currentPlayer: String,
  scoreBoard: [Array],
  completed: Boolean,
  lastUpdated: Date
});

let User = mongoose.model('User', userSchema);
let Game = mongoose.model('Game', gameSchema);

io.on('connection', function(socket){
  console.log('made socket connection');

  socket.on('register', function(msg){
    User.find({ username: msg.username }, function (err, user) {
        if (err) return console.log(err);

        if (user === null) {//only allow registering with this method
          const userObj = {
            username: msg.username,
            email: msg.email,
            _id: new ObjectID()
          };
          const newUser = new User(userObj);

          newUser.save(function (err) {
              if(err) console.log(err);
          });

          socket.emit('connect-success', userObj);
        } else {
          //if already exist then return this user
          socket.emit('connect-success', user);
        }
    });
  });

  socket.on('connect',function(email){
    console.log('message: ' + JSON.stringify(email));

    User.find({ email: email }, function (err, user) {
        if (err) return console.log(err);

        console.log(user);

        if (user !== null) {
          socket.emit('connect-success', user);
        } else {
          console.log("Could not find user!");
        }
    });
  });

  socket.on('select-game', function (msg) {
    Game.find({ 
      _id: msg._id
    }, function (err, gameInstance) { 
      if (err) console.log(err);
      socket.emit('initialize-game', {
        game: gameInstance
      });  
    });  
  });

  socket.on('invite-player', function(request){

  });

  socket.on('register-game', function(request){

  });

  socket.on('new-game', function (gameObj) {
    const gameObj = {

    };
    const newGame = new Game(gameObj);

  })

  socket.on('player-submit-turn', function (msg) {
    Game.find({
      _id: msg._id,
    }, function (err, gameInstance){
        if (err) console.log(err);
        gameInstance.scoreBoard = msg.scoreBoard;
        gameInstance.currentPlayer = gameInstance.currentPlayer === gameInstance.player1 ? gameInstance.player2 : gameInstance.player1;
        gameInstance.save();

        socket.emit('sync-game', function() {
          gameInstance: gameInstance;
        }); 
    });
  });

  socket.on('initial', function (msg) {
      console.log('message: ' + JSON.stringify(msg));
  });
})

