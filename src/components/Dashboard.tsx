import React from "react";
import { IoMdPricetags } from "react-icons/io"
import { CgProfile } from "react-icons/cg"
import { GrTransaction } from "react-icons/gr"
import { TbFileInvoice } from "react-icons/tb"
import "../styles/_dashboard.scss";
import DashboardCard from "./DashboardCard";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <DashboardCard
        title="My Products"
        backgroundColor="#ffe6e6"
        icon={<IoMdPricetags size={40} color="#ff0000" />}
      />
      <DashboardCard
        title="Customers"
        backgroundColor="#e6ffe6"
        icon={<CgProfile size={40} color="#00ff00" />}
      />
      <DashboardCard
        title="Transactions"
        backgroundColor="#e6e6ff"
        icon={<GrTransaction size={40} color="#0000ff" />}
      />
      <DashboardCard
        title="Invoice"
        backgroundColor="#ffe6ff"
        icon={<TbFileInvoice size={40} color="#ff00ff" />}
      />
    </div>
  );
}

export default Dashboard;
