import React from 'react';
import PropTypes from 'prop-types'
import { Grid, Row, Col, Button} from 'react-bootstrap';

class GameControlPanel extends React.Component {
  renderPlayer1Row () {
    return <Row>
      <strong>Player 1:</strong> {this.props.gameInstance && this.props.gameInstance.player1}
    </Row>;
  }

  renderPlayer2Row () {
    return <Row>
      <strong>Player 2:</strong> {this.props.gameInstance && this.props.gameInstance.player2}
    </Row>;
  }

  renderActionItems () {
    if (this.props.gameInstance){
      if (this.props.gameInstance.isActive) {
        return  <Row>
          <Button onClick={this.props.handleReset}>
            Reset
          </Button>
        </Row>;
      } else {
        return <Row>
          <Row>
            <strong>This game has not been started yet!</strong>
          </Row>
          <Row>
            <strong>Please send this code to another player! (email not implemented yet)</strong>
            <input readOnly type="text" name="active-game-id" id="active-game-id" value={this.props.gameInstance._id} />
            <input name="player-2-email" id="player-2-email" type="text" />
            <Button bsStyle="primary">Invite</Button>
          </Row>
        </Row>;
      }
    }
  }

  render() {
    return  <Grid>
        {this.renderPlayer1Row()}
        {this.renderPlayer2Row()}
        {this.renderActionItems()}
    </Grid>;
  }
}

GameControlPanel.PropTypes = {
  gameInstance: PropTypes.object,
  handleReset: PropTypes.func
};

export default GameControlPanel;