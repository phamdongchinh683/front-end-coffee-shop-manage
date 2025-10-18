import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import InfoInput from "../../components/InfoInput";
import { register } from "../../services/authService";
import "./RegisterPage.css";

function RegisterPage() {
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [phoneNumber, setPhoneNumber] = useState("");
 const [fullName, setFullName] = useState("");
 const handleSubmit = (e) => {
  let result = register({ username, password, fullName, phoneNumber });

  e.preventDefault();
  result.then((response) => {
   if (response.status == 200) {
    localStorage.setItem('token', response.data.data);
   }
   alert(response.message)
  }).catch((error) => {
   if (error.response.data.data === null) {
    alert(error.response.data.message)
   }

  });
 };

 const infoInputUserNameProps = {
  type: 'text',
  label: 'Username',
  value: username,
  placeholder: 'Enter your username',
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

 const infoInputFullNameProps = {
  type: 'text',
  label: 'Full Name',
  placeholder: 'Enter your full name',
  value: fullName,
  onChange: (e) => setFullName(e.target.value),
  name: 'fullName'
 }

 const infoInputPhoneProps = {
  type: 'tel',
  label: 'Phone Number',
  placeholder: 'Enter your phone number',
  value: phoneNumber,
  onChange: (e) => setPhoneNumber(e.target.value),
  name: 'phoneNumber'
 }

 return (
  <div className="register-page">
   <div className="register-container">
    <div className="register-header">
     <h1>☕ Coffee Shop</h1>
     <p>Create your account to get started!</p>
    </div>
    <form className="register-form" onSubmit={handleSubmit}>
     <InfoInput {...infoInputUserNameProps} />
     <InfoInput {...infoInputPassword} />
     <InfoInput {...infoInputFullNameProps} />
     <InfoInput {...infoInputPhoneProps} />
     <Button
      type="submit"
      variant="primary"
      size="large"
      className="register-button"
     >
      Create Account
     </Button>
    </form>
    <div className="register-footer">
     <p>Already have an account? </p>
     <Link to={'/'}>Sign in here</Link>
    </div>
   </div>
  </div>
 );
}

export default RegisterPage;
