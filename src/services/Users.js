import ZUMI_Api from './ZUMI_Api';
import { successResponse, failedResponse } from './Base';
import _ from 'lodash';

export async function authenticateUser(credentials) {

	if (!_.isEmpty(credentials)) {
		let payload;
		await ZUMI_Api({
			method: 'post',
			url: '/users/login',
			data: credentials
		}).then((response) => {
			payload = successResponse(response.data);
		}).catch((error) => {
			if (error.response) {
				payload = failedResponse(error.response.data);
			} else {
				payload = failedResponse({ error: error.message });
			}
		});
		return payload;
	} else {
		return failedResponse({ error: "Could not process your request, please reload the page and try again" });
	}
}

export async function userLogout() {

	let payload;
	await ZUMI_Api({
		method: 'post',
		url: '/users/logout',
		data: {}
	}).then((response) => {
		payload = successResponse({});
	}).catch((error) => {
		if (error.response) {
			payload = failedResponse(error.response.data);
		} else {
			payload = failedResponse({ error: error.message });
		}
	});
	return payload;
}