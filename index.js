const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const mongoDB = require('mongodb');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const mongoClient = mongoDB.MongoClient;
const ObjectID = mongoDB.ObjectID;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.get('*', function (req, res) {
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

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'gamemaster.connectxgame@gmail.com',
        pass: '0ul8UlLIDOdl'
    }
});

mongoose.connect('mongodb://sampleAdminUsername:QfJX4MKU1tk4@ds121686.mlab.com:21686/heroku_8fvch1mq', { useMongoClient: true });

var db = mongoose.connection; 
var dbCollection = db.collections;
var userSchema = mongoose.Schema({
  username: {
      type: String
    },
    email: {
      type: String
    }
}, { runSettersOnQuery: true });

var gameSchema = mongoose.Schema({
  id: Number,
  player1: String,
  player2: String,
  currentPlayer: String,
  scoreBoard: [Array],
  completed: Boolean,
  isActive: Boolean,
  lastUpdated: Date,
  gameOver: Boolean
});

let User = mongoose.model('User', userSchema);
let Game = mongoose.model('Game', gameSchema);

io.on('connection', function(socket){
  console.log('made socket connection');

  socket.on('register', function(msg){
    console.log(msg);

    User.findOne({ username: msg.username }, function (err, user) {
        if (err) return console.log(err);

        console.log(user,"xxx");

        if (user == null) {//only allow registering with this method
          console.log("did not find user");
          const userObj = {
            username: msg.username,
            email: msg.email,
            _id: new ObjectID()
          };
          const newUser = new User(userObj);

          newUser.save(function (err) {
              if(err) console.log(err);
              console.log("attempt to save");
          });

          socket.emit('login-success', {user: userObj, allGames: []});
        } else {
          console.log("found user", user);
          //if already exist then return this user
          Game.find({$and: [{$or: [{'player1': username}, {'player2': username}]}, {'gameOver': false}]}, function (err, games) {
            socket.emit('login-success', {user: user, allGames: games});
          });
        }
    });
  });

  socket.on('login',function(username){
    console.log('login: ', JSON.stringify(username));

    User.findOne({ username: username }, function (err, user) {
        if (err) return console.log(err);
        console.log(user);

        if (user) {
          console.log("found user", user);
          //if already exist then return this user
          Game.find(
            {$and: [{$or: [{'player1': username}, {'player2': username}]}, {'gameOver': false}]}, function (err, games) {
            // set up personal socket.
            socket.join(user._id);
            socket.emit('login-success', {user: user, allGames: games});
          });
        } else {
          console.log("Could not find user!");
          socket.emit('login-failed', username);
        }
    });
  });

  socket.on('select-game', function (msg) {
    console.log(JSON.stringify(msg));
    Game.findOne({
      _id: msg._id
    }, function (err, gameInstance) {
      if (err) console.log(err);
      socket.join(msg._id);
      socket.emit('retrieve-game', gameInstance);
    });
  });

// starts off with game room is null
// need to make a game room be in the url of the app
// once they click into a game, they get routed into a react game


  // send an email to another player with a link to the game room
  socket.on('invite-player', function(request){
    // tbd
    // send an email with a link to the game instance
    User.findOne({email: request.email}, function (err, user) {
      let mailOptions = {};

      if (err)
        return socket.emit('invite-failed', {reason: "some sort of error!"});

      if (user) {
        // attempt to send the message in app.
        socket.to(user._id).emit('invite-to-game', request.gameId);
        //create a link with an option.
        mailOptions = {
          from: 'gamemaster.connectxgame@gmail.com', // sender address
          to: request.email, // list of receivers
          subject: 'You\'ve been invited to a Connect X game!', // Subject line
          html: `<div>
            <h2>You're invited to a game on Connect X by ${request.senderUserName}!</h2>
            <div><a href="https://calm-citadel-89840.herokuapp.com/${request.gameId}">Click here to join!</a></div>
          </div>`
        };
      } else {
        mailOptions = {
          from: 'gamemaster.connectxgame@gmail.com', // sender address
          to: request.email, // list of receivers
          subject: 'You\'ve been invited to a Connect X game!', // Subject line
          html: `<div>
            <h2>You're invited to a game on Connect X by ${request.senderUserName}!</h2>
            <div><a href="https://calm-citadel-89840.herokuapp.com/${request.gameId}">Click here to join!</a></div>
          </div>`
        };
      }

      transporter.sendMail(mailOptions, function (err, info) {
         if(err)
           console.log(err)
         else
           console.log(info);
      });
    });
  });

  socket.on('register-game', function(request){
    // once they click the link they should be forwarded to a game room
    User.findOne({username: request.username}, function (err, user) {
      if (err) 
        return socket.emit('register-failed', {reason: "user not found!"});;

      Game.findOne({_id: request.gameId}, function (err, game){
        if (err)
          return socket.emit('register-failed', {reason: "game not found"});

        game.player2 = user.username;
        game.isActive = true;
        game.currentPlayer = Math.round(Math.random()) == 0 ? game.player1 : game.player2;
        game.lastUpdated = new Date();

        game.save();

        socket.join(game._id);
        socket.emit('register-success', game);
        io.to(game._id).emit('sync-game', game);
      });
    });
  });

  socket.on('forfeit', function(request) {
    // the ability to cancel a game
  });

  //create a new game instance
  socket.on('new-game', function (username) {
    var gameMatrix = new Array(8);
    for (var i = 0; i < 8; i += 1) {
      gameMatrix[i] = new Array(8);
      gameMatrix[i].fill(0);
    }

    const gameInstance = {
      scoreBoard: gameMatrix,
      player1: username,
      isActive: false,
      _id: new ObjectID(),
      gameOver: false
    };

    const newGame = new Game(gameInstance);

    newGame.save(function (err) {
        if(err) console.log(err);
        console.log("attempt to save");
    });

    socket.join(gameInstance._id);
    socket.emit('new-game-success', gameInstance);
  })

  socket.on('player-submit-turn', function (msg) {
    Game.findOne({
      _id: msg._id,
    }, function (err, gameInstance){
        if (err) console.log(err);
        console.log(JSON.stringify(msg),"XXX",JSON.stringify(gameInstance)); 
        gameInstance.scoreBoard = msg.scoreBoard;
        gameInstance.currentPlayer = msg.currentPlayer;
        gameInstance.lastUpdated = new Date();
        gameInstance.gameOver = msg.gameOver;
        gameInstance.save();

        // broadcast the game update to all the players subscribed to a game room
        // figure out how to broadcast to only the other player
        io.to(msg._id).emit('sync-game', gameInstance); 
    });
  });

  socket.on('initial', function (msg) {
      console.log('message: ' + JSON.stringify(msg));
  });
})

