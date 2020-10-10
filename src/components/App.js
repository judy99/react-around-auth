import React, {useEffect} from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Footer from './Footer';
import Main from './Main';
import {api} from '../utils/api.js';
import {CurrentUserContext} from '../contexts/CurrentUserContext.js';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteConfirmationPopup from './DeleteConfirmationPopup';
import PopupWithImage from './PopupWithImage';
import Loader from './Loader';
import { Route, Switch } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import * as auth from '../utils/auth.js';

function App() {
  const [isEditProfilePopupOpen, setEditPopup] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlace] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatar] = React.useState(false);
  const [isDeleteConfirmationPopup, setDeleteConfirmationPopup] = React.useState(false);
  const [isPopupWithImageOpen, setPopupWithImage] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [deleteCard, setDeleteCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState({});
  const [isInfoToolTip, setInfoToolTip] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState('');

  const history = useHistory();

  React.useEffect(() => {
    setIsLoading(true);
    api.getAppInfo().then((res) => {setIsLoading(false);})
    .catch((err) => console.log(err))
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  React.useEffect(() => {
    api.getUserInfo().then(res => {
      setCurrentUser(res);
    })
    .catch((err) => console.log(err));
  });

  React.useEffect(() => {
    api.getInitialCards().then(res => { setCards(res)}).catch((err) => console.log(err));
  }, [cards]);

  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    // Send a request to the API and getting the updated card data
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      // Create a new array based on the existing one and putting a new card into it
      const newCards = cards.map((c) => c._id === card._id ? newCard : c);
      // Update the state
      setCards(newCards);
    });
}

  function handleCardDelete(card) {
    setDeleteConfirmationPopup(!isDeleteConfirmationPopup);
    setDeleteCard(card);
  }

  function handleConfirmDelete() {
    setIsLoading(true);
    closeAllPopups();
    if (isDeleteConfirmationPopup) {
      api.removeCard(deleteCard._id).then(() => {
      // Create a new array based on the existing one and removing a card from it
        const newCards = cards.filter((c) => c._id !== deleteCard._id);
      // Update the state
        setCards(newCards);}).catch((err) => console.log(err)).finally(() => {
      setDeleteCard(null);
      setIsLoading(false);
    });
  }
}

  function handleEditAvatarClick () {
    setEditAvatar(true);
  }

  function handleEditProfileClick () {
    setEditPopup(true);
  }

  function handleAddPlaceClick () {
    setAddPlace(true);
  }

  function closeAllPopups () {
    setEditAvatar(false);
    setEditPopup(false);
    setAddPlace(false);
    setSelectedCard(null);
    setDeleteConfirmationPopup(false);
    setInfoToolTip(false);
  }

  function handleCardClick(card) {
    setPopupWithImage(true);
    setSelectedCard(card);
  }

  function handleUpdateUser(user) {
    setIsLoading(true);
    closeAllPopups();
    api.updateUserInfo(user).then((res) => {
      currentUser.name = res.name;
      currentUser.about = res.about;
    }).catch((err) => console.log(err)).finally(() => {
      setIsLoading(false);
    });
  }

  function handleUpdateAvatar(avatar) {
    closeAllPopups();
    setIsLoading(true);
    api.setUserAvatar(avatar).then((res) => {
      currentUser.avatar = res.avatar;}).catch((err) => console.log(err)).finally(() => {
      setIsLoading(false);
    });
  }

  function handleAddPlace(newCard) {
    closeAllPopups();
    setIsLoading(true);
    api.addCard(newCard).then((res) => {
      setCards([...cards, res]);}).catch((err) => console.log(err)).finally(() => {
      setIsLoading(false);
    });
  }

  function handleSignup() {
    setInfoToolTip(true);
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function signOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setUsername('');
    history.push('/signin');
  }

  React.useEffect( () => {
  // if the user has a token in localStorage,
  // this function will check that the user has a valid token
  const jwt = localStorage.getItem('jwt');

  if (jwt) {
    // we'll verify the token
    auth.getContent(jwt).then((res) => {
      if (res) {
        let userData = { email: res.data.email, password: res.data.password };
        setLoggedIn(true);
        setUsername(userData.email);
        history.push("/");
      }
    });
  }
}, [loggedIn]);


      return (
    <div className="page">
     {
       isLoading ? <Loader /> : ''
     }

      <Switch>
        <Route path="/signup">
          <Register onSignup={handleSignup} onCloseToolTip={closeAllPopups} isInfoToolTip={isInfoToolTip} />

        </Route>

        <Route path="/signin">
          <Login handleLogin={handleLogin} loggedIn={loggedIn} />
        </Route>

        <Route exact path="/">
        <CurrentUserContext.Provider value={currentUser}>
          <Main
          loggedIn={loggedIn}
          onEditProfile={handleEditProfileClick}
          onEditAvatar={handleEditAvatarClick}
          onAddPlace={handleAddPlaceClick}
          isEditProfilePopupOpen={isEditProfilePopupOpen}
          isAddPlacePopupOpen={isAddPlacePopupOpen}
          isEditAvatarPopupOpen={isEditAvatarPopupOpen}
          isDeleteConfirmationPopup={isDeleteConfirmationPopup}
          isPopupWithImageOpen={isPopupWithImageOpen}
          selectedCard={selectedCard}
          onSelectedCard={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          // isInfoToolTip= {isInfoToolTip}
          username={username}
          onSignOut={signOut}
           />
           <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
           <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
           <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace} />
           <DeleteConfirmationPopup isOpen={isDeleteConfirmationPopup} onClose={closeAllPopups} onConfirmDelete={handleConfirmDelete} />
           <PopupWithImage isOpen={isPopupWithImageOpen} card={selectedCard} onClose={closeAllPopups} />
         </CurrentUserContext.Provider>
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
