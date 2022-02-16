import React from 'react';
import { BsPlug, BsOutlet } from "react-icons/bs";
import { MDBBtn, MDBModal, MDBModalBody } from 'mdbreact';
import { userLogout } from '../../services/Users';
import _ from 'lodash';

export default function LogoutOverlay({ showSessionModal }) {

	const logoutSession = async () => {
		await userLogout();
		localStorage.clear();
		window.location.href = '/';
	}

	return (
		<div >
			<MDBModal isOpen={showSessionModal} toggle={() => { }} centered>
				<MDBModalBody>
					<div className="d-block w-100 p-5">
						<h4 className='w-100, text-center'>Ooh!</h4>
						<p className='d-block w-100 bq-title text-center' style={{ fontSize: "14px", color: "#666", marginTop: "30px" }}>
							looks like your session has expired, <br />please sign-in again by clicking the button below.
						</p>
						<MDBBtn onClick={logoutSession} color="primary" style={{ display: "block", width: "100%", maxWidth: "150px", margin: "0px auto"}}>Sign In</MDBBtn>
					</div>
				</MDBModalBody>
			</MDBModal>
		</div>
	);
}