import React from "react";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"


export default class MyMapComponent extends React.Component {


  render () {
    return (
      <div>
    {  withGoogleMap(<GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
      >
        {this.props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
      </GoogleMap>)}
      </div>
    )
  }
}
