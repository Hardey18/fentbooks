import AccountSummary from "./components/AccountSummary";
import Header from "./components/Header";
import "./styles/_main.scss";

function App() {
  return (
    <div className="main-container">
      <Header />
      <AccountSummary />
    </div>
  )
}

export default App
