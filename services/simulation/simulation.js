// const { io } = require("socket.io-client");

// const socket = io('localhost:1337');


// socket.on("connect", () => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
// });

// socket.on("disconnect", () => {
//     console.log(socket.id); // undefined
// });

import data from './trips/lund-trip.json' assert { type: "json" };
// console.log(data[0].trip1.coords[0]);

for (let coord in data[0].trip1.coords) {
    setTimeout(() => {
        console.log(data[0].trip1.coords[coord]);
    }, coord * 2000);
    // console.log(data[0].trip1.coords[coord]);

};



