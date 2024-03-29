import React, { useEffect, useState } from 'react';

export default function Footer(prop) {
  const [buildState, setBuildState] = useState('...');
  const [adUnitType, setAdunitType] = useState('...');
  const [demoPurlData, setDemoPurlData] = useState('');

  useEffect(() => {
    // Move the event listener setup outside the component
    const updateListener = (tabId, changeInfo) => {
      if (
        tabId === chrome.devtools.inspectedWindow.tabId &&
        changeInfo.status === 'loading'
      ) {
        setAdunitType('...');
      }
    };

    chrome.tabs.onUpdated.addListener(updateListener);

    var port = chrome.runtime.connect({
      name: 'tab_' + chrome.devtools.inspectedWindow.tabId,
    });

    const handlePortMessage = (msg) => {
      try {
        if (msg.PubDemopagesURL !== undefined) {
          let demoPurl = msg.PubDemopagesURL;
          if (demoPurl === '') {
            return;
          }
          console.log('footer', demoPurl);
          fetch(demoPurl)
            .then((response) => response.text())
            .then((contents) => {
              let dpUrl = JSON.parse(contents);
              setDemoPurlData(dpUrl);
              if (dpUrl.data.flow === 'non-muse') {
                setBuildState(' Made In VDX Studio   ');
              } else if (dpUrl.data.flow === 'muse') {
                setBuildState('  Built in Muse  ');
              }
            });
        }

        if (msg.adUnitType !== undefined) {
          let _unitName = msg.adUnitType.split('.html?namejs')[0];
          _unitName = _unitName.split('/creative_')[1];

          setAdunitType(_unitName);

          if (demoPurlData.data.urls.length !== 0) {
            for (let i = 0; i < demoPurlData.data.urls.length; i++) {
              if (demoPurlData.data.urls[i].platform === 'mobile') {
                if (_unitName === 'mobileexpandable') {
                  if (
                    demoPurlData.data.urls[i].product === 'VdxMobileExpandable'
                  ) {
                    setAdunitType(demoPurlData.data.urls[i].creativeRequestId);
                    break;
                  }
                }
              }
              if (_unitName.indexOf('inframe_') !== -1) {
                if (demoPurlData.data.urls[i].product === 'VdxDesktopInframe') {
                  setAdunitType(demoPurlData.data.urls[i].creativeRequestId);
                  break;
                }
              }
              if (_unitName.indexOf('desktop_') !== -1) {
                if (
                  demoPurlData.data.urls[i].product === 'VdxDesktopExpandable'
                ) {
                  setAdunitType(demoPurlData.data.urls[i].creativeRequestId);
                  break;
                }
              }
            }
          }
        }
      } catch (err) {
        console.log('errInfo from video quartile ', err, 'msg  = ', msg);
      }
    };

    // Adding the listener once when the component mounts
    port.onMessage.addListener(handlePortMessage);

    return () => {
      chrome.tabs.onUpdated.removeListener(updateListener);
      port.onMessage.removeListener(handlePortMessage);
    };
  }, [demoPurlData]);

  function gotoETPageHandler() {
    if (isNaN(+adUnitType * 1)) return;
    window.open(
      'https://expotask.exponential.com/request/info/' + adUnitType,
      '_blank'
    );
  }

  // Conditionally rendering badges only when necessary
  const buildStateBadge = buildState ? (
    buildState.includes('VDX') ? (
      <div className="badge badge-success ml-1 mt-1">{buildState}</div>
    ) : (
      <div className="badge badge-primary ml-1 mt-1">{buildState}</div>
    )
  ) : null;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {buildStateBadge}

      {!isNaN(+adUnitType * 1) ? (
        <div
          className="badge badge-info ml-1 mt-1 "
          onClick={gotoETPageHandler}
        >
          {adUnitType}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
