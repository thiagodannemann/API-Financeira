const pool = require('../configs/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cadastrar = (req, res) => {
  const { id, nome, email } = req.body;

  const usuarioCriado = {
    id, nome, email
  }

  return res.status(201).json(usuarioCriado)
}

const detalhar = async (req, res) => {
  const token = req.token;
  const { id: idUsuario } = jwt.decode(token);

  try {
    const query = `select * from usuarios where id = $1;`;
    const queryParams = [idUsuario];
    const { rows: resultado } = await pool.query(query, queryParams);

    const { senha: _, ...usuarioLogado } = resultado[0];

    return res.status(200).json(usuarioLogado);

  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro de servidor' })
  }
}

const atualizar = async (req, res) => {
  const { nome, email, senha } = req.body;
  const token = req.token;

  try {
    const queryEmail = `select * from usuarios where email = $1`;
    const queryParamsEmail = [email];

    const { rowCount: resultadoPorEmail } = await pool.query(queryEmail, queryParamsEmail);

    if (resultadoPorEmail) {
      return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' })
    }

    const senhaCodificada = await bcrypt.hash(senha, 10);
    const { id } = jwt.decode(token);

    const queryEditarUsuario = `update usuarios set nome = $1, email = $2, senha = $3 where id = $4`;
    const queryParamsEditarUsuario = [nome, email, senhaCodificada, id];

    const { rows: usuarioEditado } = pool.query(queryEditarUsuario, queryParamsEditarUsuario);

    return res.status(204).json();

  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro de servidor' })
  }

}

module.exports = { cadastrar, detalhar, atualizar }


