import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GameSelector from '../components/gameselector';
import { setGameInstance, setAllGames } from '../actionCreators';

class GameList extends React.Component {
  constructor(props) {
    super(props);

    this.handleRegisterGame = this.handleRegisterGame.bind(this);
    this.renderGameColumn = this.renderGameColumn.bind(this);
    this.createNewGame = this.createNewGame.bind(this);
    this.renderGameColumn = this.renderGameColumn.bind(this);

    if (this.props.connection) {
      this.registerSocketEvents();
    }
  }

  componentWillReceiveProps(nextProps) {
    // if parent socket.io connection is initialized in this page,
    // then load the necessary components.
    if (!this.props.connection && nextProps.connection) {
      this.registerSocketEvents();
    }
  }

  registerSocketEvents() {
    this.props.connection.on('register-success', (game) => {
      this.props.history.push(`/gameroom/${game._id}`);
    });

    this.props.connection.on('register-error', () => {
      window.alert('An error occured while registering the game.');
    });

    this.props.connection.on('new-game-success', (game) => {
      this.handleGameRetrieval(game);
      this.props.history.push(`/gameroom/${game._id}`);
    });
  }

  handleGameRetrieval(gameObj) {
    if (!gameObj.isActive) {
      const newGameList = this.props.allGames.slice();
      newGameList.push(gameObj);
      this.props.handleSyncAllGames(newGameList);
    }

    this.props.handleGameInstanceUpdate(gameObj);
  }

  renderGameColumn() {
    return (<GameSelector
      games={this.props.allGames}
      inviteGameId={this.props.match.params.inviteGameId}
      user={this.props.user}
    />);
  }

  renderContent() {
    if (this.props.user) {
      return (<Grid id="game-container">
        <Row>
          <Col sm={12}>
            <h2 className="title">Welcome back, {this.props.user.username}!</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={9} id="gameboard-column">
            {
              this.renderGameColumn()
            }
          </Col>
          <Col sm={3} id="communication-column" />
        </Row>
      </Grid>);
    }

    return (<Grid id="game-container">
      <Row>
        <Col>Loading user info...</Col>
      </Row>
    </Grid>);
  }

  render() {
    return (<div id="connectx-root" className="game-list-page">
      {this.renderContent()}
    </div>
    );
  }
}

GameList.defaultProps = {
  user: null,
  connection: null,
  allGames: [],
  inviteGameId: '',
};

GameList.propTypes = {
  user: PropTypes.object,
  connection: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  allGames: PropTypes.arrayOf(PropTypes.object),
  handleGameInstanceUpdate: PropTypes.func.isRequired,
  handleSyncAllGames: PropTypes.func.isRequired,
  inviteGameId: PropTypes.string,
};

const mapStateToProps = state => ({
  user: state.user,
  connection: state.connection,
  allGames: state.allGames,
});

const mapDispatchToProps = dispatch => ({
  handleSyncAllGames(response) {
    dispatch(setAllGames(response));
  },
  handleGameInstanceUpdate(gameInstance) {
    dispatch(setGameInstance(gameInstance));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GameList);
