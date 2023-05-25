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

  var port = chrome.runtime.connect({
    name: 'tab_' + chrome.devtools.inspectedWindow.tabId,
  });

  useEffect(() => {
    let si;
    function handlePortMessage(msg) {
      try {
        if (msg.desiConfURL !== undefined) {
          setDesiAPIurl(msg.desiConfURL);
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

  return (
    <div className="container">
      <DataContextProvider url={desiAPIurl}>
        <Header />
        <MemoizedVideoQuartiles />
        {<MemoizedIntLive />}
        {<MemoizedClickLive />}

        {/*{<MemoizedImageFiles />}*/}
        {/*<MemoizedVideoFiles vidURL={VideoFiles} /> */}
        {/* <MemoizedFooter dempP={pubDemopagesURL} />*/}
      </DataContextProvider>
    </div>
  );
}

export default Panel;
