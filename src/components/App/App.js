import React, { useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import useSession from '../../customHooks/useSession';
import './App.css';
import Login from '../Auth/Login';
import Products from '../Pages/Products';
import Orders from '../Pages/Orders';
import Product from '../Pages/Product';
import Order from '../Pages/Order';
import Header from '../Layouts/Header/Header';
import Sidebar from '../Layouts/Sidebar/Sidebar';
import LogoutOverlay from '../Shared/LogoutOverlay';

export default function App() {
	const { session, setSession } = useSession();
	const [activePage, setActivePage] = useState();
	const [sessionEnded, setSessionEnded] = useState(false);


	if (!session) {
		return (
			<BrowserRouter>
				<Switch>
					<Route path="/">
						<Login setSession={setSession} />
					</Route>
				</Switch>
			</BrowserRouter>
		);
	} else {

		return (
			<BrowserRouter>
				<div className="appWrapper d-flex flex-column">
					<Header sessionUserData={session} />
					<div className="flex-grow-1 appBody  d-flex flex-row">
						<Sidebar sessionUserData={session} activePage={activePage} />
						<div className="pageBody flex-grow-1">
							<Switch>
								<Route path="/products">
									<Products sessionUserData={session} setActivePage={setActivePage} setSessionEnded={setSessionEnded} />
								</Route>
								<Route path="/orders">
									<Orders sessionUserData={session} setActivePage={setActivePage} setSessionEnded={setSessionEnded} />
								</Route>
								<Route path="/product/:productId?">
									<Product sessionUserData={session} setActivePage={setActivePage} setSessionEnded={setSessionEnded} />
								</Route>
								<Route path="/order/:orderId?">
									<Order sessionUserData={session} setActivePage={setActivePage} setSessionEnded={setSessionEnded} />
								</Route>
								<Route path="/">
									<Redirect to="/orders" /> : <Orders sessionUserData={session} setActivePage={setActivePage} setSessionEnded={setSessionEnded} />
								</Route>
							</Switch>
						</div>
					</div>
					<LogoutOverlay showSessionModal={sessionEnded} />
				</div>
			</BrowserRouter>
		);
	}
}

