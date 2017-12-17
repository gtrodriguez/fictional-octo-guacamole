import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import io from 'socket.io-client';
import store from './store';
import ConnectionLayer from './connectionlayer';
import Landing from './pages/landing';
import GameRoom from './pages/gameroom';
import GameList from './pages/gamelist';
import Header from './components/header';
import Logout from './pages/logout';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  alertWin() {
    window.alert('You won the game!');
  }

  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <ConnectionLayer>
            <div className="app">
              <Header />
              <Switch>
                <Route
                  path="/gameroom/:gameId"
                  render={({ history, match }) => {
                    return (<GameRoom
                      gameId={match.params.gameId}
                      history={history}
                    />);}} />
                <Route
                  path="/gamelist/:inviteGameId?"
                  render={({ history, match }) => {
                    return (<GameList
                      history={history}
                      match={match}
                      inviteGameId={match.params.inviteGameId} />
                    );}}
                  />
                <Route exact
                  path="/:inviteGameId?"
                  render={({ history, match }) => (<Landing
                    history={history}
                    inviteGameId={match.params.inviteGameId}
                  />)} />
                <Route
                  exact
                  path="/logout"
                  render={({ history }) => {
                    return <Logout history={history} />;
                  }}
                  />
              </Switch>
            </div>
          </ConnectionLayer>
        </Provider>
      </BrowserRouter>
    );
  }
}

render(<App />, document.getElementById('app'));

export default App;
