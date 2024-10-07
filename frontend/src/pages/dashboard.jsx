import React, { useEffect, useState } from 'react';
import DoughnutChart from '../components/doughnutchart';
import Navbar from '../components/navbar';
import Chart from '../components/chart';
import api from '../libs/apiCall';
import Loading from '../components/loading';
import Info from '../components/info';
import { IoAlbumsOutline } from "react-icons/io5"; 
import { SiCashapp } from 'react-icons/si';
import { formatCurrency } from "../libs"; 
import RecentTransactions from '../components/lastTransaction';
import { toast } from 'react-toastify';

const ICONS_STYLES = [
  'bg-blue-300 text-blue-800',
  'bg-gray-600 text-gray-300',
  'bg-rose-400 text-rose-800'
];

const Stats = ({ dt }) => {
  const data = [
    {
      label: 'Total Balance',
      amount: dt?.balance,
      icon: <IoAlbumsOutline size={26} />
    },
    {
      label: 'Total Expense',
      amount: dt?.expense,
      icon: <SiCashapp size={26} />
    },
    {
      label: 'Total Income',
      amount: dt?.income,
      icon: <IoAlbumsOutline size={26} />
    }
  ];

  const ItemCard = ({ item }) => (
    <div className='flex items-center justify-between w-full h-48 gap-5 px-4 py-12 shadow-lg border'>
      <div className="flex items-center w-full h-full gap-4">
        <div className={`w-12 h-12 flex justify-center rounded-full ${ICONS_STYLES[data.indexOf(item)]}`}>
          {item.icon}
        </div>
        <div className="space-y-3">
          <span className="text-base text-gray-600">
            {item.label}
          </span>
          <p className="text-2xl font-medium text-black">
            {formatCurrency(item?.amount || 0.0)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {data.map((item, index) => (
        <ItemCard key={index} item={item} />
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Initialize as loading

  const fetchDashboardStats = async () => {
    const URI = 'http://localhost:9000/api-v1/transaction/dashboard'; 
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found, user might not be logged in.');
      toast.error('You are not logged in. Please log in again.');
      return;
    }

    try {
      const response = await api.get(URI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched Dashboard Data: ", response.data); // Log fetched data
      setData(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something unexpected happened. Try again');
      
      if (error?.response?.status === 401 || error?.response?.data?.status === 'auth_failed') {
        localStorage.removeItem('token');
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats(); // Fetch dashboard stats on mount
  }, []);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center w-full h-[80vh]'>
        <Loading />
      </div>
    );
  }

  // Logging data to debug
  console.log("Dashboard Data: ", data);

  return (
    <div className='px-0 md:px-5 2xl:px-20'>
      <Navbar />
      <Info title='Dashboard' subTitle="Monitor your financial activities" />
      <Stats
        dt={{
          balance: data?.availableBalance,
          income: data?.totalIncome,
          expense: data?.totalExpense
        }}
      />

      <div className='flex flex-col-reverse items-center gap-10 w-full md:flex-row'>
        <Chart data={data?.chartData || []} /> {/* Pass correct chart data */}
        {data?.totalIncome > 0 && (
          <DoughnutChart 
              income={data?.totalIncome || 0}  // Make sure this is a number
              expense={data?.totalExpense || 0} // Make sure this is a number
          />
        )}
      </div>

      <div className='flex flex-col-reverse gap-0 md:flex-row md:gap-10 2xl:gap-20'>
        <RecentTransactions data={data?.lastTransaction || []} />
      </div>
    </div>
  );
};

export default Dashboard;
