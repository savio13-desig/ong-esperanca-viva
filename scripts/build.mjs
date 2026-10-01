// Build de produção: junta os módulos JS, minifica JS, CSS e HTML e copia as imagens para dist/
import { build } from 'esbuild';
import { minify } from 'html-minifier-terser';
import { readFile, writeFile, mkdir, cp, rm, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const SAIDA = 'dist';

await rm(SAIDA, { recursive: true, force: true });
await mkdir(`${SAIDA}/html`, { recursive: true });

// JS: o esbuild resolve os imports e gera um único arquivo minificado
await build({
  entryPoints: ['js/main.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2020',
  legalComments: 'none',
  outfile: `${SAIDA}/js/main.js`
});

// CSS: minificação (remove espaços, comentários e encurta valores)
await build({
  entryPoints: ['css/estilo.css'],
  minify: true,
  outfile: `${SAIDA}/css/estilo.css`
});

// HTML: remove comentários e espaços entre as tags
const opcoesHtml = { collapseWhitespace: true, removeComments: true, removeRedundantAttributes: true };
for (const arquivo of ['index.html', 'html/index.html']) {
  const original = await readFile(arquivo, 'utf8');
  await writeFile(`${SAIDA}/${arquivo}`, await minify(original, opcoesHtml));
}

// Imagens já estão otimizadas (WebP + JPG/PNG): só copia
await cp('imagens', `${SAIDA}/imagens`, { recursive: true });

// Relatório de tamanhos (bytes brutos e comprimidos com gzip)
async function tamanho(arquivos) {
  let bruto = 0;
  let gzip = 0;
  for (const a of arquivos) {
    const dados = await readFile(a);
    bruto += dados.length;
    gzip += gzipSync(dados).length;
  }
  return { bruto, gzip };
}

const modulos = (await readdir('js/modules')).map((f) => `js/modules/${f}`);
const grupos = {
  'JavaScript': { antes: ['js/main.js', ...modulos], depois: [`${SAIDA}/js/main.js`] },
  'CSS': { antes: ['css/estilo.css'], depois: [`${SAIDA}/css/estilo.css`] },
  'HTML': { antes: ['index.html', 'html/index.html'], depois: [`${SAIDA}/index.html`, `${SAIDA}/html/index.html`] }
};

console.log('Grupo        Antes (B)  Depois (B)  Redução   Gzip antes -> depois');
let totalAntes = 0;
let totalDepois = 0;
for (const [nome, { antes, depois }] of Object.entries(grupos)) {
  const a = await tamanho(antes);
  const d = await tamanho(depois);
  totalAntes += a.bruto;
  totalDepois += d.bruto;
  const reducao = (((a.bruto - d.bruto) / a.bruto) * 100).toFixed(1);
  console.log(`${nome.padEnd(12)} ${String(a.bruto).padStart(9)}  ${String(d.bruto).padStart(10)}  ${(reducao + '%').padStart(7)}   ${a.gzip} -> ${d.gzip}`);
}
console.log(`${'TOTAL'.padEnd(12)} ${String(totalAntes).padStart(9)}  ${String(totalDepois).padStart(10)}  ${((((totalAntes - totalDepois) / totalAntes) * 100).toFixed(1) + '%').padStart(7)}`);
