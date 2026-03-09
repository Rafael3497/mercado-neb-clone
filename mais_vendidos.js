/* =====================================================
   MERCADO NEB — mais_vendidos.js
   ===================================================== */

const CONFIG = {
    API_URL: '/.netlify/functions/mercadolivre',
    LIMITE: 20,
};

const NOMES_CATEGORIA = {
    'MLB1051':   'Celulares e Smartphones',
    'MLB1000':   'Eletrônicos e Áudio',
    'MLB1648':   'Informática',
    'MLB5726':   'Eletrodomésticos',
    'MLB1574':   'Casa e Decoração',
    'MLB1430':   'Moda e Calçados',
    'MLB1276':   'Esportes e Fitness',
    'MLB1144':   'Video Games',
    'MLB1132':   'Brinquedos e Hobbies',
    'MLB263532': 'Ferramentas',
    'MLB1196':   'Livros',
};

let estado = {
    pagina:         0,
    total:          0,
    carregando:     false,
    categoriaAtual: 'MLB1051',
};

/* ── Selecionar categoria ── */
function selecionarCategoria(btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    estado.categoriaAtual = btn.dataset.cat;
    estado.pagina = 0;
    document.getElementById('nome-categoria-ativa').textContent =
        NOMES_CATEGORIA[estado.categoriaAtual] || 'Produtos';
    fetchML();
}

/* ── Paginação ── */
window.paginaML = function(direcao) {
    const nova = estado.pagina + direcao;
    const max  = Math.ceil(estado.total / CONFIG.LIMITE) - 1;
    if (nova < 0 || nova > max) return;
    estado.pagina = nova;
    fetchML();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ── Requisição à API ── */
async function fetchML() {
    if (estado.carregando) return;
    estado.carregando = true;

    const conteudo  = document.getElementById('ml-conteudo');
    const paginacao = document.getElementById('ml-paginacao');
    const countEl   = document.getElementById('vitrine-count');

    conteudo.innerHTML      = renderLoading();
    paginacao.style.display = 'none';
    countEl.style.display   = 'none';

    const offset = estado.pagina * CONFIG.LIMITE;
    const params = new URLSearchParams({
        limite:    CONFIG.LIMITE,
        offset,
        categoria: estado.categoriaAtual,
    });

    try {
        const res  = await fetch(`${CONFIG.API_URL}?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        estado.total      = Math.min(data.total, 200);
        estado.carregando = false;

        if (!data.items || data.items.length === 0) {
            conteudo.innerHTML = `<div class="ml-erro">😕 Nenhum produto encontrado nesta categoria. Tente outra.</div>`;
            return;
        }

        conteudo.innerHTML = renderGrid(data.items);

        const inicio = estado.pagina * CONFIG.LIMITE + 1;
        const fim    = Math.min(inicio + data.items.length - 1, estado.total);
        countEl.textContent   = `Mostrando ${inicio}–${fim} de ${estado.total} produtos`;
        countEl.style.display = 'inline-block';

        renderPaginacao();

    } catch (err) {
        estado.carregando = false;
        conteudo.innerHTML = `
            <div class="ml-erro">
                ⚠️ Não foi possível carregar as ofertas.<br>
                <small>${err.message}</small><br><br>
                <button onclick="fetchML()" style="
                    background:#dc2626;color:#fff;border:none;
                    padding:9px 20px;border-radius:9px;cursor:pointer;
                    font-size:0.9rem;font-weight:700;margin-top:4px;
                ">Tentar novamente</button>
            </div>`;
    }
}

/* ── Renderização ── */
function renderGrid(items) {
    return `<div class="ml-grid">${items.map(renderCard).join('')}</div>`;
}

function renderCard(item) {
    const preco    = item.preco?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const precOrig = item.preco_original?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return `
        <a class="ml-card" href="${item.link}" target="_blank" rel="noopener noreferrer"
           onclick="gtag('event','clique_mais_vendido',{item_id:'${item.id}',categoria:'${estado.categoriaAtual}'})">
            ${item.condicao === 'Novo' ? '<span class="ml-badge-novo">NOVO</span>' : ''}
            <img class="ml-card-img" src="${item.imagem}" alt="${item.titulo}" loading="lazy"
                 onerror="this.style.display='none'" />
            <div class="ml-card-body">
                <div class="ml-card-titulo">${item.titulo}</div>
                ${item.preco_original ? `<div class="ml-card-original">${precOrig}</div>` : ''}
                <div class="ml-card-preco">${preco}</div>
                ${item.desconto ? `<span class="ml-card-desconto">-${item.desconto}% OFF</span>` : ''}
                ${item.frete_gratis ? `<div class="ml-card-frete">✅ Frete grátis</div>` : ''}
            </div>
        </a>`;
}

function renderPaginacao() {
    const total = Math.ceil(estado.total / CONFIG.LIMITE);
    if (total <= 1) return;
    const paginacao = document.getElementById('ml-paginacao');
    document.getElementById('ml-info-pagina').textContent = `Página ${estado.pagina + 1} de ${total}`;
    document.getElementById('ml-btn-anterior').disabled   = estado.pagina === 0;
    document.getElementById('ml-btn-proximo').disabled    = estado.pagina >= total - 1;
    paginacao.style.display = 'flex';
}

function renderLoading() {
    return `<div class="ml-loading"><div class="ml-spinner"></div>Carregando ofertas do Mercado Livre...</div>`;
}

/* ── Init ── */
fetchML();
