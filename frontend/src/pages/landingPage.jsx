import React, { useState } from "react";
import { Link } from "react-router-dom";
import { XIcon } from "@heroicons/react/outline";
import { useGlobalContext } from '../context/globalContext'; // Update the import path

import Register from './auth/register';
import Login from './auth/login';

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const { currentUser, setCurrentUser } = useGlobalContext(); // Use the unified context

  const openRegisterModal = () => {
    setShowModal(true);
    setIsLoginModal(false);
  };

  const openLoginModal = () => {
    setShowModal(true);
    setIsLoginModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleLogin = (userData) => {
    // Perform login logic here
    // For example, after successful login, you can update the current user state
    setCurrentUser(userData); // Assuming userData is the logged-in user data
  };

  return (
    <div className="bg-gray-100 text-gray-900">
      <header className="bg-white shadow-md py-2 w-full z-10">
        <div className="container mx-auto flex flex-wrap justify-between items-center px-4">
          <h1 className="text-xl font-bold md:text-2xl">ExpenseEase</h1>
          <nav className="flex-grow mt-2 md:mt-0">
            <div className="flex items-center justify-end">
              <Link to="#about" className="mx-2 text-gray-700 hover:text-blue-500 md:mx-4">About Us</Link>
              {!currentUser ? (
                <>
                  <button onClick={openLoginModal} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 md:ml-4">Login</button>
                  <button onClick={openRegisterModal} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 md:ml-4">Register</button>
                </>
              ) : (
                <button onClick={() => setCurrentUser(null)} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 md:ml-4">Logout</button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* About Us Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">About Us</h2>
          <p className="text-lg text-center mb-6">
            Simple solution to manage all your personal finances.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="bg-blue-500 text-white py-20 mt-16">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-4">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-2">Simple Expense Tracker</h2>
            <p className="text-lg mb-6">It takes seconds to record daily transactions and put them into clear and visualized categories such as food, rent, and electricity bills.</p>
            {!currentUser && (
              <button onClick={openRegisterModal} className="px-6 py-3 bg-white text-blue-500 rounded hover:bg-gray-200">Get Started</button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-500 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 ExpenseEase. All rights reserved.</p>
          <p className="mt-4">Contact us: <a href="mailto:ExpenseEase@gmail.com" className="underline">ExpenseEase@gmail.com</a></p>
        </div>
      </footer>

      {/* Modal for Login/Register */}
      {showModal && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center z-0">
          <div className="fixed inset-0 z-40" onClick={closeModal} />
          <div
            className="bg-white p-6 rounded shadow-lg w-full max-w-md z-50 relative md:w-4/4"
            style={{ height: '93%', maxHeight: '93%' }} // Reduced height by 7%
          >
            <button
              className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={closeModal}
            >
              <XIcon className="h-6 w-6" />
            </button>
            {isLoginModal ? <Login onLogin={handleLogin} /> : <Register />}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
