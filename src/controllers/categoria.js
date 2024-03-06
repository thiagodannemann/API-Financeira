const knex = require('../configs/conexao');

const listar = async (req, res) => {
  try {
    const listarCategoria = await knex('categorias')

    return res.status(200).json(listarCategoria)

  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro de servidor' })
  }
}

module.exports = { listar }
