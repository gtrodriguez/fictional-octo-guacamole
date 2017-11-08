import React from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import InteractiveTile from './interactivetile';
import GameBoardTile from './gameboardtile';
import GameControlPanel from './gamecontrolpanel';

class GameBoard extends React.Component {
  constructor(props) {
    super(props);

    this.maxX = 8;
    this.maxY = 8;
    this.targetLength = 4;

    this.state = { gameInstance: null, currentPlayer: 1, timeStamp: null };
    this.updateScore = this.updateScore.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.checkGameBoard = this.checkGameBoard.bind(this);
    this.checkColumnFull = this.checkColumnFull.bind(this);
    this.currentPlayerSymbol = this.currentPlayerSymbol.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.gameStateClass = this.gameStateClass.bind(this);
  }

  componentWillMount() {
    this.resetGame();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  currentPlayerSymbol(reverse) {
    return reverse ? ((this.state.currentPlayer === 1) ? 'O' : 'X') : (this.state.currentPlayer === 1)? 'X' : 'O';
  }

  updateScore(cellVal, runningScore) {
    if (runningScore.currentSelection === null)
      runningScore.currentSelection = cellVal;

    if (cellVal) {
      if (cellVal === runningScore.currentSelection) {
        runningScore.currentComboLength += 1;
      } else {
        runningScore.currentComboLength = 1;
        runningScore.currentSelection = cellVal;
      }

      if (runningScore.currentComboLength === 4) {
        return true;
      }
    } else {
      runningScore.currentSelection = null;
      runningScore.currentComboLength = 0;
    }

    return false;   
  }

  checkGameBoard() {
    let consecutive = 0,
      gameWon = false;
    let x = 0;
    let y = 0;
    let tempX = 0;
    let tempY = 0;
    let runningScore = {
      currentSelection : null,
      longestRun: 0,
    };
    let cellVal = null;

    //horizontal
    for (x = 0; x < 8; x += 1) {
      runningScore.longestRun = 0;
      for (y = 0; y < 8; y += 1) {
        cellVal = this.state.gameInstance[x][y];
        gameWon = this.updateScore(cellVal, runningScore);

        if (gameWon) {
          console.log('Player ' + this.currentPlayerSymbol() + ' won horizontally!');
          return true;
        }
      }
    }

    //vertical
    for (x = 0; x < 8; x += 1) {
      runningScore.longestRun = 0;
      for (y = 0; y < 8; y += 1) {
        cellVal = this.state.gameInstance[y][x];
        gameWon = this.updateScore(cellVal, runningScore);

        if (gameWon) {
          console.log('Player ' + this.currentPlayerSymbol() + ' won vertically!');
          return true;
        }
      }
    }

    //diagonal down
    for (y = 3; y < 8; y += 1) {
      x = 0;
      tempX = x;
      tempY = y;
      while (tempX < 8 && tempY >= 0) {
        cellVal = this.state.gameInstance[tempX][tempY];
        gameWon = this.updateScore(cellVal, runningScore);

        if (gameWon) {
          console.log('Player ' + this.currentPlayerSymbol() + ' won diagonal down!');
          return true;
        }

        tempY -= 1;
        tempX += 1;
      }

      y += 1;
    }

    for (x = 1; x <= 4; x += 1) {
      y = 7;
      tempX = x;
      tempY = y;
      while (tempX < 8 && tempY >= 0) {
        cellVal = this.state.gameInstance[tempX][tempY];
        gameWon = this.updateScore(cellVal, runningScore);

        if(gameWon){
          console.log('Player ' + this.currentPlayerSymbol() + ' won diagonal down!!');
          return true;
        }

        tempY -= 1;
        tempX += 1;
      }

      x += 1;
    }

    //diagonal up
    for (y = 0; y <= 4; y += 1) {
      x = 0;
      tempX = x;
      tempY = y;
      while (tempX < 8 && tempY < 8) {
        cellVal = this.state.gameInstance[tempX][tempY];
        gameWon = this.updateScore(cellVal, runningScore);

        if(gameWon){
          console.log('Player ' + this.currentPlayerSymbol() + ' won diagonal up!');
          return true;
        }

        tempY += 1;
        tempX += 1;
      }

      y += 1;
    }

    for (x = 1; x <= 4; x += 1) {
      y = 0;
      tempX = x;
      tempY = y;
      while (tempX < 8 && tempY < 8) {
        cellVal = this.state.gameInstance[tempX][tempY];
        gameWon = this.updateScore(cellVal, runningScore);

        if (gameWon) {
          console.log('Player ' + this.currentPlayerSymbol() + ' won diagonal up!!');
          return true;
        }

        tempY += 1;
        tempX += 1;
      }

      x += 1;
    }   

    return false;
  }

  checkColumnFull(index){
    return this.state.gameInstance[index][this.maxX] === 0;
  }

  ///put in the first available slot
  handleClick(enabled, index) {
    if (this.state.gameOver) {
      return;
    }

    for (var x = 0; x < this.maxX; x += 1) {
      if (this.state.gameInstance[x][index] === 0) {
        var copy = this.state.gameInstance;
        copy[x][index] = this.state.currentPlayer;

        this.setState({ gameInstance: copy });

        break;
      }
    }

    if (this.checkGameBoard()) {
      this.setState({ gameOver: true });
      return;
    }

    if (this.state.currentPlayer === 1) {
      this.setState({ currentPlayer: 2 });
    } else {
      this.setState({ currentPlayer: 1 });
    } 
  }

  handleResetClick() {
    if(window.confirm('you sure?')){
      this.resetGame();
    }
  }

  resetGame () {
    var gameMatrix = new Array(8);
    for (var i = 0; i < 8; i += 1) {
      gameMatrix[i] = new Array(8);
      gameMatrix[i].fill(0);
    }

    this.setState({
      gameInstance: gameMatrix,
      gameOver: false,
    });
  }

  gameStateClass () {
    var className = '';

    if(this.state.gameOver){
      className += 'game-over';
    }

    return className;
  }

  render () {
    return (<Grid id="game-container">
      <Row id="game-board-container" className={this.gameStateClass()}>
        <Row id="control-panel">
          <GameControlPanel handleReset={this.handleReset} gameInstance={this.props.gameInstance} />
        </Row>
        <Row id="interactive-row">
          {
            this.state.gameInstance.map((cell, index) => {
              return <InteractiveTile 
                key={index} 
                x={index} 
                enabled={() => { return this.checkColumnFull(index); }} 
                handleClick={(e) => { e.preventDefault(); if (this.state.gameOver || !this.state.gameInstance.isActive) return;
                  this.handleClick(this.checkColumnFull(index), index); }} />
            })
          }
        </Row>
        <Row id="game-board">
          {
            this.state.gameInstance.map((column, x) => {
              return (<div className="game-row" key={x}>{column.map((cell, y) => {
                return <GameBoardTile key={y} data-x={x} data-y={y} value={cell} />})}</div>
              );
            })
          }
        </Row>
      </Row>
    </Grid> );
  }
}

GameBoard.defaultProps = {
  gameInstance: null
};

GameBoard.PropTypes = {
  gameInstance: PropTypes.object,
  handleWin: PropTypes.func.isRequired
};

export default GameBoard;
