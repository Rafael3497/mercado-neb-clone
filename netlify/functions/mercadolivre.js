// netlify/functions/mercadolivre.js
// Usa endpoints públicos que não exigem certificação

const AFILIADO_ID = "23098063";

// Categorias com seus IDs para highlights
const CATEGORIAS = {
  "MLB1648": "Eletrônicos",
  "MLB1499": "Moda",
  "MLB1574": "Casa",
  "MLB1246": "Esportes",
  "MLB1144": "Video Games",
  "MLB1459": "Beleza",
  "MLB1132": "Ferramentas",
  "MLB1071": "Veículos",
  "MLB1367": "Livros",
};

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

  // 1. Gera access_token via refresh_token
  let access_token = null;
  if (CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN) {
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
      if (tokenData.access_token) access_token = tokenData.access_token;
    } catch (e) {}
  }

  const authHeaders = access_token
    ? { "Authorization": `Bearer ${access_token}`, "Accept": "application/json" }
    : { "Accept": "application/json" };

  const params    = event.queryStringParameters || {};
  const categoria = params.categoria || "MLB1648";
  const limite    = Math.min(parseInt(params.limite) || 20, 50);
  const offset    = parseInt(params.offset) || 0;
  const busca     = params.q || "";

  // 2. Tenta diferentes endpoints em ordem
  const endpoints = [];

  if (busca) {
    // Busca por texto
    endpoints.push(
      `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(busca)}&limit=${limite}&offset=${offset}`,
    );
  } else {
    // Highlights da categoria (produtos em destaque — não exige certificação)
    endpoints.push(
      `https://api.mercadolibre.com/highlights/MLB/category/${categoria}`,
      `https://api.mercadolibre.com/sites/MLB/search?category=${categoria}&sort=best_match&limit=${limite}&offset=${offset}`,
    );
  }

  let lastError = null;

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers: authHeaders });

      if (!res.ok) {
        lastError = { status: res.status, url, body: await res.text() };
        continue; // tenta o próximo endpoint
      }

      const data = await res.json();

      // Highlights retorna formato diferente: { content: [ {id, position}, ... ] }
      // Precisamos buscar detalhes dos itens
      if (data.content && Array.isArray(data.content)) {
        const ids = data.content.slice(0, limite).map(i => i.id).join(",");
        if (!ids) return { statusCode: 200, headers, body: JSON.stringify({ total: 0, items: [] }) };

        const itemsRes = await fetch(
          `https://api.mercadolibre.com/items?ids=${ids}&attributes=id,title,price,original_price,permalink,thumbnail,condition,shipping,available_quantity,sold_quantity,seller`,
          { headers: authHeaders }
        );

        if (!itemsRes.ok) {
          lastError = { status: itemsRes.status, url: `items?ids=${ids}`, body: await itemsRes.text() };
          continue;
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
      }

      // Formato padrão de busca
      if (data.results && data.results.length > 0) {
        const items = data.results.map(formatItem);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ total: data.paging?.total || items.length, items }),
        };
      }

    } catch (e) {
      lastError = { error: e.message, url };
    }
  }

  // Todos os endpoints falharam
  return {
    statusCode: 403,
    headers,
    body: JSON.stringify({
      error: "Não foi possível carregar produtos. Verifique as configurações do app no ML Developers.",
      ultimo_erro: lastError,
    }),
  };
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