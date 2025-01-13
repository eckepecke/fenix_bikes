import simManager from "./simManager.js";
import bikeManager from "../bike-logic/bikeManager.js";
import simSetup from "./simSetup.js";

let simulatedTrips = [];
let flatSimulatedTrips = {};

export const startSimulation = async (io) => {
    try {
        // Empty the bike collection
        await simManager.emptyBikeCollection();
        console.log('Bike collection emptied');
    } catch (error) {
        console.error('Error emptying bike collection:', error);
    }

    try {
        // Set up the simulation
        simManager.emptyBikeCollection()
                .then(() => {
                    console.log('Bike collection emptied');
                })
                .catch((error) => {
                    console.error('Error emptying bike collection:', error);
                });
        
                simSetup(simManager).then(async (data) => {
                    console.log("setting up sim..")
                // Some of this should move simulation model
                    simulatedTrips = data;

                    const totalBatches = simulatedTrips.length;  // Assuming there are 7 batches

                    // Loop over each batch progressively
                    for (let i = 0; i < totalBatches; i++) {
                        console.log(`Updating batches 1 to ${i + 1}`);  // Log the progress

                        // Loop through the batches up to the current batch `i`
                        for (let j = 0; j <= i; j++) {
                            console.log(`Updating batch ${j + 1}`);
                            for (const trip of simulatedTrips[j]) {
                                simManager.updateLocation(trip);
                            }
                        }
                        console.log(`Finished updating batches 1 to ${i + 1}`);
                        flatSimulatedTrips = simulatedTrips.flat();
                        await bikeManager.saveBikesToDb(flatSimulatedTrips);
                    }
                })
        // Socket.io setup for emitting bike location updates
        io.on('connection', async (socket) => {
            console.log(`Socket connected: ${socket.id}`);

            setInterval(async () => {
                console.log("Getting bikes");
                let activeSimBikes = await bikeManager.getAllActiveBikes();

                if (activeSimBikes) {
                    console.log("simManager updating locations");
                    for (const bike of activeSimBikes) {
                        await simManager.updateLocation(bike);
                    }
                }

                console.log("bikeManager saving to DB");
                await bikeManager.saveBikesToDb(activeSimBikes);

                // Fetch the active bikes again after saving
                activeSimBikes = await bikeManager.getAllActiveBikes();
                console.log(`Number of active bikes: ${activeSimBikes.length}`);
                socket.emit('location_update', activeSimBikes);  // Emit location update to the client
            }, 5000);
        });
    } catch (error) {
        console.error('Error setting up simulation:', error);
    }
};