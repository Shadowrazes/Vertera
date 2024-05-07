import { useState } from "react";
import { Form } from "react-bootstrap";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";

import { Editor } from "react-draft-wysiwyg";

import get_translation from "../helpers/translation";

export default function TextEditor(props) {
  const { onGetEditorContent } = props;

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);

    const contentState = newEditorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const htmlContent = draftToHtml(rawContent);

    onGetEditorContent(htmlContent);
  };

  return (
    <>
      <Form.Group className="custom-editor">
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          stripPastedStyles
          toolbarStyle={{
            border: "1px solid #dee2e6",
            borderRadius: "6px 6px 0 0",
          }}
          editorStyle={{
            border: "1px solid #dee2e6",
            borderRadius: "0 0 6px 6px",
            padding: "10px",
            heigth: "250px",
          }}
          placeholder={get_translation("INTERFACE_ENTER_MSG")}
          toolbar={{
            options: ["inline", "list", "emoji", "remove", "history"],
            inline: {
              options: ["bold", "italic", "underline", "strikethrough"],
            },
            list: {
              options: ["unordered", "ordered"],
            },
          }}
        />
      </Form.Group>
    </>
  );
}
