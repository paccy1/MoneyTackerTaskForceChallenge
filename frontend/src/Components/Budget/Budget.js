import React, { useState } from 'react';
import styled from 'styled-components';
import ExpenseForm from '../Expenses/ExpenseForm';

function Budget() {
    const [income, setIncome] = useState('');
    const [budgets, setBudgets] = useState({
        education: 0,
        groceries: 0,
        health: 0,
        subscriptions: 0,
        takeaways: 0,
        clothing: 0,
        travelling: 0,
        other: 0,
    });
    const [remainingBudget, setRemainingBudget] = useState({ ...budgets });

    const handleIncomeChange = (e) => {
        setIncome(e.target.value);
    };

    const handleBudgetChange = (category) => (e) => {
        const value = parseFloat(e.target.value) || 0;
        setBudgets((prev) => ({ ...prev, [category]: value }));
        setRemainingBudget((prev) => ({ ...prev, [category]: value }));
    };

    const handleExpenseAddition = (expense) => {
        const { category, amount } = expense;
        const expenseAmount = parseFloat(amount) || 0;

        if (remainingBudget[category] - expenseAmount < 0) {
            alert(`Insufficient budget for ${category}.`);
        } else {
            setRemainingBudget((prev) => ({
                ...prev,
                [category]: prev[category] - expenseAmount,
            }));
        }
    };

    const totalBudget = Object.values(budgets).reduce((acc, curr) => acc + curr, 0);
    const remainingIncome = parseFloat(income || 0) - totalBudget;

    return (
        <BudgetStyled>
            <h2>Budget Planning</h2>

            <div className="income-section">
                <label htmlFor="income">Enter Your Income: </label>
                <input
                    type="number"
                    id="income"
                    value={income}
                    onChange={handleIncomeChange}
                    placeholder="Enter total income"
                />
            </div>

            <div className="budget-section">
                <h3>Set Budgets for Categories</h3>
                {Object.keys(budgets).map((category) => (
                    <div key={category} className="budget-input">
                        <label htmlFor={category}>{category.charAt(0).toUpperCase() + category.slice(1)}: </label>
                        <input
                            type="number"
                            id={category}
                            value={budgets[category]}
                            onChange={handleBudgetChange(category)}
                            placeholder={`Budget for ${category}`}
                        />
                        <p>Remaining: {remainingBudget[category]}</p>
                    </div>
                ))}
            </div>

            <ExpenseForm addExpense={handleExpenseAddition} />

            <div className="summary">
                <h3>Budget Summary</h3>
                <p>Total Income: {income}</p>
                <p>Total Allocated Budget: {totalBudget}</p>
                <p>Remaining Income: {remainingIncome < 0 ? 'Exceeded' : remainingIncome}</p>
            </div>
        </BudgetStyled>
    );
}

const BudgetStyled = styled.div`
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.1);

    .income-section, .budget-section, .summary {
        margin-bottom: 2rem;
    }

    input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-top: 0.5rem;
        width: 100%;
    }

    .budget-input {
        margin-bottom: 1rem;
    }

    h2, h3 {
        color: #333;
    }

    p {
        margin: 0.5rem 0;
    }
`;

export default Budget;
