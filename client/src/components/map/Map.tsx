import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { Button, ButtonGroup } from "react-bootstrap";
import { useState, useEffect } from "react";

interface Location {
  lat: number;
  lng: number;
}


function Map() {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });


    
  }, []);


  return (
    <div className="map-container">
      <ButtonGroup id="post-filter" aria-label="Basic example">
        <Button variant="success">All</Button>
        <Button variant="success">Following</Button>
      </ButtonGroup>
      <Button id="post-refresh" variant="success">
        Refresh
      </Button>
      <MapContainer
        center={location ? location : [50.822376, 4.395356]}
        zoom={4}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}

export { Map };
