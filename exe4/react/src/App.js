import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ReactLoading from "react-loading";
import "./Assets/App.css";
import * as API from "./API";

import Header from "./Components/Header/Header";
import Restaurantes from "./Components/Restaurantes/Restaurantes";
import Cardapio from "./Components/Cardapio/Cardapio";
import Login from "./Auth/Login";
import Pedidos from "./Components/Pedidos/Pedidos";
import EmBreve from "./Components/Em Breve/EmBreve";
import * as dotenv from "dotenv";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
dotenv.config();

if (
  process.env.REACT_APP_SENTRY_DSN !== null ||
  process.env.REACT_APP_SENTRY_DSN !== undefined
) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new BrowserTracing(), new Sentry.Replay()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    replaysOnErrorSampleRate: 1.0,
    tracesSampleRate: 1.0,
  });
}

const CryptoJS = require("crypto-js");
class App extends Component {
  state = {
    loading: true,
    categorias: [],
    restaurantes: [],
    restaurante: null,
    carrinho: {
      restaurante: {},
      itens: [],
      formaPagamento: "Dinheiro",
      troco: 0,
      modoEntrega: "ENTREGA",
      observacao: "",
      documento: "",
    },
    endereco: {
      taxa: 0,
      logradouro: "",
      numero: "",
      complemento: "",
      cep: "",
      bairro: "",
      municipio: "",
      uf: "",
    },
    enderecoBusca: {},
    cepBusca: "",
    cliente: null,
    encontraCep: false,
    modoVk: "VK",
    cor1: "",
    cor2: "",
    cor3: "",
    horaAtual: "",
    enderecoVerificado: true,
  };

