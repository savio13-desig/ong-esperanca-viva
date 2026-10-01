// Persistência no localStorage, sempre protegida por try/catch
const CHAVE_CADASTROS = 'esperancaviva:cadastros';
const CHAVE_RASCUNHO = 'esperancaviva:rascunho';

function ler(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch {
    return padrao;
  }
}

function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export const listarCadastros = () => ler(CHAVE_CADASTROS, []);

export function salvarCadastro(dados) {
  const lista = listarCadastros();
  lista.push({ ...dados, criadoEm: new Date().toISOString() });
  return gravar(CHAVE_CADASTROS, lista);
}

export function limparCadastros() {
  try {
    localStorage.removeItem(CHAVE_CADASTROS);
  } catch {
    /* sem armazenamento disponível */
  }
}

export const lerRascunho = () => ler(CHAVE_RASCUNHO, {});
export const salvarRascunho = (dados) => gravar(CHAVE_RASCUNHO, dados);

export function limparRascunho() {
  try {
    localStorage.removeItem(CHAVE_RASCUNHO);
  } catch {
    /* sem armazenamento disponível */
  }
}
