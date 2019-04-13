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

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['January', 'Febrary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var time = hour + ':' + min + ' ' + date + ' ' + month + ' ' + year;
    return time;
}

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
        }
    }

    componentDidMount() {
        fetch('/api/orders').then(results => {
            return results.json();
        }).then(data => {
            this.setState({orders: data});
            console.log(data);
        });
    }

    render () {
        const orders = [];
        for (const order of this.state.orders) {
            orders.push(
                <div key={order.id}>
                    <div className="col-lg-12 order-box">
                        <div className="order-time">{timeConverter(order.order_time)}</div>
                        <div className="deliver-card bg-light">
                            <h3 className="w-50 float-left">Order {order.id}</h3>
                            <button className="float-right btn-white deliver-btn">Deliver</button>
                            <div className="clearfix"></div>

                            <p>Pick up from {order.store}</p>
                            <p>Address: {order.store_address}</p>
                            <p>Destination: {order.destination}</p>
                            <MapWithADirectionsRenderer />
                        </div>
                    </div>
                    <br/>
                </div>
            );
        }

        return (
            <div>
                {orders}
            </div>
        );
    }
}
