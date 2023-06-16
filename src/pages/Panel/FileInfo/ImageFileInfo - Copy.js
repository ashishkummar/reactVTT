import React, { useState, useRef, useEffect } from 'react';

export default function ImageFileInfo(prop) {
  const imagesEndRef = useRef(null);
  const [sortedImages, setSortedImages] = useState([]);
  const [ImageFiles, setImageFiles] = useState([{}]);

  useEffect(() => {
    // calculate the file size of each image URL in bytes
    const getImageSize = (url) => {
      return fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then((blob) => {
          return blob.size;
        })
        .catch((error) => {
          console.error('Error calculating image size:', error);
          return 0;
        });
    };

    // sort the images in descending order by file size
    const sortImages = async (images) => {
      const uniqueImages = [...new Set(images.images)];

      const uniqueImageObjects = await Promise.all(
        uniqueImages.map(async (url) => {
          const size = await getImageSize(url);
          return { url, size };
        })
      );

      const sortedImageObjects = uniqueImageObjects.sort(
        (a, b) => b.size - a.size
      );

      return sortedImageObjects;
    };

    sortImages(ImageFiles).then(setSortedImages);
  }, [ImageFiles]);

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const trimName = (str) => {
    const inputString = str;
    let trimmedString = inputString.replace(/"/g, '').substring(0, 12);

    if (inputString.length > 12) {
      const fileExtension = inputString.split('.').pop();
      trimmedString = trimmedString + '....' + fileExtension;
    }

    return trimmedString;
  };

  let images = [];
  useEffect(() => {
    function handlePortMessage(msg) {
      try {
        if (msg.imgURL !== undefined) {
          images.push(msg.imgURL.split('?')[0]);
          images = Array.from(new Set(images));

          setTimeout(() => {
            setImageFiles({ images });
          }, 6000);
        }
      } catch (err) {
        //console.log('errInfo from video quartile ', err, 'msg  = ', msg);
      }
    }

    var port = chrome.runtime.connect({
      name: 'tab_' + chrome.devtools.inspectedWindow.tabId,
    });

    // add the listener once when the component mounts
    port.onMessage.addListener(handlePortMessage);

    return () => {
      port.onMessage.removeListener(handlePortMessage);
      //port.disconnect();
    };
  }, []);

  // clean up the listener when the component unmounts or page refreshes
  window.addEventListener('beforeunload', () => {
    //port.onMessage.removeListener(handlePortMessage);
  });

  const onUpdate = (tabId, changeInfo, tab) => {
    if (
      tabId === chrome.devtools.inspectedWindow.tabId &&
      changeInfo.status === 'loading'
    ) {
      console.log('REFRESH');
      setSortedImages([]);
    }
    chrome.tabs.onUpdated.removeListener(onUpdate);
  };
  chrome.tabs.onUpdated.addListener(onUpdate);

  return (
    <div>
      ImageFileInfo {new Date().getTime()}
      {
        <div
          style={{
            padding: '5px',
            height: '100px',
            border: '1px solid',
            overflow: 'auto',
          }}
        >
          {sortedImages.map((obj, index) => (
            <div
              title={obj.url.split('/')[obj.url.split('/').length - 1]}
              key={index}
            >
              {' '}
              {trimName(obj.url.split('/')[obj.url.split('/').length - 1])}
              {' | '}
              {formatBytes(obj.size)}
            </div>
          ))}
          <div ref={imagesEndRef} />
        </div>
      }
    </div>
  );
}
