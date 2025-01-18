const IncomeSchema = require("../models/IncomeModel");

exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    // Define allowed account types
    const validAccounts = ['MoMo', 'Bank Account', 'Cash in Hand'];

    // Validate title as account type
    if (!title || !validAccounts.includes(title)) {
        return res.status(400).json({ message: 'Invalid account type. Choose MoMo, Bank Account, or Cash in Hand.' });
    }

    // Validate amount
    const numericAmount = parseFloat(amount);  // Ensure numeric type
    if (!numericAmount || numericAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    try {
        // Check if an income entry with the same title already exists
        const existingIncome = await IncomeSchema.findOne({ title });
        if (existingIncome) {
            // Update the existing entry by adding the new amount
            existingIncome.amount += numericAmount;
            existingIncome.category = category;  // Optionally update other fields
            existingIncome.description = description;
            existingIncome.date = date;
            await existingIncome.save();
            return res.status(200).json({ message: 'Income updated', income: existingIncome });
        }

        // If no existing entry, create a new one
        const income = new IncomeSchema({
            title,  // Account type
            amount: numericAmount,
            category,
            description,
            date
        });
        await income.save();
        res.status(200).json({ message: 'Income Added', income });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getIncomes = async (req, res) => {
    try {
        const incomes = await IncomeSchema.find().sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    try {
        const income = await IncomeSchema.findByIdAndDelete(id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        res.status(200).json({ message: 'Income Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
