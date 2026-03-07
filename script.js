// 1. IMPORTAÇÃO DOS DADOS
import { meusProdutos } from './produtos.js';

/* ==========================================
   CONFIGURAÇÃO DE PAGINAÇÃO
   ========================================== */
const PRODUTOS_POR_PAGINA = 20;
let paginaAtual = 1;
let produtosFiltrados = [...meusProdutos];

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
   PAGINAÇÃO
   ========================================== */
function renderizarPagina(lista, pagina) {
    const grid = document.getElementById('offersGrid');
    const paginacaoEl = document.getElementById('paginacao-produtos');
    if (!grid) return;

    const totalPaginas = Math.ceil(lista.length / PRODUTOS_POR_PAGINA);
    const inicio = (pagina - 1) * PRODUTOS_POR_PAGINA;
    const fim = inicio + PRODUTOS_POR_PAGINA;
    const produtosDaPagina = lista.slice(inicio, fim);

    // Renderiza os cards da página atual
    grid.innerHTML = produtosDaPagina.map(p => {
        const identificador = p.id;
        const éAmazon = p.loja === 'amazon';

        // Define o texto e o ícone do botão baseado na loja
        const textoBotao = éAmazon ? 'Comprar na Amazon' : 'Comprar no Mercado Livre';
        const iconeBotao = éAmazon ? 'fab fa-amazon' : 'fas fa-shopping-cart';
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
                <p>${p.desc || 'Oferta selecionada do dia!'}</p>
                <div class="price-container">
                    <span class="price-label">R$</span>
                    <span class="price-value">${p.preco}</span>
                </div>
                <div class="card-actions">
                    <a href="${p.link}" target="_blank" class="btn-buy" onclick="registrarClique('${p.nome}', '${lojaNome}')">
                        <i class="${iconeBotao}"></i> ${textoBotao}
                    </a>
                    <button class="btn-share" onclick="compartilharOferta('${identificador}', '${p.nome}', '${p.preco}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');

    // Rola para o topo da listagem ao trocar de página
    if (pagina > 1) {
        const ofertasEl = document.getElementById('ofertas');
        if (ofertasEl) ofertasEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Scroll para produto via hash na URL (compartilhar oferta)
    if (window.location.hash && pagina === 1) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                target.classList.add('highlight-card');
                setTimeout(() => target.classList.remove('highlight-card'), 2000);
            }
        }, 500);
    }

    // Esconde paginação se só tem 1 página
    if (totalPaginas <= 1) {
        paginacaoEl.style.display = 'none';
        return;
    }
    paginacaoEl.style.display = 'flex';

    // Botões anterior / próximo
    const btnAnterior = document.getElementById('btn-pag-anterior');
    const btnProximo  = document.getElementById('btn-pag-proximo');
    btnAnterior.disabled      = pagina === 1;
    btnProximo.disabled       = pagina === totalPaginas;
    btnAnterior.style.opacity = pagina === 1 ? '0.35' : '1';
    btnProximo.style.opacity  = pagina === totalPaginas ? '0.35' : '1';
    btnAnterior.style.cursor  = pagina === 1 ? 'default' : 'pointer';
    btnProximo.style.cursor   = pagina === totalPaginas ? 'default' : 'pointer';

    // Números de página clicáveis
    const numerados = document.getElementById('paginas-numeradas');
    numerados.innerHTML = '';
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = 'btn-pag-numero' + (i === pagina ? ' ativo' : '');
        btn.onclick = i === pagina ? null : () => { paginaAtual = i; renderizarPagina(produtosFiltrados, paginaAtual); };
        numerados.appendChild(btn);
    }
}

window.mudarPagina = function(direcao) {
    const totalPaginas = Math.ceil(produtosFiltrados.length / PRODUTOS_POR_PAGINA);
    const nova = paginaAtual + direcao;
    if (nova < 1 || nova > totalPaginas) return;
    paginaAtual = nova;
    renderizarPagina(produtosFiltrados, paginaAtual);
}

/* ==========================================
   CARREGAMENTO E FILTROS
   ========================================== */
function carregarProdutos() {
    produtosFiltrados = [...meusProdutos];
    paginaAtual = 1;
    renderizarPagina(produtosFiltrados, paginaAtual);
}

function inicializarFiltros() {
    const botoes = document.querySelectorAll('.filter-btn');
    botoes.forEach(btn => {
        btn.addEventListener('click', (e) => {
            botoes.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            paginaAtual = 1;
            if (e.currentTarget.id === 'btn-filtrar-favoritos') {
                filtrarFavoritos();
            } else {
                aplicarFiltroCategoria(e.currentTarget.dataset.categoria);
            }
        });
    });
}

function aplicarFiltroCategoria(cat) {
    produtosFiltrados = cat === 'todos'
        ? [...meusProdutos]
        : meusProdutos.filter(p => p.categoria === cat);
    paginaAtual = 1;
    renderizarPagina(produtosFiltrados, paginaAtual);
}

function filtrarFavoritos() {
    produtosFiltrados = meusProdutos.filter(p => listaFavoritosNEB.includes(String(p.id)));
    paginaAtual = 1;

    if (produtosFiltrados.length === 0) {
        mostrarNotificacao("Nenhum favorito salvo ainda! ❤️");
        produtosFiltrados = [...meusProdutos];
        document.querySelector('[data-categoria="todos"]').classList.add('active');
        document.getElementById('btn-filtrar-favoritos').classList.remove('active');
    }
    renderizarPagina(produtosFiltrados, paginaAtual);
}

/* ==========================================
   FILTRO DE PREÇO (DINÂMICO)
   ========================================== */
function configurarFiltroPrecoDinamico() {
    const btnToggle  = document.getElementById('togglePriceFilter');
    const panel      = document.getElementById('priceFilterPanel');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    if (!priceRange || !meusProdutos.length) return;

    const precosNumericos = meusProdutos.map(p =>
        parseFloat(p.preco.replace(/\./g, '').replace(',', '.'))
    );
    const maiorPreco = Math.ceil(Math.max(...precosNumericos));

    priceRange.max   = maiorPreco;
    priceRange.value = maiorPreco;
    priceValue.textContent = maiorPreco.toLocaleString('pt-BR');

    priceRange.addEventListener('input', () => {
        const maxPrice = parseFloat(priceRange.value);
        priceValue.textContent = maxPrice.toLocaleString('pt-BR');
        produtosFiltrados = meusProdutos.filter(p => {
            const price = parseFloat(p.preco.replace(/\./g, '').replace(',', '.'));
            return price <= maxPrice;
        });
        paginaAtual = 1;
        renderizarPagina(produtosFiltrados, paginaAtual);
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
   CARROSSEL
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

/* ==========================================
   BUSCA POR TEXTO
   ========================================== */
window.filterOffers = function() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    produtosFiltrados = meusProdutos.filter(p =>
        p.nome.toLowerCase().includes(input)
    );
    paginaAtual = 1;
    renderizarPagina(produtosFiltrados, paginaAtual);
}

/* ==========================================
   UTILITÁRIOS
   ========================================== */
window.registrarClique = function(produto, loja) {
    if (typeof gtag === 'function') {
        gtag('event', 'clique_produto', { 'event_label': produto, 'loja_destino': loja });
    }
}

window.compartilharOferta = function(id, titulo, preco) {
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