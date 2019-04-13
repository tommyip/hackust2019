// App.jsx
import React from "react";
import './fonts.css';
import './style.css';
import { compose, withProps, lifecycle } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from "react-google-maps";
import googleMapsAPI from "./../ApiKeys"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


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
        origin: new google.maps.LatLng(...this.props.store_latlng),
        destination: new google.maps.LatLng(...this.props.destination_latlng),
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
    defaultZoom={8}
    defaultCenter={new google.maps.LatLng(...props.store_latlng)}
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

function Header(props) {
    return (
        <div>
            <div className="header">
                <h2>{props.title}</h2>
            </div>
            <div className="header-pushdown"></div>
        </div>
    );
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
        for (const order of self.state.orders) {
            orders.push(
                <div key={order.id}>
                    <div className="col-lg-12 order-box">
                        <div className="order-time">{timeConverter(order.order_time)}</div>
                        <div className="deliver-card bg-light">
                            <h3 className="w-50 float-left">Order {order.id}</h3>
                            <button className="float-right btn-white deliver-btn"><Link to="/deliver">Deliver</Link></button>

                            <div className="clearfix"></div>
                            <br />
                            <p><i class="fas fa-store"></i>&nbsp;&nbsp; <b>{order.store}</b> {order.store_address}</p>
                            <p>&nbsp;<i class="fas fa-map-marker-alt"></i>&nbsp;&nbsp;&nbsp; {order.destination}</p>
                            <MapWithADirectionsRenderer store_latlng={order.store_latlng} destination_latlng={order.destination_latlng} />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <Header title="Orders available" />
                {orders}
            </div>
        );
    }
}

function Deliver() {
  return (
    <div>
      <h2>Deliver</h2>
    </div>
  );
}

function Topics() {
  return (
    <div>
    <h2>Topics</h2>
    </div>
  );
}
export default class App extends React.Component {
    render () {
        return (
            <Router>
                <div>
                    <ul>
                        <li>
                            <Link to="/">Orders</Link>
                        </li>
                        <li>
                            <Link to="/deliver">Deliver</Link>
                        </li>
                        <li>
                            <Link to="/topics">Topics</Link>
                        </li>
                    </ul>

                    <Route exact path="/" component={Orders} />
                    <Route path="/deliver" component={Deliver} />
                    <Route path="/topics" component={Topics} />
                    <hr />
                </div>
            </Router>
        )
    }
}
