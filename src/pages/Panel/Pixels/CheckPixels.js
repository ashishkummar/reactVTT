import React, { useEffect, useState, useRef, useContext } from 'react';
import { DataContext } from '../Data/DataContext';
import '../../Panel/bootstrap.min.css';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import CompareETPixels from './CompareETPixels';

import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal,
  ModalTitle,
} from 'react-bootstrap';

export default function CheckPixels(prop) {
  const editorRef = useRef();

  const { data, loading } = useContext(DataContext);
  const [intLives, setIntLives] = useState([]);
  const [clickLives, setClickLives] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [isAceOpen, setIsAceOpen] = useState(false);
  const [desiApiData, setDesiApiData] = useState('Loading Designer API...');
  const [editStatus, setEditStatus] = useState(false);
  const [pageStatus, setPageStatus] = useState('');

  var port = chrome.runtime.connect({
    name: 'tab_' + chrome.devtools.inspectedWindow.tabId,
  });

  ///
  useEffect(() => {
    setIntLives(data[0].intLives);
    setClickLives(data[0].clickLives);
  }, [data[0].clickLives, data[0].intLives]);

  port.onMessage.addListener(handlePortMessage);
  function handlePortMessage(msg) {
    if (msg.pixel !== undefined) {
      if (msg.pixel.intLive !== undefined) {
        let pxl = msg.pixel.intLive.match(/id:(.*?);/)[1];
        const updatedIntLives = intLives.map((data, index) => {
          if (data.ints === pxl) {
            data.checked = true;
          }
          return data;
        });
        setIntLives(updatedIntLives);
      }

      if (msg.pixel.clickLive !== undefined) {
        let pxl2 = msg.pixel.clickLive.match(/id:(.*?);/)[1];
        const updatedClickLives = clickLives.map((data, index) => {
          if (data.clicks === pxl2) {
            data.checked = true;
          }
          return data;
        });
        setClickLives(updatedClickLives);
      }

      port.onMessage.removeListener(handlePortMessage);
    }
  }

  window.addEventListener('beforeunload', () => {
    //  port.onMessage.removeListener(handlePortMessage);
  });

  let activeTabId = -1;

  chrome.tabs.onActivated.addListener((activeInfo) => {
    activeTabId = activeInfo.tabId;
  });

  useEffect(() => {
    function onTabUpdated(tabId, changeInfo, tab) {
      if (
        tabId === chrome.devtools.inspectedWindow.tabId &&
        changeInfo.status === 'loading'
      ) {
        // setIntLives([]);
        // setClickLives([]);
      }
      //
      if (changeInfo.url) {
        setPageStatus('new');
        port.postMessage({
          reload: false,
          editedDesiConf: '',
        });
        //console.log('new');
      }
    }

    chrome.tabs.onUpdated.addListener(onTabUpdated);

    return () => {
      chrome.tabs.onUpdated.removeListener(onTabUpdated);
    };
  }, []);

  useEffect(() => {
    console.log('PageStatus- ', pageStatus);

    if (pageStatus === 'new') {
      if (data[1].desiAPIdata.search('<!DOCTYPE html>') == -1) {
        setDesiApiData(data[1].desiAPIdata);
      } else {
        setDesiApiData('Loading designer api...');
        // setIsAceOpen(false);
      }
    }
  }, [data[1].desiAPIdata]);

  //
  //////
  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  ///// Ace Editor -------------------------

  function onAceChange(newValue) {
    setPageStatus('refresh');
    setEditStatus(true);
    setDesiApiData(newValue);
  }

  const showAceModal = () => {
    if (editStatus === false) {
      setDesiApiData(data[1].desiAPIdata);
    }
    setIsAceOpen(true);
  };

  const hideAceModal = () => {
    setIsAceOpen(false);
  };

  const reloadStatusListner = () => {
    setPageStatus('refresh');
    port.postMessage({
      reload: true,
      editedDesiConf:
        'data:' +
        'text/javascript' +
        ';charset=UTF-8;base64,' +
        btoa(unescape(encodeURIComponent(desiApiData))),
    });
    setEditStatus(true);
  };

  //////////////
  // Call scrollIntoView when the transition starts
  const bringInView = (e) => {
    e.target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {' '}
      {
        <div
          style={{ cursor: 'pointer' }}
          className="badge badge-info"
          onClick={showModal}
        >
          {/* 
          <div
            className="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
          ></div>
        */}
          {prop.pixelType === 'intLive' ? intLives.length : clickLives.length}
        </div>
      }
      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header>
          <Modal.Title>IntLive and clickLive Pixels</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*console.log('intLives updated:----', clickLives, intLives) */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '450px',
              overflow: 'scroll',
            }}
          >
            {intLives !== undefined
              ? intLives.map((data, index) => {
                  return (
                    <div key={index}>
                      <div
                        onTransitionEnd={bringInView}
                        style={
                          data.checked
                            ? {
                                display: 'inline-block',
                                whiteSpace: 'nowrap',

                                background: 'green',
                                color: 'white',
                                transition:
                                  'background-color .5s cubic-bezier(0.03, 0.33, 0, 0.97)',
                              }
                            : {}
                        }
                      >
                        {data.ints}
                      </div>
                    </div>
                  );
                })
              : ''}
            {clickLives !== undefined
              ? clickLives.map((data, index) => {
                  return (
                    <div key={index}>
                      <div
                        onTransitionEnd={bringInView}
                        style={
                          data.checked
                            ? {
                                cursor: 'pointer',
                                display: 'inline-block',
                                whiteSpace: 'nowrap',

                                background: 'blue',
                                color: 'white',
                                transition:
                                  'background-color .5s cubic-bezier(0.03, 0.33, 0, 0.97)',
                              }
                            : {}
                        }
                      >
                        {data.clicks}
                      </div>
                    </div>
                  );
                })
              : ''}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {clickLives.length !== 0 && (
            <CompareETPixels clickLives={clickLives} intLives={intLives} />
          )}
          <Button onClick={hideModal}>Cancel</Button>
          <Button onClick={showAceModal}>View/Edit 'designer-config.js'</Button>
        </Modal.Footer>
      </Modal>
      {/*<EditDC AceState={showACEModal} DAPIDATA={data[1].desiAPIdata} />*/}
      <Modal dialogClassName="modal-lg" show={isAceOpen} onHide={hideAceModal}>
        <Modal.Header>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AceEditor
            value={desiApiData}
            ref={editorRef}
            mode={'javascript'}
            width={'100%'}
            fontSize={14}
            focus={true}
            wrapEnabled={false}
            theme="github_dark"
            onChange={onAceChange}
            name="editorRef"
            editorProps={{ $blockScrolling: false }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hideAceModal}>Cancel</Button>
          <Button onClick={reloadStatusListner}>Refresh</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
