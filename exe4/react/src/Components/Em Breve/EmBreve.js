import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../Assets/App.css";
class EmBreve extends Component {
  static propTypes = {
    restaurante: PropTypes.object.isRequired,
  };

  render() {
    const { restaurante } = this.props;
    return (
      <div
        className="divBreveEx"
        style={{
          background: "orange",
          backgroundSize: "cover",
          minHeight: "100vh",
          overlay: "auto",
        }}
      >
        <div
          className="container-fluid divBreve"
          style={{
            background: "white",
            borderRadius: "10px",
            padding: "5%",
            border: "1px solid rgba(0, 0, 0, 0.15)",
            boxShadow: "0 0 0.4em gray",
          }}
        >
          <div className="col-md-3"></div>
          <div className="row">
            <div className="col-md-6">
              <div
                className="col-sm-12 col-xs-12"
                style={{ textAlign: "center" }}
              >
                <img
                  src={restaurante.imagem}
                  style={{ width: "100%" }}
                  alt=" "
                />
              </div>
              <div
                className="col-sm-12 col-xs-12"
                style={{ textAlign: "center", marginTop: "50px" }}
              >
                <h3>
                  <b style={{ color: "gray" }}>
                    Em breve a nossa nova plataforma de pedidos...
                  </b>
                </h3>
              </div>
            </div>
            <div
              className="col-sm-12 col-xs-12"
              style={{ textAlign: "center", marginTop: "50px" }}
            >
              <label>Para mais informações: (19) 3392-4070 </label>
            </div>
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>
    );
  }
}

export default EmBreve;
