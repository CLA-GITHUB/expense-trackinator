import React, { useState, useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { Link, Redirect } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
export default function Signup() {
	const toast = useToast();
	const { dispatch } = useContext(GlobalContext);
	const inputStyle = 'border-2 border-gray-300 py-2 px-3 w-full mb-4 outline-none rounded';
	const [registerState, setRegisterState] = useState({
		name: '',
		email: '',
		password: '',
		rememberMe: true,
		error: '',
		redirect: false,
		isLoading: false
	});

	const handleChange = (e, key) => {
		setRegisterState({
			...registerState,
			[key]: e.currentTarget.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setRegisterState({
			...registerState,
			isLoading: true
		});

		if (!registerState.name || !registerState.email || !registerState.password) {
			return setRegisterState({
				...registerState,
				error: 'Fill all fields!'
			});
		}

		axios
			.post('https://ancient-ravine-70890.herokuapp.com/auth/signup', {
				name: registerState.name,
				email: registerState.email,
				password: registerState.password
			})
			.then((result) => {
				dispatch({ type: 'SET_USER', payload: result.data.user });
				if (registerState.rememberMe) {
					localStorage.setItem('token', result.data.token);
					localStorage.setItem('user', JSON.stringify(result.data.user));
				} else {
					sessionStorage.setItem('token', result.data.token);
					sessionStorage.setItem('user', JSON.stringify(result.data.user));
				}
				toast({
					position: 'top',
					variant: 'subtle',
					title: 'Sign up successful!',
					description: 'Redirecting...!',
					status: 'success',
					duration: 5000,
					isClosable: true
				});
				setRegisterState({
					...registerState,
					redirect: true
				});
			})
			.catch((err) => {
				if (!err.response)
					return toast({
						position: 'top',
						variant: 'subtle',
						title: 'Network error!',
						description: 'There is a problem with your network!',
						status: 'error',
						duration: 9000,
						isClosable: true
					});
				if (err.response.status === 500)
					return toast({
						position: 'top',
						variant: 'subtle',
						title: 'Server Error',
						description: 'There was a problem signing up!',
						status: 'error',
						duration: 9000,
						isClosable: true
					});
			});
		setRegisterState({
			...registerState,
			isLoading: false
		});
	};

	if (localStorage.getItem('token') || sessionStorage.getItem('token')) return <Redirect to='/' />;
	if (registerState.redirect) return <Redirect to='/' />;

	return (
		<div
			className='min-h-screen flex flex-col justify-center items-center font-poppins px-2'
			style={{ backgroundColor: '#F7F4F7' }}
		>
			<div className='text-center'>
				<p className='font-bold text-2xl my-2'>Create an account</p>
				<p className='mb-3'>
					create an account to use this expense tracker app.
					<br /> its totally free :)
				</p>
			</div>
			<form className='max-w-sm mx-auto' onSubmit={(e) => handleSubmit(e)}>
				<input
					type='text'
					placeholder='Enter name: '
					className={`${inputStyle}`}
					value={registerState.name}
					onChange={(e) => handleChange(e, 'name')}
				/>
				<input
					type='email'
					placeholder='Enter email: '
					className={`${inputStyle}`}
					value={registerState.email}
					onChange={(e) => handleChange(e, 'email')}
				/>
				<input
					type='password'
					placeholder='Enter password: '
					className={`${inputStyle}`}
					value={registerState.password}
					onChange={(e) => handleChange(e, 'password')}
				/>
				<label className='flex items-center'>
					<input
						type='checkbox'
						className='w-5 h-5'
						checked={registerState.rememberMe}
						onChange={(e) =>
							setRegisterState({
								...registerState,
								rememberMe: e.currentTarget.checked
							})
						}
					/>
					<span className='pl-2'>Remember me?</span>
				</label>
				{registerState.isLoading ? (
					<div className='w-full flex justify-center my-6'>
						<LoadingOutlined style={{ fontSize: 30 }} />
					</div>
				) : (
					<button
						className='px-3 py-3 w-full text-gray-50 my-5 hover:shadow-xl'
						style={{ backgroundColor: '#42224A' }}
					>
						Sign me up!
					</button>
				)}
			</form>
			<p>
				<Link to='/login' style={{ color: 'blue' }}>
					Login
				</Link>{' '}
				if you already have an account
			</p>
		</div>
	);
}
