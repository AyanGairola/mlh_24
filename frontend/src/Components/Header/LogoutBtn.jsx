import React from 'react'
import { useDispatch } from 'react-redux'
import {logout} from "../../store/authSlice"
function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = async() => {
      const data=await fetch("http://localhost:8000/users/logout",{
        method:"POST",
        body:JSON.stringify({
          refreshToken:localStorage.getItem("refreshToken"),
          accessToken: localStorage.getItem("accessToken")
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      }
    })
    dispatch(logout())

    localStorage.removeItem('refreshToken');

    // Store the access token in local storage
    localStorage.removeItem('accessToken');
    }
  return (
    <button
    className="py-2 px-5 text-black button-custom rounded-xl shadow-lg duration-200 hover:drop-shadow-2xl hover:shadow-[#666666] hover:cursor-pointer"
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn