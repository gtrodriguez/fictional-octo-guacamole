import React from 'react';
import PropTypes from 'prop-types';

class GameSelector extends React.Component {
  constructor(props) {
    super(props);

    this.selectorContent = this.selectorContent.bind(this);
  }

  selectorContent(){
    if(this.props.games.length == 0){
      return <div>You have no active games! Please create a new one!</div>;
    }

    return (<ul>{this.props.games.map((game, index) => {
        return (<li data-game-instance-id={game.id} 
          onClick={(e) => { e.preventDefault(); this.props.handleGameSelection(game.Id); }} >
          <label>Player 1:</label><span>{game.player1}</span>
          <label>Player 2:</label><span>{game.player2}</span>
          <label>Last Updated</label><span>{game.lastUpdated}</span>
        </li>);
      })}
      </ul>);
  }

  render() {
    return (<div className="game-selector">
        <div className="new-game-section">
          <button
            className="btn btn-primary"
            onClick={(e) => { e.preventDefault(); this.props.handleGameSelection(null); }}
          >New Game
          </button>
        </div>
        <hr />
        <div className="continue-game-section">
          { this.selectorContent() }
        </div>
      </div>);
  }
}

GameSelector.defaultProps = {
  games: []
};

GameSelector.propTypes = {
  games: PropTypes.arrayOf(PropTypes.object),
  handleGameSelection: PropTypes.func.isRequired
};

export default GameSelector;
