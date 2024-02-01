const pool = require('../configs/conexao');

const listar = async (req, res) => {
  try {
    const query = `select * from categorias`;

    const { rows: resultado } = await pool.query(query);

    return res.status(200).json(resultado)

  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro de servidor' })
  }
}

module.exports = { listar }