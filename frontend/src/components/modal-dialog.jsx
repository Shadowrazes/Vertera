import { Button, Modal } from "react-bootstrap";

import get_translation from "../helpers/translation";

function ModalDialog({
  show,
  onClose,
  onConfirm,
  modalTitle,
  modalBody,
  warning,
}) {
  return (
    <>
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalBody}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            {get_translation("INTERFACE_CLOSE")}
          </Button>
          {warning && (
            <Button variant="primary" onClick={onConfirm}>
              {get_translation("INTERFACE_CONTINUE")}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDialog;
