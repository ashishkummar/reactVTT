import React, { useEffect, useState } from 'react';

export default function Footer(prop) {
  const [buildState, setBuildState] = useState('');

  // listen for tab updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    // check if the updated tab is the current tab
    if (
      tabId === chrome.devtools.inspectedWindow.tabId &&
      changeInfo.status === 'loading'
    ) {
      setBuildState('');
    }
  });

  useEffect(() => {
    var port = chrome.runtime.connect({
      name: 'tab_' + chrome.devtools.inspectedWindow.tabId,
    });

    // add the listener once when the component mounts
    port.onMessage.addListener(handlePortMessage);

    return () => {
      port.onMessage.removeListener(handlePortMessage);
      //port.disconnect();
    };

    function handlePortMessage(msg) {
      try {
        if (msg.PubDemopagesURL !== undefined) {
          fetchFile(msg.PubDemopagesURL);
        }
      } catch (err) {
        console.log('errInfo from video quartile ', err, 'msg  = ', msg);
      }
    }

    function fetchFile(url) {
      fetch(url)
        .then((response) => response.text())
        .then((contents) => {
          //
          let dpUrl = JSON.parse(contents);

          if (dpUrl.data.flow === 'non-muse') {
            setBuildState(' Made In VDX Studio   ');
          } else if (dpUrl.data.flow === 'muse') {
            setBuildState('  Buit in Muse  ');
          }
        });
    }
  }, []);

  return (
    <>
      <div
        className=""
        style={{
          marginLeft: '0px',
          marginTop: '-5px',
        }}
      >
        {buildState !== '' ? (
          buildState.includes('VDX') ? (
            <div className="badge badge-success">{buildState}</div>
          ) : (
            <div className="badge badge-primary">{buildState}</div>
          )
        ) : null}
      </div>
    </>
  );
}
