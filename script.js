// Script para funcionalidades da plataforma

document.addEventListener('DOMContentLoaded', function() {
  // Carregar serviços na página de serviços
  if (document.getElementById('resultadosBusca')) {
    carregarServicos();
  }

  // Configurar campo de busca
  const campoBusca = document.getElementById('campoBusca');
  if (campoBusca) {
    campoBusca.addEventListener('input', function(e) {
      const termoBusca = e.target.value.trim();
      carregarServicos(termoBusca);
    });
  }

  // Configurar formulário de cadastro de serviços
  const formCadastro = document.getElementById('formCadastro');
  if (formCadastro) {
    formCadastro.addEventListener('submit', enviarFormularioServico);
  }
});

// Função para tratar o envio do formulário de serviço
async function enviarFormularioServico(event) {
  event.preventDefault();

  if (!verificarLogin()) {
    alert('Você precisa estar logado para cadastrar um serviço');
    window.location.href = 'login.html';
    return;
  }

  const form = event.target;
  const nome = form.querySelector('[name="nome"]').value;
  const categoria = form.querySelector('[name="categoria"]').value;
  const descricao = form.querySelector('[name="descricao"]').value;
  const preco = parseFloat(form.querySelector('[name="preco"]').value);
  const contato = form.querySelector('[name="contato"]').value;

  try {
    const usuario = getUsuarioLogado();
    const response = await fetch('/api/servicos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome,
        categoria,
        descricao,
        preco,
        contato,
        prestador: usuario ? usuario.nome : 'Anônimo'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao cadastrar serviço');
    }

    alert('Serviço cadastrado com sucesso!');
    form.reset();

    // Redirecionar para a página de serviços
    window.location.href = 'servicos.html';
  } catch (error) {
    console.error('Erro ao cadastrar serviço:', error);
    alert('Erro ao cadastrar serviço: ' + error.message);
  }
}

// Função para carregar serviços na página de serviços
async function carregarServicos(termo = '') {
  try {
    const resultadosBusca = document.getElementById('resultadosBusca');
    if (!resultadosBusca) return;

    resultadosBusca.innerHTML = ''; // Limpa os resultados anteriores

    // Mostrar loading state
    resultadosBusca.innerHTML = `
      <div class="col-span-3 flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    `;

    // Buscar dados do backend
    let url = '/api/servicos';
    if (termo) {
      url = `/api/servicos/busca?q=${encodeURIComponent(termo)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erro ao carregar serviços');
    }

    const servicos = await response.json();

    // Limpar loading state
    resultadosBusca.innerHTML = '';

    if (servicos.length === 0) {
      resultadosBusca.innerHTML = `
        <div class="col-span-3 text-center py-8">
          <p class="text-gray-500">Nenhum serviço encontrado</p>
        </div>
      `;
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
        <button class="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" 
          onclick="solicitarServico('${servico.objectId}')">
          Solicitar Serviço
        </button>
      `;
      resultadosBusca.appendChild(servicoDiv);
    });
  } catch (error) {
    console.error('Erro ao carregar serviços:', error);
    const resultadosBusca = document.getElementById('resultadosBusca');
    if (resultadosBusca) {
      resultadosBusca.innerHTML = `
        <div class="col-span-3 text-center py-8 text-red-500">
          <p>Erro ao carregar serviços. Tente novamente mais tarde.</p>
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

// Função para verificar se o usuário está logado via cookies - Usar a função do auth.js
// Não redefina esta função para evitar conflitos

// Função para obter dados do usuário logado
function getUsuarioLogado() {
  if (!verificarLogin()) return null;
  
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value;
    return acc;
  }, {});
  
  return {
    nome: cookies.usuarioNome,
    email: cookies.usuarioEmail,
    id: cookies.usuarioId
  };
}

// Função para proteger páginas
function protegerPagina() {
  const paginasProtegidas = [
    'cadastrodeservicos.html'
  ];
  
  const paginaAtual = window.location.pathname.split('/').pop();
  
  if (paginasProtegidas.includes(paginaAtual) && !verificarLogin()) {
    window.location.href = 'login.html';
  }
  
  // Atualizar a navegação em todas as páginas
  const cadastroServicosLink = document.getElementById('cadastroServicosLink');
  const loginLink = document.getElementById('loginLink');
  
  if (cadastroServicosLink && loginLink) {
    if (verificarLogin()) {
      // Usuário logado: mostrar link de cadastro de serviços e ocultar link de login
      cadastroServicosLink.classList.remove('hidden');
      loginLink.classList.add('hidden');
    } else {
      // Usuário não logado: ocultar link de cadastro de serviços e mostrar link de login
      cadastroServicosLink.classList.add('hidden');
      loginLink.classList.remove('hidden');
    }
  }
}