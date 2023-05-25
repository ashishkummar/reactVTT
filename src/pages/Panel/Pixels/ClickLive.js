import React, { useRef, useEffect, useState } from 'react';
import FetchDesiConf from '../JsParsing/FetchDesiConf';
import CheckPixels from './CheckPixels';

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
    function handlePortMessage(msg) {
      try {
        if (msg.pixel.clickLive !== undefined) {
          setClicklivePixels((prevState) => [...prevState, { msg }]);
        }
      } catch (err) {
        //console.log('errInfo from video quartile ', err, 'msg  = ', msg);
      }
    }

    // add the listener once when the component mounts
    port.onMessage.addListener(handlePortMessage);

    return () => {
      port.onMessage.removeListener(handlePortMessage);
    };
  }, []);

  // clean up the listener when the component unmounts or page refreshes
  window.addEventListener('beforeunload', () => {
    //port.onMessage.removeListener(handlePortMessage);
  });

  const onUpdate = (tabId, changeInfo, tab) => {
    if (
      tabId === chrome.devtools.inspectedWindow.tabId &&
      changeInfo.status === 'loading'
    ) {
      console.log('REFR');
      setClicklivePixels([{}]);
    }
    chrome.tabs.onUpdated.removeListener(onUpdate);
  };
  chrome.tabs.onUpdated.addListener(onUpdate);

  return (
    <>
      {' '}
      {<CheckPixels />}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>{new Date().getTime()} </div>
        <div>
          {/*
          <FetchDesiConf
            showPixel="clickLive"
            currentPixel={prop.currentPixel}
          ></FetchDesiConf>
        */}
        </div>
      </div>
      <div style={{ height: '100px', border: '1px solid', overflow: 'auto' }}>
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
