import { Fragment } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import PrivateRoute from "./auth";
import Categories from "./pages/Categories";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Invoice from "./pages/Invoice";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Customers from "./pages/Customers";
import SignUp from "./pages/SignUp";
import Transactions from "./pages/Transactions";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3CenterLeftIcon,
  BellIcon,
  ClockIcon,
  CogIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import "./styles/_main.scss";
import Profile from "./pages/Profile";
import InvoiceDetails from "./pages/InvoiceDetails";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

function App() {
  return (
    <div className="main-container">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/invoice/:invoiceId" element={<InvoiceDetails />} />
        <Route path="/products" element={<Product />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
