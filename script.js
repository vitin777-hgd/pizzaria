const pizzas = [...document.querySelectorAll(".pizza-card")];
const botoesFiltro = document.querySelectorAll(".filtro");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const carrinho = [];

function moeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

botoesFiltro.forEach(botao => {
  botao.addEventListener("click", () => {
    botoesFiltro.forEach(item => item.classList.remove("ativo"));
    botao.classList.add("ativo");
    const categoria = botao.dataset.categoria;

    pizzas.forEach(pizza => {
      pizza.style.display = categoria === "todas" || pizza.dataset.categoria === categoria ? "" : "none";
    });
  });
});

document.querySelectorAll(".adicionar").forEach(botao => {
  botao.addEventListener("click", () => {
    const card = botao.closest(".pizza-card");
    const nome = card.dataset.nome;
    const preco = Number(card.dataset.preco);
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) itemExistente.quantidade++;
    else carrinho.push({ nome, preco, quantidade: 1 });

    atualizarCarrinho();
    botao.textContent = "✓ Adicionado!";
    setTimeout(() => botao.textContent = "🛒 Adicionar", 900);
  });
});

function atualizarCarrinho() {
  const quantidadeTotal = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  const valorTotal = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  cartCount.textContent = quantidadeTotal;
  cartTotal.textContent = moeda(valorTotal);

  if (carrinho.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
    return;
  }

  cartItems.innerHTML = carrinho.map((item, indice) => `
    <div class="cart-item">
      <div><strong>${item.nome}</strong><small>${moeda(item.preco)} cada</small></div>
      <div class="quantidade">
        <button data-acao="menos" data-indice="${indice}" aria-label="Diminuir">−</button>
        <span>${item.quantidade}</span>
        <button data-acao="mais" data-indice="${indice}" aria-label="Aumentar">+</button>
      </div>
    </div>
  `).join("");

  cartItems.querySelectorAll("button").forEach(botao => {
    botao.addEventListener("click", () => {
      const indice = Number(botao.dataset.indice);
      if (botao.dataset.acao === "mais") carrinho[indice].quantidade++;
      else carrinho[indice].quantidade--;
      if (carrinho[indice].quantidade <= 0) carrinho.splice(indice, 1);
      atualizarCarrinho();
    });
  });
}

function abrirCarrinho() {
  cartPanel.classList.add("aberto");
  overlay.classList.add("visivel");
}
function fecharCarrinho() {
  cartPanel.classList.remove("aberto");
  overlay.classList.remove("visivel");
}

document.getElementById("verCarrinho").addEventListener("click", abrirCarrinho);
document.getElementById("fecharCarrinho").addEventListener("click", fecharCarrinho);
overlay.addEventListener("click", fecharCarrinho);

document.getElementById("finalizarPedido").addEventListener("click", () => {
  if (carrinho.length === 0) {
    alert("Adicione pelo menos uma pizza ao carrinho antes de finalizar.");
    return;
  }

  const linhas = carrinho.map(item => `${item.quantidade}x ${item.nome} - ${moeda(item.preco * item.quantidade)}`);
  const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  const mensagem = `Olá! Gostaria de fazer este pedido:\n${linhas.join("\n")}\nTotal: ${moeda(total)}`;
  // Troque pelo número da pizzaria, com código do país e DDD, somente números.
  const numeroWhatsApp = "5511999999999";
  window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, "_blank");
});

document.getElementById("whatsappBtn").addEventListener("click", () => {
  document.getElementById("finalizarPedido").click();
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navMenu").classList.toggle("aberto");
});
document.querySelectorAll("#navMenu a").forEach(link => {
  link.addEventListener("click", () => document.getElementById("navMenu").classList.remove("aberto"));
});
