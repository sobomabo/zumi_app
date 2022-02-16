import React, { useState, useEffect } from 'react';
import _, { set } from 'lodash';
import ReactHtmlParser from 'html-react-parser';
import { Link } from 'react-router-dom';
import { MDBRow, MDBBreadcrumb, MDBBreadcrumbItem, MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBCol, MDBTypography, MDBBtn, MDBModal, MDBModalBody } from 'mdbreact';
import { getOrders, updateOrders } from '../../services/Orders';
import AlertBox from '../Shared/AlertBox';
import { humanizeDateTime } from '../../utils/helpers';
import { Alert } from 'react-bootstrap';
import ConfirmBox from '../Shared/ConfirmBox';
import { useParams } from 'react-router-dom';

export default function Order({ sessionUserData, setActivePage, setSessionEnded }) {

	// define form state
	const [orderData, setOrderData] = useState({});
	// deefine errors state
	const [errors, setErrors] = useState({});
	// define submitting form state
	const [submittingForm, setSubmittingForm] = useState(false);
	// define fetching order data state
	const [fetchingOrderData, setFetchingOrderData] = useState(false);
	// define show success message state
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	// set show confirm modal state
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	// define success message state
	const [alertMessage, setAlertMessage] = useState("");
	// set show alert modal state
	const [showAlertModal, setShowAlertModal] = useState(false);
	// set show alert modal state
	const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
	// set show alert modal state
	const [cancelReason, setCancelReason] = useState("");

	// get order ID from url if available
	const { orderId } = useParams();

	// fetch order info
	const fetchOrderData = async (orderId) => {
		setFetchingOrderData(true);
		if (!_.isEmpty(orderId)) {
			const fetchResult = await getOrders({ id: orderId });
			console.log(fetchResult);
			if (!_.isEmpty(fetchResult) && fetchResult.success && !_.isEmpty(fetchResult.data)) {
				// set order order data state
				setOrderData(fetchResult.data);
			} else {
				if (_.has(fetchResult, 'errors'))
					if (_.has(fetchResult.errors, 'session')) {
						// show session ended modal
						setSessionEnded(true);
					} else {
						// handle registration server error error message
						const reqErrors = fetchResult.errors ? fetchResult.errors : errors;
						setAlertMessage(reqErrors.error);
						setShowAlertModal(true);
					}
			}
		} else {
			setAlertMessage("Order not found<br/>click the button below to go back to the list");
			setShowAlertModal(true)
		}
		setFetchingOrderData(false);
	}
	
	// handle form field changes
	const handleCancelFieldChange = (event) => {
		event.preventDefault();
		const { value } = event.target;
		setCancelReason(value);
	}

	// get order info if order id is provided
	useEffect(() => {
		if (!_.isEmpty(orderId))
			fetchOrderData(orderId);
	}, [orderId]);

	// set the order page as the active page
	useEffect(() => {
		setActivePage("orders");
	}, []);

	// show the confirmation box
	const toggleConfirmBoxVisibility = () => {
		setShowConfirmModal(true);
	}

	// show the cancel reason modal box
	const toggleShowCancelReasonModal = () => {
		setShowConfirmModal(false);
		setShowCancelReasonModal(true);
	}

	const handleOrderStatusChange = async (status) => {
		setSubmittingForm(true);
		if (!_.isEmpty(orderId) && !_.isEmpty(status) && ((status === 'Canceled' && !_.isEmpty(cancelReason)) || status === 'Delivered')) {

			let postData = {
				id: orderId,
				status: status,
				vendor: sessionUserData._id
			}

			if (status === 'Canceled' && !_.isEmpty(cancelReason))
				postData.cancelReason = cancelReason;

			const result = await updateOrders(postData);
			let counter = 0;
			if (!_.isEmpty(result) && result.success && result.data) {
				setOrderData(result.data)
				// show deletion success message
				setShowSuccessMessage(true);
				// hide set redirect to true after 3 seconds
				counter = setTimeout(() => {
					setShowSuccessMessage(false);
				}, 3000);
			} else {
				if (_.has(result, 'errors'))
					if (_.has(result.errors, 'session')) {
						// show session ended modal
						setSessionEnded(true);
					} else {
						// handle registration server error error message
						const reqErrors = result.errors ? result.errors : errors
						setErrors(reqErrors);
						// hide set redirect to true after 3 seconds
						counter = setTimeout(() => {
							setErrors({});
						}, 3000);
					}

			}
			setShowConfirmModal(false);
			setShowCancelReasonModal(false);
			return () => clearTimeout(counter);
		} else {
			if (_.isEmpty(cancelReason)) {
				setErrors({
					reason: "Please provide a reason for cancelling this order"
				});
			}
		}
		setSubmittingForm(false);
	}

	return (
		<div>
			<div className="w-100">
				<MDBBreadcrumb style={{ backgroundColor: "transparent", padding: "15px 0px" }}>
					<MDBBreadcrumbItem><Link to="/" className="linkStyle">Home</Link></MDBBreadcrumbItem>
					<MDBBreadcrumbItem><Link to="/orders" className="linkStyle">Orders</Link></MDBBreadcrumbItem>
					<MDBBreadcrumbItem active>Manage Order</MDBBreadcrumbItem>
				</MDBBreadcrumb>
			</div>
			{/* page heading */}
			<h2 className="pageTitle">Manage Order: {(_.has(orderData, 'orderNumber') && !_.isEmpty(orderData.orderNumber)) ? ReactHtmlParser(orderData.orderNumber) : ""}</h2>
			<div className="w-100 py-5">
				{showSuccessMessage &&
					<Alert className="text-center" variant="success">
						Order updated successfully.
					</Alert>
				}
				{errors.error &&
					<Alert className="text-center" variant="danger">
						{errors.error}
					</Alert>
				}
				{!fetchingOrderData && <MDBContainer>
					<MDBRow center>
						<MDBCol md="12" >
							<MDBTable borderless>
								<MDBTableHead>
									<tr>
										<th scope='col' colSpan="4">
											<h5 className='d-inline w-auto'><strong>Ordered Details: {(_.has(orderData, 'customerName') && !_.isEmpty(orderData.customerName)) ? ReactHtmlParser(orderData.customerName) : ""}</strong></h5>
											{_.has(orderData, 'status') && !_.isEmpty(orderData.status) && orderData.status === 'Delivered' && <h6 className='d-inline float-right w-auto'><strong>Date delivered: {(_.has(orderData, 'deliveryDate') && !_.isEmpty(orderData.deliveryDate)) ? humanizeDateTime(orderData.deliveryDate) : ""}</strong></h6>}
										</th>
									</tr>
								</MDBTableHead>
								<MDBTableBody>
									<tr>
										<th scope='row' className='text-right' colSpan="1"><strong>Order number:</strong></th>
										<td colSpan="2"><strong>{(_.has(orderData, 'orderNumber') && !_.isEmpty(orderData.orderNumber)) ? ReactHtmlParser(orderData.orderNumber) : ""}</strong></td>
									</tr>
									<tr>
										<th scope='row' className='text-right' colSpan="1"><strong>Customer name:</strong></th>
										<td colSpan="3"><strong>{(_.has(orderData, 'customerName') && !_.isEmpty(orderData.customerName)) ? ReactHtmlParser(orderData.customerName) : ""}</strong></td>
									</tr>
									<tr>
										<th scope='row' className='text-right' colSpan="1"><strong>Customer address:</strong></th>
										<td colSpan="3"><strong>{(_.has(orderData, 'customerAddress') && !_.isEmpty(orderData.customerAddress)) ? ReactHtmlParser(orderData.customerAddress) : ""}</strong></td>
									</tr>
									<tr>
										<th scope='row' className='text-right' colSpan="1"><strong>Status:</strong></th>
										<td colSpan="3">
											<MDBTypography colorText={(_.has(orderData, 'status') && !_.isEmpty(orderData.status)) ? (orderData.status === 'Delivered' ? 'light-green' : (orderData.status === 'Pending' ? 'amber' : 'red')) : ""}>
												<strong>{(_.has(orderData, 'status') && !_.isEmpty(orderData.status)) ? ReactHtmlParser(orderData.status) : ""}</strong>
											</MDBTypography>
										</td>
									</tr>
									{_.has(orderData, 'status') && !_.isEmpty(orderData.status) && orderData.status === 'Canceled' && _.has(orderData, 'cancelReason') && !_.isEmpty(orderData.cancelReason) && <tr>
										<th scope='row' className='text-right' colSpan="1"><strong>Reason:</strong></th>
										<td colSpan="3">
											{(_.has(orderData, 'cancelReason') && !_.isEmpty(orderData.cancelReason)) ? ReactHtmlParser(orderData.cancelReason) : ""}
										</td>
									</tr>}
								</MDBTableBody>
								{_.has(orderData, 'orderLines') && !_.isEmpty(orderData.orderLines) && <><MDBTableHead>
									<tr>
										<th scope='row' colSpan="4" ><h5><strong>Products</strong></h5></th>
									</tr>
									<tr>
										<th scope='col' colSpan="1">SKU</th>
										<th scope='col' colSpan="1">Products Name</th>
										<th scope='col' colSpan="1">Price</th>
										<th scope='col' colSpan="1">Quantity</th>
									</tr>
								</MDBTableHead>
									<MDBTableBody>
										{orderData.orderLines.map((orderProduct, idx) => (<tr key={idx}>
											<th scope='row' colSpan="1" className='w-25'>{(_.has(orderProduct, 'sku') && !_.isEmpty(orderProduct.sku)) ? ReactHtmlParser(orderProduct.sku) : ""}</th>
											<td colSpan="1" className='w-25'>{(_.has(orderProduct, 'name') && !_.isEmpty(orderProduct.name)) ? ReactHtmlParser(orderProduct.name) : ""}</td>
											<td colSpan="1" className='w-25'>{(_.has(orderProduct, 'price') && !_.isEmpty(orderProduct.price)) ? ReactHtmlParser(orderProduct.price) : ""}</td>
											<td colSpan="1" className='w-25'>{(_.has(orderProduct, 'quantity') && !_.isEmpty(orderProduct.quantity)) ? ReactHtmlParser(orderProduct.quantity) : ""}</td>
										</tr>))}
									</MDBTableBody></>}
							</MDBTable>
						</MDBCol>
					</MDBRow>
					{_.has(orderData, 'status') && !_.isEmpty(orderData.status) && orderData.status === 'Pending' && <MDBRow >
						<MDBCol md="12">
							<div className="text-center mt-4">
								<MDBBtn color="danger" type="button" onClick={toggleConfirmBoxVisibility} disabled={submittingForm}>
									Cancel order
								</MDBBtn>
								<MDBBtn color="success" onClick={() => handleOrderStatusChange("Delivered")} type="button" disabled={submittingForm}>
									Confirm order
								</MDBBtn>
							</div>
						</MDBCol>
					</MDBRow>}
				</MDBContainer>}
			</div>
			<AlertBox showAlertModal={showAlertModal} setShowAlertModal={setShowAlertModal} title="Error!" message={alertMessage} />
			<ConfirmBox showConfirmModal={showConfirmModal} setShowConfirmModal={setShowConfirmModal} title="Heads-Up!" message={`Are you sure you want to cancel the other <br/>"<strong>${orderData.orderNumber}</strong>"`} confirmCallback={toggleShowCancelReasonModal} />
			{/* cancel reason modal */}
			<MDBModal isOpen={showCancelReasonModal} centered>
				<MDBModalBody>
					<div className="d-block w-100 p-5">
						<MDBRow >
							<MDBCol md="12">
								<label htmlFor="sku" className="grey-text">
									Please provide a reason for cancellinng this order
								</label>
								<textarea type="text" style={{with: "100%", "minHeight": "100px"}} id="reason" name="reason" className="form-control" onChange={handleCancelFieldChange} />
								{!_.isUndefined(errors) && !_.isEmpty(errors.reason) && <span className='error red-text'>{ReactHtmlParser(errors.reason)}</span>}
							</MDBCol>
						</MDBRow>
						<MDBBtn onClick={() => handleOrderStatusChange("Canceled")} color="primary" style={{ display: "block", width: "100%", maxWidth: "150px", margin: "0px auto" }}>Submit</MDBBtn>
					</div>
				</MDBModalBody>
			</MDBModal>
		</div>
	);
}
