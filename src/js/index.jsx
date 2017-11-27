import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Landing from './pages/landing';
import GameRoom from './pages/gameroom';
import GameList from './pages/gamelist';
import Header from './components/header';
import Logout from './pages/logout';

class App extends React.Component {
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
      invitedGames: [],
    };

    this.handleConnect = this.handleConnect.bind(this);
    this.handleGameRetrieval = this.handleGameRetrieval.bind(this);
    this.alertWin = this.alertWin.bind(this);
    this.updateGameInstance = this.updateGameInstance.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  componentWillMount() {
    const that = this;
    const socket = io();

    socket.on('sync-game', (game) => {
      this.setState({
        gameInstance: game
      });
    });

    socket.on('sync-game-list', (games) => {
      this.setState({
        allGames: games
      });
    });

    socket.on('login-success', (response) => {
      this.handleConnect(response);
    });

    socket.on('retrieve-game', (game) => {
      this.handleGameRetrieval(game);
    });

    socket.on('invite-to-game', (request) => {
      console.log(request);
    });

    this.setState({
      connection: socket
    });
  }

  componentDidMount() {
    var cachedUser = sessionStorage.getItem('user');

    if(cachedUser != null && !this.state.user){
      let user = JSON.parse(cachedUser);
      this.state.connection.emit('login', user.username);
    }
  }

  componentWillUnmount() {
  }

  handleConnect(response) {
    sessionStorage.setItem('user', JSON.stringify(response.user));
    this.setState({
      user: response.user,
      allGames: response.allGames,
    });
  }

  handleGameRetrieval(gameObj) {
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

  updateGameInstance(newGameInstance) {
    this.setState({
      gameInstance: newGameInstance
    });
  }

  resetState() {
    this.setState({
      user: null,
      gameId: null,
      gameInstance: null,
      allGames: [],
      invitedGames: []
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Header user={this.state.user}/>
          <Switch>
            <Route exact path="/"
              render = {({ history }) => (<Landing user={this.state.user}
                                      connection={this.state.connection}
                                      history={history}
                                      handleConnect={this.handleConnect}
                                      />)} />
            <Route exact path="/gameroom/:gameId"
              render = {({ history, match }) => {
                                    console.log(match,'match');
                                    return (<GameRoom user={this.state.user}
                                         connection={this.state.connection}
                                         gameId={match.params.gameId}
                                         gameInstance={this.state.gameInstance}
                                         updateGameInstance={this.updateGameInstance}
                                         history={history}
                                    />);}}/>
            <Route
              path="/gamelist"
              exact
              render={({ history, match }) => {
                console.log(match,'match');
                return (<GameList
                connection={this.state.connection}
                user={this.state.user} history={history}
                match={match} allGames={this.state.allGames} 
                handleGameRetrieval={this.handleGameRetrieval} />
                );}}
              />
            <Route
              exact
              path="/logout"
              render={({history}) => {
                return <Logout history={history} resetState={this.resetState} />;
              }}
              />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

render(<App />, document.getElementById('app'));

export default App;
