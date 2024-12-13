import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { Button, ButtonGroup } from "react-bootstrap";

function Map() {
  return (
    <div className="map-container">
        <ButtonGroup id="post-filter" aria-label="Basic example">
            <Button variant="success">All</Button>
            <Button variant="success">Following</Button>
        </ButtonGroup>
        <Button id="post-refresh" variant="success">
            Refresh
        </Button>
      <MapContainer center={[50.822376, 4.395356]} zoom={13}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}

export { Map };
