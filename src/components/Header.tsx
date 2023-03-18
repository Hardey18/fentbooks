import React from 'react'
import "../styles/_header.scss"
import logo from "/logo.png"

function Header() {
  return (
    <div className="header-container">
      <img className="logo" src={logo} alt="Logo" />
      <div className="">Header</div>
    </div>
  )
}

export default Header