// netlify/functions/mercadolivre.js
// Fluxo: highlights → product/items → item details

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
      body: JSON.stringify({ error: "Variáveis ML_CLIENT_ID, ML_CLIENT_SECRET e ML_REFRESH_TOKEN não configuradas." }),
    };
  }

  // 1. Gera access_token via refresh_token
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

  const authHeaders = {
    "Authorization": `Bearer ${access_token}`,
    "Accept": "application/json",
  };

  const params    = event.queryStringParameters || {};
  const categoria = params.categoria || "MLB1648";
  const limite    = Math.min(parseInt(params.limite) || 20, 50);

  try {
    // 2. Busca highlights da categoria (produtos em destaque)
    const highlightsRes = await fetch(
      `https://api.mercadolibre.com/highlights/MLB/category/${categoria}`,
      { headers: authHeaders }
    );

    if (!highlightsRes.ok) {
      const err = await highlightsRes.text();
      return {
        statusCode: highlightsRes.status,
        headers,
        body: JSON.stringify({ error: `Erro highlights: ${highlightsRes.status}`, detalhes: err }),
      };
    }

    const highlightsData = await highlightsRes.json();
    const productIds = (highlightsData.content || [])
      .slice(0, limite)
      .map(p => p.id);

    if (productIds.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ total: 0, items: [] }),
      };
    }

    // 3. Para cada product_id, busca o item_id correspondente (em paralelo)
    const itemIdPromises = productIds.map(async (productId) => {
      try {
        const res = await fetch(
          `https://api.mercadolibre.com/products/${productId}/items?limit=1`,
          { headers: authHeaders }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return data.results?.[0]?.item_id || null;
      } catch {
        return null;
      }
    });

    const itemIds = (await Promise.all(itemIdPromises)).filter(Boolean);

    if (itemIds.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ total: 0, items: [] }),
      };
    }

    // 4. Busca detalhes de todos os itens de uma vez
    const itemsRes = await fetch(
      `https://api.mercadolibre.com/items?ids=${itemIds.join(",")}&attributes=id,title,price,original_price,permalink,thumbnail,condition,shipping,available_quantity,sold_quantity,seller,currency_id`,
      { headers: authHeaders }
    );

    if (!itemsRes.ok) {
      const err = await itemsRes.text();
      return {
        statusCode: itemsRes.status,
        headers,
        body: JSON.stringify({ error: `Erro ao buscar itens: ${itemsRes.status}`, detalhes: err }),
      };
    }

    const itemsData = await itemsRes.json();
    const items = itemsData
      .filter(i => i.code === 200 && i.body)
      .map(i => formatItem(i.body));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ total: items.length, items }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Erro interno", details: err.message }),
    };
  }
};

function formatItem(item) {
  const sep = item.permalink?.includes("?") ? "&" : "?";
  const linkAfiliado = `${item.permalink}${sep}matt_tool=${AFILIADO_ID}&matt_word=&matt_source=mercadoneb&matt_campaign=achadinhos`;
  const imagem = item.thumbnail
    ? item.thumbnail.replace(/-(I|W|D)\.jpg$/i, "-O.jpg")
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
    disponivel:     (item.available_quantity || 0) > 0,
    vendidos:       item.sold_quantity || 0,
  };
}