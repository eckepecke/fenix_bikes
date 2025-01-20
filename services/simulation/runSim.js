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
                        // console.log(`Updating batches 1 to ${i + 1}`);  // Log the progress

                        // Loop through the batches up to the current batch `i`
                        for (let j = 0; j <= i; j++) {
                            console.log(`Updating batch ${j + 1}`);
                            for (const trip of simulatedTrips[j]) {
                                simManager.updateLocation(trip);
                            }
                        }
                        // console.log(`Finished updating batches 1 to ${i + 1}`);
                        flatSimulatedTrips = simulatedTrips.flat();
                        await bikeManager.saveBikesToDb(flatSimulatedTrips);
                    }
                })


                let activeSimBikes = [];

                // Socket.io setup
                io.on('connection', (socket) => {
                    console.log(`Socket connected: ${socket.id}`);
                
                    // Emit the latest bike data when a new client connects
                    socket.emit('location_update', activeSimBikes);
                
                    socket.on('disconnect', () => {
                        console.log(`Socket disconnected: ${socket.id}`);
                    });
                });
                
                // Periodic update and emit
                setInterval(async () => {
                    console.log("Getting bikes");
                    activeSimBikes = await bikeManager.getAllActiveBikes();

                    // Update location
                    if (activeSimBikes) {
                        console.log("simManager updating locations");
                        for (const bike of activeSimBikes) {
                            await simManager.updateLocation(bike);
                        }
                        
                        // Save to db after update
                        console.log("bikeManager saving to DB");
                        bikeManager.saveBikesToDb(activeSimBikes);
                
                        console.log(`Number of active bikes: ${activeSimBikes.length}`);
                    }
                
                    // Emit updated bike data to all connected clients
                    //io.emit('location_update', activeSimBikes);
                }, 5000);

                // Periodic update and emit
                setInterval(() => {
                    console.log("Emitting bikes");
                
                    // Emit updated bike data to all connected clients
                    io.emit('location_update', activeSimBikes);
                }, 5000);

    } catch (error) {
        console.error('Error setting up simulation:', error);
    }
};