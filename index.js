// index.js

const { fetchMyIP } = require('./iss');
const { fetchCoordsByIP } = require('./iss');
const { fetchISSFlyOverTimes } = require('./iss');
const { nextISSTimesForMyLocation } = require('./iss');


// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('It worked! Returned IP:' , ip);
// });


// fetchCoordsByIP((error, latlong) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('Our coordinates Object is:' , latlong);
// });

// const exampleCoords = { latitude: '49.27670', longitude: '-123.13000' };

// { latitude: 43.5448048, longitude: -80.2481666 }

// fetchISSFlyOverTimes({ latitude: "43.5448048", longitude: "-80.2481666" }, (error, latlong) => {
//   if (error) {
//     console.log("The coordinates did not work!" , error);
//     return;
//   }
//   console.log('Our risetime Object is: ' , latlong);
// });

const printPassTimes = (passTimes) => {
  for (let time of passTimes) {

    let unixTimestamp = time.risetime;
    let milliseconds = unixTimestamp * 1000 // 1575909015000
    let date = new Date(milliseconds);

    console.log(`Next pass at ${date} for ${time.duration} seconds!`);
  };

};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimes(passTimes);
});