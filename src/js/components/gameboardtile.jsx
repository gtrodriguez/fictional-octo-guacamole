import React from 'react';
import PropTypes from 'prop-types';

class GameBoardTile extends React.Component {
  constructor(props) {
    super(props);

    this.gameBoardTileClass = this.gameBoardTileClass.bind(this);
  }

  gameBoardTileClass() {
    let className = 'game-board-tile';

    if (this.props.value !== '') {
      className += ((this.props.value === 'X') ? ' player-1' : ' player-2');
    }

    return className;
  }

  render() {
    return <div className={this.gameBoardTileClass()} >{this.props.value}</div>;
  }
}

GameBoardTile.propTypes = {
  value: PropTypes.string.isRequired,
};

export default GameBoardTile;
