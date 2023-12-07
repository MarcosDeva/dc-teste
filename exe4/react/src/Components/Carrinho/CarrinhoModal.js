import React, { Component } from "react";
import PropTypes from "prop-types";
import serializeForm from "form-serialize";
import { postEndereco, deleteEndereco } from "../../API";
import toast from "react-hot-toast";

import * as API from "../../API";

import "../../Assets/App.css";

class Erro {
  constructor(descricao, funcao, response_erro) {
    this.descricao = descricao;
    this.funcao = funcao;
    this.response_erro = response_erro;
  }
}

Erro.prototype.toString = function erroToString() {
  return `${this.descricao}
   função: ${this.funcao}
   response_erro: ${this.response_erro}`;
};

class CarrinhoModal extends Component {
  static propTypes = {
    setEndereco: PropTypes.func.isRequired,
    hideCarModal: PropTypes.func,
    cliente: PropTypes.object,
    endereco: PropTypes.object,
    getEndereco: PropTypes.func,
    getEnderecos: PropTypes.func,
    encontraCep: PropTypes.bool,
    hideEndereco: PropTypes.func,
    showEndereco: PropTypes.func,
    modoVk: PropTypes.string.isRequired,
    cor3: PropTypes.string,
  };

  state = {
    conteudo: true,
    telaCadastro: false,
  };

  cepSubmit = (e) => {
    e.preventDefault();
    const values = serializeForm(e.target, { hash: true });
    const valor = values.cep.replace("-", "");
    if (valor.length !== 8) {
      toast.error("Verifique se o CEP foi digitado da maneira correta.");
      this.props.hideEndereco();
      return;
    }
    if (this.props.getEndereco) {
      this.props.getEndereco(valor);
    }
  };

  enderSubmit = (e) => {
    e.preventDefault();
    let endereco = serializeForm(e.target, { hash: true });
    endereco.padrao = 0;
    endereco.id_cliente = this.props.cliente.id_cliente;
    postEndereco(endereco)
      .then((res) => res.json())
      .then((data) => {
        if (data.error === null || data.error === undefined) {
          toast.success("Endereço adicionado com sucesso!");
          this.props.hideCarModal();
          this.props.hideEndereco();
          this.props.getEnderecos(this.props.cliente);
          this.setState({ endereco });
        } else {
          toast.error("Erro ao adicionar endereço, tente novamente..");
          let erro = new Erro(
            "Erro ao adicionar endereço",
            "enderSubmit()",
            JSON.stringify(data)
          );

          throw erro.toString();
        }
      });
  };

  enderDelete = (endereco) => {
    deleteEndereco(
      endereco.id_cliente,
      endereco.cep,
      endereco.numero,
      endereco.municipio
    ).then((result) => {
      if (result.status === 200) {
        toast.success("Endereço removido com sucesso!");
        this.props.getEnderecos(this.props.cliente);
      } else {
        toast.error("Erro ao deletar endereço, tente novamente..");
      }
    });
  };

  setEnderecoPadrao = (idCliente, num, log, endereco) => {
    API.update(
      "ClienteEndereco",
      `?idCliente=${idCliente}&numero=${num}&logradouro=${log}`
    ).then((res) => {
      if (res === "SUCESSO") {
        toast.success("Novo endereço padrão definido");
        this.props.getEnderecos(this.props.cliente);
        this.props.setEndereco(endereco);
      } else {
        toast.error("Erro ao substituir endereço padrão, tente novamente..");
      }
    });
  };

  hideConteudo = () => {
    this.setState({ conteudo: false });
    this.props.hideEndereco();
  };

  showConteudo = () => {
    this.setState({ conteudo: true });
  };

  formataCep = () => {
    var elemento = document.getElementById("cep");
    var valor = elemento.value;

    valor = valor + "";
    valor = parseInt(valor.replace(/[\D]+/g, ""));
    valor = valor + "";

    if (valor.length === 8) {
      valor = valor.replace(/([0-9]{5})?([0-9]{3})/g, "$1-$2");
    }

    elemento.value = valor;
    if (valor === "NaN") elemento.value = "";
  };

