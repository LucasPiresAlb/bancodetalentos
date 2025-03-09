
// Função para buscar serviços
async function buscarServicos(termo = '') {
  try {
    const resposta = await fetch(`/api/servicos/busca?q=${termo}`);
    const servicos = await resposta.json();
    exibirResultados(servicos);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
  }
}

// Verificar se estamos na página de busca
document.addEventListener('DOMContentLoaded', function() {
  const campoBusca = document.getElementById('campoBusca');
  if (campoBusca) {
    campoBusca.addEventListener('input', function() {
      buscarServicos(this.value);
    });
    
    // Carregar todos os serviços ao iniciar
    buscarServicos();
  }
});

function exibirResultados(servicos) {
  const container = document.getElementById('resultadosBusca');
  if (!container) return;
  
  if (servicos.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center">Nenhum serviço encontrado</p>';
    return;
  }
  
  container.innerHTML = servicos.map(servico => `
    <div class="border p-4 rounded shadow">
      <h3 class="text-lg font-bold">${servico.nome || ''}</h3>
      <p class="text-gray-700">${servico.descricao || servico.servico || ''}</p>
      <p class="text-blue-600 font-bold mt-2">R$ ${(servico.preco || 0).toFixed(2)}</p>
      <p class="text-gray-600">Categoria: ${servico.categoria || 'Não especificada'}</p>
      <button class="bg-blue-600 text-white px-4 py-2 rounded mt-4" 
              onclick="solicitarServico('${servico.objectId}')">
        Solicitar Serviço
      </button>
    </div>
  `).join('');
}

// Função para solicitar um serviço
async function solicitarServico(servicoId) {
  const cliente = prompt('Por favor, informe seu nome para solicitar o serviço:');
  if (!cliente) return;
  
  try {
    const resposta = await fetch('/solicitacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente, servicoId }),
    });
    
    const resultado = await resposta.json();
    alert(resultado.message);
  } catch (error) {
    console.error('Erro ao solicitar serviço:', error);
    alert('Erro ao solicitar serviço. Tente novamente mais tarde.');
  }
}

// Função para carregar serviços na página inicial
async function carregarServicos() {
  try {
    const response = await fetch('/servicos');
    const servicos = await response.json();
    const listaServicos = document.getElementById('servicos');
    
    if (listaServicos) {
      listaServicos.innerHTML = servicos.length > 0 
        ? servicos.map(servico => `
            <li class="list-group-item">${servico.nome || ''} - ${servico.servico || ''}</li>
          `).join('')
        : '<li class="list-group-item">Nenhum serviço disponível</li>';
    }
  } catch (error) {
    console.error('Erro ao carregar serviços:', error);
  }
}

// Função para cadastrar um serviço
document.addEventListener('DOMContentLoaded', function() {
  const formCadastro = document.getElementById('formCadastro');
  
  if (formCadastro) {
    formCadastro.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(formCadastro);
      const dados = {};
      
      formData.forEach((value, key) => {
        dados[key] = value;
      });
      
      try {
        const resposta = await fetch('/servicos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados),
        });
        
        const resultado = await resposta.json();
        alert(resultado.message);
        formCadastro.reset();
        window.location.href = 'servicos.html';
      } catch (error) {
        console.error('Erro ao cadastrar serviço:', error);
        alert('Erro ao cadastrar serviço. Tente novamente mais tarde.');
      }
    });
  }
  
  // Carregar serviços se estiver na página inicial
  const paginaInicial = document.getElementById('servicos');
  if (paginaInicial) {
    carregarServicos();
  }
});
