import './Panel.css';
import React, { useState, useEffect, memo, useContext } from 'react';
import Header from './Header/Header';
import VideoQuartiles from './Pixels/VideoQuartiles';
import IntLive from './Pixels/IntLive';
import ClickLive from './Pixels/ClickLive';
import VideoFileInfo from './FileInfo/VideoFileInfo';
import ImageFileInfo from './FileInfo/ImageFileInfo';
import Footer from './Footer';
import CheckPixels from './Pixels/CheckPixels';

import { DataContextProvider } from './Data/DataContext';

const MemoizedVideoQuartiles = memo(VideoQuartiles);
const MemoizedIntLive = memo(IntLive);
const MemoizedClickLive = memo(ClickLive);
const MemoizedVideoFiles = memo(VideoFileInfo);
const MemoizedImageFiles = memo(ImageFileInfo);
const MemoizedFooter = memo(Footer);

function Panel() {
  const [desiAPIurl, setDesiAPIurl] = useState('');

  return (
    <div className="container">
      {<Header />}
      {<MemoizedVideoQuartiles />}
      {<MemoizedIntLive />}
      {<MemoizedClickLive />}
      {<MemoizedImageFiles />}
      {<MemoizedVideoFiles />}
      {<MemoizedFooter />}
    </div>
  );
}

export default Panel;
