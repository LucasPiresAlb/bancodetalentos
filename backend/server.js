const express = require('express');
const bodyParser = require('body-parser');
const app = express();
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
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});