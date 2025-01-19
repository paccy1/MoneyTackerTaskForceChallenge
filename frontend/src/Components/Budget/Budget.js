import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import BudgetForm from './budgetForm';

function Budget() {
  const { totalIncome, fetchBudgetSummary, budgetSummary, deleteBudgetCategory } = useGlobalContext();

  useEffect(() => {
    fetchBudgetSummary();
  }, []);

  return (
    <BudgetStyled>
      <InnerLayout>
        <h1>Budget</h1>
        <h2 className="total-income">
          Total Income: <span>${totalIncome || 0}</span>
        </h2>
        <div className="budget-content">
          <div className="form-container">
            <BudgetForm />
          </div>
          <div className="budget-summary">
            <h2>Budget Summary</h2>
            {budgetSummary ? (
              <div>
                <p>Total Budget: ${budgetSummary.totalBudget || 0}</p>
                {budgetSummary.totalBudget > totalIncome ? (
                  <p className="warning">Warning: Total budget exceeds income!</p>
                ) : (
                  <p className="success">Budget is within income.</p>
                )}
                <ul>
                  {(budgetSummary.budgetAllocations || []).map((alloc, index) => (
                    <li key={index}>
                      {alloc.category}: ${alloc.amount}
                      <button onClick={() => deleteBudgetCategory(alloc.id)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No budget summary available.</p>
            )}
          </div>
        </div>
      </InnerLayout>
    </BudgetStyled>
  );
}

const BudgetStyled = styled.div`
  .total-income {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    span {
      font-weight: bold;
    }
  }

  .budget-content {
    display: flex;
    gap: 2rem;

    .form-container {
      flex: 1;
    }

    .budget-summary {
      flex: 1;
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 10px;
      box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.05);

      h2 {
        margin-bottom: 1rem;
      }

      ul {
        list-style: none;
        padding: 0;
        li {
          padding: 0.5rem 0;
          display: flex;
          justify-content: space-between;

          button {
            background: #dc3545;
            color: white;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 5px;
            cursor: pointer;
          }
        }
      }

      .warning {
        color: #dc3545;
      }

      .success {
        color: #28a745;
      }
    }
  }
`;

export default Budget;
