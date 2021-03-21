/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/style-prop-object */
import _ from 'lodash';
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import { v4 as uuidv4 } from 'uuid';
import { jsPDF as JSPDF } from 'jspdf';
import ReactDOMServer from 'react-dom/server';
import Word from './Word';
import { getWords, asyncForEach, svgToImg } from './utils';
import LoadingImg from '~~static/images/loading.gif';

const LoadingModal = styled.div`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: relative;
  background-color: rgba(0,0,0,0.6);
  position:fixed;
  top:0;
  left: 0;
  z-index: 99;
  width: 100%;
  height: 100%;
  .loading-content {
    display: block;
    top: 50%;
    left: 50%;
    position:absolute;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 12px;
    border-radius: 12px;
    text-align:center;
    p {
      font-size: 24px;
    }
    
  }
`;

const WordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding-right: 12px;
  .word-col{
    flex: 0 ${({ colWidth }) => colWidth}%;
    display: flex;
    padding: 6px;
  }
`;

const UNICODE_RANGE = [
  ['4E00', '9FFF'],
  // // 日文
  ['3040', '309F'],
  ['30A0 ', '30FF']
];

function Main() {
  const el = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [columnCount, setColumnCount] = useState(3);
  const [rowCount, setrowCount] = useState(4);
  const [unicodeRange, setUnicodeRange] = useState(UNICODE_RANGE);
  const [showWord, setShowWord] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [searchWord, setSearchWord] = useState('');

  const [words, setWords] = useState([]);
  const [printMode, setPrintMode] = useState(false);

  const pageWordCount = columnCount * rowCount;

  const pageCount = Math.ceil(words.length / pageWordCount);
  const pageWords = words.slice(pageWordCount * pageIndex, pageWordCount * pageIndex + pageWordCount);

  useEffect(() => {
    const newWords = getWords(unicodeRange);
    const filteredWords = newWords.filter(obj => (searchWord ? searchWord.includes(obj.word) : true));
    setWords(filteredWords);
  }, [unicodeRange, searchWord]);

  async function exportAllPage() {
    setIsLoading(true);
    const pdf = new JSPDF({
      unit: 'px',
      compress: true,
      format: 'a4'
    });

    const PDF_PAD_X = 50;
    const PDF_PAD_Y = 10;
    const pageWidth = pdf.internal.pageSize.getWidth() - (PDF_PAD_X * 2);

    await asyncForEach(words, async (o, idx) => {
      const index = idx % pageWordCount;
      const xIndex = index % columnCount;
      const yindex = Math.floor((index) / columnCount);
      const obj = words[idx];
      const svgHtml = ReactDOMServer.renderToStaticMarkup(<Word showWord={showWord} showGrid={showGrid} {...obj} />);
      const { img } = await svgToImg(svgHtml);

      const { width, height } = img;

      const imgWidth = pageWidth / columnCount;
      const imgHeight = height * imgWidth / width;
      const x = PDF_PAD_X + (xIndex * imgWidth);
      const y = PDF_PAD_Y + (yindex * imgHeight);

      if (idx > 0 && index === 0) { pdf.addPage(); }
      const p = (idx / words.length * 100).toFixed(2);
      setProgress(p);
      pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
    });
    pdf.save('Unicode漢字檢索.pdf');
    setIsLoading(false);
  }

  return (
    <>
      <LoadingModal open={isLoading}>
        <div className="loading-content">
          <img alt="" src={LoadingImg} />
          <p>
            {`${_.toString(progress)}%`}
          </p>
        </div>
      </LoadingModal>
      <div className="container">
        <div className="content">
          {!printMode && (
            <div className="jumbotron">
              <h1>Unicode漢字檢索</h1>
              <div className="form-row align-items-end">
                <div className="col-md-12">
                  <label>搜尋單字：</label>
                  <input type="text" className="form-control" placeholder="請輸入字串" value={searchWord} onChange={e => setSearchWord(e.target.value)} />
                </div>
                <div className="col-md-2">
                  <label>Column</label>
                  <input type="number" className="form-control" value={columnCount} min="1" onChange={e => setColumnCount(e.target.value)} />
                </div>
                <div className="col-md-2">
                  <label>Row</label>
                  <input type="number" className="form-control" value={rowCount} min="1" onChange={e => setrowCount(e.target.value)} />
                </div>
                <div className="col-md-auto">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={showWord} onChange={e => setShowWord(!showWord)} />
                    <label className="form-check-label">顯示格線內文字</label>
                  </div>
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={showGrid} onChange={e => setShowGrid(!showGrid)} />
                    <label className="form-check-label">顯示格線</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="btn-group">
                    <button type="button" className="btn btn-primary" onClick={exportAllPage}>列印全部</button>
                  </div>
                </div>
              </div>

            </div>
          )}
          <h3>
            {`共 ${words.length}個字  第${pageIndex}/${pageCount}頁`}
          </h3>
          <WordContainer className="words" colWidth={Math.floor(100 / columnCount)} ref={el}>
            {pageWords.map((obj, i) => {
              return (
                <div className="word-col" key={obj.key}>
                  <Word {...obj} showWord={showWord} showGrid={showGrid} />
                </div>
              );
            })}
          </WordContainer>

          {!printMode && (
            <ReactPaginate
              pageCount={pageCount}
              forcePage={pageIndex}
              containerClassName="pagination pagination-lg justify-content-center"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              activeClassName="active"
              onPageChange={({ selected }) => { console.log(selected); setPageIndex(selected); }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Main;
