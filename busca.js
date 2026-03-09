/* =====================================================
   MERCADO NEB — busca.js
   ===================================================== */

const CONFIG = {
    API_URL: '/.netlify/functions/mercadolivre',
    LIMITE: 20,
};

let estado = {
    termo:     '',
    pagina:    0,
    total:     0,
    carregando: false,
    ordenacao: 'relevance',
};

/* ── Categoria clicada na barra ── */
function buscaRapida(btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('campoBusca').value = btn.dataset.termo;
    estado.termo     = btn.dataset.termo;
    estado.pagina    = 0;
    estado.ordenacao = document.getElementById('ordenacao').value;
    fetchBusca();
}

/* ── Busca pelo campo de texto ── */
function executarBusca() {
    const input = document.getElementById('campoBusca').value.trim();
    if (!input) return;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    estado.termo     = input;
    estado.pagina    = 0;
    estado.ordenacao = document.getElementById('ordenacao').value;
    fetchBusca();
}

/* ── Reordenar resultados ── */
function reordenar() {
    if (!estado.termo) return;
    estado.ordenacao = document.getElementById('ordenacao').value;
    estado.pagina    = 0;
    fetchBusca();
}

/* ── Paginação ── */
window.paginar = function(direcao) {
    const nova = estado.pagina + direcao;
    const max  = Math.ceil(Math.min(estado.total, 200) / CONFIG.LIMITE) - 1;
    if (nova < 0 || nova > max) return;
    estado.pagina = nova;
    fetchBusca();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ── Requisição à API ── */
async function fetchBusca() {
    if (estado.carregando) return;
    estado.carregando = true;

    const conteudo  = document.getElementById('resultados-conteudo');
    const paginacao = document.getElementById('ml-paginacao');
    const header    = document.getElementById('resultados-header');
    const countEl   = document.getElementById('resultados-count');

    conteudo.innerHTML      = `<div class="ml-loading"><div class="ml-spinner"></div>Buscando "${estado.termo}" no Mercado Livre...</div>`;
    paginacao.style.display = 'none';
    header.style.display    = 'none';

    const offset = estado.pagina * CONFIG.LIMITE;
    const params = new URLSearchParams({
        limite:    CONFIG.LIMITE,
        offset,
        q:         estado.termo,
        ordenacao: estado.ordenacao,
    });

    try {
        const res  = await fetch(`${CONFIG.API_URL}?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        estado.total      = data.total || 0;
        estado.carregando = false;

        if (!data.items || data.items.length === 0) {
            conteudo.innerHTML = `
                <div class="ml-erro">
                    😕 Nenhum resultado encontrado para "<strong>${estado.termo}</strong>".<br>
                    Tente outro termo ou verifique a ortografia.
                </div>`;
            return;
        }

        header.style.display = 'flex';
        document.getElementById('termo-exibido').textContent = `"${estado.termo}"`;

        const totalLimitado = Math.min(estado.total, 200);
        const inicio = estado.pagina * CONFIG.LIMITE + 1;
        const fim    = Math.min(inicio + data.items.length - 1, totalLimitado);
        countEl.textContent = `Mostrando ${inicio}–${fim} de ${totalLimitado} resultados`;

        conteudo.innerHTML = renderGrid(data.items);

        if (typeof gtag === 'function') {
            gtag('event', 'busca_ml', { search_term: estado.termo });
        }

        renderPaginacao(totalLimitado);

    } catch (err) {
        estado.carregando = false;
        conteudo.innerHTML = `
            <div class="ml-erro">
                ⚠️ Erro ao buscar produtos.<br>
                <small>${err.message}</small><br><br>
                <button onclick="fetchBusca()" style="
                    background:#dc2626;color:#fff;border:none;
                    padding:9px 20px;border-radius:9px;cursor:pointer;
                    font-size:0.9rem;font-weight:700;
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
        <a class="ml-card" href="${item.link}" target="_blank" rel="noopener noreferrer">
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

function renderPaginacao(totalLimitado) {
    const totalPaginas = Math.ceil(totalLimitado / CONFIG.LIMITE);
    if (totalPaginas <= 1) return;
    const paginacao = document.getElementById('ml-paginacao');
    document.getElementById('ml-info-pagina').textContent = `Página ${estado.pagina + 1} de ${totalPaginas}`;
    document.getElementById('ml-btn-anterior').disabled   = estado.pagina === 0;
    document.getElementById('ml-btn-proximo').disabled    = estado.pagina >= totalPaginas - 1;
    paginacao.style.display = 'flex';
}

/* ── Init ── */
window.addEventListener('load', () => {
    document.getElementById('campoBusca').focus();
});
