const jwt = require('jsonwebtoken');
const { senhaJWT } = require('../configs/env');

const validarTransacao = (req, res, next) => {
  const { descricao, valor, data, categoria_id: idCategoria, tipo } = req.body;
  const token = req.token;
  const { id: idUsuario } = jwt.decode(token, senhaJWT);

  if (!descricao) {
    return res.status(400).json({ mensagem: 'Por favor insira a descrição' })
  }
  if (!valor) {
    return res.status(400).json({ mensagem: 'Por favor insira o valor' })
  }
  if (!data) {
    return res.status(400).json({ mensagem: 'Por favor insira a data' })
  }
  if (!idCategoria) {
    return res.status(400).json({ mensagem: 'Por favor insira o id da categoria' })
  }
  if (!tipo) {
    return res.status(400).json({ mensagem: 'Por favor insira o tipo: entrada ou saída' })
  }

  req.body = {
    descricao,
    valor,
    data,
    idCategoria,
    tipo,
    idUsuario
  }

  next()
}

module.exports = validarTransacao;