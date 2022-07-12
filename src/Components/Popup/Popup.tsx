import React from "react";
import { Button, Modal } from "react-bootstrap";
import "./popup.module.scss";
type Props = {
  open: boolean;
  validateEmail: any;
  closeModal: any;
  editDetails: any;
  saveChanges: any;
  onChangeEditDetails: any;
};

const Popup = (props: Props) => {
  const {
    open,
    closeModal,
    editDetails,
    saveChanges,
    onChangeEditDetails,
    validateEmail,
  } = props;
  return (
    <Modal
      className="model-container"
      show={open}
      onHide={closeModal}
      backdrop="static"
    >
      <Modal.Header className="model-background" closeButton>
        <Modal.Title>
          Edit Employee ID:<span>{editDetails.id}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="model-background">
        <label>
          <span className="font-bold mr-5 text-gray-600">NAME :</span>
          <input
            type="text"
            required={true}
            value={editDetails.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChangeEditDetails({
                name: event.target.value,
              });
            }}
          />
        </label>
        {editDetails.name === "" && (
          <span className="text-red-800">*required</span>
        )}
        <br />
        <label>
          <span className="font-bold mr-5 text-gray-600">EMAIL :</span>
          <input
            type="text"
            required={true}
            value={editDetails.email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChangeEditDetails({
                email: event.target.value,
              });
            }}
          />
        </label>
        {!validateEmail(editDetails.email) && (
          <span className="text-red-800">*required</span>
        )}
        <br />
        <label>
          <span className="font-bold mr-7 text-gray-600">ROLE :</span>
          <select
            name="role"
            id="role"
            value={editDetails.role}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              onChangeEditDetails({
                role: event.target.value,
              });
            }}
          >
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
        </label>
      </Modal.Body>
      <Modal.Footer className="model-background">
        <Button variant="warning" onClick={saveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Popup;
