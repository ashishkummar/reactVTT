import React, { useRef, useEffect, useState } from 'react';
import FetchDesiConf from '../JsParsing/FetchDesiConf';
import CheckPixels from './CheckPixels';

export default function ClickLive(prop) {
  const messagesEndRef = useRef(null);

  //

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [prop.pixels]);

  return (
    <>
      {' '}
      {
        <CheckPixels
          currentPixel={prop.currentPixel ? prop.currentPixel : undefined}
        ></CheckPixels>
      }
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>{new Date().getTime()} </div>
        <div>
          {/*
          <FetchDesiConf
            showPixel="clickLive"
            currentPixel={prop.currentPixel}
          ></FetchDesiConf>
        */}
        </div>
      </div>
      <div style={{ height: '100px', border: '1px solid', overflow: 'auto' }}>
        {prop.pixels.length !== 0
          ? prop.pixels.map((data, index) => (
              <div key={index}>
                {data.msg && data.msg.pixel.clickLive && (
                  <div>
                    {JSON.stringify(
                      data.msg.pixel.clickLive
                        .split(':')[1]
                        .slice(0, data.msg.pixel.clickLive.indexOf(';'))
                    )}
                  </div>
                )}
              </div>
            ))
          : ''}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
