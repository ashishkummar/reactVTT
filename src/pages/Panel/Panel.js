import './Panel.css';
import React, { useState, useEffect, memo, useContext } from 'react';
import Header from './Header';
import VideoQuartiles from './Pixels/VideoQuartiles';
import IntLive from './Pixels/IntLive';
import ClickLive from './Pixels/ClickLive';
import VideoFileInfo from './FileInfo/VideoFileInfo';
import ImageFileInfo from './FileInfo/ImageFileInfo';
import Footer from './Footer';
import { fetchDataFile, storeDesiDataFile } from './fetchFiles.js';
import { DataContextProvider } from './Data/DataContext';

const MemoizedVideoQuartiles = memo(VideoQuartiles);
const MemoizedIntLive = memo(IntLive);
const MemoizedClickLive = memo(ClickLive);
const MemoizedVideoFiles = memo(VideoFileInfo);
const MemoizedImageFiles = memo(ImageFileInfo);
const MemoizedFooter = memo(Footer);

let ports = [];

chrome.windows.getCurrent(function (currentWindow) {
  // windowId = 'win_' + currentWindow.id;
});

var port = chrome.runtime.connect({
  name: 'tab_' + chrome.devtools.inspectedWindow.tabId,
});

chrome.runtime.onConnect.addListener(function (port) {
  ports.push(port);

  port.onDisconnect.addListener(function () {
    var i = ports.indexOf(port);
    if (i !== -1) ports.splice(i, 1);
  });
});

//port.postMessage({ tabid: tabId, windowId: windowId });

function Panel() {
  const [VideoPixels, setVideoPixels] = useState([{}]);
  const [IntlivePixels, setIntlivePixels] = useState([{}]);
  const [ClicklivePixels, setClicklivePixels] = useState([{}]);
  const [VideoFiles, setVideoFiles] = useState([{}]);
  const [ImageFiles, setImageFiles] = useState([{}]);
  const [currentClickPixel, setCurrentClickPixel] = useState();
  const [currentIntPixel, setCurrentIntPixel] = useState();
  const [desiAPIurl, setDesiAPIurl] = useState('');
  const [pubDemopagesURL, setPubDemopagesURL] = useState();

  let images = [];
  useEffect(() => {
    //   the handler function is outside of the component
    function handlePortMessage(msg) {
      try {
        if (msg.PubDemopagesURL !== undefined) {
          setPubDemopagesURL(msg.PubDemopagesURL);
        }

        if (msg.desiConfURL !== undefined) {
          //(msg.desiConfURL);

          // console.log(msg.desiConfURL);
          setDesiAPIurl(msg.desiConfURL);
          //fetchDataFile(msg.desiConfURL)
          // .then((result) => {
          //  storeDesiDataFile(result);
          //})
          //.catch((error) => {
          // console.error('Error from panel:', error);
          //});
        }

        if (msg.videoURL !== undefined) {
          setVideoFiles([msg]);
        }

        if (msg.imgURL !== undefined) {
          images.push(msg.imgURL.split('?')[0]);
          images = Array.from(new Set(images));

          setTimeout(() => {
            setImageFiles({ images });
          }, 6000);

          //
        }

        if (msg.video !== undefined) {
          setVideoPixels((prevState) => [...prevState, { msg }]);
        }
        if (msg.pixel.intLive !== undefined) {
          setIntlivePixels((prevState) => [...prevState, { msg }]);
          setCurrentIntPixel(msg.pixel.intLive);
        }

        if (msg.pixel.clickLive !== undefined) {
          setClicklivePixels((prevState) => [...prevState, { msg }]);
          setCurrentClickPixel(msg.pixel.clickLive);
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
      // setVideoPixels([{}]); // clear the state of VideoPixels
      // setIntlivePixels([{}]);
    });

    // listen for tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      // check if the updated tab is the current tab
      if (
        tabId === chrome.devtools.inspectedWindow.tabId &&
        changeInfo.status === 'loading'
      ) {
        setVideoPixels([{}]); // clear the state of VideoPixels
        setIntlivePixels([{}]);
        setClicklivePixels([{}]);
        setVideoFiles([{}]);
        setImageFiles([{}]);
        images = [];
        setCurrentClickPixel();
        setCurrentIntPixel();
        setDesiAPIurl('');
      }
    });

    return () => {
      port.onMessage.removeListener(handlePortMessage);
      chrome.tabs.onUpdated.removeListener();
    };
  }, []); // add an empty dependency array to only add/remove the listener once

  return (
    <div className="container">
      <DataContextProvider url={desiAPIurl}>
        <Header />
        <MemoizedVideoQuartiles pixels={VideoPixels} />
        <MemoizedIntLive
          pixels={IntlivePixels}
          currentPixel={currentIntPixel}
        />
        <MemoizedClickLive
          pixels={ClicklivePixels}
          currentPixel={currentClickPixel}
        />
        <MemoizedImageFiles imgURL={ImageFiles} />
        {/*<MemoizedVideoFiles vidURL={VideoFiles} /> */}
        <MemoizedFooter dempP={pubDemopagesURL} />
      </DataContextProvider>
    </div>
  );
}

export default Panel;
