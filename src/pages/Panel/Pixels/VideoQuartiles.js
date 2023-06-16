import React, { useRef, useEffect, useState } from 'react';

export default function VideoQuartiles(props) {
  const messagesEndRef = useRef(null);
  const [VideoPixels, setVideoPixels] = useState([]);

  var port = chrome.runtime.connect({
    name: 'tab_' + chrome.devtools.inspectedWindow.tabId,
  });

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [VideoPixels]);

  useEffect(() => {
    const onUpdate = (tabId, changeInfo, tab) => {
      if (
        tabId === chrome.devtools.inspectedWindow.tabId &&
        changeInfo.status === 'loading'
      ) {
        // console.log('REFR');
        setVideoPixels([{}]);
      }
    };
    chrome.tabs.onUpdated.addListener(onUpdate);

    // add the listener once when the component mounts
    port.onMessage.addListener(handlePortMessage);

    return () => {
      port.onMessage.removeListener(handlePortMessage);
      //port.disconnect();
      chrome.tabs.onUpdated.removeListener(onUpdate);
    };
  }, []);

  function handlePortMessage(msg) {
    try {
      if (msg.video !== undefined) {
        setVideoPixels((prevState) => [...prevState, { msg }]);
      }
    } catch (err) {
      //console.log('errInfo from video quartile ', err, 'msg  = ', msg);
    }
  }

  // clean up the listener when the component unmounts or page refreshes
  window.addEventListener('beforeunload', () => {
    //port.onMessage.removeListener(handlePortMessage);
  });

  return (
    <div>
      Video Quartiles
      {
        <div
          style={{
            height: '80px',
            padding: '3px',
            border: '1px solid',
            overflow: 'auto',
          }}
        >
          {VideoPixels.length !== 0
            ? VideoPixels.map((data, index) => (
                <div key={index}>
                  {data.msg && data.msg.video && data.msg.video.pxl && (
                    <div>
                      {' '}
                      {JSON.stringify(data.msg.video)
                        .split('st:')[1]
                        .split('","')[0] || 'not found'}{' '}
                      | {data.msg.video.pxl}
                    </div>
                  )}
                </div>
              ))
            : ''}
          <div ref={messagesEndRef} />
        </div>
      }
    </div>
  );
}
