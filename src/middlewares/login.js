const validarLogin = (req, res, next) => {
  const { email, senha } = req.body;

  if (!email) {
    return res.status(400).json({ mensagem: "Por favor insira o email" })
  }

  if (!senha) {
    return res.status(400).json({ mensagem: "Por favor insira a senha" })
  }
  next()
}

module.exports = validarLogin
