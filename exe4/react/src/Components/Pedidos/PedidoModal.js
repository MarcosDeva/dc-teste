import React from "react";
import PropTypes from "prop-types";
import { Component } from "react";
import "./Pedidos.css";
import ModalCancela from "react-modal";
import ModalCancelamento from "./ModalCancelamento";
class PedidoModal extends Component {
  static propTypes = {
    hidePedidoModal: PropTypes.func.isRequired,
    pedido: PropTypes.object.isRequired,
    itens: PropTypes.array.isRequired,
    subtotal: PropTypes.number.isRequired,
  };

  state = {
    cancelamento: false,
    loading: false,
  };

  renderSwitch(statusPedido) {
    switch (statusPedido) {
      case "CONFIRMADO":
        return (
          <div
            style={{
              border: "1px solid DeepSkyBlue",
              borderRadius: "5px",
              textAlign: "center",
              margin: "20px, 0px, 10px",
            }}
          >
            Confirmado
          </div>
        );
      case "ENVIADO":
        return (
          <div
            style={{
              border: "1px solid gray",
              borderRadius: "5px",
              textAlign: "center",
              margin: "20px, 0px, 10px",
            }}
          >
            Enviado
          </div>
        );
      case "ENTREGUE":
        return (
          <div
            style={{
              border: "1px solid green",
              borderRadius: "5px",
              textAlign: "center",
              margin: "20px, 0px, 10px",
            }}
          >
            Entregue
          </div>
        );
      case "CANCELADO":
        return (
          <div
            style={{
              border: "1px solid red",
              borderRadius: "5px",
              textAlign: "center",
              margin: "20px, 0px, 10px",
            }}
          >
            Cancelado
          </div>
        );
      default:
        return (
          <div
            style={{
              border: "1px solid orange",
              borderRadius: "5px",
              textAlign: "center",
              margin: "20px, 0px, 10px",
            }}
          >
            Pendente
          </div>
        );
    }
  }

  showModal = () => {
    this.setState({ cancelamento: true });
  };

  hideModal = () => {
    this.setState({ cancelamento: false });
  };

