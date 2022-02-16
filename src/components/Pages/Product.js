import React, { useState, useEffect } from 'react';
import _, { set } from 'lodash';
import ReactHtmlParser from 'html-react-parser';
import { Link, Redirect } from 'react-router-dom';
import { MDBRow, MDBBreadcrumb, MDBBreadcrumbItem, MDBCol, MDBContainer, MDBBtn } from 'mdbreact';
import { Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { addProduct, deleteProducts, getProducts, updateProducts } from '../../services/Products';
import Skeleton from 'react-loading-skeleton';
import ConfirmBox from '../Shared/ConfirmBox';

export default function Product({ sessionUserData, setActivePage, setSessionEnded }) {
	// define form state
	const [productData, setProductData] = useState({});
	// deefine errors state
	const [errors, setErrors] = useState({});
	// define submitting form state
	const [submittingForm, setSubmittingForm] = useState(false);
	// define fetching product data state
	const [fetchingProductData, setFetchingProductData] = useState(false);
	// define form valid state
	const [formValid, setFormValid] = useState(false);
	// define redirection state
	const [shouldRedirect, setShouldRedirect] = useState(false);
	// define show success message state
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	// define success message state
	const [successMessage, setSuccessMessage] = useState("");
	// set show confirm modal state
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	// get product ID from url if available
	const { productId } = useParams();

	// product form validator
	const validateForm = async (formData) => {
		const formErrors = {};
		// iterate over each field in the product data
		for (const field in formData) {
			switch (field) {
				case 'sku':
					if (_.isEmpty(formData[field])) {
						formErrors.sku = 'The product ID is required';
					} else if (!_.isEmpty(formErrors.sku)) {
						delete formErrors.sku;
					}
					break;
				case 'name':
					if (_.isEmpty(formData[field])) {
						formErrors.name = 'The product name is required';
					} else if (!_.isEmpty(formErrors.name)) {
						delete formErrors.name;
					}
					break;
				case 'brand':
					if (_.isEmpty(formData[field])) {
						formErrors.brand = 'The product brand is required';
					} else if (!_.isEmpty(formErrors.brand)) {
						delete formErrors.brand;
					}
					break;
				case 'price':
					if (_.isEmpty(formData[field])) {
						formErrors.price = 'The product price is required';
					} else if (!_.isEmpty(formErrors.price)) {
						delete formErrors.price;
					}
					break;
				case 'quantity':
					if (_.isEmpty(formData[field])) {
						formErrors.quantity = 'The product quantity is required';
					} else if (!_.isEmpty(formErrors.quantity)) {
						delete formErrors.quantity;
					}
					break;
				default:
					break;
			}
		};
		
		if(_.isEmpty(formErrors)){
			// set form valid state
			setFormValid(true);
		}
		// set errors state
		setErrors(formErrors);
	}

	// handle form field changes
	const handleChange = (event) => {
		event.preventDefault();
		const { name, value } = event.target;
		setProductData({ ...productData, [name]: value });
	}

	// run form validation when a product form field changes
	useEffect(() => {
		if(!_.isEmpty(productData))
			validateForm(productData);
	}, [productData]);
	
	// set products as the active nav item
	useEffect(() => {
		setActivePage("products");
	}, []);
	
	// get product infor if productId is available
	useEffect(() => {
		if(!_.isEmpty(productId))
			fetchProductData(productId);
	}, [productId]);

	
	// submit product form
	const handleSubmit = async e => {
		e.preventDefault();
		setSubmittingForm(true);

		const formData = { 
			sku: "",
			name: "",
			brand: "",
			price: 0,
			quantity: 0,
			...productData 
		}
		
		setProductData(formData);

		if (_.isEmpty(errors) && formValid) {
			
			let result;
			if(productId){
				result = await updateProducts({
					name: formData.name,
					brand: formData.brand,
					price: formData.price,
					quantity: formData.quantity,
					id: productId,
					vendor: sessionUserData._id
				});
			}else{
				result = await addProduct({
					...formData,
					vendor: sessionUserData._id
				});
			}
			if (!_.isEmpty(result) && result.success && !_.isEmpty(result.data)) {
				let counter = 0;
				if(productId){
					// show update product success message
					setSuccessMessage("Product updated successfully.");
					// hide success message after 3 seconds
					counter = setTimeout(() => {
						setShowSuccessMessage(false);
					}, 3000);
					setSubmittingForm(false);
				}else{
					// show add product success message
					setSuccessMessage("Product added successfully.");
					// redirect to the login page after 3 seconds
					counter = setTimeout(() => {
						setShouldRedirect(true);
					}, 3000);
				}
				setShowSuccessMessage(true);
				return () => clearTimeout(counter);

			} else {
				if (_.has(result, 'errors'))
					if(_.has(result.errors, 'session')) {
						// show session ended modal
						setSessionEnded(true);
					}else{
						// handle request server error error message
						const reqErrors = result.errors ? result.errors : errors
						setErrors(reqErrors);
					}

			}
		}
		setSubmittingForm(false);
	}

	// fetch product data
	const fetchProductData = async (productId) => {
		setFetchingProductData(true);
		if(!_.isEmpty(productId)){
			const fetchResult = await getProducts({id: productId});
			if (!_.isEmpty(fetchResult) && fetchResult.success && !_.isEmpty(fetchResult.data)) {
				// set order product data state
				setProductData(fetchResult.data);
			} else {
				if (_.has(fetchResult, 'errors'))
					if(_.has(fetchResult.errors, 'session')) {
						// show session ended modal
						setSessionEnded(true);
					}else{
						// handle registration server error error message
						const reqErrors = fetchResult.errors ? fetchResult.errors : errors
						setErrors(reqErrors);
					}
			}
		}
		setFetchingProductData(false);
	}

	// soft delete product
	const handleDeleteProduct = async () => {
		setSubmittingForm(true);
		if (!_.isEmpty(productId)) {
			
			const result = await deleteProducts({
				id: productId,
				vendor: sessionUserData._id
			});
			let counter = 0;
			if (!_.isEmpty(result) && result.success && result.data) {
				// show deletion success message
				setSuccessMessage("Product deleted successfully.");
				setShowSuccessMessage(true);
				// hide set redirect to true after 3 seconds
				counter = setTimeout(() => {
					setShouldRedirect(true);
				}, 3000);
			} else {
				if (_.has(result, 'errors'))
					if(_.has(result.errors, 'session')) {
						// show session ended modal
						setSessionEnded(true);
					}else{
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
			return () => clearTimeout(counter);
		}
		setSubmittingForm(false);
	}

	const toggleConfirmBoxVisibility = () => {
		setShowConfirmModal(!showConfirmModal);
	}

	// if redirect state changes to true, redirect to the products page
	if (shouldRedirect) return <Redirect to="/products" />

	return (
		<div>
			<div className="w-100">
				<MDBBreadcrumb style={{ backgroundColor: "transparent", padding: "15px 0px" }}>
					<MDBBreadcrumbItem><Link to="/" className="linkStyle">Home</Link></MDBBreadcrumbItem>
					<MDBBreadcrumbItem><Link to="/products" className="linkStyle">Products</Link></MDBBreadcrumbItem>
					<MDBBreadcrumbItem active>{productId ? "Update" : "Create" }</MDBBreadcrumbItem>
				</MDBBreadcrumb>
			</div>
			{/* page heading */}
			<h2 className="pageTitle">{productId ? "Update" : "Create" } Product</h2>
			<div className="w-100 py-5 mt-5">
				<MDBContainer>
					<MDBRow center>
						<MDBCol md="6" >
							{showSuccessMessage && successMessage !== "" &&
								<Alert className="text-center" variant="success">
									{successMessage}
								</Alert>
							}
							{ errors.error && 
								<Alert className="text-center" variant="danger">
									{errors.error}
								</Alert>
							}
							{!fetchingProductData && <form onSubmit={handleSubmit}>
								<MDBRow >
									<MDBCol md="12">
										<label htmlFor="sku" className="grey-text">
											SKU
										</label>
										<input type="text" id="sku" name="sku" className="form-control" onChange={handleChange} value={(_.has(productData, 'sku') && !_.isEmpty(productData.sku)) ? ReactHtmlParser(productData.sku) : ""} disabled={(_.has(productData, 'sku') && !_.isEmpty(productData.sku))}/>
										{!_.isUndefined(errors) && !_.isEmpty(errors.sku) && <span className='error red-text'>{ReactHtmlParser(errors.sku)}</span>}
									</MDBCol>
								</MDBRow>
								<br />
								<MDBRow >
									<MDBCol md="12">
										<label htmlFor="name" className="grey-text">
											Name
										</label>
										<input type="text" id="name" name="name" className="form-control" onChange={handleChange} value={(_.has(productData, 'name') && !_.isEmpty(productData.name)) ? ReactHtmlParser(productData.name) : ""} />
										{!_.isUndefined(errors) && !_.isEmpty(errors.name) && <span className='error red-text'>{ReactHtmlParser(errors.name)}</span>}
									</MDBCol>
								</MDBRow>
								<br />
								<MDBRow >
									<MDBCol md="12">
										<label htmlFor="brand" className="grey-text">
											Brand
										</label>
										<input type="text" id="brand" name="brand" className="form-control" onChange={handleChange} value={(_.has(productData, 'brand') && !_.isEmpty(productData.brand)) ? ReactHtmlParser(productData.brand) : ""} />
										{!_.isUndefined(errors) && !_.isEmpty(errors.brand) && <span className='error red-text'>{ReactHtmlParser(errors.brand)}</span>}
									</MDBCol>
								</MDBRow>
								<br />
								<MDBRow >
									<MDBCol md="12">
										<label htmlFor="price" className="grey-text">
											Price
										</label>
										<input type="number" min="0.00" className="form-control" step="0.01" id='price' name='price' onChange={handleChange} style={{display: "inline"}} value={(_.has(productData, 'price') && !_.isEmpty(productData.price)) ? ReactHtmlParser(productData.price) : ""} />
										{!_.isUndefined(errors) && !_.isEmpty(errors.price) && <span className='error red-text'>{ReactHtmlParser(errors.price)}</span>}
									</MDBCol>
								</MDBRow>
								<br />
								<MDBRow >
									<MDBCol md="12">
										<label htmlFor="quantity" className="grey-text">
											Quantity
										</label>
										<input type="number" min="0" step="1"id="quantity" className="form-control" name="quantity" onChange={handleChange} value={(_.has(productData, 'quantity') && !_.isEmpty(productData.quantity)) ? ReactHtmlParser(productData.quantity) : ""} />
										{!_.isUndefined(errors) && !_.isEmpty(errors.quantity) && <span className='error red-text'>{ReactHtmlParser(errors.quantity)}</span>}
									</MDBCol>
								</MDBRow>
								<br />
								<MDBRow >
									<MDBCol md="12">
										<div className="text-center mt-4">
											{!_.isEmpty(productId) && <MDBBtn color="danger" type="button" onClick={toggleConfirmBoxVisibility} disabled={submittingForm}>
												Delete Product
											</MDBBtn>}
											<MDBBtn color="primary" type="submit" disabled={submittingForm}>
											{!_.isEmpty(productId) ? 'Update' : 'Add' } Product
											</MDBBtn>
										</div>
									</MDBCol>
								</MDBRow>
							</form>}
							{fetchingProductData && <div>
								<Skeleton count={5} />
							</div>}
						</MDBCol>
					</MDBRow>
				</MDBContainer>
			</div>
			<ConfirmBox showConfirmModal={showConfirmModal} setShowConfirmModal={setShowConfirmModal} title="Heads-Up!" message={`Are you sure you want to delete the product<br/>"<strong>${productData.name}</strong>"`} confirmCallback={handleDeleteProduct} />
		</div>
	);
}