  clearCacheData = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
    console.log("Limpeza de cache realizada");
  };

  setObservacao = (obs) => {
    let carrinho = this.state.carrinho;
    carrinho.observacao = obs;
    this.setState({ carrinho });
  };

  getHoraAtual = () => {
    let data = new Date();
    let horas = data.getHours();
    let minutos = data.getMinutes();
    let horaAtual = [horas, minutos].join(":");
    this.setState({ horaAtual });
  };

  setEndereco = (endereco) => {
    let ender = endereco;
    this.setState({ endereco: ender });
    this.getTaxa(
      this.state.restaurante.id_estabelecimento,
      endereco.bairro,
      endereco.cep
    );
  };

  addItem = (produto) => {
    let carrinho = this.state.carrinho;
    let itens;

    if (carrinho.contador === null || carrinho.contador === undefined) {
      carrinho.contador = 1;
    } else {
      carrinho.contador++;
    }
    itens = this.state.carrinho.itens;
    let item = {
      id_contador: carrinho.contador,
      id_produto: produto.id_produto,
      nome: produto.nome,
      quantidade: produto.quantidade,
      vr_unitario: produto.vr_unitario,
      vr_total: produto.vr_total,
      complementos: produto.complementos,
    };

    if (carrinho.restaurante !== this.state.restaurante) {
      carrinho.restaurante = this.state.restaurante;
      itens = [];
    }

    itens.push(item);
    carrinho.itens = itens;
    this.setState({ carrinho });
  };

  remItem = (produto) => {
    let carrinho = this.state.carrinho;
    let itens = this.state.carrinho.itens.filter(
      (i) => i.id_contador !== produto.id_contador
    );

    carrinho.itens = itens;
    this.setState({ carrinho });
  };

  setPedidoCabecalho = (history) => {
    const cliente = this.state.cliente;
    const endereco = this.state.endereco;
    const restaurante = this.state.carrinho.restaurante;
    const itens = this.state.carrinho.itens;
    const formaPagamento = this.state.carrinho.formaPagamento;
    const taxa = this.state.endereco.taxa;
    const vrTroco = this.state.carrinho.troco;
    const modoEntrega = this.state.carrinho.modoEntrega;
    const observacao = this.state.carrinho.observacao;
    const documento = this.state.carrinho.documento;

    let pedidoItens = [];
    // eslint-disable-next-line
    for (const [_, item] of itens.entries()) {
      let complementos = [];
      for (const comp of item.complementos) {
        let complemento = {
          id_complemento: comp.id_complemento,
          complemento: comp.nome_complemento,
          vr_unitario: comp.vr_adicional,
          quantidade: comp.qtde,
          observacao: "",
          cod_externo: "",
        };
        complementos.push(complemento);
      }
      const pedItem = {
        idProduto: item.id_produto,
        nome: item.nome,
        descricao: "",
        observacao: "",
        subItem: complementos,
        quantidade: item.quantidade,
        vrUnitario: item.vr_unitario,
        vrTotal: item.vr_total,
      };

      pedidoItens.push(pedItem);
    }

    const pedidoCabecalho = {
      id_estabelecimento: restaurante.id_estabelecimento,
      id_cliente: cliente.id_cliente,
      nome_cliente: cliente.nome,
      entrega_cep: modoEntrega === "ENTREGA" ? endereco.cep : "",
      entrega_logradouro:
        modoEntrega === "ENTREGA"
          ? endereco.logradouro
          : restaurante.logradouro,
      entrega_numero:
        modoEntrega === "ENTREGA" ? endereco.numero : restaurante.numero,
      entrega_complemento:
        modoEntrega === "ENTREGA" ? endereco.complemento : "",
      entrega_bairro:
        modoEntrega === "ENTREGA" ? endereco.bairro : restaurante.bairro,
      entrega_municipio:
        modoEntrega === "ENTREGA" ? endereco.municipio : restaurante.municipio,
      entrega_uf: modoEntrega === "ENTREGA" ? endereco.uf : restaurante.uf,
      entrega_taxa: modoEntrega === "ENTREGA" ? taxa : 0,
      forma_pagamento: formaPagamento,
      vr_pedido:
        modoEntrega === "ENTREGA"
          ? itens.reduce((sum, item) => sum + item.vr_total, 0) + taxa
          : itens.reduce((sum, item) => sum + item.vr_total, 0) + 0,
      vr_troco: vrTroco !== 0 ? vrTroco : 0,
      status_pedido: "PENDENTE",
      entrega_observacao: observacao,
      origem: "SITE",
      tipo_pedido: modoEntrega,
      id_pedido: 0,
      documento: documento,
      carrinho: pedidoItens,
    };

    pedidoCabecalho.carrinho = pedidoItens;

    let erro = false;

    API.add("ConfirmaPedido", pedidoCabecalho)
      .then((data) => {
        if (data.status !== "SUCESSO") {
          erro = true;
        }

        if (erro) {
          toast.error(`Error, ${data.status}`);
        } else {
          toast.success(
            "Sucesso! Logo seu pedido estará pronto para entrega..",
            {
              position: "top-center",
              duration: 6000,
            }
          );

          const carrinho = {
            restaurante: {},
            itens: [],
            formaPagamento: "Dinheiro",
            troco: 0,
            documento: "",
          };
          this.setState({ carrinho });

          history.push("/pedidos");
        }
      })
      .catch((error) => {
        erro = true;
        alert(error);
      });
  };

  setFormaPagamento = (formaPagamento) => {
    let carrinho = this.state.carrinho;
    carrinho.formaPagamento = formaPagamento;

    this.setState({ carrinho });
  };

  setTroco = (troco) => {
    let carrinho = this.state.carrinho;
    carrinho.troco = parseFloat(troco);

    this.setState({ carrinho });
  };

  setEntrega = (modoEntrega) => {
    let carrinho = this.state.carrinho;
    carrinho.modoEntrega = modoEntrega;

    this.setState({ modoEntrega });
  };

  hideEndereco = () => {
    this.setState({ encontraCep: false });
  };

  getEndereco = (cep) => {
    API.getEndereco(cep)
      .then((data) => {
        if (data.erro) {
          toast.error("CEP não encontrado!");
          this.setState({ encontraCep: false });
          return;
        }
        const enderecoBusca = {
          taxa: 0,
          logradouro: data.logradouro,
          numero: "",
          complemento: "",
          cep: data.cep,
          bairro: data.bairro,
          municipio: data.localidade,
          uf: data.uf,
        };

        this.setState({ enderecoBusca });
        this.setState({ encontraCep: true });
      })
      .catch((err) => toast.error("CEP não encontrado!"));
  };

  logout = () => {
    let endereco = {
      taxa: 0,
      logradouro: "",
      numero: "",
      complemento: "",
      cep: "",
      bairro: "",
      municipio: "",
      uf: "",
    };
    this.setState({ cliente: null, endereco });
    localStorage.removeItem("Cliente");
  };

  setCliente(cliente) {
    let endereco;

    this.setState({ cliente });
    if (cliente.enderecos.length > 0) {
      endereco = cliente.enderecos[0];
      this.setState({ endereco });
    }
  }

  cadastraUser = (data) => {
    API.get("Cliente", `?email=${data.email}&senha=${data.senha}`).then(
      (result) => {
        if (result.status === "NENHUM CLIENTE CADASTRADO") {
          API.add("Cliente", data).then((result) => {
            if (result.status === "SUCESSO") {
              toast.success("Cadastro realizado com Sucesso!");
            }
          });
        }
      }
    );
  };

  login = async (data, history) => {
    API.get("Cliente", `?email=${data.email}&senha=${data.senha}`).then(
      (result) => {
        if (result.length === 0) {
          toast.error("E-mail ou senha inválidos!");
        } else {
          if (result.status === "NENHUM CLIENTE CADASTRADO") {
            toast.error("Email não cadastrado");
            return;
          }
          let cliente = result.cliente;

          let dadosStorage = {
            email: cliente.email,
            uid: cliente.id_firebase,
          };

          let encryptDados = CryptoJS.AES.encrypt(
            JSON.stringify(dadosStorage),
            process.env.REACT_APP_ENCRYPT_PASS
          ).toString();

          localStorage.setItem("Cliente", encryptDados);
          this.getEnderecos(cliente);

          history.goBack();
        }
      }
    );
  };

  loginAlt = async (data, history) => {
    API.get(
      "Cliente",
      `?idFirebase=${data.id_firebase}&email=${data.email}`
    ).then((result) => {
      if (result.status === "NENHUM CLIENTE CADASTRADO") {
        API.add("Cliente", data).then((value) => {
          API.get(
            "Cliente",
            `?idFirebase=${value.id_firebase}&email=${value.email}`
          )
            .then((res) => {
              let cliente = res.cliente;
              this.getEnderecos(cliente);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }

      let dadosStorage = {
        email: data.email,
        uid: data.id_firebase,
      };

      let encryptDados = CryptoJS.AES.encrypt(
        JSON.stringify(dadosStorage),
        process.env.REACT_APP_ENCRYPT_PASS
      ).toString();

      localStorage.setItem("Cliente", encryptDados);
      this.getEnderecos(result.cliente);

      history.goBack();
    });
  };

  getTaxa = (idEstab, bairro, cep) => {
    if (bairro === "" || bairro === undefined) {
      let endereco = this.state.endereco;
      endereco.taxa = 0;
      this.setState({ endereco });
      return;
    }
    API.getTaxa(idEstab, bairro, cep).then((data) => {
      if (
        data.id_taxa === 0 &&
        this.state.restaurante.id_estabelecimento !== 0
      ) {
        toast.error(
          "Sentimos muito.. \n esta loja não faz entregas no endereço selecionado.",
          {
            id: "toast-endereco",
          }
        );
        this.setState({
          endereco: {
            taxa: 0,
            logradouro: "",
            numero: "",
            complemento: "",
            cep: "",
            bairro: "",
            municipio: "",
            uf: "",
          },
          enderecoVerificado: false,
        });
      } else {
        this.setState({ taxa: data.valor_taxa });
        let endereco = this.state.endereco;
        endereco.taxa = data.valor_taxa;
        this.setState({ endereco, enderecoVerificado: true });
      }
    });
  };

  getEnderecos = (cliente) => {
    API.get("ClienteEndereco", `?idCliente=${cliente.id_cliente}`).then(
      (result) => {
        if (
          result.enderecos === null ||
          result.enderecos === undefined ||
          result.enderecos.length === 0
        ) {
          cliente.enderecos = result.enderecos;
          this.setState({ cliente });
          return;
        } else {
          result.enderecos.sort((a, b) => {
            if (a.padrao > b.padrao) {
              return -1;
            }
            if (a.padrao < b.padrao) {
              return 1;
            }
            return 0;
          });

          cliente.enderecos = result.enderecos;
          this.setState({ cliente });

          let endereco;
          if (cliente.enderecos.length > 0) {
            endereco = cliente.enderecos[0];
            this.setState({ endereco });
          }
          if (
            this.state.restaurante.id_estabelecimento !== null ||
            this.state.restaurante.id_estabelecimento !== undefined ||
            this.state.restaurante.id_estabelecimento !== ""
          ) {
            this.getTaxa(
              this.state.restaurante.id_estabelecimento,
              this.state.endereco.bairro,
              this.state.endereco.cep
            );
          }
        }
      }
    );
  };

  componentDidMount() {
    this.setState({ loading: true });
    let estab = {
      id_estabelecimento: 0,
      razao_social: "vempraka",
      imagem: "",
    };

    switch (window.location.hostname) {
      case "donfrango.com.br":
        this.setState({
          modoVk: "ESTAB",
          cor1: "#ffb100",
          cor2: "#fff",
          cor3: "#ff5a00",
        });
        estab.id_estabelecimento = 12;
        estab.imagem =
          "https://biblioteca.mrstecno.com.br/vempraka/empresas/Don%20Frango.jpg";
        document.querySelector("link[rel='shortcut icon']").href =
          "https://biblioteca.mrstecno.com.br/vempraka/empresas/Don%20Frango.jpg";
        window.top.document.title = "Don Frango";
        break;

      case "carneassada.anoteja.com.br":
        // case "localhost":
        this.setState({
          modoVk: "ESTAB",
          cor1: "#d4591d",
          cor2: "#fff",
          cor3: "#ff5a00",
        });
        estab.id_estabelecimento = 13;
        estab.imagem =
          "https://img.freepik.com/vetores-premium/entregador-montando-a-ilustracao-de-scooter-vermelho_9845-14.jpg?w=740";
        document.querySelector("link[rel='shortcut icon']").href =
          "https://img.freepik.com/vetores-premium/entregador-montando-a-ilustracao-de-scooter-vermelho_9845-14.jpg?w=740";
        window.top.document.title = "Restaurante Carne Assada";
        break;

      case "vpk.vempraka.com.br":
        this.setState({ modoVk: "VK" });
        estab.id_estabelecimento = 5;
        break;

      case "vempraka.com.br":
      case "localhost":
      default:
        this.setState({ modoVk: "VK", cor1: "" });
        estab.id_estabelecimento = 0;
        estab.razao_social = "vempraka";
        document.querySelector("link[rel='shortcut icon']").href =
          "https://biblioteca.mrstecno.com.br/vempraka/logo/Logo_laranja.png";
        window.top.document.title = "VemPraKa";
        break;

      case "mrsdelivery.vempraka.com.br":
        this.setState({
          modoVk: "ESTAB",
          cor1: "#222222",
          cor2: "white",
          cor3: "red",
        });
        estab.id_estabelecimento = 11;
        document.querySelector("link[rel='shortcut icon']").href =
          "https://img.freepik.com/vetores-premium/entregador-montando-a-ilustracao-de-scooter-vermelho_9845-14.jpg?w=740";
        this.setState({
          imagem:
            "https://img.freepik.com/vetores-premium/entregador-montando-a-ilustracao-de-scooter-vermelho_9845-14.jpg?w=740",
        });
        window.top.document.title = "MRS Delivery";
        break;
    }
    this.setState({ restaurante: estab });

    API.getToken("gatekeeper/anonymous")
      .then((result) => {
        if (result === 403) {
          alert("Acesso negado");
        } else {
          if (estab.id_estabelecimento === 0) {
            let loggedCli = localStorage.getItem("Cliente");
            if (loggedCli !== null) {
              var decryptDados = CryptoJS.AES.decrypt(
                loggedCli,
                process.env.REACT_APP_ENCRYPT_PASS
              );
              var decryptedDados = JSON.parse(
                decryptDados.toString(CryptoJS.enc.Utf8)
              );

              API.get(
                "Cliente",
                `?idFirebase=${decryptedDados.uid}&email=${decryptedDados.email}`
              ).then((result) => {
                let cliente = result.cliente;

                this.getEnderecos(cliente);
              });
            }
            this.getHoraAtual();
            API.getEstabelecimentos().then((data) => {
              this.setState({ restaurantes: data.estabelecimentos });
              API.getCategorias().then((data) => {
                this.setState({ categorias: data.categorias });

                setTimeout(() => {
                  this.setState({ loading: false });
                }, 500);
              });
            });
          } else if (estab.id_estabelecimento === 99) {
            let res = {
              id_estabelecimento: estab.id_estabelecimento,
              imagem: estab.imagem,
            };
            this.setState({ restaurante: res });
            setTimeout(() => {
              this.setState({ loading: false });
            }, 500);
          } else {
            let loggedCli = localStorage.getItem("Cliente");
            if (loggedCli !== null) {
              var decryptDados = CryptoJS.AES.decrypt(
                loggedCli,
                process.env.REACT_APP_ENCRYPT_PASS
              );
              var decryptedDados = JSON.parse(
                decryptDados.toString(CryptoJS.enc.Utf8)
              );

              API.get(
                "Cliente",
                `?idFirebase=${decryptedDados.uid}&email=${decryptedDados.email}`
              ).then((result) => {
                let cliente = result.cliente;

                this.getEnderecos(cliente);
              });
            }
            API.get(
              "Estabelecimento",
              `?estab=${estab.id_estabelecimento}`
            ).then((res) => {
              if (res.id_estabelecimento > 0) {
                this.setState({ restaurante: res });
                this.getHoraAtual();

                setTimeout(() => {
                  this.setState({ loading: false });
                }, 500);
              }
            });
          }

          //limpando cache ao abrir site
          this.clearCacheData();
        }
      })
      .catch((e) => {
        setTimeout(() => {
          this.setState({ loading: false });
        }, 500);
      });
  }

  setCep = (cep) => {
    this.setState({ cepBusca: cep });
  };

  setRestaurantes = (data) => {
    this.setState({ restaurantes: data });
  };

  setDocumento = (documento) => {
    let carrinho = this.state.carrinho;
    if (documento !== null && documento !== undefined && documento !== "") {
      carrinho.documento = documento;
      this.setState({ carrinho });
      toast.success("CPF/CNPJ incluso no pedido!", { id: "alerta-documento" });
    } else {
      carrinho.documento = documento;
      this.setState({ carrinho });
    }
  };

  render() {
    const {
      restaurante,
      restaurantes,
      cliente,
      carrinho,
      endereco,
      categorias,
      encontraCep,
      enderecoBusca,
      cepBusca,
      loading,
      modoVk,
      cor1,
      cor2,
      cor3,
      horaAtual,
      enderecoVerificado,
    } = this.state;

    return (
      <div>
        {!loading ? (
          restaurante &&
          restaurante.id_estabelecimento > 0 &&
          modoVk === "ESTAB" ? (
            <>
              <Route
                exact
                path="/"
                render={() => (
                  <Redirect
                    to={`/${restaurante.id_estabelecimento}/cardapio`}
                  />
                )}
              />
              <Route
                exact
                path="/restaurantes"
                render={() => (
                  <Redirect
                    to={`/${restaurante.id_estabelecimento}/cardapio`}
                  />
                )}
              />
            </>
          ) : restaurante &&
            restaurante.id_estabelecimento === 99 &&
            modoVk === "ESTAB" ? (
            <Route
              exact
              path="/"
              render={() => (
                <div style={{ backgroundColor: "orange" }}>
                  <EmBreve restaurante={restaurante} />
                </div>
              )}
            />
          ) : (
            <>
              <Route
                exact
                path="/"
                render={() => <Redirect to="/restaurantes" />}
              />
              <Route
                exact
                path="/restaurantes"
                render={({ history }) => (
                  <div>
                    <Header
                      endereco={endereco}
                      cliente={cliente}
                      logout={this.logout}
                      restaurantes={restaurantes}
                      getPedidos={() => {
                        history.push("/pedidos");
                      }}
                      cepBusca={cepBusca}
                      modoVk={modoVk}
                      cor1={cor1}
                      cor2={cor2}
                    />
                    <Toaster />
                    <Restaurantes
                      restaurantes={restaurantes}
                      endereco={endereco}
                      enderecoBusca={enderecoBusca}
                      categorias={categorias}
                      encontraCep={encontraCep}
                      hideEndereco={this.hideEndereco}
                      getEndereco={(cep) => {
                        this.getEndereco(cep, history);
                      }}
                      getEnderecos={this.getEnderecos}
                      setEndereco={(endereco) => {
                        this.setEndereco(endereco);
                      }}
                      getCardapio={(restaurante) => {
                        this.setState({ restaurante });
                        history.push(
                          `/${restaurante.id_estabelecimento}/cardapio`
                        );
                      }}
                      cepBusca={cepBusca}
                      setCep={(cep) => this.setCep(cep)}
                      setRestaurantes={(data) => this.setRestaurantes(data)}
                      getHoraAtual={() => this.getHoraAtual()}
                      horaAtual={horaAtual}
                    />
                  </div>
                )}
              />
            </>
          )
        ) : (
          <div className="loaderApp">
            <ReactLoading
              type="spinningBubbles"
              color={`${modoVk === "VK" ? "#ff5722" : cor3}`}
              height={100}
              width={100}
            />
          </div>
        )}
        <Route
          exact
          path="/login"
          render={({ history }) => (
            <div
              style={{
                background: `${modoVk === "VK" ? "#e7e7e7" : cor1}`,
                backgroundSize: "cover",
                minHeight: "100vh",
                overlay: "auto",
              }}
            >
              <Toaster />
              <Login
                login={(data) => {
                  this.login(data, history);
                }}
                loginAlt={(data) => {
                  this.loginAlt(data, history);
                }}
                cadastraUser={(data) => {
                  this.cadastraUser(data);
                }}
                restaurante={restaurante}
                modoVk={modoVk}
                cor3={cor3}
              />
            </div>
          )}
        />
        <Route
          exact
          path="/:id/cardapio"
          render={({ history }) =>
            restaurante === null ? (
              <Redirect to="/" />
            ) : (
              <div>
                <Header
                  endereco={endereco}
                  cliente={cliente}
                  logout={this.logout}
                  restaurantes={restaurantes}
                  getPedidos={() => {
                    history.push("/pedidos");
                  }}
                  cepBusca={cepBusca}
                  restaurante={restaurante}
                  modoVk={modoVk}
                  cor1={cor1}
                  cor2={cor2}
                />
                <Toaster />
                <Cardapio
                  getEnderecos={this.getEnderecos}
                  hideEndereco={this.hideEndereco}
                  history={history}
                  endereco={endereco}
                  restaurante={restaurante}
                  cliente={cliente}
                  carrinho={carrinho}
                  encontraCep={encontraCep}
                  addItem={this.addItem}
                  remItem={this.remItem}
                  getEndereco={(cep) => {
                    this.getEndereco(cep, history);
                  }}
                  enderecos={
                    cliente === null
                      ? []
                      : cliente.enderecos === undefined
                      ? []
                      : cliente.enderecos
                  }
                  setEndereco={(endereco) => {
                    this.setEndereco(endereco);
                    this.getTaxa(
                      restaurante.id_estabelecimento,
                      endereco.bairro,
                      endereco.cep
                    );
                  }}
                  restaurantes={restaurantes}
                  enviarPedido={() => {
                    if (cliente === null) {
                      toast.error(
                        "você precisa estar logado para finalizar o pedido",
                        {
                          id: "toast_item",
                        }
                      );
                      history.push("/login");
                    } else {
                      this.setPedidoCabecalho(history);
                    }
                  }}
                  setFormaPagamento={this.setFormaPagamento}
                  setTroco={this.setTroco}
                  setEntrega={this.setEntrega}
                  getTaxa={() =>
                    this.getTaxa(
                      this.state.restaurante.id_estabelecimento,
                      endereco.bairro,
                      endereco.cep
                    )
                  }
                  enderecoBusca={enderecoBusca}
                  modoVk={modoVk}
                  cor1={cor1}
                  cor2={cor2}
                  cor3={cor3}
                  getHoraAtual={() => this.getHoraAtual()}
                  horaAtual={horaAtual}
                  setObservacao={(obs) => this.setObservacao(obs)}
                  enderecoVerificado={enderecoVerificado}
                  documento={carrinho.documento}
                  setDocumento={(documento) => this.setDocumento(documento)}
                />
              </div>
            )
          }
        />
        <Route
          exact
          path="/pedidos"
          render={({ history }) =>
            cliente === null ? (
              <Redirect to="/" />
            ) : (
              <div>
                <Header
                  endereco={endereco}
                  cliente={cliente}
                  logout={this.logout}
                  getPedidos={() => {
                    history.push("/pedidos");
                  }}
                  getCardapio={(restaurante) => {
                    this.setState({ restaurante });
                    history.push(`/${restaurante.id_estabelecimento}/cardapio`);
                  }}
                  cepBusca={cepBusca}
                  restaurante={restaurante}
                  modoVk={modoVk}
                  cor1={cor1}
                  cor2={cor2}
                />
                <Toaster />
                <Pedidos
                  cliente={cliente}
                  modoVk={modoVk}
                  cor3={cor3}
                  restaurante={restaurante}
                />
              </div>
            )
          }
        />
      </div>
    );
  }
}

export default App;
