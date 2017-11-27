import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormControl, FormGroup, Grid, Row, Col, Button, Label, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class GameSelector extends React.Component {
  constructor(props) {
    super(props);
    this.selectorContent = this.selectorContent.bind(this);
    this.syncGameInvite = this.syncGameInvite.bind(this);
    this.state = {inviteGameId: null};
  }

  selectorContent(){
    if(this.props.games.length == 0){
      return <div>You have no active games! Please create a new one!</div>;
    }

    return (<ListGroup>{this.props.games.map((game, index) => {
        return (<ListGroupItem data-game-instance-id={game._id}
          key={game._id}>
          <Link to={`/gameroom/${game._id}`}>
            <Grid>
              <Row>
                <Col sm={2}>
                  <strong>Player 1:</strong>
                </Col>
                <Col sm={2}>
                  {game.player1}
                </Col>
                <Col sm={2}>
                  <strong>Player 2:</strong>
                </Col>
                <Col sm={2}>
                  {game.player2}
                </Col>
              </Row>
              <Row>
                <Col sm={2}>
                  <strong>Last Updated:</strong>
                </Col>
                <Col sm={6}>
                  {game.lastUpdated ? (new Date(game.lastUpdated)).toLocaleString('en-US') : ""}
                </Col>
              </Row>
            </Grid>
          </Link>
        </ListGroupItem>);
      })}
      </ListGroup>);
  }

  syncGameInvite() {
    var gameIdEl = document.getElementById('invite-game-id');
    this.setState({inviteGameId: gameIdEl.value});
  }

  joinDisabled() {
    return !this.state.inviteGameId;
  }

  render() {
    return (<div className="game-selector">
        <div className="new-game-section">
          <Button
            bsStyle="primary"
            onClick={(e) => { e.preventDefault(); this.props.createNewGame(); }}
            type="button"
          >
            New Game
          </Button>
        </div>
        <div>
          <Form inline>
            <FormGroup controlId="invite-game-id">
              <FormControl
                type="text"
                placeholder="Game Invite Code"
                onChange={(e) => { e.preventDefault();
                  this.syncGameInvite();
                }} />
            </FormGroup>
            <Button
              type="button"
              disabled={this.joinDisabled()}
              onClick={(e) => { e.preventDefault();
                this.props.handleRegisterGame(this.state.inviteGameId);
              }}
            >
              Join Game
            </Button>
          </Form>
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
  handleGameInviteUpdate: PropTypes.func.isRequired,
  handleRegisterGame: PropTypes.func.isRequired,
  createNewGame: PropTypes.func.isRequired,
};

export default GameSelector;
