// netlify/functions/mercadolivre.js
// Usa refresh_token para gerar access_token automaticamente

const AFILIADO_ID = "23098063";

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
      body: JSON.stringify({ error: "Variáveis de ambiente não configuradas: ML_CLIENT_ID, ML_CLIENT_SECRET, ML_REFRESH_TOKEN." }),
    };
  }

  // 1. Gera access_token usando o refresh_token
  let access_token = null;
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

    if (!tokenData.access_token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Falha ao gerar token", detalhes: tokenData }),
      };
    }

    access_token = tokenData.access_token;

  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Erro ao obter token", details: e.message }),
    };
  }

  // 2. Monta URL de busca
  const params    = event.queryStringParameters || {};
  const categoria = params.categoria || "MLB1648";
  const limite    = Math.min(parseInt(params.limite) || 20, 50);
  const offset    = parseInt(params.offset) || 0;
  const busca     = params.q || "";

  let searchUrl;
  if (busca) {
    searchUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(busca)}&sort=best_match&limit=${limite}&offset=${offset}`;
  } else {
    searchUrl = `https://api.mercadolibre.com/sites/MLB/search?category=${categoria}&sort=best_match&limit=${limite}&offset=${offset}`;
  }

  // 3. Faz a busca com o access_token
  try {
    const searchRes = await fetch(searchUrl, {
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Accept": "application/json",
      },
    });

    if (!searchRes.ok) {
      const errBody = await searchRes.text();
      return {
        statusCode: searchRes.status,
        headers,
        body: JSON.stringify({
          error: `Erro na API do Mercado Livre: ${searchRes.status}`,
          detalhes: errBody,
        }),
      };
    }

    const searchData = await searchRes.json();

    if (!searchData.results || searchData.results.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ total: 0, items: [] }),
      };
    }

    const items = searchData.results.map((item) => {
      const sep = item.permalink.includes("?") ? "&" : "?";
      const linkAfiliado = `${item.permalink}${sep}matt_tool=${AFILIADO_ID}&matt_word=&matt_source=mercadoneb&matt_campaign=achadinhos`;
      const imagem = item.thumbnail
        ? item.thumbnail.replace(/-(I|W|D)\.jpg$/i, "-O.jpg")
        : null;

      return {
        id:            item.id,
        titulo:        item.title,
        preco:         item.price,
        preco_original: item.original_price || null,
        desconto:      item.original_price
          ? Math.round((1 - item.price / item.original_price) * 100)
          : null,
        moeda:         item.currency_id,
        link:          linkAfiliado,
        imagem,
        vendedor:      item.seller?.nickname || "",
        condicao:      item.condition === "new" ? "Novo" : "Usado",
        frete_gratis:  item.shipping?.free_shipping || false,
        disponivel:    (item.available_quantity || 0) > 0,
        vendidos:      item.sold_quantity || 0,
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        total: searchData.paging?.total || items.length,
        items,
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Erro interno na função",
        details: err.message,
      }),
    };
  }
};