import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem, Grid, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

class GameLink extends React.Component {
  constructor(props) {
    super(props);

    this.renderFirstRowStatus = this.renderFirstRowStatus.bind(this);
    this.renderLinkContent = this.renderLinkContent.bind(this);
  }

  renderFirstRowStatus() {
    if (this.props.game.isActive) {
      return (<Row>
        <Col sm={2}>
          <strong>Player 1:</strong>
        </Col>
        <Col sm={2}>
          {this.props.game.player1}
        </Col>
        <Col sm={2}>
          <strong>Player 2:</strong>
        </Col>
        <Col sm={2}>
          {this.props.game.player2}
        </Col>
      </Row>);
    } else if (this.props.game.player2 === this.props.user.username
        || this.props.game.inviteeEmail === this.props.user.email) {
      return (<Row>
        <Col sm={2}>
          <strong>Sent By:</strong>
        </Col>
        <Col sm={2}>
          {this.props.game.player1}
        </Col>
        <Col sm={4}>
          <Button
            bsStyle="success"
            bsSize="small"
            type="button"
            onClick={(e) => {
              e.preventDefault(); e.stopPropagation();
              this.props.handleRegisterGame(this.props.game._id);
            }}
            id="accept-btn"
          >
            Accept Invite
          </Button>
        </Col>
      </Row>);
    } else if (this.props.game.player2) {
      return (<Row>
        <Col sm={8}>
          <strong>{this.props.game.player2} has not yet accepted the invite!</strong>
        </Col>
      </Row>);
    } else if (this.props.game.inviteeEmail) {
      return (<Row>
        <Col sm={8}>
          <strong>Email sent to {this.props.game.inviteeEmail},
            but has not yet accepted the invite!</strong>
        </Col>
      </Row>);
    }

    return (<Row>
      <Col sm={8}>
        <strong>Invite Not Sent!</strong>
      </Col>
    </Row>);
  }

  renderLinkContent() {
    if (this.props.game.isActive || this.props.game.player1 === this.props.user.username) {
      return (<Link to={`/gameroom/${this.props.game._id}`}>
        <Grid>
          { this.renderFirstRowStatus() }
          <Row>
            <Col sm={2}>
              <strong>Last Updated:</strong>
            </Col>
            <Col sm={6}>
              {this.props.game.lastUpdated ? (new Date(this.props.game.lastUpdated)).toLocaleString('en-US') : ''}
            </Col>
          </Row>
        </Grid>
      </Link>);
    }

    return (<Grid>
      { this.renderFirstRowStatus() }
    </Grid>);
  }

  render() {
    return (<ListGroupItem
      data-game-instance-id={this.props.game._id}
      key={this.props.game._id}
    >
      { this.renderLinkContent() }
    </ListGroupItem>);
  }
}

GameLink.defaultProps = {
  handleRegisterGame: null,
};

GameLink.propTypes = {
  game: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleRegisterGame: PropTypes.func,
};

export default GameLink;
