const areaMembros = document.querySelector('#membros');
const statusMembros = document.querySelector('#status-membros');
const botoesVisualizacao = document.querySelectorAll('[data-visualizacao]');

function criarTexto(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  elemento.textContent = texto;
  return elemento;
}

function criarCartao(membro) {
  const artigo = document.createElement('article');
  artigo.className = 'cartao';
  const imagem = document.createElement('img');
  imagem.src = `imagens/${membro.imagem}`;
  imagem.alt = `Identidade visual de ${membro.nome}`;
  imagem.loading = 'lazy';
  imagem.width = 480;
  imagem.height = 300;
  artigo.append(imagem);

  const corpo = criarTexto('div', 'cartao-conteudo', '');
  corpo.append(criarTexto('h3', '', membro.nome));
  corpo.append(criarTexto('p', 'segmento', membro.segmento));
  const rotulos = {1:'Membro',2:'Prata',3:'Ouro'};
  corpo.append(criarTexto('span', `nivel nivel-${membro.nivel}`, rotulos[membro.nivel] || 'Membro'));
  corpo.append(criarTexto('p', 'descricao', membro.descricao));
  corpo.append(criarTexto('p', 'endereco', membro.endereco));
  corpo.append(criarTexto('p', 'telefone', membro.telefone));
  const link = criarTexto('a', 'site-membro', 'Visitar site');
  link.href = membro.site;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', `Visitar site de ${membro.nome} (abre em nova aba)`);
  corpo.append(link);
  artigo.append(corpo);
  return artigo;
}

async function carregarMembros() {
  try {
    const resposta = await fetch('dados/membros.json');
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const membros = await resposta.json();
    if (!Array.isArray(membros)) throw new Error('Formato de dados inválido');
    areaMembros.replaceChildren(...membros.map(criarCartao));
    statusMembros.textContent = `${membros.length} empresas no diretório.`;
  } catch (erro) {
    console.error('Não foi possível carregar o diretório:', erro);
    statusMembros.textContent = 'Não foi possível carregar as empresas. Abra o projeto com o Live Server e tente novamente.';
  }
}

botoesVisualizacao.forEach(botao => {
  botao.addEventListener('click', () => {
    const modo = botao.dataset.visualizacao;
    areaMembros.classList.toggle('lista', modo === 'lista');
    botoesVisualizacao.forEach(item => item.setAttribute('aria-pressed', String(item === botao)));
  });
});

carregarMembros();
