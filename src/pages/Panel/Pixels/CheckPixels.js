import React, { useEffect, useState, useContext } from 'react';
import { DataContext } from '../Data/DataContext';
import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal,
  ModalTitle,
} from 'react-bootstrap';

import '../../Panel/bootstrap.min.css';
import { getDesiDataFile } from '../fetchFiles.js';
import EditDC from '../JsParsing/EditDC';

let CTAs = [];

export default function CheckPixels(prop) {
  const { data, loading } = useContext(DataContext);
  const [intLives, setIntLives] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loadAce, setLoadAce] = useState(false);

  function createCTAArray(cta, pxls) {
    let ctaArray = pxls.map((item) => ({
      cta: item,
      checked: item === cta ? item === cta : '',
    }));

    return ctaArray;
  }

  if (prop.currentPixel !== undefined) {
    console.log('-=-=-=-=-=>>>>>', data[1]);
    let pxl = prop.currentPixel.match(/id:(.*?);/)[1];
    data[0].intLives.map((data, index) => {
      if (data.ints === pxl) {
        data.checked = true;
      }
    });

    data[0].clickLives.map((data, index) => {
      if (data.clicks === pxl) {
        data.checked = true;
      }
    });

    //console.log('--------------||', data.clicks, pxl);
  }

  useEffect(() => {
    //.match(/id:(.*?);/)[1]

    setIntLives(data[0].intLives);
  }, [prop.currentPixel]);

  useEffect(() => {
    console.log(
      'from context api ',
      data[0].intLives,
      data.loading,
      prop.currentPixel
    );
    if (data[0].intLives !== undefined) {
      setIntLives(data[0].intLives);
    }

    // listen for tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      // check if the updated tab is the current tab
      if (
        tabId === chrome.devtools.inspectedWindow.tabId &&
        changeInfo.status === 'loading'
      ) {
        CTAs = [];
        setIntLives(CTAs);
        setIsOpen(false);
      }
    });
  }, [data.clickLives, data.intLives]);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const loadeAce = () => {
    setLoadAce(true);
  };

  return (
    <>
      {' '}
      <button onClick={showModal}>
        e
        {/*intLives.ints.length !== 0 &&
          data.clickLives.clicks.length + ' | ' + data.intLives.ints.length*/}
      </button>
      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header>
          <Modal.Title>IntLive and clickLive Pixels</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {console.log('intLives updated:----', data[0])}
          {data[0].intLives !== undefined
            ? data[0].intLives.map((data, index) => {
                return (
                  <div key={index}>
                    <div
                      style={
                        data.checked
                          ? {
                              cursor: 'pointer',
                              display: 'inline-block',
                              whiteSpace: 'nowrap',
                              width: '200px',
                              backgroundColor: 'skyblue',
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
          {data[0].clickLives !== undefined
            ? data[0].clickLives.map((data, index) => {
                return (
                  <div key={index}>
                    <div
                      style={
                        data.checked
                          ? {
                              cursor: 'pointer',
                              display: 'inline-block',
                              whiteSpace: 'nowrap',
                              width: '200px',
                              backgroundColor: 'pink',
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
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hideModal}>Cancel</Button>
          <Button onClick={loadeAce}>View/Edit 'designer-config.js'</Button>
        </Modal.Footer>
      </Modal>
      {loadAce && (
        <EditDC
          showEditor={loadAce}
          state={setLoadAce}
          DAPIDATA={data[1].desiAPIdata}
        />
      )}
    </>
  );
}
