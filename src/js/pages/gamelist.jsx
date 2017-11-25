import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import GameSelector from '../components/gameselector';

class GameList extends React.Component {
  constructor(props) {
    super(props);

    this.handleRegisterGame = this.handleRegisterGame.bind(this);
    this.renderGameColumn = this.renderGameColumn.bind(this);
    this.createNewGame = this.createNewGame.bind(this);
  }

  componentDidMount() {
    this.props.connection.on('register-success', (game) => {
      this.props.history.push(`/gameroom/${game._id}`);
    });

    this.props.connection.on('register-error', (msg) => {
      window.alert('An error occured while registering the game.');
    });

    this.props.connection.on('new-game-success', (game) => {
      this.props.handleGameRetrieval(game);
      this.props.history.push(`/gameroom/${game._id}`);
    });
  }

  handleRegisterGame(gameId) {
    this.props.connection.emit('register-game', {
      gameId: gameId,
      username: this.props.user.username,
    });
  }

  createNewGame() {
    this.props.connection.emit('new-game', this.props.user.username);
  }

  handleGameInviteUpdate(newInviteGameId) {
    // do something
  }

  renderGameColumn() {
    return (<GameSelector
      games={this.props.allGames}
      inviteGameId={this.props.match.params.inviteGameId}
      handleRegisterGame={this.handleRegisterGame}
      handleGameInviteUpdate={this.handleGameInviteUpdate}
      createNewGame={this.createNewGame}
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
};

GameList.propTypes = {
  user: PropTypes.object,
  connection: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  allGames: PropTypes.arrayOf(PropTypes.object),
  handleGameRetrieval: PropTypes.func.isRequired,
};

export default GameList;
