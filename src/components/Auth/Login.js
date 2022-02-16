import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBModalFooter } from 'mdbreact';
import ReactHtmlParser from 'html-react-parser';
import PropTypes from 'prop-types';
import { authenticateUser } from '../../services/Users';
import _ from 'lodash';

export default function Login({ setSession }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (!_.isEmpty(username) && !_.isEmpty(errors.username)) {
			delete errors.username;
		}
		if (!_.isEmpty(password) && !_.isEmpty(errors.password)) {
			delete errors.password;
		}
	}, [password, username]);

	const handleSubmit = async e => {
		e.preventDefault();
		let err = {};
		// validate username field on change
		if (!_.isUndefined(username) && _.isEmpty(username)) {
			err.username = 'The Username field is required';
		} else if (!_.isEmpty(errors.username)) {
			delete errors.username;
		}
		// validate password field on change
		if (!_.isUndefined(password) && _.isEmpty(password)) {
			err.password = 'The Password field is required';
		} else if (!_.isEmpty(errors.password)) {
			delete errors.password;
		}
		// set errors state
		setErrors(err);

		if (!_.isEmpty(username) && !_.isEmpty(password) && _.isEmpty(errors)) {
			const authResult = await authenticateUser({
				username,
				password
			});
			if (!_.isEmpty(authResult) && authResult.success && !_.isEmpty(authResult.data)) {
				setSession(authResult.data);
			} else {
				// handle auth error message
				let err = authResult.errors ? authResult.errors : errors;
				setErrors(err);
			}
		}
	}
	return (
		<MDBContainer style={{ height: "100%", width: "100%" }}>
			<MDBRow style={{ height: "100%", width: "100%" }}>
				<div className="d-flex align-items-center justify-content-center" style={{ height: "100%", width: "100%" }}>
					<MDBCol md="6">
						<form onSubmit={handleSubmit} noValidate>
							<p className="h4 text-center mb-4">Sign in</p>
							<MDBRow >
								<MDBCol md="12">
									<label htmlFor="username" className="grey-text">
										Username
									</label>
									<input type="text" id="username" name="username" className="form-control" onChange={e => setUsername(e.target.value)} />
									{!_.isUndefined(errors) && !_.isEmpty(errors.username) && <span className='error red-text'>{ReactHtmlParser(errors.username)}</span>}
								</MDBCol>
							</MDBRow>
							<br />
							<MDBRow >
								<MDBCol md="12">
									<label htmlFor="password" className="grey-text">
										Password
									</label>
									<input type="password" id="password" name="password" className="form-control" onChange={e => setPassword(e.target.value)} />
									{!_.isUndefined(errors) && !_.isEmpty(errors.password) && <span className='error red-text'>{ReactHtmlParser(errors.password)}</span>}
								</MDBCol>
							</MDBRow>
							<div className="text-center mt-4">
								<MDBBtn color="primary" type="submit">Submit</MDBBtn>
							</div>
						</form>
					</MDBCol>
				</div>
			</MDBRow>
		</MDBContainer>
	)
}

Login.propTypes = {
	setSession: PropTypes.func.isRequired
}