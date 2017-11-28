import React from 'react';
import PropTypes from 'prop-types';

class Logout extends React.Component {
  componentDidMount() {
    sessionStorage.removeItem('user');
    this.props.resetState();
    this.props.history.push('/');
  }

  render() {
    return <div>Logging out of app...</div>;
  }
}

Logout.propTypes = {
  history: PropTypes.object.isRequired,
  resetState: PropTypes.func.isRequired,
};

export default Logout;
