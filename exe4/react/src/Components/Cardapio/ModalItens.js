import React, { Component } from "react";
import PropTypes from "prop-types";
import semImagem from "../../Assets/semImagem.jpg";

import "../../Assets/App.css";
import toast from "react-hot-toast";

class ModalItens extends Component {
  static propTypes = {
    item: PropTypes.object,
    hideModal: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    restaurante: PropTypes.object,
    tipoItem: PropTypes.string.isRequired,
    preco: PropTypes.number,
    remItem: PropTypes.func,
    modoVk: PropTypes.string,
    cor3: PropTypes.string,
  };

  state = {
    categorias: [],
    precoTotal: 0,
    quantidade: 1,
    modo: "",
    editando: false,
  };

  addQtde = () => {
    let quantidade = this.state.quantidade;
    quantidade++;
    let vrTotal = 0.0;
    if (this.state.categorias !== null && this.state.categorias !== undefined) {
      for (const item of this.state.categorias) {
        for (const comp of item.itens) {
          if (
            (comp.checado && comp.qtde > 0) ||
            (comp.checado === undefined && comp.qtde > 0)
          ) {
            vrTotal = vrTotal + comp.vr_adicional * comp.qtde * quantidade;
          }
        }
      }
    }
    this.setState({ quantidade });
    this.setState({
      precoTotal: quantidade * this.props.item.vr_unitario + vrTotal,
    });
  };

  remQtde = () => {
    let quantidade = this.state.quantidade;
    quantidade--;
    let vrTotal = 0.0;
    if (this.state.categorias !== null && this.state.categorias !== undefined) {
      for (const item of this.state.categorias) {
        for (const comp of item.itens) {
          if (
            (comp.checado && comp.qtde > 0) ||
            (comp.checado === undefined && comp.qtde > 0)
          ) {
            vrTotal = vrTotal - comp.vr_adicional * comp.qtde * quantidade;
          }
        }
      }
    }
    this.setState({ quantidade });
    this.setState({
      precoTotal: quantidade * this.props.item.vr_unitario - vrTotal,
    });
  };

  addItemModal = () => {
    let item = this.props.item;
    let categorias = this.state.categorias;
    let quantidade = this.state.quantidade;
    let tipoItem = this.props.tipoItem;
    let editando = this.state.editando;
    var complementos = [];

    if (categorias !== null && categorias !== undefined) {
      for (let [_, categoria] of categorias.entries()) {
        // eslint-disable-line
        if (categoria.status_categoria === 1) {
          if (
            categoria.uso_obrigatorio === 1 &&
            categoria.qtdeItem < categoria.qtde_min
          ) {
            toast.error("Preencha os campos obrigatórios", {
              position: "top-center",
              id: "toast_item",
            });
            return;
          }
        }

        for (let [_, complemento] of categoria.itens.entries()) {
          if (complemento.qtde >= 1) {
            const comp = {
              id_categoria_complemento: complemento.id_categoria_complemento,
              id_complemento: complemento.id_complemento,
              nome_complemento: complemento.nome_complemento,
              vr_adicional: complemento.vr_adicional,
              qtde: complemento.qtde,
            };
            complementos.push(comp);
          }
        }
      }
    }

    const itemNovo = {
      nome: item.nome,
      id_produto: item.id_produto,
      vr_unitario: item.vr_unitario,
      vr_total: this.state.precoTotal,
      complementos: complementos,
      quantidade: quantidade,
    };
    this.props.addItem(itemNovo);
    this.props.hideModal();
    if (tipoItem === "EDITAR") {
      if (editando) {
        this.setState({ editando: false });
      }
      toast.success("Salvo!");
      this.props.remItem(item);
    } else {
      toast.success(this.props.item.nome + " adicionado ao carrinho!", {
        id: "toast_item",
      });
    }
  };

  disableAdd = (buttons, categoria) => {
    for (let i = 0; i < buttons.length; i++) {
      if (categoria.qtdeItem === categoria.qtde_maxima) {
        buttons[i].disabled = true;
      } else {
        buttons[i].disabled = false;
      }
    }
  };

  disableChk = (checkboxes, categoria) => {
    for (var i = 0; i < checkboxes.length; i++) {
      if (categoria.qtdeItem === categoria.qtde_maxima) {
        if (!checkboxes[i].checked) {
          checkboxes[i].disabled = true;
        }
      } else {
        if (!checkboxes[i].checked) {
          checkboxes[i].disabled = false;
        }
      }
    }
  };

