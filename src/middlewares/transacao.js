const jwt = require('jsonwebtoken');
const { senhaJWT } = require('../configs/env');

const validarTransacao = (req, res, next) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const token = req.token;
  const { id: id_usuario } = jwt.decode(token, senhaJWT);

  if (!descricao) {
    return res.status(400).json({ mensagem: 'Por favor insira a descrição' })
  }
  if (!valor) {
    return res.status(400).json({ mensagem: 'Por favor insira o valor' })
  }
  if (!data) {
    return res.status(400).json({ mensagem: 'Por favor insira a data' })
  }
  if (!categoria_id) {
    return res.status(400).json({ mensagem: 'Por favor insira o id da categoria' })
  }
  if (!tipo) {
    return res.status(400).json({ mensagem: 'Por favor insira o tipo: entrada ou saída' })
  }

  req.body = {
    descricao,
    valor,
    data,
    categoria_id,
    tipo,
    id_usuario
  }

  next()
}

module.exports = validarTransacao;