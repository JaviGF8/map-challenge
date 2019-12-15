import axios from 'axios';

const GEOCODE_URL = 'https://stuart-frontend-challenge.now.sh/geocode';
const JOBS_URL = 'https://stuart-frontend-challenge.now.sh/jobs';

const apiPost = (url, params) =>
  new Promise((resolve, reject) => {
    if (params) {
      axios
        .post(url, params)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(new Error('Wrong params'));
    }
  });

export const getGeocode = (address) => apiPost(GEOCODE_URL, { address });

export const getJobs = (pickup, dropoff) => apiPost(JOBS_URL, { pickup, dropoff });
