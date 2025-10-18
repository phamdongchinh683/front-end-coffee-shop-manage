import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import InfoInput from "../../components/InfoInput";
import { LoginWithUsername } from "../../services/authService";

import "./LoginPage.css";
function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    let loginService = LoginWithUsername({ username, password });

    e.preventDefault();
    loginService.then((response) => {
      if (response.status == 200) {
        localStorage.setItem('token', response.data.data);
      }
      alert(response.data.message)
    }).catch((error) => {
      console.error(error);
    });
  };

  const infoInputUserNameProps = {
    type: 'text',
    label: 'Username',
    placeholder: 'Enter your username',
    value: username,
    onChange: (e) => setUsername(e.target.value),
    name: 'username'
  }

  const infoInputPassword = {
    type: 'password',
    label: "Password",
    placeholder: 'Enter your password',
    value: password,
    onChange: (e) => setPassword(e.target.value),
    name: 'password'
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>☕ Coffee Shop</h1>
          <p>Welcome back! Please sign in to your account.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <InfoInput {...infoInputUserNameProps} />
          <InfoInput {...infoInputPassword} />
          <Button
            type="submit"
            variant="primary"
            size="large"
            className="login-button"
          >
            Sign In
          </Button>
        </form>
        <div className="register-footer">
          <p>Already have an account? </p>
          <Link to={'/register'}>Sign Up here</Link>
        </div>
      </div>
    </div >
  );
}

export default LoginPage;
