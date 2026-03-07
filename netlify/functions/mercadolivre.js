// netlify/functions/mercadolivre.js

const AFILIADO_ID = "23098063";

// Cache em memória do access_token (válido por ~6h na mesma instância)
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

  // ── 1. GERA / REUTILIZA ACCESS TOKEN ──────────────────────────────────────
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
      console.log("[TOKEN] status:", tokenRes.status, JSON.stringify({
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
      // expires_in vem em segundos; guardamos com 5min de margem
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

  // ── 2. PARÂMETROS DA REQUISIÇÃO ───────────────────────────────────────────
  const params     = event.queryStringParameters || {};
  const categoria  = params.categoria || "MLB1051";
  const limite     = Math.min(parseInt(params.limite) || 20, 50);
  const offset     = parseInt(params.offset) || 0;
  const termoBusca = params.q ? params.q.trim() : null;
  const ordenacao  = params.ordenacao || "relevance";

  const SORT_MAP = {
    price_asc:          "price_asc",
    price_desc:         "price_desc",
    sold_quantity_desc: "sold_quantity_desc",
  };
  // "relevance" não é aceito como parâmetro sort — simplesmente não envia
  const sortQuery = SORT_MAP[ordenacao] ? `&sort=${SORT_MAP[ordenacao]}` : "";

  // ── 3. HELPER: fetch + parse da busca normal ──────────────────────────────
  async function fetchSearch(url) {
    console.log("[fetchSearch] url:", url);
    const res = await fetch(url, { headers: authHeaders });
    const raw = await res.text();

    if (!res.ok) {
      console.error("[fetchSearch] erro HTTP", res.status, raw.slice(0, 300));
      throw new Error(`API ML retornou ${res.status}: ${raw.slice(0, 200)}`);
    }

    let data;
    try { data = JSON.parse(raw); }
    catch { throw new Error("Resposta inválida (não é JSON): " + raw.slice(0, 200)); }

    const total = data.paging?.total || 0;
    const items = (data.results || []).map(item => {
      const permalink    = item.permalink
        || `https://produto.mercadolivre.com.br/MLB-${item.id.replace("MLB", "")}`;
      const sep          = permalink.includes("?") ? "&" : "?";
      const linkAfiliado = `${permalink}${sep}matt_tool=${AFILIADO_ID}&matt_word=&matt_source=mercadoneb&matt_campaign=busca_ml`;
      const imagem       = item.thumbnail
        ? item.thumbnail.replace("-I.jpg", "-O.jpg")
        : null;

      return {
        id:             item.id,
        titulo:         item.title,
        preco:          item.price,
        preco_original: item.original_price || null,
        desconto:       item.original_price
          ? Math.round((1 - item.price / item.original_price) * 100)
          : null,
        moeda:          item.currency_id,
        link:           linkAfiliado,
        imagem,
        vendedor:       item.seller?.nickname || "",
        condicao:       item.condition === "new" ? "Novo" : "Usado",
        frete_gratis:   item.shipping?.free_shipping || false,
        disponivel:     true,
        vendidos:       item.sold_quantity || 0,
      };
    });

    console.log("[fetchSearch] total:", total, "| itens parseados:", items.length);
    return { total, items };
  }

  // ── 4. ROTEAMENTO ─────────────────────────────────────────────────────────
  try {

    // ── FLUXO 1: BUSCA POR TERMO (busca.html) ──────────────────────────────
    if (termoBusca) {
      const url = `https://api.mercadolibre.com/sites/MLB/search`
        + `?q=${encodeURIComponent(termoBusca)}`
        + `&limit=${limite}`
        + `&offset=${offset}`
        + sortQuery;

      console.log("[BUSCA] termo:", termoBusca, "| ordenacao:", ordenacao);
      const resultado = await fetchSearch(url);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ total: resultado.total, items: resultado.items }),
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
        const promises = pageIds.map(async (productId) => {
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
            const linkAfiliado = `${permalink}${sep}matt_tool=${AFILIADO_ID}&matt_word=&matt_source=mercadoneb&matt_campaign=mais_vendidos`;
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
              vendidos:       0,
            };
          } catch (err) {
            console.warn("[HIGHLIGHTS] erro em produto:", productId, err.message);
            return null;
          }
        });

        items = (await Promise.all(promises)).filter(Boolean);
      }

      // Complementa com busca normal se highlights trouxer poucos
      if (items.length < limite) {
        const faltam  = limite - items.length;
        const urlComp = `https://api.mercadolibre.com/sites/MLB/search?category=${categoria}&limit=${faltam}&offset=${offset}`;
        try {
          const comp          = await fetchSearch(urlComp);
          const existentes    = new Set(items.map(i => i.id));
          const novos         = comp.items.filter(i => !existentes.has(i.id));
          items               = [...items, ...novos].slice(0, limite);
          totalItems          = Math.max(totalItems, comp.total);
        } catch (e) {
          console.warn("[HIGHLIGHTS] fallback busca falhou:", e.message);
        }
      }

    } else {
      // Highlights falhou — usa busca por categoria diretamente
      console.warn("[HIGHLIGHTS] endpoint falhou, usando busca por categoria");
      const url       = `https://api.mercadolibre.com/sites/MLB/search?category=${categoria}&limit=${limite}&offset=${offset}`;
      const resultado = await fetchSearch(url);
      items           = resultado.items;
      totalItems      = resultado.total;
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