  render() {
    const { cancelamento, loading } = this.state;
    const { pedido, itens, subtotal } = this.props;

    return (
      <>
        <div className="modal-body">
          <div className="col-xs-12" style={{ marginBottom: "10px" }}>
            <button
              type="button"
              className="close"
              onClick={() => this.props.hidePedidoModal()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div
            className="panel panel-default col-xs-12"
            style={{
              maxHeight: "100vh",
              padding: "0px",
              border: "none",
              boxShadow: "none",
            }}
          >
            <div className="row">
              <div className="col-xs-3" style={{ padding: "0px" }}>
                {this.renderSwitch(pedido.status_pedido)}
              </div>
              <div
                className="col-xs-6"
                style={{ textAlign: "center", padding: "0px" }}
              >
                <h4>
                  <b>{pedido.nome_fantasia}</b>
                </h4>
                {pedido.tipo_pedido === "RETIRADA" ? (
                  <h5 style={{ color: "red" }}>Pedido para retirada</h5>
                ) : null}
              </div>
              <div className="col-xs-3" style={{ padding: "0px" }}>
                <h5>
                  {new Date(pedido.data_hora).toLocaleString("pt-BR", {
                    timeZone: "GMT",
                  })}
                </h5>
              </div>
            </div>
            {pedido.id_pedido === null ||
            pedido.id_pedido === undefined ? null : (
              <div className="row">
                <div className="w-100"></div>
                <div className="col-xs-12" style={{ textAlign: "left" }}>
                  <h5 style={{ marginTop: "10px", marginBottom: "0px" }}>
                    <b>Endereço:</b>
                  </h5>
                </div>
                <div className="col-xs-12" style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "16px" }}>
                    {`${pedido.entrega_logradouro}, ${pedido.entrega_numero} `}
                  </div>
                  <div style={{ fontSize: "16px" }}>
                    {`${pedido.entrega_bairro} - ${pedido.entrega_municipio}, ${pedido.entrega_uf} `}
                  </div>
                  <div style={{ fontSize: "16px" }}>
                    {pedido.entrega_complemento !== ""
                      ? pedido.entrega_complemento
                      : null}
                  </div>
                </div>
                {pedido.documento !== null &&
                pedido.documento !== undefined &&
                pedido.documento !== "" ? (
                  <>
                    <div className="col-xs-12" style={{ textAlign: "left" }}>
                      <h5 style={{ marginTop: "10px", marginBottom: "0px" }}>
                        <b>Documento:</b>
                      </h5>
                    </div>
                    <div
                      className="col-xs-12"
                      style={{ textAlign: "left", fontSize: "16px" }}
                    >
                      {pedido.documento}
                    </div>
                  </>
                ) : null}
                <div className="col-xs-12">
                  <hr
                    style={{ borderTop: "solid 1.5px", color: "lightgray" }}
                  />
                </div>
                <div className="container-fluid col-xs-12">
                  {itens.map((item) => (
                    <div
                      className="panel panel-default"
                      style={{
                        border: "none",
                        boxShadow: "none",
                        width: "100%",
                      }}
                      key={item.num_item}
                    >
                      <div className="panel-body" style={{ padding: "0" }}>
                        <div className="row">
                          <div
                            className="col-xs-9"
                            style={{ fontSize: "15px" }}
                          >{`${item.quantidade}x ${item.nome_produto}`}</div>
                          <div
                            className="col-xs-3"
                            style={{ textAlign: "end" }}
                          >
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.vr_unitario)}
                          </div>
                          {item.subItens === null ||
                          item.subItens === undefined ||
                          item.subItens === ""
                            ? null
                            : item.subItens.map((complemento) =>
                                complemento === null ? null : (
                                  <div
                                    key={complemento.id_complemento}
                                    className="col-xs-12"
                                    style={{ paddingRight: "0" }}
                                  >
                                    <div
                                      className="col-xs-9 text-muted"
                                      style={{ fontSize: "12px" }}
                                    >
                                      {` ${complemento.quantidade}x ${complemento.complemento}`}
                                    </div>
                                    <div
                                      className="col-xs-3 text-muted"
                                      style={{
                                        fontSize: "12px",
                                        textAlign: "end",
                                      }}
                                    >
                                      {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      }).format(complemento.vr_adicional)}
                                    </div>
                                  </div>
                                )
                              )}
                          <div className="col-xs-9"></div>
                          <div
                            className="col-xs-3"
                            style={{
                              fontWeight: "bold",
                              fontSize: "16px",
                              textAlign: "end",
                            }}
                          >
                            {item.vr_total_sub_itens !== null &&
                            item.vr_total_sub_itens !== undefined
                              ? new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(
                                  item.vr_unitario + item.vr_total_sub_itens
                                )
                              : new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(item.vr_total)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    className="panel panel-default"
                    style={{
                      border: "none",
                      width: "100%",
                      boxShadow: "none",
                    }}
                  >
                    <div className="row">
                      <div className="col-xs-5"></div>
                      <div className="col-xs-2" style={{ fontSize: "16px" }}>
                        <b>Subtotal:</b>
                      </div>
                      <div
                        className="col-xs-5"
                        style={{ fontSize: "16px", textAlign: "end" }}
                      >
                        <b>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(subtotal)}
                        </b>
                      </div>
                      <div className="col-xs-5"></div>
                      <div className="col-xs-2" style={{ fontSize: "16px" }}>
                        <b>Taxa:</b>
                      </div>
                      <div
                        className="col-xs-5"
                        style={{ fontSize: "16px", textAlign: "end" }}
                      >
                        <b>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(pedido.entrega_taxa)}
                        </b>
                      </div>
                      <div className="col-xs-5"></div>
                      <div className="col-xs-2" style={{ fontSize: "16px" }}>
                        <b>Total:</b>
                      </div>
                      <div
                        className="col-xs-5"
                        style={{ fontSize: "16px", textAlign: "end" }}
                      >
                        <b>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(pedido.vr_pedido)}
                        </b>
                      </div>
                      {pedido.vr_troco !== 0 ? (
                        <>
                          <div className="col-xs-2"></div>
                          <div
                            className="col-xs-5"
                            style={{
                              fontSize: "16px",
                              paddingRight: "0px",
                              textAlign: "end",
                            }}
                          >
                            <b>Troco para:</b>
                          </div>
                          <div
                            className="col-xs-5"
                            style={{ fontSize: "16px", textAlign: "end" }}
                          >
                            <b>
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(pedido.vr_troco)}
                            </b>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className="panel panel-default"
                    style={{
                      border: "none",
                      width: "100%",
                      boxShadow: "none",
                    }}
                  >
                    <div className="col-xs-12">
                      <b>Forma de Pagamento:</b>
                    </div>
                    <div className="col-xs-12" style={{ marginBottom: "36px" }}>
                      {pedido.forma_pagamento}
                    </div>
                    {pedido.entrega_observacao !== "" ? (
                      <>
                        <div
                          className="col-sm-12"
                          style={{ textAlign: "left" }}
                        >
                          <div
                            style={{ marginTop: "10px", marginBottom: "0px" }}
                          >
                            <b>Observações:</b>
                          </div>
                        </div>
                        <div
                          className="col-sm-12"
                          style={{ textAlign: "left" }}
                        >
                          {pedido.entrega_observacao}
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="col-xs-12">
                  <hr
                    style={{ borderTop: "solid 1.5px", color: "lightgray" }}
                  />
                </div>
                <div
                  className="panel panel-default"
                  style={{
                    border: "none",
                    width: "100%",
                    boxShadow: "none",
                  }}
                >
                  <div className="col-xs-6"></div>
                  <div className="col-xs-6">
                    {pedido.status_pedido !== "PENDENTE" &&
                    pedido.status_pedido !== "CONFIRMADO" ? null : (
                      <div style={{ textAlign: "right" }}>
                        <button
                          className="btn-primary btn-md"
                          style={{
                            borderRadius: "10px",
                            color: "white",
                            border: "none",
                            backgroundColor: "#FF2B0D",
                            padding: "10px",
                          }}
                          onClick={() => this.setState({ cancelamento: true })}
                        >
                          <b>Cancelar pedido</b>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <ModalCancela
              className="modal-dialog modal-dialog-centered"
              ariaHideApp={false}
              isOpen={cancelamento}
              onRequestClose={this.hideModal}
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
              <ModalCancelamento hideModal={this.hideModal} pedido={pedido} />
            </ModalCancela>
          </div>
        </div>
      </>
    );
  }
}

export default PedidoModal;
