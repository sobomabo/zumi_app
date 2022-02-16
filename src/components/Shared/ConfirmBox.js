import React, { useEffect } from 'react';
import ReactHtmlParser from 'html-react-parser';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact';

export default function ConfirmBox({ showConfirmModal, setShowConfirmModal, title, message, confirmCallback }) {


	const toggleModal = () => {
		setShowConfirmModal(false);
	}

	return (
		<>
			{showConfirmModal &&
				<MDBModal isOpen={showConfirmModal} toggle={toggleModal} backdrop={true} keyboard={false}>
					<MDBModalHeader className='text-center w-100'>{title ? ReactHtmlParser(title) : ""}</MDBModalHeader>
					<MDBModalBody className='text-center'>{message ? ReactHtmlParser(message) : ""}</MDBModalBody>
					<MDBModalFooter className='text-center'>
						<MDBBtn color='primary' onClick={() => confirmCallback(true)}>Yes</MDBBtn>
						<MDBBtn color='danger' onClick={toggleModal}>
							No
						</MDBBtn>
					</MDBModalFooter>
				</MDBModal>
			}
		</>
	);
}