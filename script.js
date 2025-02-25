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