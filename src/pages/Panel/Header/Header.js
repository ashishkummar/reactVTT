import logo from '../../../assets/img/icon-128.png'; // Import the logo image
import logoRed from '../../../assets/img/img16_2.gif';
import vttConfig from '../vtt-config.json';
import React, { useState, useEffect } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons from react-icons
import './header.css';
import AlertTicker from './AlertTicker';
import Trackvtt from '../../TrackerAPI/Trackvtt';

export default function Header() {
  const TT = new Trackvtt();
  const [expanded, setExpanded] = useState(false);
  const [headerLogo, setHeaderLogo] = useState({
    logotype: logo,
    logoTitle: false,
    newVersionAvailable: false,
  });

  const handleToggle = () => {
    setExpanded(!expanded);
    TT.track('burgerMenuClick');
  };

  useState(() => {
    fetch(
      'https://creative.exponential.com/creative/devshowcase/VTT/config.json?=' +
        new Date().getTime()
    )
      .then((response) => response.text())
      .then((content) => {
        let _data = JSON.parse(content);
        if (_data.releasedVersion !== vttConfig.releasedVersion)
          setHeaderLogo({
            logotype: logoRed,
            logoTitle:
              'Click here to update to version ' + _data.releasedVersion,
            newVersionAvailable: true,
          });
      });
  }, []);

  return (
    <>
      <Navbar bg-dark p-1 expand="sm" bg="light" variant="light">
        <Navbar.Brand style={{ fontSize: '1rem', paddingTop: '0px' }}>
          <img
            src={headerLogo.logotype} // Set the path to the logo image
            width="25"
            height="25"
            className="d-inline-block align-top"
            alt={headerLogo.logoTitle ? headerLogo.logoTitle : ''}
          />{' '}
          VDX TesterTool {vttConfig.releasedVersion}{' '}
          {headerLogo.newVersionAvailable ? (
            <AlertTicker headerLogo={headerLogo} />
          ) : (
            ''
          )}
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
            <Nav.Link
              href="https://creative.exponential.com/creative/devshowcase/slimPic/"
              target="_blanlk"
            >
              SlimPic
            </Nav.Link>
            <Nav.Link
              href="https://wiki.exponential.com/display/~ashish.kumar/Chrome+Extensions"
              target="_blank"
            >
              About
            </Nav.Link>
            <Nav.Link href="https://tinyurl.com/mupc75ju" target="_blank">
              Help
            </Nav.Link>
            {
              <NavDropdown title="VTT Archive" id="nav-dropdown">
                <NavDropdown.Item href="#">Dowload VTT 6.0.2</NavDropdown.Item>
                <NavDropdown.Item href="#">Dowload VTT 6.0.1</NavDropdown.Item>
                {/* <NavDropdown.Divider />
                <NavDropdown.Item href="#">Separated link</NavDropdown.Item> */}
              </NavDropdown>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
