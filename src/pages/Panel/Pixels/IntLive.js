import React, { useRef, useEffect, useState } from 'react';
import FetchDesiConf from '../JsParsing/FetchDesiConf';
import CheckPixels from './CheckPixels';

export default function IntLive(prop) {
  const messagesEndRef = useRef(null);
  const [clickedPixel, setClickedPixel] = useState('');

  //prop.currentPixel && setClickedPixel(prop.currentPixel); //.match(/id:(.*?);/)[1]);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [prop.pixels]);

  return (
    <div>
      {' '}
      {
        <CheckPixels
          currentPixel={prop.currentPixel ? prop.currentPixel : undefined}
        ></CheckPixels>
      }
      IntLive: {new Date().getTime()}
      <div style={{ height: '100px', border: '1px solid', overflow: 'auto' }}>
        {prop.pixels.length !== 0
          ? prop.pixels.map((data, index) => (
              <div key={index}>
                {data.msg && data.msg.pixel.intLive && (
                  <div>
                    {
                      JSON.stringify(data.msg.pixel.intLive).match(
                        /id:(.*?);/
                      )[1]
                    }
                  </div>
                )}
              </div>
            ))
          : ''}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}
