import React, { Component } from "react";
import "./nav.css";
import logo from "./../../images/logo.png";

export default class Nav extends Component {
  render() {
    return (
      <div className="nav">
        <div className="nav__blocks">
          <img src={logo}></img>
        </div>

        <div className="nav__blocks1 ">
          <i class="fa fa-home "></i>
        </div>
        <div className="nav__blocks1">
          <i class="fa fa-search"></i>
        </div>
        <div className="nav__blocks1">
          {" "}
          <i class="fa fa-cloud"></i>
        </div>
        <div className="nav__blocks1">
          {" "}
          <i class="fa fa-trash"></i>
        </div>
      </div>
    );
  }
}
