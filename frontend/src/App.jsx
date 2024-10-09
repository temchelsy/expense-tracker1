import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "./context/globalContext"; // Ensure correct path

// Auth Pages
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

// Main Pages
import LandingPage from "./pages/landingPage";
import Dashboard from "./pages/dashboard";
import AccountPage from "./pages/accountPage";
import Settings from "./pages/settings";
import Transactions from "./pages/transactions";

// Finance Pages
import Income from "./Income/Income";
import Expense from "./Expenses/Expense";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<AccountPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/transactions" element={<Transactions />} />

          {/* Finance Routes */}
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
