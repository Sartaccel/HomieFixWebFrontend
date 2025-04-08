import React from "react";
import { Modal, Button } from "react-bootstrap";


const ConfirmationDialog = ({
  show,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const themeColor = "#0076CE";
  const hoverColor = "#005fa3";


  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
      style={{
        zIndex: 1050,
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        style={{
          borderRadius: "7.5px",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        <Modal.Header
          style={{
            background: `linear-gradient(135deg, ${themeColor}, ${hoverColor})`,
            color: "#fff",
            padding: "1rem 1.5rem",
            borderBottom: "none",
          }}
          closeButton
          closeVariant="white"
        >
          <Modal.Title style={{ fontWeight: 600 }}>{title}</Modal.Title>
        </Modal.Header>


        <Modal.Body
          style={{
            padding: "1.8rem",
            fontSize: "1.1rem",
            textAlign: "center",
            backgroundColor: "#fefefe",
            color: "#333",
            fontWeight: "500",
          }}
        >
          {message}
        </Modal.Body>


        <Modal.Footer
          style={{
            backgroundColor: "#fefefe",
            borderTop: "none",
            paddingBottom: "1.5rem",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Button
            variant="outline-secondary"
            onClick={onClose}
            style={{
              padding: "0.6rem 1.5rem",
              borderRadius: "10px",
              fontWeight: "500",
              borderColor: "#ced4da",
              color: "#495057",
              backgroundColor: "#fff",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#f1f1f1";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#fff";
            }}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            style={{
              padding: "0.6rem 1.8rem",
              borderRadius: "10px",
              fontWeight: "500",
              backgroundColor: themeColor,
              borderColor: themeColor,
              color: "#fff",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = hoverColor;
              e.target.style.borderColor = hoverColor;
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = themeColor;
              e.target.style.borderColor = themeColor;
            }}
          >
            {confirmText}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};


export default ConfirmationDialog;


