# ONG Esperança Viva

Site institucional **fictício** de uma ONG, construído como Single Page Application (SPA) com HTML, CSS e JavaScript puros (Vanilla JS), sem frameworks nem dependências externas. O projeto foi desenvolvido como prática de front-end: Design System em CSS, roteamento no cliente, validação de formulários e persistência local.

## Visão geral

- Quatro telas sem recarregar a página: Início, Projetos, Cadastro e Cadastrados.
- Formulário de cadastro de voluntários e doadores, com validação (CPF, telefone, CEP e e-mail), máscaras de entrada e mensagens de erro acessíveis.
- Cadastros e rascunho do formulário guardados no `localStorage` do navegador.
- Layout responsivo com grid de 12 colunas e cinco breakpoints, menu com dropdown no desktop e hambúrguer no celular.

## Tecnologias

| Área | Tecnologia |
|---|---|
| Estrutura | HTML5 semântico |
| Estilo | CSS3: variáveis (Design System), Grid, Flexbox, `@media` |
| Lógica | JavaScript ES6+ com módulos (`import`/`export`) |
| Persistência | Web Storage (`localStorage`) |
| Versionamento | Git, GitFlow, Conventional Commits e SemVer |

## Pré-requisitos

- Um navegador atual (Chrome, Firefox ou Edge).
- [Git](https://git-scm.com/) para clonar o repositório.
- [Python 3](https://www.python.org/) (ou qualquer servidor HTTP estático) para servir os arquivos localmente.

Não há dependências para instalar: o projeto não usa `npm` nem etapa de build.

## Instalação e execução local

Os módulos ES **não funcionam abrindo o `index.html` com duplo clique** (`file://`), pois o navegador bloqueia por CORS. É preciso servir os arquivos por HTTP:

```bash
git clone <URL-DO-REPOSITORIO>
cd ong-esperanca-viva
python -m http.server 8000
```

Depois, abra `http://localhost:8000/` no navegador. A raiz redireciona para `html/index.html`.

## Estrutura de pastas

```
/
├── index.html            Redireciona a raiz para html/index.html
├── html/
│   └── index.html        Documento único da SPA
├── css/
│   └── estilo.css        Design System, layout, menu e componentes
├── imagens/              Logo e fotos, em JPG/PNG e WebP
└── js/
    ├── main.js           Ponto de entrada
    └── modules/
        ├── rotas.js          Roteador por hash
        ├── templates.js      Telas e componentes (Template Literals)
        ├── dados.js          Dados da aplicação
        ├── validacao.js      Máscaras e regras de validação
        ├── formulario.js     Eventos e envio do formulário
        ├── armazenamento.js  Acesso ao localStorage
        ├── feedback.js       Toast e alertas
        └── menu.js           Menu hambúrguer
```

## Testes e validação

Não há framework de testes automatizados. A qualidade é verificada assim:

```bash
# Verificar a sintaxe dos módulos JavaScript (requer Node.js)
node --check js/main.js
for f in js/modules/*.js; do node --check "$f"; done
```

- HTML e CSS validados nos validadores do W3C ([Markup](https://validator.w3.org/nu/) e [CSS](https://jigsaw.w3.org/css-validator/)).
- Testes manuais no navegador: troca de rotas, formulário vazio e inválido, recarregamento com restauração do rascunho e menu em 390 px.

## Acessibilidade

Uso de `lang`, textos `alt`, rótulos ligados aos campos, `aria-invalid` e `aria-describedby` nos erros, `aria-expanded` no menu, foco visível, contraste calculado pelo critério WCAG AA e `prefers-reduced-motion`.

## Versionamento

- **GitFlow:** `main` (somente lançamentos, com tags), `develop`, `feature/*`, `release/*` e `hotfix/*`.
- **Conventional Commits:** `feat`, `fix`, `chore` e `docs`, com escopo opcional.
- **Versionamento semântico:** `MAJOR.MINOR.PATCH`. Versões atuais: `v1.0.0` e `v1.0.1`.

Fluxo para contribuir: criar `feature/nome-da-funcionalidade` a partir de `develop`, fazer commits no padrão acima e abrir um pull request para `develop`.

## Limitações conhecidas

- Os dados do `localStorage` ficam em texto puro no navegador, sem criptografia, e servem só para demonstração. Em produção, dados pessoais (CPF, telefone) devem ir para um back-end seguro, em conformidade com a LGPD.
- O roteamento usa hash (`#/rota`) em vez do History API.

## Autoria

Projeto acadêmico. Os dados, o nome da ONG e as imagens são fictícios.