  render() {
    const {
      cliente,
      setEndereco,
      hideCarModal,
      encontraCep,
      enderecoBusca,
    } = this.props;
    const { conteudo } = this.state;

    const { modoVk, cor3 } = this.props;

    return (
      <>
        <div className="modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={hideCarModal}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-house-fill"
              viewBox="0 0 16 16"
              style={{ marginRight: "10px" }}
            >
              <path
                fillRule="evenodd"
                d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
              />
              <path
                fillRule="evenodd"
                d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
              />
            </svg>
            {conteudo ? <>Endereços</> : <>Cadastrar novo endereço</>}
          </h3>
        </div>
        <div
          className="modal-body"
          style={{ minHeight: "300px", maxHeight: "300px", overflow: "auto" }}
        >
          {conteudo ? (
            cliente.enderecos === null ||
            cliente.enderecos === undefined ||
            cliente.enderecos.lenght === 0 ? (
              <h4>Você não tem endereços cadastrados ainda..</h4>
            ) : (
              cliente.enderecos.map((endereco, index) => (
                <div key={index} className="panel panel-default">
                  <div className="panel-body" style={{ padding: "5px" }}>
                    <div className="col-md-9">
                      <button
                        className=" button btn-lg"
                        style={{ background: "none", border: "none" }}
                        onClick={() => {
                          setEndereco(endereco);
                          toast.success("Endereço alterado com sucesso!", {
                            id: "toast-endereco",
                          });
                          hideCarModal();
                        }}
                      >
                        {endereco.complemento === ""
                          ? `${endereco.logradouro}, ${endereco.numero},
                        ${endereco.bairro} - ${endereco.municipio}`
                          : `${endereco.logradouro}, ${endereco.numero}, ${endereco.complemento},
                        ${endereco.bairro} - ${endereco.municipio}`}
                      </button>
                    </div>
                    <div className="col-md-1" style={{ textAlign: "center" }}>
                      <button
                        className=" button btn-sm"
                        style={{
                          background: "none",
                          border: "none",
                          marginTop: "5px",
                        }}
                        disabled={endereco.padrao === 1}
                        onClick={() =>
                          this.setEnderecoPadrao(
                            cliente.id_cliente,
                            endereco.numero,
                            endereco.logradouro,
                            endereco
                          )
                        }
                      >
                        {endereco.padrao === 1 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="#fce12b"
                            className="bi bi-star-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="gray"
                            className="bi bi-star"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {cliente.enderecos.length < 2 ||
                    cliente.enderecos.length === 1 ? null : (
                      <div className="col-md-2" style={{ textAlign: "center" }}>
                        <button
                          onClick={() => this.enderDelete(endereco)}
                          className=" button btn-sm"
                          style={{
                            background: "none",
                            border: "none",
                            marginTop: "5px",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="23"
                            height="23"
                            fill="#fc0404"
                            className="bi bi-trash-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            <>
              <form onSubmit={this.cepSubmit}>
                <div className="row">
                  <div className="col-md-3"></div>
                  <div className="form-group col-md-6">
                    <label>CEP:</label>
                    <input
                      type="text"
                      name="cep"
                      className="form-control input-md"
                      maxLength={9}
                      placeholder="000000-000"
                      required
                      style={{ marginBottom: "2%" }}
                      id="cep"
                      onKeyUp={() => this.formataCep()}
                    />
                    <button
                      className="btn btn-md btn-block"
                      style={{
                        background: modoVk === "ESTAB" ? cor3 : "#ff5722",
                        color: "white",
                        borderRadius: "50px",
                        marginBottom: "25px",
                      }}
                    >
                      Buscar
                    </button>
                  </div>
                  <div className="col-md-3"></div>
                </div>
              </form>
              {encontraCep ? (
                <div className="row">
                  <div className="col-md-3"></div>
                  <div className="col-md-6">
                    <form onSubmit={this.enderSubmit}>
                      <div className="row">
                        <div className="form-group col-sm-9">
                          <label>Logradouro:</label>
                          <input
                            type="text"
                            name="logradouro"
                            value={enderecoBusca.logradouro}
                            className="form-control input-sm"
                            placeholder=""
                            style={{ overflow: "auto" }}
                            required
                            readOnly
                          />
                        </div>
                        <div className="form-group col-sm-3">
                          <label>Número:</label>
                          <input
                            type="number"
                            name="numero"
                            defaultValue=""
                            className="form-control input-sm"
                            placeholder=""
                            autoFocus={true}
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-sm-12">
                          <label>Complemento: (Opcional)</label>
                          <input
                            type="text"
                            name="complemento"
                            defaultValue=""
                            className="form-control input-sm"
                            placeholder=""
                          />
                        </div>
                        <div className="form-group col-sm-12">
                          <label>CEP:</label>
                          <input
                            type="text"
                            name="cep"
                            value={enderecoBusca.cep}
                            className="form-control input-sm"
                            placeholder=""
                            required
                            readOnly
                          />
                        </div>
                        <div className="form-group col-sm-12">
                          <label>Bairro:</label>
                          <input
                            type="text"
                            name="bairro"
                            value={enderecoBusca.bairro}
                            className="form-control input-sm"
                            placeholder=""
                            style={{ overflow: "auto" }}
                            required
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-sm-9">
                          <label>Municipio:</label>
                          <input
                            type="text"
                            name="municipio"
                            value={enderecoBusca.municipio}
                            className="form-control input-sm"
                            placeholder=""
                            required
                            readOnly
                          />
                        </div>
                        <div className="form-group col-sm-3">
                          <label>UF:</label>
                          <input
                            type="text"
                            name="uf"
                            value={enderecoBusca.uf}
                            className="form-control input-sm"
                            placeholder=""
                            required
                            readOnly
                          />
                        </div>
                      </div>

                      <div
                        className="form-group col-sm-12"
                        style={{ textAlign: "center" }}
                      >
                        <button
                          className="btn btn-primary btn-lg"
                          style={{
                            background: modoVk === "ESTAB" ? cor3 : "#ff5722",
                            color: "white",
                            borderRadius: "50px",
                            border: "none",
                          }}
                        >
                          <b>Cadastrar</b>
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-3"></div>
                </div>
              ) : null}
            </>
          )}
        </div>
        <div className="modal-footer">
          {conteudo ? (
            <button
              className="btn btn-primary"
              onClick={this.hideConteudo}
              style={{
                color: "white",
                border: "none",
                background: modoVk === "ESTAB" ? cor3 : "#ff5722",
                borderRadius: "50px",
              }}
            >
              <b>Cadastrar Novo endereço</b>
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={this.showConteudo}
              style={{ borderRadius: "50px" }}
            >
              <b>Voltar aos endereços</b>
            </button>
          )}
        </div>
      </>
    );
  }
}
export default CarrinhoModal;
