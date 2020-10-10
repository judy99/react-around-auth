import React from 'react';
import Card from './Card';
import Header from './Header';
import { NavLink } from 'react-router-dom';
import {CurrentUserContext} from '../contexts/CurrentUserContext.js';

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);
  return (
    <>
    <Header>
      <li><NavLink to="/" className="menu__link" activeClassName="menu__link_active" >{props.username}</NavLink></li>
      <li><NavLink to="/signin" className="menu__link" onClick={props.onSignOut}>Log out</NavLink></li>
    </Header>
    <main className="main">
      <section className="profile">
        <div className="profile__person">
          <div className="profile__avatar-wrapper">
            <img src={currentUser.avatar} alt="User ptofile avatar" className="profile__avatar" />
            <div className="profile__avatar-hover" onClick={props.onEditAvatar} ></div>
          </div>
          <div className="profile__info">
            <div className="profile__info-wrapper">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button type="button" className="btn profile__edit-btn" onClick={props.onEditProfile}></button>
            </div>
            <p className="profile__occupation">{currentUser.about}</p>
          </div>
        </div>
        <button type="button" className="btn profile__add-btn" onClick={props.onAddPlace}></button>
      </section>
      <ul className="gallery">
      { props.cards.map(item => {
        return <Card card={item} key={item._id} onCardClick={props.onSelectedCard} onCardLike={props.onCardLike} onCardDelete={props.onCardDelete} /> }
      )
    }
      </ul>
    </main>
    </>
  );
}
export default Main;
