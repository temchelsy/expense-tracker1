import React from 'react';
import Navbar from '../components/navbar';

const Dashboard = () => {
  return (
    <div>
      <Navbar />  
      
      {/* Dashboard content */}
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
        {/* Additional dashboard content can go here */}
        <p>This is where you can view your recent transactions, manage accounts, and more!</p>
      </div>
    </div>
  );
};

export default Dashboard;
