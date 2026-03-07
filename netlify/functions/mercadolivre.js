// netlify/functions/mercadolivre.js

const AFILIADO_ID = "23098063";

// Cache do token de usuário (para highlights e products)
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
      body: JSON.stringify({
        error: "Variáveis ML_CLIENT_ID, ML_CLIENT_SECRET e ML_REFRESH_TOKEN não configuradas.",
      }),
    };
  }

  // ── TOKEN DE USUÁRIO (para highlights e products) ────────────────────────
  const agora = Date.now();
  if (!cachedToken || agora >= tokenExpiraEm) {
    try {
      const tokenRes = await fetch("https://api.mercadolibre.com/oauth/token", {
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
      console.log("[TOKEN USER] status:", tokenRes.status, JSON.stringify({
        ok: !!tokenData.access_token,
        error: tokenData.error || null,
        message: tokenData.message || null,
      }));

      if (!tokenData.access_token) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            error: "Falha ao gerar access_token. Verifique se o REFRESH_TOKEN ainda é válido.",
            detalhes: tokenData,
          }),
        };
      }

      cachedToken   = tokenData.access_token;
      tokenExpiraEm = agora + ((tokenData.expires_in || 21600) - 300) * 1000;

    } catch (e) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Erro de rede ao obter token de usuário", details: e.message }),
      };
    }
  }

  const authHeaders = {
    "Authorization": `Bearer ${cachedToken}`,
    "Accept": "application/json",
  };

  // ── PARÂMETROS DA REQUISIÇÃO ──────────────────────────────────────────────
  const params     = event.queryStringParameters || {};
  const categoria  = params.categoria || "MLB1051";
  const limite     = Math.min(parseInt(params.limite) || 20, 50);
  const offset     = parseInt(params.offset) || 0;
  const termoBusca = params.q ? params.q.trim() : null;
  const ordenacao  = params.ordenacao || "relevance";

  // ── HELPER: busca produtos por IDs (igual Mais Vendidos) ─────────────────
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
        if (!info) return null;

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

    // ── FLUXO 1: BUSCA POR TERMO (busca.html) ────────────────────────────
    // Usa /products/search (autenticado) — MESMA LÓGICA dos Mais Vendidos
    if (termoBusca) {
      console.log("[BUSCA] termo:", termoBusca, "| offset:", offset, "| ordenacao:", ordenacao);

      const searchUrl = `https://api.mercadolibre.com/products/search`
        + `?status=active&site_id=MLB`
        + `&q=${encodeURIComponent(termoBusca)}`
        + `&limit=${limite}`
        + `&offset=${offset}`;

      console.log("[BUSCA] url:", searchUrl);
      const searchRes = await fetch(searchUrl, { headers: authHeaders });
      const searchRaw = await searchRes.text();

      if (!searchRes.ok) {
        console.error("[BUSCA] erro HTTP", searchRes.status, searchRaw.slice(0, 300));
        throw new Error(`/products/search retornou ${searchRes.status}: ${searchRaw.slice(0, 200)}`);
      }

      const searchData = JSON.parse(searchRaw);
      const total      = searchData.paging?.total || 0;
      const ids        = (searchData.results || []).map(p => p.id);
      console.log("[BUSCA] total:", total, "| ids encontrados:", ids.length);

      // Busca detalhes de cada produto — igual ao fluxo Mais Vendidos
      let items = await buscarProdutosPorIds(ids, "busca_ml");
      console.log("[BUSCA] itens com preço:", items.length);

      // Ordenação por preço/vendidos no servidor (já que /products/search não suporta sort)
      if (ordenacao === "price_asc")          items.sort((a, b) => a.preco - b.preco);
      else if (ordenacao === "price_desc")    items.sort((a, b) => b.preco - a.preco);
      else if (ordenacao === "sold_quantity_desc") items.sort((a, b) => b.vendidos - a.vendidos);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ total, items }),
      };
    }

    // ── FLUXO 2: MAIS VENDIDOS POR CATEGORIA (mais_vendidos.html) ──────────
    let items      = [];
    let totalItems = 0;

    const highlightsUrl = `https://api.mercadolibre.com/highlights/MLB/category/${categoria}`;
    console.log("[HIGHLIGHTS] url:", highlightsUrl);
    const highlightsRes = await fetch(highlightsUrl, { headers: authHeaders });

    if (highlightsRes.ok) {
      const highlightsData = await highlightsRes.json();
      const allIds         = (highlightsData.content || []).map(p => p.id);
      totalItems           = allIds.length;
      const pageIds        = allIds.slice(offset, offset + limite);
      console.log("[HIGHLIGHTS] total ids:", totalItems, "| ids nesta página:", pageIds.length);

      if (pageIds.length > 0) {
        items = await buscarProdutosPorIds(pageIds, "mais_vendidos");
      }

    } else {
      // Highlights falhou — usa busca por categoria como fallback
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