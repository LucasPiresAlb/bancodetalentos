// Função para cadastrar serviço
document.getElementById('formCadastroServico')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const servico = {
    nome: document.getElementById('service-name').value,
    categoria: document.getElementById('service-category').value,
    descricao: document.getElementById('service-description').value,
    preco: parseFloat(document.getElementById('service-price').value)
  };

  try {
    const response = await fetch('/api/servicos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servico)
    });
    if (response.ok) {
      alert('Serviço cadastrado com sucesso!');
      location.reload();
    } else {
      alert('Erro ao cadastrar serviço');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao cadastrar serviço');
  }
});

// Função para buscar serviços
document.getElementById('formBuscaServico')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const termo = document.getElementById('search').value;
  try {
    const response = await fetch(`/api/servicos/busca?q=${encodeURIComponent(termo)}`);
    const servicos = await response.json();
    exibirResultados(servicos);
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao buscar serviços');
  }
});

function exibirResultados(servicos) {
  const container = document.getElementById('resultadosBusca');
  if (!container) return;
  
  container.innerHTML = servicos.map(servico => `
    <div class="border p-4 rounded shadow">
      <h3 class="text-lg font-bold">${servico.nome}</h3>
      <p class="text-gray-700">${servico.descricao}</p>
      <p class="text-blue-600 font-bold mt-2">R$ ${servico.preco.toFixed(2)}</p>
      <p class="text-gray-600">Categoria: ${servico.categoria}</p>
    </div>
  `).join('');
}

// Função para carregar serviços na página inicial
async function carregarServicos() {
  const response = await fetch('/servicos');
  const servicos = await response.json();
  const listaServicos = document.getElementById('servicos');
  listaServicos.innerHTML = servicos.map(servico => `
    <li class="list-group-item">${servico.nome} - ${servico.servico}</li>
  `).join('');
}

// Função para cadastrar um serviço
document.getElementById('formCadastro').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const servico = document.getElementById('servico').value;
  await fetch('/servicos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, servico }),
  });
  alert('Serviço cadastrado com sucesso!');
  window.location.href = 'index.html';
});

// Função para solicitar um serviço
document.getElementById('formSolicitacao').addEventListener('submit', async (e) => {
  e.preventDefault();
  const cliente = document.getElementById('cliente').value;
  const servico = document.getElementById('servico').value;
  await fetch('/solicitacoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente, servico }),
  });
  alert('Serviço solicitado com sucesso!');
  window.location.href = 'index.html';
});

// Carrega os serviços ao abrir a página
carregarServicos();