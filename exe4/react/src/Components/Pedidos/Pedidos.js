import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalPedidos from "react-modal";
import toast from "react-hot-toast";
import "./Pedidos.css";
import * as API from "../../API";
import PedidoModal from "./PedidoModal";
import Pedido from "./Pedido";

class Pedidos extends Component {
  static propTypes = {
    cliente: PropTypes.object.isRequired,
    modoVk: PropTypes.string.isRequired,
    cor3: PropTypes.string,
    restaurante: PropTypes.object,
  };

  state = {
    pedidos: [],
    pedido: {},
    itens: [],
    vrTotal: 0,
    isModalPedVisible: false,
    isOpen: true,
    modoPedido: "ABERTO",
    subtotal: 0,
    hasOpen: true,
  };

  showPedidoModal = () => {
    this.setState({ isModalPedVisible: true });
  };

  hidePedidoModal = () => {
    this.setState({ isModalPedVisible: false });
  };

  timer = (seconds) => {
    let time = seconds * 1000;
    return new Promise((res) => setTimeout(res, time));
  };

  async doSomething(cliente) {
    while (this.state.isOpen) {
      API.get("Pedidos", `?idCliente=${cliente.id_cliente}`).then((data) => {
        if (this.props.modoVk === "VK") {
          if (data.pedidos !== null) {
            this.setState({ pedidos: data.pedidos });
            let pedido = this.state.pedido;
            for (const p of data.pedidos) {
              if (p.id_pedido === pedido.id_pedido) {
                if (p.status_pedido !== pedido.status_pedido) {
                  toast.success(`Pedido ${p.id_pedido}: ${p.status_pedido}!`, {
                    duration: 6000,
                  });

                  pedido.status_pedido = p.status_pedido;
                  this.setState({ pedido });
                }
              }
            }
          }
        } else if (this.props.modoVk === "ESTAB") {
          if (data.pedidos !== null) {
            let pedidosRestaurante = [];
            for (let [_, ped] of data.pedidos.entries()) {
              if (
                ped.id_estabelecimento ===
                this.props.restaurante.id_estabelecimento
              ) {
                pedidosRestaurante.push(ped);
              }
            }
            this.setState({ pedidos: pedidosRestaurante });
            let pedido = this.state.pedido;
            for (const p of pedidosRestaurante) {
              if (p.id_pedido === pedido.id_pedido) {
                if (p.status_pedido !== pedido.status_pedido) {
                  toast.success(`Pedido ${p.id_pedido}: ${p.status_pedido}!`, {
                    duration: 6000,
                  });

                  pedido.status_pedido = p.status_pedido;
                  this.setState({ pedido });
                }
              }
            }
          }
        }
      });
      await this.timer(30);
    }
  }

  verificaPedido = (pedido) => {
    this.setPedido(pedido);
  };

  calSubtotal = () => {
    let itens = this.state.itens;
    let arrPreco = [];

    // eslint-disable-next-line
    if (itens.length > 0) {
      for (let [_, item] of itens.entries()) {
        if (
          item.vr_total_sub_itens !== null &&
          item.vr_total_sub_itens !== undefined
        ) {
          let preco =
            (item.vr_unitario + item.vr_total_sub_itens) * item.quantidade;

          arrPreco.push(preco);
        } else {
          let preco = item.vr_unitario * item.quantidade;

          arrPreco.push(preco);
        }
      }
      let subtotal = arrPreco.reduce((soma, i) => {
        return soma + i;
      });
      subtotal = parseFloat(subtotal);
      this.setState({ subtotal });
    }
  };

  componentDidMount() {
    const cliente = this.props.cliente;
    this.setState({ hasOpen: true });
    setTimeout(() => {
      this.setState({ hasOpen: " " });
      this.setState({ hasOpen: false });
    }, 1000);
    API.get("Pedidos", `?idCliente=${cliente.id_cliente}`).then((data) => {
      if (data.pedidos !== null) {
        if (this.props.modoVk === "VK") {
          this.setState({ pedidos: data.pedidos });
          let pedidoAberto = data.pedidos.filter(
            (pedido) =>
              pedido.status_pedido !== "CANCELADO" &&
              pedido.status_pedido !== "ENTREGUE"
          );
          if (pedidoAberto.length > 0) {
            this.setPedido(pedidoAberto[0]);
          } else {
            this.setPedido(data.pedidos[0]);
          }

          this.calSubtotal();
        } else {
          let pedidosRestaurante = [];

          for (let [_, ped] of data.pedidos.entries()) {
            if (
              ped.id_estabelecimento ===
              this.props.restaurante.id_estabelecimento
            ) {
              pedidosRestaurante.push(ped);
            }
          }

          this.setState({ pedidos: pedidosRestaurante });
          if (pedidosRestaurante.length > 0) {
            this.setPedido(pedidosRestaurante[0]);
            this.calSubtotal();
          } else {
            this.setState({ pedido: {} });
          }
        }
      }
    });
    this.setState({ isOpen: true });
    this.doSomething(cliente);
  }

