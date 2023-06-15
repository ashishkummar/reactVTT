import React, { useEffect, useState } from 'react';

let baseUrl = 'https://cdnx-mock.tribalfusion.com/mockmedia/600028402//assets/';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

function formatDuration(duration) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);
  const milliseconds = Math.floor((duration % 1) * 1000);

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  const formattedMilliseconds = milliseconds.toString().padStart(3, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

export default function VideoFileInfo(prop) {
  const [fileSize, setFileSize] = useState(null);

  const onUpdate = (tabId, changeInfo, tab) => {
    if (
      tabId === chrome.devtools.inspectedWindow.tabId &&
      changeInfo.status === 'loading'
    ) {
      setFileSize('');
    }
  };
  chrome.tabs.onUpdated.addListener(onUpdate);

  let moreFiles = true;
  let counter = 1;
  const fileSizes = [];

  useEffect(() => {
    function handlePortMessage(msg) {
      try {
        if (msg.videoURL !== undefined) {
          baseUrl = msg.videoURL.split('/assets/')[0] + '/assets/';

          fetchFile();
        }
      } catch (err) {
        console.log('errInfo from video quartile ', err, 'msg  = ', msg);
      }
    }

    var port = chrome.runtime.connect({
      name: 'tab_' + chrome.devtools.inspectedWindow.tabId,
    });

    // add the listener once when the component mounts
    port.onMessage.addListener(handlePortMessage);

    return () => {
      port.onMessage.removeListener(handlePortMessage);
      port.disconnect();
      chrome.tabs.onUpdated.removeListener(onUpdate);
    };

    function fetchFile() {
      if (!moreFiles) {
        // console.log('No more files found.');

        setFileSize(fileSizes);
        return;
      }

      const url = `${baseUrl}video${counter}.mp4`;

      // Fetch file size
      fetch(url)
        .then((response) => {
          if (response.ok) {
            const fileSize = response.headers.get('Content-Length');
            // Fetch file duration
            fetch(url)
              .then((durationResponse) => {
                if (durationResponse.ok) {
                  durationResponse.blob().then((blob) => {
                    const video = document.createElement('video');
                    video.src = URL.createObjectURL(blob);
                    video.addEventListener('loadedmetadata', () => {
                      const fileDuration = video.duration;
                      fileSizes.push({
                        size: fileSize,
                        duration: fileDuration,
                      });
                      counter++;
                      fetchFile();
                    });
                    video.addEventListener('error', (error) => {
                      console.error('Error fetching file duration:', error);
                      moreFiles = false;
                      counter++;
                      fetchFile();
                    });
                    video.load();
                  });
                } else {
                  console.error(
                    'Error fetching file duration:',
                    durationResponse.status
                  );
                  moreFiles = false;
                  counter++;
                  fetchFile();
                }
              })
              .catch((error) => {
                console.error('Error fetching file duration:', error);
                moreFiles = false;
                counter++;
                fetchFile();
              });
          } else {
            moreFiles = false;
            counter++;
            fetchFile();
          }
        })
        .catch((error) => {
          console.error('Error fetching file:', error);
          moreFiles = false;
          counter++;
          fetchFile();
        });
    }
  }, []);
  return (
    <div>
      Video Size and Duration
      <div
        style={{
          height: '95px',
          border: '1px solid',
          overflow: 'auto',
          padding: '4px',
        }}
      >
        {Array.isArray(fileSize) && fileSize.length > 0 ? (
          fileSize.map((data, index) => {
            return (
              <span key={index}>
                Video {index + 1} = {formatBytes(data.size)} | Duration :{' '}
                {formatDuration(data.duration)}
                <br />
              </span>
            );
          })
        ) : (
          <span> </span>
        )}
      </div>
    </div>
  );
}
