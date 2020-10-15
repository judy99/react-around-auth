import React, { useState, useEffect } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import Form from './Form.js';
import Header from './Header.js';
import InfoToolTip from './InfoToolTip.js';
import * as auth from '../utils/auth.js';
import { httpStatusCode } from '../utils/utils.js';


function Register (props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistered, setRegistered] = useState(false);
  const DELAY_REDIRECT = 3000;

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
      props.handleSignup(email, password);

      // if (!email || !password) {
      //   setRegistered(false);
      //   setMessage('Something goes wrong...');
      //   props.onSignup();
      //   return;
      // }
      // else {
      //   auth.register(email, password)
      //   .then((res) => {
      //     if (!res || res.statusCode === httpStatusCode.BAD_REQUEST) {
      //       setRegistered(false);
      //       props.onSignup();
      //       throw new Error('One of the fields was filled in incorrectly');
      //     }
      //     setRegistered(true);
      //     return res;
      //   })
      //   .then(props.onSignup)
      //   .then(resetForm)
      //   .then(() => {
      //     setTimeout(() => history.push('/signin'), DELAY_REDIRECT)
      //   })
      //   .catch((err) => setMessage(err.message));
      // }
    };

    useEffect( () => {
      if (localStorage.getItem('jwt')) {
        history.push('/');
      }
    }, []);

  return (
    <>
    <Header>
      <li><NavLink to="/signin" className="menu__link">Log In</NavLink></li>
    </Header>
    <div className='main'>
    <div className='main__container'>
    <Form title='Sign Up' name='login' id='login' onSubmit={handleSubmit} value='Sign up'>
      <input type='email' name='email' id='email-input' className='form__input login__email' placeholder='Email' onChange={handleOnChangeEmail} required />
      <span id='email-input-error' className='form__input-error'></span>
      <input type='password' name='password' id='password-input' className='form__input login__password' placeholder='Password' onChange={handleOnChangePassword} required />
      <span id='password-input-error' className='form__input-error'></span>
    </Form>
    <Link className='login__link' to="/signin">Already a member? Log in here</Link>
    </div>
    </div>
    { isRegistered ?
      <InfoToolTip name='tool-tip' isRegistered={isRegistered} isOpen={props.isInfoToolTip} title='Success! You have now been registered.' onClose={props.onCloseToolTip} />
      : <InfoToolTip isOpen={props.isInfoToolTip} isRegistered={isRegistered} title='Oops, something went wrong! Please try again.' name='tool-tip' onClose={props.onCloseToolTip} />}
    </>

  );
}

export default Register;
