import AccountSummary from "./components/AccountSummary";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import "./styles/_main.scss";

function App() {
  return (
    <div className="main-container">
      <Header />
      <AccountSummary />
      <Dashboard />
    </div>
  )
}

export default App
