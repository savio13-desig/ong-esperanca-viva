// Roteador por hash: troca o conteúdo de #app sem recarregar a página
import * as t from './templates.js';
import { iniciarFormulario } from './formulario.js';
import { listarCadastros, limparCadastros } from './armazenamento.js';

const rotas = {
  '/': { titulo: 'Início', tela: t.telaInicio },
  '/projetos': { titulo: 'Projetos', tela: t.telaProjetos },
  '/cadastro': { titulo: 'Cadastro', tela: t.telaCadastro, aoCarregar: iniciarFormulario },
  '/voluntarios': {
    titulo: 'Cadastrados',
    tela: () => t.telaVoluntarios(listarCadastros()),
    aoCarregar: () => {
      document.getElementById('limpar-cadastros')?.addEventListener('click', () => {
        limparCadastros();
        renderizar();
      });
    }
  }
};

const app = () => document.getElementById('app');
const caminhoAtual = () => location.hash.replace(/^#/, '') || '/';

// moverFoco é falso só no carregamento inicial, para o link "Pular para o conteúdo" ser o primeiro Tab
export function renderizar(moverFoco = true) {
  const caminho = caminhoAtual();
  const rota = rotas[caminho];

  app().innerHTML = rota ? rota.tela() : t.telaNaoEncontrada();
  document.title = `${rota ? rota.titulo : 'Página não encontrada'} | ONG Esperança Viva`;

  document.querySelectorAll('[data-rota]').forEach((link) => {
    if (link.dataset.rota === caminho) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  rota?.aoCarregar?.();
  // Acessibilidade: nas trocas de tela, leva o foco ao conteúdo novo e volta ao topo
  if (moverFoco) {
    app().focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

export function iniciarRotas() {
  window.addEventListener('hashchange', () => renderizar(true));
  renderizar(false);
}
