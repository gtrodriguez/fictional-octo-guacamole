import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import GameBoard from '../components/gameboard';

class GameRoom extends React.Component {
  componentWillReceiveProps(nextProps) {
    // if parent socket.io connection is initialized in this page, then load the necessary components.
    if (!this.props.user && nextProps.user) {
      this.props.connection.emit('select-game', { _id: this.props.gameId });
    }
  }

  componentDidMount() {
    if (this.props.user) {
      this.props.connection.emit('select-game', { _id: this.props.gameId });
    }
  }

  renderGameRoomContent() {
    if (this.props.gameId != null) {
      if (this.props.gameInstance != null && this.props.user != null) {
        return (<GameBoard
          gameInstance={this.props.gameInstance}
          updateGameInstance={this.props.updateGameInstance}
          connection={this.props.connection}
          user={this.props.user}
        />);
      }
      return <h3>Loading game...</h3>;
    }
    return <div>An error occurred and a game was not selected.</div>;
  }

  render() {
    return (<div id="connectx-root" className="gameroom-page">
      <Grid id="game-container">
        <Row>
          <Col sm={12}>
            <h2 className="title">Game Room</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={12} id="gameboard-column">
            {this.renderGameRoomContent()}
          </Col>
        </Row>
      </Grid>
    </div>
    );
  }
}

GameRoom.defaultProps = {
  gameId: null,
  gameInstance: null,
  user: null,
};


GameRoom.propTypes = {
  connection: PropTypes.object.isRequired,
  user: PropTypes.object,
  gameId: PropTypes.string,
  gameInstance: PropTypes.object,
  updateGameInstance: PropTypes.func.isRequired,
};

export default GameRoom;
