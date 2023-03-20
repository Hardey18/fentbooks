import React from 'react'
import "../styles/_dashboardcards.scss"
import { MdAccountBalanceWallet } from "react-icons/md"

function DashboardCard({ title, color, backgroundColor, icon }: any) {
  return (
    <div className="testing" style={{ backgroundColor }}>
        <div className="icon-container">
            {icon}
            {/* <MdAccountBalanceWallet size={40} color={color} /> */}
        </div>
        <h2>{title}</h2>
    </div>
  )
}

export default DashboardCard