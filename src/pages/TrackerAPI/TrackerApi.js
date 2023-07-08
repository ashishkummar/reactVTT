class TrackerApi {
  trackUserVisit(intLive) {
    function getUniqueUserId() {
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000000);
      return `user-${timestamp}-${randomNum}`;
    }

    function getBrowserInfo() {
      const userAgent = navigator.userAgent;
      let name;
      let version;

      if (userAgent.includes('Chrome')) {
        name = 'Google Chrome';
        version = userAgent.match(/Chrome\/(\d+)/)[1];
      } else if (userAgent.includes('Firefox')) {
        name = 'Mozilla Firefox';
        version = userAgent.match(/Firefox\/(\d+)/)[1];
      } else if (userAgent.includes('Safari')) {
        name = 'Apple Safari';
        version = userAgent.match(/Version\/(\d+)/)[1];
      } else if (userAgent.includes('Edge')) {
        name = 'Microsoft Edge';
        version = userAgent.match(/Edge\/(\d+)/)[1];
      } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
        name = 'Opera';
        version = userAgent.match(/(?:Opera|OPR)\/(\d+)/)[1];
      } else if (userAgent.includes('Trident') || userAgent.includes('MSIE')) {
        name = 'Internet Explorer';
        version = userAgent.match(/(?:MSIE |rv:)(\d+)/)[1];
      } else {
        name = 'Unknown Browser';
        version = 'Unknown Version';
      }

      return { name, version };
    }

    function getCurrentDateTime() {
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();
      return `${date} ${time}`;
    }

    // Get stored visit count from local storage
    let visitCount = localStorage.getItem('visitCount') || 0;
    visitCount = parseInt(visitCount);

    // Increment the visit count
    visitCount++;

    // Store the updated visit count in local storage
    localStorage.setItem('visitCount', visitCount);

    // Get browser and OS information
    const browserInfo = getBrowserInfo();
    const os = navigator.platform;

    // Generate a unique user ID
    const userId = getUniqueUserId();

    // Get the current visit date and time
    const visitDateTime = getCurrentDateTime();

    // Create an object with all the captured information
    const visitData = {
      browser: browserInfo.name + ' ' + browserInfo.version,
      os,
      userId,
      visitCount,
      visitDateTime,
      interactedWith: intLive,
    };

    // Log the visit data
    return visitData;

    // You can send the visit data to your server or perform other actions as needed
  }

  // Call the trackUserVisit function when the page loads

  intLive(_int) {
    return _int;
  }
}

export default TrackerApi;
