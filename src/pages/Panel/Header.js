import React, { useState } from 'react';
import { Nav, Button, Navbar, NavDropdown } from 'react-bootstrap';
import '../../js/jquery-3.4.1';

import './bootstrap.min.css';

export default function Header() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="pos-f-t">
        <div className="collapse" id="navbarToggleExternalContent">
          <div className="bg-dark p-4">
            <h4 className="text-white">Menu Items</h4>
            <Nav className="flex-column">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">About</Nav.Link>
              <NavDropdown title="Dropdown" id="nav-dropdown">
                <NavDropdown.Item href="#">Item 1</NavDropdown.Item>
                <NavDropdown.Item href="#">Item 2</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </div>
        </div>
        <nav
          className="navbar navbar-dark bg-dark"
          style={{ justifyContent: 'flex-end' }}
        >
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-controls="navbarToggleExternalContent"
            aria-expanded={expanded}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}
            id="navbarToggleExternalContent"
          >
            <ul
              className="navbar-nav ml-auto"
              style={{ alignItems: 'flex-end' }}
            >
              <li className="nav-item active">
                <a className="nav-link" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}
