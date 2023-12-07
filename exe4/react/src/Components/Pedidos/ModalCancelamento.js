import React from "react";
import PropTypes from "prop-types";
import { Component } from "react";
import * as API from "../../API";
import toast from "react-hot-toast";

class ModalCancelamento extends Component {
  static propTypes = {
    hideModal: PropTypes.func.isRequired,
    pedido: PropTypes.object.isRequired,
  };

  state = {
    motivo: "",
    motivos: [],
  };

  componentDidMount = () => {
    API.get("MotivoCancelamento", "", "")
      .then((result) => {
        let motivos = result;

        this.setState({ motivos, motivo: motivos[0].motivo_cancelamento });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  verificaMotivo = () => {
    let motivos = this.state.motivos;
    let motivo = this.state.motivo;
    let pedido = this.props.pedido;

    for (let [_, mot] of motivos.entries()) {
      if (mot.motivo_cancelamento === motivo) {
        let cancelamento = {
          id_pedido_cancelamento: mot.id_pedido_cancelamento,
          codigo_cancelamento: mot.codigo_cancelamento,
          motivo_cancelamento: mot.motivo_cancelamento,
        };

        API.cancelaPedido(
          `PedidoCancela?id_pedido=${pedido.id_pedido}`,
          cancelamento
        ).then((result) => {
          if (result.status === 200) {
            toast.error(
              "Estamos verificando o pedido de cancelamento, aguarde..",
              {
                position: "top-center",
                duration: 6000,
              }
            );
            this.props.hideModal();
          } else {
            toast.error("Erro no cancelamento do pedido");
          }
        });
      }
    }
  };

  render() {
    const { hideModal } = this.props;
    const { motivos } = this.state;

    return (
      <>
        <div className="modal-header">
          <button type="button" className="close" onClick={hideModal}>
            <span aria-hidden="true">&times;</span>
          </button>
          <h3>
            <b>Cancelar pedido</b>
          </h3>
        </div>
        <div className="modal-body">
          <div className="form-group">
            {/* GET nos motivos e listar */}
            <label htmlFor="motivo">Motivo do cancelamento:</label>
            <select
              className="form-control"
              id="motivo"
              onChange={(e) => this.setState({ motivo: e.target.value })}
            >
              {motivos.map((motivo) => (
                <option key={motivo.id_pedido_cancelamento}>
                  {motivo.motivo_cancelamento}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-lg btn-block"
            style={{
              borderRadius: "25px",
              color: "white",
              border: "none",
              backgroundColor: "#FF2B0D",
            }}
            onClick={() => this.verificaMotivo()}
          >
            Cancelar pedido
          </button>
        </div>
      </>
    );
  }
}

export default ModalCancelamento;
