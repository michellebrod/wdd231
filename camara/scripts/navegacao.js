const botaoMenu = document.querySelector('#botao-menu');
const menuPrincipal = document.querySelector('#menu-principal');
if (botaoMenu && menuPrincipal) {
  botaoMenu.addEventListener('click', () => {
    const aberto = menuPrincipal.classList.toggle('abrir');
    botaoMenu.setAttribute('aria-expanded', String(aberto));
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    botaoMenu.textContent = aberto ? '×' : '☰';
  });
  window.matchMedia('(min-width: 48rem)').addEventListener('change', e => {
    if (e.matches) {
      menuPrincipal.classList.remove('abrir');
      botaoMenu.setAttribute('aria-expanded', 'false');
      botaoMenu.setAttribute('aria-label', 'Abrir menu de navegação');
      botaoMenu.textContent = '☰';
    }
  });
}
