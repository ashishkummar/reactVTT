import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataChart from './DataChart';
import { Spinner } from 'react-bootstrap';
import '../Panel/bootstrap.min.css';

import './Popup.css';

const Popup = () => {
  const [statsData, setStatsData] = useState(false);

  useEffect(() => {
    axios
      .get('https://vtt-react-db.glitch.me/api/vtt_react')
      .then((response) => {
        const data = response.data;
        setStatsData(data);

        // Process the data as needed
        //https://vtt-react-db.glitch.me/
      })
      .catch((error) => {
        console.log(error.response);
        // Handle errors
        //https://smiling-aback-temper.glitch.me/
        //https://vtt-react-db.glitch.me/
      });
  }, []);

  function getUniqueInteractionsCount(data) {
    const uniqueInteractions = {};

    for (let i = 0; i < data.length; i++) {
      const interaction = data[i].interactedWith;

      if (uniqueInteractions[interaction]) {
        uniqueInteractions[interaction] += 1;
      } else {
        uniqueInteractions[interaction] = 1;
      }
    }

    return uniqueInteractions;
  }

  return (
    <>
      <div className="Appheading">:: STATS OF VDX Tester Tool ::</div>
      {console.log(statsData)}
      <div className="text">
        {' '}
        {statsData ? (
          <>
            {console.log(getUniqueInteractionsCount(statsData))}
            <DataChart data={getUniqueInteractionsCount(statsData)} />
          </>
        ) : (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" role="status"></Spinner>
          </div>
        )}{' '}
      </div>
    </>
  );
};

export default Popup;
