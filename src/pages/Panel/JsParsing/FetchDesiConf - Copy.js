import React, { useEffect, useState } from 'react';

let ports = [];
let _activeTabID = 'vdxDevtools';
let tabId = 'tab_' + chrome.devtools.inspectedWindow.tabId;
let windowId;

chrome.windows.getCurrent(function (currentWindow) {
  windowId = 'win_' + currentWindow.id;
});

_activeTabID = tabId;

var port = chrome.runtime.connect({ name: _activeTabID });

chrome.runtime.onConnect.addListener(function (port) {
  ports.push(port);

  port.onDisconnect.addListener(function () {
    var i = ports.indexOf(port);
    if (i !== -1) ports.splice(i, 1);
  });
});

port.postMessage({ tabid: tabId, windowId: windowId });

const extractText = (text) => {
  const regex = /Expo\.designerAPI\.firePixel\((.*?)\)/g;
  const matches = text.matchAll(regex);
  const pixels = [];
  for (const match of matches) {
    pixels.push(match[1]);
  }

  const clickLives = [];
  const intLives = [];

  pixels.forEach((data, index) => {
    if (data.split(',')[1].indexOf('clickLive') !== -1) {
      console.log(data.split(',')[0]);
      clickLives.push(data.split(',')[0]);
    } else {
      intLives.push(data.split(',')[0]);
    }
  });

  return { clickLives, intLives };
};

export default function FetchDesiConf(prop) {
  const [pixels, setPixels] = useState({ clickLives: [], intLives: [] });

  useEffect(() => {
    // define the handler function outside of the component
    function handlePortMessage(msg) {
      try {
        // console.log('-->', msg.videoURL, tabId, windowId);

        if (msg.desiConfURL !== undefined) {
          console.log(msg.desiConfURL);
          //fetchScript(msg.desiConfURL);
        }
      } catch (err) {
        // console.log('errInfo ', err, 'msg  = ', msg);
      }
    }

    // add the listener once when the component mounts
    port.onMessage.addListener(handlePortMessage);

    // clean up the listener when the component unmounts or page refreshes
    window.addEventListener('beforeunload', () => {
      port.onMessage.removeListener(handlePortMessage);
    });

    // listen for tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      // check if the updated tab is the current tab
      if (
        tabId === chrome.devtools.inspectedWindow.tabId &&
        changeInfo.status === 'loading'
      ) {
        setPixels({ clickLives: [], intLives: [] });
      }
    });

    return () => {
      port.onMessage.removeListener(handlePortMessage);
      chrome.tabs.onUpdated.removeListener();
    };

    //

    async function fetchScript(URL) {
      const response = await fetch(URL);
      const scriptText = await response.text();
      const extractedPixels = extractText(scriptText);
      setPixels(extractedPixels);
    }
  }, []); // add an empty dependency array to only add/remove the listener once

  return (
    <div>
      {' '}
      {prop.showPixel === 'intLive'
        ? 'intLives ' + pixels.intLives.length
        : 'clickLives ' + pixels.clickLives.length}{' '}
    </div>
  );
}
