import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../Assets/App.css";
import { toast } from "react-hot-toast";
import validator from "cpf-cnpj-validator";

const Joi = require("@hapi/joi").extend(validator);

const cnpjSchema = Joi.document().cnpj();
const cpfSchema = Joi.document().cpf();

class DocumentoModal extends Component {
  static propTypes = {
    hideDocumentModal: PropTypes.func.isRequired,
    setDocumento: PropTypes.func,
    documento: PropTypes.string,
  };

  state = {
    cpf: true,
  };

  formatCpf(cpf) {
    let cpfForm = document.getElementById("cpf");
    if (cpf) {
      if (cpfForm.value.length === 3 || cpfForm.value.length === 7) {
        cpfForm.value += ".";
      } else if (cpfForm.value.length === 11) {
        cpfForm.value += "-";
      }
    } else {
      if (cpfForm.value.length === 2 || cpfForm.value.length === 6) {
        cpfForm.value += ".";
      } else if (cpfForm.value.length === 10) {
        cpfForm.value += "/";
      } else if (cpfForm.value.length === 15) {
        cpfForm.value += "-";
      }
    }
  }

  verifyButton() {
    let button = document.getElementById("cnpj");
    let form = document.getElementById("cpf");
    if (button.checked) {
      this.setState({ cpf: false });
      form.value = "";
    } else {
      this.setState({ cpf: true });
      form.value = "";
    }
  }

  verifyDocumento() {
    let documento = document.getElementById("cpf").value;
    documento = documento.replace(/\.|-/g, "").replace("/", "");

    if (this.state.cpf) {
      if (
        cpfSchema.validate(documento).error !== null &&
        cpfSchema.validate(documento).error !== undefined
      ) {
        toast.error("CPF inválido!", { id: "alerta-documento" });
      } else {
        this.props.setDocumento("");
        this.props.setDocumento(document.getElementById("cpf").value);
        this.props.hideDocumentModal();
      }
    } else if (!this.state.cpf) {
      if (
        cnpjSchema.validate(documento).error !== null &&
        cnpjSchema.validate(documento).error !== undefined
      ) {
        toast.error("CNPJ inválido!", { id: "alerta-documento" });
      } else {
        this.props.setDocumento("");
        this.props.setDocumento(document.getElementById("cpf").value);
        this.props.hideDocumentModal();
      }
    }
  }

  removeDocmento = () => {
    this.props.setDocumento("");
    this.props.hideDocumentModal();
    toast.success("CPF/CNPJ removido", { id: "alerta-documento" });
  };

  componentDidMount() {
    this.verifyButton();
  }

  render() {
    const { cpf } = this.state;
    const { documento } = this.props;

    return (
      <div>
        <div className="modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => this.props.hideDocumentModal()}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h3>CPF/CNPJ</h3>
        </div>
        <div className="modal-body">
          <div className="col-sm-12">
            <span style={{ display: "inline-flex", gap: "5px" }}>
              <label htmlFor="cnpj">CNPJ:</label>
              <input
                type="checkbox"
                name="cnpj"
                id="cnpj"
                style={{ width: "20px", height: "20px", margin: "0px" }}
                defaultChecked={() => {
                  if (!cpf) {
                    return true;
                  } else {
                    return false;
                  }
                }}
                onClick={() => this.verifyButton()}
              />
            </span>
          </div>
          <div className="col-sm-12">
            <div className="form-group">
              <input
                className="form-control"
                id="cpf"
                maxLength={cpf ? "14" : "18"}
                onKeyUp={() => this.formatCpf(cpf)}
                style={{
                  boxShadow: "none",
                  outline: "none",
                  border: "solid 1px #e1e1e1",
                  marginBottom: "32px",
                  default:
                    documento !== null &&
                    documento !== undefined &&
                    documento !== ""
                      ? documento
                      : "",
                }}
              ></input>
              {documento !== null &&
              documento !== undefined &&
              documento !== "" ? (
                <button
                  type="submit"
                  className="btn btn-block"
                  onClick={() => {
                    this.removeDocmento();
                  }}
                >
                  Remover
                </button>
              ) : null}
              <button
                type="submit"
                className="btn btn-block"
                onClick={() => this.verifyDocumento()}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DocumentoModal;
