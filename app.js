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

function startServer() {
  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.set('view engine', 'ejs');
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/example.html'));
  });

  //http.listen(process.env.PORT || 3000);

  let gameInstance = null;
  let timeStamp = null;
  let currentPlayer = null;
  let transporter = null;

  if (process.env.EMAIL_ENABLED==="true") {
    transporter = nodemailer.createTransport({
    service: process.env.GAMEMASTER_EMAIL_SERVICE,
    auth: {
          user: process.env.GAMEMASTER_EMAIL_ADDRESS,
          pass: process.env.GAMEMASTER_EMAIL_PASSWORD
      }
    });
  }

  console.log(process.env.MONGODB_CONNECTION_STR);
  mongoose.connect(process.env.MONGODB_CONNECTION_STR, { useMongoClient: true });

  const db = mongoose.connection,
  dbCollection = db.collections,
  userSchema = mongoose.Schema({
    username: {
        type: String
      },
      email: {
        type: String
      }
  }, { runSettersOnQuery: true }),
  gameSchema = mongoose.Schema({
    id: Number,
    player1: String,
    player2: String,
    currentPlayer: String,
    scoreBoard: [Array],
    completed: Boolean,
    isActive: Boolean,
    lastUpdated: Date,
    gameOver: Boolean,
    inviteeEmail: String
  }),
  User = mongoose.model('User', userSchema),
  Game = mongoose.model('Game', gameSchema);

  io.on('connection', function(socket){
    socket.on('register', function(msg){
      User.findOne({ username: msg.username }, function (err, user) {
          if (err) return console.log(err);

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

            Game.update({'inviteeEmail': msg.email},{'player2': userObj.username},function(err,raw){
              Game.find({'player2': userObj.username}, null, {sort: '-lastUpdated'}, function (err, games) {
              if (err) return console.log(err);
                // set up personal socket.
                socket.emit('login-success', {user: userObj, allGames: games});
              });
            });
          } else {
            console.log("found user", user);
            //if already exist then return this user
            Game.find({$and: [{$or: [{'player1': username}, {'player2': username}, {'inviteeEmail': user.email}]}, {'gameOver': false}]},
              null, {sort: '-lastUpdated'},
              function (err, games) {
                socket.emit('login-success', {user: user, allGames: games});
            });
          }
      });
    });

    socket.on('login',function(username){
      console.log('login: ', JSON.stringify(username));

      User.findOne({ username: username }, function (err, user) {
          if (err) return console.log(err);

          if (user) {
            //if already exist then return this user
            Game.find(
              {$and: [{$or: [{'player1': username}, {'player2': username}, {'inviteeEmail': user.email}]}, {'gameOver': false}]}, null, {sort: '-lastUpdated'}, function (err, games) {
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
      Game.findOne({
        _id: msg._id
      }, function (err, gameInstance) {
        if (err) console.log(err);
        socket.join(msg._id);
        socket.emit('retrieve-game', gameInstance);
      });
    });

    // send an email to another player with a link to the game room
    socket.on('invite-player', function(request){
      // tbd
      // 
      // send an email with a link to the game instance
      Game.findOne({_id: request.gameId}, function (err, game){
        if (err)
          return socket.emit('register-failed', {reason: "game not found"});

        User.findOne({email: request.email}, function (err, user) {
          let mailOptions = {};

          if (err)
            return socket.emit('invite-failed', {reason: "some sort of error!"});

          if (user) {
            // attempt to send the message in app.
            socket.to(user._id).emit('invite-to-game', request.gameId);
            game.player2 = user.username;
            //create a link with an option.
            mailOptions = {
              from: process.env.GAMEMASTER_EMAIL_ADDRESS, // sender address
              to: request.email, // list of receivers
              subject: 'You\'ve been invited to a Connect X game!', // Subject line
              html: `<div>
                <h2>You're invited to a game on Connect X by ${request.senderUserName}!</h2>
                <div><a href="${process.env.APP_BASE_URL}/${request.gameId}">Click here to join!</a></div>
              </div>`
            };
          } else {
            mailOptions = {
              from: process.env.GAMEMASTER_EMAIL_ADDRESS, // sender address
              to: request.email, // list of receivers
              subject: 'You\'ve been invited to a Connect X game!', // Subject line
              html: `<div>
                <h2>You're invited to a game on Connect X by ${request.senderUserName}!</h2>
                <div><a href="${process.env.APP_BASE_URL}/${request.gameId}">Click here to join!</a></div>
              </div>`
            };
          }

          if (process.env.EMAIL_ENABLED==="true") {
            transporter.sendMail(mailOptions, function (err, info) {
               if(err)
                 console.log(err)
               else
                 console.log(info);
            });
          }
        });

        game.inviteeEmail = request.email;
        game.lastUpdated = new Date();
        game.save();

        io.to(game._id).emit('sync-game', game);
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
      },
      newGame = new Game(gameInstance);

      newGame.save(function (err) {
          if(err) console.log(err);
      });

      socket.join(gameInstance._id);
      socket.emit('new-game-success', gameInstance);
    })

    socket.on('player-submit-turn', function (msg) {
      Game.findOne({
        _id: msg._id,
      }, function (err, gameInstance){
          if (err) console.log(err);

          gameInstance.scoreBoard = msg.scoreBoard;
          gameInstance.currentPlayer = msg.currentPlayer;
          gameInstance.lastUpdated = new Date();
          gameInstance.gameOver = msg.gameOver;
          gameInstance.save();

          // broadcast the game update to all the players subscribed to a game room
          io.to(msg._id).emit('sync-game', gameInstance); 
      });
    });

    socket.on('initial', function (msg) {
        console.log('message: ' + JSON.stringify(msg));
    });
  })

  return new Promise(resolve => {
      const server = http.listen(process.env.PORT || 3000, () => {
        resolve(server);
      })
  });
}

module.exports = startServer