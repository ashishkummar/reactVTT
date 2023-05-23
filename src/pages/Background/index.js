console.log('details.url');
let desiURLfound = false;
let userReload = false;
var currentUrl = null;

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    // console.log('--> ', details.url);

    tabId = 'tab_' + details.tabId;
    windowId = 'win_' + details.windowId;

    //notifyDevtools({
    //type: tabId,
    //data: windowId,
    //});
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

// CHROME API on header
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    //CLICKLIVE
    if (details.url.indexOf('clickLive') != -1 && details.statusCode == 200) {
      console.log('clickLive ', details.url);

      if (getParameterByName('custom4', details.url).indexOf('id:') != -1) {
        notifyDevtools({
          pixel: {
            clickLive: getParameterByName('custom4', details.url),
            SE: true,
          },
        });
      } else {
        console.log('~~~~~~~ ', getParameterByName('custom1', details.url));

        notifyDevtools({
          pixel: {
            clickLive: getParameterByName('custom1', details.url),
            SE: true,
          },
        });
      }
    }

    //INTLIVE
    if (details.url.indexOf('intLive') != -1 && details.statusCode == 200) {
      if (getParameterByName('custom4', details.url).indexOf('id:') != -1) {
        console.info('SE');
        notifyDevtools({
          pixel: {
            intLive: getParameterByName('custom4', details.url),
            SE: true,
          },
        });
      } else {
        console.info('NON SE');
        notifyDevtools({
          pixel: {
            intLive: getParameterByName('custom1', details.url),
            SE: false,
          },
        });
      }
    }

    //PCLIVE
    if (details.url.indexOf('pcLive') != -1 && details.statusCode == 200) {
      if (getParameterByName('event', details.url) != null) {
        notifyDevtools({
          video: {
            video: getParameterByName('custom1', details.url),
            pxl: getParameterByName('event', details.url),
          },
        });
      }
    }
    // end of pixels

    ///-----------

    // fetch video info	details
    if (details.url.indexOf('.mp4') != -1) {
      notifyDevtools({
        videoURL: details.url,
      });
    }
    //// images
    if (
      details.url.indexOf('.jpg') != -1 ||
      details.url.indexOf('.jpeg') != -1 ||
      details.url.indexOf('.png') != -1 ||
      details.url.indexOf('.gif') != -1
    ) {
      if (details.url.indexOf('/mockmedia/') != -1) {
        notifyDevtools({
          imgURL: details.url,
        });
      }
    }
    // Designer Config ....
    //
    if (details.url.indexOf('designer-config.js') != -1) {
      if (details.url.indexOf('config.js&') === -1) {
        if (window.desifilegot == undefined) {
          console.log(fetchScript(details.url));
          window.desifilegot = true;
        }

        if (!userReload) {
          notifyDevtools({
            desiConfURL: details.url,
          });
        }
      }
    }

    //
    if (details.url.indexOf('demopages?published=true') != -1) {
      notifyDevtools({
        PubDemopagesURL: details.url,
      });
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);
/////////////////////////////////////////////////////////////////////////////////////

var ports = [];
let _activeTabIDBG = 'vdxVTTtool';
var tabId;
var windowId;

chrome.windows.getCurrent(function (currentWindow) {
  windowId = 'win_' + currentWindow.id;
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  tabId = 'tab_' + tabs[0].id;
});

chrome.runtime.onConnect.addListener(function (port) {
  ports.push(port);

  // Remove port when destroyed (eg when devtools instance is closed)
  port.onDisconnect.addListener(function () {
    var i = ports.indexOf(port);
    if (i !== -1) ports.splice(i, 1);
  });

  port.onMessage.addListener(function (request) {
    // Received message from devtools. Do something:
    console.log('Received message from devtools page', request);
    if (request.reload) {
      userReload = true;
      chrome.tabs.reload();
    }
  });
});

//
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  // check if the updated tab is the current tab
  if (changeInfo.status === 'loading') {
    userReload = false;
  }
});
// Function to send a message to background js
function notifyBackgroundJs(msgdata, medId) {
  console.log('notifyBackgroundJs called...', msgdata, medId);
}
///

// Function to receive a message from panel

function notifyDevtools(msg) {
  // find the relevant panel and send message.
  ports.forEach(function (port) {
    chrome.windows.getCurrent(function (w) {
      chrome.tabs.query({ active: true }, (tabs) => {
        if (tabId == port.name) {
          port.postMessage(msg);
        }
      });
    });
  });
}
// end of message to panel

//
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
////////////

let DesiDataFile = [];
let url = '';

function getDesiDataFile() {
  return new Promise((resolve, reject) => {
    resolve(DesiDataFile);
  });
}

async function fetchScript(url) {
  const response = await fetch(url);
  const scriptText = await response.text();
  const extractedPixels = extractText(scriptText);
  notifyDevtools({ desiConfDATA: extractedPixels });

  //console.log(extractedPixels);
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

function fetchDataFile(url) {
  console.log('fetchDataFile ...', url);
  return fetchScript(url);
}
