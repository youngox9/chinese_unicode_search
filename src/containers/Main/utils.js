import { v4 as uuidv4 } from 'uuid';

export function hexCovert(hex) {
  return parseInt(hex, 16);
}

export function hexReverse(hex) {
  return hex.toString(16).toUpperCase();
}

export function getWords(range = []) {
  return range.reduce((prev, curr, index) => {
    let words = [];
    if (Array.isArray(curr)) {
      const [fromCode, toCode] = curr;
      let from = hexCovert(fromCode);
      let to = hexCovert(toCode);
      for (let i = from; i < to; i++) {
        let word = String.fromCharCode(i);
        const unicode = hexReverse(i);
        words.push({
          key: uuidv4(),
          unicode,
          word,
        });
      }
      return [...prev, ...words];
    } if (typeof curr === 'string') {
      const uniIndex = hexCovert(curr.toUpperCase());
      let word = String.fromCharCode(uniIndex);
      // console.log(unicode, word);
      return [...prev, {
        key: uuidv4(),
        unicode: curr,
        word,
      }];
    }
    return prev;
  }, []);
}

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export async function getImage(src) {
  return new Promise(rsv => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      rsv(img);
    };
  });
}

export function svgToImg(svgString, format = 'image/png') {
  return new Promise(rsv => {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let img = new Image();
    let svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    let url = URL.createObjectURL(svg);

    img.onload = async () => {
      const maxW = 500;
      canvas.width = maxW;
      canvas.height = img.height * maxW / img.width;
      ctx.drawImage(img, 0, 0);
      let u = canvas.toDataURL(format);
      const res = await getImage(u);
      rsv({ img: res, url: u });
    };
    img.src = url;
  });
}

export const toUnicode = function (char) {
  let result = [];
  for (let i = 0; i < char.length; i++) {
    // Assumption: all characters are < 0xffff
    result.push(`\\u${(`000${char[i].charCodeAt(0).toString(16)}`).substr(-4)}`);
  }
  return result;
};
