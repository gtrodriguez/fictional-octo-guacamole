import React from 'react';
import { render } from 'react-dom';
import GameBoard from './gameboard';

class App extends React.Component {
  static alertWin() {
    // window.alert("You won the game!");
  }

  constructor(props) {
    super(props);

    this.state = {
      username: null,
      gameId: null, 
      gameInstance: null,
      allGames: []
    };
    
    this.resetGame = this.resetGame.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.renderGameColumn = this.renderGameColumn.bind(this);
    this.registerUser = this.registerUser.bind(this);
    // this.alertWin = this.alertWin.bind(this);
  }

  componentDidMount() {
    const that = this;
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      // console.log('connect');
      socket.emit('initial', {
        for: 'everyone', 
        gameInstance: that.state.gameInstance, 
        currentPlayer: that.state.currentPlayer,
        timeStamp: that.state.timeStamp,
      });
    });

    socket.on('event', (data) => { /* console.log('data',data); */ });
    socket.on('disconnect', () => { }); 
    socket.on('initial-sync', (msg) => {
      //if there's a newer version of this game going, use that state.
/*      if (stateSyncObj.timeStamp > that.state.timeStamp) {
        that.setState({
          gameInstance: stateSyncObj.gameInstance,
          currentPlayer: stateSyncObj.currentPlayer,
          timeStamp: stateSyncObj.timeStamp,
          yourPlayer: stateSyncObj.yourPlayer,
        });
      } */
    });

    socket.on('sync', function(msg) {
      //if there's a newer version of this game going, use that state.
/*      if (stateSyncObj.timeStamp > that.state.timeStamp) {
        that.setState({
          gameInstance: stateSyncObj.gameInstance,
          currentPlayer: stateSyncObj.currentPlayer,
          timeStamp: stateSyncObj.timeStamp,
        });
      } */
    });
  }

  componentWillUnmount() {

  }

  registerUser () {
    let usernameEl = document.getElementById('username');

    if (usernameEl.value) {
      usernameEl.Va
    } else {
      window.alert("You must select a username!");
    }

  }

  renderGameColumn () {
    if (this.gameId != null){
      return <GameBoard handleWin={this.alertWin()} />      
    } else {
      return <GameSelector handleSelection={this.handleGameSelection()} />
    }
  }

  render() {
    return (<div id="connectx-root">Welcome to Connect X!
      <div id="game-container">
        <div id="gameboard-column">
          {
            this.renderGameColumn()
          }
        </div>
        <div id="communication-column">
          <div id="user-details">
            <label htmlFor="username">UserName:</label>
            <input type="text" id="username" name="username" />
            <button type="button" onClick={(e) => { e.preventDefault(); this.registerUser(); }}>Connect</button>
          </div>
          <div id="game-details">
            <div>Game Room: <span /></div>
            <div>Player 1: <span /></div>
            <div>Player 2: <span /></div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

render(<App />, document.getElementById('app'));

export default App;
