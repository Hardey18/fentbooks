import React from 'react'
import "../styles/_dashboardcards.scss"

function DashboardCard({ title, backgroundColor, icon }: any) {
  return (
    <div className="testing" style={{ backgroundColor }}>
        <div className="icon-container">
            {icon}
        </div>
        <h2>{title}</h2>
    </div>
  )
}

export default DashboardCard