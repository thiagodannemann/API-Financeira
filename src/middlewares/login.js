const pool = require('../configs/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { senhaJWT } = require('../configs/env');

const validarLogin = async (req, res, next) => {
  const { email, senha } = req.body;

  if (!email) {
    return res.status(400).json({ mensagem: "Por favor insira o email" })
  }

  if (!senha) {
    return res.status(400).json({ mensagem: "Por favor insira a senha" })
  }

  try {
    const query = `select * from usuarios where email = $1`;
    const queryParams = [email];
    const { rows: resultado, rowCount } = await pool.query(query, queryParams);

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." })
    }

    const senhaSalva = resultado[0].senha;

    console.log(`Senha salva: ${senhaSalva}`)

    const validarSenha = await bcrypt.compare(senha, senhaSalva);

    if (!validarSenha) {
      return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." })
    }

    const usuario = {
      id: resultado[0].id,
      nome: resultado[0].nome,
      email: resultado[0].email
    }

    req.body = usuario;

    next()

  }
  catch (error) {
    return res.status(500).json({ mensagem: "Erro de servidor" })
  }
}

module.exports = validarLogin
