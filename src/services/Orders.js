import ZUMI_Api from './ZUMI_Api';
import { successResponse, failedResponse } from './Base';
import _ from 'lodash';

export async function createOder(postData) {
	if (!_.isUndefined(postData)) {
		let payload;
		await ZUMI_Api({
			method: 'post',
			url: '/orders',
			data: postData
		}).then((response) => {
			payload = successResponse(response.data);
		}).catch((error) => {
			if (_.has(error, 'response') && _.has(error.response, 'status') && error.response.status !== 403) {
				if (_.has(error.response, 'data')) {
					payload = failedResponse(error.response.data);
				} else {
					payload = failedResponse({ error: error.message });
				}
			} else {
				payload = failedResponse({ session: "expired" });
			}
		});
		return payload;
	} else {
		return failedResponse({ error: "Could not process your request, please reload the page and try again" });
	}
}

export async function getOrders(postData) {

	if (!_.isEmpty(postData)) {
		let payload;
		const orderId = postData.id ? "/"+postData.id : "";
		await ZUMI_Api({
			method: 'get',
			url: '/orders'+orderId,
			params: postData
		}).then((response) => {
			payload = successResponse(response.data);
		}).catch((error) => {
			if (_.has(error, 'response') && _.has(error.response, 'status') && error.response.status !== 403) {
				if (_.has(error.response, 'data')) {
					payload = failedResponse(error.response.data);
				} else {
					payload = failedResponse({ error: error.message });
				}
			} else {
				payload = failedResponse({ session: "expired" });
			}
		});
		return payload;
	} else {
		return failedResponse({ error: "Could not process your request, please reload the page and try again" });
	}
}

export async function updateOrders(postData) {

	if (!_.isEmpty(postData)) {
		let payload;
		const orderId = postData.id ? "/"+postData.id : "";
		delete postData.id; // remove id from postdata, to prevent corruption
		await ZUMI_Api({
			method: 'post',
			url: '/orders'+orderId,
			data: postData
		}).then((response) => {
			payload = successResponse(response.data);
		}).catch((error) => {
			if (_.has(error, 'response') && _.has(error.response, 'status') && error.response.status !== 403) {
				if (_.has(error.response, 'data')) {
					payload = failedResponse(error.response.data);
				} else {
					payload = failedResponse({ error: error.message });
				}
			} else {
				payload = failedResponse({ session: "expired" });
			}
		});
		return payload;
	} else {
		return failedResponse({ error: "Could not process your request, please reload the page and try again" });
	}
}