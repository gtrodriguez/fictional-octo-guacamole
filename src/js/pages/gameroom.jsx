import React from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';
import GameBoard from '../components/gameboard';
import GameSelector from '../components/gameselector';
import UserControlPanel from '../components/usercontrolpanel';

class GameRoom extends React.Component {
  static alertWin() {
    // window.alert("You won the game!");
  }

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      gameId: null,
      gameInstance: null,
      allGames: [],
      connection: null
    };

    this.submitConnectUser = this.submitConnectUser.bind(this);
    this.submitUserRegistration = this.submitUserRegistration.bind(this);
    this.handleGameSelection = this.handleGameSelection.bind(this);
    this.renderGameColumn = this.renderGameColumn.bind(this);
  }

  componentDidMount() {
    const that = this;
    const socket = io('http://localhost:3000');

    socket.on('connect-success', (user) => {
      this.setState({
        user: user
      });
    });

    socket.on('sync-game', (game) => {
      this.setState({
        gameInstance: game
      });
    })

    socket.on('sync-game-list', (games) => {
      this.setState({
        allGames: games
      });
    });

    this.setState({
      connection: socket
    });
  }

  componentWillUnmount() {

  }

  handleGameSelection(gameId) {
    const that = this;

    if (gameId != null) {//continue a previous game
      let gameInstance = this.allGames.find((game,index) => {
        return game.Id === gameId;
      });

      this.state.setState({
        gameId: gameId,
        gameInstance: gameInstance
      });
    } else {
      //create a new game
    }
  }

  submitUserRegistration(user) {
    this.state.connection.emit('register', user);
  }

  submitConnectUser(email) {
    this.state.connection.emit('connect', email);
  }

  renderGameColumn() {
    if (this.user == null) {
      return <div>You must first connect to the game server.</div>;
    } else if (this.gameId != null) {
      return <GameBoard handleWin={this.alertWin()}
        gameInstance={this.state.gameInstance} />;
    }
    return (<GameSelector
      games={this.state.allGames} 
      handleGameSelection={this.handleGameSelection()} />);
  }

  render() {
    return (<div id="connectx-root">
      <h2 className="title">Welcome Back to Connect X!</h2>
      <div id="game-container">
        <div id="gameboard-column">
          {
            this.renderGameColumn()
          }
        </div>
        <div id="communication-column">
          <UserControlPanel
            user={ this.state.user }
            submitUserRegistration={ this.submitUserRegistration }
            submitConnectUser={ this.submitConnectUser }
          />
        </div>
      </div>
    </div>
    );
  }
}

export default GameRoom;
