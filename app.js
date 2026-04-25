const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const nodemailer = require('nodemailer');

function startServer() {
  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.set('view engine', 'ejs');
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/example.html'));
  });

  let transporter = null;

  if (process.env.EMAIL_ENABLED === 'true') {
    transporter = nodemailer.createTransport({
      service: process.env.GAMEMASTER_EMAIL_SERVICE,
      auth: {
        user: process.env.GAMEMASTER_EMAIL_ADDRESS,
        pass: process.env.GAMEMASTER_EMAIL_PASSWORD
      }
    });
  }

  mongoose.connect(process.env.MONGODB_CONNECTION_STR)
    .catch(err => console.error('MongoDB connection error:', err.message));

  const userSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String }
  });

  const gameSchema = mongoose.Schema({
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
  });

  const User = mongoose.model('User', userSchema);
  const Game = mongoose.model('Game', gameSchema);

  io.on('connection', function (socket) {
    socket.on('register', async function (msg) {
      try {
        const user = await User.findOne({ username: msg.username });

        if (user == null) {
          const userObj = {
            username: msg.username,
            email: msg.email,
            _id: new ObjectId()
          };
          const newUser = new User(userObj);
          await newUser.save();

          await Game.updateMany({ inviteeEmail: msg.email }, { player2: userObj.username });
          const games = await Game.find({ player2: userObj.username }, null, { sort: '-lastUpdated' });
          socket.emit('login-success', { user: userObj, allGames: games });
        } else {
          const games = await Game.find(
            { $and: [{ $or: [{ player1: user.username }, { player2: user.username }, { inviteeEmail: user.email }] }, { gameOver: false }] },
            null,
            { sort: '-lastUpdated' }
          );
          socket.emit('login-success', { user: user, allGames: games });
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('login', async function (username) {
      try {
        const user = await User.findOne({ username: username });

        if (user) {
          const games = await Game.find(
            { $and: [{ $or: [{ player1: username }, { player2: username }, { inviteeEmail: user.email }] }, { gameOver: false }] },
            null,
            { sort: '-lastUpdated' }
          );
          socket.join(user._id.toString());
          socket.emit('login-success', { user: user, allGames: games });
        } else {
          socket.emit('login-failed', username);
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('select-game', async function (msg) {
      try {
        const gameInstance = await Game.findOne({ _id: msg._id });
        socket.join(msg._id.toString());
        socket.emit('retrieve-game', gameInstance);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('invite-player', async function (request) {
      try {
        const game = await Game.findOne({ _id: request.gameId });
        if (!game) return socket.emit('register-failed', { reason: 'game not found' });

        const user = await User.findOne({ email: request.email });

        const inviteHtml = `<div>
          <h2>You're invited to a game on Connect X by ${request.senderUserName}!</h2>
          <div><a href="${process.env.APP_BASE_URL}/${request.gameId}">Click here to join!</a></div>
        </div>`;

        const mailOptions = {
          from: process.env.GAMEMASTER_EMAIL_ADDRESS,
          to: request.email,
          subject: "You've been invited to a Connect X game!",
          html: inviteHtml
        };

        if (user) {
          socket.to(user._id.toString()).emit('invite-to-game', request.gameId);
          game.player2 = user.username;
        }

        if (process.env.EMAIL_ENABLED === 'true') {
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.error(err);
            else console.log(info);
          });
        }

        game.inviteeEmail = request.email;
        game.lastUpdated = new Date();
        await game.save();

        io.to(game._id.toString()).emit('sync-game', game);
      } catch (err) {
        console.error(err);
        socket.emit('invite-failed', { reason: 'error sending invite' });
      }
    });

    socket.on('register-game', async function (request) {
      try {
        const user = await User.findOne({ username: request.username });
        if (!user) return socket.emit('register-failed', { reason: 'user not found!' });

        const game = await Game.findOne({ _id: request.gameId });
        if (!game) return socket.emit('register-failed', { reason: 'game not found' });

        game.player2 = user.username;
        game.isActive = true;
        game.currentPlayer = Math.round(Math.random()) === 0 ? game.player1 : game.player2;
        game.lastUpdated = new Date();
        await game.save();

        socket.join(game._id.toString());
        socket.emit('register-success', game);
        io.to(game._id.toString()).emit('sync-game', game);
      } catch (err) {
        console.error(err);
        socket.emit('register-failed', { reason: 'error registering game' });
      }
    });

    socket.on('forfeit', function () {
      // the ability to cancel a game
    });

    socket.on('new-game', async function (username) {
      var gameMatrix = new Array(8);
      for (var i = 0; i < 8; i += 1) {
        gameMatrix[i] = new Array(8);
        gameMatrix[i].fill(0);
      }

      const gameInstance = {
        scoreBoard: gameMatrix,
        player1: username,
        isActive: false,
        _id: new ObjectId(),
        gameOver: false
      };

      try {
        const newGame = new Game(gameInstance);
        await newGame.save();

        socket.join(gameInstance._id.toString());
        socket.emit('new-game-success', gameInstance);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('player-submit-turn', async function (msg) {
      try {
        const gameInstance = await Game.findOne({ _id: msg._id });
        if (!gameInstance) return;

        gameInstance.scoreBoard = msg.scoreBoard;
        gameInstance.currentPlayer = msg.currentPlayer;
        gameInstance.lastUpdated = new Date();
        gameInstance.gameOver = msg.gameOver;
        await gameInstance.save();

        io.to(msg._id.toString()).emit('sync-game', gameInstance);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('initial', function (msg) {
      console.log('message: ' + JSON.stringify(msg));
    });
  });

  return new Promise(resolve => {
    const server = http.listen(process.env.PORT || 3000, () => {
      resolve(server);
    });
  });
}

module.exports = startServer;
