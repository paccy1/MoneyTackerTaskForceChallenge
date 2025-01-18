const ExpenseSchema = require("../models/ExpenseModel");
const IncomeSchema = require("../models/IncomeModel");  // Importing the income model to track account balances

exports.addExpense = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    try {
        // Validate input fields
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        const numericAmount = parseFloat(amount);  // Ensure amount is numeric
        if (!numericAmount || numericAmount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        // Check if the account has enough balance
        const account = await IncomeSchema.findOne({ title });
        if (!account) {
            return res.status(400).json({ message: `Account ${title} does not exist.` });
        }

        if (account.amount < numericAmount) {
            return res.status(400).json({ message: 'Insufficient balance in the selected account!' });
        }

        // Deduct the expense amount from the account
        account.amount -= numericAmount;
        await account.save();

        // Save the expense record
        const expense = new ExpenseSchema({
            title,
            amount: numericAmount,
            category,
            description,
            date
        });
        await expense.save();

        res.status(200).json({ message: 'Expense Added', expense });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getExpense = async (req, res) => {
    try {
        const expenses = await ExpenseSchema.find().sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const expense = await ExpenseSchema.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
