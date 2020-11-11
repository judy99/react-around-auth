import React from 'react';
import { useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Footer from './Footer';
import Main from './Main';
import {Api} from '../utils/api.js';
import Loader from './Loader';
import { Route, Switch, Redirect } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import * as auth from '../utils/auth.js';
import { httpStatusCode } from '../utils/utils.js';
import { BASE_URL } from '../utils/utils.js';

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
  const [cardLikes, setCardLikes] = React.useState([]);

  const [currentUser, setCurrentUser] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [isRegistered, setRegistered] = React.useState(false);
  const [isInfoToolTip, setInfoToolTip] = React.useState(false);
  const [token, setToken] = React.useState(localStorage.getItem('jwt'));
  
  const api = new Api({
    baseUrl: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });



  const history = useHistory();

  function handleCardLike(card) {
    // Check one more time if this card was already liked
    console.log('type currentUserID === ', typeof currentUser._id);
    const isLiked = card.likes.some(i => i === currentUser._id);
    // console.log('card status === ', isLiked);
    // Send a request to the API and getting the updated card data
    if (isLiked) {
      api.removeLike(card._id)
      .then((card) => {
        // Create a new array based on the existing one and putting a new card into it
        // const newCards = cards.map((c) => c._id === card._id ? newCard : c);
        setCardLikes(card.likes);
      })
      .catch(err => console.log(err));

    } else {
      api.addLike(card._id)
      .then((card) => {
        // Create a new array based on the existing one and putting a new card into it
        // const newCard = card.likes.map((c) => c._id === card._id ? newCard : c);
        setCardLikes(card.likes);
      })
      .catch(err => console.log(err));

    }
    // api.changeLikeCardStatus(card._id, isLiked)
    // .then((card) => {
    //   // Create a new array based on the existing one and putting a new card into it
    //   // const newCards = cards.map((c) => c._id === card._id ? newCard : c);
    //   setCard(card);
    // })
    // .catch(err => console.log(err));
}

  function handleCardDelete(card) {
    setDeleteConfirmationPopup(!isDeleteConfirmationPopup);
    setDeleteCard(card);
  }

  function handleConfirmDelete() {
    setIsLoading(true);
    closeAllPopups();
    if (isDeleteConfirmationPopup) {
      api.removeCard(deleteCard._id)
      .then((card) => {
        console.log('return removed card:', card);
      // Create a new array based on the existing one and removing a card from it
        const newCards = cards.filter((c) => c._id !== deleteCard._id);
        console.log('newCards', newCards);
      // Update the state
        setCards(newCards);
      })
      .catch((err) => console.log(err))
      .finally(() => {
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
      setCurrentUser({...currentUser, name: res.data.name, about: res.data.about});
    }).catch((err) => console.log(err)).finally(() => {
      setIsLoading(false);
    });
  }

  function handleUpdateAvatar(avatar) {
    closeAllPopups();
    setIsLoading(true);
    api.setUserAvatar(avatar)
    .then((res) => {
      console.log('return update avatar', res.data.avatar);
      setCurrentUser({...currentUser, avatar: res.data.avatar});
      console.log('currentUser ===== ', currentUser);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      setIsLoading(false);
    });
  }

  function handleAddPlace(newCard) {
    closeAllPopups();
    setIsLoading(true);
    api.addCard(newCard)
    .then((res) => {
      setCards([res, ...cards]);
      console.log('cards', cards);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      setIsLoading(false);
    });
  }

  function handleSignup(username, password) {
      auth.register(username, password)
      .then((res) => {
        if (res instanceof Error) {
          if (res.message === String(httpStatusCode.BAD_REQUEST)) {
            setRegistered(false);
            throw new Error('One of the fields was filled in incorrectly');
          }
        }
        else {
          setRegistered(true);
          return res;
        }
    })
      .then((res) => {
        if (!(res instanceof Error)) {
          setTimeout(() => {
            closeAllPopups();
            history.push('/signin');
          }, DELAY_REDIRECT);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setInfoToolTip(true);
      });
  }

  function handleLogin(username, password) {
    auth.authorize(username, password)
    .then((data) => {
      console.log('data after login: ', data);

        if (data instanceof Error) {
          // setToken(null);
          setLoggedIn(false);
          if (data.message === String(httpStatusCode.BAD_REQUEST))
            throw new Error('One or more of the fields were not provided.');
          if (data.message === String(httpStatusCode.UNAUTHORIZED))
            throw new Error('The user with the specified email not found.');
        }
        else if (data.token) {

          localStorage.setItem('jwt', data.token);
          setToken(data.token);

          console.log('******************* Login **************************');
          console.log('First JWT: ', localStorage.getItem('jwt'));
          console.log('First JWT in token state: ', token); //null

          setUsername(username);
          console.log('First User name: ', username);

          setLoggedIn(true);
          // console.log('First loggedIn after getting token: ', loggedIn);

          console.log('******************* End of Login **************************');
          history.push("/");
          return;
        }
    })
    .catch((err) => console.log(err));
  }

  function signOut() {
    localStorage.removeItem('jwt');
    console.log('after signOut jwt = ', localStorage.getItem('jwt'));
    setLoggedIn(false);
    setUsername('');
    // setToken(null);
    setCurrentUser({});
    setCards([]);
    history.push('/signin');
  }

//refresh
React.useEffect(() => {
  console.log('check token useEffect');

  // return ( () => {
  console.log('render App');
  const jwt = localStorage.getItem('jwt');
  if (jwt) {
        auth.getContent(jwt)
        .then((res) => {
          console.log('res after check token ', res);
          // id, about, avatar, name
          if (res instanceof Error) {
            if (res.message === String(httpStatusCode.UNAUTHORIZED))
              throw new Error('The provided token is invalid.');
          }
          setLoggedIn(true);
          setUsername(res.email);
          console.log('Token is valid');
          setToken(jwt);
          // setCurrentUser({ about: res.about, name: res.name, avatar: res.avatar });
          // console.log('curUser', currentUser);

          // api.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;

          })
        .then(() => history.push("/"))
        .catch((err) => console.log(err))
  }
  else {
    console.log('****when jwt = null****');
    history.push('/signin');
  }
// });
}, []);

React.useEffect(() => {
  console.log('getContent useEffect, token = ', token);
  console.log('getContent useEffect, loggedIn = ', loggedIn);
  console.log('getContent useEffect, username = ', username);
  if (loggedIn && token)
    {
      console.log('token for getAppInfo', token);
      console.log('local storage token for getAppInfo', localStorage.getItem('jwt'));

      // api.headers.Authorization = 'Bearer ' + token;


      api.getAppInfo()
      .then((data) => {
        console.log('data', data);
        console.log('res1 CurrentUser load after login:', data[1]);
        console.log('res0 Cards load after login:', data[0]);

        console.log('CurrentUser state after login:', currentUser);
        console.log('Cards state after login:', cards);

        setCurrentUser(data[1]);
        setCards(data[0]);

        console.log('CurrentUser NEW:', currentUser);
        console.log('Cards state NEW:', cards);
        console.log('loggedIn inside getAppInfo: ', loggedIn);

        setIsLoading(false);
      })
      .catch((err) => console.log('apiGetInfo: ', err.message))
  }   else {
      console.log('****when jwt  ****', token);
      console.log('****when username ****', username);
      console.log('****when loggedIn ****', loggedIn);

      // history.push('/signin');
    }
}, [token, loggedIn]);
// }, [loggedIn, token, username]);




// React.useEffect(() => {
//
//   const jwt = localStorage.getItem('jwt');
//   if (jwt) {
//         auth.getContent(jwt)
//         .then((res) => {
//           console.log('res after check token ', res);
//           // id, about, avatar, name
//           if (res instanceof Error) {
//             if (res.message === String(httpStatusCode.UNAUTHORIZED))
//               throw new Error('The provided token is invalid.');
//           }
//           setLoggedIn(true);
//           setUsername(res.email);
//           console.log('Token is valid');
//           // setToken(jwt);
//           // setCurrentUser(res);
//           })
//         .then(() => history.push("/"))
//         .catch((err) => console.log(err))
//       }
//     }, [username]);

// React.useEffect(() => {
//   if (token) {
//     console.log('token is not NULL');
//
//   // return (() => {
//     console.log('getAppInfo useEffect TOKEN', localStorage.getItem('jwt'));
//     api.getAppInfo()
//     .then((data) => {
//       console.log('res1 CurrentUser load after login:', data[1]);
//       console.log('res0 Cards load after login:', data[0]);
//       setCurrentUser(data[1]);
//       setCards(data[0]);
//       setIsLoading(false);
//     })
//     .catch((err) => console.log('apiGetInfo: ', err.message))
//   // });
//     }
//     else {
//       console.log('****when jwt = null****');
//       history.push('/signin');
//     }
// }, [username, token]);

// React.useEffect(() => {
//     console.log('getAppInfo useEffect');
//     api.getAppInfo()
//     .then((data) => {
//       console.log('res1 CurrentUser load after login:', data[1]);
//       console.log('res0 Cards load after login:', data[0]);
//       setCurrentUser(data[1]);
//       setCards(data[0]);
//       setIsLoading(false);
//     })
//     .catch((err) => console.log('apiGetInfo: ', err.message))
// }, [username]);

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
          <Login setUsername={setUsername} handleLogin={handleLogin} setToken={setToken} setLoggedIn={setLoggedIn} setCards={setCards} setCurrentUser={setCurrentUser} />
        </Route>

        <ProtectedRoute path="/"
          component={Main}
          loggedIn={loggedIn}
          onEditProfile={handleEditProfileClick}
          onEditAvatar={handleEditAvatarClick}
          onAddPlace={handleAddPlaceClick}

          selectedCard={selectedCard}
          onSelectedCard={handleCardClick}
          cardLikes={cardLikes}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          username={username}
          onSignOut={signOut}
          currentUser={currentUser}
          cardLikes={cardLikes}

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
       <Route exact path="/">
            { loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
      </Route>

      </Switch>
      <Footer />
    </div>
  );
}

export default App;
