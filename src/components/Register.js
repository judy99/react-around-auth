import React, { Button, useState, useEffect } from 'react';
import { Link, useHistory, withRouter } from 'react-router-dom';
import Form from './Form.js';
import Header from './Header.js';
import InfoToolTip from './InfoToolTip.js';
import * as auth from '../utils/auth.js';

function Register (props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistered, setRegistered] = useState(false);

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
      props.onSignup();

      if (!email || !password) {
        setRegistered(false);
        setMessage('Something goes wrong...')
        console.log(message);
        return;
      }
      else {
        setRegistered(true);
        auth.register(email, password)
        .then((res) => {
          if (!res || res.statusCode === 400) {
            throw new Error('Error 400 !!!');
          }
          console.log('after auth', res);
          return res;
        })
        .then(resetForm)
        .then(() => history.push('/signin'))
        .catch((err) => setMessage(err.message));
      }

      // props.onSignup();
      // we need to register our user here
      // show message about succsess registration
      // finally, we'll redirect the user to the '/main' page
    };

    useEffect( () => {
      if (localStorage.getItem('jwt')) {
        history.push('/');
      }
    }, []);

  return (
    <>
    <Header isSignup='true' loggedIn={props.loggedIn} />
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
      : <InfoToolTip isRegistered={isRegistered} isOpen={props.isInfoToolTip} title='Oops, something went wrong! Please try again.' name='tool-tip' onClose={props.onCloseToolTip} />}
    </>

  );
}

export default Register;
