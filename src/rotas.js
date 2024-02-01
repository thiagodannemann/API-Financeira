const express = require('express');
const rotas = express();

const usuario = require('./controllers/usuario');
const categoria = require('./controllers/categoria')
const login = require('./controllers/login');
const { autenticar } = require('./middlewares/autenticacao');
const validarCadastro = require('./middlewares/usuario');
const validarLogin = require('./middlewares/login');


rotas.post('/usuario', validarCadastro, usuario.cadastrar);

rotas.post('/login', validarLogin, login);

rotas.use(autenticar);
rotas.get('/usuario', usuario.detalhar);
rotas.put('/usuario', usuario.atualizar);

rotas.get('/categoria', categoria.listar);

rotas.get('/transacao')

module.exports = rotas;
