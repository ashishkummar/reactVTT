import React from 'react';
import { createContext, useState, useEffect } from 'react';
const DataContext = createContext();

const DataContextProvider = ({ url, children }) => {
  const [data, setData] = useState([
    { clickLives: [], intLives: [] },
    { desiAPIdata: 'designer api code..', url: '' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then((response) => {
      //setData(response);

      setData((prevData) => [response, { ...prevData[1] }]);

      setLoading(false);
    });
  }, [url]);

  const fetchData = async () => {
    try {
      //  console.log('url inside DataContext Provider', typeof url === 'string', url === '', url);
      if (typeof url !== 'string') return;

      setData((prevData) => [
        { ...prevData[0] }, //
        { ...prevData[1], url: url },
      ]);

      const response = await fetch(url + '?cacheBurst=' + Math.random());

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = extractText(await response.text());

      return data;
    } catch (error) {
      // Handle the error
      //  console.error('An error occurred:', error);
      // Optionally, you can throw or return an error object
      throw error;
    }
  };

  const extractText = (text) => {
    setData((prevData) => [
      { ...prevData[0] }, //
      { ...prevData[1], desiAPIdata: text },
    ]);
    const regex = /Expo\.designerAPI\.firePixel\((.*?)\)/g;
    const matches = text.matchAll(regex);
    const pixels = [];
    for (const match of matches) {
      pixels.push(match[1]);
    }

    const clickLives = [];
    const intLives = [];

    pixels.forEach((data, index) => {
      if (data.split(',')[1].indexOf('clickLive') !== -1) {
        clickLives.push({
          clicks: data.split(',')[0].split('"').join(''),
          checked: false,
        });
      } else {
        intLives.push({
          ints: data.split(',')[0].split('"').join(''),
          checked: false,
        });
      }
    });

    return { clickLives, intLives };
  };

  return (
    <DataContext.Provider value={{ data, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataContextProvider };
