import logo from './images/img16.png'; // Import the logo image
import React, { useState } from 'react';
import { Nav, Button, Navbar, NavDropdown } from 'react-bootstrap';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons from react-icons

export default function Header() {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Navbar expand="lg" bg="light" variant="light">
      <Navbar.Brand>
        <img
          src={logo} // Set the path to the logo image
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="Logo"
        />{' '}
        VDX TesterTool 6.0.6
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="navbarToggleExternalContent"
        onClick={handleToggle}
        className={expanded ? 'open' : ''}
      >
        {expanded ? (
          <FaTimes className="menu-icon" /> // "X" icon when menu is open
        ) : (
          <FaBars className="menu-icon" /> // Three-bar icon when menu is closed
        )}
      </Navbar.Toggle>
      <Navbar.Collapse id="navbarToggleExternalContent">
        <Nav className="ml-auto">
          <Nav.Link href="#">Home</Nav.Link>
          <Nav.Link href="#">About</Nav.Link>
          <NavDropdown title="Dropdown" id="nav-dropdown">
            <NavDropdown.Item href="#">Item 1</NavDropdown.Item>
            <NavDropdown.Item href="#">Item 2</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#">Separated link</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
