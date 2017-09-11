import React from 'react';

class InteractiveTile extends React.Component {
	constructor(props){
    	super(props);

    	this.interactiveTitleClassName = this.interactiveTitleClassName.bind(this);
	}

	interactiveTitleClassName(){
		if(this.props.enabled){
			return "interactive-tile"
		}else{
			return "interactive-tile disabled";
		}
	}

	render(){
		return <div className={this.interactiveTitleClassName()} onClick={(e) => {e.preventDefault(); this.props.handleClick(e)}}></div>
	}
}

export default InteractiveTile;