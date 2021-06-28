import React from 'react';
import AddExpense from '../components/AddExpense';
import Expenses from '../components/Expenses';
import ExpenseSummary from '../components/ExpenseSummary';
import HomeHeader from '../components/HomeHeader';
import { Redirect } from 'react-router-dom';

export default function MainHomePage() {
	if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) return <Redirect to='/login' />;

	return (
		<div className='max-w-lg mx-auto font-poppins'>
			<HomeHeader />
			<ExpenseSummary />
			<Expenses />
			<AddExpense />
		</div>
	);
}
