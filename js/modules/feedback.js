// Componentes de feedback: toast e alertas
let temporizador;

export function mostrarToast(mensagem) {
  const toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.classList.add('visivel');
  clearTimeout(temporizador);
  temporizador = setTimeout(() => toast.classList.remove('visivel'), 4000);
}

export function alerta(tipo, mensagem) {
  const papel = tipo === 'erro' ? 'alert' : 'status';
  return `<div class="alerta alerta--${tipo}" role="${papel}"><p>${mensagem}</p></div>`;
}
