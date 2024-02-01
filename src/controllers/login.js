const pool = require('../configs/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { senhaJWT } = require('../configs/env');

const login = async (req, res) => {

  const { email, senha } = req.body;

  try {
    const query = `select * from usuarios where email = $1`;
    const queryParams = [email];
    const { rows: resultado, rowCount } = await pool.query(query, queryParams);

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." })
    }

    const senhaSalva = resultado[0].senha;
    const validarSenha = await bcrypt.compare(senha, senhaSalva);

    if (!validarSenha) {
      return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." })
    }
    const token = jwt.sign({ id: resultado[0].id }, senhaJWT);

    const usuario = {
      id: resultado[0].id,
      nome: resultado[0].nome,
      email: resultado[0].email
    }
    return res.status(200).json({ usuario, token });
  }
  catch (error) {
    console.log(error.message)
    return res.status(500).json({ mensagem: "Erro de servidor" })
  }

}

module.exports = login;
