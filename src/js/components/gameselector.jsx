import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormControl, FormGroup, Grid, Row, Col, Button, Label, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import GameLink from './gamelink';

class GameSelector extends React.Component {
  constructor(props) {
    super(props);
    this.selectorContent = this.selectorContent.bind(this);
    this.syncGameInvite = this.syncGameInvite.bind(this);
    this.state = {inviteGameId: ''};
    this.renderGameInvites = this.renderGameInvites.bind(this);
  }

  componentDidMount() {
    this.setState({inviteGameId: this.props.inviteGameId});
  }

  selectorContent(){
    if(this.props.games.filter(game => game.isActive === true).length === 0){
      return <div>You have no active games! Please create a new one!</div>;
    }

    return (<ListGroup>{this.props.games.filter(game => game.isActive === true).map((game, index) => {
        return <GameLink key={game._id} game={game} user={this.props.user} />;
      })}
      </ListGroup>);
  }

  syncGameInvite(e) {
    this.setState({inviteGameId: e.target.value});
  }

  joinDisabled() {
    return !this.state.inviteGameId;
  }

  renderGameInvites() {
    if (this.props.games.filter(game => game.isActive === false).length) {
      return (
        <div>
          <h3>Pending Games</h3>
        <ListGroup>{this.props.games.filter(game => game.isActive === false).map((game, index) => {
        return (<GameLink
          key={game._id}
          game={game}
          user={this.props.user}
          handleRegisterGame={this.props.handleRegisterGame}/>);
      })}
      </ListGroup>
      </div>);
    }
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
          <Form inline onSubmit={(e) => { e.preventDefault();
                this.props.handleRegisterGame(this.state.inviteGameId);
              }}>
            <FormGroup
              controlId="invite-game-id"
              >
              <FormControl
                type="text"
                placeholder="Game Invite Code"
                value={this.state.inviteGameId}
                onChange={this.syncGameInvite}
                required/>
            </FormGroup>
            <Button
              type="submit"
              disabled={this.joinDisabled()}>
              Join Game
            </Button>
          </Form>
        </div>
        <hr />
        <div className="continue-game-section">
          <h3>Active Games</h3>
          { this.selectorContent() }
        </div>
        {
          this.renderGameInvites()
        }
      </div>);
  }
}

GameSelector.defaultProps = {
  games: [],
  inviteGameId: '',
};

GameSelector.propTypes = {
  games: PropTypes.arrayOf(PropTypes.object),
  inviteGameId: PropTypes.string,
  handleRegisterGame: PropTypes.func.isRequired,
  createNewGame: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default GameSelector;
