import React from 'react';
import {render} from 'react-dom';
import GameBoard from './gameboard.jsx';

class App extends React.Component{
	constructor(props) {
    	super(props);

    	this.state = {
    		activePlayer: 1,
    		winningPlayer: null
    	}

    	this.alertWin = this.alertWin.bind(this);
	}

	componentDidMount(){

	}

	componentWillUnmount(){

	}

	alertWin(){
		//window.alert("You won the game!");
	}

	render() {
		return <div id="connectx-root">Welcome to Connect X!
			<div id="game-container">
				<GameBoard handleWin={this.alertWin()}/>
			</div>
		</div>
	}
}


render(<App />, document.getElementById("app"));

export default App