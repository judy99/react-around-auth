import React from 'react';
import Menu from './Menu';

function Header(props) {
  return (
    <header className="header">
      <a href="/" className="link header__logo logo">Around
      <span className="logo__small">The U.S.</span></a>
      <Menu loggedIn={props.loggedIn} isSignup={props.isSignup} />
    </header>
  );
}

export default Header;
