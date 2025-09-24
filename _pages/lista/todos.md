---
layout: archive
classes: default
permalink: /lista/todos
---

## Todos 📜
Os mesmos itens, em formato de lista.

<div id="lista-todas-categorias"></div>

<script>
const arquivos = [
  'geral', 'imagem', 'audio', 'video', 'pesquisa', 'educacao', 'roleplaying', 'interessantes', 'outros' 
];

const container = document.getElementById('lista-todas-categorias');

// Função para verificar se é um link "Voltar" com múltiplas verificações
function isVoltarLink(linkElement) {
  const text = linkElement.textContent || linkElement.innerText || '';
  const cleanText = text.trim().replace(/\s+/g, ' ');
  
  // Múltiplas verificações para capturar variações
  const voltarPatterns = [
    '⬅️ Voltar',
    '← Voltar',
    'Voltar',
    '⬅️Voltar',
    '←Voltar'
  ];
  
  return voltarPatterns.some(pattern => 
    cleanText === pattern || 
    cleanText.includes(pattern) ||
    cleanText.toLowerCase().includes('voltar')
  );
}

(async function() {
  for (const nome of arquivos) {
    try {
      const r = await fetch(`${nome}`);
      const md = await r.text();

      const temp = document.createElement('div');
      temp.innerHTML = md;

      // pega todos os títulos h2 e h3
      const headers = temp.querySelectorAll('h2, h3');
      if (headers.length === 0) continue;

      headers.forEach(header => {
        const secaoDiv = document.createElement('div');
        secaoDiv.style.marginBottom = '1rem';

        const titulo = document.createElement('h2');
        titulo.textContent = header.textContent;
        secaoDiv.appendChild(titulo);

        // pega os links na seção atual
        let el = header.nextElementSibling;
        while (el && !['H2','H3'].includes(el.tagName)) {
          const links = el.querySelectorAll('a');
          links.forEach(a => {
            // Verificação robusta para ignorar links "Voltar"
            if (!isVoltarLink(a)) {
              const div = document.createElement('div');
              const clone = a.cloneNode(true);
              // Garantir que tenha target="_blank" se não tiver
              if (!clone.hasAttribute('target')) {
                clone.setAttribute('target', '_blank');
              }
              div.appendChild(clone);
              secaoDiv.appendChild(div);
            }
          });
          el = el.nextElementSibling;
        }

        // Só adiciona a seção se ela tiver links (além do título)
        if (secaoDiv.children.length > 1) {
          container.appendChild(secaoDiv);
        }
      });

    } catch (err) {
      console.error('Erro ao processar', nome, err);
    }
  }
})();
</script>