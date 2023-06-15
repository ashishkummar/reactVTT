import React, { useRef, useEffect, useState, useContext } from 'react';
import { DataContextProvider } from '../Data/DataContext';

import CheckPixels from './CheckPixels';

export default function IntLive(prop) {
  const messagesEndRef = useRef(null);
  const [IntlivePixels, setIntlivePixels] = useState([{}]);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [IntlivePixels]);

  useEffect(() => {
    const onUpdate = (tabId, changeInfo, tab) => {
      if (
        tabId === chrome.devtools.inspectedWindow.tabId &&
        changeInfo.status === 'loading'
      ) {
        setIntlivePixels([{}]);
      }
    };
    chrome.tabs.onUpdated.addListener(onUpdate);

    return () => {
      chrome.tabs.onUpdated.removeListener(onUpdate);
    };
  }, []);

  function clearPixsHandler() {
    setIntlivePixels([{}]);
  }

  useEffect(() => {
    const port = chrome.runtime.connect({
      name: 'tab_' + chrome.devtools.inspectedWindow.tabId,
    });

    port.onMessage.addListener(handlePortMessage);
    //clean
    return () => {
      port.onMessage.removeListener(handlePortMessage);
      port.disconnect();
    };
  }, []);

  const handlePortMessage = (msg) => {
    try {
      if (msg.pixel.intLive !== undefined) {
        setIntlivePixels((prevState) => [...prevState, { msg }]);
      }
    } catch (err) {
      // console.log('errInfo intlive  ', err, 'msg  = ', msg);
    }
  };

  // add the listener once when the component mounts

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <div>Int Lives &nbsp;</div>{' '}
        </div>
        <div onClick={clearPixsHandler}> Clear</div>
      </div>
      <div
        style={{
          height: '110px',
          padding: '3px',
          border: '1px solid',
          overflow: 'auto',
          color: 'green',
        }}
      >
        {IntlivePixels.length > 0 &&
          IntlivePixels.map((data, index) => (
            <div key={index}>
              {data.msg && data.msg.pixel.intLive && (
                <div>
                  {JSON.stringify(data.msg.pixel.intLive).match(/id:(.*?);/)[1]}
                </div>
              )}
            </div>
          ))}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}
