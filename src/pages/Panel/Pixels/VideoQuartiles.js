import React, { useRef, useEffect } from 'react';

export default function VideoQuartiles(props) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [props.pixels]);

  return (
    <div>
      VideoQuartiles:{new Date().getTime()}
      <div style={{ height: '100px', border: '1px solid', overflow: 'auto' }}>
        {props.pixels.length !== 0
          ? props.pixels.map((data, index) => (
              <div key={index}>
                {data.msg && data.msg.video && data.msg.video.pxl && (
                  <div>
                    {' '}
                    {JSON.stringify(data.msg.video)
                      .split('st:')[1]
                      .split('","')[0] || 'not found'}{' '}
                    | {data.msg.video.pxl}
                  </div>
                )}
              </div>
            ))
          : ''}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
