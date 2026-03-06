// netlify/functions/mercadolivre.js

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

  const CLIENT_ID = process.env.ML_CLIENT_ID;
  const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Variáveis ML_CLIENT_ID e ML_CLIENT_SECRET não configuradas." }),
    };
  }

  // 1. Gera o token
  let access_token = null;
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
    if (tokenData.access_token) {
      access_token = tokenData.access_token;
    }
  } catch (e) {
    // Continua sem token
  }

  const params = event.queryStringParameters || {};
  const categoria = params.categoria || "MLB1648";
  const limite = Math.min(parseInt(params.limite) || 20, 50);
  const offset = parseInt(params.offset) || 0;
  const busca = params.q || "";

  // 2. Monta URL — usa app_id E tenta com token no header
  let searchUrl;
  if (busca) {
    searchUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(busca)}&sort=best_match&limit=${limite}&offset=${offset}&app_id=${CLIENT_ID}`;
  } else {
    searchUrl = `https://api.mercadolibre.com/sites/MLB/search?category=${categoria}&sort=best_match&limit=${limite}&offset=${offset}&app_id=${CLIENT_ID}`;
  }

  // 3. Monta headers da requisição
  const reqHeaders = {
    "Accept": "application/json",
    "User-Agent": "MercadoNEB/1.0",
  };
  if (access_token) {
    reqHeaders["Authorization"] = `Bearer ${access_token}`;
  }

  try {
    const searchRes = await fetch(searchUrl, { headers: reqHeaders });

    if (!searchRes.ok) {
      const errBody = await searchRes.text();
      return {
        statusCode: searchRes.status,
        headers,
        body: JSON.stringify({
          error: `Erro na API: ${searchRes.status}`,
          detalhes: errBody,
          token_gerado: !!access_token,
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
        disponivel: (item.available_quantity || 0) > 0,
        vendidos: item.sold_quantity || 0,
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
        error: "Erro interno",
        details: err.message,
      }),
    };
  }
};