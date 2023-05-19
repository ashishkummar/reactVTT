import React, { useEffect, useState } from 'react';

const baseUrl =
  'https://cdnx-mock.tribalfusion.com/mockmedia/600028402//assets/';

export default function VideoFileInfo(prop) {
  const [fileSize, setFileSize] = useState(null);

  // listen for tab updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    // check if the updated tab is the current tab
    if (
      tabId === chrome.devtools.inspectedWindow.tabId &&
      changeInfo.status === 'loading'
    ) {
      setFileSize('');
    }
  });

  useEffect(() => {
    let moreFiles = true;
    let counter = 1;
    const fileSizes = [];

    function fetchFile() {
      if (!moreFiles) {
        // console.log('No more files found.');
        // console.log('File sizes:', fileSizes);
        setFileSize(fileSizes);
        return;
      }

      const url = `${baseUrl}video${counter}.mp4`;
      fetch(url)
        .then((response) => {
          if (response.ok) {
            const fileSize = response.headers.get('Content-Length');
            fileSizes.push(fileSize);
            counter++;
            fetchFile();
          } else {
            moreFiles = false;
            fetchFile();
          }
        })
        .catch((error) => {
          console.error('Error fetching file:', error);
          counter++;
          fetchFile();
        });
    }

    if (prop.vidURL[0].videoURL !== undefined) {
      fetchFile();
    }

    return () => {
      moreFiles = false;
    };
  }, [prop.vidURL]);

  return (
    <div>
      VideoFileInfo {new Date().getTime()}
      <div style={{ height: '100px', border: '1px solid', overflow: 'auto' }}>
        {fileSize !== null ? `File size: ${fileSize} bytes` : ''}
      </div>
    </div>
  );
}
