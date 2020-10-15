import React from 'react';
import { useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Footer from './Footer';
import Main from './Main';
import {api} from '../utils/api.js';
import Loader from './Loader';
import { Route, Switch } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import * as auth from '../utils/auth.js';
import { httpStatusCode } from '../utils/utils.js';
import InfoToolTip from './InfoToolTip.js';

function App() {
  const DELAY_REDIRECT = 3000;

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
  const [isRegistered, setRegistered] = React.useState(false);

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

  function handleSignup(username, password) {
      auth.register(username, password)
      .then((res) => {
      try {
        if (res instanceof Error) {
          if (res.message === String(httpStatusCode.BAD_REQUEST)) {
            setRegistered(false);
            setInfoToolTip(true);
            throw new Error('One of the fields was filled in incorrectly');
          }
        }
        else {
          setRegistered(true);
          setInfoToolTip(true);
          // console.log('success registration - ', res);
          return res;
        }
      }
      catch(e) {
        setRegistered(false);
        setInfoToolTip(true);
        console.log(e.message);
        return e;
      }
    })
      .then((res) => {
        if (!(res instanceof Error)) {
          setRegistered(true);
          setInfoToolTip(true);
          setTimeout(() => history.push('/signin'), DELAY_REDIRECT);
        }
      })
      .catch((err) => err)
      .finally(() => setInfoToolTip(false));
  }

  function handleLogin(username, password) {
    auth.authorize(username, password)
    .then((data) => {
      try {
        if (data instanceof Error) {
          if (data.message === String(httpStatusCode.BAD_REQUEST))
            throw new Error('One or more of the fields were not provided.');
          if (data.message === String(httpStatusCode.UNAUTHORIZED))
            throw new Error('The user with the specified email not found.');
        }
        else if (data.token) {
          console.log('data.token', data.token);
          setLoggedIn(true);
          return;
        }
      }
      catch(e) {
        console.log('catch in app: ', e);
        return e;
      }
    })
    .then(() => history.push('/'))
    .catch((err) => console.log(err));
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
    auth.getContent(jwt)
    .then((res) => {
      if (res) {
        let userData = { email: res.data.email, password: res.data.password };
        setUsername(userData.email);
        setLoggedIn(true);
        history.push("/");
      }
      else {
        throw new Error('The provided token is invalid.');
      }
    })
    .catch((err) => console.log(err));
  }
}, []);

      return (
    <div className="page">
     {
       isLoading ? <Loader /> : ''
     }

      <Switch>
        <Route path="/signup">
          <Register handleSignup={handleSignup} onCloseToolTip={closeAllPopups} isInfoToolTip={isInfoToolTip} isRegistered={isRegistered} />
        </Route>

        <Route path="/signin">
          <Login handleLogin={handleLogin} loggedIn={loggedIn} />
        </Route>

        <ProtectedRoute path="/" loggedIn={loggedIn}
          component={Main}
          onEditProfile={handleEditProfileClick}
          onEditAvatar={handleEditAvatarClick}
          onAddPlace={handleAddPlaceClick}

          selectedCard={selectedCard}
          onSelectedCard={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          username={username}
          onSignOut={signOut}
          currentUser={currentUser}

          closeAllPopups={closeAllPopups}

          isEditProfilePopupOpen={isEditProfilePopupOpen}
          isAddPlacePopupOpen={isAddPlacePopupOpen}
          isEditAvatarPopupOpen={isEditAvatarPopupOpen}
          isDeleteConfirmationPopup={isDeleteConfirmationPopup}
          isPopupWithImageOpen={isPopupWithImageOpen}

          handleUpdateUser={handleUpdateUser}
          handleUpdateAvatar={handleUpdateAvatar}
          handleAddPlace={handleAddPlace}
          handleConfirmDelete={handleConfirmDelete}
       />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
