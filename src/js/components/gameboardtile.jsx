import React from 'react';
import PropTypes from 'prop-types';

class GameBoardTile extends React.Component {
  constructor(props) {
    super(props);

    this.content = this.content.bind(this);
    this.gameBoardTileClass = this.gameBoardTileClass.bind(this);
  }

  content() {
    if (this.props.value === 0) {
      return '';
    }

    return (this.props.value === 1) ? 'X' : 'O';
  }

  gameBoardTileClass() {
    let className = 'game-board-tile';

    if (this.props.value !== 0) {
      className += ((this.props.value === 1) ? ' player-1' : ' player-2');
    }
    
    return className;
  }

  render() {
    return <div className={this.gameBoardTileClass()} >{this.content()}</div>;
  }
}

GameBoardTile.propTypes = {
  value: PropTypes.number.isRequired,
};

export default GameBoardTile;
