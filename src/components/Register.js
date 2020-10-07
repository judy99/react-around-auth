import React from 'react';
import { Link } from 'react-router-dom';
import Form from './Form.js';
import Header from './Header.js';
import InfoToolTip from './InfoToolTip.js';

function Register (props) {
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [isRegistered, setRegistered] = React.useState(false);

  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnChangePassword = (e) => {
    setPassword(e.target.value);
  };

  function handleSubmit(e) {
      e.preventDefault();
      props.onSignup();
      if (!email || !password) {
        setRegistered(false);
      }
      else {
        setRegistered(true);
      }

      // props.onSignup();
      // we need to register our user here
      // show message about succsess registration
      // finally, we'll redirect the user to the '/main' page
    }

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
