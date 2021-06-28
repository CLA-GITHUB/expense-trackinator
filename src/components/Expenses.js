import axios from 'axios';
import { useContext, useState } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { LoadingOutlined } from '@ant-design/icons';
import { useToast } from '@chakra-ui/react';
function Expenses() {
	const toast = useToast();
	const { dispatch, state } = useContext(GlobalContext);
	const { transactions } = state.user;
	const [isLoading, setIsLoading] = useState(false);
	const onDelete = (transactionId) => {
		setIsLoading(true);
		axios
			.delete(`https://ancient-ravine-70890.herokuapp.com/${transactionId}`, {
				headers: {
					'x-access-token': localStorage.getItem('token')
						? localStorage.getItem('token')
						: sessionStorage.getItem('token')
				}
			})
			.then((result) => {
				dispatch({
					type: 'DELETE_TRANSACTION',
					payload: {
						transactions: result.data.transactions
					}
				});
				toast({
					position: 'top',
					variant: 'subtle',
					title: 'Expense deleted!',
					status: 'success',
					duration: 7000,
					isClosable: true
				});
				setIsLoading(false);
			})
			.catch((err) => {
				if (!err.response) return console.log('Nework issues');
				if (err.response.status === 404)
					return toast({
						position: 'top',
						variant: 'subtle',
						title: 'User not found!',
						description: 'User does not exist. Sign up to create account!',
						status: 'error',
						duration: 9000,
						isClosable: true
					});
				if (err.response.status === 500)
					return toast({
						position: 'top',
						variant: 'subtle',
						title: 'Server Error!',
						description: 'Network error or server error!',
						status: 'error',
						duration: 9000,
						isClosable: true
					});
			});
	};

	return (
		<div>
			<p className='pl-3 mt-3'>History</p>
			<hr />
			{transactions.length === 0 && <p className='text-center my-3 text-lg'> Create some expenses!</p>}
			{transactions.map((transaction, index) => (
				<div
					key={index}
					className={`flex justify-between items-center my-3 px-3 py-3 mx-2 ${
						transaction.amount < 0 ? 'border-r-4 border-red-500' : 'border-r-4 border-green-700'
					}`}
					onClick={() => onDelete(transaction._id)}
				>
					<div className='flex flex-wrap'>
						<div
							className={`w-10 h-10 rounded-full ${
								transaction.amount < 0 ? 'bg-red-500' : 'bg-green-500'
							}`}
						></div>

						<div className='pl-3'>
							<p>{transaction.text}</p>
							<p className='text-sm text-gray-400'>{transaction.category}</p>
						</div>
					</div>
					<div>
						<p>{transaction.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
					</div>
					{isLoading && (
						<div>
							<LoadingOutlined />
						</div>
					)}
				</div>
			))}
		</div>
	);
}

export default Expenses;
