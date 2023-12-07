import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import BuscaCepModal from "./ModalRestaurante";
import * as API from "../../API";
import propa from "../../Assets/propa.png";
import semImagem from "../../Assets/semImagem.jpg";
import "./Restaurantes.css";
import moment from "moment";

var CryptoJS = require("crypto-js");
class Restaurantes extends Component {
  static propTypes = {
    restaurantes: PropTypes.array,
    getCardapio: PropTypes.func.isRequired,
    categorias: PropTypes.array.isRequired,
    endereco: PropTypes.object,
    enderecoBusca: PropTypes.object,
    getEndereco: PropTypes.func,
    getEnderecos: PropTypes.func,
    setEndereco: PropTypes.func,
    encontraCep: PropTypes.bool,
    hideEndereco: PropTypes.func,
    cepBusca: PropTypes.string,
    setCep: PropTypes.func,
    setRestaurantes: PropTypes.func,
    getHoraAtual: PropTypes.func,
    horaAtual: PropTypes.string.isRequired,
  };

  state = {
    restaurantE: "",
    resCat: "",
    isModalVisible: false,
    buscando: false,
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  trocaBusca = () => {
    this.setState({ buscando: true });
  };

  limpaBusca = () => {
    let cep = "";
    this.setState({ buscando: false });
    this.props.setCep(cep);
    API.getEstabelecimentos().then((data) => {
      this.props.setRestaurantes(data.estabelecimentos);
    });

    if (this.state.isModalVisible) {
      this.hideModal();
    }
  };

  pesquisa = (e) => {
    this.setState({ restaurantE: e.target.value });
  };

  componentDidMount = () => {
    this.props.getHoraAtual();
  };

  render() {
    const {
      restaurantes,
      getCardapio,
      getEndereco,
      categorias,
      setEndereco,
      endereco,
      enderecoBusca,
      encontraCep,
      cepBusca,
      horaAtual,
    } = this.props;

    const { restaurantE, resCat, isModalVisible, buscando } = this.state;

    return (
      <div>
        {/* ------------------CAROUSSEL ----------------*/}
        {/* <div className="carousel slide multi-item-carousel" id="theCarousel">
          <div className="carousel-inner">
            <div className="item active">
              <a href="#1">
                <img
                  src={propa}
                  className="img-responsive"
                  style={{ height: "300px", width: "100vw" }}
                />
              </a>
            </div>
            <div className="item">
              <a href="#1">
                <img
                  src="https://img.freepik.com/free-photo/delivery-concept-portrait-happy-african-american-delivery-man-holding-box-packages-showing-thumps-up-isolated-grey-studio-background-copy-space_1258-102233.jpg?w=2000"
                  className="img-responsive"
                  style={{ height: "300px", width: "100vw" }}
                />
              </a>
            </div>
          </div>
          <a
            className="left carousel-control"
            href="#theCarousel"
            data-slide="prev"
          >
            <i className="glyphicon glyphicon-chevron-left"></i>
          </a>
          <a
            className="right carousel-control"
            href="#theCarousel"
            data-slide="next"
          >
            <i className="glyphicon glyphicon-chevron-right"></i>
          </a>
        </div> */}
        <nav className="navbar navbar-default " style={{ overflow: "auto" }}>
          <ul className="navbar-nav" style={{ display: "inline-flex" }}>
            <li className="nav-item navbar-text">
              <button
                style={{
                  border: "none",
                  background: "none",
                  marginRight: "10px",
                  textDecoration: `${resCat === "" ? "underline red" : "none"}`,
                  color: `${resCat === "" ? "red" : "gray"}`,
                  fontWeight: `${resCat === "" ? "bold" : " "}`,
                }}
                onClick={() => {
                  this.setState({ resCat: "" });
                }}
              >
                Início
              </button>
            </li>
            {categorias.map((categoria) => (
              <div key={categoria.id_categoria}>
                <li className="nav-item navbar-text">
                  <button
                    style={{
                      border: "none",
                      background: "none",
                      marginRight: "10px",
                      textDecoration: `${
                        resCat === categoria.nome ? "underline red" : "none"
                      }`,
                      color: `${resCat === categoria.nome ? "red" : "gray"}`,
                      fontWeight: `${resCat === categoria.nome ? "bold" : " "}`,
                    }}
                    onClick={() => {
                      this.setState({ resCat: categoria.nome });
                    }}
                  >
                    {categoria.nome}
                  </button>
                </li>
              </div>
            ))}
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12">
                {/* ------------------------------------------------------------ */}
                {/* <div className="row" style={{ display: "flex", margin: "0" }}>
                  <div className="com-sm-1" style={{ display: "flex" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="gray"
                      className="bi bi-search"
                      viewBox="0 0 16 16"
                      style={{ marginTop: "30%" }}
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </div>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className="form-control input-lg"
                      placeholder="Buscar por Estabelecimento"
                      onChange={(e) =>
                        this.setState({ restaurantE: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-sm-4">
                    <button
                      className="btn-danger btn-lg"
                      style={{
                        height: "100%",
                        borderRadius: "5px",
                        border: "none",
                        color: "white",
                        padding: "2.5%",
                      }}
                      onClick={() => {
                        this.showModal();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="white"
                        className="bi bi-geo-alt-fill"
                        viewBox="0 0 16 16"
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                      </svg>
                      <b>Verificar endereço</b>
                    </button>
                  </div>
                </div> */}
                {/* ------------------------------------------------------------ */}
              </div>
            </div>
            <div className="col-sm-6" style={{ marginBottom: "25px" }}>
              <div className="input-group" style={{ zIndex: "0" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por loja..."
                  onChange={(e) => this.pesquisa(e)}
                  style={{ outline: "none !important" }}
                />
                <span className="input-group-btn">
                  <button
                    className="btn btn-default"
                    type="submit"
                    style={{ outline: "none" }}
                  >
                    <b>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        fill="red"
                        className="bi bi-search"
                        viewBox="0 0 15 15"
                      >
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                      </svg>
                    </b>
                  </button>
                </span>
              </div>
            </div>
            <div
              className="col-sm-6"
              style={{
                marginBottom: "25px",
                textAlign: "-webkit-right",
              }}
            >
              <button
                className="btn btn-default btn-block btnCEP"
                type="submit"
                style={{
                  backgroundColor: "red",
                  color: "white",
                }}
                onClick={() => {
                  !buscando ? this.showModal() : this.limpaBusca();
                }}
              >
                {!buscando ? (
                  <b>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-geo-alt-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                    </svg>{" "}
                    Filtrar por localidade
                  </b>
                ) : (
                  <b>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x-octagon-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
                    </svg>{" "}
                    Limpar filtro
                  </b>
                )}
              </button>
            </div>
            {restaurantes !== null ? (
              <div className="grid" style={{ marginTop: "20px" }}>
                {restaurantes
                  .filter((restaurante) =>
                    restaurante.razao_social === "" && resCat === ""
                      ? true
                      : restaurante.razao_social === "" &&
                        resCat === restaurante.segmento
                      ? true
                      : restaurante.razao_social !== "" &&
                        restaurante.razao_social
                          .toLowerCase()
                          .includes(restaurantE.toLowerCase()) &&
                        resCat === ""
                      ? true
                      : restaurante.razao_social !== "" &&
                        restaurante.razao_social
                          .toLowerCase()
                          .includes(restaurantE.toLowerCase()) &&
                        resCat === restaurante.segmento
                      ? true
                      : false
                  )
                  .map((restaurante) => (
                    <div
                      className="col-xs-12 col-md-4"
                      key={restaurante.id_estabelecimento}
                    >
                      <div
                        className="thumbnail"
                        style={{ textAlign: "center" }}
                        onClick={() => getCardapio(restaurante)}
                      >
                        <div className="row">
                          <div className="col-xs-12 col-md-12">
                            <div className="media">
                              <div className="media-left">
                                <img
                                  className="media-object"
                                  src={
                                    !restaurante.imagem
                                      ? semImagem
                                      : restaurante.imagem
                                  }
                                  alt="..."
                                  style={{
                                    height: "150px",
                                    width: "120px",
                                    objectFit: "contain",
                                    borderRadius: "10px",
                                    backgroundColor: "#fff",
                                  }}
                                />
                              </div>
                              <div className="media-body">
                                <div
                                  style={{
                                    textAlign: "left",
                                    marginTop: "10px",
                                  }}
                                  className="col-xs-12 col-md-12"
                                >
                                  <h5 className="media-heading">
                                    <b>{restaurante.razao_social}</b>
                                  </h5>
                                  <p className="text-muted">
                                    <b>{restaurante.segmento}</b>
                                  </p>
                                  <p className="text-muted">
                                    {`Abre: ${restaurante.abertura}h`}
                                  </p>
                                  <p className="text-muted">
                                    {`Fecha: ${restaurante.fechamento}h`}
                                  </p>
                                  {moment(horaAtual, "hhmm") <
                                    moment(restaurante.abertura, "hhmm") ||
                                  moment(horaAtual, "hhmm") >=
                                    moment(restaurante.fechamento, "hhmm") ? (
                                    <p
                                      style={{
                                        color: "red",
                                        textAlign: "right",
                                      }}
                                    >
                                      Fechado
                                    </p>
                                  ) : (
                                    <p
                                      style={{
                                        color: "limegreen",
                                        textAlign: "right",
                                      }}
                                    >
                                      Aberto
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* <div
                            className="col-xs-5 col-md-5"
                            style={{
                              height: "120px",
                            }}
                          >
                            <img
                              src={restaurante.imagem}
                              alt="..."
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                borderRadius: "5px",
                              }}
                            />
                          </div>
                          <div className="col-xs-7 col-md-7">
                             !!!!!!!!!!!!<div className="row">
                              <div className="col-xs-3 col-md-3"></div>
                              <div
                                className="col-xs-6 col-md-6"
                                style={{ backgroundImage: `${restaurante.imagem}` }}
                              >
                                <img
                                  src={restaurante.imagem}
                                  alt="..."
                                  style={{
                                    width: "100%",
                                    height: "100px",
                                    objectFit: "contain",
                                  }}
                                /> 
                              </div>
                              <div className="col-xs-3 col-md-3"></div>
                            </div> !!!!!!!!!!!
                            <div className="caption">
                              <h5 style={{ fontSize: "1em" }}>
                                <b>{restaurante.razao_social}</b>
                              </h5>
                              <p className="text-muted">
                                {restaurante.segmento}
                              </p>
                            </div>
                          </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="col-sm-12" style={{ height: "100%" }}>
                <h3 className="text-muted">
                  Sentimos muito,nenhuma loja faz entregas nesta localidade..
                </h3>
              </div>
            )}
            {/* {restaurantes !== null ? (
              <div className="row panel panel-default">
                <table className="table table-hover">
                  <tbody>
                    {restaurantes
                      .filter((restaurante) =>
                        restaurante.razao_social === "" && resCat === ""
                          ? true
                          : restaurante.razao_social === "" &&
                            resCat === restaurante.segmento
                          ? true
                          : restaurante.razao_social !== "" &&
                            restaurante.razao_social
                              .toLowerCase()
                              .includes(restaurantE.toLowerCase()) &&
                            resCat === ""
                          ? true
                          : restaurante.razao_social !== "" &&
                            restaurante.razao_social
                              .toLowerCase()
                              .includes(restaurantE.toLowerCase()) &&
                            resCat === restaurante.segmento
                          ? true
                          : false
                      )
                      .map((restaurante) => (
                        <tr key={restaurante.id_estabelecimento}>
                          <td
                            className=""
                            onClick={() => getCardapio(restaurante)}
                          >
                            <div className="col-md-1 col-xs-3">
                              <img
                                alt="logo estabelecimento"
                                src={restaurante.imagem}
                                style={{
                                  width: "85px",
                                  height: "60px",
                                  // borderRadius: "20px",
                                }}
                              />
                            </div>
                            <div className="col-md-11 col-xs-9">
                              <label className="h4">
                                {restaurante.razao_social}
                              </label>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-muted">
                <h3>
                  Infelizmente não há estabelecimentos que entreguem nessa
                  região..
                </h3>
              </div>
            )} */}
          </div>
        </div>
        <Modal
          className="modal-dialog modal-dialog-centered modal-lg"
          ariaHideApp={false}
          isOpen={isModalVisible}
          onRequestClose={() => {
            this.hideModal();
          }}
          style={{
            content: {
              position: "center",
              border: "1px solid #ccc",
              background: "#fff",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "15px",
              outline: "none",
              paddingBottom: "0px",
              marginBottom: "150px",
            },
            overlay: {
              position: "fixed",
              backgroundColor: "rgba(0.30, 0.20, 0, 0.40)",
            },
          }}
        >
          <BuscaCepModal
            getEndereco={getEndereco}
            setEndereco={setEndereco}
            hideModal={this.hideModal}
            showModal={this.showModal}
            enderecoBusca={enderecoBusca}
            encontraCep={encontraCep}
            endereco={endereco}
            cepBusca={cepBusca}
            setCep={(cep) => this.props.setCep(cep)}
            setRestaurantes={(data) => this.props.setRestaurantes(data)}
            trocaBusca={this.trocaBusca}
            limpaBusca={this.limpaBusca}
            buscando={buscando}
          />
        </Modal>
      </div>
    );
  }
}

export default Restaurantes;
