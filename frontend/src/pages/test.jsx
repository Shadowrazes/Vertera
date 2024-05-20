import { useState } from "react";
import ThemeDropdowns from "../components/theme-dropdowns";
import FileInput from "../components/file-input";
import ModalDialog from "../components/modal-dialog";
import Logs from "../components/chat_components/logs";
import MessageList from "../components/chat_components/message-list";
import Reaction from "../components/chat_components/reaction";

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

  const data = [
    {
      id: 400,
      text: "<p>dxd</p>\n",
      visibility: 1,
      isActive: 1,
      removable: null,
      attachs: [],
      sender: {
        id: 77,
        name: "Яна",
        surname: "Бахольская",
        patronymic: "Александровна",
        role: "client",
        __typename: "User",
      },
      date: "2024-05-17T04:44:06",
      __typename: "Message",
    },
    {
      id: 401,
      text: "<p>123</p>\n",
      visibility: 1,
      isActive: 1,
      removable: true,
      attachs: [],
      sender: {
        id: 0,
        name: "VERTERA",
        surname: "Система",
        patronymic: null,
        role: "system",
        __typename: "User",
      },
      date: "2024-05-17T09:03:48",
      __typename: "Message",
    },
  ];

  return (
    <>
      {/* <button onClick={handleShowModal}>modal</button>
      <ModalDialog
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
        warning={true}
      /> */}
      <Reaction />
    </>
  );
}
