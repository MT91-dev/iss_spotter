// const { fetchMyIP } = require('./iss_promised');
// const { fetchCoordsByIP } = require('./iss_promised');
// const { fetchISSFlyOverTimes } = require('./iss_promised');
const { nextISSTimesForMyLocation } = require('./iss_promised');


const printPassTimes = (passTimes) => {
  for (let time of passTimes) {

    let unixTimestamp = time.risetime;
    let milliseconds = unixTimestamp * 1000 // 1575909015000
    let date = new Date(milliseconds);

    console.log(`Next pass at ${date} for ${time.duration} seconds!`);
  };

};

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });

nextISSTimesForMyLocation();