// netlify/functions/mercadolivre.js

const AFILIADO_ID = "23098063";

exports.handler = async (event) => {

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
        error: "Variáveis ML_CLIENT_ID, ML_CLIENT_SECRET e ML_REFRESH_TOKEN não configuradas."
      }),
    };
  }

  // =============================
  // GERAR ACCESS TOKEN
  // =============================

  let access_token = null;

  try {

    const tokenRes = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
      }),
    });

    const tokenData = await tokenRes.json();

    console.log("[TOKEN]", tokenRes.status, tokenData.error || "ok");

    if (!tokenData.access_token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: "Falha ao gerar token",
          detalhes: tokenData
        }),
      };
    }

    access_token = tokenData.access_token;

  } catch (e) {

    console.error("[TOKEN ERROR]", e);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Erro ao obter token",
        details: e.message
      }),
    };
  }

  const authHeaders = {
    Authorization: `Bearer ${access_token}`,
    Accept: "application/json",
  };

  // =============================
  // PARAMETROS
  // =============================

  const params = event.queryStringParameters || {};

  const categoria  = params.categoria || "MLB1051";
  const limite     = Math.min(parseInt(params.limite) || 20, 50);
  const offset     = parseInt(params.offset) || 0;
  const termoBusca = params.q || null;
  const ordenacao  = params.ordenacao || "relevance";

  const SORT_MAP = {
    relevance: "relevance",
    price_asc: "price_asc",
    price_desc: "price_desc",
    sold_quantity_desc: "sold_quantity_desc",
  };

  const sortParam = SORT_MAP[ordenacao] || "relevance";

  // =============================
  // FETCH COM RETRY
  // =============================

  async function fetchWithRetry(url, headers, tentativas = 3) {

    for (let i = 0; i < tentativas; i++) {

      const res = await fetch(url, { headers });

      if (res.ok) return res;

      const txt = await res.text();

      console.error("[API ERROR]", res.status, txt);

      if (res.status !== 403) break;

      await new Promise(r => setTimeout(r, 400));
    }

    throw new Error("Falha ao consultar API Mercado Livre");
  }

  // =============================
  // FUNÇÃO DE BUSCA
  // =============================

  async function fetchSearch(url) {

    console.log("[fetchSearch]", url);

    const res = await fetchWithRetry(url, authHeaders);

    const data = await res.json();

    const total = data.paging?.total || 0;

    const parsedItems = (data.results || []).map(item => {

      const permalink =
        item.permalink ||
        `https://produto.mercadolivre.com.br/${item.id}`;

      const sep = permalink.includes("?") ? "&" : "?";

      const linkAfiliado =
        `${permalink}${sep}matt_tool=${AFILIADO_ID}&matt_source=mercadoneb&matt_campaign=busca_ml`;

      let imagem = item.thumbnail || null;

      if (imagem) {
        imagem = imagem.replace(/\-I\.jpg$/, "-O.jpg");
      }

      return {
        id: item.id,
        titulo: item.title,
        preco: item.price,
        preco_original: item.original_price || null,
        desconto: item.original_price
          ? Math.round((1 - item.price / item.original_price) * 100)
          : null,
        moeda: item.currency_id,
        link: linkAfiliado,
        imagem,
        vendedor: item.seller?.nickname || "",
        condicao: item.condition === "new" ? "Novo" : "Usado",
        frete_gratis: item.shipping?.free_shipping || false,
        disponivel: true,
        vendidos: item.sold_quantity || 0,
      };

    });

    return { total, items: parsedItems };
  }

  // =============================
  // LOGICA PRINCIPAL
  // =============================

  try {

    // =============================
    // BUSCA POR TERMO
    // =============================

    if (termoBusca) {

      const sortQuery =
        sortParam !== "relevance"
          ? `&sort=${sortParam}`
          : "";

      const url =
        `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(termoBusca)}&limit=${limite}&offset=${offset}${sortQuery}`;

      console.log("[BUSCA]", termoBusca);

      const resultado = await fetchSearch(url);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          total: resultado.total,
          items: resultado.items
        }),
      };
    }

    // =============================
    // ACHADINHOS POR CATEGORIA
    // =============================

    let items = [];
    let totalItems = 0;

    const highlightsUrl =
      `https://api.mercadolibre.com/highlights/MLB/category/${categoria}`;

    const highlightsRes =
      await fetchWithRetry(highlightsUrl, authHeaders);

    if (highlightsRes.ok) {

      const highlightsData = await highlightsRes.json();

      const allProductIds =
        (highlightsData.content || []).map(p => p.id);

      totalItems = allProductIds.length;

      const productIds =
        allProductIds.slice(offset, offset + limite);

      const itemPromises = productIds.map(async (productId) => {

        try {

          const [productRes, itemRes] =
            await Promise.all([
              fetch(`https://api.mercadolibre.com/products/${productId}`, { headers: authHeaders }),
              fetch(`https://api.mercadolibre.com/products/${productId}/items?limit=1`, { headers: authHeaders }),
            ]);

          if (!productRes.ok || !itemRes.ok) return null;

          const productData = await productRes.json();
          const itemData = await itemRes.json();

          const itemInfo = itemData.results?.[0];
          if (!itemInfo) return null;

          const permalink = itemInfo.permalink;

          const sep = permalink.includes("?") ? "&" : "?";

          const linkAfiliado =
            `${permalink}${sep}matt_tool=${AFILIADO_ID}&matt_source=mercadoneb&matt_campaign=achadinhos_categoria`;

          const imagem =
            productData.pictures?.[0]?.url ||
            productData.pictures?.[0]?.thumbnail ||
            null;

          return {
            id: itemInfo.item_id,
            titulo: productData.name || itemInfo.item_id,
            preco: itemInfo.price,
            preco_original: itemInfo.original_price || null,
            desconto: itemInfo.original_price
              ? Math.round((1 - itemInfo.price / itemInfo.original_price) * 100)
              : null,
            moeda: itemInfo.currency_id,
            link: linkAfiliado,
            imagem,
            vendedor: "",
            condicao: itemInfo.condition === "new" ? "Novo" : "Usado",
            frete_gratis: itemInfo.shipping?.free_shipping || false,
            disponivel: true,
            vendidos: 0,
          };

        } catch {
          return null;
        }

      });

      items = (await Promise.all(itemPromises)).filter(Boolean);

    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        total: totalItems,
        items
      }),
    };

  } catch (err) {

    console.error("[ERRO GERAL]", err);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Erro interno do Servidor",
        details: err.message
      }),
    };
  }

};