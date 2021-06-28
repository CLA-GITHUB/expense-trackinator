import { BrowserRouter as Switch, Route } from 'react-router-dom';
import MainHomePage from './components/MainHomePage';
import Signup from './components/Signup';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import { GlobalContextProvider } from './contexts/GlobalContext';
function App() {
	return (
		<GlobalContextProvider>
			<MainLayout>
				<Switch>
					<Route path='/' component={MainHomePage} exact />
					<Route path='/signup' component={Signup} />
					<Route path='/login' component={Login} />
				</Switch>
			</MainLayout>
		</GlobalContextProvider>
	);
}

export default App;
