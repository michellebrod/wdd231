
const courses = [
  { subject: 'CSEPC', number: 110, title: 'Introdução à Programação', credits: 2, completed: true },
  { subject: 'WDD', number: 130, title: 'Fundamentos da Web', credits: 2, completed: true },
  { subject: 'CSE', number: 111, title: 'Programação com Funções', credits: 2, completed: true },
  { subject: 'CSE', number: 210, title: 'Programação com Classes', credits: 2, completed: false },
  { subject: 'WDD', number: 131, title: 'Fundamentos da Web Dinâmica', credits: 2, completed: false },
  { subject: 'WDD', number: 231, title: 'Desenvolvimento Frontend para Web I', credits: 2, completed: false }
];

const listaCursos = document.querySelector('#lista-cursos');
const totalCreditos = document.querySelector('#total-creditos');
const botoesFiltro = document.querySelectorAll('[data-filtro]');

function exibirCursos(filtro = 'Todos') {
  const exibidos = filtro === 'Todos' ? courses : courses.filter(curso => curso.subject === filtro);
  listaCursos.replaceChildren();
  exibidos.forEach(curso => {
    const cartao = document.createElement('div');
    cartao.className = `curso${curso.completed ? ' concluido' : ''}`;
    cartao.textContent = `${curso.subject} ${curso.number}${curso.completed ? ' ✓' : ''}`;
    cartao.title = `${curso.title} — ${curso.credits} créditos — ${curso.completed ? 'Concluído' : 'Pendente'}`;
    cartao.setAttribute('aria-label', cartao.title);
    listaCursos.appendChild(cartao);
  });
  const total = exibidos.reduce((soma, curso) => soma + curso.credits, 0);
  totalCreditos.textContent = `Total de créditos dos cursos exibidos: ${total}`;
}

botoesFiltro.forEach(botao => {
  botao.addEventListener('click', () => {
    botoesFiltro.forEach(item => {
      const selecionado = item === botao;
      item.classList.toggle('ativo', selecionado);
      item.setAttribute('aria-pressed', String(selecionado));
    });
    exibirCursos(botao.dataset.filtro);
  });
});

exibirCursos();
