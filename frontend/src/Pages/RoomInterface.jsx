import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socket from "../components/Socket.jsx";
import { resetRoomname, undoAdmin, setGroupType } from '../features/tabs/tabSlice.js';
import "./RoomInterface.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faSlash } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import NoteMsg from '../components/NoteMsg.jsx';

const RoomInterface = () => {
    const { roomname, username, isAdmin, collaboration,groupType } = useSelector((state) => state.tabs);
    const [leaveMsg, setLeaveMsg] = useState("");
    const [joinMsg, setJoinMsg] = useState("");
    const [users, setUsers] = useState([]);
    const [data, setData] = useState("");
    const [recievedData, setRecievedData] = useState("");
    const [showUsers, setShowUsers] = useState(false);
    const [roomType, setRoomType] = useState("");
    const [showNote, setShowNote] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function ToggleUsers() {
        setShowUsers(!showUsers);
    }

    useEffect(() => {
            socket.emit("send-msg", roomname, data);
    }, [data]);

    useEffect(() => {
        socket.on("recievedData", setRecievedData);
        socket.on("leave-msg", (msg) => handleMsg(setLeaveMsg, msg));
        socket.on("join-msg", (msg) => handleMsg(setJoinMsg, msg));
        socket.on("users", setUsers);

        return () => socket.off();
    }, []);

    useEffect(() => {
        socket.emit("userslist", roomname);
    }, [leaveMsg]);

    const handleMsg = (setter, msg) => {
        setter(msg);

        toast.success(msg, {
            position: "top-center",
            autoClose: 2000,
            pauseOnHover: false,
        });

        setTimeout(() => setter(""), 2000);
    };

    
    // refresh

    useEffect(() => {

        const unloadCallback = (event) => {

            event.preventDefault();
            event.returnValue = ""; 
        }

        const handlePopState = () => {
            const confirmLeave = window.confirm("Are you sure you want to leave?");
            if (!confirmLeave) {
                window.history.pushState(null, '', window.location.href);
            } else {

               handleLeave();
            }
        };

        const handlePageLoad = () => {
            handleLeave();
        };
      
        window.addEventListener('load', handlePageLoad);
        window.addEventListener('popstate', handlePopState);
        window.addEventListener("beforeunload", unloadCallback);

        return () => {
            window.removeEventListener("beforeunload", unloadCallback);
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('load', handlePageLoad);
        };
    }, [navigate]);

    async function deleteRoom() {
        let res = await axios.delete(`https://protecttext.onrender.com/deleteRoom/${roomname}`);
    }

    function handleLeave(){
        if (isAdmin){
            dispatch(undoAdmin());
        }
        
        if(users.length <= 1){
            deleteRoom();
        }
        socket.emit("leave-room", roomname, username);
        dispatch(resetRoomname());
        dispatch(setGroupType("Public"));
        navigate("/room");
    }

    //fetching roomtype
    useEffect(()=>{
        let fetchRoomType = async ()=>{
            let res = await axios.get(`https://protecttext.onrender.com/getRoomData/${roomname}`);
            if(res.status === 200 || res.statusText === "OK"){
                setRoomType(res.data.roomType);
            }
        }

        setTimeout(() => {
            setShowNote(true);
        }, 1000);
        fetchRoomType();
    },[])

    //change room type
    async function changeRoomType() {
        let res = await axios.put(`https://protecttext.onrender.com/updateRoomType/${roomname}`);
        if(res.status === 200 || res.statusText === "OK"){
            setRoomType(res.data.roomType);
        }
    }
    return (
        <div className='outer-layer'>
            <ToastContainer />
            <div className='roomDetails'>
                <span style={{ textAlign: "end" }}>Roomname : {roomname}</span>
                {
                    isAdmin ? 
                        <span style={{ textAlign: "end" }}>RoomType  : {roomType} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button className='btn btn-primary changeType' onClick={changeRoomType}>Change to {roomType === "Public" ? "Private" : "Public"}</button>
                        </span>
                    : null
                }
                

            </div>

            <div className='inner-container'>

                <div className="text-container">
                    <textarea onChange={(e) => setData(e.target.value)}  className='text' value={recievedData}
                        />
                </div>

                <FontAwesomeIcon icon={!showUsers ? faList : faXmark} className='Toggleusers' onClick={ToggleUsers} title='View Users' />

                <div className={`users-list ${!showUsers ? null : 'showUsers'}`}>
                    <h1>All Users</h1><hr />
                    <div className="users-container">
                        {users.map((user, idx) => <p key={uuidv4()} className='username'>{`${user}`}</p>)}
                    </div>
                </div>
            </div>

            <div className='btn-container'>
                <button onClick={handleLeave} className='btn btn-danger'>Leave</button>
            </div>

            {isAdmin && showNote ? <NoteMsg setShowNote={setShowNote}/> : null}
        </div>
    );
};

export default RoomInterface;
