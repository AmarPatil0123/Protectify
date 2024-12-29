import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./UserForm.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import {setUsername,handleFormOnchnage, handleFetchedTabs, makeFormEmpty, setIsLoggedInFalse, setIsLoggedInTrue } from '../features/tabs/tabSlice';
import Loading from "../components/Loading";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://protecttext.onrender.com";


const UserForm = ({ action, heading }) => {

    const [showLoading, setShowLoading] = useState(false);

    const dispatch = useDispatch();
    let { userDetails} = useSelector((state)=>state.tabs);
    const navigate = useNavigate();
    let errorMsg =  "";


    function handleOnchange(e) {
    const { name, value } = e.target;
    dispatch(handleFormOnchnage({ name, value })); 
}

    async function handleSubmit(e) {
        try {
            e.preventDefault();

            setShowLoading(true);
            let response = await axios.post(`/${action}`, userDetails)
            setShowLoading(false);

            dispatch(makeFormEmpty());

            toast.success("Welcome to Protectify !", {
                position: "top-center",
                autoClose: 2000,
                pauseOnHover: false,
              });
            
            dispatch(setUsername(response.data.username));
            dispatch(handleFetchedTabs(response.data.tabs))
            dispatch(setIsLoggedInTrue());
            navigate("/home");

        } catch (error) {
            if(error.response.data === "Unauthorized"){
                errorMsg = "Invalid username or Password";

            }
            else if(error.response.data.message === "UserExistsError"){
                errorMsg = "Username already exists";
            }
            else if(error.response.data.message === "A user with the given username is already registered"){
                errorMsg = "Username already exists";
            }else{
                errorMsg = "Something went wrong, please try again later";
            }

            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
                pauseOnHover: false,
              });
              navigate("/");
              dispatch(setIsLoggedInFalse());
              dispatch(makeFormEmpty());
        }
    }


    return (
        <>
            <ToastContainer />
            <form className="user-form" onSubmit={handleSubmit} >
                <h2>{heading}</h2><br />
                <input type="text" placeholder='Enter Username' name='username' onChange={handleOnchange} value={userDetails.username} required />
                <input type="password" placeholder='Enter Password' name='password' onChange={handleOnchange} value={userDetails.password} required/>
                <button type='submit' className={`submit ${showLoading ? "disableSubmit" : ''}`}>Submit</button>
            </form>

            {showLoading ? <Loading /> : null}
        </>
    )
}

export default UserForm;