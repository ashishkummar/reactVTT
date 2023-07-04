import React, { useState, useRef, useEffect } from 'react';

export default function ImageFileInfo() {
  const [sortedImages, setSortedImages] = useState([]);
  const uniqueURLs = useRef(new Set());

  useEffect(() => {
    const onUpdate = (tabId, changeInfo, tab) => {
      if (
        tabId === chrome.devtools.inspectedWindow.tabId &&
        changeInfo.status === 'loading'
      ) {
        uniqueURLs.current.clear();
        setSortedImages([]);
      }
    };
    chrome.tabs.onUpdated.addListener(onUpdate);

    const handlePortMessage = async (msg) => {
      try {
        if (msg.imgURL !== undefined) {
          let url = msg.imgURL.split('?')[0];

          if (!uniqueURLs.current.has(url)) {
            uniqueURLs.current.add(url);

            const name = getFileNameFromURL(url);
            const size = await getImageSizeFormatted(url);

            setSortedImages((prevImages) => [
              ...prevImages,
              { url, name, size },
            ]);
          }
        }
      } catch (err) {
        console.error('Error handling port message:', err);
      }
    };

    const port = chrome.runtime.connect({
      name: 'tab_' + chrome.devtools.inspectedWindow.tabId,
    });

    port.onMessage.addListener(handlePortMessage);

    return () => {
      port.onMessage.removeListener(handlePortMessage);
      //port.disconnect();
      chrome.tabs.onUpdated.removeListener(onUpdate);
    };
  }, []);

  function getFileNameFromURL(url) {
    const segments = url.split('/');
    let fileName = segments[segments.length - 1];
    if (fileName.length > 20) {
      const extension = fileName.split('.').pop();
      const shortenedName = fileName.substr(0, 19);
      fileName = shortenedName + '..' + extension;
    }
    return fileName;
  }

  async function getImageSizeFormatted(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      const sizeInBytes = parseInt(contentLength, 10);
      const formattedSize = formatSize(sizeInBytes);
      return formattedSize;
    } catch (error) {
      console.error('Error fetching image size:', error);
      return 'Unknown';
    }
  }

  function formatSize(sizeInBytes) {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' B';
    } else if (sizeInBytes < 1024 * 1024) {
      return (sizeInBytes / 1024).toFixed(2) + ' KB';
    } else {
      return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  }

  // Sort the images by size in descending order
  const sortedImagesBySize = sortedImages.sort((a, b) => {
    const sizeA = parseSize(a.size);
    const sizeB = parseSize(b.size);
    return sizeB - sizeA;
  });

  // Utility function to parse the size string and convert it to bytes
  function parseSize(size) {
    const sizeNumber = parseFloat(size);
    const unit = size
      .replace(/[0-9. ]/g, '')
      .trim()
      .toLowerCase();
    switch (unit) {
      case 'kb':
        return sizeNumber * 1024;
      case 'mb':
        return sizeNumber * 1024 * 1024;
      default:
        return sizeNumber;
    }
  }

  return (
    <>
      <div className="tabs imagetabsbg fontSettings">Image File Info</div>
      <div
        className="fontSettings"
        style={{
          padding: '4px',
          minHeight: '75px',
          height: '75px',
          //maxHeight: '200px',
          border: '1px solid',
          overflow: 'auto',
          //resize: 'vertical',
        }}
      >
        {sortedImagesBySize.length > 0 && (
          <div>
            {sortedImagesBySize.map((obj, index) => (
              <div key={index}>
                {obj.url && (
                  <div
                    title={obj.url.split('/')[obj.url.split('/').length - 1]}
                  >
                    {obj.name} | {obj.size}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
