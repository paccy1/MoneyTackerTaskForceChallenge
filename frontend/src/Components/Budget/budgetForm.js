import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';

function BudgetForm() {
  const {
    addBudgetCategory,
    fetchBudgetSummary,
    totalIncome,
    error,
    budgetAllocations = [] // Initialize to an empty array to avoid undefined errors
  } = useGlobalContext();

  const [category, setCategory] = useState('Rent'); // Default category selected
  const [amount, setAmount] = useState('');

  const handleAddCategory = () => {
    if (category && amount > 0) {
      addBudgetCategory(category, amount);
      setCategory('Rent'); // Reset to default
      setAmount('');
    }
  };

  return (
    <BudgetFormStyled>
      <h1>Budget Manager</h1>
      <p>Total Income: ${totalIncome}</p>

      <div className="budget-form">
        <h2>Add Budget Category</h2>
        <div className="input-control">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>Select Category Type</option>
            <option value="Rent">Rent</option>
            <option value="Transport">Transport</option>
            <option value="Water Bill">Water Bill</option>
            <option value="Clothes">Clothes</option>
            <option value="School Fees">School Fees</option>
            <option value="Food">Food</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Medical">Medical</option>
            <option value="Miscellaneous">Miscellaneous</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="input-control">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="submit-btn">
          <Button
            name="Add Category"
            onClick={handleAddCategory}
            bPad=".8rem 1.6rem"
            bRad="30px"
            bg="var(--color-accent)"
            color="#fff"
          />
        </div>
      </div>

      <div className="budget-summary">
        <h2>Budget Summary</h2>
        <Button
          name="Get Budget Summary"
          onClick={fetchBudgetSummary}
          bPad=".5rem 1rem"
          bRad="20px"
          bg="#28a745"
          color="#fff"
        />
        <ul>
          {budgetAllocations.length > 0 ? (
            budgetAllocations.map((alloc, index) => (
              <li key={index}>
                {alloc.category}: ${alloc.amount}
              </li>
            ))
          ) : (
            <li>No budget allocations available.</li>
          )}
        </ul>
      </div>

      {error && <p className="error">{error}</p>}
    </BudgetFormStyled>
  );
}

const BudgetFormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.1);

  h1 {
    color: rgba(34, 34, 96, 0.9);
  }

  .budget-form {
    .input-control {
      select, input {
        width: 100%;
        padding: 0.5rem 1rem;
        border: 2px solid #ddd;
        border-radius: 5px;
        background: transparent;
        font-size: 1rem;
      }
    }

    .submit-btn {
      button {
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        &:hover {
          background: var(--color-green) !important;
        }
      }
    }
  }

  .budget-summary {
    ul {
      list-style: none;
      padding: 0;

      li {
        padding: 0.5rem 0;
      }
    }
  }

  .error {
    color: red;
  }
`;

export default BudgetForm;
