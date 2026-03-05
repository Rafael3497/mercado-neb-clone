// netlify/functions/mercadolivre.js
// Instale: não precisa de dependências extras, usa fetch nativo do Node 18+

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", // troque pelo seu domínio em produção
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };

  // Preflight CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const CLIENT_ID = process.env.ML_CLIENT_ID;
  const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Credenciais não configuradas nas variáveis de ambiente." }),
    };
  }

  try {
    // 1. Obter Access Token (App Token — sem necessidade de usuário logado)
    const tokenRes = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.json();
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Falha ao obter token", details: err }),
      };
    }

    const { access_token } = await tokenRes.json();

    // 2. Buscar ofertas/promoções — categoria ou busca configurável via query param
    const params = event.queryStringParameters || {};
    const categoria = params.categoria || "MLB1648"; // Eletrônicos por padrão
    const limite = Math.min(parseInt(params.limite) || 20, 50);
    const offset = parseInt(params.offset) || 0;
    const busca = params.q || "";

    let searchUrl;
    if (busca) {
      searchUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(busca)}&sort=price_asc&limit=${limite}&offset=${offset}&promotions=DEAL_OF_THE_DAY`;
    } else {
      searchUrl = `https://api.mercadolibre.com/sites/MLB/search?category=${categoria}&sort=best_match&limit=${limite}&offset=${offset}`;
    }

    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const searchData = await searchRes.json();
    const items = (searchData.results || []).map((item) => ({
      id: item.id,
      titulo: item.title,
      preco: item.price,
      preco_original: item.original_price || null,
      desconto: item.original_price
        ? Math.round((1 - item.price / item.original_price) * 100)
        : null,
      moeda: item.currency_id,
      link: item.permalink,
      imagem: item.thumbnail?.replace("I.jpg", "O.jpg"), // imagem maior
      vendedor: item.seller?.nickname || "",
      condicao: item.condition === "new" ? "Novo" : "Usado",
      frete_gratis: item.shipping?.free_shipping || false,
      disponivel: item.available_quantity > 0,
      vendidos: item.sold_quantity || 0,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        total: searchData.paging?.total || 0,
        items,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Erro interno", details: err.message }),
    };
  }
};
