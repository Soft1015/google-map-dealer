import React, { useState, useEffect } from "react";
import { InfoWindow, Marker } from "@react-google-maps/api";

const CustomMarker = ({ position, onUpdate }) => {
  const [markerRef, setMarkerRef] = useState();
  const [isInfoShown, setIsInfoShown] = useState(false);

  const toggleMarker = () => {
    setIsInfoShown(!isInfoShown);
  };

  const onMarkerDrag = ({ latLng }) => {
    onUpdate({ lat: latLng.lat(), lng: latLng.lng() });
  };

  return (
    <>
      {isInfoShown && (
        <InfoWindow
          anchor={markerRef}
          onCloseClick={() => {
            console.log("close clicked");
            setIsInfoShown(false);
          }}
        >
          <div
            style={{
              background: `white`,
              padding: 5
            }}
          >
            <h2 style={{color:"#0f2761"}}>360 Boat Services Ltd</h2>
            <p>T/As 360 Boat Services Ltd,Largs Yacht Haven, Irvine Road,Largs,North Ayrshire,KA30 8EZ</p>
            <p>01475 817980</p>
            <p>accounts@360boatservices.com</p>
            <p>Installer</p>
            <button id="sms">SMS</button>
          </div>
        </InfoWindow>
      )}
      <Marker
        position={position}
        draggable={true}
        onDragEnd={onMarkerDrag}
        onLoad={setMarkerRef}
        onClick={toggleMarker}
      />
    </>
  );
};

export default CustomMarker;
