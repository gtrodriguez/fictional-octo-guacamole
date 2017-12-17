import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InteractiveTile from './interactivetile';
import GameBoardTile from './gameboardtile';
import GameControlPanel from './gamecontrolpanel';
import { setGameInstance } from '../actionCreators';

class GameBoard extends React.Component {
  constructor(props) {
    super(props);

    // dimensions to use as bounds for checking
    this.maxX = 8;
    this.maxY = 8;
    // for this iteration of the game, define the goal length
    this.targetLength = 4;
    // used for calculating a winner, if any
    this.runningScore = {
      currentSelection: null,
      currentComboLength: 0,
      longestRun: 0,
    };

    this.updateScore = this.updateScore.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.checkGameBoard = this.checkGameBoard.bind(this);
    this.isSlotOpen = this.isSlotOpen.bind(this);
    this.gameStateClass = this.gameStateClass.bind(this);
    this.resolvePlayerSymbol = this.resolvePlayerSymbol.bind(this);
    this.tileEnabled = this.tileEnabled.bind(this);
    this.checkForWinner = this.checkForWinner.bind(this);
  }

  resolvePlayerSymbol(playerName) {
    if (playerName === this.props.gameInstance.player1) {
      return 'X';
    } else if (playerName === this.props.gameInstance.player2) {
      return 'O';
    }
    return '';
  }

  updateScore(cellVal) {
    if (this.runningScore.currentSelection === null) {
      this.runningScore.currentSelection = cellVal;
    }
    if (cellVal) {
      if (cellVal === this.runningScore.currentSelection) {
        this.runningScore.currentComboLength += 1;
      } else {
        this.runningScore.currentComboLength = 1;
        this.runningScore.currentSelection = cellVal;
      }
      if (this.runningScore.currentComboLength === 4) {
        return true;
      }
    } else {
      this.runningScore.currentSelection = null;
      this.runningScore.currentComboLength = 0;
    }
    return false;
  }

  checkForWinner(gameInstance, direction) {
    if (this.runningScore.currentComboLength === this.targetLength) {
      console.log(`Player ${this.resolvePlayerSymbol(gameInstance.currentPlayer)} won ${direction}!`);
      return true;
    }
    return false;
  }

  checkGameBoard(gameInstance) {
    let x = 0;
    let y = 0;
    let tempX = 0;
    let tempY = 0;
    let cellVal = null;

    // reset the current game board checking object
    this.runningScore = {
      currentSelection: null,
      longestRun: 0,
      currentComboLength: 0,
    };

    // horizontal
    for (x = 0; x < 8; x += 1) {
      this.runningScore.longestRun = 0;
      for (y = 0; y < 8; y += 1) {
        cellVal = gameInstance.scoreBoard[x][y];
        this.updateScore(cellVal);
        if (this.checkForWinner(gameInstance, 'horizontally')) {
          return true;
        }
      }
    }

    // vertical
    for (x = 0; x < 8; x += 1) {
      this.runningScore.longestRun = 0;
      for (y = 0; y < 8; y += 1) {
        cellVal = gameInstance.scoreBoard[y][x];
        this.updateScore(cellVal);
        if (this.checkForWinner(gameInstance, 'vertically')) {
          return true;
        }
      }
    }

    // diagonal down
    for (y = 3; y < 8; y += 1) {
      x = 0;
      tempX = x;
      tempY = y;
      while (tempX < 8 && tempY >= 0) {
        cellVal = gameInstance.scoreBoard[tempY][tempX];
        this.updateScore(cellVal);
        if (this.checkForWinner(gameInstance, 'diagonal down 1')) {
          return true;
        }
        tempY -= 1;
        tempX += 1;
      }
    }

    for (x = 1; x <= 4; x += 1) {
      y = 7;
      tempX = x;
      tempY = y;
      while (tempX < 8 && tempY >= 0) {
        cellVal = gameInstance.scoreBoard[tempY][tempX];
        this.updateScore(cellVal);
        if (this.checkForWinner(gameInstance, 'diagonal down 2')) {
          return true;
        }
        tempY -= 1;
        tempX += 1;
      }
    }

    // diagonal up
    for (y = 0; y <= 4; y += 1) {
      x = 0;
      tempX = x;
      tempY = y;
      while (tempX < 8 && tempY < 8) {
        cellVal = gameInstance.scoreBoard[tempY][tempX];
        this.updateScore(cellVal);
        if (this.checkForWinner(gameInstance, 'diagonal up 1')) {
          return true;
        }
        tempY += 1;
        tempX += 1;
      }
    }

    for (x = 1; x <= 4; x += 1) {
      y = 0;
      tempX = x;
      tempY = y;
      while (tempX < 8 && tempY < 8) {
        cellVal = gameInstance.scoreBoard[tempY][tempX];
        this.updateScore(cellVal);
        if (this.checkForWinner(gameInstance, 'diagonal up 2')) {
          return true;
        }
        tempY += 1;
        tempX += 1;
      }
    }

    return false;
  }

