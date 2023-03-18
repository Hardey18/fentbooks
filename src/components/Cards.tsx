import React from 'react'
import "../styles/_cards.scss"
import { MdAccountBalanceWallet } from "react-icons/md"
function Cards({ title, amount, color, backgroundColor }: any) {
  return (
    <div className="each-summary">
        <div className="icon-container" style={{ backgroundColor }}>
            <MdAccountBalanceWallet color={color} />
        </div>
        <h2>{title}</h2>
        <h4>&#8358;{amount}</h4>
    </div>
  )
}

export default Cards