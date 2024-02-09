const pool = require('../configs/conexao')
const jwt = require('jsonwebtoken')
const { senhaJWT } = require('../configs/env')

const listar = async (req, res) => {
  const token = req.token;
  const { id } = jwt.decode(token, senhaJWT);
  const { filtro } = req.query;

  try {
    let query = `
    SELECT
      t.id,
      t.tipo,
      t.descricao,
      t.valor,
      t.data,
      t.usuario_id,
      t.categoria_id,
      c.descricao AS categoria_nome
    FROM
      transacoes t
    JOIN
      categorias c ON t.categoria_id = c.id
    WHERE
      t.usuario_id = $1`;

    const queryParams = [id];


    if (filtro && filtro.length > 0) {
      query += ` AND c.descricao IN (${filtro.map((_, index) => `$${index + 2}`).join(', ')})`;
      queryParams.push(...filtro);
    }

    const { rows: result } = await pool.query(query, queryParams);

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const listarPeloId = async (req, res) => {
  const { id: idTransacao } = req.params;
  const token = req.token;
  const { id: idUsuario } = jwt.decode(token, senhaJWT);

  try {
    const query = `
    SELECT
      t.id,
      t.tipo,
      t.descricao,
      t.valor,
      t.data,
      t.usuario_id,
      t.categoria_id,
      c.descricao AS categoria_nome
    FROM
      transacoes t
    JOIN
      categorias c ON t.categoria_id = c.id
    WHERE
      t.usuario_id = $1 AND t.id = $2;`;

    const queryParams = [idUsuario, idTransacao];

    const { rows: result, rowCount } = await pool.query(query, queryParams);

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: 'Transação não encontrada.' })
    }
    return res.status(200).json(result[0]);
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
    const query = `WITH transacao_registrada AS (
      INSERT INTO transacoes (
        descricao, valor, data, categoria_id, tipo, usuario_id
        )
      VALUES (
        $1, $2, $3, $4, $5, $6
        )
      RETURNING *
    )
    SELECT
      tr.id,
      tr.descricao,
      tr.valor,
      tr.data,
      tr.categoria_id,
      tr.tipo,
      tr.usuario_id,
      c.descricao AS categoria_nome
    FROM
      transacao_registrada tr
    JOIN
      categorias c ON tr.categoria_id = c.id`;

    const queryParams = [
      descricao,
      valor,
      data,
      idCategoria,
      tipo,
      idUsuario
    ];

    const { rows: result } = await pool.query(query, queryParams);

    return res.status(201).json(result[0]);
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
    const query = `WITH transacao_atualizada AS (
      UPDATE transacoes
      SET
        descricao = $1,
        valor = $2,
        data = $3,
        categoria_id = $4,
        tipo = $5,
        usuario_id = $6
      WHERE
        id = $7  -- Substitua pelo ID da transação que você deseja editar
      RETURNING 
        id, descricao, valor, data, categoria_id, tipo, usuario_id
      )
      SELECT
      ta.id,
      ta.descricao,
      ta.valor,
      ta.data,
      ta.categoria_id,
      ta.tipo,
      ta.usuario_id,
      c.descricao AS categoria_nome
    FROM
      transacao_atualizada ta
    JOIN
      categorias c ON ta.categoria_id = c.id;`;

    const queryParams = [
      descricao,
      valor,
      data,
      idCategoria,
      tipo,
      idUsuario,
      idTransacao
    ];

    const { rows: result, rowCount } = await pool.query(query, queryParams);

    if (rowCount === 0) {
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
    const query = `DELETE FROM transacoes
    WHERE id = $1 AND usuario_id = $2
    RETURNING *`;
    const queryParams = [idTransacao, idUsuario];
    const { rowCount } = await pool.query(query, queryParams);
    if (rowCount === 0) {
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
    const query = `SELECT
    SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) AS entrada,
    SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) AS saida
  FROM
    transacoes
  WHERE
    usuario_id = $1`;
    const queryParams = [idUsuario];
    const { rows: result } = await pool.query(query, queryParams);

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

module.exports = { listar, listarPeloId, inserir, editar, deletar, extrato };