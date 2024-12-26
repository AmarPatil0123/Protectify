import React  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setIsLoggedInFalse, setIsLoggedInTrue, resetRoomname, setLoadTabs, handleIsDataNotSaved} from '../features/tabs/tabSlice';
import { useState } from 'react';
import Logo from '../assets/logo.png';
import ChangePassword from './ChangePassword';
import { persistor } from '../app/store';

const Navbar = () => {

  const [toggleNavbar, setToggleNavbar] = useState(false);
  const {roomname,loadTabs,  fetchError,selectedTab} = useSelector((state)=>state.tabs)
  const [changePass, setChangePass] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  async function handleLogout() {
    try {

      if(roomname){
        alert("Please leave the room before logout");
        return;
      }

      const response = await axios.get("http://localhost:8080/logout");

      dispatch(resetRoomname());
      dispatch(setIsLoggedInFalse());

      persistor.pause();
      persistor.flush().then(() => {
        return persistor.purge();
      });

      navigate("/");
      dispatch(handleIsDataNotSaved());
      dispatch(setLoadTabs());
    } catch (error) {
      
      console.error("Logout failed:", error);
      dispatch(setIsLoggedInTrue());
      dispatch(setLoadTabs());

    }
  }

  //delete Account

  async function handleDeleteAcc(){

    if(roomname){
      alert("Please leave the room before deleting account");
      return;
    }

    let data = confirm("Are you you want to delete account");

    if(data){
      try {
        let ownerId = selectedTab.owner;
        const response = await axios.get(`http://localhost:8080/deleteAccount/${ownerId}`);

        dispatch(setIsLoggedInFalse());
        dispatch(resetRoomname());

        persistor.pause();
        persistor.flush().then(() => {
          return persistor.purge();
        });
        navigate("/");
     
      } catch (error) {
        console.log(error);
      }
        
      
    }
  }

  function closeCP(){
    setChangePass(false);
  }

  //changePassword
  function showCP(e){
    e.stopPropagation();

    if(roomname){
      alert("Please leave the room before password reset");
      return;
    }
    setChangePass(!changePass);
  }

  function handleNavLinks(e) {
    if (e.target.tagName === "A" || e.target.tagName === "BUTTON") {

      setToggleNavbar(false); 
    }
  }
  

  return (
    <div className="nav-container">
      <div className="logo">
        <img src={Logo} alt='logo' />
      </div>
      <ul className={`nav-links ${toggleNavbar ? 'showNavLinks' : null}`} onClick={handleNavLinks}>
        <li><Link to="/home" className='links'>Home</Link></li>
        <li><Link to="/room" className='links'>Room</Link></li>
        <li onClick={showCP}>
          <button className='links changePass-button logout-button' >
            Change Password
          </button>
        </li>
        <li>
          <button className='links logout-button' onClick={handleLogout}>
            Logout
          </button>

        </li>
        <li>
          <button className='links delete-button logout-button' onClick={handleDeleteAcc}>
            Delete
          </button>
        </li>
      </ul>
      <div className='hamburgerr' onClick={()=>setToggleNavbar(!toggleNavbar)}>
        <FontAwesomeIcon icon={toggleNavbar ? faXmark : faBars} />
      </div>

      {changePass && <ChangePassword changePass={changePass} setChangePass={setChangePass} closeCP={closeCP}/>}
    </div>
  );
};

export default Navbar;
