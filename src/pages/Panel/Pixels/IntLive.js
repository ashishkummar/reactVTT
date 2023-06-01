import React, { useRef, useEffect, useState } from 'react';

import CheckPixels from './CheckPixels';

export default function IntLive(prop) {
  const messagesEndRef = useRef(null);
  const [clickedPixel, setClickedPixel] = useState('');
  const [IntlivePixels, setIntlivePixels] = useState([{}]);

  var port = chrome.runtime.connect({
    name: 'tab_' + chrome.devtools.inspectedWindow.tabId,
  });

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [IntlivePixels]);

  useEffect(() => {
    function handlePortMessage(msg) {
      try {
        if (msg.pixel.intLive !== undefined) {
          setIntlivePixels((prevState) => [...prevState, { msg }]);
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
    // port.onMessage.removeListener(handlePortMessage);
  });

  const onUpdate = (tabId, changeInfo, tab) => {
    if (
      tabId === chrome.devtools.inspectedWindow.tabId &&
      changeInfo.status === 'loading'
    ) {
      setIntlivePixels([{}]);
    }
    chrome.tabs.onUpdated.removeListener(onUpdate);
  };
  chrome.tabs.onUpdated.addListener(onUpdate);

  return (
    <div>
      IntLive:
      {<CheckPixels pixelType="intLive" />}
      <div style={{ height: '100px', border: '1px solid', overflow: 'auto' }}>
        {IntlivePixels !== 0
          ? IntlivePixels.map((data, index) => (
              <div key={index}>
                {data.msg && data.msg.pixel.intLive && (
                  <div>
                    {
                      JSON.stringify(data.msg.pixel.intLive).match(
                        /id:(.*?);/
                      )[1]
                    }
                  </div>
                )}
              </div>
            ))
          : ''}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}
