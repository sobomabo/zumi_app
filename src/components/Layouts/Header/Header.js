import React from 'react';
import { Link } from 'react-router-dom';
import { BsSearch, BsPerson, BsCaretDownFill } from "react-icons/bs";
import { MDBContainer, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdbreact';
import _ from 'lodash';
import './Header.css';
import { userLogout } from '../../../services/Users';

export default function Header({ sessionUserData }) {

	const logoutSession = async () => {
		await userLogout();
		localStorage.clear();
		window.location.href = '/';
	}

	return (
		<MDBContainer fluid className="headerContainer d-flex flex-direction-row align-items-center">
			<div className="headerLogo">
				<Link to="/orders" className="linkStyle"><h3>ZUMI App</h3></Link>
			</div>
			<div className="headerIcons flex-grow-1 d-flex justify-content-end px-3">
				<MDBDropdown className="d-table">
					<BsPerson style={{ fontSize: "20px" }} />
					<MDBDropdownToggle tag="i" className="headerProfileToggle">
						{sessionUserData.firstName} {sessionUserData.lastName} <BsCaretDownFill style={{ fontSize: "10px" }} />
					</MDBDropdownToggle>
					<MDBDropdownMenu right basic>
						<MDBDropdownItem><Link to="#" className="linkStyle" onClick={logoutSession}>Logout</Link></MDBDropdownItem>
					</MDBDropdownMenu>
				</MDBDropdown>
			</div>
		</MDBContainer>
	);
}
