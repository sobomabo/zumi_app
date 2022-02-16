import ZUMI_Api from './ZUMI_Api';
import { successResponse, failedResponse } from './Base';
import _ from 'lodash';

export async function addProduct(postData) {
	if (!_.isEmpty(postData)) {
		let payload;
		await ZUMI_Api({
			method: 'post',
			url: '/products',
			data: postData
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

export async function getProducts(postData) {
	if (!_.isEmpty(postData)) {
		let payload;
		const productId = postData.id ? "/"+postData.id : "";
		await ZUMI_Api({
			method: 'get',
			url: '/products'+productId,
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

export async function updateProducts(postData) {
	if (!_.isEmpty(postData)) {
		let payload;
		const productId = postData.id ? "/"+postData.id : "";
		delete postData.id; // remove id from postdata, to prevent corruption
		await ZUMI_Api({
			method: 'post',
			url: '/products'+productId,
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

export async function deleteProducts(postData) {
	if (!_.isEmpty(postData)) {
		let payload;
		const productId = postData.id ? "/"+postData.id : "";
		await ZUMI_Api({
			method: 'delete',
			url: '/products'+productId
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