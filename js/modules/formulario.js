// Comportamento do formulário de cadastro: máscaras, validação, rascunho e envio
import { mascaras, validar, validarCampo } from './validacao.js';
import { salvarCadastro, salvarRascunho, lerRascunho, limparRascunho } from './armazenamento.js';
import { mostrarToast, alerta } from './feedback.js';

const CAMPOS_TEXTO = ['nome', 'email', 'nasc', 'cpf', 'tel', 'end', 'cep', 'cidade', 'uf'];

function lerDados(form) {
  const dados = Object.fromEntries(new FormData(form).entries());
  return dados;
}

function mostrarErro(form, campo, mensagem) {
  const alvo = document.getElementById(`erro-${campo}`);
  if (alvo) alvo.textContent = mensagem;
  const entrada = form.elements[campo];
  const controles = entrada instanceof RadioNodeList ? [...entrada] : [entrada];
  controles.filter(Boolean).forEach((c) => c.setAttribute('aria-invalid', mensagem ? 'true' : 'false'));
}

function restaurarRascunho(form) {
  const rascunho = lerRascunho();
  for (const campo of CAMPOS_TEXTO) {
    if (rascunho[campo]) form.elements[campo].value = rascunho[campo];
  }
}

export function iniciarFormulario() {
  const form = document.getElementById('form-cadastro');
  const mensagem = document.getElementById('mensagem-form');
  restaurarRascunho(form);

  form.addEventListener('input', (e) => {
    const { name } = e.target;
    if (mascaras[name]) e.target.value = mascaras[name](e.target.value);
    // Rascunho: guarda só campos de texto, nunca o aceite da LGPD
    salvarRascunho(Object.fromEntries(CAMPOS_TEXTO.map((c) => [c, form.elements[c].value])));
  });

  // Feedback ao sair do campo (blur) e ao alterar opções
  form.addEventListener('focusout', (e) => {
    const { name, value } = e.target;
    if (CAMPOS_TEXTO.includes(name)) mostrarErro(form, name, validarCampo(name, value));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dados = lerDados(form);
    const erros = validar(dados);
    for (const campo of [...CAMPOS_TEXTO, 'papel', 'lgpd']) mostrarErro(form, campo, erros[campo] ?? '');

    const primeiro = Object.keys(erros)[0];
    if (primeiro) {
      mensagem.innerHTML = alerta('erro', `Corrija ${Object.keys(erros).length} campo(s) antes de enviar.`);
      const foco = form.elements[primeiro];
      (foco instanceof RadioNodeList ? foco[0] : foco).focus();
      return;
    }

    const { lgpd, ...registro } = dados;
    if (!salvarCadastro(registro)) {
      mensagem.innerHTML = alerta('erro', 'Não foi possível salvar neste navegador. Verifique o armazenamento.');
      return;
    }
    limparRascunho();
    form.reset();
    mensagem.innerHTML = alerta('sucesso', 'Cadastro enviado com sucesso. Obrigado por ajudar!');
    mostrarToast('Cadastro salvo!');
  });
}