  componentWillUnmount() {
    this.setState({ isOpen: false });
  }

  setPedido = async (pedido) => {
    if (pedido !== null || pedido !== undefined) {
      await API.get("Pedidos", `?id_pedido=${pedido.id_pedido}`).then(
        (data) => {
          //Resolver erro de NaN temporáriamente
          for (let item of data) {
            if (item.subItens !== null && item.subItens !== undefined) {
              for (let sub of item.subItens) {
                if (sub.vr_adicional === undefined || sub.vr_adicional === "") {
                  sub.vr_adicional = 0;
                }
              }
            } else {
              item.subItens = [];
            }

            if (
              item.vr_total_sub_itens === undefined ||
              item.vr_total_sub_itens === ""
            ) {
              item.vr_total_sub_itens = 0;
            }
          }
          if (!this.state.hasOpen) {
            if (window.matchMedia("(max-width: 767px)").matches) {
              this.showPedidoModal();
            }
          }

          if (
            pedido.documento !== "" &&
            pedido.documento !== null &&
            pedido.documento !== undefined
          ) {
            if (pedido.documento.length === 14) {
              pedido.documento = pedido.documento.substr(0, 5);
              pedido.documento = pedido.documento += "**.***-**";
            } else {
              pedido.documento = pedido.documento.substr(0, 4);
              pedido.documento = pedido.documento += "**.***/****-**";
            }
            this.setState({ pedido });
            this.setState({ itens: data });
            this.calSubtotal();
          } else {
            this.setState({ pedido });
            this.setState({ itens: data });
            this.calSubtotal();
          }
        }
      );
    }
  };

