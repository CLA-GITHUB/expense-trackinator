import React, { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';

export default function ExpenseSummary() {
	const { state } = useContext(GlobalContext);
	const { transactions } = state.user;
	let income = 0;
	let expense = 0;
	for (let i = 0; i < transactions.length; i++) {
		if (transactions[i].amount > 0) income += transactions[i].amount;
		if (transactions[i].amount < 0) expense += transactions[i].amount;
	}

	return (
		<>
			<div className='my-4'>
				<p className='pl-3'>Your Balance</p>
				<p className='text-2xl font-semibold pl-3'>₦{income.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
			</div>
			<div
				className='h-56 rounded-3xl'
				style={{ background: `linear-gradient(to right, #348F50, #348F50, #F37335, #e53935,#e53935)` }}
			>
				<div className='h-full flex flex-row justify-around items-center '>
					<div className='text-center'>
						<p className='text-gray-200'>Income</p>

						<p className='text-gray-100 font-extrabold text-lg'>₦{income - Math.abs(expense)}</p>
					</div>
					<div className='text-center'>
						<p className='text-gray-200'>Expenses</p>
						<p className='text-gray-100 font-extrabold text-lg'>-₦{Math.abs(expense)}</p>
					</div>
				</div>
			</div>
		</>
	);
}
