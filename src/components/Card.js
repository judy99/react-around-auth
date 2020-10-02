import React from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext.js';

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);

  // Checking if you are the owner of the current card
  const isOwn = props.card.owner._id === currentUser._id;

  // Check if the card was liked by the current user
  const isLiked = props.card.likes.some(i => i._id === currentUser._id);

  // Creating a variable which you'll then set in `className` for the delete button
  const cardDeleteButtonClassName = (
  `btn gallery__icon-trash ${isOwn ? ' ' : 'gallery__icon-trash_hidden'}`
  );

  function handleClick(e) {
    props.onCardClick(props.card);
  }

  function handleLikeClick (e) {
    e.stopPropagation();
    props.onCardLike(props.card);
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    props.onCardDelete(props.card);
  }

  return (
    <li className="gallery__item" onClick={handleClick} style={{ backgroundImage: `url(${props.card.link})` }}  >
      <button className={cardDeleteButtonClassName} onClick={handleDeleteClick} ></button>
      <div className="gallery__bottom" >
        <h2 className="gallery__title">{props.card.name}</h2>
        <div className="gallery__like-wrapper">
          <button className={`btn gallery__like ${isLiked ? 'gallery__like_active' : ''} `} onClick={handleLikeClick} ></button>
          <div className="gallery__score">{props.card.likes.length}</div>
        </div>
      </div>
    </li>
  );
}
export default Card;
