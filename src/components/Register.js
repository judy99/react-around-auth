import React from 'react';
import { Link } from 'react-router-dom';
import Form from './Form.js';


function Register (props) {
  const handleOnChangeEmail = () => {};
  const handleOnChangePassword = () => {};

  return (
    <>
    <div className='main'>
    <div className='main__container'>
    <Form title='Sign Up' name='login' id='login' onSubmit='handleSignup' value='Sign up' isOpen='true'>
      <input type='email' name='email' id='email-input' className='form__input login__email' placeholder='Email' onChange={handleOnChangeEmail} required />
      <span id='email-input-error' className='form__input-error'></span>
      <input type='password' name='password' id='password-input' className='form__input login__password' placeholder='Password' onChange={handleOnChangePassword} required />
      <span id='password-input-error' className='form__input-error'></span>
    </Form>
    <Link className='login__link' to="/login">Already a member? Log in here</Link>
    </div>
    </div>
    </>
  );
}

export default Register;
