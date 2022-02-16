import React from 'react';
import { Link } from 'react-router-dom';
import { BsClockHistory, BsPeople } from "react-icons/bs";
import './Sidebar.css';
import _ from 'lodash';

export default function Sidebar({ sessionUserData, activePage }) {

	return (
		<div className="sidebarContainer">
			<div className="">
				<ul className="list-group list-group-flush">
					<Link to="/orders" className={`linkStyle list-group-item list-group-item-action border-0 ${(!_.isEmpty(activePage) && activePage === 'orders') ? "active" : ""}`}>
						<BsClockHistory style={{ fontSize: "28px" }} className="mr-4" />
						Orders
					</Link>
					<Link to="/products" className={`linkStyle list-group-item list-group-item-action border-0 ${(!_.isEmpty(activePage) && activePage === 'products') ? "active" : ""}`}>
						<BsPeople style={{ fontSize: "28px" }} className="mr-4" />
						Products
					</Link>
				</ul>
			</div>
			<div className="">

			</div>
		</div>
	);
}
