const jwt = require('jsonwebtoken');
const { senhaJWT } = require('../configs/env');

const login = (req, res) => {
  const { id, nome, email } = req.body;

  const usuario = {
    id,
    nome,
    email
  }

  const token = jwt.sign({ id }, senhaJWT);

  return res.status(200).json({ usuario, token });
}

module.exports = login;