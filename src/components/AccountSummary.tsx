import React from "react";
import "../styles/_accountsummary.scss";
import Cards from "./Cards";

function AccountSummary() {
  return (
    <div className="account-summary-container">
      <Cards
        title="Account Balance"
        amount={`2,200,000.00`}
        backgroundColor="#ffe6e6"
        color="#ff0000"
      />
      <Cards
        title="Total Income - Month"
        amount={`1.700,000.00`}
        backgroundColor="#e6ffe6"
        color="#00ff00"
      />
      <Cards
        title="Total Expenses - Month"
        amount={`200,000.00`}
        backgroundColor="#e6e6ff"
        color="#0000ff"
      />
      <Cards
        title="Net Worth"
        amount={`5,200,000.00`}
        backgroundColor="#ffe6ff"
        color="#ff00ff"
      />
    </div>
  );
}

export default AccountSummary;
