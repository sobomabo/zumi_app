import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { MDBRow, MDBBreadcrumb, MDBBreadcrumbItem, MDBTable, MDBTableBody, MDBTableHead, MDBBtn, MDBPagination, MDBPageItem, MDBPageNav } from 'mdbreact';
import { getProducts } from '../../services/Products';
import { humanizeDateTime } from '../../utils/helpers';
import Skeleton from 'react-loading-skeleton';
import { BsSearch } from 'react-icons/bs';

export default function Products({ sessionUserData, setActivePage, setSessionEnded }) {

	const [fetchingProducts, setFetchingProducts] = useState(false);
	const [productsData, setProductsData] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [searchValue, setSearchValue] = useState("");

	useEffect(() => {
		setActivePage("products");
		fetchProducts();
	}, []);

	const fetchProducts = async (reqParams = {}) => {
		setFetchingProducts(true);
		const reqPayload = {
			...reqParams,
			vendor: sessionUserData._id
		}

		const fetchResult = await getProducts(reqPayload);
		if (!_.isEmpty(fetchResult) && fetchResult.success && !_.isEmpty(fetchResult.data) && !_.isEmpty(fetchResult.data.results)) {
			// set current page state
			setCurrentPage(Number(fetchResult.data.page));
			// set pagination pages state
			setTotalPages(Number(fetchResult.data.totalPages));
			// set order data state
			setProductsData(fetchResult.data.results);
		} else if (_.has(fetchResult, 'errors') && _.has(fetchResult.errors, 'session')) {
			// show session ended modal
			setSessionEnded(true);
		}
		setFetchingProducts(false);
	}

	const handleSearchChange = async event  => {
		event.preventDefault();
		let { value } = event.target;
		setSearchValue(value)
	}

	useEffect(() => {
		let val = searchValue.trim();
		if(val.length >= 3)
			val = val;

		fetchProducts({search: val});
	}, [searchValue]);

	return (
		<div>
			<div className="w-100">
				<MDBBreadcrumb style={{ backgroundColor: "transparent", padding: "15px 0px" }}>
					<MDBBreadcrumbItem><Link to="/" className="linkStyle">Home</Link></MDBBreadcrumbItem>
					<MDBBreadcrumbItem active>Products</MDBBreadcrumbItem>
				</MDBBreadcrumb>
			</div>
			{/* page heading */}
			<div style={{ padding: "0px 15px" }}>
				<MDBRow between>
					<h2 className="pageTitle">Products</h2>
					<MDBBtn color="primary" href="/product" >Add Product</MDBBtn>
				</MDBRow>
			</div>
			{/* search box */}
			<div className="headerSearch d-flex pb-3">
				<MDBRow className='w-100'>
					<div className="input-group col-8">
						<input className="form-control" type="text" placeholder="Search" aria-label="Search" onChange={handleSearchChange}/>
						<div className="input-group-append">
							<span className="input-group-text outline" id="basic-text1">
								<BsSearch style={{ fontSize: "14px" }} />
							</span>
						</div>
					</div>
				</MDBRow>
			</div>
			<MDBTable hover responsive>
				<MDBTableHead>
					<tr>
						<th>S/N</th>
						<th>SKU</th>
						<th>Name</th>
						<th>Brand</th>
						<th>Price</th>
						<th>Quantity</th>
						<th>Last updated</th>
						<th></th>
					</tr>
				</MDBTableHead>
				{!fetchingProducts && (!_.isEmpty(productsData)) && <MDBTableBody>
					{!_.isEmpty(productsData) && productsData.map((product, idx) => (<tr key={idx}>
						<td>{idx + 1}</td>
						<td>{(_.has(product, 'sku') && !_.isEmpty(product.sku)) ? product.sku : ""}</td>
						<td>{(_.has(product, 'name') && !_.isEmpty(product.name)) ? product.name : ""}</td>
						<td>{(_.has(product, 'brand') && !_.isEmpty(product.brand)) ? product.brand : ""}</td>
						<td>{(_.has(product, 'price') && !_.isEmpty(product.price)) ? "$" + product.price : ""}</td>
						<td>{(_.has(product, 'quantity') && !_.isEmpty(product.quantity)) ? product.quantity : ""}</td>
						<td>{(_.has(product, 'updatedAt') && !_.isEmpty(product.updatedAt)) ? humanizeDateTime(product.updatedAt) : ""}</td>
						<td>
							<Link to={`/product/${product.id}`}>
								<MDBBtn color="primary" size="sm">Open</MDBBtn>
							</Link>
						</td>
					</tr>))}
				</MDBTableBody>}
			</MDBTable>
			{!fetchingProducts && (!_.isEmpty(productsData)) && <MDBPagination className="mb-5">
				<MDBPageItem disabled={currentPage === 1}>
					<MDBPageNav aria-label="Previous" onClick={() => fetchProducts({ page: currentPage - 1 })}>
						<span aria-hidden="true" >Previous</span>
					</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem disabled={true} style={{ display: (currentPage - 2) > 1 ? 'list-item' : 'none' }}>
					<MDBPageNav>
						<span>...</span>
					</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem style={{ display: (currentPage - 2) > 0 ? 'list-item' : 'none' }}>
					<MDBPageNav onClick={() => fetchProducts({ page: currentPage - 2 })}>{currentPage - 2}</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem style={{ display: (currentPage - 1) > 0 ? 'list-item' : 'none' }}>
					<MDBPageNav onClick={() => fetchProducts({ page: currentPage - 1 })}>{currentPage - 1}</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem active>
					<MDBPageNav onClick={() => fetchProducts({ page: currentPage })}>
						{currentPage}<span className="sr-only">(current)</span>
					</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem style={{ display: (currentPage + 1) <= totalPages ? 'list-item' : 'none' }}>
					<MDBPageNav onClick={() => fetchProducts({ page: currentPage + 1 })}>{currentPage + 1}</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem style={{ display: (currentPage + 2) <= totalPages ? 'list-item' : 'none' }}>
					<MDBPageNav onClick={() => fetchProducts({ page: (currentPage + 2) })}>{currentPage + 2}</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem disabled={true} style={{ display: (currentPage + 2) < totalPages ? 'list-item' : 'none' }}>
					<MDBPageNav>
						<span>...</span>
					</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem disabled={currentPage === totalPages}>
					<MDBPageNav aria-label="Next" onClick={() => fetchProducts({ page: currentPage + 1 })}>
						<span aria-hidden="true">Next</span>
					</MDBPageNav>
				</MDBPageItem>
			</MDBPagination>}
			{!fetchingProducts && _.isEmpty(productsData) && <div className="w-100 p-5 mt-5">
				<p className='d-block w-100 bq-title text-center' style={{ fontSize: "18px", color: "#ddd" }}>
					No Products found
				</p>
			</div>}
			{fetchingProducts && <div>
				<Skeleton count={5} />
			</div>}
		</div>
	);
}
