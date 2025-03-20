const response = await fetch('/api/usuarios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ 
    nome, 
    email, 
    telefone, 
    senha // Esta variável deve ser uma string
  }),
});// Função para verificar se o usuário está logado via cookies ou localStorage
function verificarLogin() {
  const logadoCookie = document.cookie.includes('usuarioLogado=true');
  const logadoLocal = localStorage.getItem('usuarioLogado') === 'true';
  const logado = logadoCookie || logadoLocal;
  console.log("Verificando login - Cookie:", logadoCookie, "LocalStorage:", logadoLocal);
  return logado;
}

// Função para salvar dados de login
async function realizarLogin(email, senha) {
  try {
    // Garantir que a senha seja uma string
    const senhaStr = String(senha);
    
    // Login direto com a senha como string
    console.log('Tentando login com email:', email);
    
    const response = await fetch('/api/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email: email, 
        senha: senhaStr
      })
    });

    const data = await response.json();
    console.log('Resposta do servidor:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Credenciais inválidas');
    }

    // Definir cookies com configurações SameSite e Secure
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    
    // Garantir que os cookies são definidos corretamente
    document.cookie = `usuarioLogado=true; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax`;
    document.cookie = `usuarioNome=${encodeURIComponent(data.usuario.nome)}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax`;
    document.cookie = `usuarioEmail=${encodeURIComponent(data.usuario.email)}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax`;
    document.cookie = `usuarioId=${encodeURIComponent(data.usuario.objectId)}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax`;

    console.log('Login bem-sucedido! Cookies definidos:', document.cookie);
    
    // Verificar se o cookie foi definido
    if (!document.cookie.includes('usuarioLogado=true')) {
      console.error('Falha ao definir cookies. Tentando método alternativo de armazenamento.');
      // Usar localStorage como fallback
      localStorage.setItem('usuarioLogado', 'true');
      localStorage.setItem('usuarioNome', data.usuario.nome);
      localStorage.setItem('usuarioEmail', data.usuario.email);
      localStorage.setItem('usuarioId', data.usuario.objectId);
    }
    
    // Atualizar interface imediatamente após login
    atualizarInterfaceLogin();
    
    return true;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return false;
  }
}

// Função para realizar logout
function realizarLogout() {
  // Remover cookies
  document.cookie = 'usuarioLogado=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'usuarioNome=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'usuarioEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'usuarioId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  // Remover localStorage também
  localStorage.removeItem('usuarioLogado');
  localStorage.removeItem('usuarioNome');
  localStorage.removeItem('usuarioEmail');
  localStorage.removeItem('usuarioId');
  
  console.log('Logout realizado, cookies e localStorage limpos');

  // Redirecionar para a página de login
  window.location.href = 'login.html';
}

// Função para obter dados do usuário logado
function getUsuarioLogado() {
  if (!verificarLogin()) return null;

  // Tentar obter dos cookies primeiro
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value;
    return acc;
  }, {});

  // Se tem nos cookies, usar esses dados
  if (cookies.usuarioNome) {
    return {
      nome: decodeURIComponent(cookies.usuarioNome || ''),
      email: decodeURIComponent(cookies.usuarioEmail || ''),
      id: decodeURIComponent(cookies.usuarioId || '')
    };
  }

  // Caso contrário, usar localStorage
  return {
    nome: localStorage.getItem('usuarioNome') || '',
    email: localStorage.getItem('usuarioEmail') || '',
    id: localStorage.getItem('usuarioId') || ''
  };
}

// Função para cadastrar um usuário
async function cadastrarUsuario(nome, email, telefone, senha) {
  try {
    const response = await fetch('/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        nome, 
        email, 
        telefone, 
        senha 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao cadastrar usuário');
    }

    return data;
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    throw error;
  }
}

// Atualizar interface baseado no status de login
function atualizarInterfaceLogin() {
  const isLogado = verificarLogin();
  console.log("Atualizando interface - Status de login:", isLogado);
  
  const cadastroServicosLink = document.getElementById('cadastroServicosLink');
  const loginLink = document.getElementById('loginLink');

  if (isLogado) {
    // Usuário logado
    console.log("Usuário está logado, atualizando interface");
    
    // Mostrar link de cadastro de serviços
    if (cadastroServicosLink) {
      cadastroServicosLink.classList.remove('hidden');
    }
    
    // Esconder link de login
    if (loginLink) {
      loginLink.classList.add('hidden');
    }

    // Adicionar botão de logout
    const usuario = getUsuarioLogado();
    if (usuario) {
      const nome = usuario.nome || 'Usuário';
      console.log("Usuário logado:", nome);
      
      // Garantir que o header está disponível
      const header = document.querySelector('header .container');
      if (!header) return;
      
      // Remover qualquer botão de logout existente para evitar duplicação
      const existingLogout = document.querySelector('.logout-btn');
      if (existingLogout) {
        existingLogout.parentElement.remove();
      }
      
      // Criar e adicionar o botão de logout
      const logoutContainer = document.createElement('div');
      logoutContainer.className = 'flex items-center space-x-2 ml-4';
      logoutContainer.id = 'logoutContainer';

      const nomeSpan = document.createElement('span');
      nomeSpan.textContent = `Olá, ${nome}`;

      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 logout-btn';
      logoutBtn.textContent = 'Sair';
      logoutBtn.addEventListener('click', realizarLogout);

      logoutContainer.appendChild(nomeSpan);
      logoutContainer.appendChild(logoutBtn);

      header.appendChild(logoutContainer);
      console.log("Botão de logout adicionado");
    }
  } else {
    // Usuário não logado
    console.log("Usuário não está logado");
    if (cadastroServicosLink) cadastroServicosLink.classList.add('hidden');
    if (loginLink) loginLink.classList.remove('hidden');
    
    // Remover botão de logout se existir
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
      const container = logoutBtn.closest('#logoutContainer') || logoutBtn.parentElement;
      if (container) container.remove();
    }
  }
}

