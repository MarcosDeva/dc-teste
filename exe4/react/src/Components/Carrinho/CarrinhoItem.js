import React, { Component } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

import Modal from "react-modal";
import ModalItens from "../Cardapio/ModalItens";
import Imagem from "../../Assets/semImagem.jpg";
class CarrinhoItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    addItem: PropTypes.func,
    remItem: PropTypes.func.isRequired,
    restaurante: PropTypes.object,
    hideModal: PropTypes.func,
    cardapio: PropTypes.array,
    tipoItem: PropTypes.string,
    clicouEdit: PropTypes.func,
    modoVk: PropTypes.string.isRequired,
    cor3: PropTypes.string,
  };

  state = {
    isModalVisible: false,
    itemNovo: {},
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  ocultaModal = () => {
    this.setState({ isModalVisible: false });
  };

  editItem(params) {
    let items = this.props.cardapio;
    let newItemEdit = {};
    let newComplementsEdit = [];
    let restaurante = this.props.restaurante;

    for (const it of items) {
      if (it.id_produto === params.id_produto) {
        newItemEdit = it;
        newItemEdit.id_contador = params.id_contador;
        newItemEdit.qtde = params.quantidade;
        if (it.imagem === undefined || it.imagem === null || it.imagem === "") {
          newItemEdit.imagem = Imagem;
        }
        if (it.complementos === null || it.complementos === undefined) {
          newItemEdit.complementos = [];
        }
        for (let comp of it.complementos) {
          for (const compEdit of params.complementos) {
            if (
              compEdit.id_categoria_complemento ===
              comp.id_categoria_complemento
            ) {
              for (let compItem of comp.itens) {
                if (compItem.id_complemento === compEdit.id_complemento) {
                  compItem.checado = true;
                  compItem.qtde = compEdit.qtde;
                } else {
                  compItem.checado = false;
                  compItem.qtde = 0;
                }
              }
            }
          }

          newComplementsEdit.push(comp);
        }
      }
    }

    newItemEdit.complementos = newComplementsEdit;
    this.setState({ itemNovo: newItemEdit });
    this.showModal();
  }

  render() {
    const {
      item,
      remItem,
      addItem,
      restaurante,
      tipoItem,
      modoVk,
      cor3,
    } = this.props;
    const { isModalVisible, itemNovo } = this.state;

    return (
      <>
        <div
          className="panel panel-default"
          style={{
            borderRadius: "0px",
            borderColor: "#C4C3BE",
            borderStyle: "dashed",
            maxHeight: "100vh",
            borderBottomWidth: "2px",
            borderTopWidth: "0",
            borderRightWidth: "0",
            borderLeftWidth: "0",
          }}
        >
          <div className="panel-body" style={{ padding: "0" }}>
            <div className="row">
              <div
                className="col-xs-12"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div className="col-xs-1">
                  <button
                    className="btn-xs"
                    type="button"
                    style={{
                      border: "none",
                      background: "none",
                    }}
                    onClick={() => {
                      this.props.clicouEdit();
                      this.editItem(item);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="black"
                      className="bi bi-trash-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                    </svg>
                  </button>
                </div>
                <div className="col-xs-8">
                  <div
                    className="col-xs-1"
                    style={{ fontWeight: "bold", fontSize: "15px" }}
                  >
                    {`${item.quantidade}x`}
                  </div>
                  <div className="col-xs-8" style={{ textAlign: "left" }}>
                    {item.nome}
                  </div>
                  <div className="col-xs-2">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.vr_unitario)}
                  </div>
                  <div className="col-xs-11 text-muted">
                    {/* Aqui vai a observação do item */}
                  </div>
                  <div className="col-xs-12" style={{ marginBottom: "15px" }}>
                    {item.complementos.map((complemento) =>
                      complemento === null ? null : (
                        <div key={complemento.id_complemento}>
                          <div
                            className="col-xs-10 text-muted"
                            style={{ fontSize: "12px" }}
                          >
                            {` ${complemento.qtde}x ${complemento.nome_complemento}`}
                          </div>
                          <div
                            className="col-xs-2 text-muted"
                            style={{ fontSize: "12px", textAlign: "end" }}
                          >
                            {complemento.vr_adicional === 0
                              ? null
                              : new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(complemento.vr_adicional)}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div
                  className="col-xs-3"
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    textAlign: "center",
                  }}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(item.vr_total)}
                </div>
                <div className="col-xs-1">
                  <button
                    className="btn-xs"
                    type="button"
                    style={{
                      border: "none",
                      background: "none",
                    }}
                    onClick={() => {
                      remItem(item);
                      toast.success("Item removido do carrinho!", {
                        duration: 1500,
                      });
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="black"
                      className="bi bi-trash-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-xs-2"></div>
            <div className="col-xs-8"></div>

            <div className="col-xs-2"></div>
          </div>
        </div>
        <Modal
          className="modal-dialog modal-dialog-centered"
          ariaHideApp={false}
          isOpen={isModalVisible}
          onRequestClose={
            tipoItem === "NOVO"
              ? this.ocultaModal
              : () => toast.error("Salve as alterações antes de sair..")
          }
          style={{
            content: {
              position: "center",
              border: "1px solid #ccc",
              background: "#fff",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "10px",
              outline: "none",
              padding: "20px",
              maxWidth: "95vw",
              maxHeight: "93vh",
            },
            overlay: {
              position: "fixed",
              backgroundColor: "rgba(0.30, 0.20, 0, 0.40)",
            },
          }}
        >
          <ModalItens
            item={itemNovo}
            preco={item.vr_total}
            addItem={addItem}
            hideModal={this.ocultaModal}
            restaurante={restaurante}
            tipoItem={tipoItem}
            remItem={(item) => {
              this.props.remItem(item);
            }}
            modoVk={modoVk}
            cor3={cor3}
          />
        </Modal>
      </>
    );
  }
}

export default CarrinhoItem;
