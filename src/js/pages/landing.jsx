import React from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserControlPanel from '../components/usercontrolpanel';

class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.submitConnectUser = this.submitConnectUser.bind(this);
    this.submitUserRegistration = this.submitUserRegistration.bind(this);
  }

  componentDidMount() {
    this.props.connection.on('register-success', (response) => {
      this.handleConnect(response);
      this.props.history.push('/gamelist');
    });

    this.props.connection.on('register-failed', (response) => {
      window.alert(response.reason);
    });
  }

  submitUserRegistration(user) {
    this.props.connection.emit('register', user);
  }

  submitConnectUser(username) {
    console.log('submit username connection', username);
    this.props.connection.emit('login', username);
  }

  renderGameColumn() {
    if (this.props.user == null) {
      return <div className="landing-content">You must first sign in or register.</div>;
    }
    return (<div className="landing-content">
      <Button type="button">
        <Link to="/gamelist"><strong>Your Games</strong></Link>
      </Button>
    </div>);
  }

  render() {
    return (<div id="connectx-root" className="landing-page">
      <Grid id="game-container">
        <Row>
          <Col sm={12}>
            <h2 className="title">Welcome to Connect X!</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={9}>
            Connect X is an multiplayer game project made to experiment with React with.
            Long term goals include adding an artificial intelligent opponent,
            modifying the idea of gravity, and introducing new kinds of play options to
            the classic game.
          </Col>
        </Row>
        <Row>
          <Col sm={3} id="gameboard-column">
            {
              this.renderGameColumn()
            }
          </Col>
          <Col sm={6} id="communication-column">
            <UserControlPanel
              user={this.props.user}
              submitUserRegistration={this.submitUserRegistration}
              submitConnectUser={this.submitConnectUser}
            />
          </Col>
        </Row>
      </Grid>
    </div>
    );
  }
}

Landing.defaultProps = {
  user: null,
};

Landing.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object.isRequired,
  connection: PropTypes.object.isRequired,
};

export default Landing;