  verificaChk = (complemento) => {
    if (this.props.tipoItem === "EDITAR") {
      this.setState({ editando: true });
    }
    let checkbox = document.querySelector(
      `#check${complemento.id_complemento}`
    );

    var categorias = this.state.categorias;
    for (let [_, cat] of categorias.entries()) {
      if (
        cat.id_categoria_complemento === complemento.id_categoria_complemento
      ) {
        if (checkbox !== null && checkbox !== undefined) {
          if (checkbox.checked) {
            if (this.props.tipoItem === "NOVO") {
              cat.qtdeItem++;
            }
          } else {
            if (this.props.tipoItem === "NOVO") {
              cat.qtdeItem--;
            }
          }
          if (this.state.editando) {
            if (checkbox.checked) {
              cat.qtdeItem++;
            } else {
              cat.qtdeItem--;
            }
          }
        }
        var checkboxes = document.getElementsByName(
          `complemento-${cat.nome_categoria}`
        );

        for (let [_, comp] of cat.itens.entries()) {
          if (comp.id_complemento === complemento.id_complemento) {
            if (checkbox !== null && checkbox !== undefined) {
              comp.checado = checkbox.checked;
              comp.qtde = 1;

              if (!checkbox.checked && comp.qtde >= 1) {
                comp.qtde = 0;
                if (this.state.editando || this.props.tipoItem === "NOVO") {
                  this.setState({
                    precoTotal:
                      this.state.precoTotal -
                      comp.vr_adicional * this.state.quantidade,
                  });
                }
              } else {
                if (this.state.editando || this.props.tipoItem === "NOVO") {
                  this.setState({
                    precoTotal:
                      this.state.precoTotal +
                      comp.vr_adicional * this.state.quantidade,
                  });
                }
              }
            }

            this.disableChk(checkboxes, cat, comp);
            this.setState({ categorias });
            this.setState({ modo: "novo" });
          }
        }
      }
    }
  };

  addComplemento = (complemento) => {
    var categorias = this.state.categorias;

    for (let [_, cat] of categorias.entries()) {
      // eslint-disable-line
      if (
        cat.id_categoria_complemento === complemento.id_categoria_complemento
      ) {
        var buttons = document.getElementsByName(
          `add${cat.id_categoria_complemento}`
        );

        for (let [_, comp] of cat.itens.entries()) {
          if (comp.id_complemento === complemento.id_complemento) {
            comp.qtde++;
            cat.qtdeItem++;

            this.setState({
              precoTotal:
                this.state.precoTotal +
                comp.vr_adicional * this.state.quantidade,
            });
            this.setState({ categorias });
            this.disableAdd(buttons, cat, comp);
          }
        }
      }
    }
  };

  remComplemento = (complemento) => {
    var categorias = this.state.categorias;
    for (let [_, cat] of categorias.entries()) {
      // eslint-disable-line
      if (
        cat.id_categoria_complemento === complemento.id_categoria_complemento
      ) {
        var buttons = document.getElementsByName(
          `add${cat.id_categoria_complemento}`
        );

        for (let [_, comp] of cat.itens.entries()) {
          if (comp.id_complemento === complemento.id_complemento) {
            comp.qtde--;
            cat.qtdeItem--;

            this.setState({
              precoTotal:
                this.state.precoTotal -
                comp.vr_adicional * this.state.quantidade,
            });
            this.setState({ categorias });
            this.disableAdd(buttons, cat, comp);
          }
        }
      }
    }
  };

  componentDidMount = () => {
    var categorias = this.props.item.complementos;
    var precoTotal = this.props.item.vr_unitario;
    var tipoItem = this.props.tipoItem;
    if (tipoItem === "NOVO") {
      if (categorias !== null && categorias !== undefined) {
        for (let [_, categoria] of categorias.entries()) {
          categoria.qtdeItem = 0;
          if (categoria.itens !== null) {
            for (let [_, complemento] of categoria.itens.entries()) {
              complemento.qtde = 0;
            }
          }
        }
      }
      this.setState({ modo: "novo" });
    }

    this.setState({ categorias });
    if (this.props.preco || undefined) {
      this.setState({ precoTotal: this.props.preco });
    } else {
      this.setState({ precoTotal });
    }

    if (tipoItem === "EDITAR") {
      this.setState({ modo: "editar" });
    }
  };

