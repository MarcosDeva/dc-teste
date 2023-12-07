import React, { Component } from "react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import serializeForm from "form-serialize";
import * as API from "../../API";

class BuscaCepModal extends Component {
  static propTypes = {
    encontraCep: PropTypes.bool,
    getEndereco: PropTypes.func,
    setEndereco: PropTypes.func,
    hideModal: PropTypes.func,
    showModal: PropTypes.func,
    endereco: PropTypes.object,
    setCep: PropTypes.func,
    cepBusca: PropTypes.string,
    setRestaurantes: PropTypes.func,
    trocaBusca: PropTypes.func,
    limpaBusca: PropTypes.func,
  };

  verificaCEP = (cep) => {
    API.getEndereco(cep)
      .then((data) => {
        if (data.erro === true) {
          toast.error("CEP não encontrado!");
          return;
        }

        this.props.setCep(cep);
        this.props.trocaBusca();
        this.props.hideModal();

        API.getEstabelecimentosCEP(cep).then((res) => {
          if (res.status === "SUCESSO") {
            let restaurantes = res.estabelecimentos;

            this.props.setRestaurantes(restaurantes);
          }
        });
      })
      .catch((err) => {
        toast.error("Erro na busca do cep!", err);
      });
  };

  enderSubmit = (e) => {
    e.preventDefault();
    const values = serializeForm(e.target, { hash: true });
    const valor = values.cep.replace("-", "");
    if (valor.length !== 8) {
      toast.error("Verifique se o CEP foi digitado da maneira correta.");
      return;
    } else {
      this.verificaCEP(valor);
      this.props.hideModal();
    }
  };

  formataCep = () => {
    var elemento = document.getElementById("valor");
    var valor = elemento.value;

    valor = valor + "";
    valor = parseInt(valor.replace(/[\D]+/g, ""));
    valor = valor + "";

    if (valor.length === 8 || valor.length === 9) {
      valor = valor.replace(/([0-9]{5})?([0-9]{3})/g, "$1-$2");
    }

    elemento.value = valor;
    if (valor === "NaN") {
      elemento.value = "";
    }
  };

  render() {
    const { cepBusca, buscando } = this.props;
    return (
      <>
        <div className="modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              this.props.hideModal();
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="current"
              className="bi bi-geo-alt-fill"
              viewBox="0 0 16 16"
              style={{
                marginRight: "10px",
              }}
            >
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
            </svg>
            Filtrar por localidade
          </h3>
        </div>
        <div
          className="modal-body"
          style={{ minHeight: "300px", maxHeight: "300px", overflow: "auto" }}
        >
          <div className="row">
            <form onSubmit={this.enderSubmit}>
              <div className="col-md-3"></div>
              <div className="form-group col-md-6">
                <div className="row">
                  <div className="col-md-12">
                    <label>CEP:</label>
                    <input
                      type="text"
                      name="cep"
                      className="form-control input-md"
                      defaultValue={cepBusca.replace(
                        /([0-9]{5})?([0-9]{3})/g,
                        "$1-$2"
                      )}
                      maxLength={9}
                      placeholder="000000-000"
                      required
                      style={{ marginBottom: "2%" }}
                      id="valor"
                      onKeyUp={() => this.formataCep()}
                    />
                  </div>
                  <div className="col-md-12">
                    <button
                      className="btn btn-md btn-block"
                      type="submit"
                      style={{
                        background: "red",
                        color: "white",
                        borderRadius: "50px",
                        marginBottom: "25px",
                      }}
                    >
                      Buscar
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-3"></div>
            </form>
          </div>
        </div>
        <div className="modal-footer"></div>
      </>
    );
  }
}

export default BuscaCepModal;
