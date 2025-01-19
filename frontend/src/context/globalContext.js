import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgetAllocations, setBudgetAllocations] = useState([]);
  const [allTotalIncome, setTotalIncome] = useState(0);
  const [error, setError] = useState(null);

  // Add income
  const addIncome = async (income) => {
    try {
      await axios.post(`${BASE_URL}add-income`, income);
      getIncomes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add income");
    }
  };

  // Fetch incomes
  const getIncomes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-incomes`);
      setIncomes(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch incomes");
    }
  };

  // Delete income
  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-income/${id}`);
      getIncomes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete income");
    }
  };

  // Calculate total income
  const totalIncome = () => incomes.reduce((total, income) => total + income.amount, 0);

  // Add expense
  const addExpense = async (expense) => {
    try {
      await axios.post(`${BASE_URL}add-expense`, expense);
      getExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
    }
  };

  // Fetch expenses
  const getExpenses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-expenses`);
      setExpenses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch expenses");
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-expense/${id}`);
      getExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete expense");
    }
  };

  // Calculate total expenses
  const totalExpenses = () => expenses.reduce((total, expense) => total + expense.amount, 0);

  // Calculate total balance
  const totalBalance = () => totalIncome() - totalExpenses();

  // Get recent transaction history
  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    return history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  };

  // Fetch total income
  const fetchTotalIncome = async () => {
    try {
      const response = await axios.get(`${BASE_URL}total-income`);
      setTotalIncome(response.data.allTotalIncome);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch total income");
    }
  };

  // Add budget category
  const addBudgetCategory = async (category, amount) => {
    try {
      const response = await axios.post(`${BASE_URL}add-budget-category`, { category, amount });
      setBudgetAllocations(response.data.budgetAllocations);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add budget category");
    }
  };

  // Fetch budget summary
  const fetchBudgetSummary = async () => {
    try {
      const response = await axios.get(`${BASE_URL}budget-summary`);
      setTotalIncome(response.data.totalIncome);
      setBudgetAllocations(response.data.budgetAllocations);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch budget summary");
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncome,
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        fetchTotalIncome,
        addBudgetCategory,
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
