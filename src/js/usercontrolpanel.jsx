import React from 'react';
import PropTypes from 'prop-types';

class UserControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.registerUser = this.registerUser.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  registerUser() {
    const usernameEl = document.getElementById('username');
    const emailEl = document.getElementById('email');
    const userObj = {};

    if (usernameEl.value) {
      userObj.username = usernameEl.value;
    } else {
      return window.alert('You must select a username!');
    }

    if (emailEl.value){
      userObj.email = emailEl.value;
    } else {
      return window.alert('You must select an email!');
    }

    this.props.submitUserRegistration(userObj);

    return;
  }

  connectUser() {
    const emailEl = document.getElementById('active-email');

    if (emailEl.value){
      this.props.submitConnectUser(emailEl.value);
    } 

    return window.alert('You must select an email!');
  }

  renderContent() {
    if (this.props.user) {
      return (<div id="user-details">
            <label htmlFor="username">UserName: {this.user.username}</label>
            <label htmlFor="email">Email: {this.user.email}</label>
          </div>
        );
    }

    return (
          <div id="user-details">
            <label htmlFor="username">UserName: <input type="text" id="username" name="username" /></label>
            <label htmlFor="email">Email: <input type="text" id="email" name="email" /></label>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); this.registerUser(); }}
            >
              Register
            </button>
            <hr/>
            <label htmlFor="active-email">Email: <input type="text" id="active-email" name="active-email" /></label>
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); this.connectUser(); }}
            >
              Connect
            </button>
          </div>
      );
  }

  render() {
    return (
        <div>{this.renderContent()}</div>
      );
  }
};

UserControlPanel.defaultProps = {
  user: null
};

UserControlPanel.PropTypes = {
  user: PropTypes.object,
  submitUserRegistration: PropTypes.func.isRequired,
  submitConnectUser: PropTypes.func.isRequired
};


export default UserControlPanel;