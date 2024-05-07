import { useState } from "react";
import { Form, Button } from "react-bootstrap";

import get_translation from "../helpers/translation";

export default function FileInput(props) {
  const { onFileUploadResult, onFilesSizeExceeded, onFilesLimitExceeded } =
    props;
  const [isFilesSizeExceeded, setIsFilesSizeExceeded] = useState(false);
  const [isFilesLimitExceeded, setIsFilesLimitExceeded] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const [fileInputs, setFileInputs] = useState([
    {
      fileInput: true,
    },
  ]);

  const isBuild = import.meta.env.DEV !== "build";

  async function uploadFiles() {
    const fileInputs = document.querySelectorAll(".fileInputForm input");
    let filePaths = [];
    let files = [];

    for (let fileInput of fileInputs) {
      if (fileInput.files.length > 0) {
        files.push(fileInput.files[0]);
      }
    }

    if (files.length > 0) {
      let formdata = new FormData();
      let filesValid = true;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formdata.append(`fileFields`, file);
      }

      if (filesValid) {
        try {
          let requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
          };

          const response = await fetch(
            isBuild
              ? "https://help.vertera.org:4444/upload"
              : "http://localhost:4444/upload",
            requestOptions
          );
          const result = await response.json();

          console.log(result);
          filePaths = result.data.map((file) => file.path);
          console.log(filePaths);

          onFileUploadResult(filePaths);
          console.log(filePaths);
          return filePaths;
        } catch (error) {
          console.log("error", error);
          throw error;
        }
      }
    }

    onFileUploadResult(filePaths);
    console.log(filePaths);
    return filePaths;
  }

  const handleAddFileInput = () => {
    if (fileInputs.length >= 5) {
      alert(get_translation("INTERFACE_ERROR_FILES_LIMIT"));
      return;
    }
    setFileInputs(
      fileInputs.concat([
        {
          fileInput: true,
          id: generateUniqueId(),
        },
      ])
    );
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleRemoveFileInput = (idToRemove) => {
    setFileInputs((prevFileInputs) =>
      prevFileInputs.filter((fileInput) => fileInput.id !== idToRemove)
    );
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    let isFileSizeExceeded = false;

    if (files.length > 5) {
      e.target.value = null;
      setIsVisible(true);
      setIsFilesLimitExceeded(true);
      onFilesLimitExceeded(true);
      console.log("Вы можете загрузить не более 5 файлов");
      return;
    }

    Array.from(files).forEach((file) => {
      const fileSizeInMB = file.size / (1024 * 1024);
      const maxFileSize = 10;

      if (fileSizeInMB > maxFileSize) {
        isFileSizeExceeded = true;
      }
    });

    if (isFileSizeExceeded) {
      e.target.value = null;
      setIsVisible(true);
      setIsFilesSizeExceeded(true);
      onFilesSizeExceeded(true);
      console.log("Размер файла не должен превышать 10 МБ");
      return;
    }

    setIsFilesLimitExceeded(false);
    onFilesLimitExceeded(false);
    setIsVisible(false);
  };

  return (
    <>
      <div className="file-inputs">
        {fileInputs.map((fileInput, index) => (
          <Form.Group className="mb-3 fileInputForm" key={fileInput.id}>
            <Form.Control
              type="file"
              accept=".jpg, .jpeg, .png, .gif, .pdf, .txt, .rtf, .doc, .docx, .zip, .rar, .tar"
              onChange={handleFileChange}
            />
            {index > 0 && (
              <Button
                variant="outline-danger"
                onClick={() => handleRemoveFileInput(fileInput.id)}
              >
                {get_translation("INTERFACE_DELETE")}
              </Button>
            )}
          </Form.Group>
        ))}

        <Button
          variant="outline-primary"
          id="AddFileButton"
          onClick={handleAddFileInput}
        >
          {get_translation("INTERFACE_ADD_FILE")}
        </Button>
      </div>
    </>
  );
}
