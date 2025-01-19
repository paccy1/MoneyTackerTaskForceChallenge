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
display: flex;
    overflow: auto;
    .total-income{
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        span{
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }
    .income-content{
        display: flex;
        gap: 2rem;
        .incomes{
            flex: 1;
        }
    }
`;
  

export default Budget;
