const knex = require('../configs/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const cadastrarUsuario = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada }).returning('*')

    console.log(cadastrarUsuario)

    const { senha: _, ...usuarioCriado } = cadastrarUsuario[0];

    return res.status(201).json(usuarioCriado);

  } catch (error) {
    if (error.message == "insert into \"usuarios\" (\"email\", \"nome\", \"senha\") values ($1, $2, $3) returning * - duplicar valor da chave viola a restrição de unicidade \"usuarios_email_key\"") {
      return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' })
    }
    return res.status(500).json({ mensagem: error.message })
  }
}

const detalhar = async (req, res) => {
  const token = req.token;
  const { id: idUsuario } = jwt.decode(token);

  try {
    const detalharUsuario = await knex('usuarios')
      .select('*')
      .where({ id: idUsuario })
      .debug();


    const { senha: _, ...usuarioLogado } = detalharUsuario[0];

    return res.status(200).json(usuarioLogado);

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ mensagem: 'Erro de servidor' })
  }
}

const atualizar = async (req, res) => {
  const { nome, email, senha } = req.body;
  const token = req.token;

  try {
    const selecionarUsuarioPeloEmail = await knex('usuarios')
      .select('*')
      .where({ email });

    if (selecionarUsuarioPeloEmail.length > 0) {
      return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' })
    }

    const senhaCodificada = await bcrypt.hash(senha, 10);
    const { id } = jwt.decode(token);

    const usuarioEditado = await knex('usuarios')
      .update({ nome, email, senha: senhaCodificada })
      .where({ id })
      .returning('*');

    return res.status(204).json();

  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro de servidor' })
  }

}

module.exports = { cadastrar, detalhar, atualizar }


