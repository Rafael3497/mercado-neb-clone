// 1. IMPORTAÇÃO DOS DADOS
import { meusProdutos } from './produtos.js';

/* ==========================================
   SISTEMA DE FAVORITOS
   ========================================== */
let listaFavoritosNEB = [];
try {
    const salvos = localStorage.getItem('mercado_neb_favs');
    listaFavoritosNEB = salvos ? JSON.parse(salvos) : [];
} catch (e) {
    listaFavoritosNEB = [];
}

function verificarStatusFavorito(produtoId) {
    return listaFavoritosNEB.includes(String(produtoId));
}

function mostrarNotificacao(mensagem) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-heart"></i> ${mensagem}`;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

window.toggleFavorito = function(event, produtoId) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const btn = event.currentTarget;
    const icone = btn.querySelector('i');
    const index = listaFavoritosNEB.indexOf(String(produtoId));

    if (index === -1) {
        listaFavoritosNEB.push(String(produtoId));
        btn.classList.add('active');
        if(icone) { icone.classList.replace('far', 'fas'); }
        mostrarNotificacao("Salvo nos favoritos! ❤️");
    } else {
        listaFavoritosNEB.splice(index, 1);
        btn.classList.remove('active');
        if(icone) { icone.classList.replace('fas', 'far'); }
        mostrarNotificacao("Removido dos favoritos.");
    }
    localStorage.setItem('mercado_neb_favs', JSON.stringify(listaFavoritosNEB));
    
    if (document.querySelector('.btn-fav-filter.active')) {
        filtrarFavoritos(); 
    }
}

/* ==========================================
   CARREGAMENTO E FILTROS PROFISSIONAIS
   ========================================== */
