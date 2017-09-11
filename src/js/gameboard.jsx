import React from 'react';
import InteractiveTile from './interactivetile.jsx';
import GameBoardTile from './gameboardtile.jsx';

class GameBoard extends React.Component{
	constructor(props) {
    	super(props);

    	this.maxX = 8;
    	this.maxY = 8;
    	this.targetLength = 4;

    	this.state = {gameInstance: null, currentPlayer: 1};
    	this.updateScore = this.updateScore.bind(this);
    	this.handleClick = this.handleClick.bind(this);
    	this.checkGameBoard = this.checkGameBoard.bind(this);
    	this.checkColumnFull = this.checkColumnFull.bind(this);
    	this.currentPlayerSymbol = this.currentPlayerSymbol.bind(this);
    	this.resetGame = this.resetGame.bind(this);
    	this.handleResetClick = this.handleResetClick.bind(this);
	}

	componentWillMount(){
		this.resetGame();
	}

	componentWillUnmount(){

	}

	currentPlayerSymbol(reverse){
		return reverse ? ((this.state.currentPlayer === 1) ? "O" : "X") : (this.state.currentPlayer === 1)? "X" : "O";
	}

	updateScore(cellVal, runningScore){
		if(runningScore.currentSelection === null)
			runningScore.currentSelection = cellVal;

		if(cellVal){
			if(cellVal === runningScore.currentSelection){
				runningScore.currentComboLength++;
			}else{
				runningScore.currentComboLength = 1;
				runningScore.currentSelection = cellVal;
			}

			if(runningScore.currentComboLength === 4){
				return true;
			}
		}else{
			runningScore.currentSelection = null;
			runningScore.currentComboLength = 0;
		}

		return false;		
	}

	checkGameBoard() {
		var consecutive = 0,
			gameWon = false;

		var runningScore = {
			currentSelection : null,
			longestRun: 0
		};

		//horizontal
		for(var x = 0; x < 8; x++){
			runningScore.longestRun = 0;
			for(var y = 0; y < 8; y++){
				var cellVal = this.state.gameInstance[x][y];
				gameWon = this.updateScore(cellVal,runningScore);

				if(gameWon){
					return window.alert("Player " + this.currentPlayerSymbol() + " won horizontally!");
				}
			}
		}

		//vertical
		for(var x = 0; x < 8; x++){
			runningScore.longestRun = 0;
			for(var y = 0; y < 8; y++){
				var cellVal = this.state.gameInstance[y][x];
				gameWon = this.updateScore(cellVal,runningScore);

				if(gameWon){
					return window.alert("Player " + this.currentPlayerSymbol() + " won vertically!");
				}
			}
		}

		//diagonal down

		//diagonal up


		return false;
	}

	checkColumnFull(index){
		return this.state.gameInstance[index][this.maxX] === 0;
	}

	///put in the first available slot
	handleClick(enabled, index){
		console.log(index,this.props);

		for(var x = 0; x < this.maxX; x++){
			if(this.state.gameInstance[x][index] === 0){
				var copy = this.state.gameInstance; 
				copy[x][index] = this.state.currentPlayer;

				this.setState({gameInstance: copy});

				if(this.state.currentPlayer === 1){
					this.setState({currentPlayer : 2});
				}else{
					this.setState({currentPlayer : 1});
				}	

				break;
			}
		}

		this.checkGameBoard();
	}

	handleResetClick(){
		if(window.confirm("you sure?")){
			this.resetGame();
		}
	}

	resetGame (){
    	var gameMatrix = new Array(8);
    	for(var i = 0; i < 8; i++){
    		gameMatrix[i] = new Array(8); 
    		gameMatrix[i].fill(0);
    	}

    	this.setState({
    		gameInstance: gameMatrix
    	});
	}

	render () {
		return <div id="game-board-container">
			<div id="control-panel">
				<div id="">
					<span>Current Player:</span>
					<span>{this.currentPlayerSymbol()}</span>
				</div>
				<button type="button" onClick={this.handleResetClick}>Reset</button>
			</div>
			<div id="interactive-row">
			{
				this.state.gameInstance.map((cell,index) => {
					return <InteractiveTile key={index} x={index} 
					enabled={()=>{ return this.checkColumnFull(index);}} 
					handleClick={(e) => { console.log(e); this.handleClick(this.checkColumnFull(index),index) }} />
				})
			}
			</div>
			<div id="game-board">
			{
				this.state.gameInstance.map((column,x) => {
					return <div className="game-row" key={x}>{column.map((cell, y) => {
						return <GameBoardTile key={y} data-x={x} data-y={y} value={cell}/>
					})}</div>
				})
			}
			</div>
		</div>
	}
}

export default GameBoard