const jwt = require('jsonwebtoken')
const { senhaJWT } = require('../configs/env');

const autenticar = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      mensagem: 'Para acessar esse recurso um token de autenticação válido deve ser enviado'
    })
  }
  const token = authorization.split(' ')[1];

  try {
    const validarToken = jwt.verify(token, senhaJWT)

    req.token = token;

    next();
  } catch (error) {
    return res.status(401).json({
      mensagem: 'Token não valido'
    })
  }
}

module.exports = { autenticar }