import React from "react";
import { icons } from "../components/utils/utlis";
import "./ChatPage.module.css";
import ChatLeftAll from "./ChatLeftAll";
import { BsSearch } from "react-icons/bs";

export default function ChatPage() {
  return (
    <div className="container-fluid d-flex-grow-2">
      <div className="row">
        {/* Main content */}
        <div className="col-lg-10 order-lg-1">
          {/* First section */}
          <div
            className="row d-flex"
            style={{
              minHeight: "100%",
              backgroundColor: "white",
            }}
          >
            <div
              className="col-lg-4 col-md-12"
              style={{ backgroundColor: "#F7F4EE" }}
            >
              <div className="px-4 pt-4">
                <h4 className="mb-4">Chats</h4>
                <div className="search-box chat-search-box">
                  <div className="mb-3 rounded-3 input-group">
                    <input
                      placeholder="Search messages or users"
                      type="text"
                      className="form-control bg-light form-control"
                      defaultValue=""
                    />
                    <span
                      className="input-group-text text-muted bg-light pe-1 ps-3"
                      id="basic-addon1"
                    >
                      <BsSearch style={{ marginRight: "10px" }} />
                    </span>
                  </div>
                </div>
              </div>
              {/* Content for the first container */}
            </div>
          </div>

          {/* Second section - Hide on small screens */}
          <div
            className="row d-flex d-lg-none"
            style={{
              height: "100vh",
              minHeight: "200px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div className="col-md-8" style={{ backgroundColor: "#FFFFFF" }}>
              {/* Content for the second container */}
            </div>
          </div>
        </div>

        {/* Sidebar - Show at the bottom on small screens */}
        <div
          id="sidebarMenu"
          className="collapse d-lg-block col-lg-2 sidebar flex-lg-column me-lg-1 order-lg-2"
        >
          <div className="position-sticky">
            <div className="list-group list-group-flush mx-3 mt-4 text-start">
              <i className="fas fa-tachometer-alt fa-fw me-3 " />
              <span className="">
                <img
                  className=""
                  src={icons.user}
                  alt="User"
                  width={30}
                  height={30}
                  onClick={() => {}}
                />
              </span>

              <i className="fas fa-chart-area fa-fw me-3 mt-2" />
              <span>
                <img
                  className=""
                  src={icons.user}
                  alt="User"
                  width={30}
                  height={30}
                  onClick={() => {}}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
