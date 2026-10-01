// Menu hambúrguer (telas pequenas); o dropdown do desktop funciona só com CSS
export function iniciarMenu() {
  const botao = document.querySelector('.menu-botao');
  const menu = document.getElementById('menu');

  function definir(aberto) {
    menu.classList.toggle('aberto', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
  }

  botao.addEventListener('click', () => definir(!menu.classList.contains('aberto')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') definir(false);
  });
  // Ao navegar em tela pequena, o menu fecha sozinho
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) definir(false);
  });
}
