/* ==========================================
   BANCO DE DADOS DE PRODUTOS
   ========================================== */
const meusProdutos = [
    {
        id: "p56",
        nome: "Best Vegan - Pote 500g - Sabor Leite",
        desc: "Suplemento alimentar de alta qualidade, 100% vegetal, rico em vitaminas e minerais.",
        preco: "129,77",
        categoria: "saude",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_789213-MLU78239361549_082024-F.webp",
        link: "https://meli.la/29U6MSe"
    },
    {
        id: "p55",
        nome: "Best Vegan - 500g Bolo de Banana",
        desc: "Proteína vegana sabor bolo de banana. Ideal para dietas equilibradas.",
        preco: "118,00",
        categoria: "saude",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_714987-MLA99402296932_112025-F.webp",
        link: "https://meli.la/29U6MSe"
    },
    {
        id: "p54",
        nome: "Faixa de Graduação Infantil Haganah",
        desc: "Faixa branca M3 para Karate, Jiu Jitsu e Judô. Tradição e excelência.",
        preco: "35,49",
        categoria: "fitness",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_681541-MLA99600105554_122025-F.webp",
        link: "https://meli.la/1vNTakV"
    },
    {
        id: "p53",
        nome: "Jogo War Edição Especial Grow",
        desc: "Versão de luxo com miniaturas de soldados e tanques. O melhor jogo de estratégia.",
        preco: "138,13",
        categoria: "casa",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_954039-MLA99943624993_112025-F.webp",
        link: "https://meli.la/2yFsd6u"
    },
    {
        id: "p52",
        nome: "Shampoo Vichy Dercos Energy+",
        desc: "Tratamento antiqueda de 400g com Aminexil e Vitamina E. Fortalece os fios.",
        preco: "99,90",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/51b74hm3qrL._AC_SX342_SY445_QL70_ML2_.jpg",
        link: "https://amzn.to/4aNpIT3"
    },
    {
        id: "p51",
        nome: "24 Colheres de Sopa Aço Inox Luna",
        desc: "Conjunto elegante com cabo plástico vermelho. Funcional para qualquer ocasião.",
        preco: "44,90",
        categoria: "casa",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_906495-MLB106591516242_022026-O.webp",
        link: "https://meli.la/1Kv9Mgv"
    },
    {
        id: "p50",
        nome: "Kit 2 Telas Mosquiteiro Protetora",
        desc: "Telas retráteis de 36cm para cobrir bolos e pães com higiene e praticidade.",
        preco: "28,10",
        categoria: "casa",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_663318-MLB82423808068_022025-O.webp",
        link: "https://meli.la/2q896tP"
    },
    {
        id: "p49",
        nome: "Mochila Masculina Impermeável USB",
        desc: "Compartimento para notebook, leve e resistente. Ideal para faculdade.",
        preco: "78,90",
        categoria: "moda",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_932274-MLB104125679132_012026-O-mochila-masculina-faculdade-impermeavel-notebook-entrada-usb.webp",
        link: "https://meli.la/2kfHCrL"
    },
    {
        id: "p48",
        nome: "A Fantástica Fábrica de Chocolate",
        desc: "Edição especial de luxo com capa inédita de Isadora Zeferino.",
        preco: "30,18",
        categoria: "livros",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/81BX9xwJ1jL._AC_UF1000,1000_QL80_FMwebp_.jpg",
        link: "https://amzn.to/4aL7LVf"
    },
    {
        id: "p47",
        nome: "Megafone Amplificador de Voz Portátil",
        desc: "Com microfone, USB e rádio. Perfeito para guias, professores e palestras.",
        preco: "68,78",
        categoria: "eletronicos",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_700426-MLB92051578723_092025-O.webp",
        link: "https://meli.la/2ynMFjf"
    },
    {
        id: "p46",
        nome: "Garrafa Térmica 1L com LED",
        desc: "Cabo de madeira e termômetro digital para café e chás. Design requintado.",
        preco: "46,93",
        categoria: "casa",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_658148-MLB89993492671_082025-O-garrafa-termica-1-litro-com-termmetro-led-para-chas-cafe.webp",
        link: "https://meli.la/1mB3Cix"
    },
    {
        id: "p45",
        nome: "Buba Pote Térmico Azul Degradê",
        desc: "Conserva alimentos por mais de 5 horas. Acompanha colher, ideal para passeios.",
        preco: "89,91",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/514yQd52YoL._AC_UF894,1000_QL80_FMwebp_.jpg",
        link: "https://amzn.to/4r2ZLDO"
    },
    {
        id: "p44",
        nome: "Buba Pote Térmico Gumy Verde",
        desc: "Design ergonômico com talher incluso. Mantém a temperatura quente ou fria.",
        preco: "95,30",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/41D0T4KyttS._AC_UF894,1000_QL80_FMwebp_.jpg",
        link: "https://amzn.to/4cVEMzo"
    },
    {
        id: "p43",
        nome: "Lanterna T9 Apfer",
        desc: "Potência e versatilidade extrema para trilhas e aventuras ao ar livre.",
        preco: "49,99",
        categoria: "eletronicos",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_953370-MLA107171490859_022026-O.webp",
        link: "https://meli.la/2cqma9Y"
    },
    {
        id: "p42",
        nome: "Kit 12 Pares Meia Soquete Unissex",
        desc: "Ajuste firme e conforto para academia, caminhadas e uso diário.",
        preco: "26,90",
        categoria: "moda",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_893559-MLB98742398254_112025-O-kit-12-pares-meia-soquete-cano-curto-unissex-adulto-premium.webp",
        link: "https://meli.la/32AJA45"
    }

];

/* ==========================================
   SISTEMA DE FAVORITOS (MERCADO NEB)
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

function toggleFavorito(event, produtoId) {
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
    
    // Se estiver na aba de favoritos, atualiza a visão em tempo real
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

// NOVO: Inicializador de Event Listeners Profissional
function inicializarFiltros() {
    const botoes = document.querySelectorAll('.filter-btn');
    
    botoes.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove 'active' de todos
            botoes.forEach(b => b.classList.remove('active'));
            // Adiciona no clicado
            e.currentTarget.classList.add('active');

            // Verifica se é o botão de favoritos ou categoria comum
            if (e.currentTarget.id === 'btn-filtrar-favoritos') {
                filtrarFavoritos();
            } else {
                const categoria = e.currentTarget.dataset.categoria;
                aplicarFiltroCategoria(categoria);
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
        // Extrai o ID do onclick usando regex de forma segura
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
   UTILITÁRIOS E AUXILIARES
   ========================================== */

function registrarClique(produto, loja) {
    if (typeof gtag === 'function') {
        gtag('event', 'clique_produto', { 'event_label': produto, 'loja_destino': loja });
    }
}

function compartilharOferta(titulo, preco) {
    const urlSite = window.location.href; 
    const texto = `🌟 *OFERTA NO MERCADO NEB*\n\n*${titulo}*\n*R$ ${preco}*\n\n🛒 *Link:* ${urlSite}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
}

function filterOffers() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        let name = card.getAttribute('data-name').toLowerCase();
        card.style.display = name.includes(input) ? "flex" : "none";
    });
}

/* ==========================================
   INICIALIZAÇÃO (WINDOW.ONLOAD)
   ========================================== */
window.onload = function() {
    // Carrega produtos imediatamente ou após skeleton
    carregarProdutos();
    inicializarFiltros();
    
    // Se você tiver um slider, chame-o aqui
    // showSlides(); 
};