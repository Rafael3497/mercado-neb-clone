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
        <div class="card" data-name="${p.nome}" data-category="${p.categoria}">
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
                    <button class="btn-share" onclick="compartilharOferta('${p.nome}', '${p.preco}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
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

    // Converte os preços de texto para números para achar o MAIOR
    const precosNumericos = meusProdutos.map(p => 
        parseFloat(p.preco.replace(/\./g, '').replace(',', '.'))
    );
    const maiorPreco = Math.ceil(Math.max(...precosNumericos));

    // Configura o slider com o valor máximo real do banco de dados
    priceRange.max = maiorPreco;
    priceRange.value = maiorPreco;
    priceValue.textContent = maiorPreco.toLocaleString('pt-BR');

    // Listener do Slider
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

    // Controle do Painel (Abrir/Fechar)
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

window.compartilharOferta = function(titulo, preco) {
    const urlSite = window.location.href; 
    const texto = `🌟 *OFERTA NO MERCADO NEB*\n\n*${titulo}*\n*R$ ${preco}*\n\n🛒 *Link:* ${urlSite}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
}

/* ==========================================
   INICIALIZAÇÃO GLOBAL
   ========================================== */
window.onload = function() {
    carregarProdutos();
    inicializarFiltros();
    configurarFiltroPrecoDinamico(); // Inicia o filtro já calculando o maior valor
    showSlides();
};