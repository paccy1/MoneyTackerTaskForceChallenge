import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import styled from "styled-components";

const Budget = () => {
  const {
    fetchTotalIncome,
    fetchBudgetSummary,
    addBudgetCategory,
    budgetAllocations,
    totalIncome,
    error,
  } = useGlobalContext();

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchTotalIncome();
    fetchBudgetSummary();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (category && amount && date) {
      await addBudgetCategory(category, amount, date.toISOString().split("T")[0]);
      setCategory("");
      setAmount("");
      setDate(new Date());
    }
  };

  const totalAllocated = budgetAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);

  return (
    <Container>
      <Header>Budget Management</Header>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <TotalIncome>Total Income: ${totalIncome()}</TotalIncome>
      <TotalAllocated>Total Allocated: ${totalAllocated}</TotalAllocated>
      <Form onSubmit={handleAddCategory}>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="" disabled>Select a category</option>
          <option value="Rent">Rent</option>
          <option value="Clothes">Clothes</option>
          <option value="Transport">Transport</option>
          <option value="Other">Other</option>
        </Select>
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
        <DatePickerWrapper>
          <DatePicker
            selected={date}
            onChange={(selectedDate) => setDate(selectedDate)}
            dateFormat="yyyy-MM-dd"
            placeholderText="yyyy-mm-dd"
            required
          />
        </DatePickerWrapper>
        <Button type="submit">Add Category</Button>
      </Form>
      <SectionTitle>Budget Allocations</SectionTitle>
      {budgetAllocations.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {budgetAllocations.map((allocation, index) => (
              <tr key={index}>
                <td>{allocation.category}</td>
                <td>${allocation.amount}</td>
                <td>{allocation.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <NoAllocationsMessage>No budget allocations yet.</NoAllocationsMessage>
      )}
    </Container>
  );
};

export default Budget;

// Styled Components
const Container = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  text-align: center;
  color: #333;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-bottom: 15px;
`;

const TotalIncome = styled.h2`
  text-align: center;
  color: #007bff;
  margin-bottom: 10px;
`;

const TotalAllocated = styled.h3`
  text-align: center;
  color: #28a745;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
  }

  th {
    background-color: #007bff;
    color: white;
  }
`;

const NoAllocationsMessage = styled.p`
  text-align: center;
  color: #666;
`;
