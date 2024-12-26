import React, { useState } from 'react'
import "./Signin.css";
import UserForm from './UserForm';
import { useDispatch, useSelector } from 'react-redux';
import { makeFormEmpty } from '../features/tabs/tabSlice';
import bgImage from "../assets/bgImage.jpg";

const Signin = () => {

  const [selectedBtn, setSelectedBtn] = useState(false);

  const dispatch = useDispatch();

  function handleSignup(){
    setSelectedBtn(false)
    dispatch(makeFormEmpty())
  }

  function handleLogin(){
    setSelectedBtn(true);
    dispatch(makeFormEmpty());
  }
  return (
    <div className='container' style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="user">
        <div className="buttons">
          <button style={{backgroundColor : selectedBtn ? "#C3C1C1" : "blue"}} onClick={handleSignup}>Signup</button>
          <button style={{backgroundColor : selectedBtn ? "blue" : "#C3C1C1"}} onClick={handleLogin}>Login</button>
        </div>
        {
          selectedBtn ? 
          <UserForm  action="login" heading="Login Form"/>
          :
          <UserForm action="signup" heading="SignUp Form"/>
        }
      </div>
    </div>
  )
}

export default Signin