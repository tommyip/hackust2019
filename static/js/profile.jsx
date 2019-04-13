// App.jsx
import React from "react";
import './fonts.css';
import './style.css';
import { compose, withProps, lifecycle } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from "react-google-maps";
import googleMapsAPI from "./../ApiKeys"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


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

class Riders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            riders: [],
        }

        render(){
          <div class="margin-auto">
            <div class="prof_background">

            </div>

            <div class="prof_card">
              <div class="prof_detail">
                <br/>
              <h2>Jason Chan</h2>
              <button class="btn-link">Edit</button>
              <p class=" prof_date margin-btm-0">joined 2 months ago</p>
              <p >Kowloon, N.T</p>
              </div>

              <br/>
              <h3>Completed Orders</h3>
              <br/>
                <div class="order_card">
                  <p class=" prof_date">16:04 April 13, 2019</p>
                  <h2>Order 12345-N</h2>
                  <p>Tseung Kwan O to 12/F Happy Valley</p>

                </div>
            </div>
          </div>

        }
    }
}
