import React, { createContext, useReducer } from 'react';

export const GlobalContext = createContext();
const initialState = {
	transaction: [
		{ id: 1, category: 'Code', amount: -2000, desc: 'Code till i drop' },
		{ id: 2, category: 'Shop', amount: 3000, desc: 'Groceries' },
		{ id: 3, category: 'Pet', amount: -4000, desc: 'Optimax' },
		{ id: 4, category: 'Clothen', amount: 5000, desc: 'Boxers' }
	],
	user: {
		transactions: []
	}
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'ADD_TRANSACTION':
			return {
				...state,
				user: {
					...state.user,
					transactions: action.payload.transactions
				}
			};

		case 'DELETE_TRANSACTION':
			return {
				...state,
				user: {
					...state.user,
					transactions: action.payload.transactions
				}
			};

		case 'SET_USER':
			return {
				...state,
				user: action.payload
			};
		default:
			return { ...state };
	}
};
export const GlobalContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	return <GlobalContext.Provider value={{ state, dispatch }}>{children}</GlobalContext.Provider>;
};
