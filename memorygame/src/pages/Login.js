import React, { useState, useEffect } from 'react';
import './Login.scss';

const Login = () => {
  return (
    <div className="login-page">
      {/* LOGIN FORM */}
      <form className="login-form">
        {/* USERNAME */}
        <label className="login-form__username-label" htmlFor="username">
          Username:
          <input type="text" className="login-form__username-input" id="username" name="username" />
        </label>
        {/* PASSWORD */}
        <label className="login-form__password-label" htmlFor="password">
          Password:
          <input
            className="login-form__password-input"
            type="password"
            id="password"
            name="password"
          />
        </label>
      </form>
    </div>
  );
};

export default Login;
