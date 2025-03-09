const express = require('express');
const bodyParser = require('body-parser');
const Parse = require('parse/node');
const app = express();

// Initialize Parse
Parse.initialize('Bla1Fahz77xNKorxfqFnuIljp4OISFoFBQihbEUU', 'wQNgoICzd90CKGaCEzwG2dF33ePjYDiJbNxWo7lm');
Parse.serverURL = 'mongodb://admin:pcjpGlsjCCZzMoWVEsFb74Hy@MongoS3601A.back4app.com:27017/2b5ef6e8c11b4d02baed0945ddb6dea2';
app.use(express.static('.'));
app.use(bodyParser.json());

let servicos = [];

// API endpoints
app.post('/api/servicos', (req, res) => {
  const servico = req.body;
  servicos.push(servico);
  res.status(201).json({ message: 'Serviço cadastrado com sucesso' });
});

app.get('/api/servicos/busca', (req, res) => {
  const termo = req.query.q?.toLowerCase() || '';
  const resultados = servicos.filter(servico => 
    servico.nome.toLowerCase().includes(termo) ||
    servico.categoria.toLowerCase().includes(termo) ||
    servico.descricao.toLowerCase().includes(termo)
  );
  res.json(resultados);
});
let solicitacoes = [];

// Rota para listar serviços
app.get('/servicos', (req, res) => {
  res.json(servicos);
});

// Rota para cadastrar um serviço
app.post('/servicos', (req, res) => {
  const { nome, servico } = req.body;
  servicos.push({ nome, servico });
  res.json({ message: 'Serviço cadastrado com sucesso!' });
});

// Rota para listar solicitações
app.get('/solicitacoes', (req, res) => {
  res.json(solicitacoes);
});

// Rota para solicitar um serviço
app.post('/solicitacoes', (req, res) => {
  const { cliente, servico } = req.body;
  solicitacoes.push({ cliente, servico });
  res.json({ message: 'Serviço solicitado com sucesso!' });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});