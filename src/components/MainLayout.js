import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';

export default function MainLayout({ children }) {
	const { dispatch } = useContext(GlobalContext);
	useEffect(() => {
		if (localStorage.getItem('user') || sessionStorage.getItem('user')) {
			dispatch({
				type: 'SET_USER',
				payload: localStorage.getItem('user')
					? JSON.parse(localStorage.getItem('user'))
					: JSON.parse(sessionStorage.getItem('user'))
			});
		} else {
			dispatch({
				type: 'SET_USER',
				payload: { transactions: [] }
			});
		}
	}, [dispatch]);
	return <> {children}</>;
}
