import React, { useState, useRef, useEffect } from 'react';

export default function ImageFileInfo(prop) {
  const imagesEndRef = useRef(null);
  const [sortedImages, setSortedImages] = useState([]);

  useEffect(() => {
    //console.log(prop.imgURL.images);
    //return;
    imagesEndRef.current.scrollIntoView({ behavior: 'smooth' });

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
      const uniqueImages = [...new Set(images)];

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

    sortImages(prop.imgURL.images).then(setSortedImages);
  }, [prop.imgURL.images]);

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

  return (
    <div>
      ImageFileInfo {new Date().getTime()}
      <div style={{ height: '100px', border: '1px solid', overflow: 'auto' }}>
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
    </div>
  );
}
