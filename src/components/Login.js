import React, { useState, useEffect } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import Form from './Form.js';
import Header from './Header.js';
import * as auth from '../utils/auth.js';

function Login (props) {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = useState('');

  const history = useHistory();

  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setMessage('');
  };


  const handleSubmit = (e) => {
      e.preventDefault();

      if (!email || !password) {
        return;
      }
      else {
        auth.authorize(email, password)
        .then((data) => {
          console.log('after hit Login: ', data);
          if (!data) {
            throw new Error('Authorization error.');
          }
          if (data.token) {
            props.handleLogin();
          }
        })
        .then(resetForm)
        .then(() => history.push('/'))
        .catch((err) => setMessage(err.message));
      }
    };

    useEffect(() => {
      if (localStorage.getItem('jwt')) {
        history.push('/');
      }
    }, []);


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
