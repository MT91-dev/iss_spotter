/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

let coordsWithIp = "http://ipwho.is/";
let coords = {};

const fetchMyIP = function (callback) {
  request('https://api.ipify.org?format=json', function (error, response, body) {
    // console.error('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ipObject = JSON.parse(body);
    const ip = ipObject.ip;
    coordsWithIp += ip;
    callback(error, ip);

  });
  // use request to fetch IP address from JSON API
};


const fetchCoordsByIP = function (ip, callback) {
  request(coordsWithIp, function (error, response, body) {
    // request("http://ipwho.is/42", function (error, response, body) {
    // console.error('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.

    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinates via IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const coordsObject = JSON.parse(body);
    coords["latitude"] = coordsObject.latitude;
    coords["longitude"] = coordsObject.longitude;

    if (coordsObject.success === false) {
      const msg = `The IP: ${coordsObject.ip} is not a valid IP address`;
      callback(Error(msg), null);
      return;
    }

    callback(error, coords);
  });
};


/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function (coordinates, callback) {
  // const coordsLink = `https://iss-pass.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.latitude}`;
  request(`https://iss-pass.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`, function (error, response, body) {
    // console.error('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching the next flyover. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const risetime = JSON.parse(body).response;

    if (!risetime.message === "success") {
      const msg = `The Coordinates: ${coords.latitude} & ${coords.longitude} are not valid`;
      callback(Error(msg), null);
      return;
    }

    callback(error, risetime);
  });

};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }
    // console.log('It worked! Returned IP:', ip);
    // callback(ip);

    fetchCoordsByIP(ip, (error, latlong) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }
      // callback(latlong);
      // console.log('Our coordinates Object is:', latlong);


      fetchISSFlyOverTimes(latlong, (error, risetime) => {
        if (error) {
          console.log("The coordinates did not work!", error);
          return;
        }
        callback(error, risetime);
        // console.log('Our risetime Object is: ', latlong);

      });
    });
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};