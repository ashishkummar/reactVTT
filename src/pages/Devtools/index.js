console.log('Devtool panel loaded');

// Creating pannel..

chrome.devtools.panels.create(
  '[ VDX Tester Tool React]',
  'images/img16.png',
  '/panel.html',
  function (extensionPanel) {
    // ON SHOWING OF PANNEL..._____________________________________________________________________________

    // ON SHOWING OF PANNEL..._____________________________________________________________________________

    extensionPanel.onShown.addListener(function tmp(panelWindow) {
      // console.info("panel open ");
      // || (tabs[0].url).indexOf("creative.vdx.tv/internal")!=-1 || (tabs[0].url).indexOf("creative.vdx.tv/mock")!=-1
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        if (
          tabs[0].url.indexOf('creative.vdx.tv') != -1 ||
          tabs[0].url.indexOf('vdx.exponential.com') != -1
        ) {
          chrome.tabs.reload();
          //chrome.tabs.reload(tabs[0].id);
        }
      });

      extensionPanel.onShown.removeListener(tmp); // Run only once.
    });
  }
);
