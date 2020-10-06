import React from 'react';
import { Link } from 'react-router-dom';
import Form from './Form.js';

function Register (props) {
  const [email, setEmail] = React.useState({});
  const [password, setPassword] = React.useState({});

  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnChangePassword = (e) => {
      setPassword(e.target.value);
  };

  function handleSubmit(e) {
      e.preventDefault();
      if (!email || !password) {
        return;
      }
      // we need to register our user here
      // show message about succsess registration
      // finally, we'll redirect the user to the '/main' page

    }
  return (
    <>
    <div className='main'>
    <div className='main__container'>
    <Form title='Sign Up' name='login' id='login' onSubmit={handleSubmit} value='Sign up' isOpen='true'>
      <input type='email' name='email' id='email-input' className='form__input login__email' placeholder='Email' onChange={handleOnChangeEmail} required />
      <span id='email-input-error' className='form__input-error'></span>
      <input type='password' name='password' id='password-input' className='form__input login__password' placeholder='Password' onChange={handleOnChangePassword} required />
      <span id='password-input-error' className='form__input-error'></span>
    </Form>
    <Link className='login__link' to="/signin">Already a member? Log in here</Link>
    </div>
    </div>
    </>
  );
}

export default Register;