  // put in the first available slot starting from the top
  handleClick(index) {
    const newGameInstance = Object.assign({}, this.props.gameInstance);

    for (let x = 0; x < this.maxX; x += 1) {
      if (newGameInstance.scoreBoard[x][index] === 0) {
        newGameInstance.scoreBoard[x][index] = this.props.gameInstance.currentPlayer;
        break;
      }
    }

    if (this.checkGameBoard(newGameInstance)) {
      newGameInstance.gameOver = true;
    } else if (newGameInstance.currentPlayer === newGameInstance.player1) {
      newGameInstance.currentPlayer = newGameInstance.player2;
    } else {
      newGameInstance.currentPlayer = newGameInstance.player1;
    }

    this.props.handleGameInstanceUpdate(newGameInstance);
    this.submitGameUpdate(newGameInstance);
  }

  gameStateClass() {
    let className = 'game-board-container ';
    if (this.props.gameInstance.gameOver) {
      className += 'game-over';
    }
    return className;
  }

  submitGameUpdate(newGameInstance) {
    this.props.connection.emit('player-submit-turn', newGameInstance);
  }

  isSlotOpen(index) {
    return !this.props.gameInstance.scoreBoard[this.maxY - 1][index];
  }

  tileEnabled(index) {
    return !(this.props.gameInstance.gameOver ||
          !this.props.gameInstance.isActive ||
          this.props.gameInstance.currentPlayer !== this.props.user.username ||
          !this.isSlotOpen(index));
  }

  render() {
    return (<div id="game-container">
      <div id="game-board-container" className={this.gameStateClass()}>
        <div className="control-panel">
          <GameControlPanel 
            gameInstance={this.props.gameInstance}
            user={this.props.user}
            connection={this.props.connection}
            allGames={this.props.allGames}
            handleSyncAllGames={this.props.handleSyncAllGames}
          />
        </div>
        <div>
          <div className="interactive-row">
            {
              this.props.gameInstance.scoreBoard.map((cell, index) =>
                (<InteractiveTile
                  index={index}
                  enabled={(this.tileEnabled(index))}
                  key={`interactivetile-${index}`} // eslint-disable-line react/no-array-index-key
                  handleClick={
                    (e) => {
                      e.preventDefault(); if (!this.tileEnabled(index)) { return; }
                      this.handleClick(index);
                    }
                  }
                />))
            }
          </div>
        </div>
        <div>
          <div className="game-board-grid">
            {
              this.props.gameInstance.scoreBoard.map((column, x) =>
                (
                  <div
                    className="game-row"
                    key={`game-row-${x}`} // eslint-disable-line react/no-array-index-key
                  >
                    {column.map((cell, y) =>
                      (<GameBoardTile
                        data-x={x}
                        data-y={y}
                        key={`game-cell-${x}-${y}`} // eslint-disable-line react/no-array-index-key
                        value={this.resolvePlayerSymbol(cell)}
                      />))
                    }
                  </div>
                ),
              )
            }
          </div>
        </div>
      </div>
    </div>);
  }
}

GameBoard.propTypes = {
  gameInstance: PropTypes.object.isRequired,
  connection: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  allGames: PropTypes.array.isRequired,
  handleGameInstanceUpdate: PropTypes.func.isRequired,
  handleSyncAllGames: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  handleGameInstanceUpdate(gameInstance) {
    dispatch(setGameInstance(gameInstance));
  },
  handleSyncAllGames(games) {
    dispatch(setAllGames(games));
  },
});

export const UnwrappedGameBoard = GameBoard;
export default connect(null, mapDispatchToProps)(GameBoard);
