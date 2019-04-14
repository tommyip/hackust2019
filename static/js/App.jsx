// App.jsx
import React from "react";
import './fonts.css';
import './style.css';
import { compose, withProps, lifecycle } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from "react-google-maps";
import googleMapsAPI from "./../ApiKeys";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();


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

function hourMinConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var hour = a.getHours();
    var min = a.getMinutes();
    var time = hour + ':' + min;
    return time;
}

function Header(props) {
    return (
        <div>
            <div className="header">
                <Link id="home" className="link" to='/'><i className="fas fa-home"></i></Link>
                <span className="title">{props.title}</span>
                <Link id="profile" className="link" to="/profile"><i className="fas fa-id-badge"></i></Link>
            </div>
            <div className="header-pushdown"></div>
        </div>
    );
}

class Orders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
        }
    }

    updateData() {
        fetch('/api/orders').then(results => {
            return results.json();
        }).then(data => {
            this.setState({orders: data});
            console.log(data);
        });
    }

    componentDidMount() {
        this.updateData();
        this.unlisten = history.listen((location, action) => {
            this.updateData();
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render () {
        let nOrders = 0;
        let orders = [];
        for (const order of this.state.orders) {
            if (order.order_status === 3) continue;
            orders.push(
                <div key={order.id}>
                    <div className="col-lg-12">
                        <div className="order-time">{timeConverter(order.order_time)}</div>
                        <div className="deliver-card bg-light">
                            <h3 className="w-50 float-left">Order {order.id}</h3>
                            <Link
                                className="float-right btn btn-primary"
                                to={{
                                    pathname: "/track",
                                    state: {
                                        order: order,
                                    }
                                }}
                                ><b>Deliver</b></Link>

                            <div className="clearfix"></div>
                            <br />
                            <p><i className="fas fa-store"></i>&nbsp;&nbsp; <b>{order.store}</b> {order.store_address}</p>
                            <p>&nbsp;<i className="fas fa-map-marker-alt"></i>&nbsp;&nbsp;&nbsp; {order.destination}</p>
                            <MapWithADirectionsRenderer store_latlng={order.store_latlng} destination_latlng={order.destination_latlng} />
                        </div>
                    </div>
                </div>
            );
            nOrders++;
        }

        orders.push(
            <div key="14558">
                <div className="col-lg-12">
                    <div className="order-time">12:35 14 April 2019, 12:46 14 April 2019</div>
                    <div className="deliver-card bg-light">
                        <h3 className="w-50 float-left">Order 14541, 14558</h3>
                        <button
                            className="float-right btn btn-primary"
                            ><b>Deliver</b></button>

                        <div className="clearfix"></div>
                        <br />
                        <p><i className="fas fa-store"></i>&nbsp;&nbsp; <b>Pizza Hut</b> Po Lam Estate Block 6 Po Kan House, 18, Po Lam Rd N, Yau Yue Wan</p>
                        <p>&nbsp;<i className="fas fa-map-marker-alt"></i>&nbsp;&nbsp;&nbsp; Flat C, Floor 19, The Wings II Tower 1, Tong Chun St, Tseung Kwan O <i>(order 14541)</i></p>
                        <p>&nbsp;<i className="fas fa-map-marker-alt"></i>&nbsp;&nbsp;&nbsp; Flat A, Floor 4, The Wings II Tower 1, Tong Chun St, Tseung Kwan O <i>(order 14558)</i></p>
                        <MapWithADirectionsRenderer store_latlng={[22.3236806, 114.2532648]} destination_latlng={[22.3058798,114.2594711]} />
                    </div>
                </div>
            </div>
        );

        if (nOrders === 0) {
            orders = (<div className="center">No orders to deliver</div>);
        }

        return (
            <div>
                <Header title="Orders available" />
                {orders}
            </div>
        );
    }
}

class TrackOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: this.props.location.state.order,
            take_time: null,
            delivering_time: null,
            delivered_time: null,
            stage: 0,
        };
    }

    displayTime(time) {
        if (time == null) {
            return 'Waiting...';
        } else {
            return hourMinConverter(time);
        }
    }

    stage(index) {
        if (index < this.state.stage) {
            return 'is-done';
        } else if (index === this.state.stage) {
            return 'current';
        } else {
            return '';
        }
    }

    checkStage(element, id) {
        element.checked = true;
        this.setState({
            stage: id,
        });
        switch (id) {
            case 1:
            this.setState({
                take_time: parseInt(new Date().getTime() / 1000)
            }); break;
            case 2:
            this.setState({
                delivering_time: parseInt(new Date().getTime() / 1000)
            }); break;
            case 3:
            this.setState({
                delivered_time: parseInt(new Date().getTime() / 1000)
            });
            $.ajax({
                url: '/api/orders/' + this.state.order.id,
                contentType: "application/json",
                method: 'PUT',
                data: JSON.stringify({status: 3})
            }).done(function(msg) {console.log(msg)});
            break;
        }
        console.log('change time');
    }

    render() {
        const button = this.state.stage === 3 ?
            (<Link className="delivery-done btn btn-success" to="/">Done</Link>) : '';

        return (
            <div>
                <Header title={"Tracking order " + this.state.order.id} />

                <div className="timeline-wrapper">
                    <ul className="StepProgress">
                        <li className={"StepProgress-item " + this.stage(0)}>
                            <div className="step_time">{this.displayTime(this.state.order.order_time)}</div>
                            <div className="bold">Order Confirmed</div>
                        </li>
                        <li className={"StepProgress-item " + this.stage(1)}>
                            <div className="step_time">{this.displayTime(this.state.take_time)}</div>
                            <div className="bold stage">Food Taken from Store</div>&nbsp;&nbsp;
                            <label className="checkboxWrap check" htmlFor="checkTaken">
                                <input className="checkbox" type="checkbox" id="checkTaken" onChange={() => this.checkStage(this, 1)}></input>
                            </label>
                            <div>{this.state.order.store_address}</div>
                        </li>
                        <li className={"StepProgress-item " + this.stage(2)}>
                            <div className="step_time">{this.displayTime(this.state.delivering_time)}</div>
                            <div className="bold stage">Delivering</div>&nbsp;&nbsp;
                            <label className="checkboxWrap check" htmlFor="checkDelivering">
                                <input className="checkbox" type="checkbox" id="checkDelivering" onChange={() => this.checkStage(this, 2)}></input>
                            </label>
                        </li>
                        <li className={"StepProgress-item " + this.stage(3)}>
                            <div className="step_time">{this.displayTime(this.state.delivered_time)}</div>
                            <div className="bold stage">Delivered</div>&nbsp;&nbsp;
                            <label className="checkboxWrap check" htmlFor="checkDelivered">
                                <input className="checkbox" type="checkbox" id="checkDelivered" onChange={() => this.checkStage(this, 3)}></input>
                            </label>
                            <div>{this.state.order.destination}</div>
                        </li>
                    </ul>

                    {button}
                </div>
            </div>
        );
    }
}

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div>
            <Header title="Rider profile" />
            <div className="margin-auto">
                <div className="prof_background">

                </div>

                <div className="prof_card">
                    <h2>Jason Chan</h2>
                    <div><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i> <span className="grey"><i>based on 45 deliveries made</i></span></div>
                    <br />
                    <button className="inline-btn btn btn-primary">Edit</button>
                    <p className=" prof_date margin-btm-0">joined 2 months ago</p>
                    <p >Preferred location: Tseung Kwan O</p>

                    <h3>Completed orders</h3>
                    <div className="order-time">6:40 14 April 2019</div>
                    <div className="deliver-card bg-light">
                        <h3 className="w-50 float-left">Order 14538</h3>

                        <div className="clearfix"></div>
                        <br />
                        <p><i className="fas fa-store"></i>&nbsp;&nbsp; <b>KFC Hau Tak</b> Shop E165A, 1/F, East Wing, TKO Gateway, Hau Tak Estate, Tseung Kwan O</p>
                        <p>&nbsp;<i className="fas fa-map-marker-alt"></i>&nbsp;&nbsp;&nbsp; China Gardens, G/F, Academic Building, Hong Kong University of Science and Technology, Clear Water Bay</p>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}


export default class App extends React.Component {
    render () {
        return (
            <div>
                <Router history={history}>
                    <Route exact path="/" component={Orders} />
                    <Route path="/track" component={TrackOrder} />
                    <Route path="/profile" component={Profile} />
                </Router>
            </div>
        )
    }
}
