import React from 'react';
import { render } from 'react-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import io from 'socket.io-client';
import GameBoard from '../components/gameboard';
import GameSelector from '../components/gameselector';
import UserControlPanel from '../components/usercontrolpanel';

class Landing extends React.Component {
  alertWin() {
    window.alert('You won the game!');
  }

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      gameId: null,
      gameInstance: null,
      allGames: [],
      connection: null,
      inviteGameId: null
    };

    this.submitConnectUser = this.submitConnectUser.bind(this);
    this.submitUserRegistration = this.submitUserRegistration.bind(this);
    this.handleGameSelection = this.handleGameSelection.bind(this);
    this.handleGameRetrieval = this.handleGameRetrieval.bind(this);
    this.handleRegisterGame = this.handleRegisterGame.bind(this);
    this.handleGameInviteUpdate = this.handleGameInviteUpdate.bind(this);
    this.renderGameColumn = this.renderGameColumn.bind(this);
    this.alertWin = this.alertWin.bind(this);
  }

  componentDidMount() {
    const that = this;
    const socket = io();
    var cachedUser = sessionStorage.getItem('user');

    socket.on('login-success', (response) => {
      sessionStorage.setItem('user', JSON.stringify(response.user));
      this.setState({
        user: response.user,
        allGames: response.allGames,
      });
    });

    socket.on('retrieve-game', (game) => {
      this.handleGameRetrieval(game);
    });

    socket.on('sync-game', (game) => {
      this.setState({
        gameInstance: game
      });
    });

    socket.on('register-success', (game) => {
      this.handleGameRetrieval(game);
    });

    socket.on('register-failed', (response) => {
      window.alert(response.reason);
    })

    socket.on('sync-game-list', (games) => {
      this.setState({
        allGames: games
      });
    });

    this.setState({
      connection: socket
    });

    if(cachedUser != null){
      let user = JSON.parse(cachedUser);
      socket.emit('login', user.username);
    }
  }

  componentWillUnmount() {
  }

  handleGameRetrieval(gameObj) {
    console.log(gameObj);

    if(!gameObj.isActive) {
      var newGameList = this.state.allGames.slice();
      newGameList.push(gameObj);
      this.setState({
        allGames: newGameList
      });
    }

    this.setState({
      gameInstance: gameObj,
      gameId: gameObj._id,
    });
  }

  handleGameSelection(gameId) {
    const that = this;

    if (gameId != null) {//continue a previous game
      this.state.connection.emit('select-game', {_id: gameId});
    } else {
      this.state.connection.emit('new-game', this.state.user.username);
    }
  }

  handleRegisterGame(gameId){
    this.state.connection.emit('register-game', {
      gameId: gameId,
      username: this.state.user.username
    });
  }

  submitUserRegistration(user) {
    this.state.connection.emit('register', user);
  }

  submitConnectUser(username) {
    console.log('submit username connection', username);
    this.state.connection.emit('login', username);
  }

  handleGameInviteUpdate(newInviteGameId) {
    this.setState({
      inviteGameId: newInviteGameId
    });
  }

  renderGameColumn() {
    if (this.state.user == null) {
      return <div>You must first sign in or register.</div>;
    } else if (this.state.gameId != null) {
      return <GameBoard handleWin={this.alertWin}
        gameInstance={this.state.gameInstance} />;
    }
    return (<GameSelector
      games={this.state.allGames}
      inviteGameId={this.state.inviteGameId}
      handleGameSelection={this.handleGameSelection}
      handleRegisterGame={this.handleRegisterGame}
      handleGameInviteUpdate={this.handleGameInviteUpdate}
      />);
  }

  render() {
    return (<div id="connectx-root">
      <Grid id="game-container">
        <Row>
          <h2 className="title">Welcome to Connect X!</h2>
        </Row>
        <Row>
          <Col md={6}>
            Connect X is an multiplayer game project made to experiment with React with.
            Long term goals include adding an artificial intelligent opponent, modifying the idea of gravity,
            and introducing new kinds of play options to the classic game.
          </Col>
        </Row>
        <Row>
          <Col sm={6} id="gameboard-column">
            {
              this.renderGameColumn()
            }
          </Col>
          <Col sm={6} id="communication-column">
            <UserControlPanel
              user={ this.state.user }
              submitUserRegistration={ this.submitUserRegistration }
              submitConnectUser={ this.submitConnectUser }
            />
          </Col>
        </Row>
      </Grid>
    </div>
    );
  }
}

export default Landing;
