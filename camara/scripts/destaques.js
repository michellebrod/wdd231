const areaDestaques = document.querySelector('#destaques');
const statusDestaques = document.querySelector('#status-destaques');

function criarElemento(tag, classe, texto) {
  const item = document.createElement(tag);
  if (classe) item.className = classe;
  if (texto !== undefined) item.textContent = texto;
  return item;
}

function criarDestaque(membro) {
  const artigo = criarElemento('article', 'destaque-cartao');
  const imagem = document.createElement('img');
  imagem.src = `imagens/${membro.imagem}`;
  imagem.alt = `Identidade visual da empresa ${membro.nome}`;
  imagem.width = 480;
  imagem.height = 300;
  imagem.loading = 'lazy';
  artigo.append(imagem);
  const corpo = criarElemento('div', 'destaque-corpo');
  corpo.append(criarElemento('span', `nivel nivel-${membro.nivel}`, membro.nivel === 3 ? 'Ouro' : 'Prata'));
  corpo.append(criarElemento('h3', '', membro.nome));
  corpo.append(criarElemento('p', '', `Telefone: ${membro.telefone}`));
  corpo.append(criarElemento('p', '', `Endereço: ${membro.endereco}`));
  const link = criarElemento('a', '', 'Visitar site da empresa →');
  link.href = membro.site;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', `Visitar site de ${membro.nome}, abre em nova aba`);
  corpo.append(link);
  artigo.append(corpo);
  return artigo;
}

async function mostrarDestaques() {
  try {
    const resposta = await fetch('dados/membros.json');
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const membros = await resposta.json();
    if (!Array.isArray(membros)) throw new Error('Dados de membros inválidos');
    const elegiveis = membros.filter(membro => membro.nivel === 2 || membro.nivel === 3);
    // Fisher-Yates: embaralha os elegíveis antes de selecionar três.
    for (let i = elegiveis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [elegiveis[i], elegiveis[j]] = [elegiveis[j], elegiveis[i]];
    }
    const selecionados = elegiveis.slice(0, 3);
    areaDestaques.replaceChildren(...selecionados.map(criarDestaque));
    statusDestaques.textContent = selecionados.length ? '' : 'Nenhum associado prata ou ouro disponível.';
  } catch (erro) {
    console.error('Erro ao buscar destaques:', erro);
    statusDestaques.textContent = 'Não foi possível carregar os destaques. Acesse a página com o Live Server.';
  }
}

mostrarDestaques();
