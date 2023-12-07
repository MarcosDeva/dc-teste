import React, { Component } from "react";
import PropTypes from "prop-types";
import logo from "../Assets/Logo.png";
import { initializeApp } from "firebase/app";
import "./Login.css";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import * as API from "../API";

import toast from "react-hot-toast";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASSUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provGoogle = new GoogleAuthProvider();
const provFacebook = new FacebookAuthProvider();

class Login extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    loginAlt: PropTypes.func.isRequired,
    cadastraUser: PropTypes.func.isRequired,
    restaurante: PropTypes.object,
    modoVk: PropTypes.string.isRequired,
    cor3: PropTypes.string,
  };

  state = {
    forgot: false,
    cadastrado: true,
    forgotEmail: "",
    registerNome: "",
    registerEmail: "",
    registerSenha: "",
    registerConfirma: "",
    loginEmail: "",
    loginSenha: "",
    verificaSenha: true,
  };

  cadastrado = () => {
    this.setState({ cadastrado: true });
  };

  naoCadastrado = () => {
    this.setState({ cadastrado: false });
  };

  verificaUser = (nome, email, idFirebase) => {
    let cliente = {
      nome: nome,
      email: email,
      id_firebase: idFirebase,
    };

    this.props.loginAlt(cliente);
  };

  signInWithGoogle = () => {
    signInWithPopup(auth, provGoogle)
      .then((result) => {
        const nome = result.user.displayName;
        const email = result.user.email;
        const idFirebase = result.user.uid;
        this.verificaUser(nome, email, idFirebase);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  signInWithFacebook = () => {
    signInWithPopup(auth, provFacebook)
      .then((result) => {
        const nome = result.user.displayName;
        const email = result.user.email;
        const idFirebase = result.user.uid;
        this.verificaUser(nome, email, idFirebase);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  verificaSenha = (senha, confirmaSenha) => {
    if (senha === "" && confirmaSenha === "") {
      toast.error("Senha não preenchida");
      return;
    }

    if (senha !== "" && confirmaSenha === "") {
      toast.error("Confirme a senha");
      return;
    }

    if (senha === "" && confirmaSenha !== "") {
      toast.error("Confirme a senha");
      return;
    }

    if (senha !== "" && confirmaSenha !== "") {
      if (senha !== confirmaSenha) {
        toast.error("As senhas não coincidem");

        return;
      }
    }
  };

  cadastra = () => {
    let nome = this.state.registerNome;
    let email = this.state.registerEmail;
    let senha = this.state.registerSenha;
    let confirmaSenha = this.state.registerConfirma;

    this.verificaSenha(senha, confirmaSenha);

    let usuario = {
      nome: nome,
      email: email,
      senha: senha,
      id_firebase: "",
    };

    if (confirmaSenha === senha) {
      createUserWithEmailAndPassword(auth, email, senha)
        .then((result) => {
          result.user.displayName = nome;
          usuario.id_firebase = result.user.uid;

          this.props.cadastraUser(usuario);
          this.setState({ cadastrado: true });
        })
        .catch((error) => {
          if (
            error.message ===
            "Firebase: Password should be at least 6 characters (auth/weak-password)."
          ) {
            toast.error("A Senha deve ter no mínimo 6 caracteres");
          }
          if (error.message === "Firebase: Error (auth/internal-error).") {
            console.log(error);
          }
          if (error.message === "Firebase: Error (auth/missing-email).") {
            toast.error("Email não preenchido");
          }
          if (error.message === "Firebase: Error (auth/invalid-email).") {
            toast.error("Email inválido");
          }
          if (
            error.message === "Firebase: Error (auth/email-already-in-use)."
          ) {
            toast.error("Email já está em uso");
          }
          if (error.message === "") {
            toast.error("");
          }
        });
    } else {
      return;
    }
  };

  handleSubmit = () => {
    let email = this.state.loginEmail;
    let senha = this.state.loginSenha;
    let errorTxt = "Preencha todos os campos para realizar o login.";

    let data = {
      email: email,
      senha: senha,
    };

    if (email === "" && senha === "") {
      toast.error(errorTxt);
    } else if (email === "" || senha === "") {
      toast.error(errorTxt);
    } else {
      signInWithEmailAndPassword(auth, email, senha)
        .then((result) => {
          if (result.accessToken !== "" || result.accessToken !== undefined) {
            API.verificaSenha(
              "VerificaSenha",
              `?email=${email}&senha=${senha}`
            ).then((verif) => {
              if (verif.status === 200) {
                this.props.login(data);
              } else {
                API.get(
                  "Cliente",
                  `?email=${email}&idFirebase=${result.user.uid}`
                ).then((cli) => {
                  var cliente = {
                    nome: cli.cliente.nome,
                    email: email,
                    senha: senha,
                    id_firebase: result.user.uid,
                  };
                  API.update("Cliente", "", cliente).then(() => {
                    this.props.login(data);
                  });
                });
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.message === "Firebase: Error (auth/invalid-email).") {
            toast.error("Email inválido");
          } else if (
            error.message === "Firebase: Error (auth/wrong-password)."
          ) {
            toast.error("Senha inválida");
          } else if ("FirebaseError: Firebase: Error (auth/user-not-found).") {
            toast.error("Usuário não encontrado");
          }
        });
    }
  };

  esqueceuAsenha = () => {
    let email = this.state.forgotEmail;

    sendPasswordResetEmail(auth, email)
      .then((result) => {
        toast.success(
          "Email enviado, vá até sua caixa de entrada para poder trocar a senha",
          {
            duration: 6000,
          }
        );
        this.setState({ cadastrado: true, forgot: false });
      })
      .catch((err) => {
        console.log(err);
        if (err === "FirebaseError: Firebase: Error (auth/user-not-found).") {
          toast.error("Usuário não encontrado");
        } else {
          toast.error("Erro");
        }
      });
  };

  componentDidMount = () => {
    this.setState({ cadastrado: true, forgot: false });
  };

  render() {
    const { restaurante, modoVk, cor3 } = this.props;
    const { cadastrado, forgot, forgotEmail } = this.state;

    return (
      <div className="divLogin">
        <div
          className="container-fluid containerLogin"
          style={{
            background: "white",
            borderRadius: "10px",
            padding: "5%",
            border: "1px solid rgba(0, 0, 0, 0.15)",
            boxShadow: "0 0 0.4em gray",
          }}
        >
          <div className="col-md-3">
            <button
              className="btn btn-default"
              style={{ borderRadius: "15px", padding: "7px 14px 7px 14px" }}
              onClick={() => window.history.back()}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-left"
                  viewBox="0 0 16 16"
                  style={{ marginTop: "5px" }}
                >
                  <path
                    fillRule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                  />
                </svg>
              </span>
            </button>
          </div>
          {forgot ? (
            <div className="row">
              <div className="col-md-6">
                <div className="col-sm-12 col-xs-12">
                  <div className="col-sm-3 col-xs-3"></div>
                  <div className="col-sm-6 col-xs-6">
                    <img
                      alt=""
                      src={modoVk === "ESTAB" ? restaurante.imagem : logo}
                      style={{
                        marginBottom: `${modoVk === "ESTAB" ? "15px" : ""}`,
                        borderRadius: "5px",
                        width: "100%",
                        height: "150px",
                        minWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className="col-sm-3 col-xs-3"></div>
                </div>
                {modoVk === "ESTAB" ? null : (
                  <div
                    className="col-sm-12 col-xs-12"
                    style={{ textAlign: "center", marginBottom: "10px" }}
                  >
                    <h1>
                      <b style={{ color: "#ff5722" }}>VemPraKa</b>
                    </h1>
                  </div>
                )}
                <label>Digite o email em que a conta foi cadastrada:</label>
                <input
                  type="text"
                  className="form-control input-lg input-xs"
                  placeholder="Digite seu email"
                  style={{ marginBottom: "15px" }}
                  onChange={(event) => {
                    this.setState({ forgotEmail: event.target.value });
                  }}
                  onKeyDown={(e) => {
                    if (forgotEmail !== "" && e.key === "Enter") {
                      this.esqueceuAsenha();
                    }
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  style={{
                    margin: "10px 0 10px 0",
                    background: modoVk === "ESTAB" ? cor3 : "#ff5722",
                    borderRadius: "50px",
                    border: "none",
                    boxShadow: "0 0 0.2em gray",
                  }}
                  disabled={forgotEmail === ""}
                  onClick={() => this.esqueceuAsenha()}
                  id="send"
                >
                  <b>Enviar</b>
                </button>
                <center>
                  <h4>
                    <a
                      onClick={() => this.setState({ forgot: false })}
                      style={{
                        color: "gray",
                        cursor: "pointer",
                        fontWeight: "bold",
                        border: "none",
                        background: "none",
                      }}
                    >
                      Voltar
                    </a>
                  </h4>
                </center>
              </div>
            </div>
          ) : cadastrado ? (
            <div className="row">
              <div className="col-md-6">
                <div className="col-sm-12 col-xs-12">
                  <div className="col-sm-3 col-xs-3"></div>
                  <div className="col-sm-6 col-xs-6">
                    <img
                      alt=""
                      src={modoVk === "ESTAB" ? restaurante.imagem : logo}
                      style={{
                        marginBottom: `${modoVk === "ESTAB" ? "15px" : ""}`,
                        borderRadius: "5px",
                        width: "100%",
                        height: "150px",
                        minWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className="col-sm-3 col-xs-3"></div>
                </div>
                {modoVk === "ESTAB" ? null : (
                  <div
                    className="col-sm-12 col-xs-12"
                    style={{ textAlign: "center", marginBottom: "10px" }}
                  >
                    <h1>
                      <b style={{ color: "#ff5722" }}>VemPraKa</b>
                    </h1>
                  </div>
                )}
                <h4 className="text-center">
                  Novo no{" "}
                  {modoVk === "ESTAB" ? restaurante.razao_social : "VemPraKa"}?
                  <a
                    onClick={this.naoCadastrado}
                    style={{
                      color: `${modoVk === "ESTAB" ? cor3 : "#ff5722"}`,
                      cursor: "pointer",
                      border: "none",
                      background: "none",
                    }}
                  >
                    {"  "}Cadastre-se
                  </a>
                </h4>
                <h5 className="text-center">
                  <a
                    style={{
                      color: "gray",
                      cursor: "pointer",
                      border: "none",
                      background: "none",
                    }}
                    onClick={() => this.setState({ forgot: true })}
                  >
                    esqueci a senha
                  </a>
                </h5>
                <label>Email:</label>
                <input
                  type="text"
                  className="form-control input-lg input-xs"
                  placeholder="Digite seu email"
                  style={{ marginBottom: "15px" }}
                  onChange={(event) => {
                    this.setState({ loginEmail: event.target.value });
                  }}
                />
                <label>Senha:</label>
                <input
                  type="password"
                  className="form-control input-lg input-xs"
                  placeholder="Digite sua senha"
                  style={{ marginBottom: "30px" }}
                  onChange={(event) => {
                    this.setState({ loginSenha: event.target.value });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      this.handleSubmit();
                    }
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  style={{
                    margin: "10px 0 10px 0",
                    background: `${modoVk === "ESTAB" ? cor3 : "#ff5722"}`,
                    borderRadius: "50px",
                    border: "none",
                    boxShadow: "0 0 0.2em gray",
                  }}
                  onClick={() => this.handleSubmit()}
                  id="send"
                >
                  <b>Entrar</b>
                </button>
                <div className="col-lg-4 col-xs-4">
                  <hr />
                </div>
                <div
                  className="col-lg-4 col-xs-4"
                  style={{ textAlign: "center" }}
                >
                  OU
                </div>
                <div className="col-lg-4 col-xs-4">
                  <hr />
                </div>
                <button
                  className="btn btn-default btn-lg btn-block"
                  style={{
                    marginTop: "9px",
                    background: "white",
                    borderRadius: "50px",
                    color: "black",
                    minHeight: "55px",
                    boxShadow: "0 0 0.2em gray",
                  }}
                  onClick={this.signInWithGoogle}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="25"
                    height="25"
                    viewBox="0 0 48 48"
                    style={{ fill: "#000000", marginRight: "10px" }}
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                  Entrar com Google
                </button>
                {/* OCULTANDO BOTÃO DO FACEBOOK */}
                {/* <button
                  className="btn btn-primary btn-lg btn-block"
                  style={{
                    marginTop: "9px",
                    background: "#3B5998",
                    borderRadius: "50px",
                    border: "none",
                    minHeight: "55px",
                    boxShadow: "0 0 0.2em gray",
                  }}
                  onClick={this.signInWithFacebook}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-facebook"
                    viewBox="0 0 16 16"
                    style={{ marginRight: "10px" }}
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                  Entrar com Facebook
                </button> */}
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-6">
                <div className="col-sm-12 col-xs-12">
                  <div className="col-sm-3 col-xs-3"></div>
                  <div className="col-sm-6 col-xs-6">
                    <img
                      alt=""
                      src={modoVk === "ESTAB" ? restaurante.imagem : logo}
                      style={{
                        marginBottom: `${modoVk === "ESTAB" ? "15px" : ""}`,
                        borderRadius: "5px",
                        width: "100%",
                        height: "150px",
                        minWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className="col-sm-3 col-xs-3"></div>
                </div>
                {modoVk === "ESTAB" ? null : (
                  <div
                    className="col-sm-12 col-xs-12"
                    style={{ textAlign: "center", marginBottom: "10px" }}
                  >
                    <h1>
                      <b style={{ color: "#ff5722" }}>VemPraKa</b>
                    </h1>
                  </div>
                )}
                <h4 className="text-center">
                  Você já tem uma conta?{" "}
                  <a
                    onClick={this.cadastrado}
                    style={{
                      color: `${modoVk === "ESTAB" ? cor3 : "#ff5722"}`,
                      cursor: "pointer",
                      border: "none",
                      background: "none",
                    }}
                  >
                    Fazer login
                  </a>
                </h4>
                <label>Nome:</label>
                <input
                  type="text"
                  className="form-control input-lg input-xs"
                  placeholder="Digite seu nome"
                  style={{ marginBottom: "15px" }}
                  onChange={(event) => {
                    this.setState({ registerNome: event.target.value });
                  }}
                />
                <label>Email:</label>
                <input
                  type="text"
                  className=" form-control input-lg input-xs"
                  placeholder="Digite seu email"
                  style={{ marginBottom: "15px" }}
                  onChange={(event) => {
                    this.setState({ registerEmail: event.target.value });
                  }}
                />
                <label>Senha:</label>
                <input
                  type="password"
                  className="form-control input-lg input-xs"
                  placeholder="Digite sua senha"
                  style={{ marginBottom: "15px" }}
                  onChange={(event) => {
                    this.setState({ registerSenha: event.target.value });
                  }}
                />
                <label>Confirme sua senha:</label>
                <input
                  type="password"
                  className="form-control input-lg input-xs"
                  placeholder="Confirme sua senha"
                  style={{ marginBottom: "15px" }}
                  onChange={(event) => {
                    this.setState({ registerConfirma: event.target.value });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      this.cadastra();
                    }
                  }}
                />
                <button
                  type="submit"
                  onClick={() => this.cadastra()}
                  className="btn btn-primary btn-lg btn-block"
                  style={{
                    margin: "10px 0 10px 0",
                    background: `${modoVk === "ESTAB" ? cor3 : "#ff5722"}`,
                    borderRadius: "50px",
                    border: "none",
                    boxShadow: "0 0 0.2em gray",
                  }}
                  id="send"
                >
                  <b>Cadastrar</b>
                </button>
                <div className="col-xs-4">
                  <hr />
                </div>
                <div className="col-xs-4" style={{ textAlign: "center" }}>
                  OU
                </div>
                <div className="col-xs-4">
                  <hr />
                </div>
                <button
                  className="btn btn-default btn-lg btn-block"
                  style={{
                    marginTop: "9px",
                    background: "white",
                    borderRadius: "50px",
                    color: "black",
                    minHeight: "55px",
                    boxShadow: "0 0 0.2em gray",
                  }}
                  onClick={this.signInWithGoogle}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="25"
                    height="25"
                    viewBox="0 0 48 48"
                    style={{ fill: "#000000", marginRight: "10px" }}
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                  Entrar com Google
                </button>
                {/* OCULTANDO BOTÃO DO FACEBOOK */}
                {/* <button
                  className="btn btn-primary btn-lg btn-block"
                  style={{
                    marginTop: "9px",
                    background: "#3B5998",
                    borderRadius: "50px",
                    border: "none",
                    minHeight: "55px",
                    boxShadow: "0 0 0.2em gray",
                  }}
                  onClick={this.signInWithFacebook}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-facebook"
                    viewBox="0 0 16 16"
                    style={{ marginRight: "10px" }}
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                  Entrar com Facebook
                </button> */}
              </div>
            </div>
          )}

          <div className="col-md-3"></div>
        </div>
      </div>
    );
  }
}

export default Login;
