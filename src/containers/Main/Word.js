import React, { useState, useEffect } from 'react';

function Word(props) {
  const { word, unicode, showWord = true, showGrid } = props;
  return (
    <>
      <svg
        // width="100%"
        // height="100%"
        x="0px"
        y="0px"
        viewBox="0 0 75.36 94.15"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>
            {`.st0{fill:none;stroke:#C6E5DF;stroke-width:0.85;stroke-miterlimit:10;}
   .st1{font-family: '標楷體', 'PMingLiU';}
   .st2{font-size:62px;}
   .st3{font-size:15px;}
   .st4{font-size:11px;}`}
          </style>
        </defs>
        <rect x="0.48" y="21.15" className="st0" width="74.44" height="71.67" />
        <rect x="56.41" y="1" className="st0" width="18.43" height="18.43" />

        {showGrid && (
          <>
            <g>
              <line className="st0" x1="50.18" y1="92.73" x2="50.18" y2="21.05" />
              <line className="st0" x1="25.22" y1="21.05" x2="25.22" y2="92.73" />
            </g>
            <g>
              <line className="st0" x1="0.48" y1="69.41" x2="74.92" y2="69.41" />
              <line className="st0" x1="74.92" y1="46.37" x2="0.48" y2="46.37" />
            </g>
          </>
        )}
        {showWord && <text transform="matrix(1 0 0 1 7.4388 74.2797)" className="st1 st2">{word}</text>}
        <text transform="matrix(1 0 0 1 58.4324 14.4726)" className="st1 st3">{word}</text>
        <text transform="matrix(1 0 0 1 1.1064 13.5204)" className="st1 st4">{unicode}</text>
      </svg>
    </>
  );
}

export default Word;
