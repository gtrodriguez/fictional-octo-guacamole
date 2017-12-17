import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../actionCreators';

class Logout extends React.Component {
  componentDidMount() {
    sessionStorage.removeItem('user');
    this.props.handleLogout();
    this.props.history.push('/');
  }

  render() {
    return <div>Logging out of app...</div>;
  }
}

Logout.propTypes = {
  history: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  handleLogout() {
    dispatch(logout());
  },
});

export default connect(null, mapDispatchToProps)(Logout);