  componentDidUpdate = () => {
    if (this.state.modo === "editar" && this.props.tipoItem === "EDITAR") {
      var categorias = this.props.item.complementos;
      var item = this.props.item;

      if (categorias !== null) {
        for (let [_, categoria] of categorias.entries()) {
          if (categoria.qtdeItem <= 0) {
            categoria.qtdeItem = 0;
          }

          if (categoria.itens !== null) {
            for (let [_, complemento] of categoria.itens.entries()) {
              if (complemento.qtde <= 0) {
                complemento.qtde = 0;
              }
              this.verificaChk(complemento);
            }
          }
        }
      }

      this.setState({ quantidade: item.qtde });
      this.setState({ modo: "done" });
    }
  };

  render() {
    const { item, tipoItem, modoVk, cor3 } = this.props;
    const { categorias, precoTotal, quantidade } = this.state;

    return (
      <div>
        <div className="modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() =>
              tipoItem === "NOVO"
                ? this.props.hideModal()
                : toast.error("Salve as alterações antes de sair..")
            }
          >
            <span aria-hidden="true">&times;</span>
          </button>

          <h4
            style={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {item.nome}
          </h4>
        </div>
        <div
          className="modal-body"
          style={{ height: window.innerWidth <= 450 ? "550px" : "auto" }}
        >
          <div className="container-fluid">
            {this.props.item.complementos === undefined ||
            this.props.item.complementos === null ||
            this.props.item.complementos.length === 0 ? (
              <div className="row">
                <div
                  className="col-sm-12"
                  style={{ padding: "10px", textAlign: "center" }}
                >
                  <img
                    alt=" "
                    className="img"
                    src={item.imagem === "" ? semImagem : item.imagem}
                    style={{
                      border: "2px solid rgba(124, 124, 124, 0.1)",
                      borderRadius: "20px",
                      maxWidth: "300px",
                      maxHeight: "200px",
                      width: "100%",
                      objectFit: "contain",
                    }}
                  />
                  <div
                    className=" text-muted col-sm-12"
                    style={{
                      textAlign: "center",
                      overflow: "auto",
                      maxHeight: "80px",
                      marginTop: "2px",
                    }}
                  >
                    {item.descricao}
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div
                  className="col-sm-5"
                  style={{ padding: "10px", textAlign: "center" }}
                >
                  <img
                    alt=" "
                    className="img"
                    src={item.imagem === "" ? semImagem : item.imagem}
                    style={{
                      borderRadius: "20px",
                      maxWidth: "300px",
                      maxHeight: "200px",
                      width: "100%",
                      objectFit: "contain",
                      backgroundColor: "#fff",
                    }}
                  />
                  <div
                    className=" text-muted col-sm-12"
                    style={{
                      textAlign: "justify",
                      overflow: "auto",
                      maxHeight: "80px",
                      marginTop: "2px",
                    }}
                  >
                    {item.descricao}
                  </div>
                </div>
                <div
                  className="col-sm-7 categoria"
                  style={{
                    padding: "5px",
                    overflow: "auto",
                    maxHeight: "250px",
                  }}
                >
                  <div
                    className="panel-group"
                    id="accordion"
                    role="tablist"
                    aria-multiselectable="true"
                    key={categorias.id_categoria_complemento}
                  >
                    <div className="panel-group">
                      <div
                        className="panel panel-default"
                        style={{ border: "none" }}
                      >
                        {categorias
                          .filter(
                            (categoria) => categoria.status_categoria === 1
                          )
                          .map((categoria, index) => (
                            <div className="panel panel-default" key={index}>
                              <div
                                className="panel-heading"
                                data-toggle="collapse"
                                href={`#collapse${categoria.id_categoria_complemento}`}
                                key={index}
                                style={{
                                  paddingBottom: "1px",
                                  cursor: "pointer",
                                }}
                              >
                                <div className="row">
                                  <div className="col-xs-7">
                                    <h4
                                      className="panel-title"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      {categoria.nome_categoria}
                                    </h4>
                                  </div>
                                  <div
                                    className="col-xs-5"
                                    style={{
                                      textAlign: "right",
                                      verticalAlign: "middle",
                                      paddingLeft: "1px",
                                      paddingRight: "4px",
                                    }}
                                  >
                                    {categoria.qtdeItem ===
                                      categoria.qtde_maxima &&
                                    categoria.uso_obrigatorio === 1 ? (
                                      <span
                                        className="glyphicon glyphicon-ok"
                                        style={{
                                          color: "#58E03B",
                                          marginRight: "5px",
                                        }}
                                      />
                                    ) : categoria.uso_obrigatorio === 1 ? (
                                      <>
                                        <span
                                          className="label label-default"
                                          style={{ marginRight: "3px" }}
                                        >
                                          {`${categoria.qtdeItem}/${categoria.qtde_maxima}`}
                                        </span>
                                        <span
                                          className="label"
                                          style={{ backgroundColor: "red" }}
                                        >
                                          {`Obrigatório`}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="label label-default">
                                        {`${categoria.qtdeItem}/${categoria.qtde_maxima}`}
                                      </span>
                                    )}
                                  </div>
                                  <div className="col-xs-12">
                                    <p className="text-muted">
                                      {categoria.descricao_categoria}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div
                                id={`collapse${categoria.id_categoria_complemento}`}
                                className="panel-collapse collapse in"
                              >
                                <ul
                                  className="list-group"
                                  style={{ wordBreak: "break-all" }}
                                >
                                  {categoria.itens === null ? (
                                    <div
                                      className="text-muted"
                                      style={{ marginLeft: "5px" }}
                                    >
                                      Sem complementos
                                      <br />
                                    </div>
                                  ) : (
                                    <table
                                      className="table table-condensed"
                                      style={{
                                        tableLayout: "initial",
                                        width: "100%",
                                      }}
                                    >
                                      <tbody key={index}>
                                        {categoria.itens
                                          .filter(
                                            (complemento) =>
                                              complemento.status_complemento ===
                                              1
                                          )
                                          .map((complemento, index) => (
                                            <tr key={index}>
                                              <td
                                                key={complemento.id_complemento}
                                                className="col-xs-5"
                                              >
                                                {complemento.nome_complemento}
                                              </td>
                                              {/* <td className="text-muted">
                                          {complemento.descricao_complemento}
                                        </td> */}
                                              <td
                                                className="col-xs-3"
                                                style={{
                                                  color: "#fc3232",
                                                  textAlign: "center",
                                                }}
                                              >
                                                {complemento.vr_adicional === 0
                                                  ? null
                                                  : new Intl.NumberFormat(
                                                      "pt-BR",
                                                      {
                                                        style: "currency",
                                                        currency: "BRL",
                                                      }
                                                    ).format(
                                                      complemento.vr_adicional
                                                    )}
                                              </td>
                                              {categoria.qtde_maxima === 1 ? (
                                                <td
                                                  className="col-xs-5"
                                                  style={{
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  <form
                                                    id="form-check"
                                                    className="form-check"
                                                  >
                                                    <input
                                                      className="form-check-input"
                                                      type="checkbox"
                                                      value={
                                                        complemento.nome_complemento
                                                      }
                                                      name={`complemento-${categoria.nome_categoria}`}
                                                      id={`check${complemento.id_complemento}`}
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      defaultChecked={
                                                        complemento.qtde >= 1
                                                          ? true
                                                          : false
                                                      }
                                                      onClick={() => {
                                                        this.verificaChk(
                                                          complemento
                                                        );
                                                      }}
                                                    />
                                                  </form>
                                                </td>
                                              ) : (
                                                <>
                                                  <td
                                                    className="col-xs-1"
                                                    style={{
                                                      verticalAlign: "middle",
                                                      textAlign: "center",
                                                      padding: "2px",
                                                    }}
                                                  >
                                                    {complemento.qtde ===
                                                    0 ? null : (
                                                      <button
                                                        className="btn btn-xs"
                                                        onClick={() =>
                                                          this.remComplemento(
                                                            complemento
                                                          )
                                                        }
                                                        style={{
                                                          borderRadius: "5px",
                                                          background: "none",
                                                          color: `${
                                                            modoVk === "VK"
                                                              ? "#ff5722"
                                                              : cor3
                                                          }`,
                                                          marginRight: "5px",
                                                        }}
                                                      >
                                                        <span className="glyphicon glyphicon-minus"></span>
                                                      </button>
                                                    )}
                                                  </td>
                                                  <td
                                                    className="col-xs-1"
                                                    style={{
                                                      verticalAlign: "middle",
                                                      textAlign: "center",
                                                      padding: "0px",
                                                    }}
                                                  >
                                                    {complemento.qtde === 0
                                                      ? null
                                                      : complemento.qtde}
                                                  </td>
                                                  <td
                                                    className="col-xs-1"
                                                    style={{
                                                      verticalAlign: "middle",
                                                      textAlign: "left",
                                                      padding: "2px",
                                                    }}
                                                  >
                                                    <button
                                                      className="btn btn-xs"
                                                      name={`add${categoria.id_categoria_complemento}`}
                                                      onClick={() => {
                                                        if (
                                                          complemento.qtde >=
                                                          categoria.qtde_maxima
                                                        ) {
                                                          toast.error(
                                                            `Você só pode selecionar até ${categoria.qtde_maxima} itens nessa categoria`,
                                                            {
                                                              position:
                                                                "top-right",
                                                            }
                                                          );
                                                        } else {
                                                          this.addComplemento(
                                                            complemento
                                                          );
                                                        }
                                                      }}
                                                      style={{
                                                        borderRadius: "5px",
                                                        background: "none",
                                                        marginLeft: "5px",
                                                        color: `${
                                                          modoVk === "VK"
                                                            ? "#ff5722"
                                                            : cor3
                                                        }`,
                                                      }}
                                                    >
                                                      <span className="glyphicon glyphicon-plus"></span>
                                                    </button>
                                                  </td>
                                                </>
                                              )}
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>

                                    // categoria.itens.map((complemento, index) => (
                                    //   <li className="list-group-item" key={index}>
                                    //     {complemento.nome_complemento}
                                    //       {new Intl.NumberFormat("pt-BR", {
                                    //         style: "currency",
                                    //         currency: "BRL",
                                    //       }).format(complemento.vr_adicional)}
                                    //   </li>
                                    // ))
                                  )}
                                </ul>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className="modal-footer"
          style={{ textAlign: "center", padding: "5px" }}
        >
          <div className="row">
            <div className="col-sm-2 col-xs-2"></div>

            <div className="col-sm-4 col-xs-4">
              <h3
                style={{
                  fontWeight: "bold",
                  color: `${modoVk === "VK" ? "##ff5722" : cor3}`,
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(precoTotal)}
              </h3>
            </div>
            <div
              className="col-sm-4 col-xs-4"
              style={{ margin: "20px 0 0 0", display: "inline-flex" }}
            >
              <div className="col-sm-4 col-xs-4" style={{ padding: "0" }}>
                {quantidade <= 1 ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-default disabled"
                    style={{
                      color: "white",
                      border: "none",
                      background: `${modoVk === "VK" ? "#ff5722" : cor3}`,
                      borderRadius: "5px",
                    }}
                  >
                    <span className="glyphicon glyphicon-minus"></span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm btn-default"
                    style={{
                      color: "white",
                      border: "none",
                      background: `${modoVk === "VK" ? "#ff5722" : cor3}`,
                      borderRadius: "5px",
                    }}
                    onClick={this.remQtde}
                  >
                    <span className="glyphicon glyphicon-minus"></span>
                  </button>
                )}
              </div>
              <div className="col-sm-4 col-xs-4" style={{ padding: "0" }}>
                <h4 style={{ margin: "5px 10px 0 10px" }}>{quantidade}</h4>
              </div>
              <div className="col-sm-4 col-xs-" style={{ padding: "0" }}>
                <button
                  type="button"
                  className="btn btn-sm btn-default"
                  style={{
                    color: "white",
                    border: "none",
                    background: `${modoVk === "VK" ? "#ff5722" : cor3}`,
                    borderRadius: "5px",
                  }}
                  onClick={this.addQtde}
                >
                  <span className="glyphicon glyphicon-plus"></span>
                </button>
              </div>
            </div>
            <div className="col-sm-2 col-xs-2"></div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{
              color: "white",
              fontWeight: "bold",
              border: "none",
              background: `${modoVk === "VK" ? "#ff5722" : cor3}`,
              borderRadius: "5px",
              width: "200px",
            }}
            id="confirmabtn"
            onClick={this.addItemModal}
          >
            {tipoItem === "NOVO" ? "Adicionar ao Carrinho" : "Salvar"}
          </button>
        </div>
      </div>
    );
  }
}

export default ModalItens;
