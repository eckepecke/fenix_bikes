import React, { useEffect, useState, JSX, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
  Polygon,
} from "react-leaflet";
import L from "leaflet";
import scooterIcon from "/src/assets/scooter-pin.png";
import chargingIcon from "/src/assets/charging-station.png";
import parkingIcon from "/src/assets/parking-spot.png";
import "./index.css";
import io from "socket.io-client";

interface LocationUpdateData {
  latitude: number;
  longitude: number;
  [key: string]: any; // Extendable for additional fields if needed
}

const Map: React.FC = () => {
  const { city } = useParams<{ city: string }>();
  const [cityBorders, setCityBorders] = useState<any>(null);
  const [cityCenter, setCityCenter] = useState<[number, number] | null>(null);
  const socket = useRef(io());
  const [bikeMarkers, setBikeMarkers] = useState<JSX.Element[]>([]);
  const [chargingStationMarkers, setChargingStationMarkers] = useState<
    JSX.Element[]
  >([]);
  const [parkingZonePolygons, setParkingZonePolygons] = useState<JSX.Element[]>(
    []
  );

  // ett sätt att bibehålla å, ä och ö när vi skriver ut stadens namn
  const cityNameDisplay: { [key: string]: string } = {
    lund: "Lund",
    solna: "Solna",
    skelleftea: "Skellefteå",
  };

  const scooterMarker = L.icon({
    iconUrl: scooterIcon,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -40],
  });

  const chargingStationMarker = L.icon({
    iconUrl: chargingIcon,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [1, -20],
  });

  const parkingSpotMarker = L.icon({
    iconUrl: parkingIcon,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [1, -20],
  });

  const updateBikeMarkers = (
    updateInput: LocationUpdateData | LocationUpdateData[]
  ) => {
    let bikeObjects: LocationUpdateData[];

    if (Array.isArray(updateInput)) {
      console.log("Input is an array:", updateInput);
      bikeObjects = updateInput; // Keep the entire array of bike objects
      console.log("BikeObjects from array:", bikeObjects);
    } else {
      console.log("Input is an object:", updateInput);
      bikeObjects = Object.values(updateInput).map((item: any) => item.bike_id); // Access bike_id
      console.log("BikeObjects from object:", bikeObjects);
    }

    const markers = bikeObjects.map((bike: any) => (
      <Marker key={bike.bike_id} position={bike.location} icon={scooterMarker}>
        <Popup>
          <div className="popup-content">
            <h2>{bike.bike_id}</h2>
            <p>Available: {bike.status.available ? "Yes" : "No"}</p>
            <p>Speed: {bike.speed}</p>
            <p>Battery: {bike.status.battery_level ?? "N/A"}</p>
          </div>
        </Popup>
      </Marker>
    ));
    setBikeMarkers(markers);
  };

  useEffect(() => {
    socket.current = io("http://localhost:1337");

    socket.current.on("connect", () => {
      console.log("Connected to server with ID: ", socket.current?.id);
    });

    socket.current.on("location_update", (data: LocationUpdateData) => {
      console.log("Received bike data: ", data);
      updateBikeMarkers(data);
    });
  }, []);

  useEffect(() => {
    document.title = city
      ? `Map ${cityNameDisplay[city]} - Fenix`
      : "Map - Fenix";

    const fetchCityBorders = async (cityName: string) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search.php?q=${cityName}&polygon_geojson=1&format=json`
        );
        console.log(response);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data?.[0]?.geojson) {
          setCityBorders(data[0].geojson);
          setCityCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          console.error("No city data found.");
        }
      } catch (error) {
        console.error("Error fetching city data:", error);
      }
    };

    city ? fetchCityBorders(city) : "";

    const fetchBikes = async (cityName: string) => {
      try {
        const response = await fetch("http://localhost:1337/get/all/bikes");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const bikes = await response.json();
        const markers = bikes
          .filter(
            (bike: any) =>
              bike.city_name.toLowerCase() === cityName.toLowerCase()
          )
          .map((bike: any) => (
            <Marker
              key={bike._id}
              position={bike.location}
              icon={scooterMarker}
            >
              <Popup>
                <div className="popup-content">
                  <h2>{bike.bike_id}</h2>
                  <p>Available: {bike.status.available}</p>
                  <p>Speed: {bike.speed}</p>
                  <p>Battery: {bike.status.battery_level}</p>
                </div>
              </Popup>
            </Marker>
          ));
        setBikeMarkers(markers);
        console.log("Bikes fetched:", bikes);
      } catch (error) {
        console.error("Error fetching bikes:", error);
      }
    };

    const fetchChargingStations = async (cityName: string) => {
      try {
        const response = await fetch(
          `http://localhost:1337/get/city/${cityName}/charging-stations`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const stations = await response.json();
        console.log("Fetched stations:", stations);

        const markers = stations
          .filter(
            (station: any) =>
              station.city_name.toLowerCase() === cityName.toLowerCase()
          )
          .map((station: any) => (
            <Marker
              key={station._id}
              position={station.location}
              icon={chargingStationMarker}
            >
              <Popup>
                <div className="popup-content">
                  <h2>{station.charging_id}</h2>
                  {station.charging_bikes.map((plug: any) => (
                    <p>{plug}</p>
                  ))}
                </div>
              </Popup>
            </Marker>
          ));
        console.log("Generated markers:", markers);

        setChargingStationMarkers(markers);
        console.log("stations fetched:", stations);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };

    const calculateCentroid = (area: [number, number][]) => {
      let x = 0,
        y = 0,
        n = area.length;
      area.forEach((point) => {
        x += point[0];
        y += point[1];
      });
      return [x / n, y / n] as [number, number];
    };

    const fetchParkingZones = async (cityName: string) => {
      try {
        const response = await fetch(
          `http://localhost:1337/get/city/${cityName}/parking-zones`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const zones = await response.json();
        console.log("Fetched parking zones:", zones); // Log fetched parking zones

        const polygons = zones
          .filter(
            (zone: any) =>
              zone.city_name.toLowerCase() === cityName.toLowerCase()
          )
          .map((zone: any) => {
            const centroid = calculateCentroid(zone.area);
            return (
              <React.Fragment key={zone._id}>
                <Polygon positions={zone.area} color="green">
                  <Popup>
                    <div className="popup-content">
                      <h2>{zone.parking_id}</h2>
                    </div>
                  </Popup>
                </Polygon>
                <Marker position={centroid} icon={parkingSpotMarker}>
                  <Popup>
                    <div className="popup-content">
                      <h2>{zone.parking_id}</h2>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          });
        console.log("Generated polygons and markers:", polygons); // Log generated polygons and markers

        setParkingZonePolygons(polygons);
        console.log("Parking zones fetched:", zones);
      } catch (error) {
        console.error("Error fetching parking zones:", error);
      }
    };

    if (city) {
      fetchCityBorders(city);
      fetchBikes(city);
      fetchChargingStations(cityNameDisplay[city]);
      fetchParkingZones(cityNameDisplay[city]);
    }
  }, [city]);

  // för att hinna hämta cityCenter och
  // få kartan centrerad kring önskat område.
  // tar egentligen bara någon ms men krävs för
  // att kunna sköta kartritningen på smidigt sätt.
  if (!cityCenter) {
    return (
      <div>
        <h1>{city ? cityNameDisplay[city] : ""}</h1>
        <p className="map-loading-msg">Loading map ...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{city ? cityNameDisplay[city] : ""}</h1>
      <MapContainer center={cityCenter} zoom={12}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cityBorders && (
          <GeoJSON
            data={cityBorders}
            style={{
              color: "#1A4D30", // --color-green-darker
              weight: 1.5,
              fillOpacity: 0.0,
            }}
          />
        )}
        ;{bikeMarkers}
        {chargingStationMarkers}
        {parkingZonePolygons}
      </MapContainer>
    </div>
  );
};

export default Map;
