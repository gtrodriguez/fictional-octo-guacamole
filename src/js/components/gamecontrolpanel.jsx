import React from 'react';
import PropTypes from 'prop-types'
import {Form, FormControl, ControlLabel, FormGroup, Grid, Row, Col, Button} from 'react-bootstrap';

class GameControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.syncEmail = this.syncEmail.bind(this);
    this.disableInviteBtn = this.disableInviteBtn.bind(this);

    this.state = {
      inviteeEmail: null,
    };
  }

  renderPlayer1Row () {
    return (<div>
      <strong className="player-label">Player 1:</strong>
      {this.props.gameInstance && this.props.gameInstance.player1}
    </div>);
  }

  renderPlayer2Row () {
    return (<div>
      <strong className="player-label">Player 2:</strong>
      {this.props.gameInstance && this.props.gameInstance.player2}
    </div>);
  }

  syncEmail () {
    this.setState({inviteeEmail: document.getElementById('player-2-email').value});
  }

  disableInviteBtn () {
    return this.state.inviteeEmail === '' && this.state.inviteeEmail === null;
  }

  renderActionItems () {
    if (this.props.gameInstance) {
      if (this.props.gameInstance.isActive && this.props.user) {
        if (!this.props.gameInstance.gameOver) {
          return (<div>
            <strong className="current-player-label">Current Player:</strong>
            {this.props.gameInstance.currentPlayer}
          </div>);
        } else if (this.props.gameInstance.currentPlayer === this.props.user.username){
          return (<div>
            <strong>Congratulations, you've won!!! Woot!</strong>
          </div>);
        } else {
          return (<div>
            <strong>Sorry, yo! Better luck next time.</strong>
          </div>);
        }
      } else {
        return <div>
          <div>
            <strong>This game has not been started yet!</strong>
          </div>
          <div>
            <strong>Please send this code to another player!</strong>
            <Form inline>
              <FormGroup controlId="active-game-id">
                <ControlLabel>GameId:</ControlLabel>
                <FormControl readOnly type="text" value={this.props.gameInstance._id} />
              </FormGroup>
              {' '}
              <FormGroup controlId="player-2-email">
                <ControlLabel>Player 2 Email:</ControlLabel>
                <FormControl
                placeholder="player2@exampleEmail.com"
                type="text"
                onChange={(e) => {e.preventDefault(); this.syncEmail();}}
                />
              </FormGroup>
              {' '}
              <Button bsStyle="primary" disabled={this.disableInviteBtn()} onClick={(e) => {
                e.preventDefault();
                this.props.handleGameInvite(this.state.inviteeEmail);
              }}>
                Invite
              </Button>
            </Form>
          </div>
        </div>;
      }
    }
  }

  render() {
    return  <div>
        {this.renderPlayer1Row()}
        {this.renderPlayer2Row()}
        {this.renderActionItems()}
    </div>;
  }
}

GameControlPanel.PropTypes = {
  gameInstance: PropTypes.object,
  user: PropTypes.object.isRequired,
  handleGameInvite: PropTypes.func.isRequired,
};

export default GameControlPanel;