import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {
    const user = useSelector((state)=> state.tabs.isLoggedIn)

    return user ? <Outlet /> : <Navigate to="/" replace/>
}

export default ProtectedRoutes