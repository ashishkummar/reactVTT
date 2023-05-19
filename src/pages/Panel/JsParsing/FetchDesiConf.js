import React, { useEffect, useState } from 'react';
import CheckPixels from '../Pixels/CheckPixels';

let DesiConfigData = '';

export default function FetchDesiConf(prop) {
  const [pixels, setPixels] = useState({ clickLives: [], intLives: [] });
  //

  //setPixels(getDesiDataFile());

  // listen for tab updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    // check if the updated tab is the current tab
    if (
      tabId === chrome.devtools.inspectedWindow.tabId &&
      changeInfo.status === 'loading'
    ) {
      //setPixels({ clickLives: [], intLives: [] }); // clear the state of VideoPixels
    }
  });

  //setPixels(extractedPixels);

  return (
    <div>
      {' '}
      {/* 
      <CheckPixels
        pixels={pixels}
        currentPixel={prop.currentPixel}
      ></CheckPixels>{' '}
      {prop.showPixel === 'intLive'
        ? 'intLives ' + pixels.intLives.length
        : 'clickLives ' + pixels.clickLives.length}{' '}
  */}
    </div>
  );
}
