const express = require('express');
const bodyParser = require('body-parser');
const Parse = require('parse/node');
const app = express();

// Initialize Parse - Substitua com suas credenciais do Back4App
Parse.initialize('y1aydULfPeuhAEvlKqX08hT0j0Dyh9Djk5V7XcFI', 'MHmss0hWDsA2XMnIr8PVczLQXGksbU9e76y7LqGC');
Parse.serverURL = 'https://parseapi.back4app.com/';
app.use(express.static('.'));
app.use(bodyParser.json());

let servicos = [];

// API endpoints
// Definir classes no Parse
const Servico = Parse.Object.extend("Servico");
const Solicitacao = Parse.Object.extend("Solicitacao");
const Usuario = Parse.Object.extend("Usuario");

// Rota para cadastrar um serviço usando Parse
app.post('/api/servicos', async (req, res) => {
  try {
    const servico = new Servico();
    servico.set(req.body);
    await servico.save();
    res.status(201).json({ message: 'Serviço cadastrado com sucesso', id: servico.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para buscar serviços
app.get('/api/servicos/busca', async (req, res) => {
  try {
    const termo = req.query.q?.toLowerCase() || '';
    const query = new Parse.Query(Servico);
    
    // Busca em vários campos
    const nomeQuery = new Parse.Query(Servico);
    nomeQuery.matches('nome', new RegExp(termo, 'i'));
    
    const categoriaQuery = new Parse.Query(Servico);
    categoriaQuery.matches('categoria', new RegExp(termo, 'i'));
    
    const descricaoQuery = new Parse.Query(Servico);
    descricaoQuery.matches('descricao', new RegExp(termo, 'i'));
    
    // Combina todas as buscas
    query._orQuery([nomeQuery, categoriaQuery, descricaoQuery]);
    
    const resultados = await query.find();
    res.json(resultados.map(servico => servico.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para listar serviços
app.get('/servicos', async (req, res) => {
  try {
    const query = new Parse.Query(Servico);
    const servicos = await query.find();
    res.json(servicos.map(servico => servico.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para cadastrar um serviço
app.post('/servicos', async (req, res) => {
  try {
    const { nome, servico } = req.body;
    const novoServico = new Servico();
    novoServico.set('nome', nome);
    novoServico.set('servico', servico);
    await novoServico.save();
    res.json({ message: 'Serviço cadastrado com sucesso!', id: novoServico.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para listar solicitações
app.get('/solicitacoes', async (req, res) => {
  try {
    const query = new Parse.Query(Solicitacao);
    // Adiciona os detalhes do serviço na resposta
    query.include('servico');
    const solicitacoes = await query.find();
    res.json(solicitacoes.map(solicitacao => solicitacao.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para solicitar um serviço
app.post('/solicitacoes', async (req, res) => {
  try {
    const { cliente, servicoId } = req.body;
    
    // Busca o serviço pelo ID
    const servicoQuery = new Parse.Query(Servico);
    const servico = await servicoQuery.get(servicoId);
    
    const solicitacao = new Solicitacao();
    solicitacao.set('cliente', cliente);
    solicitacao.set('servico', servico);
    await solicitacao.save();
    
    res.json({ message: 'Serviço solicitado com sucesso!', id: solicitacao.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para Usuários
app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    const usuario = new Usuario();
    usuario.set('nome', nome);
    usuario.set('email', email);
    usuario.set('telefone', telefone);
    await usuario.save();
    res.json({ message: 'Usuário cadastrado com sucesso!', id: usuario.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const query = new Parse.Query(Usuario);
    const usuarios = await query.find();
    res.json(usuarios.map(usuario => usuario.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});