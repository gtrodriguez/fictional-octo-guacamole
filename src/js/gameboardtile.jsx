import React from 'react';

class GameBoardTile extends React.Component{
	constructor(props){
		super(props);
	
		this.content = this.content.bind(this);
		this.gameBoardTileClass = this.gameBoardTileClass.bind(this);
	}

	content(){
		if(this.props.value === 0){
			return "";
		}else{
			return (this.props.value === 1) ? "X" : "O";
		}
	}

	gameBoardTileClass(){
		var className = "game-board-tile";

		if(this.props.value != 0){
			className += ((this.props.value === 1) ? " player-1" : " player-2");	
		}

		console.log(className);

		return className;
	}

	render(){
		return <div className={this.gameBoardTileClass()} >{this.content()}</div>
	}
}

export default GameBoardTile;