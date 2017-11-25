import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import GameBoard from '../components/gameboard';

class GameRoom extends React.Component {
  componentDidMount() {
    const that = this;
    setTimeout(function initialLoad() {
      if (that.props.gameId != null) { // continue a previous game
        that.props.connection.emit('select-game', { _id: that.props.gameId });
      }
    }, 500);
  }

  renderGameRoomContent() {
    if (this.props.gameId != null) {
      if (this.props.gameInstance != null) {
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
};


GameRoom.propTypes = {
  connection: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  gameId: PropTypes.string,
  gameInstance: PropTypes.object,
  updateGameInstance: PropTypes.func.isRequired,
};

export default GameRoom;
