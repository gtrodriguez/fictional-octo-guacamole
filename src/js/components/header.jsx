import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import RouteNavItem from './routenavitem';

class Header extends React.Component {
  renderAuthenticatedLinks() {
    if (this.props.user != null) {
      return (<Nav className="authenticated-section">
        <RouteNavItem href="/gamelist">Games</RouteNavItem>
      </Nav>);
    }

    return <Nav></Nav>
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
};


Header.PropTypes = {
  user: PropTypes.object
}

export default Header;