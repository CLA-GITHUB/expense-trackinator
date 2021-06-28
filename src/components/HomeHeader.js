import React, { useState, useContext } from 'react';
import { LogoutOutlined, LoadingOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import { GlobalContext } from '../contexts/GlobalContext';
export default function HomeHeader() {
	const [redirect, setRedirect] = useState(false);
	const [loading, setLoading] = useState(false);

	const { state } = useContext(GlobalContext);
	const { name } = state.user;
	if (redirect) return <Redirect to='/login' />;
	return (
		<div className='flex flex-wrap justify-between px-3 mb-5 pt-3 items-center'>
			<p className='text-4xl w-1/2'>
				Hello, <br /> <span className='font-extrabold text-4xl'>{name}</span>{' '}
			</p>
			{loading ? (
				<LoadingOutlined style={{ fontSize: 30 }} />
			) : (
				<LogoutOutlined
					style={{ fontSize: 30 }}
					onClick={() => {
						setLoading(true);
						if (localStorage.token) {
							localStorage.removeItem('token');
							localStorage.removeItem('user');
						}
						if (sessionStorage.token) {
							sessionStorage.removeItem('token');
							sessionStorage.removeItem('user');
						}
						setLoading(false);
						setRedirect(true);
					}}
				/>
			)}
		</div>
	);
}
