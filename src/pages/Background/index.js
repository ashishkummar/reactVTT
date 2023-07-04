let tabId;
let userReload = false;
let editedDesiConf = '';

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    // Designer Config ....
    //
    /*  if (details.url.indexOf('designer-config.js') != -1) {
      if (details.url.indexOf('config.js&') === -1) {
        if (details.url.indexOf('?cacheBurst') === -1) {
          notifyDevtools({
            desiConfURL: details.url,
          });
        }
      }
    } */

    //

    if (details.url.indexOf('designer-config.js') != -1) {
      if (details.url.indexOf('config.js&') === -1) {
        if (details.url.indexOf('?cacheBurst') === -1) {
          notifyDevtools({
            desiConfURL: details.url,
          });
        }
        if (editedDesiConf !== '') {
          if (editedDesiConf.length >= 1) {
            return {
              redirectUrl: unescape(encodeURIComponent(editedDesiConf)),
            };
          }
        }
      }
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

// CHROME API on header
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    tabId = 'tab_' + details.tabId;
    //CLICKLIVE
    if (details.url.indexOf('clickLive') != -1 && details.statusCode == 200) {
      if (getParameterByName('custom4', details.url).indexOf('id:') != -1) {
        notifyDevtools({
          pixel: {
            clickLive: getParameterByName('custom4', details.url),
            SE: true,
          },
        });
      } else {
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
      console.info(getParameterByName('custom4', details.url));

      if (getParameterByName('custom4', details.url).indexOf('id:') != -1) {
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
      if (details.url.indexOf('init.mp4') !== -1) {
        notifyDevtools({
          videoURL: details.url,
        });
      }
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
    //..//
    if (details.url.indexOf('demopages?published=true') != -1) {
      notifyDevtools({
        PubDemopagesURL: details.url,
      });
    }
    //..//
    if (details.url.indexOf('&designerConfig=') != -1) {
      notifyDevtools({
        adUnitType: details.url,
      });
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);
/////////////////////////////////////////////////////////////////////////////////////

var ports = [];

function notifyDevtools(msg) {
  // find the relevant panel and send message.

  ports.forEach(function (port) {
    if (port.name === tabId) {
      port.postMessage(msg);
    }
  });
}

chrome.runtime.onConnect.addListener(function (port) {
  ports.push(port);

  // Remove port when destroyed (eg when devtools instance is closed)
  port.onDisconnect.addListener(function () {
    var i = ports.indexOf(port);
    console.log('onDisconnected port ', ports, i);
    if (i !== -1) ports.splice(i, 1);
  });

  // Received message from devtools. Do something:
  port.onMessage.addListener(function (request) {
    console.log('Received message from devtools page', request);
    if (request.reload) {
      userReload = true;
      editedDesiConf = request.editedDesiConf;
      chrome.tabs.reload();
    } else {
      editedDesiConf = '';
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
///

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
