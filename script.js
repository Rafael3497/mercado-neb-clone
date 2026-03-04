/* ==========================================
   BANCO DE DADOS DE PRODUTOS (CORRIGIDO COM ID)
   ========================================== */
const meusProdutos = [
{
        id: "p56",
        nome: "Best Vegan - Pote 500g - Proteína Vegana - Atlhetica Nutrit Sabor Leite",
        desc: "É um suplemento alimentar de alta qualidade, desenvolvido especialmente para quem busca uma alimentação 100% vegetal sem abrir mão de nutrientes essenciais. Com uma fórmula rica em proteínas vegetais, vitaminas e minerais, é ideal para veganos, vegetarianos e aqueles que desejam adotar uma alimentação mais saudável e equilibrada.",
        preco: "129,77",
        categoria: "saude",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_789213-MLU78239361549_082024-F.webp",
        link: "https://meli.la/29U6MSe"
    },
{
        id: "p55",
        nome: "Best Vegan Atlhetica Nutrition 500g Bolo de Banana",
        desc: "É um suplemento alimentar de alta qualidade, desenvolvido especialmente para quem busca uma alimentação 100% vegetal sem abrir mão de nutrientes essenciais. Com uma fórmula rica em proteínas vegetais, vitaminas e minerais, é ideal para veganos, vegetarianos e aqueles que desejam adotar uma alimentação mais saudável e equilibrada.",
        preco: "118,00",
        categoria: "saude",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_714987-MLA99402296932_112025-F.webp",
        link: "https://meli.la/29U6MSe"
    },
{
        id: "p54",
        nome: "Faixa de Graduação Infantil Karate Jiu Jitsu Judô Branca Haganah M3",
        desc: "A Faixa de Graduação Elite Haganah oferece a oportunidade de vestir as cores da tradição e excelência das artes marciais, acompanhando-o em sua jornada de aprendizado e evolução.",
        preco: "35,49",
        categoria: "fitness",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_681541-MLA99600105554_122025-F.webp",
        link: "https://meli.la/1vNTakV"
    },
{
        id: "p53",
        nome: "Jogo War Edição Especial Grow",
        desc: "O melhor jogo de estratégia de todos os tempos, agora em versão de luxo! Jogue com miniaturas de soldados e tanques representando os exércitos em um tabuleiro maior que o convencional.",
        preco: "138,13",
        categoria: "casa",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_954039-MLA99943624993_112025-F.webp",
        link: "https://meli.la/2yFsd6u"
    },
{
        id: "p52",
        nome: "Vichy Dercos Energy+, Shampoo Estimulante, Tratamento Antiqueda para Cabelos Fracos e Quebradiços.",
        desc: "Fortalece os Fios com Aminexil, Niacinamida e Vitamina E, 400g.",
        preco: "99,90",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/51b74hm3qrL._AC_SX342_SY445_QL70_ML2_.jpg",
        link: "https://amzn.to/4aNpIT3"
    },
{
        id: "p51",
        nome: "24 Colheres De Sopa Aço Inox Cabo Plástico Vermelho Luna Vermelho.",
        desc: "As colheres de mesa da linha Luna são um conjunto elegante e funcional para qualquer ocasião.",
        preco: "44,90",
        categoria: "casa",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_906495-MLB106591516242_022026-O.webp",
        link: "https://meli.la/1Kv9Mgv"
    },
{
    id: "p50",
    nome: "Kit 2 Telas Mosquiteiro Protetora de Alimentos 36cm - Bolos e Pães",
    desc: "Mantenha seus pratos protegidos de insetos com praticidade. Esta tela retrátil de 36cm é ideal para cobrir bolos, pães e frutas em piqueniques ou no uso diário, garantindo higiene total com um design leve e ventilado.",
    preco: "28,10",
    categoria: "casa",
    loja: "mercadolivre",
    img: "https://http2.mlstatic.com/D_NQ_NP_663318-MLB82423808068_022025-O.webp",
    link: "https://meli.la/2q896tP"
    },
{
        id: "p49",
        nome: "Mochila Masculina Faculdade Impermeável Notebook Entrada Usb",
        desc: "Com dimensões de 46 cm de altura, 31 cm de largura e 17 cm de profundidade, esta mochila é leve, pesando apenas 300 g. Possui dois bolsos, um bolso para garrafa e uma entrada USB, permitindo que você carregue seus dispositivos móveis com facilidade.",
        preco: "78,90",
        categoria: "moda",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_932274-MLB104125679132_012026-O-mochila-masculina-faculdade-impermeavel-notebook-entrada-usb.webp",
        link: "https://meli.la/2kfHCrL"
    },
{
        id: "p48",
        nome: "A fantástica fábrica de chocolate (Edição especial)",
        desc: "A Fantástica Fábrica de Chocolate, clássico da literatura mundial em uma edição com capa inédita de Isadora Zeferino.",
        preco: "30,18",
        categoria: "livros",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/81BX9xwJ1jL._AC_UF1000,1000_QL80_FMwebp_.jpg",
        link: "https://amzn.to/4aL7LVf"
    },
{
        id: "p47",
        nome: "Megafone Amplificador De Voz Portátil C/ Microfone Usb Rádio",
        desc: "Megafone Amplificador de Voz Recarregável com Rádio FM, USB, Micro SD e Power Bank – Ideal para Professores, Palestras, Eventos, Guias de Turismo e Escolas",
        preco: "68,78",
        categoria: "eletronicos",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_700426-MLB92051578723_092025-O.webp",
        link: "https://meli.la/2ynMFjf"
    },
{
        id: "p46",
        nome: "Garrafa Térmica 1 Litro Com Termômetro Led Para Chás / Café",
        desc: " Cabo de Madeira Confortável: O cabo em madeira proporciona uma pegada ergonômica e elegante, além de oferecer um visual clássico e requintado.",
        preco: "46,93",
        categoria: "casa",
        loja: "mercadolivre",
        img: " https://http2.mlstatic.com/D_NQ_NP_658148-MLB89993492671_082025-O-garrafa-termica-1-litro-com-termmetro-led-para-chas-cafe.webp",
        link: " https://meli.la/1mB3Cix"
    },
{
  id: "p45",
  nome: " Buba Pote Termico C/Colher Degrade Azul",
  desc: "O Pote Térmico Gumy da Buba acompanha talher e é ideal para refeições fora de casa, pois ajuda a conservar a temperatura dos alimentos (quentes ou frios) por mais de 5 horas.",
  preco: "89,91",
  categoria: "casa",
  loja: "amazon",
  img: " https://m.media-amazon.com/images/I/514yQd52YoL._AC_UF894,1000_QL80_FMwebp_.jpg",
  link: "https://amzn.to/4r2ZLDO"
},
{
  id: "p44",
  nome: " Pote Termico C/Colher - Gumy Verde, Buba, Verde",
  desc: "O Pote Térmico Gumy da Buba acompanha talher e é ideal para refeições fora de casa, pois ajuda a conservar a temperatura dos alimentos (quentes ou frios) por mais de 5 horas.",
  preco: "95,30",
  categoria: "casa",
  loja: "amazon",
  img: " https://m.media-amazon.com/images/I/41D0T4KyttS._AC_UF894,1000_QL80_FMwebp_.jpg",
  link: " https://amzn.to/4cVEMzo"
},
   {
      id: "p43",
      nome: "Lanterna T9",
      desc: "A lanterna Apfer T9 é a escolha ideal para quem busca potência e versatilidade em aventuras ao ar livre.",
      preco: "49,99",
  categoria: "eletronicos",
      loja: "mercadolivre",
      img: "https://http2.mlstatic.com/D_NQ_NP_953370-MLA107171490859_022026-O.webp",
      link: "https://meli.la/2cqma9Y"
   },
   {
      id: "p42",
      nome: "Kit 12 Pares Meia Soquete Cano Curto Unissex Adulto Premium",
      desc: "Ideais para tênis, caminhadas, academia e uso diário, com ajuste firme que não aperta e não escorrega. É aquele tipo de kit para ter sempre à mão: prático, durável e versátil.",
      preco: "26,90",
      categoria: "moda",
      loja: "mercadolivre",
      img: "https://http2.mlstatic.com/D_NQ_NP_893559-MLB98742398254_112025-O-kit-12-pares-meia-soquete-cano-curto-unissex-adulto-premium.webp",
      link: "https://meli.la/32AJA45"
     },
     {
        id: "p41",
        nome: "Kit 12 Pares Meia Masculina Cano Curto Conforto",
        desc: "Descubra o conforto e a qualidade das Meias Masculinas Cano Curto da marca MEN. Com uma composição em elastano, poliéster e viscose, estas meias oferecem uma sensação agradável ao toque e ótima respirabilidade.",
        preco: "37,92",
        categoria: "moda",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_653668-MLB104699259616_012026-O.webp",
        link: "https://meli.la/2sVzoV5"
    },
     {
        id: "p40",
        nome: "Bota Botina Coturno Adventure",
        desc: "Como o conforto é imprescindível, possui parte interna do cabedal confeccionada em tecido macio e respirável, além de ser acolchoada, diminuindo o atrito.",
        preco: "152,99",
        categoria: "moda",
        loja: "mercadolivre",
        img: " https://http2.mlstatic.com/D_NQ_NP_627023-MLB79722421769_102024-O-bota-botina-coturno-adventure-bico-pvc-trabalho-couro-12hrs.webp",
        link: "https://meli.la/1KJW1nZ"
    },
    {
        id: "p1",
        nome: "Balança Digital De Vidro Corporal Temperado Até 180 Kg",
        desc: "A Balança Digital Comica é ideal para quem procura precisão, praticidade e um design moderno para o dia a dia. Desenvolvida em vidro temperado e com sensores de alta precisão, proporciona pesagens confiáveis e rápidas.",
        preco: "35,99",
        categoria: "fitness",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_716290-MLA96186710666_102025-F.webp",
        link: "https://meli.la/2eyo2JC"
    },
    {
        id: "p2",
        nome: "Top Puma Sem Costura Microfibra de Poliamida Feminino Adulto",
        desc: "Top Academia Puma Alta Sustentação Sem Bojo Sem Costura,Conforto Inigualável: Design anatômico sem bojo, feito para se ajustar perfeitamente ao corpo",
        preco: "48,99",
        categoria: "fitness",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/51-AezVhnAL._AC_SX679_.jpg",
        link: "https://amzn.to/4cTzyEg"
    },
    {
        id: "p3",
        nome: "Johnson's Baby Sabonete Líquido Recém Nascido, 200ml",
        desc: "A espuma leve e aveludada como algodão deixa o toque mais suave e delicado",
        preco: "20,40",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/61RtxYSf-dL._AC_SX679_.jpg",
        link: "https://amzn.to/4aWaHgF"
    },
    {
        id: "p4",
        nome: "Teclado USB Com Fio B-Max BM-T02 ABNT2",
        desc: "Teclado B-Max BM-T02 é um teclado com fio, padrão ABNT2, com conexão USB e compatível com Windows XP/Vista/7/8/10.",
        preco: "29,90",
        categoria: "escritorio",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_958827-MLA106956089830_022026-F.webp",
        link: "https://meli.la/1UECRDK"
    },
    {
        id: "p5",
        nome: "DOWNY Amaciante Concentrado Brisa de Verão 1.6L, Rende 6.4L",
        desc: "VISTA-SE DE PERFUME O DIA TODO: com o amaciante Downy Concentrado. Perfeito para manter suas roupas perfumadas.",
        preco: "27,22",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/61qzAq1p+pL._AC_SX679_.jpg",
        link: "https://amzn.to/4rm3dd7"
    },
    {
        id: "p6",
        nome: "Ar Condicionado Split Dual Inverter 9000 Btus Lg Compact",
        desc: "AI - Inteligência Artificial, Refrigeração até 30% mais rápida, Até 60% de economia de energia",
        preco: "1.999,00",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/51JaTQ4FFaL._AC_SX569_.jpg",
        link: "https://amzn.to/4aWTkfI"
    },
    {
        id: "p7",
        nome: "Finish Detergente para Lava Louças em pó 700g",
        desc: "Finish Power Powder Advanced oferece limpeza profunda na dose certa.",
        preco: "32,69",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/61rDfENoVVL._AC_SX679_.jpg",
        link: "https://amzn.to/4cSTN4Y"
    },
    {
        id: "p8",
        nome: "Kit Com 4 Toalhas Banhão Gigante Alta Absorção Sublime 70x150cm",
        desc: "4 Toalhas Banhão Gigante 100% Algodão Qualidade Premium.",
        preco: "98,99",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/81Arq7i+7ML._AC_SX679_.jpg",
        link: "https://amzn.to/4rEcjCH"
    },
    {
        id: "p9",
        nome: "Heinz Ketchup Tradicional 1,033KG",
        desc: "Tomate, açúcar, vinagre, sal, cebola e aroma natural. NÃO CONTÉM GLÚTEN.",
        preco: "23,50",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/51653ltvYsL._AC_SY300_SX300_QL70_ML2_.jpg",
        link: "https://amzn.to/3MVIBdd"
    },
    {
        id: "p10",
        nome: "Finish Secante para Lava-Louças e Abrilhantador 250ml",
        desc: "Deixa a louça seca e perfeitamente brilhante, pronta para o uso.",
        preco: "30,39",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/71M8mqH9RrL._AC_SX679_.jpg",
        link: "https://amzn.to/4tYjkQo"
    },
    {
        id: "p11",
        nome: "Kit 2 Pulverizador Spray De Azeite, Vidro, 100ml",
        desc: "Mais controle, menos exagero! Kit com 2 pulverizadores de vidro para temperar saladas e pratos.",
        preco: "21,80",
        categoria: "casa",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_686019-MLA99827429533_112025-O.webp",
        link: "https://meli.la/2Vqr41E"
    },
    {
        id: "p12",
        nome: "Esteira Ergométrica E41 Elétrica Dobrável Acte",
        desc: "Elétrica Dobrável 10km Acte Preto - Ideal para treinos em casa.",
        preco: "1.899,99",
        categoria: "fitness",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_880987-MLA95682115328_102025-O.webp",
        link: "https://meli.la/26Zkim4"
    },
    {
        id: "p13",
        nome: "X7 300g - Atlhetica Nutrition",
        desc: "Pré-treino Mix Berries para elevar seu desempenho e foco mental.",
        preco: "56,99",
        categoria: "fitness",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_836886-MLA99378573418_112025-O.webp",
        link: "https://meli.la/1BDm5y3"
    },
    {
        id: "p14",
        nome: "Tapete de Yoga Dupla Camada EVA 6mm",
        desc: "Antiderrapante para Pilates e Ginástica. Conforto para seus exercícios.",
        preco: "79,90",
        categoria: "fitness",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/51EENVHPusL._AC_UF1000,1000_QL80_FMwebp_.jpg",
        link: "https://amzn.to/4ceTu4j"
    },
    {
        id: "p15",
        nome: "Tênis Adidas Advantage Base 2.0",
        desc: "Estilo e conforto para o dia a dia com a qualidade Adidas.",
        preco: "209,75",
        categoria: "moda",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_779352-MLB107654833669_022026-O-tnis-advantage-base-20-adidas.webp",
        link: "https://meli.la/1kCbmwi"
    },
    {
        id: "p16",
        nome: "Aparador De Pelos Mondial Super Groom 10",
        desc: "Super Groom 10 Mondial 6W Bivolt - Kit completo com 5 cabeças.",
        preco: "102,71",
        categoria: "eletronicos",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_981084-MLA99522140924_122025-O.webp",
        link: "https://meli.la/1HP8xZD"
    },
    {
        id: "p17",
        nome: "Galaxy Tab A9+",
        desc: "64gb, 4gb Ram, Tela De 8.7 polegadas, Wifi Prata.",
        preco: "899,00",
        categoria: "eletronicos",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_892318-MLA99419882190_112025-O.webp",
        link: "https://meli.la/31KwJHn"
    },
    {
        id: "p18",
        nome: "Medidor de Pressão Digital G-Tech BSP11",
        desc: "Tensiômetro digital com memória para 120 medições.",
        preco: "99,00",
        categoria: "saude",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_635620-MLU73673867017_122023-O.webp",
        link: "https://meli.la/2HvbdrX"
    },
    {
        id: "p19",
        nome: "Mesa Dobravel Camping Maleta Portatil 1.80m",
        desc: "Maleta Portatil Com Alça Jardim Branco e Preto. Prática e resistente.",
        preco: "261,04",
        categoria: "casa",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_776852-MLB106988205071_022026-F.webp",
        link: "https://meli.la/1LZmkNP"
    },
    {
        id: "p20",
        nome: "O Pequeno Príncipe - Edição de Luxo",
        desc: "Edição de Luxo Almofadada - Um clássico para sua coleção.",
        preco: "12,90",
        categoria: "livros",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/71IiouhdpAL._SL1500_.jpg",
        link: "https://amzn.to/4bbmQj0"
    },
    {
        id: "p21",
        nome: "Escrivaninha Trevalla Kuadra Industrial",
        desc: "Me150-E10 Industrial 150cm Preto Onix. Design moderno para seu escritório.",
        preco: "240,86",
        categoria: "escritorio",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/71b3InIEJyL._AC_SX679_.jpg",
        link: "https://amzn.to/4kUrBAK"
    },
    {
        id: "p22",
        nome: "Suporte De Celular Carro 360",
        desc: "Ventosa Giratória Veicular Ajustável Anti Queda.",
        preco: "28,08",
        categoria: "eletronicos",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_950271-MLA107488132969_022026-F.webp",
        link: "https://meli.la/1huEcfg"
    },
    {
        id: "p23",
        nome: "Base Suporte Para PC Notebook Alumínio",
        desc: "Portátil Articulado Dobrável Tablet Laptop. Ergonômico e leve.",
        preco: "25,90",
        categoria: "escritorio",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_862425-MLA95804056004_102025-F.webp",
        link: "https://meli.la/2hbQFNN"
    },
    {
        id: "p24",
        nome: "Creatina Monohidratada 250g Growth",
        desc: "Growth Supplements - Creatina pura em pó de alta qualidade.",
        preco: "39,90",
        categoria: "fitness",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_662415-MLA97812910758_112025-F.webp",
        link: "https://meli.la/1hCrFuS"
    },
    {
        id: "p25",
        nome: "Quadro Decorativo Prateleira Nicho",
        desc: "Dupla Nicho Moldura Luxo para decoração elegante.",
        preco: "35,69",
        categoria: "casa",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_739043-MLB100377785271_122025-F.webp",
        link: "https://meli.la/26B1nGJ"
    },
    {
        id: "p26",
        nome: "Tenis Branco Feminino Vili Olimp",
        desc: "Esportivo Vili Olimp Academia Treino. Conforto para seus treinos.",
        preco: "96,52",
        categoria: "moda",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_603676-MLB106109346865_012026-F-tenis-branco-feminino-esportivo-vili-olimp-academia-treino.webp",
        link: "https://meli.la/15n5AjN"
    },
    {
        id: "p27",
        nome: "Geladeira Electrolux Frost Free IF43",
        desc: "Efficient com AutoSense Branca 390L. Tecnologia que preserva alimentos.",
        preco: "2.299,00",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/31ZqPaGUjRL._AC_SX679_.jpg",
        link: "https://amzn.to/4b8NlWh"
    },
    {
        id: "p28",
        nome: "Bandeja de Bambu Natural 20cm",
        desc: "Marrom Natural - Ideal para Mesa Posta e decoração.",
        preco: "17,51",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/61q2ZyGUf6L._AC_SX679_.jpg",
        link: "https://amzn.to/4cN6qyr"
    },
    {
        id: "p29",
        nome: "TCL QLED SMART TV 40 Google TV",
        desc: "FHD GOOGLE TV com Wi-Fi e Bluetooth integrados.",
        preco: "1.357,03",
        categoria: "eletronicos",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/61Tyj-tyTtL._AC_SX569_.jpg",
        link: "https://amzn.to/4l7FcEX"
    },
    {
        id: "p30",
        nome: "Furadeira Parafusadeira 48v Com Maleta",
        desc: "2 Baterias Recarregáveis com Maleta e Kit Brocas completo.",
        preco: "129,00",
        categoria: "casa",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_903566-MLA103486375178_012026-F.webp",
        link: "https://meli.la/2akLXF8"
    },
    {
        id: "p31",
        nome: "Panela Pipoqueira Tramontina",
        desc: "Tramontina profissional em alumínio resistente.",
        preco: "120,21",
        categoria: "casa",
        loja: "mercadolivre",
        img: "img/panela.png",
        link: "https://meli.la/1xQkhGK"
    },
    {
        id: "p32",
        nome: "Tábua De Passar Roupa Reforçada",
        desc: "Com Porta Ferro e 3 Alturas ajustáveis.",
        preco: "78,97",
        categoria: "casa",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_860360-MLA98972660483_112025-F.webp",
        link: "https://meli.la/1nWFot7"
    },
    {
        id: "p33",
        nome: "Panela de Pressão Elétrica Electrolux Digital",
        desc: "Electrolux Digital 6L silenciosa e segura.",
        preco: "502,55",
        categoria: "casa",
        loja: "amazon",
        img: "img/PanelaEletrica.png",
        link: "https://amzn.to/4bcD1wo"
    },
    {
        id: "p34",
        nome: "Ventilador WAP de Coluna FLOW TURBO",
        desc: "50cm FLOW TURBO, silencioso e potente.",
        preco: "221,81",
        categoria: "casa",
        loja: "amazon",
        img: "img/ventiladorpe.jpeg",
        link: "https://amzn.to/46pQONx"
    },
    {
        id: "p35",
        nome: "Pipoqueira Elétrica Mondial Pop Home",
        desc: "Pipoca pronta em 3 minutos sem usar óleo.",
        preco: "149,99",
        categoria: "casa",
        loja: "mercadolivre",
        img: "img/pipoqueiraeletrica.jpeg",
        link: "https://meli.la/2y41pzb"
    },
    {
        id: "p36",
        nome: "DOMEZ Tábua de Corte Inox",
        desc: "Tábua de corte em aço inox, higiênica e durável.",
        preco: "74,76",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/71t1xnPvyTL._AC_SX679_.jpg",
        link: "https://amzn.to/4kYeHS9"
    },
    {
        id: "p37",
        nome: "Umidificador De Ar Ultrassônico Dellamed",
        desc: "Umi Pop Health 2,3l Dellamed Cor Branco.",
        preco: "87,09",
        categoria: "saude",
        loja: "mercadolivre",
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_900915-MLA84476647173_052025-F.webp",
        link: "https://meli.la/2TQSZUx"
    },
    {
        id: "p38",
        nome: "Veganpro Baunilha - 450g",
        desc: "À base de proteínas de arroz e ervilha. Saudável e saboroso.",
        preco: "131,58",
        categoria: "saude",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/81R8-IDpwAL._AC_SX679_.jpg",
        link: "https://amzn.to/4cPO0NA"
    },
    {
        id: "p39",
        nome: "Downy Amaciante Brisa Intenso 3L",
        desc: "Concentrado Brisa Intenso 3L, Rende 12L.",
        preco: "49,44",
        categoria: "casa",
        loja: "amazon",
        img: "https://m.media-amazon.com/images/I/61a1dtQPN5L._AC_SX679_.jpg",
        link: "https://amzn.to/4aOVU7i"
    }
];

