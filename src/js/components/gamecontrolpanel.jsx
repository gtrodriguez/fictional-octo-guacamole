import React from 'react';
import PropTypes from 'prop-types'
import {Form, FormControl, ControlLabel, FormGroup, Grid, Row, Col, Button} from 'react-bootstrap';

class GameControlPanel extends React.Component {
  renderPlayer1Row () {
    return (<Row>
      <Col sm={3}>
        <strong>Player 1:</strong>
      </Col>
      <Col sm={3}>{this.props.gameInstance && this.props.gameInstance.player1}</Col>
    </Row>);
  }

  renderPlayer2Row () {
    return (<Row>
      <Col sm={3}>
        <strong>Player 2:</strong>
      </Col>
      <Col sm={3}>{this.props.gameInstance && this.props.gameInstance.player2}</Col>
    </Row>);
  }

  renderActionItems () {
    if (this.props.gameInstance) {
      if (this.props.gameInstance.isActive && this.props.user) {
        if (!this.props.gameInstance.gameOver) {
          return (<Row>
            <Col sm={3}>
              <strong>Current Player:</strong>
            </Col>
            <Col sm={3}>
              {this.props.gameInstance.currentPlayer}
            </Col>
          </Row>);
        } else if (this.props.gameInstance.currentPlayer === this.props.user.username){
          return (<Row>
            <Col sm={4}>
              <strong>Congratulations, you've won!!! Woot!</strong>
            </Col>
          </Row>);
        } else {
          return (<Row>
            <Col sm={4}>
              <strong>Sorry, yo! Better luck next time.</strong>
            </Col>
          </Row>);
        }
      } else {
        return <Row>
          <Row>
            <Col sm={2}>
              <strong>This game has not been started yet!</strong>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <strong>Please send this code to another player! (email not implemented yet)</strong>
              <Form inline>
                <FormGroup controlId="active-game-id">
                  <ControlLabel>GameId:</ControlLabel>
                  <FormControl readOnly type="text" value={this.props.gameInstance._id} />
                </FormGroup>
                {' '}
                <FormGroup controlId="player-2-email">
                  <ControlLabel>Player 2 Email:</ControlLabel>
                  <FormControl placeholder="player2@exampleEmail.com" type="text" />
                </FormGroup>
                {' '}
                <Button bsStyle="primary">Invite</Button>
              </Form>
            </Col>
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
  user: PropTypes.object.isRequired,
};

export default GameControlPanel;