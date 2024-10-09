import React from "react";
import { RiCurrencyLine } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom"; 
import ThemeSwitch from './themeswitch';
import { useGlobalContext } from "../context/globalContext";

const Navbar = () => {
  const { currentUser, loading, error, setCurrentUser } = useGlobalContext();  
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Clear the user's session
      localStorage.removeItem('token'); // Assuming you store the token in localStorage
      localStorage.removeItem('user'); // Remove user data if stored

      // Update the context
      setCurrentUser(null);

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // You might want to show an error message to the user here
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full flex items-center justify-between py-6">
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-blue-400 rounded-xl">
          <RiCurrencyLine className="text-white text-3xl hover:animate-spin" />
        </div>
        <span className="text-xl font-bold text-black dark:text-white">
          My-Finance
        </span>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <Link to="/dashboard" className="px-6 py-2 rounded-full bg-blue-400 text-white">
          Dashboard
        </Link>
        <Link to="/transactions" className="px-6 py-2 rounded-full text-gray-700 dark:text-gray-500">
          Transactions
        </Link>
        <Link to="/accounts" className="px-6 py-2 rounded-full text-gray-700 dark:text-gray-500">
          Accounts
        </Link>
        <Link to="/settings" className="px-6 py-2 rounded-full text-gray-700 dark:text-gray-500">
          Settings
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitch />

        {currentUser ? (
          <div className="flex items-center gap-2">
            <p className="text-lg font-medium text-black dark:text-gray-400">
              {currentUser.name}
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <MdLogout />
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="px-6 py-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;