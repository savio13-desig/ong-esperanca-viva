// Sistema de templates: cada função devolve o HTML de uma tela ou componente
import { projetos, estados } from './dados.js';

// Escapa texto vindo do usuário para evitar XSS ao usar innerHTML
export const esc = (texto) => String(texto).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const imagem = (nome, alt, largura, altura, extra = '') =>
  `<picture><source srcset="../imagens/${nome}.webp" type="image/webp"><img src="../imagens/${nome}.jpg" alt="${alt}" width="${largura}" height="${altura}" ${extra}></picture>`;

export const cartaoProjeto = (p) => `
<article class="col-12 col-md-6 col-lg-4">
${imagem(p.imagem, p.alt, 600, 400, 'loading="lazy"')}
<h3>${esc(p.titulo)}</h3>
<p>${esc(p.texto)}</p>
</article>`;

export const telaInicio = () => `
<section id="apresentacao">
<h1>ONG Esperança Viva</h1>
<p>Transformamos vidas por meio de educação, alimentação e cultura em comunidades da zona sul de São Paulo.</p>
${imagem('voluntarios-oficina', 'Ilustração de formas em tons de verde e laranja que representa a oficina de voluntários', 1200, 675)}
</section>
<div class="grid-12">
<section class="col-12 col-md-6">
<h2>Nossa missão</h2>
<p>Garantir acesso a oportunidades para crianças e famílias em situação de vulnerabilidade.</p>
</section>
<section class="col-12 col-md-6">
<h2>Fale com a gente</h2>
<address>
<p>Rua das Flores, 123, São Paulo, SP</p>
<p>Telefone: <a href="tel:+551100000000">(11) 0000-0000</a></p>
<p>E-mail: <a href="mailto:contato@esperancaviva.org.br">contato@esperancaviva.org.br</a></p>
</address>
</section>
</div>`;

export const telaProjetos = () => `
<h1>Nossos projetos</h1>
<section>
<h2>Frentes de atuação</h2>
<div class="grid-12">${projetos.map(cartaoProjeto).join('')}</div>
</section>
<section>
<h2>Como ser voluntário</h2>
<ol>
<li>Preencha o <a href="#/cadastro">cadastro</a>.</li>
<li>Participe da conversa de boas-vindas.</li>
<li>Escolha a frente em que quer atuar.</li>
</ol>
</section>`;

const campo = (id, rotulo, atributos = '') => `
<label for="${id}">${rotulo}</label>
<input id="${id}" name="${id}" ${atributos} aria-describedby="erro-${id}">
<p class="campo-erro" id="erro-${id}"></p>`;

export const telaCadastro = () => `
<h1>Cadastro de voluntários e doadores</h1>
<div id="mensagem-form" aria-live="polite"></div>
<form id="form-cadastro" novalidate>
<fieldset>
<legend>Dados pessoais</legend>
${campo('nome', 'Nome completo', 'type="text" autocomplete="name"')}
${campo('email', 'E-mail', 'type="email" autocomplete="email"')}
${campo('nasc', 'Data de nascimento', 'type="date"')}
${campo('cpf', 'CPF', 'type="text" inputmode="numeric" maxlength="14" placeholder="000.000.000-00"')}
${campo('tel', 'Telefone', 'type="tel" placeholder="(11) 90000-0000"')}
</fieldset>
<fieldset>
<legend>Endereço</legend>
${campo('end', 'Endereço', 'type="text" autocomplete="address-line1"')}
${campo('cep', 'CEP', 'type="text" inputmode="numeric" maxlength="9" placeholder="00000-000"')}
${campo('cidade', 'Cidade', 'type="text"')}
<label for="uf">Estado</label>
<select id="uf" name="uf" aria-describedby="erro-uf">
<option value="">Selecione</option>
${estados.map(([sigla, nome]) => `<option value="${sigla}">${nome}</option>`).join('')}
</select>
<p class="campo-erro" id="erro-uf"></p>
</fieldset>
<fieldset>
<legend>Interesse na ONG</legend>
<label class="opcao"><input type="radio" name="papel" value="voluntario"> Quero ser voluntário</label>
<label class="opcao"><input type="radio" name="papel" value="doador"> Quero ser doador</label>
<p class="campo-erro" id="erro-papel"></p>
<label class="opcao"><input type="checkbox" name="lgpd"> Aceito a política de privacidade (LGPD)</label>
<p class="campo-erro" id="erro-lgpd"></p>
</fieldset>
<button type="submit">Enviar cadastro</button>
</form>`;

const itemCadastro = (r) => `
<li><strong>${esc(r.nome)}</strong>
<span class="badge ${r.papel === 'doador' ? 'badge--doacao' : 'badge--voluntario'}">${r.papel === 'doador' ? 'Doador' : 'Voluntário'}</span>
<br><span>${esc(r.email)} · ${esc(r.cidade)}/${esc(r.uf)}</span></li>`;

export const telaVoluntarios = (registros) => `
<h1>Cadastros recebidos</h1>
${registros.length === 0
    ? '<p>Nenhum cadastro salvo neste navegador ainda.</p>'
    : `<ul class="lista-cadastros">${registros.map(itemCadastro).join('')}</ul>
<button type="button" class="botao botao--sec" id="limpar-cadastros">Limpar cadastros</button>`}`;

export const telaNaoEncontrada = () => `
<h1>Página não encontrada</h1>
<p>Esse endereço não existe. <a href="#/">Voltar ao início</a>.</p>`;
