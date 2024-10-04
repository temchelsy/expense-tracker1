// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import DoughnutChart from '../components/doughnutchart.jsx';
import Navbar from '../components/navbar.jsx'
import Chart from '../components/chart.jsx'
import { fetchCurrentUser } from '../providers/api.js';
import stats from '../components/stats.jsx'

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchCurrentUser();
      if (userData) {
        // Assume userData.transactions is the array of transactions for the user
        const formattedData = userData.transactions.map(transaction => ({
          label: transaction.date, // Adjust according to your transaction object structure
          income: transaction.income,
          expense: transaction.expense,
        }));
        setTransactions(formattedData);

        // Calculate totals for the doughnut chart
        const income = userData.transactions.reduce((sum, transaction) => sum + transaction.income, 0);
        const expense = userData.transactions.reduce((sum, transaction) => sum + transaction.expense, 0);
        setTotalIncome(income);
        setTotalExpense(expense);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
        <p>This is where you can view your recent transactions, manage accounts, and more!</p>

        {/* Render the Chart component with user transactions */}
        <Chart data={transactions} />
        <stats />
        
        {/* Render the DoughnutChart component with total income and expenses */}
        <DoughnutChart income={totalIncome} expense={totalExpense} />
      </div>
    </div>
  );
};

export default Dashboard;