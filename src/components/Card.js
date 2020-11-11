import React from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext.js';

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const [liked, setLiked] = React.useState(props.card.likes.some(i => i === currentUser._id));
  const [counterLikes, setCounterLikes] = React.useState(props.cardLikes.length);

  // const [likes, setLikes] = React.useState(props.card.likes.length);

  // Checking if you are the owner of the current card
  const isOwn = props.card.owner === currentUser._id;

  // Check if the card was liked by the current user
  // let isLiked = props.card.likes.some(i => i._id === currentUser._id);

  // Creating a variable which you'll then set in `className` for the delete button
  const cardDeleteButtonClassName = (
  `btn gallery__icon-trash ${isOwn ? ' ' : 'gallery__icon-trash_hidden'}`
  );

  const cardLikeButtonClassName = (
    `btn gallery__like ${liked ? 'gallery__like_active' : ''} `
  );

  function handleClick(e) {
    props.onCardClick(props.card);
  }

  function handleLikeClick (e) {
    e.stopPropagation();
    setLiked(!liked);
    liked ? setCounterLikes(counterLikes - 1) : setCounterLikes(counterLikes + 1);
    // if (liked) {
    //   setCounterLikes(counterLikes - 1);
    // } else {
    //   setCounterLikes(counterLikes + 1);
    // }
    props.onCardLike(props.card);
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    props.onCardDelete(props.card);
  }

  React.useEffect(() => {
    setLiked(props.cardLikes.some(i => i === currentUser._id));
    setCounterLikes(props.cardLikes.length);
}, [props.cardLikes]);

  return (
    <li className="gallery__item" onClick={handleClick} style={{ backgroundImage: `url(${props.card.link})` }}  >
      <button className={cardDeleteButtonClassName} onClick={handleDeleteClick} ></button>
      <div className="gallery__bottom" >
        <h2 className="gallery__title">{props.card.name}</h2>
        <div className="gallery__like-wrapper">
          <button className={cardLikeButtonClassName} onClick={handleLikeClick} ></button>
          <div className="gallery__score">{counterLikes}</div>
        </div>
      </div>
    </li>
  );
}
export default Card;
