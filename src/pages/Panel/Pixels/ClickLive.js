import React, { useRef, useEffect, useState } from 'react';
import FetchDesiConf from '../JsParsing/FetchDesiConf';
import CheckPixels from './CheckPixels';
import { DataContextProvider } from '../Data/DataContext';

export default function ClickLive(prop) {
  const messagesEndRef = useRef(null);
  const [ClicklivePixels, setClicklivePixels] = useState([{}]);

  var port = chrome.runtime.connect({
    name: 'tab_' + chrome.devtools.inspectedWindow.tabId,
  });

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [ClicklivePixels]);

  useEffect(() => {
    const onUpdate = (tabId, changeInfo, tab) => {
      if (
        tabId === chrome.devtools.inspectedWindow.tabId &&
        changeInfo.status === 'loading'
      ) {
        setClicklivePixels([{}]);
      }
    };
    chrome.tabs.onUpdated.addListener(onUpdate);

    function handlePortMessage(msg) {
      try {
        if (msg.pixel.clickLive !== undefined) {
          setClicklivePixels((prevState) => [...prevState, { msg }]);
        }
      } catch (err) {
        // console.log('errInfo from  ', err, 'msg  = ', msg);
      }
    }

    // add the listener once when the component mounts
    port.onMessage.addListener(handlePortMessage);

    return () => {
      port.onMessage.removeListener(handlePortMessage);
      chrome.tabs.onUpdated.removeListener(onUpdate);
    };
  }, []);

  function clearPixsHandler() {
    setClicklivePixels([{}]);
  }

  return (
    <>
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
          <div className="tabs clicktabsbg  fontSettings ">Click Lives </div>{' '}
          <DataContextProvider>
            <CheckPixels pixelType="clickLive" />
          </DataContextProvider>
        </div>
        <div onClick={clearPixsHandler}>Clear</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row' }}></div>
      <div
        className="fontSettings"
        style={{
          height: '80px',
          padding: '3px',
          border: '1px solid',
          overflow: 'auto',
          color: 'blue',
        }}
      >
        {ClicklivePixels.length !== 0
          ? ClicklivePixels.map((data, index) => (
              <div key={index}>
                {data.msg && data.msg.pixel.clickLive && (
                  <div>
                    {data.msg.pixel.clickLive
                      .split(':')[1]
                      .slice(0, data.msg.pixel.clickLive.indexOf(';'))
                      .split(';en')
                      .join('')}
                  </div>
                )}
              </div>
            ))
          : ''}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
