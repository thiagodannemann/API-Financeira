const knex = require('../configs/conexao')
const jwt = require('jsonwebtoken')
const { senhaJWT } = require('../configs/env')

const listar = async (req, res) => {
  const token = req.token;
  const { id: usuarioId } = jwt.decode(token, senhaJWT);
  const { filtro } = req.query;

  try {
    if (filtro && filtro.length > 0) {
      const listarTransacoes = await knex.select(
        't.id',
        't.tipo',
        't.descricao',
        't.valor',
        't.data',
        't.usuario_id',
        't.categoria_id',
        'c.descricao AS categoria_nome'
      )
        .from('transacoes as t')
        .join('categorias as c', 't.categoria_id', 'c.id')
        .where('t.usuario_id', usuarioId)
        .whereIn('c.descricao', filtro);

      return res.status(200).json(listarTransacoes);

    } else {
      const listarTransacoes = await knex.select(
        't.id',
        't.tipo',
        't.descricao',
        't.valor',
        't.data',
        't.usuario_id',
        't.categoria_id',
        'c.descricao AS categoria_nome'
      )
        .from('transacoes as t')
        .join('categorias as c', 't.categoria_id', 'c.id')
        .where('t.usuario_id', usuarioId);

      return res.status(200).json(listarTransacoes);
    }


  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const listarPeloId = async (req, res) => {
  const { id: idTransacao } = req.params;
  const token = req.token;
  const { id: idUsuario } = jwt.decode(token, senhaJWT);

  try {
    const listarUsuarioPeloId = await knex.select(
      't.id',
      't.tipo',
      't.descricao',
      't.valor',
      't.data',
      't.usuario_id',
      't.categoria_id',
      'c.descricao AS categoria_nome'
    )
      .from('transacoes as t')
      .join('categorias as c', 't.categoria_id', 'c.id')
      .where('t.usuario_id', idUsuario)
      .andWhere('t.id', idTransacao);

    if (listarUsuarioPeloId.length === 0) {
      return res.status(404).json({ mensagem: 'Transação não encontrada.' })
    }
    return res.status(200).json(listarUsuarioPeloId);
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const inserir = async (req, res) => {
  const {
    descricao,
    valor,
    data,
    idCategoria,
    tipo,
    idUsuario } = req.body;

  try {
    const [registrarTransacao] = await knex('transacoes')
      .insert({
        descricao,
        valor,
        data,
        tipo,
        categoria_id: idCategoria,
        usuario_id: idUsuario
      })
      .returning('*');

    const [categoria] = await knex('categorias')
      .select('descricao as categoria_nome')
      .where('id', idCategoria);

    const transacaoInserida = {
      ...registrarTransacao, ...categoria
    }

    return res.status(201).json(transacaoInserida);

  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro de servidor' });
  }
}

const editar = async (req, res) => {
  const { id: idTransacao } = req.params;
  const {
    descricao,
    valor,
    data,
    idCategoria,
    tipo,
    idUsuario } = req.body;

  try {
    const transacaoEditada = await knex('transacoes')
      .update({
        descricao,
        valor,
        data,
        tipo,
        categoria_id: idCategoria,
        usuario_id: idUsuario
      })
      .where({ id: idTransacao })
      .returning(
        'id',
        'descricao',
        'valor',
        'data',
        'categoria_id',
        'tipo',
        'usuario_id'
      );

    if (transacaoEditada.length === 0) {
      return res.status(404).json({ mensagem: 'Não existe transação com esse ID para o usuário logado.' })
    }

    return res.status(201).json();
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro de servidor' });
  }
}

const deletar = async (req, res) => {
  const { id: idTransacao } = req.params;
  const token = req.token;
  const { id: idUsuario } = jwt.decode(token, senhaJWT);

  try {
    const deletarTransacao = await knex('transacoes')
      .where({ id: idTransacao, usuario_id: idUsuario })
      .del()
      .returning('*');

    if (deletarTransacao.length === 0) {
      return res.status(404).json({
        mensagem: 'Não foi encontrado nenhuma transação com esse ID para sua conta.'
      })
    }
    return res.status(204).json();
  }
  catch (error) {
    return res.status(500).json(error.message)
  }
}

const extrato = async (req, res) => {
  const token = req.token;
  const { id: idUsuario } = jwt.decode(token, senhaJWT)

  try {
    const exibirExtrato = await knex('transacoes')
      .select(
        knex.raw('SUM(CASE WHEN tipo = ? THEN valor ELSE 0 END) AS entrada', ['entrada']),
        knex.raw('SUM(CASE WHEN tipo = ? THEN valor ELSE 0 END) AS saida', ['saida'])
      )
      .where({ usuario_id: idUsuario });

    return res.status(200).json(exibirExtrato)
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro de servidor' })
  }
}

module.exports = { listar, listarPeloId, inserir, editar, deletar, extrato };