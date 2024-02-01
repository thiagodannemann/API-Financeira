const validarCadastro = (req, res, next) => {
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

  req.body = { nome, email, senha };

  next();
}

module.exports = validarCadastro;
