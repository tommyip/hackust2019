// App.jsx
import React from "react";
import './style.css';
import Test from "./test";
import { compose, withProps, lifecycle } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from "react-google-maps";
import googleMapsAPI from "./../ApiKeys"

const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key="+googleMapsAPI.MapsApiKey+"&callback=initMap",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new google.maps.DirectionsService();

      DirectionsService.route({
        origin: new google.maps.LatLng(22.3364, 114.2655),
        destination: new google.maps.LatLng(22.2980, 114.1720),
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
          console.log('HIIII', result)
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  })
)(props =>
  <GoogleMap
    defaultZoom={7}
    defaultCenter={new google.maps.LatLng(41.8507300, -87.6512600)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} options={{draggable:true}} panel={ document.getElementById('panel') } />}
    <div id="panel"></div>
  </GoogleMap>
);

export default class App extends React.Component {
    render () {
        return (
        <div>
            <div className="col-lg-12">
                <div className="deliver-card bg-light">
                    <h3 className="w-50 float-left">Order 12345-N</h3>
                    <button className="float-right btn-white deliver-btn">Deliver</button>
                    <div className="clearfix"></div>

                    <p>Tseung Kwan O to 12/F Happy Valley</p>
                    <MapWithADirectionsRenderer />
                </div>
            </div>
            <br/>
            <div className="col-lg-8">
                <p>16:04 April 13, 2019</p>
            </div>
        </div>
        );
    }
}
