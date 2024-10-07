import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppContextProvider } from "./providers/app-context";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Dashboard from './pages/dashboard';
import LandingPage from "./pages/landingPage"; 
import AccountPage from "./pages/accountPage";  
import Settings from "./pages/settings";

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<AccountPage />} /> 
          <Route path="/settings" element={<Settings />} /> 
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
