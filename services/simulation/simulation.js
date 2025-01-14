
import data from './trips/test-data.json' with { type: 'json' };

const simManager = {
    getSimCoordinates: async function getSimCoordinates() {
        return data.map((trip) => {
            const tripKey = Object.keys(trip)[0];
            const coordinates = trip[tripKey].coords;
            return { tripKey, coordinates };
        });
    }
};

export default simManager;

//   const result = getFirstCoordinates(data);
//   console.log(result);


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



