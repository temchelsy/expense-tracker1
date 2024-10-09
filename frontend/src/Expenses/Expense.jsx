import React, { useEffect } from 'react';
import { useGlobalContext } from '../context/globalContext';
import { InnerLayout } from '../styles/Layouts'; // Adjust the path as needed
import IncomeItem from '../IncomeItem/IncomeItems'; // Ensure this path is correct
import ExpenseForm from './ExpenseForm'; // Ensure this path is correct
import styled from 'styled-components';
import Form from '../Form/Form';

function Expenses() {
    const { expenses, getExpenses, deleteExpense, totalExpenses } = useGlobalContext();

    useEffect(() => {
        getExpenses(); // Fetch expenses when the component mounts
    }, [getExpenses]);

    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                <h2 className="total-income">Total Expense: <span>${totalExpenses()}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <ExpenseForm /> {/* Renders the expense form */}
                    </div>
                    <div className="incomes">
                        {expenses.map((expense) => {
                            const { _id, title, amount, date, category, description, type } = expense;
                            return (
                                <IncomeItem
                                    key={_id}
                                    id={_id}
                                    title={title}
                                    description={description}
                                    amount={amount}
                                    date={date}
                                    type={type}
                                    category={category}
                                    indicatorColor="var(--color-green)"
                                    deleteItem={deleteExpense} // Pass the delete function
                                />
                            );
                        })}
                    </div>
                </div>
            </InnerLayout>
        </ExpenseStyled>
    );
}

const ExpenseStyled = styled.div`
    display: flex;
    overflow: auto;

    .total-income {
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

        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }

    .income-content {
        display: flex;
        gap: 2rem;

        .incomes {
            flex: 1;
        }
    }
`;

export default Expenses;
