import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRoomname, makeAdmin, resetRoomname, setGroupType } from "../features/tabs/tabSlice";
import { useNavigate } from "react-router-dom";
import socket from "../components/Socket.jsx";
import "./Room.css";
import RoomDialog from "../components/RoomDialog.jsx";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

const Room = () => {

  const dispatch = useDispatch();
  let { roomname, username, groupType } = useSelector((state) => state.tabs);
  const navigate = useNavigate();

  const [createValue, setCreateValue] = useState("");
  const [joinValue, setJoinValue] = useState("");
  const [openDialogBox, setOpenDialogBox] = useState(false);


  const handleCreateRoom = useCallback(()=>{
    socket.emit("create-room", createValue, username, (response) => {

      if (response === "Room already Exists") {

        toast.error("Room already Exists" , {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        });

        navigate("/room");
        setCreateValue("");
        dispatch(resetRoomname());
        dispatch(setGroupType("public"));
        return;
      }
    });

    dispatch(setRoomname(createValue));
    dispatch(makeAdmin());
    navigate("/roomData");
  }, [createValue])



  function OpenDialog() {
    setOpenDialogBox(!openDialogBox);
  }

  
  async function handleJoinRoom() {

    let res = await axios.get(`https://protecttext.onrender.com/getRoomData/${joinValue}`);
    
    if(res && res.data.message === "room is private"){
      console.log(res)
      toast.error("Room is private", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
      
      return;
    }


    socket.emit("join-room", joinValue, username, (response) => {

      if(joinValue === ""){
        alert("Roomname cannot be emty")
        return;
      }

      toast.error(response, {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
     
      if (response === "Room does not exist" || response === "User is already in the room") {
        navigate("/room");
        setJoinValue("");
        dispatch(resetRoomname());
        return;
      }
    });

    dispatch(setRoomname(joinValue));
    navigate("/roomData");

  }

  return (
    <div className="room-container">
      <ToastContainer />
      <h1 className="room-heading">Welcome to Live Writing</h1>

      <div className="form-container">
        <div className="form-section">
          <button onClick={OpenDialog} className="form-button">
            Create Room
          </button>
        </div>

        <div className="form-section">
          <input
            type="text"
            placeholder="Enter Room Name to Join"
            onChange={(e) => setJoinValue(e.target.value)}
            value={joinValue}
            className="form-input"
           
            maxLength="10"
          />
          <button onClick={handleJoinRoom} className="form-button">
            Join Room
          </button>
        </div>
      </div>

      {openDialogBox && <RoomDialog createValue={createValue} setCreateValue={setCreateValue} 
      handleCreateRoom={handleCreateRoom} />}
    </div>
  );
};

export default Room;
