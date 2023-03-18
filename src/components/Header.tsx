import React from 'react'
import { IoMdSettings, IoIosNotifications } from "react-icons/io"
import "../styles/_header.scss"
import logo from "/logo.png"

function Header() {
  return (
    <div className="header-container">
      <div className="top">
        <img className="logo" src={logo} alt="Logo" />
        <div className="icons">
          <div className='first'>
            <IoMdSettings size={25} />
          </div>
          <div className='second'>
            <IoIosNotifications size={25} />
          </div>
        </div>
      </div>
      <div className="user">
        <h4 className='welcome'>Welcome back,</h4>
        <h2>Francis</h2>
      </div>
    </div>
  )
}

export default Header