document.addEventListener("DOMContentLoaded", function () {
  var gridItems = document.querySelectorAll('.grid-item a');

  // Lista de favicons personalizados (identificador -> URL da imagem)
  var customFavicons = {
      "wan.video": "/assets/img/icons/wan.ico",
      "/lista/audio/edge": "/assets/img/icons/edge.ico"
  };

  gridItems.forEach(link => {
      let domain = new URL(link.href).origin;
      let hostname = new URL(link.href).hostname;
      let pathname = new URL(link.href).pathname; // Obtém o caminho da URL
      let googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

      let faviconImg = document.createElement('img');
      faviconImg.classList.add('favicon');
      let customFaviconFound = false;

      // Verifica primeiro por hostname (para domínios externos)
      if (customFavicons[hostname]) {
          let faviconUrl = customFavicons[hostname];
          if (faviconUrl.startsWith("/")) {
              faviconImg.src = window.location.origin + faviconUrl;
          } else {
              faviconImg.src = faviconUrl;
          }
          customFaviconFound = true;
      } else {
          // Verifica por pathname (para links internos)
          for (const path in customFavicons) {
              if (path.startsWith("/") && pathname.startsWith(path)) {
                  let faviconUrl = customFavicons[path];
                  if (faviconUrl.startsWith("/")) {
                      faviconImg.src = window.location.origin + faviconUrl;
                  } else {
                      faviconImg.src = faviconUrl;
                  }
                  customFaviconFound = true;
                  break; // Para o loop assim que encontrar uma correspondência
              }
          }
      }

      if (!customFaviconFound) {
          // Senão, usa o Google e tenta buscar um favicon melhor depois
          faviconImg.src = googleFaviconUrl;

          fetch(link.href)
              .then(response => response.text())
              .then(html => {
                  let parser = new DOMParser();
                  let doc = parser.parseFromString(html, "text/html");
                  let faviconElement = doc.querySelector('link[rel~="icon"]');

                  if (faviconElement) {
                      let siteFaviconUrl = new URL(faviconElement.getAttribute("href"), domain).href;
                      faviconImg.src = siteFaviconUrl;
                  }
              })
              .catch(() => {
                  // Caso não consiga pegar o favicon da página, continua com o favicon do Google
              });
      }

      // Adiciona o favicon acima do conteúdo da caixa
      link.parentElement.insertBefore(faviconImg, link.parentElement.firstChild);
  });
});