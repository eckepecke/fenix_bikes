// const { io } = require("socket.io-client");

// const socket = io('localhost:1337');


// socket.on("connect", () => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
// });

// socket.on("disconnect", () => {
//     console.log(socket.id); // undefined
// });

// import data from './trips/lund-trip.json' assert { type: "json" };
// // console.log(data[0].trip1.coords[0]);

/* global io */

// const socket = io('localhost:1337');

// socket.on("connect", () => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
// });

// for (let coord in data[0].trip1.coords) {
//     setTimeout(() => {
//         console.log(data[0].trip1.coords[coord]);
//         let coordinates = data[0].trip1.coords[coord];
//         fetch("http://localhost:1337/test/location/update", {
//             method: "POST",
//             body: JSON.stringify({
//                 bike_id: "B0024",
//                 location: coordinates

//             }),
//             headers: {
//                 "Content-type": "application/json; charset=UTF-8"
//             }
//         });
//     }, coord * 5000);
//     // console.log(data[0].trip1.coords[coord]);
// };



