import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import toast from "react-hot-toast";
import ReactLoading from "react-loading";

import { Link } from "react-router-dom";

import * as API from "../../API";

import "../../Assets/App.css";

import CardapioItem from "./CardapioItem";
import CarrinhoItem from "../Carrinho/CarrinhoItem";
import CarrinhoItemTotalizador from "../Carrinho/CarrinhoItemTotalizador";
import CarrinhoModal from "../Carrinho/CarrinhoModal";
import DocumentoModal from "../Carrinho/DocumentoModal";
import semImagem from "../../Assets/semImagem.jpg";
import moment from "moment";
import Destaques from "../Destaques/Destaques";

var CryptoJS = require("crypto-js");
class Cardapio extends Component {
  static propTypes = {
    restaurante: PropTypes.object.isRequired,
    carrinho: PropTypes.object.isRequired,
    addItem: PropTypes.func.isRequired,
    remItem: PropTypes.func.isRequired,
    endereco: PropTypes.object.isRequired,
    setEndereco: PropTypes.func,
    enviarPedido: PropTypes.func.isRequired,
    setFormaPagamento: PropTypes.func.isRequired,
    setTroco: PropTypes.func.isRequired,
    encontraCep: PropTypes.bool.isRequired,
    cliente: PropTypes.object,
    history: PropTypes.object.isRequired,
    getEndereco: PropTypes.func,
    hideEndereco: PropTypes.func,
    showEndereco: PropTypes.func,
    getEnderecos: PropTypes.func,
    setEntrega: PropTypes.func,
    getTaxa: PropTypes.func.isRequired,
    enderecoBusca: PropTypes.object.isRequired,
    modoVk: PropTypes.string.isRequired,
    cor1: PropTypes.string,
    cor2: PropTypes.string,
    cor3: PropTypes.string,
    getHoraAtual: PropTypes.func.isRequired,
    horaAtual: PropTypes.string,
    setObservacao: PropTypes.func.isRequired,
    enderecoVerificado: PropTypes.bool,
    setDocumento: PropTypes.func,
    documento: PropTypes.string,
  };

  state = {
    grupos: [],
    cardapio: [],
    isModalVisible: false,
    isDocumentVisible: false,
    modoEntrega: "ENTREGA",
    tipoItem: "NOVO",
    moeda: 0,
    loading: true,
  };

  showDocumentModal = () => {
    this.setState({ isDocumentVisible: true });
  };

  hideDocumentModal = () => {
    this.setState({ isDocumentVisible: false });
  };

  showCarModal = () => {
    if (this.props.cliente == null) {
      toast.error("Você precisa estar logado para realizar esta ação", {
        id: "toast_item",
        style: {},
      });
      this.props.history.push("/login");
    }
    this.setState({ isModalVisible: true });
  };

  hideCarModal = () => {
    this.setState({ isModalVisible: false });
  };

