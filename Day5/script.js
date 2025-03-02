// Definindo quais são as categorias
const categoriasArray = [
  "Alimentos",
  "Limpeza",
  "Higiene",
  "Eletrônicos",
  "Frutas",
  "Doces",
  "Laticinios",
];

const input = document.getElementById("itemInput");
const categoriasContainer = document.getElementById("categorias");
const listasContainer = document.getElementById("listas");
const salvarBtn = document.getElementById("salvarLista");

// Função para gerar dinamicamente as categorias
function gerarCategorias() {
  categoriasArray.forEach((categoria) => {
    // Criar o título da categoria (h3)
    const categoriaTitulo = document.createElement("h3");
    categoriaTitulo.textContent = categoria;

    // Criar a lista para cada categoria
    const lista = document.createElement("ul");
    lista.id = `lista-${categoria.toLowerCase()}`;

    // Adicionar o título e a lista ao container de listas
    const listaContainer = document.createElement("div");
    listaContainer.classList.add("lista-container");

    listaContainer.appendChild(categoriaTitulo);
    listaContainer.appendChild(lista);
    listasContainer.appendChild(listaContainer);

    // Criar o botão para cada categoria
    const categoriaDiv = document.createElement("div");
    categoriaDiv.classList.add("categoria");
    categoriaDiv.textContent = categoria;
    categoriaDiv.setAttribute("data-categoria", categoria);

    // Adicionar o botão ao contêiner de categorias
    categoriasContainer.appendChild(categoriaDiv);
  });
}

// Função para adicionar o item à categoria selecionada
categoriasContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("categoria")) {
    const nomeItem = input.value.trim();
    if (nomeItem) {
      const categoriaEscolhida = event.target.getAttribute("data-categoria");
      const lista = document.getElementById(
        `lista-${categoriaEscolhida.toLowerCase()}`
      );

      // Criar o item na lista
      const novoItem = document.createElement("li");
      novoItem.textContent = nomeItem;
      lista.appendChild(novoItem);

      // Limpa o input
      input.value = "";
    } else {
      alert("Digite um item antes de escolher a categoria!");
    }
  }
});

// Gerar as categorias e listas quando a página for carregada
gerarCategorias();

// Menu
function toggleMenu() {
  const menu = document.querySelector(".menu-content");
  menu.classList.toggle("show");
}

// Funções de ação para os botões
function compartilhar() {
  const shareData = {
    title: "Minha Lista de Compras",
    text: "Confira minha lista de compras:\n" + getListaCompleta(),
    url: window.location.href, // Optional: Include the URL if needed
  };

  // API support check
  if (navigator.share) {
    navigator
      .share(shareData)
      .then(() => {
        console.log("Conteúdo compartilhado com sucesso");
      })
      .catch((error) => {
        console.error("Erro ao compartilhar: ", error);
        fallbackCompartilhar(shareData);
      });
  } else {
    // Fallback for browsers that don't support the Web Share API
    fallbackCompartilhar(shareData);
  }
}

// Lista completa em texto
function getListaCompleta() {
  let listaCompleta = "";

  categoriasArray.forEach((categoria) => {
    const listaCategoria = document.getElementById(
      `lista-${categoria.toLowerCase()}`
    );
    const itens = listaCategoria.querySelectorAll("li");

    if (itens.length > 0) {
      listaCompleta += `${categoria}:\n`;

      itens.forEach((item) => {
        listaCompleta += `- ${item.textContent}\n`;
      });

      listaCompleta += "\n";
    }
  });

  return listaCompleta;
}

// Fallback for browsers that don't support the Web Share API
function fallbackCompartilhar(shareData) {
  const textToShare = `${shareData.title}\n${shareData.text}\n`;
  alert(
    "A função de compartilhamento não é suportada neste navegador. Copie o texto abaixo:\n\n" +
      textToShare
  );

  // Copia o texto para a area de transferencia
  navigator.clipboard
    .writeText(textToShare)
    .then(() => {
      console.log("Texto copiado para a área de transferência");
    })
    .catch((error) => {
      console.error("Erro ao copiar texto: ", error);
    });
}

function salvarTxt() {
  let listaCompleta = "";

  const tituloH2 = document.querySelector("h2");
  if (tituloH2) {
    listaCompleta += `${tituloH2.textContent}\n\n`;
  }

  categoriasArray.forEach((categoria) => {
    const listaCategoria = document.getElementById(
      `lista-${categoria.toLowerCase()}`
    );
    const itens = listaCategoria.querySelectorAll("li");

    if (itens.length > 0) {
      listaCompleta += `${categoria}:\n`;

      itens.forEach((item) => {
        listaCompleta += `- ${item.textContent}\n`;
      });

      listaCompleta += "\n";
    }
  });

  // Cria o arquivo .txt
  const blob = new Blob([listaCompleta], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "lista_compras.txt"; // Nome do arquivo
  link.click();
}

function salvarPdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const tituloH2 = document.querySelector("h2");
  if (tituloH2) {
    doc.setFontSize(18);
    doc.text(tituloH2.textContent, 10, 10);
    doc.setFontSize(12);
  }

  // Captura o conteúdo das listas de compras
  let yOffset = tituloH2 ? 20 : 10;

  categoriasArray.forEach((categoria) => {
    const listaCategoria = document.getElementById(
      `lista-${categoria.toLowerCase()}`
    );
    const itens = listaCategoria.querySelectorAll("li");

    if (itens.length > 0) {
      doc.setFontSize(14);
      doc.text(`${categoria}:`, 10, yOffset);
      yOffset += 10;

      doc.setFontSize(12);
      itens.forEach((item) => {
        doc.text(`- ${item.textContent}`, 15, yOffset);
        yOffset += 10;
      });

      yOffset += 10;
    }
  });

  // Salva o PDF
  doc.save("lista_compras.pdf");
}