  mudaNome(statusPedido) {
    switch (statusPedido) {
      case "CONFIRMADO":
        return (
          <div
            className="col-xs-12"
            style={{
              border: "1px solid DeepSkyBlue",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            Confirmado
          </div>
        );
      case "ENVIADO":
        return (
          <div
            className="col-xs-12"
            style={{
              border: "1px solid gray",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            Enviado
          </div>
        );
      case "ENTREGUE":
        return (
          <div
            className="col-xs-12"
            style={{
              border: "1px solid green",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            Entregue
          </div>
        );
      case "CANCELADO":
        return (
          <div
            className="col-xs-12"
            style={{
              border: "1px solid red",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            Cancelado
          </div>
        );
      default:
        return (
          <div
            className="col-xs-12"
            style={{
              border: "1px solid orange",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            Pendente
          </div>
        );
    }
  }

  verificaStatus = (pedido) => {
    if (this.state.modoPedido === "ABERTO") {
      return (
        pedido.status_pedido !== "CANCELADO" &&
        pedido.status_pedido !== "ENTREGUE"
      );
    } else {
      return (
        pedido.status_pedido === "CANCELADO" ||
        pedido.status_pedido === "ENTREGUE"
      );
    }
  };

  renderSwitch(statusPedido) {
    switch (statusPedido) {
      case "CONFIRMADO":
        return (
          <div
            className="col-xs-4"
            style={{
              border: "1px solid DeepSkyBlue",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <b>Confirmado</b>
          </div>
        );
      case "ENVIADO":
        return (
          <div
            className="col-xs-4"
            style={{
              border: "1px solid gray",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <b>A caminho</b>
          </div>
        );
      case "ENTREGUE":
        return (
          <div
            className="col-xs-4"
            style={{
              border: "1px solid green",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <b>Entregue</b>
          </div>
        );
      case "CANCELADO":
        return (
          <div
            className="col-xs-4"
            style={{
              border: "1px solid red",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <b>Cancelado</b>
          </div>
        );
      default:
        return (
          <div
            className="col-xs-4"
            style={{
              border: "1px solid orange",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <b>Pendente</b>
          </div>
        );
    }
  }

  render() {
    const {
      pedidos,
      pedido,
      itens,
      isModalVisible,
      isModalPedVisible,
      modoPedido,
      subtotal,
    } = this.state;

    const { modoVk, cor3 } = this.props;

    return (
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-md-4 col-sm-5 mobile-show"
            style={{
              backgroundColor: "#f8f8f8",
              border: "1px solid rgb(231, 231, 231)",
              minHeight: "100vh",
              maxHeight: "100vh",
            }}
          >
            <div
              className="col-xs-12"
              style={{
                textAlign: "center",
                width: "100%",
                backgroundColor: "#ffff",
              }}
            >
              <h3
                style={{
                  color: modoVk === "VK" ? "#ff0000" : cor3,
                  fontWeight: "bold",
                }}
              >
                Meus Pedidos
              </h3>
            </div>
            <div className="block">
              {pedidos.length === 0 ? (
                <h4>Você ainda não realizou pedidos</h4>
              ) : (
                <>
                  <div
                    className="row chcRow"
                    style={{ marginBottom: "20px", backgroundColor: "#ffff" }}
                  >
                    <div
                      className="col-xs-6"
                      style={{ margin: "0", padding: "0" }}
                    >
                      <button
                        className="btnChc"
                        style={{
                          outline: "none",
                          borderRadius: "2px 0px 0px 0px",
                          borderBottom: `${
                            modoPedido === "ABERTO"
                              ? `solid 3px ${
                                  modoVk === "VK" ? "#ff0000" : cor3
                                }`
                              : ""
                          }`,
                          borderRight: "none",
                        }}
                        onClick={() => this.setState({ modoPedido: "ABERTO" })}
                      >
                        {modoPedido === "ABERTO" ? (
                          <b
                            style={{
                              color: modoVk === "VK" ? "#ff0000" : cor3,
                            }}
                          >
                            Aberto
                          </b>
                        ) : (
                          <>Aberto</>
                        )}
                      </button>
                    </div>
                    <div
                      className="col-xs-6"
                      style={{ margin: "0", padding: "0" }}
                    >
                      <button
                        className="btnChc"
                        style={{
                          outline: "none",
                          borderRadius: "0px 0px 0px 2px",
                          borderBottom: `${
                            modoPedido !== "ABERTO"
                              ? `solid 3px ${
                                  modoVk === "VK" ? "#ff0000" : cor3
                                }`
                              : ""
                          }`,
                          borderLeft: "none",
                        }}
                        onClick={() =>
                          this.setState({ modoPedido: "FINALIZADO" })
                        }
                      >
                        {modoPedido !== "ABERTO" ? (
                          <b
                            style={{
                              color: modoVk === "VK" ? "#ff0000" : cor3,
                            }}
                          >
                            Finalizado
                          </b>
                        ) : (
                          <>Finalizado</>
                        )}
                      </button>
                    </div>
                  </div>
                  <div
                    className="row"
                    style={{
                      padding: "0px 15px",
                      overflow: "auto",
                      minHeight: "80vh",
                      maxHeight: "80vh",
                    }}
                  >
                    {pedidos
                      .filter((pedido) => this.verificaStatus(pedido))
                      .map((pedido) => (
                        <div
                          className="panel panel-default clickable"
                          key={pedido.id_pedido}
                          onClick={() => {
                            this.verificaPedido(pedido);
                          }}
                          style={{
                            marginBottom: "4px",
                            cursor: "pointer",
                          }}
                        >
                          <div className="panel-body">
                            <div className="row">
                              <div className="col-xs-4">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  fill="Red"
                                  className="bi bi-file-text"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z" />
                                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" />
                                </svg>
                                {` Nº${pedido.id_pedido}`}
                              </div>
                              <div className="col-xs-8">
                                <b>{pedido.nome_fantasia}</b>
                              </div>
                              <div className="w-100"></div>
                              <div className="col-sm-12">
                                {`${pedido.entrega_logradouro}, ${pedido.entrega_numero}, ${pedido.entrega_bairro}`}
                              </div>
                              <div
                                className="col-xs-6"
                                style={{ fontWeight: "bold" }}
                              >
                                {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(pedido.vr_pedido)}
                              </div>
                              <div className="col-xs-1"></div>
                              {this.renderSwitch(pedido.status_pedido)}
                              <div className="col-xs-1"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div
            className="col-md-8 col-sm-7 mobile-hide"
            style={{
              border: "1px solid rgb(231, 231, 231)",
              height: "100vh",
            }}
          >
            <div className="row">
              <div className="col-xs-12" style={{ padding: "0px" }}>
                {pedidos.length !== 0 ? (
                  <>
                    <Pedido
                      pedido={pedido}
                      itens={itens}
                      subtotal={subtotal}
                      isModalVisible={isModalVisible}
                    />
                  </>
                ) : (
                  <h3>Nenhum pedido selecionado</h3>
                )}
              </div>
            </div>
          </div>
        </div>
        <ModalPedidos
          className="show-mobile"
          ariaHideApp={false}
          isOpen={isModalPedVisible}
          onRequestClose={() => this.hidePedidoModal()}
          style={{
            content: {
              position: "center",
              border: "none",
              background: "#fff",
              WebkitOverflowScrolling: "touch",
              outline: "none",
              padding: "20px",
              overflow: "hidden",
              maxWidth: "100vw",
              maxHeight: "100vh",
              minHeight: "100vh",
            },
          }}
        >
          <PedidoModal
            hidePedidoModal={() => this.hidePedidoModal()}
            pedido={pedido}
            itens={itens}
            subtotal={subtotal}
          />
        </ModalPedidos>
      </div>
    );
  }
}

export default Pedidos;
