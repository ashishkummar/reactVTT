var contextMenu = false;
var mockId = false;

export function createContextMenu(url) {
  console.log(url);
  fetch(url + '&usecase=vtt')
    .then((response) => response.text())
    .then((contents) => {
      let dpUrl = JSON.parse(contents);
      mockId = dpUrl.data.urls[0].mockid;
      console.log(mockId);
    });

  //Right click Context manus
  var showForPages = ['https://creative.vdx.tv/', '*://vdx.tv/*'];

  // Remove the context menu item

  console.log('contextMenu', contextMenu);
  if (!contextMenu) {
    var parent = chrome.contextMenus.create({ title: 'VDX Viewer' });
    contextMenu = parent;
    chrome.contextMenus.create({
      title: 'Custom VDX View',
      parentId: parent,
      onclick: OnRightClickMenu,
    });

    chrome.contextMenus.create({
      title: 'SlimPic',
      parentId: parent,
      onclick: openSlimPic,
    });
  }

  // A generic onclick callback function.
  function OnRightClickMenu(info, tab) {
    if (
      (tab.url.indexOf('//vdx.exponential.com') === -1) === false ||
      (tab.url.indexOf('//creative.vdx.tv') === -1) === false
    ) {
    } else {
      alert('This feature is available for VDX Showcase page only.');
      let _notofic1 = {
        type: 'basic',
        iconUrl: 'images/img128.png',
        title: 'Showcase Page Alert',
        message: 'This feature is available for VDX Showcase page only.',
      };
      chrome.notifications.create(new Date().getTime().toString(), _notofic1);
      return;
    }

    let _baseCustURL =
      'https://creative.exponential.com/creative/devshowcase/VVT/customView1.html?';
    //if (_isThisSingleExecution) {
    //_baseCustURL =
    //'https://creative.exponential.com/creative/devshowcase/VVT/customView1.1.html?DExp=';
    // }
    /*
https://....customView1.html?
DExp=600034995&
DInf=600034995&
VCmi=600034995&
VCme=600034995&
CTV=600034995
*/
    let _custViewURL =
      _baseCustURL +
      'DExp=' +
      mockId +
      '&DInf=' +
      mockId +
      '&VCmi=' +
      mockId +
      '&VCme=' +
      mockId +
      '&CTV=' +
      mockId;
    /*
  if (_mobileInstream[0].mockid != 0) {
    _custViewURL +=
      "&MoIns=" + _mobileInstream[0].mockid + "_" + _mobileInstream[2].ad_size;
  } */

    window.open(_custViewURL, '_blank');
  }

  function openSlimPic() {
    window.open(
      'https://creative.exponential.com/creative/devshowcase/slimPic',
      '_blank'
    );
  }

  // End of  Context menu click
}
