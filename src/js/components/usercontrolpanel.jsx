import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Button, ControlLabel, Label } from 'react-bootstrap';

class UserControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.registerUser = this.registerUser.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.connectUser = this.connectUser.bind(this);
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
    console.log("conenct user");
    
    const usernameEl = document.getElementById('active-username');

    if (usernameEl.value){
      return this.props.submitConnectUser(usernameEl.value);
    }

    return window.alert('You must select an username!');
  }

  renderContent() {
    if (this.props.user) {
      return (<Grid id="user-details">
            <Row>
              <ControlLabel htmlFor="username">UserName: {this.props.user.username}</ControlLabel>
            </Row>
            <Row>
              <ControlLabel htmlFor="email">Email: {this.props.user.email}</ControlLabel>
            </Row>
          </Grid>
        );
    }

    return (
          <Grid id="user-details">
            <Row>
              <Row>
                <ControlLabel htmlFor="username">UserName: <input type="text" id="username" name="username" /></ControlLabel>
              </Row>
              <Row>
                <ControlLabel htmlFor="email">Email: <input type="text" id="email" name="email" /></ControlLabel>
              </Row>
              <Row>
                <Button
                  bsStyle="success"
                  type="button"
                  onClick={(e) => { e.preventDefault(); this.registerUser(); }}
                >
                  Register
                </Button>
              </Row>
            </Row>
            <hr/>
            <Row>
              <Row>
                <ControlLabel htmlFor="active-username">Username: <input type="text" id="active-username" name="active-username" /></ControlLabel>
              </Row>
              <Row>
                <Button
                  bsStyle="primary"
                  type="button"
                  onClick={(e) => { e.preventDefault(); this.connectUser(); }}
                >
                  Sign In
                </Button>
              </Row>
            </Row>
          </Grid>
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