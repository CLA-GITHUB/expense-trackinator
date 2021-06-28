import axios from 'axios';
import { useState, useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { LoadingOutlined } from '@ant-design/icons';
import { useToast } from '@chakra-ui/react';
function AddExpense() {
	const toast = useToast();
	const inputClass = 'border-2 border-gray-200 py-2 px-3 w-full mb-2';
	const [formState, setFormState] = useState({
		desc: '',
		category: '',
		amount: 0,
		isLoading: false
	});
	const { dispatch } = useContext(GlobalContext);

	const onSubmit = (e) => {
		e.preventDefault();
		setFormState({ ...formState, isLoading: true });
		axios
			.put(
				'https://ancient-ravine-70890.herokuapp.com/api/create-transaction',
				{
					amount: formState.amount,
					text: formState.desc,
					category: formState.category
				},
				{
					headers: {
						'x-access-token': localStorage.getItem('token')
							? localStorage.getItem('token')
							: sessionStorage.getItem('token')
					}
				}
			)
			.then((result) => {
				if (localStorage.getItem('user')) {
					let user = JSON.parse(localStorage.getItem('user'));
					user.transactions = result.data.transactions;
					localStorage.setItem('user', JSON.stringify(user));
				} else {
					let user = JSON.parse(sessionStorage.getItem('user'));
					user.transactions = result.data.transactions;
					sessionStorage.setItem('user', JSON.stringify(user));
				}
				dispatch({
					type: 'ADD_TRANSACTION',
					payload: {
						transactions: result.data.transactions
					}
				});
				setFormState({
					desc: '',
					category: '',
					amount: 0,
					isLoading: false
				});
			})
			.catch((err) => {
				if (!err.responsse)
					return toast({
						position: 'top',
						variant: 'subtle',
						title: 'Failed to add transaction!',
						status: 'error',
						duration: 9000,
						isClosable: true
					});
				if (!err.responsse.status === 422)
					return toast({
						position: 'top',
						variant: 'subtle',
						title: 'User not found!',
						description: 'User does not exist. Sign up to create account!',
						status: 'error',
						duration: 9000,
						isClosable: true
					});
				if (!err.responsse.status === 500)
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
		setFormState({
			...formState,
			isLoading: false
		});
	};
	return (
		<div className='flex justify-center items-center'>
			<form onSubmit={(e) => onSubmit(e)}>
				<input
					type='text'
					placeholder='Expense description'
					className={`${inputClass}`}
					value={formState.desc}
					onChange={(e) =>
						setFormState({
							...formState,
							desc: e.currentTarget.value
						})
					}
				/>
				<input
					type='text'
					placeholder='Expense category'
					className={`${inputClass}`}
					value={formState.category}
					onChange={(e) =>
						setFormState({
							...formState,
							category: e.currentTarget.value
						})
					}
				/>
				<input
					type='number'
					placeholder='Expense Amount'
					className={`${inputClass}`}
					value={formState.amount}
					onChange={(e) =>
						setFormState({
							...formState,
							amount: Math.round(e.currentTarget.value)
						})
					}
				/>
				<div className='flex justify-center items-center'>
					{formState.isLoading && <LoadingOutlined style={{ fontSize: 30 }} />}

					{!formState.isLoading && (
						<button
							className='text-4xl rounded-full py-2 px-4 text-white cursor-pointer mt-3 outline-none'
							style={{ background: '#EF8767' }}
						>
							+
						</button>
					)}
				</div>
			</form>
		</div>
	);
}

export default AddExpense;
