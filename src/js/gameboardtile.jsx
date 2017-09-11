import React from 'react';

class GameBoardTile extends React.Component{
	constructor(props){
		super(props);
	
		this.content = this.content.bind(this);
	}

	content(){
		if(this.props.value === 0){
			return "";
		}else{
			return (this.props.value == 1) ? "X" : "O";
		}
	}


	render(){
		return <div className="game-board-tile">{this.content()}</div>
	}
}

export default GameBoardTile;