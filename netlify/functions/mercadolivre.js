// netlify/functions/mercadolivre.js
// Fluxo: highlights → product/items (sem precisar do /items que dá 403)

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
    // 2. Busca highlights da categoria
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

    // 3. Para cada product_id busca dados do item via /products/:id/items
    // Esse endpoint NÃO dá 403 e já tem preço, frete e condição
    const itemPromises = productIds.map(async (productId) => {
      try {
        // Busca dados do produto (nome, imagem)
        const [productRes, itemRes] = await Promise.all([
          fetch(`https://api.mercadolibre.com/products/${productId}`, { headers: authHeaders }),
          fetch(`https://api.mercadolibre.com/products/${productId}/items?limit=1`, { headers: authHeaders }),
        ]);

        if (!productRes.ok || !itemRes.ok) return null;

        const [productData, itemData] = await Promise.all([
          productRes.json(),
          itemRes.json(),
        ]);

        const itemInfo = itemData.results?.[0];
        if (!itemInfo) return null;

        // Monta permalink com item_id
        const permalink = `https://www.mercadolivre.com.br/p/${productId}`;
        const sep = permalink.includes("?") ? "&" : "?";
        const linkAfiliado = `${permalink}${sep}matt_tool=${AFILIADO_ID}&matt_word=&matt_source=mercadoneb&matt_campaign=achadinhos`;

        // Pega imagem do produto
        const imagem = productData.pictures?.[0]?.url
          || productData.pictures?.[0]?.thumbnail
          || null;

        return {
          id:             itemInfo.item_id,
          titulo:         productData.name || productData.family_name || itemInfo.item_id,
          preco:          itemInfo.price,
          preco_original: itemInfo.original_price || null,
          desconto:       itemInfo.original_price
            ? Math.round((1 - itemInfo.price / itemInfo.original_price) * 100)
            : null,
          moeda:          itemInfo.currency_id,
          link:           linkAfiliado,
          imagem,
          vendedor:       "",
          condicao:       itemInfo.condition === "new" ? "Novo" : "Usado",
          frete_gratis:   itemInfo.shipping?.free_shipping || false,
          disponivel:     true,
          vendidos:       0,
        };
      } catch {
        return null;
      }
    });

    const items = (await Promise.all(itemPromises)).filter(Boolean);

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