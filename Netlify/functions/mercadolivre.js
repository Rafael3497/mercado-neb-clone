// netlify/functions/mercadolivre.js
// Versão com diagnóstico + fallback para busca pública (sem token obrigatório)

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

  const params = event.queryStringParameters || {};
  const categoria = params.categoria || "MLB1648";
  const limite = Math.min(parseInt(params.limite) || 20, 50);
  const offset = parseInt(params.offset) || 0;
  const busca = params.q || "";

  // ─── Monta a URL de busca ────────────────────────────────────────
  let searchUrl;
  if (busca) {
    searchUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(busca)}&sort=best_match&limit=${limite}&offset=${offset}`;
  } else {
    searchUrl = `https://api.mercadolibre.com/sites/MLB/search?category=${categoria}&sort=best_match&limit=${limite}&offset=${offset}`;
  }

  // ─── Tenta com token primeiro (se credenciais existirem) ─────────
  const CLIENT_ID = process.env.ML_CLIENT_ID;
  const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;

  let authHeader = {};
  let tokenInfo = "sem_credenciais";

  if (CLIENT_ID && CLIENT_SECRET) {
    try {
      const tokenRes = await fetch("https://api.mercadolibre.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
      });

      const tokenData = await tokenRes.json();

      if (tokenRes.ok && tokenData.access_token) {
        authHeader = { Authorization: `Bearer ${tokenData.access_token}` };
        tokenInfo = "token_ok";
      } else {
        // Token falhou — continua sem token (busca pública ainda funciona)
        tokenInfo = `token_falhou: ${JSON.stringify(tokenData)}`;
      }
    } catch (e) {
      tokenInfo = `token_erro: ${e.message}`;
    }
  }

  // ─── Faz a busca (com ou sem token) ─────────────────────────────
  try {
    const searchRes = await fetch(searchUrl, { headers: authHeader });

    if (!searchRes.ok) {
      const errBody = await searchRes.text();
      return {
        statusCode: searchRes.status,
        headers,
        body: JSON.stringify({
          error: `Erro na busca ML: ${searchRes.status}`,
          url: searchUrl,
          token_status: tokenInfo,
          detalhes: errBody,
        }),
      };
    }

    const searchData = await searchRes.json();

    if (!searchData.results) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          total: 0,
          items: [],
          debug: { token_status: tokenInfo, resposta_ml: searchData },
        }),
      };
    }

    const items = searchData.results.map((item) => ({
      id: item.id,
      titulo: item.title,
      preco: item.price,
      preco_original: item.original_price || null,
      desconto: item.original_price
        ? Math.round((1 - item.price / item.original_price) * 100)
        : null,
      moeda: item.currency_id,
      link: `${item.permalink}${item.permalink.includes('?') ? '&' : '?'}matt_tool=23098063&matt_word=&matt_source=mercadoneb&matt_campaign=achadinhos`,
      imagem: item.thumbnail
        ? item.thumbnail.replace(/\-[A-Z]\.jpg$/, "-O.jpg")
        : null,
      vendedor: item.seller?.nickname || "",
      condicao: item.condition === "new" ? "Novo" : "Usado",
      frete_gratis: item.shipping?.free_shipping || false,
      disponivel: (item.available_quantity || 0) > 0,
      vendidos: item.sold_quantity || 0,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        total: searchData.paging?.total || items.length,
        items,
        // Remova a linha abaixo após confirmar que funciona:
        _debug_token: tokenInfo,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Erro interno na função",
        details: err.message,
        token_status: tokenInfo,
        url: searchUrl,
      }),
    };
  }
};