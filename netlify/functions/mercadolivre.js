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

  const CLIENT_ID     = process.env.ML_CLIENT_ID;
  const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.ML_REFRESH_TOKEN;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Variáveis ML_CLIENT_ID, ML_CLIENT_SECRET e ML_REFRESH_TOKEN não configuradas." }) };
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
      return { statusCode: 401, headers, body: JSON.stringify({ error: "Falha ao gerar token" }) };
    }
    access_token = tokenData.access_token;
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Erro ao obter token", details: e.message }) };
  }

  const authHeaders = {
    "Authorization": `Bearer ${access_token}`,
    "Accept": "application/json",
  };

  const params    = event.queryStringParameters || {};
  const categoria = params.categoria || "todas";
  const limite    = Math.min(parseInt(params.limite) || 20, 50);
  const busca     = params.q || ""; 
  const offset    = parseInt(params.offset) || 0;

  // Função auxiliar para padronizar e processar buscas nativas
  async function fetchSearch(url) {
    const res = await fetch(url, { headers: authHeaders });
    if (!res.ok) throw new Error(`Erro API Busca: ${res.status}`);
    const data = await res.json();
    const total = data.paging?.total || 0;
    
    const parsedItems = data.results.map(item => {
      const permalink = item.permalink;
      const sep = permalink.includes("?") ? "&" : "?";
      const linkAfiliado = `${permalink}${sep}matt_tool=${AFILIADO_ID}&matt_word=&matt_source=mercadoneb&matt_campaign=achadinhos_busca`;
      
      // Otimiza a resolução da imagem substituindo a terminação
      const imagem = item.thumbnail ? item.thumbnail.replace("-I.jpg", "-O.jpg") : null;

      return {
        id:             item.id,
        titulo:         item.title,
        preco:          item.price,
        preco_original: item.original_price || null,
        desconto:       item.original_price ? Math.round((1 - item.price / item.original_price) * 100) : null,
        moeda:          item.currency_id,
        link:           linkAfiliado,
        imagem:         imagem,
        vendedor:       "",
        condicao:       item.condition === "new" ? "Novo" : "Usado",
        frete_gratis:   item.shipping?.free_shipping || false,
        disponivel:     true,
        vendidos:       0,
      };
    });
    return { total, items: parsedItems };
  }

  try {
    let items = [];
    let totalItems = 0;

    if (busca !== "") {
      // FLUXO 1: O utilizador digitou algo na barra de pesquisa
      const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(busca)}&limit=${limite}&offset=${offset}`;
      const res = await fetchSearch(url);
      items = res.items; totalItems = res.total;
    } 
    else if (categoria === "todas") {
      // FLUXO 2: Nova opção "Todas as Categorias"
      const url = `https://api.mercadolibre.com/sites/MLB/search?q=ofertas&limit=${limite}&offset=${offset}`;
      const res = await fetchSearch(url);
      items = res.items; totalItems = res.total;
    } 
    else {
      // FLUXO 3: Seleção de Categoria específica
      const highlightsUrl = `https://api.mercadolibre.com/highlights/MLB/category/${categoria}`;
      const highlightsRes = await fetch(highlightsUrl, { headers: authHeaders });

      if (highlightsRes.ok) {
        // Se a API tiver achadinhos curados para esta categoria, seguimos o fluxo normal
        const highlightsData = await highlightsRes.json();
        const allProductIds = (highlightsData.content || []).map(p => p.id);
        totalItems = allProductIds.length;
        const productIds = allProductIds.slice(offset, offset + limite);

        if (productIds.length > 0) {
          const itemPromises = productIds.map(async (productId) => {
            try {
              const [productRes, itemRes] = await Promise.all([
                fetch(`https://api.mercadolibre.com/products/${productId}`, { headers: authHeaders }),
                fetch(`https://api.mercadolibre.com/products/${productId}/items?limit=1`, { headers: authHeaders }),
              ]);
              if (!productRes.ok || !itemRes.ok) return null;
              
              const productData = await productRes.json();
              const itemData = await itemRes.json();
              const itemInfo = itemData.results?.[0];
              if (!itemInfo) return null;

              const permalink = `https://www.mercadolivre.com.br/p/${productId}`;
              const sep = permalink.includes("?") ? "&" : "?";
              const linkAfiliado = `${permalink}${sep}matt_tool=${AFILIADO_ID}&matt_word=&matt_source=mercadoneb&matt_campaign=achadinhos_categoria`;
              const imagem = productData.pictures?.[0]?.url || productData.pictures?.[0]?.thumbnail || null;

              return {
                id:             itemInfo.item_id,
                titulo:         productData.name || productData.family_name || itemInfo.item_id,
                preco:          itemInfo.price,
                preco_original: itemInfo.original_price || null,
                desconto:       itemInfo.original_price ? Math.round((1 - itemInfo.price / itemInfo.original_price) * 100) : null,
                moeda:          itemInfo.currency_id,
                link:           linkAfiliado,
                imagem,
                vendedor:       "",
                condicao:       itemInfo.condition === "new" ? "Novo" : "Usado",
                frete_gratis:   itemInfo.shipping?.free_shipping || false,
                disponivel:     true,
                vendidos:       0,
              };
            } catch { return null; }
          });
          items = (await Promise.all(itemPromises)).filter(Boolean);
        }
      } else {
        // FLUXO DE SEGURANÇA (FALLBACK): Se der o erro 404
        // O servidor desvia o tráfego para a busca por categoria nativa, evitando qualquer erro no ecrã do utilizador.
        const url = `https://api.mercadolibre.com/sites/MLB/search?category=${categoria}&limit=${limite}&offset=${offset}`;
        const res = await fetchSearch(url);
        items = res.items; totalItems = res.total;
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ total: totalItems, items }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Erro interno", details: err.message }) };
  }
};