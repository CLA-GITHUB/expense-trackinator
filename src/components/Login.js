import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { GlobalContext } from '../contexts/GlobalContext';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
export default function Login() {
	const { dispatch } = useContext(GlobalContext);
	const inputStyle = 'border-2 border-gray-300 py-2 px-3 w-full mb-4 outline-none rounded';
	const [loginState, setLoginState] = useState({
		email: '',
		password: '',
		rememberMe: true,
		isLoading: false,
		error: '',
		redirect: false
	});
	const toast = useToast();

	const handleChange = (e, key) => {
		setLoginState({
			...loginState,
			[key]: e.currentTarget.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoginState({
			...loginState,
			isLoading: true
		});

		if (!loginState.email || !loginState.password) {
			return setLoginState({
				...loginState,
				error: 'Invalid credentials!'
			});
		}

		axios
			.post(
				'https://ancient-ravine-70890.herokuapp.com/auth/login',
				{
					email: loginState.email,
					password: loginState.password
				},
				{
					headers: { 'Content-type': 'application/json' }
				}
			)
			.then((result) => {
				dispatch({ type: 'SET_USER', payload: result.data.user });
				if (loginState.rememberMe) {
					localStorage.setItem('token', result.data.token);
					localStorage.setItem('user', JSON.stringify(result.data.user));
				} else {
					sessionStorage.setItem('token', result.data.token);
					sessionStorage.setItem('user', JSON.stringify(result.data.user));
				}

				toast({
					position: 'top',
					variant: 'subtle',
					title: 'Login Successful!',
					description: 'Redirecting...',
					status: 'success',
					duration: 5000,
					isClosable: true
				});

				setLoginState({
					...loginState,
					redirect: true
				});
			})
			.catch((err) => {
				if (!err.response) return console.log('Network issue');
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
				if (err.response.status === 401)
					return toast({
						position: 'top',
						variant: 'subtle',
						title: 'Password incorrect!',
						description: 'The password entered is not correct!',
						status: 'error',
						duration: 9000,
						isClosable: true
					});
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
			});
		setLoginState({
			...loginState,
			isLoading: false
		});
	};
	if (localStorage.getItem('token') || sessionStorage.getItem('token')) return <Redirect to='/' />;
	if (loginState.redirect) return <Redirect to='/' />;
	return (
		<div
			className='min-h-screen flex flex-col justify-center items-center font-poppins px-2'
			style={{ backgroundColor: '#F7F4F7' }}
		>
			<div className='text-center'>
				<p className='font-bold text-2xl mb-8'>Expense Trackinator</p>
			</div>
			<form className='max-w-sm mx-auto' onSubmit={(e) => handleSubmit(e)}>
				{loginState.error && <p className='text-red-600 text-lg'>{loginState.error}</p>}
				<input
					type='email'
					placeholder='Enter Email: '
					className={`${inputStyle}`}
					value={loginState.email}
					onChange={(e) => handleChange(e, 'email')}
				/>
				<input
					type='password'
					placeholder='Enter Password: '
					className={`${inputStyle}`}
					value={loginState.password}
					onChange={(e) => handleChange(e, 'password')}
				/>
				<label className='flex items-center'>
					<input
						type='checkbox'
						className='w-5 h-5'
						checked={loginState.rememberMe}
						onChange={(e) =>
							setLoginState({
								...loginState,
								rememberMe: e.target.checked
							})
						}
					/>
					<span className='pl-2'>Remember me?</span>
				</label>
				{loginState.isLoading ? (
					<div className='w-full flex justify-center my-6'>
						<LoadingOutlined style={{ fontSize: 30 }} />
					</div>
				) : (
					<button
						className='px-3 py-3 w-full text-gray-50 my-5 hover:shadow-xl mb-4'
						style={{ backgroundColor: '#42224A' }}
					>
						Login
					</button>
				)}
			</form>

			<p>
				<Link to='/signup' style={{ color: 'blue' }}>
					Signup
				</Link>{' '}
				if you don't have an account
			</p>
		</div>
	);
}
