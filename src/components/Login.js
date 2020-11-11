import React, { useEffect } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import Form from './Form.js';
import Header from './Header.js';
import * as auth from '../utils/auth.js';
import { httpStatusCode } from '../utils/utils.js';
import {api} from '../utils/api.js';


function Login (props) {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const history = useHistory();
  // const jwt = localStorage.getItem('jwt');

  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const resetForm = (e) => {
    e.currentTarget.reset();
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      props.handleLogin(email, password);
      resetForm(e);
    };

  // const handleSubmit = (e) => {
  //     e.preventDefault();
  //     console.log('JWT in local storage BEFORE Login', localStorage.getItem('jwt'));
  //
  //     auth.authorize(email, password)
  //     .then((data) => {
  //       console.log('data after login: ', data);
  //         if (data instanceof Error) {
  //           if (data.message === String(httpStatusCode.BAD_REQUEST))
  //             throw new Error('One or more of the fields were not provided.');
  //           if (data.message === String(httpStatusCode.UNAUTHORIZED))
  //             throw new Error('The user with the specified email not found.');
  //         }
  //         else if (data.token) {
  //           localStorage.setItem('jwt', data.token);
  //           props.setToken(data.token);
  //           console.log('JWT in local storage after LOgin', localStorage.getItem('jwt'));
  //           // props.setUsername(email);
  //           // props.setLoggedIn(true);
  //           // console.log('loggedIn after getting token: ', props.loggedIn);
  //           return;
  //         }
  //     })
  //     .then(() => {
  //       console.log('JWT in local storage after LOgin', localStorage.getItem('jwt'));
  //       props.setUsername(email);
  //       props.setLoggedIn(true);
  //       console.log('loggedIn after getting token: ', props.loggedIn);
  //       history.push("/");
  //     })
  //     .catch((err) => console.log(err));
  //     resetForm(e);
  //   };

  return (
    <>
    <Header>
      <li><NavLink to="/signup" className="menu__link">Sign Up</NavLink></li>
    </Header>
    <div className='main'>
    <div className='main__container'>
    <Form title='Log in' name='login' id='login' onSubmit={handleSubmit} value='Log in' isOpen='true'>
      <input type='email' name='email' id='email-input' className='form__input login__email' placeholder='Email' onChange={handleOnChangeEmail} required />
      <span id='email-input-error' className='form__input-error'></span>
      <input type='password' name='password' id='password-input' className='form__input login__password' placeholder='Password' onChange={handleOnChangePassword} required />
      <span id='password-input-error' className='form__input-error'></span>
    </Form>
    <Link className='login__link' to="/signup">Not a member yet? Sign up here!</Link>
    </div>
    </div>
    </>
  );
}

export default Login;