/* ==========================================
   SISTEMA DE FAVORITOS (MERCADO NEB)
   Início do arquivo para garantir que as variáveis existam
   ========================================== */
let listaFavoritosNEB = [];
try {
    const salvos = localStorage.getItem('mercado_neb_favs');
    listaFavoritosNEB = salvos ? JSON.parse(salvos) : [];
} catch (e) {
    listaFavoritosNEB = [];
}

function verificarStatusFavorito(produtoId) {
    return listaFavoritosNEB.includes(String(produtoId));
}

function mostrarNotificacao(mensagem) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-heart"></i> ${mensagem}`;
    
    container.appendChild(toast);

    // Remove do HTML depois que a animação de sumir acabar
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function toggleFavorito(event, produtoId) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const btn = event.currentTarget;
    const icone = btn.querySelector('i');
    const index = listaFavoritosNEB.indexOf(String(produtoId));

    if (index === -1) {
        listaFavoritosNEB.push(String(produtoId));
        btn.classList.add('active');
        if(icone) { icone.classList.remove('far'); icone.classList.add('fas'); }
    } else {
        listaFavoritosNEB.splice(index, 1);
        btn.classList.remove('active');
        if(icone) { icone.classList.remove('fas'); icone.classList.add('far'); }
    }
    localStorage.setItem('mercado_neb_favs', JSON.stringify(listaFavoritosNEB));
    const btnAtivo = document.querySelector('.btn-fav-filter.active');
    if (btnAtivo) {
        filtrarFavoritos(); 
    }
    // Ache essa parte no seu toggleFavorito e adicione a linha da notificação:
    if (index === -1) {
    listaFavoritosNEB.push(String(produtoId));
    btn.classList.add('active');
    if(icone) { icone.classList.remove('far'); icone.classList.add('fas'); }
    
    mostrarNotificacao("Salvo nos favoritos! ❤️"); // <--- ADICIONE AQUI
    } else {
    listaFavoritosNEB.splice(index, 1);
    btn.classList.remove('active');
    if(icone) { icone.classList.remove('fas'); icone.classList.add('far'); }
    
    mostrarNotificacao("Removido dos favoritos."); // <--- ADICIONE AQUI
    }
}


