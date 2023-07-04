import './Panel.css';
import React, { memo } from 'react';
import Header from './Header/Header';
import VideoQuartiles from './Pixels/VideoQuartiles';
import IntLive from './Pixels/IntLive';
import ClickLive from './Pixels/ClickLive';
import VideoFileInfo from './FileInfo/VideoFileInfo';
import ImageFileInfo from './FileInfo/ImageFileInfo';
import Footer from './Footer';

const MemoizedVideoQuartiles = memo(VideoQuartiles);
const MemoizedIntLive = memo(IntLive);
const MemoizedClickLive = memo(ClickLive);
const MemoizedVideoFiles = memo(VideoFileInfo);
const MemoizedImageFiles = memo(ImageFileInfo);
const MemoizedFooter = memo(Footer);

function Panel() {
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
