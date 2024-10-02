import React from "react";
import { RiCurrencyLine } from "react-icons/ri";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import ThemeSwitch from './themeswitch'
import { useAppContext } from '../providers/app-context'

const Navbar = () => {
  const { currentUser, loading, error } = useAppContext();  // Get currentUser and loading states

  // If still loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an error, display it
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full flex items-center justify-between py-6">
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-violet-700 rounded-xl">
          <RiCurrencyLine className="text-white text-3xl hover:animate-spin" />
        </div>
        <span className="text-xl font-bold text-black dark:text-white">
          My-Finance
        </span>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <div className="px-6 py-2 rounded-full bg-black text-white">Dashboard</div>
        <div className="px-6 py-2 rounded-full text-gray-700 dark:text-gray-500">
          Transactions
        </div>
      </div>

      <div className="flex items-center gap-10">
        <ThemeSwitch />

        <div className="flex items-center gap-2">
          {/* Display user information when available */}
          {currentUser ? (
            <>
              <p className="text-lg font-medium text-black dark:text-gray-400">
                {currentUser.name}
              </p>
              <MdOutlineKeyboardArrowDown className="text-2xl text-gray-600 dark:text-gray-300 cursor-pointer" />
            </>
          ) : (
            <p className="text-lg font-medium text-black dark:text-gray-400">
              logout
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
