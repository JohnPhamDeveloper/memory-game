import React, { useState, useEffect } from 'react';
import InputButton from '../components/InputButton';
import InputText from '../components/InputText';
import './Login.scss';

const Login = () => {
  const [username, setUsername] = useState('');

  const onUsernameChange = e => setUsername(e.target.value);

  return (
    <div className="login-page">
      <form className="login-form">
        <InputText inputFor="Username" value={username} onChange={onUsernameChange} />
        <InputButton inputFor="Login" />
      </form>
    </div>
  );
};

export default Login;
