import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Button, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

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
      window.alert('You must select a username!');
      return;
    }

    if (emailEl.value) {
      userObj.email = emailEl.value;
    } else {
      window.alert('You must select an email!');
      return;
    }

    this.props.submitUserRegistration(userObj);
  }

  connectUser() {
    const usernameEl = document.getElementById('active-username');

    if (usernameEl.value) {
      return this.props.submitConnectUser(usernameEl.value);
    }

    return window.alert('You must select an username!');
  }

  renderContent() {
    if (this.props.user) {
      return (<Grid id="user-details">
        <Row>
          <ControlLabel className="login-label" htmlFor="username">UserName:</ControlLabel>
          {this.props.user.username}
        </Row>
        <Row>
          <ControlLabel className="login-label" htmlFor="email">Email:</ControlLabel>
          {this.props.user.email}
        </Row>
      </Grid>);
    }

    return (
      <Grid id="user-details">
        <Row>
          <Form onSubmit={(e) => { e.preventDefault(); this.registerUser(); }}>
            <div className="login-form-element">
              <FormGroup controlId="username">
                <ControlLabel>Username:</ControlLabel>
                <FormControl type="text" required />
              </FormGroup>
              <FormGroup controlId="email">
                <ControlLabel>Email:</ControlLabel>
                <FormControl type="email" required />
              </FormGroup>
            </div>
            <Button
              bsStyle="success"
              type="submit"
            >
              Register
            </Button>
          </Form>
        </Row>
        <hr />
        <Row>
          <Form onSubmit={(e) => { e.preventDefault(); this.connectUser(); }}>
            <div className="login-form-element">
              <FormGroup controlId="active-username">
                <ControlLabel>Username:</ControlLabel>
                <FormControl type="text" required />
              </FormGroup>
              <Button
                bsStyle="primary"
                type="submit"
              >
                Sign In
              </Button>
            </div>
          </Form>
        </Row>
      </Grid>);
  }

  render() {
    return (
      <div>{this.renderContent()}</div>
    );
  }
}

UserControlPanel.defaultProps = {
  user: null,
};

UserControlPanel.propTypes = {
  user: PropTypes.object,
  submitUserRegistration: PropTypes.func.isRequired,
  submitConnectUser: PropTypes.func.isRequired,
};


export default UserControlPanel;
