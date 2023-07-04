import React, { useEffect, useState, useRef, useContext } from 'react';
import { DataContext } from '../Data/DataContext';
import '../../Panel/bootstrap.min.css';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import CompareETPixels from './CompareETPixels';
import { AiOutlineFile, AiOutlineCodeSandbox } from 'react-icons/ai';
import { MdRefresh, MdEditNote, MdOutlineAnimation } from 'react-icons/md';
import { BsArrowUpRightSquare } from 'react-icons/bs';

import { Button, Modal, NavDropdown } from 'react-bootstrap';
import './pixels.css';
export default function CheckPixels(prop) {
  const editorRef = useRef();
  const [isCompOpen, setIsCompOpen] = useState(false);
  const { data } = useContext(DataContext);
  const [intLives, setIntLives] = useState([]);
  const [clickLives, setClickLives] = useState([]);
  //
  const [isOpen, setIsOpen] = useState(false);
  const [isAceOpen, setIsAceOpen] = useState(false);
  const [desiApiData, setDesiApiData] = useState('Loading Designer API...');
  const [editStatus, setEditStatus] = useState(false);
  const [pageStatus, setPageStatus] = useState('');
  let port = chrome.runtime.connect({
    name: 'tab_' + chrome.devtools.inspectedWindow.tabId,
  });
  // Trigger once
  useEffect(() => {
    setIntLives(data[0].intLives);
    setClickLives(data[0].clickLives);
  }, [data]);

  useEffect(() => {
    port.onMessage.addListener(handlePortMessage);
    chrome.tabs.onUpdated.addListener(onTabUpdated);
    return () => {
      //port.disconnect();
      port.onMessage.removeListener(handlePortMessage);
      chrome.tabs.onUpdated.removeListener(onTabUpdated);
    };

    function handlePortMessage(msg) {
      if (msg.pixel !== undefined) {
        if (msg.pixel.intLive !== undefined) {
          let pxl = msg.pixel.intLive.match(/id:(.*?);/)[1];
          let found = false;
          const updatedIntLives = intLives.map((data, index) => {
            if (!found && data.ints === pxl && data.checked === false) {
              data.checked = true;
              found = true;
            }
            return data;
          });

          setIntLives(updatedIntLives);
          console.log('    : setIntLives ', intLives, pxl, data[0].intLives);
        }

        if (msg.pixel.clickLive !== undefined) {
          let pxl2 = msg.pixel.clickLive.match(/id:(.*?);/)[1];
          let ctafound = false;
          const updatedClickLives = clickLives.map((data, index) => {
            if (!ctafound && data.clicks === pxl2 && data.checked === false) {
              data.checked = true;
              ctafound = true;
            }
            return data;
          });
          setClickLives(updatedClickLives);
        }
      }
    }
  }, [intLives, clickLives]);

  function onTabUpdated(tabId, changeInfo, tab) {
    if (
      tabId === chrome.devtools.inspectedWindow.tabId &&
      changeInfo.status === 'loading'
    ) {
      console.log(
        '  Cleared setIntLives and setClickLives.... editStaus',
        editStatus
      );
      //if (!editStatus) {
      setIntLives([]);
      setClickLives([]);
      //}
    }
    //
    if (changeInfo.url) {
      setPageStatus('new');

      port.postMessage({
        reload: false,
        editedDesiConf: '',
      });
    }
  }

  useEffect(() => {
    if (pageStatus === 'new') {
      if (data[1].desiAPIdata.search('<!DOCTYPE html>') === -1) {
        setDesiApiData(data[1].desiAPIdata);
      } else {
        setDesiApiData('Loading designer api...');
        // setIsAceOpen(false);
      }
      // setEditStatus(false);
    }
  }, [data[1].desiAPIdata]);

  //

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

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

  // Call scrollIntoView when the transition starts
  const bringInView = (e) => {
    e.target.scrollIntoView({ behavior: 'smooth' });
  };

  function openDcListener() {
    window.open(data[1].url);
  }

  function downloadDcListener() {
    const blob = new Blob([desiApiData], { type: 'text/javascript' });
    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = data[1].url.substring(data[1].url.lastIndexOf('/') + 1);
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  const handleCompButtonClick = () => {
    setIsCompOpen(!isCompOpen);
  };

  return (
    <>
      {
        <div className="CheckPixelsWidget" onClick={showModal}>
          {/* 
          <div
            className="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
          ></div>
        */}
          {prop.pixelType === 'intLive'
            ? intLives.length !== 0 && (
                <span className="badge badge-success">{intLives.length}</span>
              )
            : clickLives.length !== 0 && (
                <span className="badge badge-primary">{clickLives.length}</span>
              )}
        </div>
      }
      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header>
          <Modal.Title className="modal-title h6">
            IntLive and clickLive Pixels
          </Modal.Title>
          <button
            onClick={hideModal}
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          {/*console.log('intLives updated:----', clickLives, intLives) */}
          <div
            style={{
              fontSize: '13px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '345px',
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
                                  'background-color .2s cubic-bezier(0.03, 0.33, 0, 0.97)',
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
                                  'background-color .2s cubic-bezier(0.03, 0.33, 0, 0.97)',
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

          <Button className="btn-sm" onClick={showAceModal}>
            {' '}
            <MdEditNote /> Edit Designer Config
          </Button>
        </Modal.Footer>
      </Modal>
      {/*<EditDC AceState={showACEModal} DAPIDATA={data[1].desiAPIdata} />*/}
      <Modal dialogClassName="modal-sm" show={isAceOpen} onHide={hideAceModal}>
        <Modal.Header>
          <Modal.Title className="modal-title h6">
            Designer-Config{' '}
            <sup>
              {' '}
              <BsArrowUpRightSquare
                onClick={openDcListener}
                title="Open Designer-config in new tab"
              />{' '}
            </sup>
          </Modal.Title>
          <button
            onClick={hideAceModal}
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <AceEditor
            value={desiApiData}
            ref={editorRef}
            mode={'javascript'}
            width={'100%'}
            height={'387px'}
            fontSize={12}
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
          <Button
            className="btn-sm"
            title="Refresh"
            onClick={reloadStatusListner}
          >
            {'Refresh Ad unit '}
            <MdRefresh />
          </Button>
          <Button className="btn-sm" onClick={downloadDcListener}>
            {' '}
            {'Download '}
            <AiOutlineFile />
          </Button>

          <NavDropdown
            bg="dark"
            variant="dark"
            title={<MdOutlineAnimation />}
            onClick={handleCompButtonClick}
            show={isCompOpen}
          >
            <NavDropdown.Item href="#" className="text-right ">
              FadeOut
            </NavDropdown.Item>
            <NavDropdown.Item href="#" className="text-right">
              FadeIn
            </NavDropdown.Item>
          </NavDropdown>
        </Modal.Footer>
      </Modal>
    </>
  );
}

/*https://react-icons.github.io/react-icons/search?q=animation*/
