import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal,
  ModalTitle,
} from 'react-bootstrap';
import '../../Panel/bootstrap.min.css';
import { render } from 'react-dom';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/ext-language_tools';

export default function EditDC(prop) {
  const [isOpen, setIsOpen] = useState(false);
  const editorRef = React.useRef();

  function onChange(newValue) {
    console.log('change', newValue);
  }

  useEffect(() => {
    setIsOpen(prop.AceState);
  }, [prop.AceState]);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
    // prop.hideEditornpm(false);
  };

  return (
    <>
      <Modal dialogClassName="modal-lg" show={isOpen} onHide={hideModal}>
        <Modal.Header>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AceEditor
            value={prop.DAPIDATA}
            ref={editorRef}
            mode={'javascript'}
            width={'100%'}
            fontSize={14}
            focus={true}
            wrapEnabled={false}
            theme="github_dark"
            onChange={onChange}
            name="editorRef"
            editorProps={{ $blockScrolling: false }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              enableSearch: true,
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hideModal}>Cancel</Button>
          <Button>Comonent</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
