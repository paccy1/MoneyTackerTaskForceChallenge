import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgetAllocations, setBudgetAllocations] = useState([]);
  const [allTotalIncome, setTotalIncome] = useState(0); // Server-fetched total income
  const [error, setError] = useState(null);

  // Calculate total income dynamically from the local state
  const calculateTotalIncome = () =>
    incomes.reduce((total, income) => total + (income.amount || 0), 0);

  // Define totalIncome as a function for flexibility
  const totalIncome = () => allTotalIncome || calculateTotalIncome();

  // Helper function for error handling
  const handleError = (err, defaultMessage) => {
    const message = err?.response?.data?.message || defaultMessage;
    setError(message);
    console.error(message);
  };

  // Add income
  const addIncome = async (income) => {
    try {
      await axios.post(`${BASE_URL}add-income`, income);
      await getIncomes();
    } catch (err) {
      handleError(err, "Failed to add income");
    }
  };

  // Fetch incomes
  const getIncomes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-incomes`);
      setIncomes(response.data || []);
    } catch (err) {
      handleError(err, "Failed to fetch incomes");
    }
  };

  // Delete income
  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-income/${id}`);
      await getIncomes();
    } catch (err) {
      handleError(err, "Failed to delete income");
    }
  };

  // Add expense
  const addExpense = async (expense) => {
    try {
      await axios.post(`${BASE_URL}add-expense`, expense);
      await getExpenses();
    } catch (err) {
      handleError(err, "Failed to add expense");
    }
  };

  // Fetch expenses
  const getExpenses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-expenses`);
      setExpenses(response.data || []);
    } catch (err) {
      handleError(err, "Failed to fetch expenses");
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-expense/${id}`);
      await getExpenses();
    } catch (err) {
      handleError(err, "Failed to delete expense");
    }
  };

  // Calculate total expenses
  const totalExpenses = () =>
    expenses.reduce((total, expense) => total + (expense.amount || 0), 0);

  // Calculate total balance
  const totalBalance = () => totalIncome() - totalExpenses();

  // Get recent transaction history
  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    return history
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  };

  // Fetch total income from server
  const fetchTotalIncome = async () => {
    try {
      const response = await axios.get(`${BASE_URL}total-income`);
      setTotalIncome(response.data.allTotalIncome || 0);
    } catch (err) {
      handleError(err, "Failed to fetch total income");
    }
  };

  // Add budget category with date
  const addBudgetCategory = async (category, amount, date) => {
    try {
      const response = await axios.post(`${BASE_URL}add-budget-category`, {
        category,
        amount,
        date,
      });
      setBudgetAllocations(response.data.budgetAllocations || []);
    } catch (err) {
      handleError(err, "Failed to add budget category");
    }
  };

  // Fetch budget summary
  const fetchBudgetSummary = async () => {
    try {
      const response = await axios.get(`${BASE_URL}budget-summary`);
      setTotalIncome(response.data.totalIncome || 0);
      setBudgetAllocations(response.data.budgetAllocations || []);
    } catch (err) {
      handleError(err, "Failed to fetch budget summary");
    }
  };

  // Provide context values
  return (
    <GlobalContext.Provider
      value={{
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        totalIncome, // Now correctly defined
        expenses,
        allTotalIncome, // Server-fetched total income
        calculateTotalIncome, // Function for calculation
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        fetchTotalIncome,
        budgetAllocations,
        addBudgetCategory, // Updated to handle category with date
        fetchBudgetSummary,
        error,
        setError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
