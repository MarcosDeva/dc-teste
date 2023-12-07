const apiGatepeeker = process.env.REACT_APP_API_GATEKEEPER;
const api = process.env.REACT_APP_API;

// Generate a unique token for storing your bookshelf data on the backend server.
let token = localStorage.token;
if (!token)
  token = localStorage.token = Math.random()
    .toString(36)
    .substr(-8);

let headers = {
  Accept: "application/json",
  Authorization: "Bearer " + token,
};

export const getToken = (table) =>
  fetch(`${apiGatepeeker}/${table}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        localStorage.token = token = data.token;
        headers = {
          Accept: "application/json",
          Authorization: "Bearer " + data.token,
          "Content-Type": "application/json",
        };
      }
      return data;
    });

export const getCategorias = () =>
  fetch(`${api}/Categorias`, { headers })
    .then((res) => res.json())
    .then((data) => data);

export const getEndereco = (cep) =>
  fetch(`https://viacep.com.br/ws/${cep}/json/`, {})
    .then((res) => res.json())
    .then((data) => data);

export const getEstabelecimentos = () =>
  fetch(`${api}/Estabelecimento`, { headers })
    .then((res) => res.json())
    .then((data) => data);

export const getEstabelecimentosCEP = (cep) =>
  fetch(`${api}/Estabelecimento?cep=${cep}`, { headers })
    .then((res) => res.json())
    .then((data) => data);

export const getCardapio = (idEstabelecimento) =>
  fetch(`${api}/produto?id_estabelecimento=${idEstabelecimento}`, { headers })
    .then((res) => res.json())
    .then((data) => data);

export const verificaSenha = (table, where) =>
  fetch(`${api}/${table}${where}`, { headers });

export const get = (table, where) =>
  fetch(`${api}/${table}${where}`, { headers })
    .then((res) => res.json())
    .then((data) => data);

export const update = (table, where, content) =>
  fetch(`${api}/${table}${where}`, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  }).then((res) => res.json());

export const add = (table, value) =>
  fetch(`${api}/${table}`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
  })
    .then((res) => res.json())
    .then((data) => data);

export const postEndereco = (endereco) =>
  fetch(`${api}/ClienteEndereco`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(endereco),
  });

export const cancelaPedido = (table, value) =>
  fetch(`${api}/${table}`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
  });

export const deleteEndereco = (idCliente, cep, numero, cidade) =>
  fetch(
    `${api}/ClienteEndereco?idCliente=${idCliente}&cep=${cep}&numero=${numero}&cidade=${cidade}`,
    {
      method: "DELETE",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    }
  );

export const getTaxa = (idEstabelecimento, bairro, cep) =>
  fetch(
    `${api}/Taxa?id_estabelecimento=${idEstabelecimento}&bairro=${bairro}&cep=${cep}`,
    { headers }
  )
    .then((res) => res.json())
    .then((data) => data);
