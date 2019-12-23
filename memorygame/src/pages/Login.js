import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import InputButton from '../components/InputButton';
import InputText from '../components/InputText';
import './login.scss';

const Login = ({ setUsername }) => {
  const [usernameField, setUsernameField] = useState('');
  const [redirectToGame, setRedirectToGame] = useState(false);

  const onUsernameChange = e => setUsernameField(e.target.value);

  // Redirect to game page
  if (redirectToGame) {
    return <Redirect to="/game" />;
  }

  const onSubmit = () => {
    setUsername(usernameField);
    setRedirectToGame(true);
  };

  return (
    <div className="login-page">
      <form className="login-form">
        <label htmlFor="username-input" style={{ opacity: '0' }}>
          Username
        </label>
        <input
          id="username-input"
          type="text"
          name="username-input"
          value={usernameField}
          placeholder="Username"
          onChange={onUsernameChange}
        />
        {/* <InputText inputFor="Username" value={usernameField} onChange={onUsernameChange} />
        <InputButton inputFor="Login" onClick={onSubmit} /> */}
        <label htmlFor="username-input" style={{ opacity: '0' }}>
          Password
        </label>
        <input
          className="login-button"
          type="button"
          name="login-button"
          value="Login"
          onClick={onSubmit}
        />
      </form>
    </div>
  );
};

export default Login;
