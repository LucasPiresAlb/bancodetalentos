const express = require('express');
const bodyParser = require('body-parser');
const Parse = require('parse/node');
const cors = require('cors');
const app = express();

// Initialize Parse - Substitua com suas credenciais do Back4App
Parse.initialize('y1aydULfPeuhAEvlKqX08hT0j0Dyh9Djk5V7XcFI', 'MHmss0hWDsA2XMnIr8PVczLQXGksbU9e76y7LqGC');
Parse.serverURL = 'https://parseapi.back4app.com/';

// Middleware
app.use(cors()); // Adicionar CORS para permitir requisições do frontend
app.use(express.static('.'));
app.use(bodyParser.json());

// API endpoints
// Definir classes no Parse
const Servico = Parse.Object.extend("Servico");
const Solicitacao = Parse.Object.extend("Solicitacao");
const Usuario = Parse.Object.extend("Usuario");

// Padronizar todas as rotas com prefixo /api
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
    const termo = req.query.q || '';

    if (termo === '') {
      // Se não há termo de busca, retorna todos os serviços
      const query = new Parse.Query(Servico);
      const resultados = await query.find();
      return res.json(resultados.map(servico => servico.toJSON()));
    }

    // Busca em vários campos
    const nomeQuery = new Parse.Query(Servico);
    nomeQuery.matches('nome', new RegExp(termo, 'i'));

    const categoriaQuery = new Parse.Query(Servico);
    categoriaQuery.matches('categoria', new RegExp(termo, 'i'));

    const descricaoQuery = new Parse.Query(Servico);
    descricaoQuery.matches('descricao', new RegExp(termo, 'i'));

    // Combina todas as buscas
    const query = Parse.Query.or([nomeQuery, categoriaQuery, descricaoQuery]);

    const resultados = await query.find();
    res.json(resultados.map(servico => servico.toJSON()));
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para listar todos os serviços - manter para compatibilidade e padronizar
app.get('/api/servicos', async (req, res) => {
  try {
    const query = new Parse.Query(Servico);
    const servicos = await query.find();
    res.json(servicos.map(servico => servico.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manter rota antiga para compatibilidade
app.get('/servicos', async (req, res) => {
  try {
    const query = new Parse.Query(Servico);
    const servicos = await query.find();
    res.json(servicos.map(servico => servico.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para cadastrar um serviço - versão antiga - manter para compatibilidade
app.post('/servicos', async (req, res) => {
  try {
    const { nome, descricao, preco, categoria } = req.body;
    const novoServico = new Servico();
    novoServico.set('nome', nome);
    novoServico.set('descricao', descricao);
    novoServico.set('preco', preco);
    if (categoria) novoServico.set('categoria', categoria);
    await novoServico.save();
    res.json({ message: 'Serviço cadastrado com sucesso!', id: novoServico.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para listar solicitações
app.get('/api/solicitacoes', async (req, res) => {
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

// Manter rota antiga para compatibilidade
app.get('/solicitacoes', async (req, res) => {
  try {
    const query = new Parse.Query(Solicitacao);
    query.include('servico');
    const solicitacoes = await query.find();
    res.json(solicitacoes.map(solicitacao => solicitacao.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para solicitar um serviço
app.post('/api/solicitacoes', async (req, res) => {
  try {
    const { cliente, servicoId } = req.body;

    if (!cliente || !servicoId) {
      return res.status(400).json({ error: 'Cliente e serviço são obrigatórios' });
    }

    // Busca o serviço pelo ID
    const servicoQuery = new Parse.Query(Servico);
    const servico = await servicoQuery.get(servicoId);

    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    const solicitacao = new Solicitacao();
    solicitacao.set('cliente', cliente);
    solicitacao.set('servico', servico);
    await solicitacao.save();

    res.json({ message: 'Serviço solicitado com sucesso!', id: solicitacao.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manter rota antiga para compatibilidade
app.post('/solicitacoes', async (req, res) => {
  try {
    const { cliente, servicoId } = req.body;

    if (!cliente || !servicoId) {
      return res.status(400).json({ error: 'Cliente e serviço são obrigatórios' });
    }

    // Busca o serviço pelo ID
    const servicoQuery = new Parse.Query(Servico);
    const servico = await servicoQuery.get(servicoId);

    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

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
app.post('/api/usuarios', async (req, res) => {
  try {
    const { nome, email, telefone, senha } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    // Verificar se o email já existe
    const emailQuery = new Parse.Query(Usuario);
    emailQuery.equalTo('email', email);
    const emailExiste = await emailQuery.first();

    if (emailExiste) {
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }

    const usuario = new Usuario();
    usuario.set('nome', nome);
    usuario.set('email', email);
    usuario.set('telefone', telefone || '');
    if (senha) {
      // Em um ambiente de produção, você usaria um método de hash seguro como bcrypt
      // Para esta demonstração, armazenamos a senha diretamente
      usuario.set('senha', senha);
    }
    await usuario.save();

    res.json({ message: 'Usuário cadastrado com sucesso!', id: usuario.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manter rota antiga para compatibilidade
app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, telefone, senha } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    // Verificar se o email já existe
    const emailQuery = new Parse.Query(Usuario);
    emailQuery.equalTo('email', email);
    const emailExiste = await emailQuery.first();

    if (emailExiste) {
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }

    const usuario = new Usuario();
    usuario.set('nome', nome);
    usuario.set('email', email);
    usuario.set('telefone', telefone || '');
    if (senha) {
      // Em um ambiente de produção, você usaria um método de hash seguro como bcrypt
      // Para esta demonstração, armazenamos a senha diretamente
      usuario.set('senha', senha);
    }
    await usuario.save();

    res.json({ message: 'Usuário cadastrado com sucesso!', id: usuario.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar usuários
app.get('/api/usuarios', async (req, res) => {
  try {
    const query = new Parse.Query(Usuario);
    const usuarios = await query.find();
    // Remover senhas da resposta
    const usuariosSemSenha = usuarios.map(usuario => {
      const data = usuario.toJSON();
      delete data.senha;
      return data;
    });
    res.json(usuariosSemSenha);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para login
app.post('/api/usuarios/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    console.log('Tentativa de login - Email:', email);

    if (!email || !senha) {
      console.log('Login falhou: Email ou senha não fornecidos');
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Verificar se o usuário existe
    const query = new Parse.Query(Usuario);
    query.equalTo('email', email);
    const usuario = await query.first();

    if (!usuario) {
      console.log('Login falhou: Usuário não encontrado');
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Obtém a senha armazenada
    const senhaSalva = usuario.get('senha');

    // Garantir que a senha seja uma string
    const senhaStr = String(senha);


    // Verifica se as senhas coincidem
    console.log('Senha armazenada:', senhaSalva, 'tipo:', typeof senhaSalva);
    console.log('Senha enviada:', senhaStr, 'tipo:', typeof senhaStr);

    // Compara as senhas de forma mais flexível
    const senhaSalvaStr = String(senhaSalva).trim();
    const senhaStrLimpa = senhaStr.trim();
    
    if (senhaSalvaStr !== senhaStrLimpa) {
      console.log('Login falhou: Senha incorreta');
      console.log(`Senha salva: "${senhaSalvaStr}" (${typeof senhaSalvaStr})`);
      console.log(`Senha enviada: "${senhaStrLimpa}" (${typeof senhaStrLimpa})`);
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Remover senha dos dados do usuário
    const usuarioData = usuario.toJSON();
    delete usuarioData.senha;

    console.log('Login bem-sucedido para:', email);
    res.json({ 
      message: 'Login realizado com sucesso',
      usuario: usuarioData
    });
  } catch (error) {
    console.error('Erro no processo de login:', error);
    res.status(500).json({ error: error.message });
  }
});

// Manter rota antiga para compatibilidade
app.get('/usuarios', async (req, res) => {
  try {
    const query = new Parse.Query(Usuario);
    const usuarios = await query.find();
    // Remover senhas da resposta
    const usuariosSemSenha = usuarios.map(usuario => {
      const data = usuario.toJSON();
      delete data.senha;
      return data;
    });
    res.json(usuariosSemSenha);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});