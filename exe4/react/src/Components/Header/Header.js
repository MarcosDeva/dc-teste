import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../../Assets/Logo.png";

class Header extends Component {
  static propTypes = {
    endereco: PropTypes.object.isRequired,
    cliente: PropTypes.object,
    logout: PropTypes.func.isRequired,
    getPedidos: PropTypes.func.isRequired,
    cepBusca: PropTypes.string,
    restaurante: PropTypes.object,
    modoVk: PropTypes.string.isRequired,
    cor1: PropTypes.string,
    cor2: PropTypes.string,
  };

  render() {
    const {
      endereco,
      cliente,
      logout,
      getPedidos,
      cepBusca,
      restaurante,
      modoVk,
      cor1,
      cor2,
    } = this.props;
    return (
      <nav
        className="navbar-fixed navbar-default"
        style={{
          borderRadius: "0px",
          backgroundColor: cor1,
        }}
      >
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              type="button btn-sm"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
              aria-expanded="false"
              style={{ background: modoVk === "VK" ? "" : cor1 }}
            >
              <span className="sr-only">Toggle navigation</span>
              <span
                className="icon-bar"
                style={{ backgroundColor: cor2 }}
              ></span>
              <span
                className="icon-bar"
                style={{ backgroundColor: cor2 }}
              ></span>
              <span
                className="icon-bar"
                style={{ backgroundColor: cor2 }}
              ></span>
            </button>
            <Link
              to="/"
              style={{
                color: "#ff5722",
                fontSize: "20px",
                textDecoration: "none",
              }}
            >
              <img
                alt="..."
                src={modoVk === "VK" ? logo : restaurante.imagem}
                style={{
                  width: "50px",
                  margin: "5px 10px 10px  10px",
                  borderRadius: "10px",
                }}
                className="navbar-logo"
              />
              {modoVk === "VK" ? (
                <b style={{ color: "#ff5722" }}>VemPraKa</b>
              ) : (
                <b style={{ color: `${cor2}` }}>{restaurante.razao_social}</b>
              )}
            </Link>
          </div>
          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
            style={{ paddingLeft: "7%", paddingRight: "7%" }}
          >
            <ul className="nav navbar-nav navbar-right">
              {cliente !== null ? (
                <Fragment>
                  <li>
                    <label
                      className="navbar-text"
                      style={{
                        color: `${modoVk === "VK" ? "#ff5722" : cor2}`,
                        marginRight: "0",
                      }}
                    >
                      {cliente.nome}
                    </label>
                  </li>
                  <li>
                    <span
                      className="navbar-text"
                      style={{
                        color: `${modoVk === "VK" ? "#ff5722" : cor2}`,
                      }}
                    >
                      {endereco.bairro === "" &&
                      endereco.cep === "" &&
                      endereco.complemento === "" &&
                      endereco.logradouro === "" &&
                      endereco.municipio === "" &&
                      endereco.numero === "" &&
                      //Erro na taxa
                      // endereco.taxa === undefined &&
                      endereco.uf === ""
                        ? null
                        : `${endereco.logradouro}, ${endereco.numero}`}
                    </span>
                  </li>
                  <li>
                    {modoVk === "ESTAB" ? null : (
                      <Link
                        to="/"
                        className="btn-lg navbar-btn-lg"
                        style={{
                          border: "none",
                          color: "#ff5722",
                          background: "none",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          fill={`${modoVk === "VK" ? "#ff5722" : cor2}`}
                          className="bi bi-card-heading"
                          viewBox="0 0 16 16"
                          style={{ marginRight: "3px", fontWeight: "bold" }}
                        >
                          <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                          <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                          <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                        </svg>
                        Estabelecimentos
                      </Link>
                    )}
                  </li>
                  <li style={{ marginTop: "5px" }}>
                    <button
                      className="btn-lg navbar-btn-lg"
                      onClick={() => getPedidos()}
                      style={{
                        border: "none",
                        color: `${modoVk === "VK" ? "#ff5722" : cor2}`,
                        background: "none",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        fill={`${modoVk === "VK" ? "#ff5722" : cor2}`}
                        className="bi bi-card-heading"
                        viewBox="0 0 16 16"
                        style={{ marginRight: "3px", fontWeight: "bold" }}
                      >
                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                      </svg>
                      Pedidos
                    </button>
                  </li>
                  <li style={{ marginTop: "5px" }}>
                    <Link
                      to="/"
                      onClick={() => logout()}
                      className="btn-lg navbar-btn-lg"
                      style={{
                        border: "none",
                        background: "none",
                        color: `${modoVk === "VK" ? "#ff5722" : cor2}`,
                        marginTop: "-3px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        fill={`${modoVk === "VK" ? "#ff5722" : cor2}`}
                        className="bi bi-box-arrow-left"
                        viewBox="0 0 16 16"
                        style={{
                          marginRight: "3px",
                        }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
                        />
                        <path
                          fillRule="evenodd"
                          d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
                        />
                      </svg>
                      Sair
                    </Link>
                  </li>
                </Fragment>
              ) : (
                <>
                  <li>
                    <span
                      className="navbar-text"
                      style={{ color: "#ff5722", fontSize: "19px" }}
                    >
                      {cepBusca === 0
                        ? null
                        : `${
                            cepBusca !== null &&
                            cepBusca !== undefined &&
                            cepBusca !== ""
                              ? `Buscando por CEP: ${cepBusca.replace(
                                  /([0-9]{5})?([0-9]{3})/g,
                                  "$1-$2"
                                )}`
                              : ""
                          }`}
                    </span>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="btn-lg navbar-btn-lg"
                      style={{ color: `${modoVk === "VK" ? "#ff5722" : cor2}` }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        fill={`${modoVk === "VK" ? "#ff5722" : cor2}`}
                        className="bi bi-box-arrow-in-right"
                        viewBox="0 0 16 16"
                        style={{
                          margin: "5px 5px 0px 0px",
                        }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
                        />
                        <path
                          fillRule="evenodd"
                          d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                        />
                      </svg>
                      Entrar ou Cadastrar
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
