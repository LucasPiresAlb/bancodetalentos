
// Função para verificar se o usuário está logado
function verificarLogin() {
  return localStorage.getItem('usuarioLogado') !== null;
}

// Função para salvar dados de login
function realizarLogin(email, senha) {
  // Verificar se existe algum usuário cadastrado
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  
  // Encontrar o usuário com o email e senha correspondentes
  const usuarioEncontrado = usuarios.find(
    usuario => usuario.email === email && usuario.senha === senha
  );
  
  if (usuarioEncontrado) {
    // Salvar usuário logado sem a senha
    const { senha, ...usuarioSemSenha } = usuarioEncontrado;
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSemSenha));
    return true;
  }
  
  return false;
}

// Função para realizar logout
function realizarLogout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'login.html';
}

// Função para obter dados do usuário logado
function getUsuarioLogado() {
  const usuario = localStorage.getItem('usuarioLogado');
  return usuario ? JSON.parse(usuario) : null;
}

// Redirecionar para login se não estiver autenticado em páginas protegidas
function protegerPagina() {
  const paginasProtegidas = [
    'cadastrodeservicos.html'
  ];
  
  const paginaAtual = window.location.pathname.split('/').pop();
  
  if (paginasProtegidas.includes(paginaAtual) && !verificarLogin()) {
    window.location.href = 'login.html';
  }
}

// Adicionar funções ao login na página de login
document.addEventListener('DOMContentLoaded', function() {
  // Executar proteção de página
  protegerPagina();
  
  // Verificar se é a página de login
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
      
      if (realizarLogin(email, senha)) {
        window.location.href = 'index.html';
      } else {
        const loginError = document.getElementById('loginError');
        loginError.textContent = 'Email ou senha incorretos!';
        loginError.classList.remove('hidden');
      }
    });
  }
  
  // Adicionar botão de logout e/ou nome do usuário no header se estiver logado
  const header = document.querySelector('header .container');
  if (header && verificarLogin()) {
    const usuario = getUsuarioLogado();
    const logoutContainer = document.createElement('div');
    logoutContainer.className = 'flex items-center space-x-2';
    
    const nomeSpan = document.createElement('span');
    nomeSpan.textContent = `Olá, ${usuario.nome}`;
    
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600';
    logoutBtn.textContent = 'Sair';
    logoutBtn.addEventListener('click', realizarLogout);
    
    logoutContainer.appendChild(nomeSpan);
    logoutContainer.appendChild(logoutBtn);
    
    header.appendChild(logoutContainer);
  }
});
async function cadastrarUsuario(nome, email, telefone) {
  // Simulação de uma requisição ao backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
}
async function carregarServicos() {
  const resultadosBusca = document.getElementById('resultadosBusca');
  resultadosBusca.innerHTML = ''; // Limpa os resultados anteriores

  // Simulação de uma requisição ao backend
  const servicos = [
    { nome: 'Jardinagem', descricao: 'Serviços de jardinagem', preco: 50 },
    { nome: 'Consertos', descricao: 'Consertos domésticos', preco: 100 },
  ];

  servicos.forEach(servico => {
    const servicoDiv = document.createElement('div');
    servicoDiv.className = 'border p-4 rounded shadow';
    servicoDiv.innerHTML = `
      <h3 class="text-lg font-bold">${servico.nome}</h3>
      <p class="text-gray-700">${servico.descricao}</p>
      <p class="text-gray-700">Preço: R$ ${servico.preco}</p>
    `;
    resultadosBusca.appendChild(servicoDiv);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  carregarServicos();
});
document.addEventListener('DOMContentLoaded', function() {
  if (verificarLogin()) {
    const usuario = getUsuarioLogado();
    const logoutContainer = document.createElement('div');
    logoutContainer.className = 'flex items-center space-x-2';

    const nomeSpan = document.createElement('span');
    nomeSpan.textContent = `Olá, ${usuario.nome}`;

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600';
    logoutBtn.textContent = 'Sair';
    logoutBtn.addEventListener('click', realizarLogout);

    logoutContainer.appendChild(nomeSpan);
    logoutContainer.appendChild(logoutBtn);

    const header = document.querySelector('header .container');
    header.appendChild(logoutContainer);
  }
});