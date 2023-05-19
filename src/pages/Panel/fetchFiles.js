let DesiDataFile = [];
let url = '';

export function storeDesiDataFile(data) {
  DesiDataFile = data;
}

export function getDesiDataFile() {
  return new Promise((resolve, reject) => {
    resolve(DesiDataFile);
  });
}

async function fetchScript(url) {
  const response = await fetch(url);
  const scriptText = await response.text();
  const extractedPixels = extractText(scriptText);

  return extractedPixels;
}

const extractText = (text) => {
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
      clickLives.push(data.split(',')[0].split('"').join(''));
    } else {
      intLives.push(data.split(',')[0].split('"').join(''));
    }
  });

  return { clickLives, intLives };
};

export function fetchDataFile(url) {
  console.log('fetchDataFile ...');
  return fetchScript(url);
}
