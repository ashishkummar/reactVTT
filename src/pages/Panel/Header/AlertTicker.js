import React from 'react';
import './header.css';

export default function AlertTicker(prop) {
  return <div className="updateAlert"> {prop.headerLogo.logoTitle}</div>;
}
