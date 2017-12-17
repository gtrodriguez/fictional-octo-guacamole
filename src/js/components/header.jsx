import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

class Header extends React.Component {
  renderAuthenticatedLinks() {
    if (this.props.user != null) {
      return (<Nav className="authenticated-section">
        <LinkContainer to="/gamelist">
          <NavItem>Games</NavItem>
        </LinkContainer>
        <LinkContainer to="/logout">
          <NavItem>Log Out</NavItem>
        </LinkContainer>
      </Nav>);
    }

    return null;
  }

  render() {
    return (<div>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link className="home-link" to="/">Home</Link>
          </Navbar.Brand>
          {this.renderAuthenticatedLinks()}
        </Navbar.Header>
      </Navbar>
    </div>);
  }
}

Header.defaultProps = {
  user: null,
};

Header.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(Header);
