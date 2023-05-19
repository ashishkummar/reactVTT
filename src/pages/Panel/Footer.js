import React, { useEffect, useState } from 'react';

export default function Footer(prop) {
  const [butldState, setButldState] = useState();

  useEffect(() => {
    if (prop.dempP !== undefined) {
      fetch(prop.dempP)
        .then((response) => response.text())
        .then((contents) => {
          //
          let dpUrl = JSON.parse(contents);

          if (dpUrl.data.flow === 'non-muse') {
            setButldState(' Made In VDX Studio   ');
          } else if (dpUrl.data.flow === 'muse') {
            setButldState('  Buit in Muse  ');
          }
        });
    }
    // listen for tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      // check if the updated tab is the current tab
      if (
        tabId === chrome.devtools.inspectedWindow.tabId &&
        changeInfo.status === 'loading'
      ) {
        setButldState('');
      }
    });
    //
  }, [prop]);

  return (
    <>
      <div style={{ position: 'fixed', bottom: '0' }}>{butldState}</div>
    </>
  );
}
