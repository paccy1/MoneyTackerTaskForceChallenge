const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { getTotalIncome, addBudgetCategory, getBudgetSummary } = require('../controllers/budget');

const router = require('express').Router();


router.post('/add-income', addIncome)
    .get('/get-incomes', getIncomes)
    .delete('/delete-income/:id', deleteIncome)
    .post('/add-expense', addExpense)
    .get('/get-expenses', getExpense)
    .delete('/delete-expense/:id', deleteExpense)
    .get('/total-income', getTotalIncome)
    .post('/add-budget-category', addBudgetCategory)
    .get('/budget-summary', getBudgetSummary)

module.exports = router