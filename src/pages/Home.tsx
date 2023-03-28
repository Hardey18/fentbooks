import React from 'react'
import AccountSummary from '../components/AccountSummary'
import Dashboard from '../components/Dashboard'
import Header from '../components/Header'

function Home() {
  return (
    <div>
        <Header />
        <AccountSummary />
        <Dashboard />
    </div>
  )
}

export default Home