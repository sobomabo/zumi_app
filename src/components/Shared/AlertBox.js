import React, { useEffect } from 'react';
import ReactHtmlParser from 'html-react-parser';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact';

export default function AlertBox({ showAlertModal, setShowAlertModal, title, message }) {


	const toggleModal = () => {
		setShowAlertModal(false);
	}
	
	return (
		<>
			{showAlertModal &&
				<MDBModal isOpen={showAlertModal} toggle={toggleModal} backdrop={true} keyboard={false} backdropClassName="static" >
					<MDBModalHeader className='text-center w-100'>{title ? ReactHtmlParser(title) : ""}</MDBModalHeader>
					<MDBModalBody className='text-center'>{message ? ReactHtmlParser(message) : ""}</MDBModalBody>
					<MDBModalFooter className='text-center'>
						<MDBBtn color='primary' onClick={toggleModal}>Ok</MDBBtn>
					</MDBModalFooter>
				</MDBModal>
			}
		</>
	);
}