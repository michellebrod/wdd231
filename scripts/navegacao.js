const botaoMenu = document.querySelector('#botao-menu');
const menuPrincipal = document.querySelector('#menu-principal');

botaoMenu.addEventListener('click', () => {
  const aberto = menuPrincipal.classList.toggle('aberto');
  botaoMenu.setAttribute('aria-expanded', String(aberto));
  botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  botaoMenu.textContent = aberto ? '✕' : '☰';
});
