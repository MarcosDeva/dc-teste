import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../Assets/App.css";
import semImagem from "../../Assets/semImagem.jpg";

import Modal from "react-modal";
import ModalItens from "./ModalItens";

class CardapioItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    restaurante: PropTypes.object,
    addItem: PropTypes.func.isRequired,
    clicouCard: PropTypes.func,
    tipoItem: PropTypes.string,
    modoVk: PropTypes.string.isRequired,
    cor3: PropTypes.string,
  };

  state = {
    isModalVisible: false,
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  ocultaModal = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { item, addItem, restaurante, tipoItem, modoVk, cor3 } = this.props;
    const { isModalVisible } = this.state;

    return (
      <>
        <div
          key={item.id_produto}
          className="card"
          id="card"
          style={{ width: "345px", cursor: "pointer", borderRadius: "3px" }}
          onClick={() => {
            this.showModal();
            this.props.clicouCard();
          }}
        >
          <div className="row" style={{ paddingRight: "20px" }}>
            <div className="col-sm-7 col-xs-7">
              <div className="card-body">
                <h5 className="card-title" style={{ fontWeight: "800" }}>
                  {item.nome}
                </h5>
                <div
                  className="card-text text-muted"
                  style={{ height: "20px" }}
                >
                  {item.descricao.length > 30 ? (
                    <div>{`${item.descricao.substring(0, 30)}...`}</div>
                  ) : (
                    item.descricao
                  )}
                </div>
              </div>
            </div>
            <div className="col-sm-5 col-xs-5">
              <img
                alt=" "
                className="card-img-right"
                src={item.imagem == "" ? semImagem : item.imagem}
                style={{
                  borderRadius: "10px",
                  height: "100px",
                  width: "130px",
                  objectFit: "contain",
                  backgroundColor: "#fff",
                }}
              />
            </div>
            <div
              className="card-text"
              style={{
                color: `${modoVk === "VK" ? "##ff5722" : cor3}`,
                fontWeight: "bold",
                marginBottom: "5px",
                textAlign: "left",
                marginLeft: "5%",
              }}
            >
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(item.vr_unitario)}
            </div>
          </div>
        </div>
        <Modal
          className="modal-dialog modal-dialog-centered modal-lg"
          ariaHideApp={false}
          isOpen={isModalVisible}
          onRequestClose={this.ocultaModal}
          style={{
            content: {
              position: "center",
              border: "1px solid #ccc",
              background: "#fff",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: window.innerWidth <= 450 ? "0px" : "10px",
              margin: window.innerWidth <= 450 ? "0px" : "",
              width: window.innerWidth <= 450 ? "100vw" : "",
              height: window.innerWidth <= 450 ? "100vh" : "",
              maxWidth: window.innerWidth <= 450 ? "100vw" : "95vw",
              maxHeight: window.innerWidth <= 450 ? "100vh" : "93vh",
              outline: "none",
              padding: "20px",
            },
            overlay: {
              position: "fixed",
              backgroundColor: "rgba(0.30, 0.20, 0, 0.40)",
            },
          }}
        >
          <ModalItens
            item={item}
            addItem={addItem}
            hideModal={this.ocultaModal}
            restaurante={restaurante}
            tipoItem={tipoItem}
            modoVk={modoVk}
            cor3={cor3}
          />
        </Modal>
      </>
    );
  }
}

export default CardapioItem;
