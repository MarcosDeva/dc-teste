import React, { Component } from "react";
import PropTypes from "prop-types";

class CarrinhoItemTotalizador extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    valor: PropTypes.number,
    bold: PropTypes.bool,
  };

  render() {
    const { label, valor, bold } = this.props;

    return (
      <>
        <div className="col-xs-6">{label}</div>
        {bold ? (
          <div className="col-xs-6" style={{ textAlign: "right", fontWeight: "bold", fontSize: "16px"}}>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(valor)}
          </div>
        ) : (
          <div className="col-xs-6" style={{ textAlign: "right" }}>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(valor)}
          </div>
        )}

        {/* <tr className="secondary" style={{ textAlign: "right" }}>
          <th>{label}</th>
          {bold ? (
            <th>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(valor)}
            </th>
          ) : (
            <td>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(valor)}
            </td>
          )}
        </tr> */}
      </>
    );
  }
}

export default CarrinhoItemTotalizador;
