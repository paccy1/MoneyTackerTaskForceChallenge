const IncomeSchema = require("../models/IncomeModel");

exports.getTotalIncome = async (req, res) => {
    try {
        // Fetch all income entries
        const incomes = await IncomeSchema.find();

        // Calculate total income for each type
        const totalIncome = incomes.reduce((acc, income) => {
            if (income.title === 'MoMo' || income.title === 'Bank Account' || income.title === 'Cash in Hand') {
                acc += income.amount;
            }
            return acc;
        }, 0);

        res.status(200).json({ totalIncome });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

let budgetAllocations = []; // Temporary in-memory storage for budgets

exports.addBudgetCategory = (req, res) => {
    const { category, amount } = req.body;

    if (!category || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid category or amount!' });
    }

    const numericAmount = parseFloat(amount);

    // Check if the category already exists
    const existingCategory = budgetAllocations.find(b => b.category === category);
    if (existingCategory) {
        existingCategory.amount += numericAmount;
    } else {
        budgetAllocations.push({ category, amount: numericAmount });
    }

    res.status(200).json({ message: 'Budget category added/updated', budgetAllocations });
};

exports.getBudgetSummary = async (req, res) => {
    try {
        // Fetch total income
        const incomes = await IncomeSchema.find();
        const totalIncome = incomes.reduce((acc, income) => {
            if (income.title === 'MoMo' || income.title === 'Bank Account' || income.title === 'Cash in Hand') {
                acc += income.amount;
            }
            return acc;
        }, 0);

        // Calculate total budget
        const totalBudget = budgetAllocations.reduce((sum, budget) => sum + budget.amount, 0);

        // Check if budget exceeds income
        if (totalBudget > totalIncome) {
            return res.status(400).json({
                message: 'Total budget exceeds income! Adjust your expenses.',
                totalIncome,
                totalBudget,
                budgetAllocations
            });
        }

        res.status(200).json({
            message: 'Budget summary',
            totalIncome,
            totalBudget,
            budgetAllocations
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
