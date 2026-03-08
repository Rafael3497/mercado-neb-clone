// netlify/functions/mercadolivre.js

const AFILIADO_ID = "23098063";

// Cache do token de usuário
let cachedToken = null;
let tokenExpiraEm = 0;

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const CLIENT_ID     = process.env.ML_CLIENT_ID;
  const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.ML_REFRESH_TOKEN;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Variáveis ML_CLIENT_ID, ML_CLIENT_SECRET e ML_REFRESH_TOKEN não configuradas." }),
    };
  }

  // ── TOKEN DE USUÁRIO ─────────────────────────────────────────────────────
  const agora = Date.now();
  if (!cachedToken || agora >= tokenExpiraEm) {
    try {
      const tokenRes  = await fetch("https://api.mercadolibre.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type:    "refresh_token",
          client_id:     CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: REFRESH_TOKEN,
        }),
      });
      const tokenData = await tokenRes.json();
      console.log("[TOKEN] status:", tokenRes.status, "| ok:", !!tokenData.access_token);

      if (!tokenData.access_token) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: "Falha ao gerar access_token.", detalhes: tokenData }),
        };
      }
      cachedToken   = tokenData.access_token;
      tokenExpiraEm = agora + ((tokenData.expires_in || 21600) - 300) * 1000;
    } catch (e) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Erro de rede ao obter token", details: e.message }),
      };
    }
  }

  const authHeaders = {
    "Authorization": `Bearer ${cachedToken}`,
    "Accept": "application/json",
  };

  // ── PARÂMETROS ────────────────────────────────────────────────────────────
  const params     = event.queryStringParameters || {};
  const categoria  = params.categoria || "MLB1051";
  const limite     = Math.min(parseInt(params.limite) || 20, 50);
  const offset     = parseInt(params.offset) || 0;
  const termoBusca = params.q ? params.q.trim() : null;
  const ordenacao  = params.ordenacao || "relevance";

  // ── HELPER: busca detalhes de uma lista de IDs ────────────────────────────
  // Pede até (limite * 2) IDs para compensar os que retornam null
  // e corta no limite certo no final
  async function buscarProdutosPorIds(ids, campanha) {
    const promises = ids.map(async (productId) => {
      try {
        const [prodRes, itemRes] = await Promise.all([
          fetch(`https://api.mercadolibre.com/products/${productId}`, { headers: authHeaders }),
          fetch(`https://api.mercadolibre.com/products/${productId}/items?limit=1`, { headers: authHeaders }),
        ]);
        if (!prodRes.ok || !itemRes.ok) return null;

        const prodData = await prodRes.json();
        const itemData = await itemRes.json();
        const info     = itemData.results?.[0];
        if (!info || !info.price) return null;

        const permalink    = info.permalink
          || `https://produto.mercadolivre.com.br/MLB-${info.item_id.replace("MLB", "")}`;
        const sep          = permalink.includes("?") ? "&" : "?";
        const linkAfiliado = `${permalink}${sep}matt_tool=${AFILIADO_ID}&matt_word=&matt_source=mercadoneb&matt_campaign=${campanha}`;
        const imagem       = prodData.pictures?.[0]?.url
          || prodData.pictures?.[0]?.thumbnail
          || null;

        return {
          id:             info.item_id,
          titulo:         prodData.name || prodData.family_name || info.item_id,
          preco:          info.price,
          preco_original: info.original_price || null,
          desconto:       info.original_price
            ? Math.round((1 - info.price / info.original_price) * 100)
            : null,
          moeda:          info.currency_id,
          link:           linkAfiliado,
          imagem,
          vendedor:       "",
          condicao:       info.condition === "new" ? "Novo" : "Usado",
          frete_gratis:   info.shipping?.free_shipping || false,
          disponivel:     true,
          vendidos:       info.sold_quantity || 0,
        };
      } catch (err) {
        console.warn("[buscarProdutos] erro em:", productId, err.message);
        return null;
      }
    });

    return (await Promise.all(promises)).filter(Boolean);
  }

  // ── ROTEAMENTO ────────────────────────────────────────────────────────────
  try {

    // ── FLUXO 1: BUSCA POR TERMO ──────────────────────────────────────────
    if (termoBusca) {
      console.log("[BUSCA] termo:", termoBusca, "| offset:", offset, "| ordenacao:", ordenacao);

      let items      = [];
      let total      = 0;
      let buscaOffset = offset;
      const LOTE     = 50; // máximo que a API aceita por vez
      const MAX_ITER = 4;  // no máximo 4 tentativas = 200 IDs vasculhados

      for (let iter = 0; iter < MAX_ITER && items.length < limite; iter++) {
        const searchUrl = `https://api.mercadolibre.com/products/search`
          + `?status=active&site_id=MLB`
          + `&q=${encodeURIComponent(termoBusca)}`
          + `&limit=${LOTE}`
          + `&offset=${buscaOffset}`;

        console.log(`[BUSCA] iter ${iter + 1} | offset: ${buscaOffset}`);
        const searchRes = await fetch(searchUrl, { headers: authHeaders });
        const searchRaw = await searchRes.text();

        if (!searchRes.ok) {
          console.error("[BUSCA] erro HTTP", searchRes.status, searchRaw.slice(0, 200));
          break;
        }

        const searchData = JSON.parse(searchRaw);
        total = searchData.paging?.total || total;
        const ids = (searchData.results || []).map(p => p.id);
        console.log(`[BUSCA] iter ${iter + 1} | ids recebidos: ${ids.length} | total ML: ${total}`);

        if (ids.length === 0) break; // sem mais resultados

        const loteItems = await buscarProdutosPorIds(ids, "busca_ml");
        console.log(`[BUSCA] iter ${iter + 1} | itens válidos neste lote: ${loteItems.length}`);

        // Evita duplicatas
        const existentes = new Set(items.map(i => i.id));
        const novos = loteItems.filter(i => !existentes.has(i.id));
        items = [...items, ...novos];

        buscaOffset += LOTE;

        // Se a API não tem mais resultados, para
        if (buscaOffset >= total) break;
      }

      console.log("[BUSCA] total itens válidos acumulados:", items.length);

      // Corta exatamente no limite solicitado
      items = items.slice(0, limite);

      // Ordenação
      if (ordenacao === "price_asc")               items.sort((a, b) => a.preco - b.preco);
      else if (ordenacao === "price_desc")          items.sort((a, b) => b.preco - a.preco);
      else if (ordenacao === "sold_quantity_desc")  items.sort((a, b) => b.vendidos - a.vendidos);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ total, items }),
      };
    }


    // ── FLUXO 2: MAIS VENDIDOS POR CATEGORIA ─────────────────────────────
    let items      = [];
    let totalItems = 0;

    const highlightsUrl = `https://api.mercadolibre.com/highlights/MLB/category/${categoria}`;
    console.log("[HIGHLIGHTS] url:", highlightsUrl);
    const highlightsRes = await fetch(highlightsUrl, { headers: authHeaders });

    if (highlightsRes.ok) {
      const highlightsData = await highlightsRes.json();
      const allIds         = (highlightsData.content || []).map(p => p.id);
      totalItems           = allIds.length;

      // Pega o dobro do limite para compensar nulls, depois corta em limite
      const pageIds = allIds.slice(offset, offset + limite * 2);
      console.log("[HIGHLIGHTS] total ids:", totalItems, "| ids buscados:", pageIds.length);

      if (pageIds.length > 0) {
        items = await buscarProdutosPorIds(pageIds, "mais_vendidos");
        items = items.slice(0, limite); // garante exatamente o limite
      }

    } else {
      console.warn("[HIGHLIGHTS] endpoint falhou, status:", highlightsRes.status);
      const raw = await highlightsRes.text();
      console.warn("[HIGHLIGHTS] resposta:", raw.slice(0, 200));
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ total: totalItems, items }),
    };

  } catch (err) {
    console.error("[ERRO GERAL]", err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Erro interno do servidor", details: err.message }),
    };
  }
};