import axios from 'axios';
import TrackerApi from './TrackerApi';

class Trackvtt {
  track(intType) {
    const trackerApi = new TrackerApi(); // Create an instance of the TrackerApi subclass
    const visitData = trackerApi.trackUserVisit(intType); // Call the trackUserVisit method

    axios
      .post('https://vtt-react-db.glitch.me/api/vtt_react', visitData)
      .then((response) => {
        console.log('post response', response.data);
        // Handle the response if needed
      })
      .catch((error) => {
        console.log('post error', error);
        // Handle errors
      });
  }
}

export default Trackvtt;
