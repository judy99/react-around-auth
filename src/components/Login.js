import React from 'react';
import { Link } from 'react-router-dom';
import Form from './Form.js';


function Login (props) {

  const [email, setEmail] = React.useState({});
  const [password, setPassword] = React.useState({});

  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnChangePassword = (e) => {
      setPassword(e.target.value);
  };

  function handleLogin(e) {
      e.preventDefault();
      if (!email || !password) {
        return;
      }
      // we need to authorize our user here
      // then we'll need to check the token
      // finally, we'll redirect the user to the '/main' page
    }

  return (
    <>
    <div className='main'>
    <div className='main__container'>
    <Form title='Log in' name='login' id='login' onSubmit={handleLogin} value='Log in' isOpen='true'>
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