/* ==========================================
   FUNÇÕES DO SISTEMA
   ========================================== */

function carregarProdutos() {
    const grid = document.getElementById('offersGrid');
    if (!grid) return;

    grid.innerHTML = meusProdutos.map(p => {
        // SEGURANÇA: Usa o ID, mas se não tiver, usa o nome (evita marcar todos os corações)
        const identificador = p.id || p.nome;
        
        const éAmazon = p.loja === 'amazon';
        const lojaNome = éAmazon ? 'Amazon' : 'Mercado Livre';
        const artigo = éAmazon ? 'na' : 'no';
        
        // Lógica de favoritos usando o identificador seguro
        const isFav = verificarStatusFavorito(identificador);
        const favIconClass = isFav ? 'fas' : 'far';
        const favActiveClass = isFav ? 'active' : '';
        
        return `
        <div class="card" data-name="${p.nome}" data-category="${p.categoria}">
            <div class="card-img">
                <span class="badge-loja ${p.loja}">${lojaNome}</span>
                
                <button class="btn-favorite ${favActiveClass}" onclick="toggleFavorito(event, '${identificador}')">
                    <i class="${favIconClass} fa-heart"></i>
                </button>

                <img src="${p.img}" alt="${p.nome}" loading="lazy">
            </div>
            <div class="card-info">
                <h3>${p.nome}</h3>
                <p>${p.desc}</p>
                <div class="price-container">
                    <span class="price-label">R$</span>
                    <span class="price-value">${p.preco}</span>
                </div>
                <div class="price-disclaimer">
                    <i class="fas fa-exclamation-triangle"></i> O valor poderá alterar a qualquer momento!
                </div>
                <div class="card-actions">
                    <a href="${p.link}" target="_blank" class="btn-buy" onclick="registrarClique('${p.nome}', '${lojaNome}')">Comprar ${artigo} ${lojaNome}</a>
                    <button class="btn-share" onclick="compartilharOferta('${p.nome}', '${p.preco}')" title="Compartilhar">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

function exibirSkeletons() {
    const grid = document.getElementById('offersGrid');
    if (!grid) return;
    let skeletonsHTML = '';
    for (let i = 0; i < 8; i++) {
        skeletonsHTML += `
            <div class="card">
                <div class="skeleton" style="width: 100%; height: 200px; border-radius: 12px 12px 0 0;"></div>
                <div class="card-info">
                    <div class="skeleton" style="width: 80%; height: 20px; margin-bottom: 10px;"></div>
                    <div class="skeleton" style="width: 100%; height: 15px; margin-bottom: 5px;"></div>
                    <div class="skeleton" style="width: 60%; height: 15px; margin-bottom: 15px;"></div>
                    <div class="skeleton" style="width: 40%; height: 30px;"></div>
                </div>
            </div>`;
    }
    grid.innerHTML = skeletonsHTML;
}

function registrarClique(produto, loja) {
    if (typeof gtag === 'function') {
        gtag('event', 'clique_produto', { 'event_category': 'vendas', 'event_label': produto, 'loja_destino': loja });
    }
}

function filtrarCategoria(cat) {
    const botoes = document.querySelectorAll('.filter-btn');
    botoes.forEach(btn => btn.classList.remove('active'));
    
    // Marca o botão clicado como ativo
    if (event) event.target.classList.add('active');

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const categoriaCard = card.getAttribute('data-category');
        if (cat === 'todos' || categoriaCard === cat) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

function filtrarFavoritos() {
    // 1. Marcar o botão como ativo
    const botoes = document.querySelectorAll('.filter-btn');
    botoes.forEach(btn => btn.classList.remove('active'));
    if (event) event.target.classList.add('active');

    // 2. Filtrar os cards baseado na lista de IDs salvos
    const cards = document.querySelectorAll('.card');
    let encontrouAlgum = false;

    cards.forEach(card => {
        // Pegamos o ID do produto que injetamos no botão de favorito dentro do card
        const btnFav = card.querySelector('.btn-favorite');
        const idDoCard = btnFav.getAttribute('onclick').match(/'([^']+)'/)[1];

        if (listaFavoritosNEB.includes(idDoCard)) {
            card.style.display = "flex";
            encontrouAlgum = true;
        } else {
            card.style.display = "none";
        }
    });

    // 3. Se não tiver nenhum favorito, avisa o usuário
    if (!encontrouAlgum) {
        alert("Você ainda não salvou nenhum produto como favorito! ❤️");
        filtrarCategoria('todos'); // Volta para todos
    }
}

function compartilharOferta(titulo, preco) {
    const urlSite = "https://mercadoneb.netlify.app/"; 
    const texto = `🌟 *OFERTA NO MERCADO NEB* \n\n*${titulo} 📦*\n\n*Por apenas:* *R$ ${preco} 💰*\n\n_Frete Grátis_ 🚚\n\n🛒 *Link da compra:* \n${urlSite}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
}

let slideIndex = 0;
function showSlides() {
    let slides = document.getElementsByClassName("slide");
    if (slides.length === 0) return;
    for (let i = 0; i < slides.length; i++) { slides[i].style.opacity = "0"; slides[i].classList.remove("active"); }
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;
    slides[slideIndex - 1].style.opacity = "1";
    slides[slideIndex - 1].classList.add("active");
    setTimeout(showSlides, 6000);
}

function filterOffers() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('card');
    for (let i = 0; i < cards.length; i++) {
        let name = cards[i].getAttribute('data-name').toLowerCase();
        cards[i].style.display = name.includes(input) ? "" : "none";
    }
}

/* ==========================================
   CONTROLE DO FILTRO DE PREÇO
   ========================================== */
const btnToggle = document.getElementById('togglePriceFilter');
const panel = document.getElementById('priceFilterPanel');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

if (btnToggle) {
    btnToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('hidden');
        btnToggle.style.background = panel.classList.contains('hidden') ? 'var(--primary)' : '#ef4444';
    });
}

