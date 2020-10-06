import React from 'react';
import { NavLink } from 'react-router-dom';

function Menu(props) {
  if (props.loggedIn && props.auth) {
    return (
      <nav className="menu">
          <NavLink to="#" className="menu__link" activeClassName="menu__link_active" >my email here</NavLink>
          <NavLink to="/signout" className="menu__link" activeClassName="menu__link_active">Log out</NavLink>
      </nav>
    );
  }
  if (props.loggedIn || props.auth) {
    return (
      <nav className="menu">
        <NavLink to="/signup" className="menu__link" activeClassName="menu__link_active">Sign up</NavLink>
      </nav>
    )
  } else {
      return (
        <nav className="menu">
          <NavLink to="/signin" className="menu__link" activeClassName="menu__link_active">Log in</NavLink>
        </nav>
      )
    }
}

export default Menu;
