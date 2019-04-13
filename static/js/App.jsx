// App.jsx
import React from "react";
import './style.css'
export default class App extends React.Component {



  render () {
    return <div class="col-lg-12">
      <div class="deliver-card bg-light">

        <h3 class="w-50 float-left">Order 12345-N</h3>
        <button class="float-right btn-white deliver-btn">Deliver</button>
        <div class="clearfix"></div>

      <p>Tseung Kwan O to 12/F Happy Valley</p>
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7382.43393316638!2d114.25598992529461!3d22.307632767181502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340403e98351c941%3A0xcdecffbe48d32670!2sTseung+Kwan+O!5e0!3m2!1sen!2shk!4v1555161046878!5m2!1sen!2shk" width="100%" height="300" frameborder="0" style="border:0" allowfullscreen></iframe>

      </div>
    </div>
    <br/>
    <div class="col-lg-8">
    <p>16:04 April 13, 2019</p>
    </div>;
  }
}