document.addEventListener('click', (e) => {
    if (panel && !panel.contains(e.target) && e.target !== btnToggle) {
        panel.classList.add('hidden');
        btnToggle.style.background = 'var(--primary)';
    }
});

if (priceRange) {
    priceRange.addEventListener('input', () => {
        const maxPrice = parseFloat(priceRange.value);
        priceValue.textContent = maxPrice.toLocaleString('pt-BR'); 
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const priceElement = card.querySelector('.price-value');
            if (priceElement) {
                const price = parseFloat(priceElement.textContent.replace(/\./g, '').replace(',', '.'));
                card.style.display = (price <= maxPrice) ? "flex" : "none";
            }
        });
    });
}

function configurarFiltroDinamico() {
    if (!meusProdutos || meusProdutos.length === 0) return;
    const precos = meusProdutos.map(p => parseFloat(p.preco.replace(/\./g, '').replace(',', '.')));
    const maiorPreco = Math.ceil(Math.max(...precos));
    if (priceRange && priceValue) {
        priceRange.max = maiorPreco;
        priceRange.value = maiorPreco;
        priceValue.textContent = maiorPreco.toLocaleString('pt-BR');
    }
}

/* ==========================================
   INICIALIZAÇÃO ÚNICA (WINDOW.ONLOAD)
   ========================================== */
window.onload = function() {
    exibirSkeletons();
    
    setTimeout(() => {
        carregarProdutos();
        configurarFiltroDinamico();
        showSlides();
    }, 1500);
};

