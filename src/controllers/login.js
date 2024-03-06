const knex = require('../configs/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { senhaJWT } = require('../configs/env');

const login = async (req, res) => {

  const { email, senha } = req.body;

  try {
    const selecionarUsuario = await knex('usuarios').where({ email }).debug();

    console.log(selecionarUsuario)

    if (selecionarUsuario.length === 0) {
      return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." })
    }

    const senhaSalva = selecionarUsuario[0].senha;
    const validarSenha = await bcrypt.compare(senha, senhaSalva);

    if (!validarSenha) {
      return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." })
    }
    const token = jwt.sign({ id: selecionarUsuario[0].id }, senhaJWT);

    const usuario = {
      id: selecionarUsuario[0].id,
      nome: selecionarUsuario[0].nome,
      email: selecionarUsuario[0].email
    }
    return res.status(200).json({ usuario, token });
  }
  catch (error) {
    return res.status(500).json({ mensagem: "Erro de servidor" })
  }

}

module.exports = login;