function carregarProdutos() {
    const grid = document.getElementById('offersGrid');
    if (!grid) return;

    grid.innerHTML = meusProdutos.map(p => {
        const identificador = p.id;
        const éAmazon = p.loja === 'amazon';
        const lojaNome = éAmazon ? 'Amazon' : 'Mercado Livre';
        const isFav = verificarStatusFavorito(identificador);
        
        return `
        <div class="card" id="${identificador}" data-name="${p.nome}" data-category="${p.categoria}">
            <div class="card-img">
                <span class="badge-loja ${p.loja}">${lojaNome}</span>
                <button class="btn-favorite ${isFav ? 'active' : ''}" onclick="toggleFavorito(event, '${identificador}')">
                    <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <img src="${p.img}" alt="${p.nome}" loading="lazy">
            </div>
            <div class="card-info">
                <h3>${p.nome}</h3>
                <p>${p.desc}</p>
                <div class="price-container">
                    <span class="price-label">R$</span>
                    <span class="price-value">${p.preco}</span>
                </div>
                <div class="card-actions">
                    <a href="${p.link}" target="_blank" class="btn-buy" onclick="registrarClique('${p.nome}', '${lojaNome}')">Ver na Loja</a>
                    <button class="btn-share" onclick="compartilharOferta('${identificador}', '${p.nome}', '${p.preco}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');

    // Se houver um ID na URL ao carregar, rola até ele
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                target.classList.add('highlight-card'); // Opcional: destaque visual
                setTimeout(() => target.classList.remove('highlight-card'), 2000);
            }
        }, 500);
    }
}

function inicializarFiltros() {
    const botoes = document.querySelectorAll('.filter-btn');
    botoes.forEach(btn => {
        btn.addEventListener('click', (e) => {
            botoes.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            if (e.currentTarget.id === 'btn-filtrar-favoritos') {
                filtrarFavoritos();
            } else {
                aplicarFiltroCategoria(e.currentTarget.dataset.categoria);
            }
        });
    });
}

function aplicarFiltroCategoria(cat) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const categoriaCard = card.getAttribute('data-category');
        card.style.display = (cat === 'todos' || categoriaCard === cat) ? "flex" : "none";
    });
}

function filtrarFavoritos() {
    const cards = document.querySelectorAll('.card');
    let encontrouAlgum = false;
    cards.forEach(card => {
        const btnFav = card.querySelector('.btn-favorite');
        const match = btnFav.getAttribute('onclick').match(/'([^']+)'/);
        const idDoCard = match ? match[1] : null;
        if (listaFavoritosNEB.includes(idDoCard)) {
            card.style.display = "flex";
            encontrouAlgum = true;
        } else {
            card.style.display = "none";
        }
    });
    if (!encontrouAlgum) {
        mostrarNotificacao("Nenhum favorito salvo ainda! ❤️");
        aplicarFiltroCategoria('todos');
        document.querySelector('[data-categoria="todos"]').classList.add('active');
        document.getElementById('btn-filtrar-favoritos').classList.remove('active');
    }
}

/* ==========================================
   FILTRO DE PREÇO (DINÂMICO)
   ========================================== */
function configurarFiltroPrecoDinamico() {
    const btnToggle = document.getElementById('togglePriceFilter');
    const panel = document.getElementById('priceFilterPanel');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    if (!priceRange || !meusProdutos.length) return;

    const precosNumericos = meusProdutos.map(p => 
        parseFloat(p.preco.replace(/\./g, '').replace(',', '.'))
    );
    const maiorPreco = Math.ceil(Math.max(...precosNumericos));

    priceRange.max = maiorPreco;
    priceRange.value = maiorPreco;
    priceValue.textContent = maiorPreco.toLocaleString('pt-BR');

    priceRange.addEventListener('input', () => {
        const maxPrice = parseFloat(priceRange.value);
        priceValue.textContent = maxPrice.toLocaleString('pt-BR');
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const priceText = card.querySelector('.price-value').textContent;
            const price = parseFloat(priceText.replace(/\./g, '').replace(',', '.'));
            card.style.display = (price <= maxPrice) ? "flex" : "none";
        });
    });

    if (btnToggle) {
        btnToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== btnToggle) {
                panel.classList.add('hidden');
            }
        });
    }
}

/* ==========================================
   CARROSSEL, BUSCA E UTILITÁRIOS
   ========================================== */
let slideIndex = 0;
function showSlides() {
    let slides = document.getElementsByClassName("slide");
    if (slides.length === 0) return;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.opacity = "0";
        slides[i].classList.remove("active");
    }
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;
    slides[slideIndex - 1].style.opacity = "1";
    slides[slideIndex - 1].classList.add("active");
    setTimeout(showSlides, 6000);
}

window.filterOffers = function() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        let name = card.getAttribute('data-name').toLowerCase();
        card.style.display = name.includes(input) ? "flex" : "none";
    });
}

window.registrarClique = function(produto, loja) {
    if (typeof gtag === 'function') {
        gtag('event', 'clique_produto', { 'event_label': produto, 'loja_destino': loja });
    }
}

window.compartilharOferta = function(id, titulo, preco) {
    // Pega a URL base (sem o que vem depois da #) e adiciona o ID do produto
    const urlBase = window.location.href.split('#')[0]; 
    const urlComAncora = `${urlBase}#${id}`;
    
    const texto = `🌟 *OFERTA NO MERCADO NEB*\n\n*${titulo}*\n*R$ ${preco}*\n\n🛒 *Link da Oferta:* ${urlComAncora}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
}

/* ==========================================
   INICIALIZAÇÃO GLOBAL
   ========================================== */
window.onload = function() {
    carregarProdutos();
    inicializarFiltros();
    configurarFiltroPrecoDinamico();
    showSlides();
};

// ======= SCRIPT DO FRONT-END (Lógica do Client-Side) =======

// ======= SCRIPT DO FRONT-END (Lógica do Client-Side) =======

const CONFIG = {
    API_URL: "/.netlify/functions/mercadolivre",
    LIMITE: 20,
};

let estado = {
    aberto: false,
    pagina: 0,
    total: 0,
    carregando: false,
};

// Funções globais necessárias no HTML (Atribuídas ao window)
window.abrirAchadinhos = function() {
    if (!estado.aberto) window.toggleAchadinhos();
};

window.toggleAchadinhos = function() {
    estado.aberto = !estado.aberto;
    const painel = document.getElementById("achadinhos-painel");
    const btn = document.getElementById("btn-achadinhos");
    painel.classList.toggle("aberto", estado.aberto);
    btn.querySelector('.btn-badge').textContent = estado.aberto ? "FECHAR" : "AO VIVO";

    if (estado.aberto && estado.total === 0) {
        window.buscarML();
    }
};

window.buscarML = async function() {
    if (estado.carregando) return;
    estado.pagina = 0;
    await fetchML();
};

window.paginaML = async function(direcao) {
    const novaPagina = estado.pagina + direcao;
    const maxPagina = Math.ceil(estado.total / CONFIG.LIMITE) - 1;
    if (novaPagina < 0 || novaPagina > maxPagina) return;
    estado.pagina = novaPagina;
    await fetchML();
    document.getElementById("secao-achadinhos").scrollIntoView({ behavior: "smooth" });
};

async function fetchML() {
    if (estado.carregando) return;
    estado.carregando = true;

    const conteudo = document.getElementById("ml-conteudo");
    const paginacao = document.getElementById("ml-paginacao");
    conteudo.innerHTML = renderLoading();
    paginacao.style.display = "none";

    const categoria = document.getElementById("ml-categoria").value;
    const offset = estado.pagina * CONFIG.LIMITE;

    const params = new URLSearchParams({
        limite: CONFIG.LIMITE,
        offset,
        categoria
    });

    try {
        const res = await fetch(`${CONFIG.API_URL}?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        estado.total = data.total;
        estado.carregando = false;

        if (!data.items || data.items.length === 0) {
            conteudo.innerHTML = `<div class="ml-erro">😕 Nenhum produto encontrado nesta categoria. Tente outra.</div>`;
            return;
        }

        conteudo.innerHTML = renderGrid(data.items);
        renderPaginacao();

    } catch (err) {
        estado.carregando = false;
        conteudo.innerHTML = `
            <div class="ml-erro">
                ⚠️ Não foi possível carregar as ofertas.<br>
                <small>${err.message}</small><br><br>
                <button onclick="buscarML()" style="
                    background:#c0392b;color:#fff;border:none;
                    padding:8px 18px;border-radius:8px;cursor:pointer;font-size:0.9rem;
                ">Tentar novamente</button>
            </div>`;
    }
}

function renderGrid(items) {
    return `<div class="ml-grid">${items.map(renderCard).join("")}</div>`;
}

function renderCard(item) {
    const preco = item.preco?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const precOriginal = item.preco_original?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return `
        <a class="ml-card" href="${item.link}" target="_blank" rel="noopener noreferrer">
            ${item.condicao === "Novo" ? '<span class="ml-badge-novo">NOVO</span>' : ""}
            <img class="ml-card-img" src="${item.imagem}" alt="${item.titulo}" loading="lazy"
                onerror="this.style.display='none'" />
            <div class="ml-card-body">
                <div class="ml-card-titulo">${item.titulo}</div>
                ${item.preco_original ? `<div class="ml-card-original">${precOriginal}</div>` : ""}
                <div class="ml-card-preco">${preco}</div>
                ${item.desconto ? `<span class="ml-card-desconto">-${item.desconto}% OFF</span>` : ""}
                ${item.frete_gratis ? `<div class="ml-card-frete">✅ Frete grátis</div>` : ""}
            </div>
        </a>
    `;
}

function renderPaginacao() {
    const totalPaginas = Math.ceil(estado.total / CONFIG.LIMITE);
    if (totalPaginas <= 1) return;

    const paginacao = document.getElementById("ml-paginacao");
    document.getElementById("ml-info-pagina").textContent = `Página ${estado.pagina + 1} de ${totalPaginas}`;
    document.getElementById("ml-btn-anterior").disabled = estado.pagina === 0;
    document.getElementById("ml-btn-proximo").disabled = estado.pagina >= totalPaginas - 1;
    paginacao.style.display = "flex";
}

function renderLoading() {
    return `<div class="ml-loading"><div class="ml-spinner"></div>Carregando ofertas do Mercado Livre...</div>`;
}