// Garantir que a interface seja atualizada quando a página carregar
window.addEventListener('load', function() {
  console.log('Página carregada, verificando status de login');
  setTimeout(atualizarInterfaceLogin, 100); // Pequeno delay para garantir carregamento completo
});

// Proteger páginas restritas
function protegerPagina() {
  const paginasProtegidas = ['cadastrodeservicos.html'];
  const paginaAtual = window.location.pathname.split('/').pop();

  if (paginasProtegidas.includes(paginaAtual) && !verificarLogin()) {
    window.location.href = 'login.html';
  }
}

// Inicializar em todas as páginas
document.addEventListener('DOMContentLoaded', function() {
  atualizarInterfaceLogin();
  protegerPagina();
});


// Adicionar funções ao login na página de login
document.addEventListener('DOMContentLoaded', function() {
  // Executar proteção de página
  protegerPagina();

  // Verificar se é a página de login
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', async function() {
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      try {
        if (await realizarLogin(email, senha)) {
          window.location.href = 'index.html';
        } else {
          const loginError = document.getElementById('loginError');
          loginError.textContent = 'Email ou senha incorretos!';
          loginError.classList.remove('hidden');
        }
      } catch (error) {
        const loginError = document.getElementById('loginError');
        loginError.textContent = error.message || 'Erro ao fazer login';
        loginError.classList.remove('hidden');
      }
    });
  }
});

async function carregarServicos(termoBusca = '') {
  try {
    const resultadosBusca = document.getElementById('resultadosBusca');
    if (!resultadosBusca) return;

    resultadosBusca.innerHTML = '<div class="col-span-3 flex justify-center items-center py-8"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>';

    let url = '/api/servicos';
    if (termoBusca) {
      url = `/api/servicos/busca?q=${encodeURIComponent(termoBusca)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    const servicos = await response.json();
    resultadosBusca.innerHTML = '';

    if (servicos.length === 0) {
      resultadosBusca.innerHTML = '<div class="col-span-3 text-center py-8"><p class="text-gray-500">Nenhum serviço encontrado</p></div>';
      return;
    }

    servicos.forEach(servico => {
      const servicoDiv = document.createElement('div');
      servicoDiv.className = 'border p-4 rounded shadow';
      servicoDiv.innerHTML = `
        <h3 class="text-lg font-bold">${servico.nome || 'Sem nome'}</h3>
        <p class="text-gray-700">${servico.descricao || 'Sem descrição'}</p>
        <p class="text-gray-700">Preço: R$ ${servico.preco || 'Não informado'}</p>
        ${servico.categoria ? `<p class="text-gray-500 text-sm">Categoria: ${servico.categoria}</p>` : ''}
        <button class="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onclick="solicitarServico('${servico.objectId}')">Solicitar Serviço</button>
      `;
      resultadosBusca.appendChild(servicoDiv);
    });
  } catch (error) {
    console.error('Erro ao carregar serviços:', error);
    const resultadosBusca = document.getElementById('resultadosBusca');
    if (resultadosBusca) {
      resultadosBusca.innerHTML = `
        <div class="col-span-3 text-center py-8 text-red-500">
          <p>Erro ao carregar serviços: ${error.message}</p>
        </div>
      `;
    }
  }
}

// Função para solicitar um serviço
async function solicitarServico(servicoId) {
  if (!verificarLogin()) {
    alert('Você precisa estar logado para solicitar um serviço');
    window.location.href = 'login.html';
    return;
  }
  
  try {
    const usuario = getUsuarioLogado();
    const response = await fetch('/api/solicitacoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cliente: usuario.nome,
        servicoId: servicoId
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao solicitar serviço');
    }
    
    alert('Serviço solicitado com sucesso!');
  } catch (error) {
    console.error('Erro ao solicitar serviço:', error);
    alert('Erro ao solicitar serviço: ' + error.message);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  carregarServicos();
});