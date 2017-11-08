import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

class Header extends React.Component {
  render() {
    return (<div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Home</Link>
            </Navbar.Brand>

          </Navbar.Header>
          <Nav pullRight>
            <NavItem></NavItem>
          </Nav>
        </Navbar>
      </div>);
  }
};


Header.PropTypes = {
  user: PropTypes.object
}

export default Header;