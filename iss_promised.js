// iss_promised.js
const request = require('request-promise-native');

const fetchMyIP = function () {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function (body) {
  let IP = JSON.parse(body).ip
  return request(`http://ipwho.is/${IP}`);

};

const fetchISSFlyOverTimes = function (body) {
  let coordinates = JSON.parse(body)
  return request(`https://iss-pass.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`);

};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

// module.exports = {
//   fetchMyIP,
//   fetchCoordsByIP,
//   fetchISSFlyOverTimes
// };

module.exports = {
  nextISSTimesForMyLocation
};