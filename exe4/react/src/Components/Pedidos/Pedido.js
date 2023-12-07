import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalCancela from "react-modal";
import ModalCancelamento from "./ModalCancelamento";
class Pedido extends Component {
  static propTypes = {
    pedido: PropTypes.object.isRequired,
    itens: PropTypes.array.isRequired,
    subtotal: PropTypes.number.isRequired,
  };

  state = {
    isModalVisible: false,
  };

  renderSwitch(statusPedido) {
    switch (statusPedido) {
      case "CONFIRMADO":
        return (
          <h4
            style={{
              border: "1px solid DeepSkyBlue",
              borderRadius: "5px",
              textAlign: "center",
              margin: "20px, 0px, 10px",
            }}
          >
            Confirmado
          </h4>
        );
      case "ENVIADO":
        return (
          <h4
            style={{
              border: "1px solid gray",
              borderRadius: "5px",
              textAlign: "center",
              margin: "20px, 0px, 10px",
            }}
          >
            Enviado
          </h4>
        );
      case "ENTREGUE":
        return (
          <h4
            style={{
              border: "1px solid green",
              borderRadius: "5px",
              textAlign: "center",
              margin: "20px, 0px, 10px",
            }}
          >
            Entregue
          </h4>
        );
      case "CANCELADO":
        return (
          <h4
            style={{
              border: "1px solid red",
              borderRadius: "5px",
              textAlign: "center",
              margin: "20px, 0px, 10px",
            }}
          >
            Cancelado
          </h4>
        );
      default:
        return (
          <h4
            style={{
              border: "1px solid orange",
              borderRadius: "5px",
              textAlign: "center",
              margin: "20px, 0px, 10px",
            }}
          >
            Pendente
          </h4>
        );
    }
  }

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { isModalVisible } = this.state;
    const { pedido, itens, subtotal } = this.props;
    return (
      <div
        className="panel panel-default col-xs-12"
        style={{
          maxHeight: "90vh",
          minHeight: "90vh",
          overflow: "auto",
          padding: "30px 80px 30px 80px",
          border: "none",
          boxShadow: "none",
        }}
      >
        <div className="row">
          <div className="col-sm-3">
            {this.renderSwitch(pedido.status_pedido)}
          </div>
          <div className="col-xs-6" style={{ textAlign: "center" }}>
            <h3>
              <b>{pedido.nome_fantasia}</b>
            </h3>
            {pedido.tipo_pedido === "RETIRADA" ? (
              <h4 style={{ color: "red" }}>Pedido para retirada</h4>
            ) : null}
          </div>
          <div className="col-xs-3">
            <h3 style={{ fontSize: "15px" }}>
              {new Date(pedido.data_hora).toLocaleString("pt-BR", {
                timeZone: "GMT",
              })}
            </h3>
          </div>
        </div>
        {pedido.id_pedido === null || pedido.id_pedido === undefined ? null : (
          <div className="row">
            <div className="w-100"></div>
            <div
              className={
                pedido.documento !== "" &&
                pedido.documento !== null &&
                pedido.documento !== undefined
                  ? "col-sm-6"
                  : "col-sm-12"
              }
              style={{ textAlign: "left" }}
            >
              <h5 style={{ marginTop: "10px", marginBottom: "0px" }}>
                <b>Endereço:</b>
              </h5>
            </div>
            {pedido.documento !== "" &&
            pedido.documento !== null &&
            pedido.documento !== undefined ? (
              <div className="col-sm-6" style={{ textAlign: "right" }}>
                <h5 style={{ marginTop: "10px", marginBottom: "0px" }}>
                  <b>Documento:</b>
                </h5>
              </div>
            ) : null}
            <div
              className={
                pedido.documento !== "" &&
                pedido.documento !== null &&
                pedido.documento !== undefined
                  ? "col-sm-6"
                  : "col-sm-12"
              }
              style={{ textAlign: "left" }}
            >
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
            {pedido.documento !== "" &&
            pedido.documento !== null &&
            pedido.documento !== undefined ? (
              <div
                className="col-sm-6"
                style={{ textAlign: "right", fontSize: "16px" }}
              >
                {pedido.documento}
              </div>
            ) : null}
            <div className="col-sm-12">
              <hr style={{ borderTop: "solid 1.5px", color: "lightgray" }} />
            </div>
            <div className="container-fluid col-sm-12">
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
                        className="col-xs-10"
                        style={{ fontSize: "15px" }}
                      >{`${item.quantidade}x ${item.nome_produto}`}</div>
                      <div className="col-xs-2" style={{ textAlign: "end" }}>
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
                      <div className="col-xs-10"></div>
                      <div
                        className="col-xs-2"
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
                  <div className="col-xs-8"></div>
                  <div className="col-xs-2" style={{ fontSize: "16px" }}>
                    <b>Subtotal:</b>
                  </div>
                  <div
                    className="col-xs-2"
                    style={{ fontSize: "16px", textAlign: "end" }}
                  >
                    <b>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(subtotal)}
                    </b>
                  </div>
                  <div className="col-xs-8"></div>
                  <div className="col-xs-2" style={{ fontSize: "16px" }}>
                    <b>Taxa:</b>
                  </div>
                  <div
                    className="col-xs-2"
                    style={{ fontSize: "16px", textAlign: "end" }}
                  >
                    <b>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(pedido.entrega_taxa)}
                    </b>
                  </div>
                  <div className="col-xs-8"></div>
                  <div className="col-xs-2" style={{ fontSize: "16px" }}>
                    <b>Total:</b>
                  </div>
                  <div
                    className="col-xs-2"
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
                      <div className="col-xs-8"></div>
                      <div className="col-xs-2" style={{ fontSize: "16px" }}>
                        <b>Troco para:</b>
                      </div>
                      <div
                        className="col-xs-2"
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
                <div className="col-xs-12">{pedido.forma_pagamento}</div>
                {pedido.entrega_observacao !== "" ? (
                  <>
                    <div
                      className="col-sm-12"
                      style={{ textAlign: "left", marginTop: "36px" }}
                    >
                      <h5 style={{ marginTop: "10px", marginBottom: "0px" }}>
                        <b>Observações:</b>
                      </h5>
                    </div>
                    <div className="col-sm-12" style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "16px" }}>
                        {pedido.entrega_observacao}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <div className="col-sm-12">
              <hr style={{ borderTop: "solid 1.5px", color: "lightgray" }} />
            </div>
            <div
              className="panel panel-default"
              style={{
                border: "none",
                width: "100%",
                boxShadow: "none",
              }}
            >
              <div className="col-xs-8"></div>
              <div className="col-xs-4">
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
                      onClick={() => this.setState({ isModalVisible: true })}
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
          isOpen={isModalVisible}
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
    );
  }
}

export default Pedido;
