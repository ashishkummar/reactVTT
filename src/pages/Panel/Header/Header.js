import logo from '../../../assets/img/icon-128.png'; // Import the logo image

import React, { useState } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons from react-icons
import './header.css';
export default function Header() {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Navbar bg-dark p-1 expand="sm" bg="light" variant="light">
        <Navbar.Brand style={{ fontSize: '1rem', paddingTop: '0px' }}>
          <img
            src={logo} // Set the path to the logo image
            width="25"
            height="25"
            className="d-inline-block align-top"
            alt="Logo"
          />{' '}
          VDX TesterTool 6.0.6
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbarToggleExternalContent"
          onClick={handleToggle}
          className={expanded ? 'open btn-sm' : 'btn-sm'}
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
    </>
  );
}
