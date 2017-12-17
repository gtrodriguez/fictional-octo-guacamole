import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormControl, ControlLabel, FormGroup, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setAllGames } from '../actionCreators';

class GameControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.syncEmail = this.syncEmail.bind(this);
    this.disableInviteBtn = this.disableInviteBtn.bind(this);
    this.handleGameInvite = this.handleGameInvite.bind(this);
    this.renderEmailSentAlert = this.renderEmailSentAlert.bind(this);

    this.state = {
      inviteeEmail: null,
      emailSent: false,
      animationHandler: null,
    };
  }

  componentWillUnmount() {
    if (this.state.animationHandler) {
      clearTimeout(this.state.animationHandler);
    }
  }

  syncEmail() {
    this.setState({ inviteeEmail: document.getElementById('player-2-email').value });
  }

  disableInviteBtn() {
    return this.state.inviteeEmail === '' && this.state.inviteeEmail === null;
  }

  handleGameInvite(inviteeEmail) {
    const that = this;
    this.props.connection.emit('invite-player', {
      gameId: this.props.gameInstance._id,
      senderUserName: this.props.user.username,
      email: inviteeEmail,
    });
    this.setState({
      emailSent: true,
      animationHandler: setTimeout(() => {
        that.setState({ emailSent: false, animationHandler: null });
      }, 4000),
    });
    const newGameList = this.props.allGames.slice();
    newGameList.find(game => game._id === this.props.gameInstance._id).inviteeEmail = inviteeEmail;
    this.props.handleSyncAllGames(newGameList);
  }

  renderEmailSentAlert() {
    if (this.state.emailSent) {
      return (<Alert bsStyle="success">
        <strong>Game Invite Sent!</strong> Tell your pal to check their email!
      </Alert>);
    }
    return null;
  }

  renderPlayer1Row() {
    return (<div>
      <strong className="player-label">Player 1:</strong>
      {this.props.gameInstance && this.props.gameInstance.player1}
    </div>);
  }

  renderPlayer2Row() {
    if (this.props.gameInstance.player2) {
      return (<div>
        <strong className="player-label">Player 2:</strong>
        {this.props.gameInstance && this.props.gameInstance.player2}
      </div>);
    }

    return null;
  }

  renderActionItems() {
    if (this.props.gameInstance) {
      if (this.props.gameInstance.isActive && this.props.user) {
        if (!this.props.gameInstance.gameOver) {
          return (<div>
            <strong className="current-player-label">Current Player:</strong>
            {this.props.gameInstance.currentPlayer}
          </div>);
        } else if (this.props.gameInstance.currentPlayer === this.props.user.username) {
          return (<div>
            <strong>Congratulations, you&apos;ve won!!! Woot!</strong>
          </div>);
        }
        return (<div>
          <strong>Sorry, yo! Better luck next time.</strong>
        </div>);
      }
      return (<div>
        <div className="start-warning">
          <Alert bsStyle="warning">
            <strong>This game has not been started yet!</strong>
            <div>
              <strong>Please send this code to another player!</strong>
              <div><small>Pst, you could also send a an invite to me at
                gabriel.torres.rodriguez@gmail.com. :)</small></div>
            </div>
          </Alert>
        </div>
        <div>
          <Form
            inline
            onSubmit={(e) => {
              e.preventDefault();
              this.handleGameInvite(this.state.inviteeEmail);
            }}
          >
            <input
              name="active-game-id"
              id="active-game-id"
              readOnly
              type="hidden"
              value={this.props.gameInstance._id}
            />
            <FormGroup controlId="player-2-email">
              <ControlLabel>Player 2 Email:</ControlLabel>
              {' '}
              <FormControl
                placeholder="player2@exampleEmail.com"
                type="text"
                onChange={(e) => { e.preventDefault(); this.syncEmail(); }}
                required
              />
            </FormGroup>
            {' '}
            <Button bsStyle="primary" type="submit" disabled={this.disableInviteBtn()}>
              Invite
            </Button>
          </Form>
        </div>
        {
          this.renderEmailSentAlert()
        }
      </div>);
    }

    return null;
  }

  render() {
    return (<div>
      {this.renderPlayer1Row()}
      {this.renderPlayer2Row()}
      {this.renderActionItems()}
    </div>);
  }
}

GameControlPanel.propTypes = {
  gameInstance: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  connection: PropTypes.object.isRequired,
  allGames: PropTypes.array.isRequired,
  handleSyncAllGames: PropTypes.func.isRequired,
};

export default GameControlPanel;
