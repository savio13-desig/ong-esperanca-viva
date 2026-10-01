// Máscaras e regras de validação do formulário
export const mascaras = {
  cpf: (v) => v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'),
  tel: (v) => v.replace(/\D/g, '').slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2'),
  cep: (v) => v.replace(/\D/g, '').slice(0, 8)
    .replace(/^(\d{5})(\d)/, '$1-$2')
};

export function cpfValido(valor) {
  const n = valor.replace(/\D/g, '');
  if (n.length !== 11 || /^(\d)\1+$/.test(n)) return false;
  const digito = (base) => {
    let soma = 0;
    for (let i = 0; i < base; i++) soma += Number(n[i]) * (base + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(n[9]) && digito(10) === Number(n[10]);
}

const regras = {
  nome: (v) => v.trim().split(/\s+/).length >= 2 || 'Informe nome e sobrenome.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Informe um e-mail válido, como nome@dominio.com.',
  nasc: (v) => (v !== '' && new Date(v) < new Date()) || 'Informe uma data de nascimento válida.',
  cpf: (v) => cpfValido(v) || 'CPF inválido. Use o formato 000.000.000-00.',
  tel: (v) => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(v) || 'Use o formato (11) 90000-0000.',
  cep: (v) => /^\d{5}-\d{3}$/.test(v) || 'Use o formato 00000-000.',
  end: (v) => v.trim().length >= 5 || 'Informe o endereço completo.',
  cidade: (v) => v.trim().length >= 2 || 'Informe a cidade.',
  uf: (v) => v !== '' || 'Selecione o estado.',
  papel: (v) => v !== '' || 'Escolha como quer participar.',
  lgpd: (v) => v === 'on' || 'É necessário aceitar a política de privacidade.'
};

// Valida um único campo e devolve a mensagem de erro ('' quando válido)
export function validarCampo(campo, valor) {
  const resultado = regras[campo]?.(String(valor ?? ''));
  return resultado === true || resultado === undefined ? '' : resultado;
}

// Valida o formulário inteiro e devolve { campo: 'mensagem' }
export function validar(dados) {
  const erros = {};
  for (const campo of Object.keys(regras)) {
    const mensagem = validarCampo(campo, dados[campo]);
    if (mensagem) erros[campo] = mensagem;
  }
  return erros;
}
