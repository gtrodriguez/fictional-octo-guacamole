import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Button, Label, ListGroup, ListGroupItem } from 'react-bootstrap';

class GameSelector extends React.Component {
  constructor(props) {
    super(props);
    this.inviteCode = null;
    this.selectorContent = this.selectorContent.bind(this);
  }

  selectorContent(){
    if(this.props.games.length == 0){
      return <div>You have no active games! Please create a new one!</div>;
    }

    return (<ListGroup>{this.props.games.map((game, index) => {
        return (<ListGroupItem data-game-instance-id={game._id}
          key={game._id}
          onClick={(e) => { e.preventDefault(); this.props.handleGameSelection(game._id); }} >
          <Grid>
            <Row>
              <Col md={2}>
                <strong>Player 1:</strong>
              </Col>
              <Col md={2}>
                {game.player1}
              </Col>
              <Col md={2}>
                <strong>Player 2:</strong>
              </Col>
              <Col md={2}>
                {game.player2}
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Label>Last Updated</Label><div>{game.lastUpdated}</div>
              </Col>
            </Row>
          </Grid>
        </ListGroupItem>);
      })}
      </ListGroup>);
  }

  joinDisabled() {
    var gameIdEl = document.getElementById('invite-game-id');
    if(gameIdEl && gameIdEl.value){
      return false;
    }

    return true;
  }

  render() {
    return (<div className="game-selector">
        <div className="new-game-section">
          <Button
            bsStyle="primary"
            onClick={(e) => { e.preventDefault(); this.props.handleGameSelection(null); }}
          >
            New Game
          </Button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Game Invite Code"
            name="invite-game-id"
            id="invite-game-id"
            onChange={(e) => { e.preventDefault();
              var currVal = e.target.value;
              if(currVal != this.props.inviteGameId)
                this.props.handleGameInviteUpdate();
            }} />
          <Button
            disabled={this.joinDisabled()}
            onClick={(e) => { e.preventDefault();
              this.props.handleRegisterGame(document.getElementById('invite-game-id').value);
            }}
          >
            Join Game
          </Button>
        </div>
        <hr />
        <div className="continue-game-section">
          { this.selectorContent() }
        </div>
      </div>);
  }
}

GameSelector.defaultProps = {
  games: [],
  inviteGameId: null
};

GameSelector.propTypes = {
  games: PropTypes.arrayOf(PropTypes.object),
  inviteGameId: PropTypes.string,
  handleGameSelection: PropTypes.func.isRequired,
  handleGameInviteUpdate: PropTypes.func.isRequired,
  handleRegisterGame: PropTypes.func.isRequired
};

export default GameSelector;
