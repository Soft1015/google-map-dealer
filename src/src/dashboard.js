import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, DrawingManager } from "@react-google-maps/api";
import Marker from "./marker";

const mapContainerStyle = {
  height: "90%",
  width: "100%",
};

const center = {
  lat: 55.77558010,
  lng: -4.85801140,
};

const options = {
  drawingControl: false,
  drawingControlOptions: {
    drawingModes: ["marker"],
  },
  polygonOptions: {
    fillColor: `#2196F3`,
    strokeColor: `#2196F3`,
    fillOpacity: 0.5,
    strokeWeight: 2,
    clickable: true,
    editable: true,
    draggable: true,
    zIndex: 1,
  },
};

const style = {
  display: "flex",
  height: "100vh",
};

const Dashboard = () => {
  const [pos, setPos] = useState(center);

  const onLoad = (drawingManager) => {
    console.log(drawingManager);
  };

  const onMarkerComplete = (marker) => {
    setPos({ lat: marker.position.lat(), lng: marker.position.lng() });
    marker.setMap(null);
    console.log(marker);
  };

  const onPolygonComplete = (polygon) => {
    console.log(polygon);
  };

  useEffect(() => {
    getTypes();
  }, []);

  const headers = {
    "Access-Control-Allow-Origin":"*",
    "Accept":"*",
    "Keep-Alive":"timeout=2, max=100",
    "Content-Type":"text/html",
  };

  const getTypes = async () => {
    fetch("http://rubixgroup.co/smg-api/getTypes.php", {
      headers: headers,
    })
      .then((response) => {
        response
          .text()
          .then(function (j) {
            console.log(j);
          })
          .catch(function (e) {
            console.log(e);
          });
      })
      .then((xmlString) => {
        console.log(xmlString);
        // const parser = new DOMParser();
        // const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        // const data = [];

        // const items = xmlDoc.getElementsByTagName('item');
        // for (let i = 0; i < items.length; i++) {
        //   const item = items[i];
        //   const title = item.getElementsByTagName('title')[0].textContent;
        //   const link = item.getElementsByTagName('link')[0].textContent;
        //   const description = item.getElementsByTagName('description')[0].textContent;
        //   const pubDate = item.getElementsByTagName('pubDate')[0].textContent;

        //   data.push({ title, link, description, pubDate });
        // }

        // console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <LoadScript
        id="script-loader"
        googleMapsApiKey="AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ"
        libraries={["drawing"]}
      >
        <div style={style}>
          <div style={{ width: "20%", marginTop: "30px" }}>
            <div className="form__group field">
              <input
                type="input"
                className="form__field"
                placeholder="17163010110"
                name="phone"
                id="phone"
              />
              <label htmlFor="name" className="form__label">
                Phone
              </label>
            </div>
          </div>

          <div style={{ width: "80%" }}>
            <GoogleMap
              id="drawing-manager-example"
              mapContainerStyle={mapContainerStyle}
              zoom={2.5}
              center={center}
            >
              <DrawingManager
                onLoad={onLoad}
                options={options}
                onMarkerComplete={onMarkerComplete}
                onPolygonComplete={onPolygonComplete}
              />
              <Marker position={pos} onUpdate={setPos} />
            </GoogleMap>
          </div>
        </div>
      </LoadScript>
    </>
  );
};

export default Dashboard;
