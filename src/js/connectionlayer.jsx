import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setSocketConnection, setUserDetails, setGameInstance, setAllGames } from './actionCreators';

class ConnectionLayer extends React.Component {
  componentWillMount() {
    const socket = io();

    socket.on('sync-game', (game) => {
      this.props.handleLoadGameInstance(game);
    });

    socket.on('sync-game-list', (games) => {
      this.props.handleSyncAllGames(games);
    });

    socket.on('login-success', (response) => {
      this.props.handleLoadUserDetails(response);
    });

    socket.on('retrieve-game', (game) => {
      this.props.handleLoadGameInstance(game);
    });

    socket.on('invite-to-game', (request) => {
      console.log(request);
    });

    const cachedUser = sessionStorage.getItem('user');

    if (cachedUser != null && !this.props.user) {
      const user = JSON.parse(cachedUser);
      socket.emit('login', user.username);
    }

    this.props.handleConnect(socket);
  }

  render() {
    return <div className="connection-layer">{ this.props.children }</div>;
  }
}

ConnectionLayer.defaultProps = {
  user: null,
};

ConnectionLayer.propTypes = {
  user: PropTypes.object,
  handleConnect: PropTypes.func.isRequired,
  handleLoadUserDetails: PropTypes.func.isRequired,
  handleLoadGameInstance: PropTypes.func.isRequired,
  handleSyncAllGames: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const mapDispatchToProps = dispatch => ({
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
  },
});

export default withRouter(connect(() => ({}), mapDispatchToProps)(ConnectionLayer));
