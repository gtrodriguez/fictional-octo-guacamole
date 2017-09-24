import React from 'react';
import PropTypes from 'prop-types';

class InteractiveTile extends React.Component {
  constructor(props) {
    super(props);

    this.interactiveTitleClassName = this.interactiveTitleClassName.bind(this);
  }

  interactiveTitleClassName() {
    if (this.props.enabled) {
      return 'interactive-tile';
    }

    return 'interactive-tile disabled';
  }

  render() {
    return (<div
      className={this.interactiveTitleClassName()}
      onClick={(e) => { e.preventDefault(); this.props.handleClick(e); }}
    />);
  }
}

InteractiveTile.propTypes = {
  enabled: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default InteractiveTile;
