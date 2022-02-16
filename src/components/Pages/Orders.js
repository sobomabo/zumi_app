import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { MDBBreadcrumb, MDBBreadcrumbItem, MDBTable, MDBTableBody, MDBTableHead, MDBBtn, MDBPagination, MDBPageItem, MDBPageNav, MDBTypography, MDBRow } from 'mdbreact';
import { getOrders } from '../../services/Orders';
import Skeleton from 'react-loading-skeleton';
import { humanizeDateTime } from '../../utils/helpers';
import { BsSearch } from 'react-icons/bs';

export default function Orders({ sessionUserData, setActivePage, setSessionEnded }) {

	const [fetchingOrders, setFetchingOrders] = useState(false);
	const [ordersData, setOrdersData] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [searchValue, setSearchValue] = useState("");

	useEffect(() => {
		setActivePage("orders");
		fetchOrders();
	}, []);


	const fetchOrders = async (reqParams={}) => {
		setFetchingOrders(true);
		let reqPayload = {
			...reqParams,
			vendor: sessionUserData._id
		}
			
		const fetchResult = await getOrders(reqPayload);
		if (!_.isEmpty(fetchResult) && fetchResult.success && !_.isEmpty(fetchResult.data) && !_.isEmpty(fetchResult.data.results)) {
			// set current page state
			setCurrentPage(Number(fetchResult.data.page));
			// set pagination pages state
			setTotalPages(Number(fetchResult.data.totalPages));
			// set order data state
			setOrdersData(fetchResult.data.results);
		} else if (_.has(fetchResult, 'errors') && _.has(fetchResult.errors, 'session')) {
			// show session ended modal
			setSessionEnded(true);
		}
		setFetchingOrders(false);
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

		fetchOrders({search: val});
	}, [searchValue]);

	return (
		<div>
			<div className="w-100">
				<MDBBreadcrumb style={{ backgroundColor: "transparent", padding: "15px 0px" }}>
					<MDBBreadcrumbItem><Link to="/" className="linkStyle">Home</Link></MDBBreadcrumbItem>
					<MDBBreadcrumbItem active>Orders</MDBBreadcrumbItem>
				</MDBBreadcrumb>
			</div>
			{/* page heading */}
			<h2 className="pageTitle">Orders</h2>
			{/* search box */}
			<div className="headerSearch d-flex py-3">
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
						<th>Order Number</th>
						<th>Customer Name</th>
						<th>Customer Address</th>
						<th>Status</th>
						<th>Last Updated</th>
						<th></th>
					</tr>
				</MDBTableHead>
				{!fetchingOrders && (!_.isEmpty(ordersData)) && <MDBTableBody>
					{!_.isEmpty(ordersData) && ordersData.map((order, idx) => (<tr key={idx}>
						<td>{idx + 1}</td>
						<td>{(_.has(order, 'orderNumber') && !_.isEmpty(order.orderNumber)) ? order.orderNumber : ""}</td>
						<td>{(_.has(order, 'customerName') && !_.isEmpty(order.customerName)) ? order.customerName : ""}</td>
						<td>{(_.has(order, 'customerAddress') && !_.isEmpty(order.customerAddress)) ? order.customerAddress : ""}</td>
						<td>
							<strong>
								<MDBTypography colorText={(_.has(order, 'status') && !_.isEmpty(order.status)) ? (order.status === 'Delivered' ? 'light-green' : (order.status === 'Pending' ? 'amber' : 'red')) : ""}>
									{(_.has(order, 'status') && !_.isEmpty(order.status)) ? order.status : ""}
								</MDBTypography>
							</strong>
						</td>
						<td>{(_.has(order, 'updatedAt') && !_.isEmpty(order.updatedAt)) ? humanizeDateTime(order.updatedAt) : ""}</td>
						<td>
							<Link to={`/order/${order.id}`}>
								<MDBBtn color="primary" size="sm">Open</MDBBtn>
							</Link>
						</td>
					</tr>))}
				</MDBTableBody>}
			</MDBTable>
			{!fetchingOrders && (!_.isEmpty(ordersData)) && <MDBPagination className="mb-5">
				<MDBPageItem disabled={currentPage === 1}>
					<MDBPageNav aria-label="Previous" onClick={() => fetchOrders({page: currentPage - 1})}>
						<span aria-hidden="true" >Previous</span>
					</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem disabled={true}style={{ display: (currentPage - 2) > 1 ? 'list-item': 'none' }}>
					<MDBPageNav>
						<span>...</span>
					</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem style={{ display: (currentPage - 2) > 0 ? 'list-item': 'none' }}>
					<MDBPageNav onClick={() => fetchOrders({page: currentPage - 2})}>{currentPage - 2}</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem style={{ display: (currentPage - 1) > 0 ? 'list-item': 'none' }}>
					<MDBPageNav onClick={() => fetchOrders({page: currentPage - 1})}>{currentPage - 1}</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem active>
					<MDBPageNav onClick={() => fetchOrders({page: currentPage})}>
						{currentPage}<span className="sr-only">(current)</span>
					</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem style={{ display: (currentPage + 1) <= totalPages ? 'list-item': 'none' }}>
					<MDBPageNav onClick={() => fetchOrders({page: currentPage + 1})}>{currentPage + 1}</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem style={{ display: (currentPage + 2) <= totalPages ? 'list-item': 'none' }}>
					<MDBPageNav onClick={() => fetchOrders({page: (currentPage + 2)})}>{currentPage + 2}</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem disabled={true}style={{ display: (currentPage + 2) < totalPages ? 'list-item': 'none' }}>
					<MDBPageNav>
						<span>...</span>
					</MDBPageNav>
				</MDBPageItem>
				<MDBPageItem disabled={currentPage === totalPages}>
					<MDBPageNav aria-label="Next" onClick={() => fetchOrders({page: currentPage + 1})}>
						<span aria-hidden="true">Next</span>
					</MDBPageNav>
				</MDBPageItem>
			</MDBPagination>}
			{!fetchingOrders && _.isEmpty(ordersData) && <div className="w-100 p-5 mt-5">
				<p className='d-block w-100 bq-title text-center' style={{ fontSize: "18px", color: "#ddd" }}>
					No Orders found
				</p>
			</div>}
			{fetchingOrders && <div>
				<Skeleton count={5} />
			</div>}
		</div>
	);
}
