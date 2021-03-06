import React from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import UserControlPanel from '../components/usercontrolpanel';

class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.submitConnectUser = this.submitConnectUser.bind(this);
    this.submitUserRegistration = this.submitUserRegistration.bind(this);
    this.renderWelcomeMessage = this.renderWelcomeMessage.bind(this);
    this.renderGameColumn = this.renderGameColumn.bind(this);

    if (this.props.connection) {
      this.registerSocketEvents();
    }
  }

  componentWillReceiveProps(nextProps) {
    // if parent socket.io connection is initialized in this page,
    // then load the necessary components.
    if (!this.props.connection && nextProps.connection) {
      this.registerSocketEvents();
    }
  }

  registerSocketEvents() {
    this.props.connection.on('register-success', () => {
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
    this.props.connection.emit('login', username);
  }

  renderGameColumn() {
    if (this.props.user === null) {
      return null;
    }

    return (<div className="landing-content">
      <Button type="button">
        <Link to="/gamelist"><strong>Your Games</strong></Link>
      </Button>
    </div>);
  }

  renderWelcomeMessage() {
    if (this.props.user === null && !this.props.inviteGameId) {
      return <div className="landing-content">You must first sign in or register.</div>;
    } else if (this.props.user === null && this.props.inviteGameId) {
      return (<div className="landing-content">You&apos;ve been invited to a game but
      first sign in or register.</div>);
    } else if (this.props.inviteGameId) {
      return (<div className="landing-content">You&apos;ve been invited to a game!</div>);
    }
    return null;
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
          <Col sm={7}>
            <p>
            Connect X is a online multiplayer game project used to experiment with React.
            Long term goals include adding an artificial intelligent opponent,
            modifying the idea of gravity, and introducing new kinds of play options to
            the classic game.
            </p>
            <div>
              {
                this.renderWelcomeMessage()
              }
              <hr />
            </div>
            <div>
              {
                this.renderGameColumn()
              }
            </div>
          </Col>
          <Col sm={2} id="communication-column">
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
  connection: null,
  inviteGameId: '',
};

Landing.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object.isRequired,
  connection: PropTypes.object,
  inviteGameId: PropTypes.string,
};

const mapStateToProps = state => ({
  user: state.user,
  connection: state.connection,
});

export default connect(mapStateToProps)(Landing);