  async componentDidMount() {
    const { restaurante } = this.props;
    let loading = this.state.loading;

    if (loading) {
      let loggedCli = localStorage.getItem("Cliente");
      if (loggedCli !== null) {
        var decryptDados = CryptoJS.AES.decrypt(
          loggedCli,
          process.env.REACT_APP_ENCRYPT_PASS
        );
        var decryptedDados = JSON.parse(
          decryptDados.toString(CryptoJS.enc.Utf8)
        );

        API.get(
          "Cliente",
          `?idFirebase=${decryptedDados.uid}&email=${decryptedDados.email}`
        ).then((result) => {
          let cliente = result.cliente;

          this.props.getEnderecos(cliente);
        });
      }

      await API.get(
        "ProdutoGrupo",
        `?estab=${restaurante.id_estabelecimento}`
      ).then((data) => {
        this.setState({ grupos: [] });
        this.setState({ grupos: data.categorias });
      });

      await API.get("Produto", `?estab=${restaurante.id_estabelecimento}`).then(
        (data) => {
          this.setState({ cardapio: [] });
          this.setState({ cardapio: data.produtos });
        }
      );

      this.props.getHoraAtual();

      setTimeout(() => {
        this.setGrupos();
        this.setState({ loading: false });
      }, 2000);
    }

    this.setState({ modoEntrega: "ENTREGA", modo: "NOVO" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  setGrupos = () => {
    let grupos = this.state.grupos;
    let produtos = this.state.cardapio;
    let newGrupos = [];

    for (let [_, gpItem] of grupos.entries()) {
      let teste = produtos.find((prod) => prod.id_grupo === gpItem.id_grupo);
      if (teste !== undefined) {
        newGrupos.push(gpItem);
        continue;
      } else {
        continue;
      }
    }
    this.setState({ grupos: newGrupos });
  };

  clicouCard = () => {
    const defineTipoItem = "NOVO";
    this.setState({ tipoItem: defineTipoItem });
  };

  clicouEdit = () => {
    const defineTipoItem = "EDITAR";
    this.setState({ tipoItem: defineTipoItem });
  };

  formataTroco = () => {
    var elemento = document.getElementById("valor");
    var valor = elemento.value;

    valor = valor + "";
    valor = parseInt(valor.replace(/[\D]+/g, ""));
    valor = valor + "";
    valor = valor.replace(/([0-9]{2})$/g, ".$1");

    if (valor.length > 6) {
      valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, "$1.$2");
    }

    elemento.value = valor;
    if (valor === "NaN") {
      elemento.value = "";
    }

    this.setState({ moeda: valor });
    this.props.setTroco(valor);
  };

  render() {
    const {
      restaurante,
      carrinho,
      addItem,
      remItem,
      endereco,
      enviarPedido,
      setFormaPagamento,
      setEndereco,
      cliente,
      getEndereco,
      hideEndereco,
      showEndereco,
      encontraCep,
      getEnderecos,
      enderecoBusca,
      modoVk,
      cor1,
      cor2,
      cor3,
      horaAtual,
      enderecoVerificado,
      documento,
    } = this.props;

    const {
      grupos,
      cardapio,
      isModalVisible,
      isDocumentVisible,
      modoEntrega,
      tipoItem,
      loading,
    } = this.state;

    let itens = [];
    if (restaurante === carrinho.restaurante) {
      itens = carrinho.itens;
    }
    const vrTotalProdutos = itens.reduce((sum, item) => sum + item.vr_total, 0);

    return (
      <div>
        {!loading ? (
          <>
            {/*-----------CONTAINER RESTAURANTE----------*/}
            <div
              className="row"
              style={{
                border: "none",
                margin: "0",
              }}
            >
              <div className="col-xs-12 col-sm-12" style={{ padding: "15px" }}>
                <div
                  className="panel panel-default"
                  style={{
                    border: "none",
                    boxShadow: "none",
                  }}
                >
                  <div className="col-sm-2 only-desktop"></div>
                  <div
                    className="col-xs-6 col-sm-4 "
                    style={{ display: "flex", textAlign: "center" }}
                  >
                    <img
                      alt="..."
                      src={
                        restaurante.imagem === ""
                          ? semImagem
                          : restaurante.imagem
                      }
                      style={{
                        borderRadius: "15px",
                        backgroundColor: "#fff",
                        width: "200px",
                        height: "200px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div
                    className="col-xs-6 col-sm-4"
                    style={{ padding: "10px", textAlign: "right" }}
                  >
                    <div className="col-xs-12 col-sm-12">
                      <b style={{ fontSize: "20px" }}>
                        {restaurante.razao_social}
                      </b>
                    </div>
                    <div className="col-xs-12 col-sm-12">
                      <h4 className="text-muted">
                        <b>{restaurante.segmento}</b>
                      </h4>
                    </div>
                    <div className="col-xs-12 col-sm-12">
                      <h5 className="text-muted">
                        {restaurante.abertura !== undefined
                          ? `Abertura: ${restaurante.abertura}`
                          : null}
                      </h5>{" "}
                      <h5 className="text-muted">
                        {restaurante.fechamento !== undefined
                          ? `Fechamento: ${restaurante.fechamento}`
                          : null}
                      </h5>
                    </div>
                  </div>
                  <div className="col-sm-2 only-desktop"></div>
                </div>
              </div>
              {moment(horaAtual, "hhmm") <
                moment(restaurante.abertura, "hhmm") ||
              moment(horaAtual, "hhmm") >=
                moment(restaurante.fechamento, "hhmm") ? (
                <div
                  className="col-xs-12 col-sm-12"
                  style={{
                    padding: "7px",
                    backgroundColor: `${modoVk === "VK" ? "#FF5722" : cor3}`,
                    textAlign: "center",
                    color: `${modoVk === "VK" ? "white" : cor2}`,
                  }}
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill={`${modoVk === "VK" ? "white" : cor2}`}
                      className="bi bi-exclamation-circle-fill"
                      viewBox="0 0 16 16"
                      style={{ marginRight: "10px" }}
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                    Loja fechada no momento
                  </span>
                </div>
              ) : null}
            </div>
            {/* --------NAVBAR DE MENU-------- */}
            {(grupos !== null &&
              grupos !== undefined &&
              grupos.length !== 0 &&
              modoVk === "ESTAB") ||
            modoVk !== "ESTAB" ? (
              <nav
                className="navbar navbar-default "
                style={{
                  overflow: "auto",
                  borderRadius: "0px",
                  backgroundColor: "#fff",
                }}
              >
                <ul className="navbar-nav" style={{ display: "inline-flex" }}>
                  {modoVk === "VK" ? (
                    <Link to="/restaurantes" style={{ color: "gray" }}>
                      <button
                        className="nav-item navbar-text btn-lg btn-default"
                        style={{
                          border: "none",
                          background: "none",
                          backgroundColor: cor3 + "1A",
                          color: cor3,
                        }}
                      >
                        Voltar
                      </button>
                    </Link>
                  ) : null}
                  {grupos !== null &&
                  grupos !== undefined &&
                  grupos.length !== 0
                    ? grupos.map((grupo) => (
                        <button
                          className="nav-item navbar-text btn-lg btn-default"
                          key={grupo.id_grupo}
                          onClick={() => {
                            document
                              .getElementById(`gp${grupo.id_grupo}`)
                              .scrollIntoView();
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            width: "auto",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            backgroundColor: cor3 + "1A",
                            color: cor3,
                          }}
                        >
                          {grupo.descricao}
                        </button>
                      ))
                    : null}
                </ul>
              </nav>
            ) : null}
            {/* -------------DESTAQUES-------- */}
            {/* <div className="col-sm-12">
              <h3
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Destaques
              </h3>
              <Destaques />
            </div> */}
            {/* ------------PAGINA PRINCIPAL------------ */}
            <div className="container-fluid">
              <div className="col-xlg-12">
                {/*
                {cardapio != null || cardapio > 0 ? (
                  <div
                    className="col-sm-12"
                    style={{ alignContent: "center", padding: "0" }}
                  >
                     !!!!!! ---------CARDÁPIO------- !!!!!!
                    {categoriA === 0 ? (
                      <h3
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Cardápio
                      </h3>
                    ) : (
                      <h3
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Cardápio: {grupoNom}
                      </h3>
                    )}
                  </div>
                ) : null}
                */}
                <div
                  className={
                    cardapio !== null || cardapio > 0 ? "col-sm-7" : "col-12"
                  }
                  style={{
                    alignContent: "center",
                    padding: "0",
                    marginTop: cardapio !== null || cardapio > 0 ? "" : "60px",
                  }}
                >
                  {grupos !== null &&
                  grupos !== undefined &&
                  grupos.length !== 0 ? (
                    grupos.map((grupo) => (
                      <div key={grupo.id_grupo}>
                        <div className="col-sm-12" id={`gp${grupo.id_grupo}`}>
                          <h3
                            style={{
                              fontWeight: "bold",
                              textAlign: "center",
                              color: cor3,
                            }}
                          >
                            {grupo.descricao}
                          </h3>
                        </div>
                        <div
                          className="col-sm-12"
                          style={{
                            display: "grid",
                            gridColumnGap: "5px",
                            gridRowGap: "2px",
                            gridTemplateColumns: "repeat(auto-fill, 341px)",
                            gridArea: "auto",
                            marginBottom: "10px",
                            justifyContent: "space-evenly",
                            justifyItems: "center",
                            alignContent: "space-evenly",
                            alignItems: "center",
                            padding: "15px",
                            paddingTop: "0",
                          }}
                        >
                          {cardapio
                            .filter(
                              (item) =>
                                item.status_produto === 1 &&
                                item.id_grupo === grupo.id_grupo
                            )
                            .map((item) => (
                              <CardapioItem
                                key={item.id_produto}
                                item={item}
                                addItem={addItem}
                                hideModal={this.hideModal}
                                restaurante={restaurante}
                                clicouCard={this.clicouCard}
                                tipoItem={tipoItem}
                                modoVk={modoVk}
                                cor3={cor3}
                              />
                            ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      className="container-fluid"
                      style={{ textAlign: "center" }}
                    >
                      <h2>Sentimos muito...</h2>
                      <p>Esta loja ainda não tem produtos disponíveis</p>
                    </div>
                  )}
                </div>
                {/* {cardapio != null || cardapio > 0 ? (
                  <div
                    className="col-sm-7"
                    style={{ alignContent: "center", padding: "0" }}
                  >
                    <div
                      className="col-sm-12"
                      style={{
                        display: "grid",
                        gridColumnGap: "5px",
                        gridRowGap: "2px",
                        gridTemplateColumns: "repeat(auto-fill, 341px)",
                        gridArea: "auto",
                        marginBottom: "10%",
                        justifyContent: "space-evenly",
                        justifyItems: "center",
                        alignContent: "space-evenly",
                        alignItems: "center",
                        padding: "15px",
                        paddingTop: "0",
                      }}
                    >
                      {cardapio
                        .filter((item) =>
                          categoriA === 0
                            ? item.status_produto === 1 &&
                              item.id_grupo !== categoriA
                            : item.status_produto === 1 &&
                              item.id_grupo === categoriA
                        )
                        .map((item) => (
                          <CardapioItem
                            key={item.id_produto}
                            item={item}
                            addItem={addItem}
                            hideModal={this.hideModal}
                            restaurante={restaurante}
                            clicouCard={this.clicouCard}
                            tipoItem={tipoItem}
                            modoVk={modoVk}
                            cor3={cor3}
                          />
                        ))}
                    </div>
                  </div>
                ) : (
                  <h3
                    style={{
                      textAlign: "center",
                      fontWeight: "600",
                      color: "black",
                      margin: "5%",
                    }}
                  >
                    Estamos sem Cardápio no momento
                    <p />
                    <Link to="/restaurantes" style={{ color: "gray" }}>
                      Voltar
                    </Link>
                  </h3>
                )} */}

                {/* ---------CARRINHO-------- */}

                {cardapio !== null || cardapio > 0 ? (
                  <div
                    className="col-sm-5 "
                    style={{
                      justifyContent: "space-evenly",
                      justifyItems: "center",
                      alignContent: "space-evenly",
                      alignItems: "center",
                      marginBottom: "15%",
                      background: "white",
                      borderRadius: "4px",
                      padding: "10px",
                      border: "1px solid rgba(0, 0, 0, 0.15)",
                    }}
                    id="carrinho"
                  >
                    <div className="col-sm-12">
                      <div className="row" style={{ padding: "20px" }}>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "black",
                          }}
                          className="col-xs-10"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            fill="currentColor"
                            className="bi bi-bag-fill"
                            viewBox="0 0 16 16"
                            style={{ marginRight: "5px" }}
                          >
                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                          </svg>
                          {restaurante.razao_social}
                        </div>
                        <div
                          className="col-xs-2"
                          style={{ textAlign: "right" }}
                        >
                          {this.props.carrinho.itens.length > 0 &&
                          this.props.carrinho.itens.length < 10 ? (
                            <span
                              className="badge"
                              style={{ padding: "5px 15px" }}
                            >
                              {this.props.carrinho.itens.length}
                            </span>
                          ) : this.props.carrinho.itens.length >= 10 ? (
                            <span
                              className="badge"
                              style={{ padding: "5px 15px" }}
                            >
                              10+
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div
                        className="col-sm-12"
                        style={{ padding: "0", marginBottom: "10px" }}
                      >
                        {itens !== null || itens.length > 0
                          ? itens.map((item, index) => (
                              <CarrinhoItem
                                key={index}
                                item={item}
                                cardapio={cardapio}
                                addItem={addItem}
                                remItem={remItem}
                                restaurante={restaurante}
                                tipoItem={tipoItem}
                                clicouEdit={this.clicouEdit}
                                modoVk={modoVk}
                                cor3={cor3}
                              />
                            ))
                          : null}
                        <CarrinhoItemTotalizador
                          label="Sub Total"
                          valor={vrTotalProdutos}
                        />
                        {isNaN(this.props.endereco.taxa) ? null : (
                          <>
                            <CarrinhoItemTotalizador
                              label="Taxa Entrega"
                              valor={
                                isNaN(this.props.endereco.taxa)
                                  ? 0
                                  : modoEntrega === "RETIRADA"
                                  ? 0
                                  : this.props.endereco.taxa
                              }
                            />
                            <CarrinhoItemTotalizador
                              label="Total"
                              valor={
                                modoEntrega === "RETIRADA"
                                  ? vrTotalProdutos
                                  : vrTotalProdutos + this.props.endereco.taxa
                              }
                              bold
                            />
                          </>
                        )}
                      </div>
                      {/* -------FINALIZA---- */}
                      {cliente === null || cliente === undefined ? (
                        <div
                          className="col-sm-12"
                          style={{ textAlign: "center" }}
                        >
                          <button
                            onClick={enviarPedido}
                            className="btn"
                            style={{
                              background: `${
                                modoVk === "VK" ? "#ff5722" : cor3
                              }`,
                              color: "white",
                              borderRadius: "50px",
                              fontWeight: "bold",
                            }}
                            disabled={
                              vrTotalProdutos === 0 ||
                              moment(horaAtual, "hhmm") <
                                moment(restaurante.abertura, "hhmm") ||
                              moment(horaAtual, "hhmm") >=
                                moment(restaurante.fechamento, "hhmm")
                            }
                          >
                            {moment(horaAtual, "hhmm") <
                              moment(restaurante.abertura, "hhmm") ||
                            moment(horaAtual, "hhmm") >=
                              moment(restaurante.fechamento, "hhmm") ? (
                              <>Loja fechada</>
                            ) : (
                              <>Finalizar Pedido</>
                            )}
                            {moment(horaAtual, "hhmm") <
                              moment(restaurante.abertura, "hhmm") ||
                            moment(horaAtual, "hhmm") >=
                              moment(restaurante.fechamento, "hhmm")
                              ? null
                              : vrTotalProdutos !== 0 &&
                                modoEntrega === "ENTREGA"
                              ? ": " +
                                new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(
                                  carrinho.itens.reduce(
                                    (sum, item) => sum + item.vr_total,
                                    0
                                  )
                                )
                              : null}
                          </button>
                        </div>
                      ) : (
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="row">
                              <hr style={{ width: "95%" }}></hr>
                              <div className="form-group col-sm-8">
                                {modoEntrega === "ENTREGA" ? (
                                  <>
                                    <label style={{ color: "black" }}>
                                      Endereço:
                                    </label>
                                    <span
                                      className="form-control input-sm input-xs"
                                      style={{
                                        height: "auto",
                                        minHeight: "3vh",
                                        border: "none",
                                      }}
                                    >
                                      {(endereco.bairro === "" &&
                                        endereco.cep === "" &&
                                        endereco.complemento === "" &&
                                        endereco.logradouro === "" &&
                                        endereco.municipio === "" &&
                                        endereco.numero === "" &&
                                        endereco.taxa === undefined) ||
                                      (endereco.taxa === 0 &&
                                        endereco.uf === "" &&
                                        enderecoVerificado)
                                        ? "Não possui endereço padrão"
                                        : (endereco.bairro === "" &&
                                            endereco.cep === "" &&
                                            endereco.complemento === "" &&
                                            endereco.logradouro === "" &&
                                            endereco.municipio === "" &&
                                            endereco.numero === "" &&
                                            endereco.taxa === undefined) ||
                                          (endereco.taxa === 0 &&
                                            endereco.uf === "" &&
                                            !enderecoVerificado)
                                        ? "Selecione outro endereço"
                                        : endereco.complemento === ""
                                        ? `${endereco.logradouro}, ${endereco.numero},
                        ${endereco.bairro} - ${endereco.municipio}`
                                        : `${endereco.logradouro}, ${endereco.numero}, ${endereco.complemento},
                        ${endereco.bairro} - ${endereco.municipio}`}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <label style={{ color: "black" }}>
                                      Endereço de Retirada:
                                    </label>
                                    <span
                                      className="form-control input-sm input-xs"
                                      style={{
                                        height: "auto",
                                        minHeight: "3vh",
                                        border: "none",
                                      }}
                                    >
                                      {`${restaurante.logradouro}, ${restaurante.numero}, ${restaurante.bairro} - ${restaurante.municipio}, ${restaurante.uf}`}
                                    </span>
                                  </>
                                )}
                              </div>
                              <div
                                className="col-sm-4"
                                style={{ marginTop: "25px" }}
                              >
                                <button
                                  className="btn btn-sm btn-block"
                                  style={{
                                    borderRadius: "5px",
                                    // border: "2px solid #ccc",
                                    verticalAlign: "middle",
                                    backgroundColor: `${
                                      modoVk === "VK" ? "#ff5722" : cor3
                                    }`,
                                    // borderRadius: "50px",
                                    border: "none",
                                    color: "white",
                                  }}
                                  onClick={this.showCarModal}
                                  disabled={modoEntrega !== "ENTREGA"}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-house-fill"
                                    viewBox="0 0 16 16"
                                    style={{ marginRight: "2px" }}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
                                    />
                                    <path
                                      fillRule="evenodd"
                                      d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
                                    />
                                  </svg>{" "}
                                  Endereços
                                </button>
                              </div>
                            </div>
                            <div className="row" style={{ marginTop: "10px" }}>
                              <div className="form-group col-sm-7">
                                <label style={{ color: "black" }}>
                                  Forma de Pagamento:
                                </label>
                                <select
                                  className="form-control input-sm"
                                  name="forma"
                                  defaultValue={carrinho.formaPagamento}
                                  onChange={(e) =>
                                    setFormaPagamento(e.target.value)
                                  }
                                >
                                  <option value="Dinheiro">Dinheiro</option>
                                  <option value="Cartão - Débito">
                                    Cartão-Débito
                                  </option>
                                  <option value="Cartão - Crédito">
                                    Cartão-Crédito
                                  </option>
                                </select>
                              </div>
                              <div className="form-group col-sm-5">
                                {carrinho.formaPagamento === "Dinheiro" ? (
                                  <>
                                    <label style={{ color: "black" }}>
                                      Troco para R$:
                                    </label>
                                    <input
                                      type="text"
                                      maxLength="9"
                                      onKeyUp={() => this.formataTroco()}
                                      className="form-control input-sm"
                                      placeholder="R$"
                                      id="valor"
                                    />
                                  </>
                                ) : null}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-12">
                                <label>CPF/CNPJ na nota:</label>
                              </div>

                              <div className="col-sm-8">
                                <span
                                  className="form-control input-sm input-xs"
                                  style={{
                                    height: "auto",
                                    minHeight: "3vh",
                                    border: "none",
                                    padding: "5px",
                                  }}
                                >
                                  {documento !== null &&
                                  documento !== undefined &&
                                  documento !== "" ? (
                                    documento
                                  ) : (
                                    <>CPF/CNPJ não informado.</>
                                  )}
                                </span>
                              </div>
                              <div className="col-sm-4">
                                <button
                                  onClick={() => this.showDocumentModal()}
                                  className="btn btn-sm btn-block"
                                  style={{
                                    borderRadius: "5px",
                                    verticalAlign: "middle",
                                    backgroundColor: `${
                                      modoVk === "VK" ? "#ff5722" : cor3
                                    }`,
                                    border: "none",
                                    color: "white",
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-file-earmark-fill"
                                    viewBox="0 0 16 16"
                                    style={{ marginRight: "2px" }}
                                  >
                                    <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z" />
                                  </svg>{" "}
                                  {documento !== "" &&
                                  documento !== null &&
                                  documento !== undefined ? (
                                    <>Editar</>
                                  ) : (
                                    <>Incluir</>
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className="row">
                              <div className="form-group col-sm-12">
                                <label>Observação:</label>

                                <textarea
                                  id="story"
                                  name="story"
                                  rows="5"
                                  cols="33"
                                  onChange={(e) => {
                                    this.props.setObservacao(e.target.value);
                                  }}
                                  style={{
                                    border: "1px solid #d9d9d9",
                                    borderRadius: "5px",
                                    outline: "none",
                                    maxHeight: "100px",
                                    maxWidth: "100%",
                                    minWidth: "100%",
                                  }}
                                />
                              </div>
                            </div>
                            <div
                              className="row"
                              style={{
                                textAlign: "center",
                                marginBottom: "20px",
                              }}
                            >
                              <div
                                className="button-group"
                                data-toggle="buttons"
                              >
                                <button
                                  className="btn btn-default"
                                  name="ENTREGA"
                                  defaultChecked={true}
                                  style={{
                                    marginRight: "10px",
                                    borderRadius: "50px",
                                    border: "none",
                                    width: "150px",
                                    color: "white",
                                    backgroundColor:
                                      modoEntrega === "ENTREGA"
                                        ? `${
                                            modoVk === "VK" ? "#ff5722" : cor3
                                          }`
                                        : "rgb(204, 204, 204)",
                                  }}
                                  onClick={() => {
                                    const modo = "ENTREGA";
                                    this.setState({ modoEntrega: modo });
                                    this.props.setEntrega(modo);
                                  }}
                                >
                                  Entregar
                                </button>
                                <button
                                  className="btn btn-default"
                                  name="RETIRADA"
                                  style={{
                                    marginRight: "10px",
                                    borderRadius: "50px",
                                    border: "none",
                                    width: "150px",
                                    color: "white",
                                    backgroundColor:
                                      modoEntrega === "RETIRADA"
                                        ? `${
                                            modoVk === "VK" ? "#ff5722" : cor3
                                          }`
                                        : "rgb(204, 204, 204)",
                                  }}
                                  onClick={() => {
                                    const modo = "RETIRADA";
                                    this.setState({ modoEntrega: modo });
                                    this.props.setEntrega(modo);
                                  }}
                                >
                                  Retirar
                                </button>
                              </div>
                            </div>
                            <div className="row">
                              <div
                                className="col-sm-12"
                                style={{ textAlign: "center" }}
                              >
                                <button
                                  onClick={() => {
                                    if (
                                      (modoEntrega === "ENTREGA" &&
                                        endereco.bairro === "" &&
                                        endereco.cep === "" &&
                                        endereco.complemento === "" &&
                                        endereco.logradouro === "" &&
                                        endereco.municipio === "" &&
                                        endereco.numero === "" &&
                                        endereco.taxa === 0) ||
                                      (endereco.taxa === undefined &&
                                        endereco.uf === "") ||
                                      (!enderecoVerificado &&
                                        modoEntrega === "ENTREGA")
                                    ) {
                                      toast.error(
                                        "Você precisa de um endereço para finalizar o pedido",
                                        {
                                          id: "toast_item",
                                        }
                                      );
                                      return;
                                    }
                                    if (
                                      carrinho.formaPagamento === "Dinheiro" &&
                                      carrinho.troco !== 0 &&
                                      carrinho.troco <=
                                        vrTotalProdutos + endereco.taxa
                                    ) {
                                      toast.error(
                                        "O valor do troco não pode ser menor que o valor da compra!"
                                      );
                                      return;
                                    } else {
                                      this.props.enviarPedido();
                                    }
                                  }}
                                  className="btn"
                                  style={{
                                    background: `${
                                      modoVk === "VK" ? "#ff5722" : cor3
                                    }`,
                                    color: "white",
                                    borderRadius: "50px",
                                    fontWeight: "bold",
                                  }}
                                  disabled={
                                    vrTotalProdutos === 0 ||
                                    moment(horaAtual, "hhmm") <
                                      moment(restaurante.abertura, "hhmm") ||
                                    moment(horaAtual, "hhmm") >=
                                      moment(restaurante.fechamento, "hhmm")
                                  }
                                >
                                  {moment(horaAtual, "hhmm") <
                                    moment(restaurante.abertura, "hhmm") ||
                                  moment(horaAtual, "hhmm") >=
                                    moment(restaurante.fechamento, "hhmm") ? (
                                    <>Loja fechada</>
                                  ) : (
                                    <>Finalizar Pedido</>
                                  )}
                                  {moment(horaAtual, "hhmm") <
                                    moment(restaurante.abertura, "hhmm") ||
                                  moment(horaAtual, "hhmm") >=
                                    moment(restaurante.fechamento, "hhmm")
                                    ? null
                                    : (vrTotalProdutos !== 0 &&
                                        modoEntrega === "ENTREGA" &&
                                        moment(horaAtual, "hhmm") >=
                                          moment(
                                            restaurante.abertura,
                                            "hhmm"
                                          )) ||
                                      moment(horaAtual, "hhmm") <=
                                        moment(restaurante.fechamento, "hhmm")
                                    ? ": " +
                                      new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      }).format(
                                        modoEntrega === "RETIRADA"
                                          ? vrTotalProdutos
                                          : vrTotalProdutos +
                                              this.props.endereco.taxa
                                      )
                                    : vrTotalProdutos !== 0 &&
                                      modoEntrega === "RETIRADA"
                                    ? ": " +
                                      new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      }).format(
                                        modoEntrega === "RETIRADA"
                                          ? vrTotalProdutos
                                          : vrTotalProdutos +
                                              this.props.endereco.taxa
                                      )
                                    : null}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div>
                        <button
                          className="float"
                          style={{
                            backgroundColor:
                              modoVk === "VK"
                                ? "#ff0000"
                                : modoVk === "ESTAB"
                                ? cor3
                                : "#ff0000",
                          }}
                          onClick={() =>
                            document.getElementById("carrinho").scrollIntoView()
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            fill="white"
                            className="bi bi-bag-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                          </svg>
                          {this.props.carrinho.itens.length > 0 &&
                          this.props.carrinho.itens.length < 10 ? (
                            <span
                              className="badge"
                              style={{
                                padding: "5px 10px",
                                color: `${modoVk === "VK" ? "#ff5722" : cor3}`,
                                backgroundColor: "white",
                              }}
                            >
                              {this.props.carrinho.itens.length}
                            </span>
                          ) : this.props.carrinho.itens.length >= 10 ? (
                            <span
                              className="badge"
                              style={{
                                padding: "5px 6px",
                                color: `${modoVk === "VK" ? "#ff5722" : cor3}`,
                                backgroundColor: "white",
                              }}
                            >
                              10+
                            </span>
                          ) : null}
                        </button>
                        <Modal
                          className="modal-dialog modal-dialog-centered modal-lg"
                          ariaHideApp={false}
                          isOpen={isModalVisible}
                          onRequestClose={this.hideCarModal}
                          style={{
                            content: {
                              position: "center",
                              border: "1px solid #ccc",
                              background: "#fff",
                              WebkitOverflowScrolling: "touch",
                              borderRadius: "10px",
                              outline: "none",
                              padding: "20px",
                              overflow: "auto",
                              maxWidth: "95vw",
                              maxHeight: "93vh",
                              minHeight: "50vh",
                            },
                            overlay: {
                              position: "fixed",
                              backgroundColor: "rgba(0.30, 0.20, 0, 0.40)",
                            },
                          }}
                        >
                          <CarrinhoModal
                            cliente={cliente}
                            endereco={endereco}
                            getEndereco={getEndereco}
                            getEnderecos={getEnderecos}
                            setEndereco={setEndereco}
                            hideCarModal={this.hideCarModal}
                            showEndereco={showEndereco}
                            hideEndereco={hideEndereco}
                            encontraCep={encontraCep}
                            enderecoBusca={enderecoBusca}
                            modoVk={modoVk}
                            cor3={cor3}
                          />
                        </Modal>
                        <Modal
                          className="modal-dialog modal-dialog-centered modal-sm"
                          ariaHideApp={false}
                          isOpen={isDocumentVisible}
                          onRequestClose={() => this.hideDocumentModal()}
                          style={{
                            content: {
                              position: "center",
                              border: "1px solid #ccc",
                              background: "#fff",
                              WebkitOverflowScrolling: "touch",
                              borderRadius: "10px",
                              outline: "none",
                              padding: "20px",
                              overflow: "auto",
                              top: "25vh",
                              maxWidth: "95vw",
                              maxHeight: "93vh",
                              minHeight: "30vh",
                            },
                            overlay: {
                              position: "fixed",
                              backgroundColor: "rgba(0.30, 0.20, 0, 0.40)",
                            },
                          }}
                        >
                          <DocumentoModal
                            hideDocumentModal={() => this.hideDocumentModal()}
                            setDocumento={(documento) =>
                              this.props.setDocumento(documento)
                            }
                            documento={documento}
                          />
                        </Modal>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <div className="loaderApp">
            <ReactLoading
              type="spinningBubbles"
              color={modoVk === "VK" ? "#ff5722" : cor3}
              height={100}
              width={100}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Cardapio;
