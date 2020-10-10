import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import {CurrentUserContext} from '../contexts/CurrentUserContext.js';

function Menu(props) {
  // const currentUser = React.useContext(CurrentUserContext);
  const history = useHistory();


  console.log('inside menu = ', props.loggedIn);
  console.log('inside menu email = ', props.email);


  // if (props.loggedIn) {
    return (
      <nav className="menu">
          <NavLink to="#" className="menu__link" activeClassName="menu__link_active" >{props.email}</NavLink>
          <NavLink to="/signin" className="menu__link" activeClassName="menu__link_active" onClick={signOut} >Log out</NavLink>
      </nav>
    );
  // }
}

export default Menu;
