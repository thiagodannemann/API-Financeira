create database dindin;

create table usuarios (
  id serial primary key,
  nome varchar(50) not null,
  email varchar(50) not null unique,
  senha varchar(50) not null);

create table categorias (
  id serial primary key,
  descricao varchar(50) not null);
  
  create table transacoes (
    id serial primary key,
    descricao varchar(50) not null,
    valor integer not null,
    data date not null,
    categoria_id integer not null references categorias(id),
    usuario_id integer not null references usuarios(id),
    tipo varchar(50) not null
    );

	insert into categorias (descricao) values 
('Alimentacao'),('Assinaturas e Serviços'),('Casa'), ('Mercado'),('Cuidados Pessoais'),
('Educação'),('Família'),('Lazer'),('Pets'),('Presentes'),('Roupas'),('Saúde'), ('Transporte'),
('Salário'), ('Vendas'),('Outras receitas'),('Outras despesas');
