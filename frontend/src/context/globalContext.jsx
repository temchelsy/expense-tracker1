import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import fetchCurrentUser from '../providers/api'

const BASE_URL = "http://localhost:9000/api-v1/";

const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
  // State for user management
  const [currentUser, setCurrentUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for income and expenses
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Fetch current user on mount
  useEffect(() => {
    fetchCurrentUser()
      .then((data) => {
        setCurrentUser(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  // Function to fetch user projects
  const fetchUserProjects = async () => {
    try {
      const projects = await fetchUserProjectsFromAPI(); // Replace with your API call
      setUserProjects(projects);
    } catch (error) {
      setError(error);
    }
  };

  // Income functions
  const addIncome = async (income) => {
    try {
      await axios.post(`${BASE_URL}add-income`, income);
      getIncomes();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const getIncomes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-incomes`);
      setIncomes(response.data);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-income/${id}`);
      getIncomes();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const totalIncome = () => {
    return incomes.reduce((total, income) => total + income.amount, 0);
  };

  // Expense functions
  const addExpense = async (expense) => {
    try {
      await axios.post(`${BASE_URL}finance/add-expense`, expense);
      getExpenses();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const getExpenses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-expenses`);
      setExpenses(response.data);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-expense/${id}`);
      getExpenses();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const totalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const totalBalance = () => {
    return totalIncome() - totalExpenses();
  };

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return history.slice(0, 3);
  };

  return (
    <GlobalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userProjects,
        setUserProjects,
        isLoading,
        error,
        fetchUserProjects,
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalIncome,
        totalBalance,
        transactionHistory,
        setError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
