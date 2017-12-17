import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setSocketConnection, setUserDetails, setGameInstance, setAllGames } from './actionCreators';

class ConnectionLayer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const that = this;
    const socket = io();

    socket.on('sync-game', (game) => {
      that.props.handleLoadGameInstance({
        gameInstance: game,
      });
    });

    socket.on('sync-game-list', (games) => {
      that.props.handleSyncAllGames({
        allGames: games,
      });
    });

    socket.on('login-success', (response) => {
      that.props.handleLoadUserDetails(response);
    });

    socket.on('retrieve-game', (game) => {
      that.props.handleLoadGameInstance(game);
    });

    socket.on('invite-to-game', (request) => {
      console.log(request);
    });

    const cachedUser = sessionStorage.getItem('user');

    if(cachedUser != null && !this.props.user){
      const user = JSON.parse(cachedUser);
      socket.emit('login', user.username);
    }

    this.props.handleConnect(socket);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render () {
    return <div className="connection-layer">{ this.props.children }</div>;
  }
};

const mapDispatchToProps = (dispatch) => ({
  handleConnect(connection) {
    dispatch(setSocketConnection(connection));
  },
  handleLoadUserDetails(response) {
    sessionStorage.setItem('user', JSON.stringify(response.user));
    dispatch(setUserDetails(response));
  },
  handleLoadGameInstance(response) {
    dispatch(setGameInstance(response));
  },
  handleSyncAllGames(response) {
    dispatch(setAllGames(response));
  }
});

export default withRouter(connect(() => ({}), mapDispatchToProps)(ConnectionLayer));
