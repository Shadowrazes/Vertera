import { useState } from "react";
import ThemeDropdowns from "../components/theme-dropdowns";
import FileInput from "../components/file-input";
import ModalDialog from "../components/modal-dialog";

import get_translation from "../helpers/translation";

export default function Test() {
  const [showModal, setShowModal] = useState(false);
  const modalTitle = get_translation("INTERFACE_MESSAGE_CREATION_TICKET");
  const modalBody =
    "Ваше обращение принято в обработку, пожалуйста, ожидайте ответа (срок обработки заявки до 24 часов)";

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    window.location.reload();
  };

  return (
    <>
      <button onClick={handleShowModal}>modal</button>
      <ModalDialog
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
        warning={true}
      />
    </>
  );
}
