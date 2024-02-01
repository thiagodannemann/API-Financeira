const pool = require('../configs/conexao');
const bcrypt = require('bcrypt');

const validarCadastro = async (req, res, next) => {
  const { nome, email, senha } = req.body;

  if (!nome) {
    return res.status(400).json({ mensagem: "Por favor insira o nome" })
  }

  if (!email) {
    return res.status(400).json({ mensagem: "Por favor insira o email" })
  }

  if (!senha) {
    return res.status(400).json({ mensagem: "Por favor insira a senha" })
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query = `insert into usuarios (nome, email, senha)
    values ($1, $2, $3) returning *`;

    const queryParams = [nome, email, senhaCriptografada];

    const { rows: resultado } = await pool.query(query, queryParams);

    const { senha: _, ...usuarioCriado } = resultado[0];

    req.body = usuarioCriado;

    next();

  } catch (error) {
    if (error.message === 'duplicar valor da chave viola a restrição de unicidade "usuarios_email_key"') {
      return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." })
    }
    console.log(error.message)
    return res.status(500).json({ mensagem: 'Erro de servidor' })
  }
}

module.exports = validarCadastro;