import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import Signin from './Pages/Signin';
import Room from './Pages/Room';
import { useSelector } from 'react-redux';
import ProtectedRoutes from './components/ProtectedRoutes';
import RoomInterface from './Pages/RoomInterface';

function App() {

  const user = useSelector((state)=> state.tabs.isLoggedIn)
  const room = useSelector((state)=> state.tabs.roomname);


  return (
    <div>
      <BrowserRouter>
      {user ? <Navbar /> : null}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <Signin />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={!room ? <Home /> : <Navigate to="/roomData" replace/>} />
          <Route path="/room" element={!room? <Room /> : <Navigate to="/roomData" replace/>} />
          
          <Route path="/roomdata" element={!room ? <Navigate to="/room" replace/> : <RoomInterface />} />
        </Route>

        <Route path="*" element={user ? <Home /> : <Signin />} /> 
      </Routes>
      </BrowserRouter>  
    </div>
    
  );
}

export default App;
