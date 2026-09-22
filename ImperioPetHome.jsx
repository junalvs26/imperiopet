import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  MapPin, Search, ShoppingCart, User, Package, ChevronDown, ChevronRight, ArrowRight, ArrowLeft, Menu, X, Plus, Minus, Truck, Stethoscope, Scissors, MessageCircle, Store, Crown, Heart, Bone, Star, Home, LayoutGrid, Syringe, Clock, ShieldCheck, Trash2, Zap, Bird, Rabbit, Repeat, TrendingUp, Gift, Pill, Headset, Instagram, Facebook,
} from 'lucide-react';
import { animate, createSpring } from 'animejs';

/* Tokens, fontes e keyframes — o mesmo <style> do artifact. */
function EstilosImperio() {
  return <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  /* Fraunces com o eixo SOFT no máximo: serifa arredondada e "gorda",
     a alternativa livre mais próxima da Gooper Black usada nos títulos
     da Petlove. */
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,600..900,0..100,0..1&display=swap');

  @font-face { font-family: 'Petlove Sans'; src: url('/fonts/PetloveSans-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
  @font-face { font-family: 'Petlove Sans'; src: url('/fonts/PetloveSans-ExtraBold.woff2') format('woff2'); font-weight: 800; font-style: normal; font-display: swap; }

  /* Classe utilitária exclusiva para títulos selecionados */
  .font-petlove {
    font-family: 'Petlove Sans', 'Fraunces', 'Plus Jakarta Sans', Georgia, serif;
    font-variation-settings: "SOFT" 100, "WONK" 0;
    font-optical-sizing: auto;
    letter-spacing: -0.015em;
  }
  /* Os títulos da Petlove vão sempre no peso Black */
  .font-petlove.font-extrabold { font-weight: 900; }

  /* ── Tokens ─────────────────────────────────────────────────────
     Escalas (espaço, raio, sombra, alturas) medidas no HTML da Petlove;
     cores da marca Império Pet. */
  :root {
    color-scheme: light;
    --ip-night: #111111;
    --ip-ink: #111111;
    --ip-yellow: #F5B800;
    --ip-amber: #F5B800;
    --ip-amber-dark: #111111;
    --ip-amber-light: #F5B800;
    --ip-amber-lightest: #FFF4CC;
    --ip-orange: #F5B800;
    --ip-bg: #FFFFFF;
    --ip-card: #FFFFFF;
    --ip-n-darkest: #222222;
    --ip-n-dark: #4A4A4A;
    --ip-n: #6B6B6B;
    --ip-n-medium: #D4D4D4;
    --ip-n-light: #F4F4F4;
    --ip-n-lightest: #F7F7F7;
    --ip-zap: #111111;
    --ip-sky: #F4F4F4;
    --ip-shadow-card: 0 4px 8px rgba(17,17,17,.04), 0 0 4px rgba(17,17,17,.12);
    --ip-shadow-hover: 0 0 24px rgba(17,17,17,.12), 0 16px 28px rgba(17,17,17,.12);
    --ip-shadow-drop: 0 4px 14px rgba(0,0,0,.2), 0 4px 8px rgba(0,0,0,.04);
  }
  html, body { background: var(--ip-bg); }

  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .shadow-card { box-shadow: var(--ip-shadow-card); }
  .shadow-card-hover:hover { box-shadow: var(--ip-shadow-hover); }
  .shadow-drop { box-shadow: var(--ip-shadow-drop); }

  /* Carrossel centrado: largura do slide depende do breakpoint */
  .ip-banner { --w: 86vw; --gap: 8px; }
  @media (min-width: 992px) { .ip-banner { --w: min(1078px, 78vw); --gap: 0px; } }
  .ip-beneficios { --w: 78vw; }
  @media (min-width: 992px) { .ip-beneficios { --w: 430px; } }
  .ip-cq { container-type: inline-size; }

  @keyframes ipDrawerIn  { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  @keyframes ipCartIn    { from { transform: translateX(100%); }  to { transform: translateX(0); } }
  @keyframes ipFadeIn    { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ipPopIn     { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
  /* Entrada dos cards de sugestão — mesma curva de overshoot da Petlove */
  @keyframes ipOvershoot { 0% { transform: translateX(110%); } 70% { transform: translateX(-10%); } 100% { transform: translateX(0); } }
  @keyframes ipMarquee   { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .ip-drawer { animation: ipDrawerIn .28s cubic-bezier(.22,.8,.3,1) both; }
  .ip-cart   { animation: ipCartIn .28s cubic-bezier(.22,.8,.3,1) both; }
  .ip-fade   { animation: ipFadeIn .2s ease both; }
  .ip-pop    { animation: ipPopIn .2s ease-out both; }
  .ip-overshoot { animation: ipOvershoot 1.5s cubic-bezier(.175,.885,.32,1.275) both; }
  .ip-marquee { animation: ipMarquee 24s linear infinite; }
  @media (prefers-reduced-motion: reduce) {
    .ip-drawer, .ip-cart, .ip-fade, .ip-pop, .ip-overshoot, .ip-marquee { animation: none !important; }
    * { transition: none !important; }
  }
`}</style>;
}
/* ════════════════════════════════════════════════════════════
   ANIME.JS v4 — micro-interações (badge, favorito, adicionar)
   ════════════════════════════════════════════════════════════ */
const semMovimento = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const animar = (alvos, params) => {
  if (!animate || semMovimento() || !alvos) return null;
  return animate(alvos, params);
};


/* ════════════════════════════════════════════════════════════
   MARCA
   ════════════════════════════════════════════════════════════ */
const BRAND = {
  amber: "#F4C400", night: "#111111", orange: "#F4C400", zap: "#111111", ink: "#111111", yellow: "#F4C400",
  amberDark: "#111111", amberLightest: "#FFF4CC",
};

// Em produção: "/logopreta.png" (pasta public do projeto).
const LOGO_SRC = "/logopreta.png";

const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

/* ════════════════════════════════════════════════════════════
   DADOS
   ════════════════════════════════════════════════════════════ */

/* Mega menu em dois painéis (anatomia Petlove): cada departamento tem
   setores; cada setor tem colunas de categoria com subcategorias. */
const DEPARTAMENTOS = [
  {
    id: "caes", nome: "Cachorro", icon: Bone, marcas: ["Royal Canin", "PremieR Pet", "Golden", "Bravecto"],
    setores: [
      { nome: "Alimentação e Acessórios", categorias: [
        { titulo: "Rações", itens: ["Ração Seca", "Ração Natural", "Ração Úmida", "Ração Medicamentosa"] },
        { titulo: "Petiscos e Ossos", itens: ["Bifinhos", "Biscoitos e Snacks", "Ossos e Mordedores", "Cuidado Oral"] },
        { titulo: "Para Alimentação", itens: ["Comedouros", "Bebedouros", "Porta Rações", "Alimentadores Automáticos"] },
      ] },
      { nome: "Farmácia e Higiene", categorias: [
        { titulo: "Medicamentos", itens: ["Antipulgas e Carrapatos", "Vermífugos", "Vitaminas e Suplementos", "Anti-inflamatórios"] },
        { titulo: "Tapetes e Banheiros", itens: ["Tapetes Higiênicos", "Fraldas", "Banheiros de Cachorro"] },
        { titulo: "Higiene e Beleza", itens: ["Shampoos", "Perfumes e Colônias", "Escovas", "Cortadores de Unha"] },
      ] },
      { nome: "Brinquedos e Passeio", categorias: [
        { titulo: "Brinquedos", itens: ["Mordedores", "Bolinhas", "Cordas", "Pelúcia"] },
        { titulo: "Camas e Casinhas", itens: ["Caminhas", "Casinhas", "Mantas e Cobertores"] },
        { titulo: "Coleiras e Guias", itens: ["Peitorais", "Coleiras", "Guias", "Tag de Identificação"] },
      ] },
    ],
  },
  {
    id: "gatos", nome: "Gatos", icon: Heart, marcas: ["Royal Canin", "Golden", "Biofresh", "PremieR Pet"],
    setores: [
      { nome: "Alimentação e Acessórios", categorias: [
        { titulo: "Rações", itens: ["Ração Seca", "Ração Úmida e Sachês", "Ração Natural", "Ração Medicamentosa"] },
        { titulo: "Petiscos", itens: ["Petisco Cremoso", "Bifinhos", "Grama Digestiva"] },
        { titulo: "Para Alimentação", itens: ["Comedouros", "Fontes e Bebedouros", "Alimentadores Automáticos"] },
      ] },
      { nome: "Farmácia e Higiene", categorias: [
        { titulo: "Medicamentos", itens: ["Antipulgas", "Vermífugos", "Suplementos", "Urinary e Renal"] },
        { titulo: "Areias e Banheiros", itens: ["Areias e Granulados", "Caixa de Areia", "Pá Coletora"] },
        { titulo: "Higiene e Beleza", itens: ["Banho a Seco", "Shampoos", "Escovas"] },
      ] },
      { nome: "Brinquedos e Casa", categorias: [
        { titulo: "Arranhadores", itens: ["Arranhadores", "Playground", "Casinhas e Torres", "Janeleiras"] },
        { titulo: "Brinquedos", itens: ["Com Catnip", "Bolinhas e Ratinhos", "Varinhas"] },
        { titulo: "Transporte", itens: ["Caixas de Transporte", "Bolsas de Transporte"] },
      ] },
    ],
  },
  {
    id: "outros", nome: "Outros pets", icon: Bird, marcas: ["Alcon", "Nutrópica", "Megazoo"],
    setores: [
      { nome: "Pássaros", categorias: [
        { titulo: "Alimentação", itens: ["Canário", "Calopsita", "Periquito", "Papagaio"] },
        { titulo: "Acessórios", itens: ["Gaiolas", "Comedouros", "Poleiros"] },
      ] },
      { nome: "Pequenos pets", categorias: [
        { titulo: "Roedores", itens: ["Ração para Hamster", "Feno", "Serragem"] },
        { titulo: "Acessórios", itens: ["Gaiolas", "Rodas de Exercício", "Bebedouros"] },
      ] },
      { nome: "Peixes", categorias: [
        { titulo: "Aquarismo", itens: ["Ração para Peixes", "Filtros", "Bombas de Ar", "Aquários"] },
      ] },
    ],
  },
  {
    id: "farmacia", nome: "Farmácia", icon: Pill, marcas: ["Bravecto", "NexGard", "Simparic", "Vetnil"],
    setores: [
      { nome: "Antipulgas e Vermes", categorias: [
        { titulo: "Antipulgas", itens: ["Comprimidos", "Pipetas", "Coleiras Antipulgas"] },
        { titulo: "Vermífugos", itens: ["Para Cães", "Para Gatos"] },
      ] },
      { nome: "Tratamentos", categorias: [
        { titulo: "Uso contínuo", itens: ["Suplementos", "Probióticos", "Cardiologia", "Articulações"] },
        { titulo: "Dermatologia", itens: ["Shampoos Terapêuticos", "Pomadas", "Otológicos"] },
      ] },
    ],
  },
];

/* Menus em lista simples (dropdown alinhado à direita, como Serviços/Mais na Petlove) */
const MENU_SERVICOS = ["Banho & Tosa", "Taxi Dog", "Consultas Veterinárias", "Vacinação", "Vet no WhatsApp"];
const MENU_MAIS = ["Nossas unidades", "Marcas", "Vale presente", "Dicas de cuidado", "Trabalhe conosco"];

const MENU_CONTA = [
  { rotulo: "Favoritos", Icon: Heart },
  { rotulo: "Meus dados", Icon: User },
  { rotulo: "Endereços", Icon: MapPin },
  { rotulo: "Meus pets", Icon: Bone },
  { rotulo: "Avaliar produtos", Icon: Star },
  { rotulo: "Atendimento", Icon: Headset },
];

const UNIDADES = [
  { id: "ponta-areia", nome: "Unidade Ponta d'Areia", curto: "Ponta d'Areia", endereco: "Av. dos Holandeses, 1.200 — Ponta d'Areia, São Luís/MA", horario: "Seg a Sáb, 08h às 20h · Dom, 09h às 14h", retirada: "Pronta em 2h", tel: "(98) 98100-0001", cor: "#F5B800" },
  { id: "cohatrac",    nome: "Unidade Cohatrac",      curto: "Cohatrac",      endereco: "Av. Contorno Leste, 45 — Cohatrac I, São Luís/MA",        horario: "Seg a Sáb, 08h às 19h",                  retirada: "Pronta em 3h", tel: "(98) 98100-0002", cor: "#F5B800" },
  { id: "olho-dagua",  nome: "Unidade Olho d'Água",   curto: "Olho d'Água",   endereco: "Av. Copacabana, 780 — Olho d'Água, São Luís/MA",          horario: "Seg a Sáb, 09h às 20h",                  retirada: "Pronta em 2h", tel: "(98) 98100-0003", cor: "#111111" },
];

const BAIRROS_SLZ = ["Ponta d'Areia", "Calhau", "Renascença", "Cohama", "Cohatrac", "Olho d'Água", "Turu", "Centro", "Vinhais", "Araçagi"];

const BUSCAS_POPULARES = ["ração royal canin 15kg", "bravecto 10 a 20kg", "areia sanitária", "simparic 20 a 40kg", "sachê para gato castrado", "tapete higiênico 80x60"];
const ATALHOS_BUSCA = [
  { rotulo: "Antipulgas e carrapatos", Icon: ShieldCheck },
  { rotulo: "Ração super premium", Icon: Package },
  { rotulo: "Agendar banho & tosa", Icon: Scissors },
  { rotulo: "Consulta veterinária", Icon: Stethoscope },
];

/* Cards de "próxima melhor ação" — topo da Home */
const SUGESTOES = [
  { titulo: "Conheça o Clube Império", desc: "15% OFF permanente + frete grátis na Ilha + brindes de assinante", Icon: Crown, cor: BRAND.amber, destaque: true, alvo: "clube" },
  { titulo: "Consulta e vacina na loja", desc: "Agenda aberta nas 3 unidades de São Luís, com carteirinha digital", Icon: Stethoscope, cor: "#111111", alvo: "servicos" },
  { titulo: "Banho & Tosa com Taxi Dog", desc: "A gente busca e leva o seu pet. Assinantes têm 10% OFF", Icon: Scissors, cor: BRAND.orange, alvo: "servicos" },
];

/* Chips de atalho — cada um rola até uma secção da Home */
const CHIPS = [
  { id: "clube", rotulo: "Clube Império", Icon: Crown },
  { id: "mais-vendidos", rotulo: "Mais vendidos", Icon: TrendingUp },
  { id: "servicos", rotulo: "Serviços", Icon: Scissors },
  { id: "beneficios", rotulo: "Benefícios", Icon: Gift },
  { id: "lojas", rotulo: "Unidades", Icon: Store },
  { id: "marcas", rotulo: "Marcas", Icon: ShieldCheck },
  { id: "novidades", rotulo: "Ofertas no e-mail", Icon: Zap },
];

const SLIDES = [
  { id: "expressa", eyebrow: "Império Express", titulo: "Pediu até 17h, chega hoje na Ilha", texto: "Entrega no mesmo dia em toda São Luís. Grátis acima de R$ 99.", cta: "Ver produtos com entrega hoje", de: "#111111", para: "#2B2B2B", acento: "#F5B800", arte: "entrega" },
  { id: "clube", eyebrow: "Clube Império", titulo: "Rações super premium com até 25% OFF", texto: "Assine a ração e receba antes de acabar, com preço de assinante.", cta: "Quero economizar", de: "#F5B800", para: "#FFCC33", acento: "#111111", arte: "clube", claro: true },
  { id: "antipulgas", eyebrow: "Farmácia", titulo: "Bravecto, NexGard e Simparic com frete grátis", texto: "Antipulgas originais com entrega hoje e nota fiscal.", cta: "Ver antipulgas", de: "#2B2B2B", para: "#111111", acento: "#F5B800", arte: "farmacia" },
  { id: "clinica", eyebrow: "Clínica veterinária", titulo: "Consulta e vacina na unidade mais perto", texto: "Três unidades em São Luís com agenda aberta esta semana.", cta: "Agendar atendimento", de: "#F5B800", para: "#FFCC33", acento: "#111111", arte: "clinica", claro: true },
];

const COMPRE_POR_PET = [
  { nome: "Cães", img: "/img/pet-caes.webp", alt: "Cachorro sorridente" },
  { nome: "Gatos", img: "/img/pet-gatos.webp", alt: "Gato rajado deitado" },
  { nome: "Farmácia Vet", img: "/img/pet-farmacia.webp", alt: "Cachorro a receber um comprimido" },
  { nome: "Aves", img: "/img/pet-aves.webp", alt: "Canário amarelo" },
  { nome: "Pequenos Pets", img: "/img/pet-pequenos.webp", alt: "Hamster" },
  { nome: "Clínica & Vacinas", img: "/img/pet-clinica.webp", alt: "Cachorro em consulta veterinária" },
];

/* `variacoes`: pílulas de peso (ração) ou faixa de dosagem (medicamento) */
const PRODUTOS = [
  { id: "p9",  marca: "Royal Canin", nome: "Ração Royal Canin Maxi Adult para Cães Adultos de Raças Grandes 15kg",    tabela: 519.9, pix: 425.9, clube: 383.31, nota: 4.9, avaliacoes: 142, arte: "racao", cor: "#111111", freteGratis: true,  expresso: true,  variacoes: ["4kg", "15kg"] },
  { id: "p10", marca: "PremieR",     nome: "Ração PremieR Raças Pequenas Cães Adultos Frango e Salmão 2,5kg",         tabela: 129.9, pix: 106.9, clube: 96.21,  nota: 4.8, avaliacoes: 267, arte: "racao", cor: "#111111", freteGratis: false, expresso: true,  variacoes: ["1kg", "2,5kg", "7,5kg"] },
  { id: "p11", marca: "Bravecto",    nome: "Bravecto Antipulgas e Carrapatos para Cães de 10 a 20kg 500mg",           tabela: 219.9, pix: 179.9, clube: 161.91, nota: 5.0, avaliacoes: 398, arte: "caixa", cor: "#111111", freteGratis: true,  expresso: true,  variacoes: ["4,5-10kg", "10-20kg", "20-40kg"] },
  { id: "p12", marca: "Simparic",    nome: "Simparic Antipulgas e Carrapatos para Cães de 10,1 a 20kg 40mg",          tabela: 169.9, pix: 132.9, clube: 119.61, nota: 4.9, avaliacoes: 221, arte: "caixa", cor: "#2B2B2B", freteGratis: true,  expresso: true,  variacoes: ["5,1-10kg", "10,1-20kg", "20,1-40kg"] },
  { id: "p2",  marca: "Royal Canin", nome: "Ração Royal Canin Medium Adult para Cães Adultos Porte Médio 15kg",       tabela: 479.9, pix: 409.9, clube: 368.91, nota: 4.8, avaliacoes: 312, arte: "racao", cor: "#111111", freteGratis: true,  expresso: true,  variacoes: ["2,5kg", "10,1kg", "15kg"] },
  { id: "p5",  marca: "Golden",      nome: "Ração Golden Fórmula Gatos Adultos Castrados Salmão 10,1kg",              tabela: 269.9, pix: 214.9, clube: 193.41, nota: 4.7, avaliacoes: 96,  arte: "racao", cor: "#2B2B2B", freteGratis: true,  expresso: true,  variacoes: ["1kg", "3kg", "10,1kg"] },
  { id: "p4",  marca: "NexGard",     nome: "NexGard Antipulgas e Carrapatos para Cães de 10,1 a 25kg com 3 Tabletes", tabela: 229.9, pix: 179.9, clube: 161.91, nota: 4.9, avaliacoes: 254, arte: "caixa", cor: "#2B2B2B", freteGratis: true,  expresso: false, variacoes: ["2-4kg", "4,1-10kg", "10,1-25kg"] },
  { id: "p6",  marca: "PremieR",     nome: "Ração PremieR Gatos Castrados Ambientes Internos Frango 7,5kg",           tabela: 269.9, pix: 229.9, clube: 206.91, nota: 4.8, avaliacoes: 171, arte: "racao", cor: "#111111", freteGratis: false, expresso: true,  variacoes: ["1,5kg", "7,5kg"] },
];

const PLANOS_CLUBE = [
  { id: "mensal", nome: "Mensal", parcela: "R$ 14,90", rodape: "cobrado todo mês", destaque: false },
  { id: "anual", nome: "Anual", parcela: "R$ 9,90", prefixo: "12x de", rodape: "ou R$ 118,80 à vista", destaque: true },
];

const PASSOS_CLUBE = [
  { n: 1, titulo: "Escolha os produtos favoritos do seu pet", desc: "Ração, antipulgas, areia, sachês — o que já entra na rotina dele.", Icon: Heart },
  { n: 2, titulo: "Defina a frequência de entrega ou retirada", desc: "A cada 30, 45 ou 60 dias, em casa ou numa das três lojas.", Icon: Repeat },
  { n: 3, titulo: "Garanta 15% OFF permanente e frete grátis na Ilha", desc: "Desconto em todas as entregas, sem fidelidade e sem multa.", Icon: TrendingUp },
];

const MARQUEE = ["Frete grátis na Ilha", "Brindes exclusivos", "15% OFF permanente", "Retirada grátis em 3 lojas"];

const SERVICOS = [
  { id: "banho", nome: "Banho & Tosa", sub: "Com Taxi Dog em São Luís", desc: "Buscamos e levamos o seu pet. Tosa higiênica, na tesoura ou na máquina, com agendamento pelo WhatsApp.", Icon: Scissors, cor: BRAND.orange, fundo: "#FFF4CC", cta: "Agendar banho" },
  { id: "consulta", nome: "Consultas", sub: "Clínica geral e especialidades", desc: "Médicos veterinários residentes nas três unidades. Dermatologia e cardiologia com hora marcada.", Icon: Stethoscope, cor: "#111111", fundo: "#FFF4CC", cta: "Agendar consulta" },
  { id: "vacina", nome: "Vacinação", sub: "Carteirinha digital", desc: "V8, V10, antirrábica, gripe canina e tríplice felina. Lembrete automático da próxima dose.", Icon: Syringe, cor: BRAND.amberDark, fundo: "#FFF4CC", cta: "Agendar vacina" },
  { id: "whats", nome: "Vet no WhatsApp", sub: "Orientação rápida", desc: "Dúvida sobre sintomas, dosagem ou alimentação? Fale com a nossa equipa local sem sair de casa.", Icon: MessageCircle, cor: BRAND.zap, fundo: "#F4F4F4", cta: "Chamar no WhatsApp" },
];

const BENEFICIOS = [
  { id: "entregas", nome: "Entregas", rotulo: "Várias opções de entrega", titulo: "Chega hoje na Ilha ou retire grátis na loja", cta: "Consultar regras", Icon: Truck, cor: BRAND.orange },
  { id: "lojas", nome: "Nossas lojas", rotulo: "3 unidades em São Luís", titulo: "O cantinho para cuidar do seu pet perto de casa", cta: "Ver unidades", Icon: Store, cor: BRAND.night, alvo: "lojas" },
  { id: "clube", nome: "Clube Império", rotulo: "Clube Império", titulo: "15% OFF em todos os produtos*", cta: "Quero economizar", Icon: Crown, cor: BRAND.amber, alvo: "clube" },
  { id: "clinica", nome: "Clínica", rotulo: "Clínica & Vacinas", titulo: "Equipa veterinária própria, com hora marcada", cta: "Agendar", Icon: Syringe, cor: "#111111", alvo: "servicos" },
  { id: "whats", nome: "WhatsApp", rotulo: "Vet no WhatsApp", titulo: "Orientação rápida com atendente local", cta: "Chamar agora", Icon: MessageCircle, cor: BRAND.zap },
];

const MARCAS_PARCEIRAS = [
  { nome: "Royal Canin", cor: "#111111" }, { nome: "PremieR Pet", cor: "#111111" }, { nome: "Golden", cor: "#111111" },
  { nome: "Bravecto", cor: "#111111" }, { nome: "NexGard", cor: "#2B2B2B" }, { nome: "Simparic", cor: "#2B2B2B" },
  { nome: "Biofresh", cor: "#111111" }, { nome: "Zee.Dog", cor: "#111111" }, { nome: "N&D Farmina", cor: "#111111" },
];

const RODAPE_MENUS = [
  { titulo: "Atendimento", links: ["WhatsApp (98) 98100-0001", "Central de atendimento", "Trocas e devoluções"] },
  { titulo: "Políticas", links: ["Aviso de privacidade", "Política de entrega e retirada", "Política de compra"] },
  { titulo: "Institucional", links: ["Sobre a Império Pet", "Nossas unidades", "Trabalhe conosco"] },
];

const RODAPE_GRUPOS = [
  { titulo: "Categorias", links: ["Ração para Cachorro", "Ração para Gato", "Antipulgas e Carrapatos", "Areia para Gatos", "Tapete Higiênico", "Petiscos e Ossos", "Coleiras e Peitorais", "Arranhadores"] },
  { titulo: "Marcas", links: ["Royal Canin", "PremieR", "Golden", "Bravecto", "NexGard", "Simparic", "Biofresh", "Zee.Dog"] },
  { titulo: "Ofertas e Promoções", links: ["Ofertas da semana", "Clube Império", "Novidades"] },
];

/* ════════════════════════════════════════════════════════════
   PRIMITIVAS
   ════════════════════════════════════════════════════════════ */
function Logo({ className = "h-10 md:h-12 w-auto object-contain" }) {
  const [falhou, setFalhou] = useState(false);
  if (falhou) {
    return (
      <span className={`${className} grid aspect-square place-items-center rounded-xl`}
            style={{ background: BRAND.amber }} role="img" aria-label="Império Pet">
        <Bone size={22} strokeWidth={2.2} className="text-white" />
      </span>
    );
  }
  return <img src={LOGO_SRC} alt="Império Pet" onError={() => setFalhou(true)} className={`${className} mix-blend-multiply`} draggable="false" />;
}

/* Nome da marca no cabeçalho:
   preserva legibilidade máxima no fundo amarelo com a fonte proprietária.
   aria-hidden porque o link já tem o nome completo no aria-label. */
function Marca({ className = "" }) {
  return (
    <span aria-hidden="true"
          className={`font-petlove whitespace-nowrap font-extrabold leading-none ${className}`}
          style={{ color: BRAND.night, letterSpacing: "-0.03em" }}>
      Império Pet
    </span>
  );
}

/* Onda SVG que abre e fecha as faixas coloridas (anatomia Petlove) */
function Onda({ cor, posicao }) {
  const d = posicao === "topo"
    ? "M336 0C49 0 0 48 0 48h1366V0s-82 37.5-360.6 37.5C727 37.5 623 0 336 0Z"
    : "M1030 48C1317 48 1366 0 1366 0H0v48s82.2-37.5 360.6-37.5C639 10.5 742.9 48 1030 48Z";
  return (
    <svg viewBox="0 0 1366 48" preserveAspectRatio="none" className="block h-6 w-full md:h-12" aria-hidden="true"
         style={posicao === "topo" ? { marginBottom: -1 } : { marginTop: -1 }}>
      <path d={d} fill={cor} />
    </svg>
  );
}

/* Botão redondo de navegação (icon-button: 40/48px, branco, sombra) */
function BotaoSeta({ direcao, onClick, rotulo, tamanho = 40, className = "", desativado = false }) {
  const Icone = direcao === "esq" ? ArrowLeft : ArrowRight;
  return (
    <button onClick={onClick} aria-label={rotulo} disabled={desativado}
            className={`grid shrink-0 place-items-center rounded-full bg-white shadow-card transition-transform active:scale-95 disabled:opacity-40 ${className}`}
            style={{ width: tamanho, height: tamanho, color: BRAND.night }}>
      <Icone size={20} />
    </button>
  );
}

function TituloSecao({ children, centro = false, claro = false }) {
  return (
    <h2 className={`font-petlove text-2xl font-extrabold leading-tight md:text-[32px] ${centro ? "text-center" : ""}`}
        style={{ color: claro ? "#fff" : BRAND.night, textWrap: "balance" }}>
      {children}
    </h2>
  );
}

/* ════════════════════════════════════════════════════════════
   MODAL DE UNIDADES
   ════════════════════════════════════════════════════════════ */
function ModalUnidades({ aberto, onFechar, modo, setModo, bairro, setBairro, unidade, setUnidade }) {
  const [rascunho, setRascunho] = useState(bairro);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    setRascunho(bairro);
    const onKey = (e) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => { document.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, [aberto]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!aberto) return null;

  const confirmar = () => {
    const v = rascunho.trim();
    if (!v) return;
    setBairro(v); setModo("entrega"); onFechar();
  };
  const sugestoes = rascunho.trim()
    ? BAIRROS_SLZ.filter((b) => b.toLowerCase().includes(rascunho.trim().toLowerCase())).slice(0, 4)
    : [];

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center ip-fade" role="dialog" aria-modal="true" aria-label="Escolher forma de recebimento">
      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-neutral-100 bg-white px-6 pb-4 pt-6">
          <div>
            <h2 className="font-petlove text-xl font-extrabold" style={{ color: BRAND.night }}>Informe sua localização</h2>
            <p className="mt-1 text-sm text-neutral-500">Escolha onde quer receber e veja as regras de frete na sua região.</p>
          </div>
          <button onClick={onFechar} aria-label="Fechar" className="shrink-0 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1">
            {[{ id: "entrega", label: "Entrega", Icon: Truck }, { id: "retirada", label: "Retirar na loja", Icon: Store }].map(({ id, label, Icon }) => {
              const ativo = modo === id;
              return (
                <button key={id} onClick={() => setModo(id)}
                        className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all"
                        style={ativo ? { background: "#fff", color: BRAND.night, boxShadow: "var(--ip-shadow-card)" } : { color: "#6B6B6B" }}>
                  <Icon size={16} strokeWidth={2.2} />{label}
                </button>
              );
            })}
          </div>
        </div>

        {modo === "entrega" ? (
          <div className="px-6 py-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input id="ip-cep" ref={inputRef} value={rascunho} placeholder=" "
                       onChange={(e) => setRascunho(e.target.value)}
                       onKeyDown={(e) => e.key === "Enter" && confirmar()}
                       className="peer h-16 w-full rounded-lg border border-neutral-300 bg-white px-4 pb-3 pt-6 text-base outline-none transition-all focus:border-2 focus:border-[#F5B800]" />
                <label htmlFor="ip-cep"
                       className="pointer-events-none absolute left-4 top-3 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs">
                  CEP ou bairro
                </label>
              </div>
              <button onClick={confirmar} className="h-16 rounded-2xl px-6 text-base font-bold transition-transform active:scale-[.96]"
                      style={{ background: BRAND.ink, color: BRAND.yellow }}>
                Usar
              </button>
            </div>
            {sugestoes.length > 0 && (
              <ul className="mt-3 overflow-hidden rounded-lg bg-white shadow-drop">
                {sugestoes.map((b) => (
                  <li key={b}>
                    <button onClick={() => { setBairro(b); setModo("entrega"); onFechar(); }}
                            className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50">
                      <MapPin size={15} style={{ color: BRAND.amber }} />{b}
                      <span className="ml-auto text-xs text-neutral-400">São Luís — MA</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-5 flex items-start gap-3 rounded-xl p-4 text-sm leading-relaxed text-neutral-700" style={{ background: BRAND.amberLightest }}>
              <Truck size={18} className="mt-0.5 shrink-0" style={{ color: BRAND.amber }} />
              <span><strong style={{ color: BRAND.night }}>Entrega expressa em até 3h</strong> nos bairros da Ilha para pedidos acima de R$ 99 feitos até às 17h.</span>
            </p>
          </div>
        ) : (
          <ul className="space-y-3 px-6 py-5">
            {UNIDADES.map((u) => {
              const ativo = unidade?.id === u.id;
              return (
                <li key={u.id}>
                  <button onClick={() => { setUnidade(u); setModo("retirada"); onFechar(); }}
                          className="w-full rounded-2xl border-2 bg-white p-4 text-left transition-shadow hover:shadow-card"
                          style={{ borderColor: ativo ? BRAND.amber : "#E6E6E6" }}>
                    <p className="font-petlove text-base font-extrabold" style={{ color: BRAND.night }}>{u.nome}</p>
                    <p className="mt-1 text-sm text-neutral-500">{u.endereco}</p>
                    <p className="mt-1 text-xs text-neutral-400">{u.horario}</p>
                    <span className="mt-2 inline-flex h-6 items-center rounded-lg px-3 text-xs font-medium" style={{ background: "#F4F4F4", color: "#111111" }}>
                      Retirada {u.retirada}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MENU GAVETA (mobile)
   ════════════════════════════════════════════════════════════ */
function MenuDrawer({ aberto, onFechar, onAbrirLocal }) {
  const [expandido, setExpandido] = useState(null);
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aberto, onFechar]);
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-[80] lg:hidden ip-fade" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={onFechar} />
      <aside className="relative flex h-full w-[86%] max-w-[340px] flex-col bg-white shadow-2xl ip-drawer">
        <div className="px-5 pb-5 text-white" style={{ background: BRAND.night, paddingTop: "calc(1.25rem + env(safe-area-inset-top, 0px))" }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full" style={{ background: BRAND.amber }}>
                <User size={20} strokeWidth={2.2} className="text-white" />
              </span>
              <div>
                <p className="text-xs text-neutral-300">Bem-vindo ao</p>
                <p className="font-petlove text-lg font-extrabold leading-tight">Império Pet</p>
              </div>
            </div>
            <button onClick={onFechar} aria-label="Fechar menu" className="rounded-full p-1.5 text-neutral-300 hover:bg-white/10"><X size={20} /></button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="h-10 rounded-lg text-sm font-bold" style={{ background: BRAND.yellow, color: BRAND.ink }}>Entrar</button>
            <button className="h-10 rounded-lg border border-white/25 text-sm font-medium text-white">Cadastrar</button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {DEPARTAMENTOS.map((d) => {
              const aberta = expandido === d.id;
              const Icone = d.icon;
              return (
                <li key={d.id} className="border-b border-neutral-100">
                  <button onClick={() => setExpandido(aberta ? null : d.id)} aria-expanded={aberta}
                          className="flex h-14 w-full items-center gap-3 px-5 text-left">
                    <Icone size={18} style={{ color: BRAND.amber }} />
                    <span className="flex-1 text-base font-medium" style={{ color: BRAND.night }}>{d.nome}</span>
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-neutral-100 text-neutral-500">
                      {aberta ? <Minus size={13} strokeWidth={2.6} /> : <Plus size={13} strokeWidth={2.6} />}
                    </span>
                  </button>
                  {aberta && (
                    <ul className="pb-3 pl-14 pr-5">
                      {d.setores.flatMap((s) => s.categorias).map((c) => (
                        <li key={c.titulo}><a href="#" className="block py-2 text-sm text-neutral-600">{c.titulo}</a></li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            {[{ nome: "Ofertas", Icon: Zap }, { nome: "Clube Império", Icon: Crown }].map(({ nome, Icon }) => (
              <li key={nome} className="border-b border-neutral-100">
                <a href="#" className="flex h-14 items-center gap-3 px-5">
                  <Icon size={18} style={{ color: BRAND.amber }} />
                  <span className="text-base font-medium" style={{ color: BRAND.night }}>{nome}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="px-5 pb-2 pt-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Serviços</p>
          <ul className="pb-6">
            {MENU_SERVICOS.map((s) => (
              <li key={s}><a href="#" className="block px-5 py-2.5 text-sm text-neutral-600">{s}</a></li>
            ))}
          </ul>
        </nav>

        <button onClick={() => { onFechar(); onAbrirLocal(); }}
                className="flex items-center gap-2 border-t border-neutral-100 px-5 py-4 text-left"
                style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}>
          <MapPin size={16} style={{ color: BRAND.amber }} />
          <span className="flex-1 text-sm font-medium text-neutral-600">Alterar endereço ou unidade</span>
          <ChevronRight size={16} className="text-neutral-300" />
        </button>
      </aside>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CABEÇALHO — peças
   ════════════════════════════════════════════════════════════ */

/* Mega painel: trilho de setores (300px) + painel de categorias */
function MegaPainel({ dept }) {
  const [setor, setSetor] = useState(0);
  useEffect(() => setSetor(0), [dept.id]);
  const atual = dept.setores[setor];

  return (
    <div className="absolute left-0 right-0 top-full z-50 flex px-8 pt-1.5 ip-pop">
      <div className="flex w-full overflow-hidden rounded-2xl" style={{ boxShadow: "var(--ip-shadow-hover)" }}>
        <ul className="w-[300px] shrink-0 bg-white py-8">
          {dept.setores.map((s, i) => {
            const ativo = i === setor;
            return (
              <li key={s.nome}>
                <button onMouseEnter={() => setSetor(i)} onFocus={() => setSetor(i)}
                        className="flex h-14 w-full items-center justify-between px-8 text-left text-base transition-colors"
                        style={{ background: ativo ? "var(--ip-n-light)" : "transparent", color: ativo ? BRAND.night : "#4A4A4A", fontWeight: ativo ? 600 : 400 }}>
                  {s.nome}
                  <ChevronRight size={18} className="transition-transform duration-300"
                                style={{ transform: ativo ? "translateX(8px)" : "none", color: ativo ? BRAND.amber : "#D4D4D4" }} />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="grid flex-1 grid-cols-4 gap-8 p-8" style={{ background: "var(--ip-n-light)" }}>
          {atual.categorias.map((c) => (
            <div key={c.titulo}>
              <a href="#" className="flex items-center gap-1 text-base font-bold transition-colors hover:text-neutral-950" style={{ color: BRAND.night }}>
                {c.titulo}<ChevronRight size={16} />
              </a>
              <ul className="mt-3 space-y-2">
                {c.itens.map((it) => (
                  <li key={it}><a href="#" className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 hover:underline">{it}</a></li>
                ))}
              </ul>
            </div>
          ))}
          {atual.categorias.length < 3 && <div aria-hidden="true" />}
          {atual.categorias.length < 2 && <div aria-hidden="true" />}

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Marcas mais procuradas</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {dept.marcas.map((m) => (
                  <a key={m} href="#" className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-600 hover:border-neutral-400">{m}</a>
                ))}
              </div>
            </div>
            <a href="#" className="rounded-2xl bg-white p-4 shadow-card transition-shadow shadow-card-hover">
              <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: BRAND.amber }}>
                <Crown size={17} strokeWidth={2.2} className="text-white" />
              </span>
              <p className="font-petlove mt-3 text-base font-extrabold" style={{ color: BRAND.night }}>Clube Império</p>
              <p className="mt-1 text-sm text-neutral-600">15% de desconto em {dept.nome.toLowerCase()} e frete grátis na Ilha.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold" style={{ color: BRAND.ink }}>Quero assinar<ArrowRight size={15} /></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListaSuspensa({ itens }) {
  return (
    <ul className="absolute right-0 top-full z-50 mt-1.5 w-64 rounded-2xl p-5 ip-pop" style={{ background: "var(--ip-n-light)", boxShadow: "var(--ip-shadow-hover)" }}>
      {itens.map((it) => (
        <li key={it}><a href="#" className="block rounded-lg px-2 py-2 text-base text-neutral-600 transition-colors hover:text-neutral-900 hover:underline">{it}</a></li>
      ))}
    </ul>
  );
}

function OverlayBusca({ termo, onEscolher }) {
  const filtrados = termo.trim() ? BUSCAS_POPULARES.filter((t) => t.includes(termo.trim().toLowerCase())) : BUSCAS_POPULARES;
  const lista = filtrados.length ? filtrados : BUSCAS_POPULARES;
  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[80vh] overflow-y-auto rounded bg-white py-2.5 text-left shadow-drop ip-pop">
      <p className="px-5 pb-1 pt-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
        {filtrados.length ? "Termos mais buscados na Ilha" : "Sem resultados — veja o que buscam na Ilha"}
      </p>
      <ul>
        {lista.slice(0, 6).map((t) => (
          <li key={t}>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => onEscolher(t)}
                    className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm text-neutral-700 transition-colors hover:text-neutral-950 active:bg-neutral-100">
              <Search size={15} className="shrink-0 text-neutral-400" />{t}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-1 border-t border-neutral-100 px-5 pt-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">Atalhos rápidos</p>
        <div className="flex flex-wrap gap-2 pb-2">
          {ATALHOS_BUSCA.map(({ rotulo, Icon }) => (
            <button key={rotulo} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => onEscolher(rotulo)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                    style={{ borderColor: BRAND.amberLightest, background: "#fff" }}>
              <Icon size={14} style={{ color: BRAND.amber }} />{rotulo}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CABEÇALHO
   ════════════════════════════════════════════════════════════ */
function Cabecalho({ totalCarrinho, onAbrirCarrinho, onAbrirMenu, onAbrirLocal, modo, bairro, unidade }) {
  const [menuAtivo, setMenuAtivo] = useState(null);
  const [buscaFocada, setBuscaFocada] = useState(false);
  const [termo, setTermo] = useState("");
  const [contaAberta, setContaAberta] = useState(false);
  const primeiroRender = useRef(true);

  const rotuloLocal = modo === "retirada" && unidade ? unidade.curto : bairro;

  useEffect(() => {
    if (primeiroRender.current) { primeiroRender.current = false; return; }
    animar('[data-anime="badge"]', {
      scale: [1, 1.5, 1], duration: 520,
      ease: createSpring ? createSpring({ stiffness: 220, damping: 12 }) : "outElastic(1, .5)",
    });
  }, [totalCarrinho]);

  const deptAberto = DEPARTAMENTOS.find((d) => d.id === menuAtivo);

  // Itens da barra de menu, na ordem da Petlove adaptada à Império
  const ITENS_MENU = [
    ...DEPARTAMENTOS.map((d) => ({ id: d.id, rotulo: d.nome, tipo: "mega" })),
    { id: "ofertas", rotulo: "Ofertas", tipo: "link" },
    { id: "clube", rotulo: "Clube Império", tipo: "link", destaque: true },
    { id: "servicos", rotulo: "Serviços", tipo: "lista", itens: MENU_SERVICOS },
    { id: "mais", rotulo: "Mais", tipo: "lista", itens: MENU_MAIS },
  ];

  return (
    <React.Fragment>
      {/* ══════ DESKTOP ══════ */}
      <header className="sticky top-0 z-[60] hidden border-b lg:block" style={{ background: BRAND.yellow, borderColor: "#e0b000" }}>
        <div className="mx-auto flex h-[83px] max-w-[1400px] items-center justify-center px-8">
          <a href="#" className="flex shrink-0 items-center gap-2 px-3" aria-label="Império Pet — página inicial">
            <Logo className="h-11 w-auto object-contain" />
            <Marca className="text-[24px] min-[1400px]:text-[30px]" />
          </a>

          <button onClick={onAbrirLocal} aria-label={`Local de entrega: ${rotuloLocal}`} className="group flex h-full shrink-0 items-center gap-2 px-3 text-left">
            <MapPin size={24} className="text-neutral-800 transition-colors group-hover:text-neutral-950" />
            <span className="hidden leading-tight min-[1400px]:inline">
              <span className="block text-xs font-medium text-neutral-800">{modo === "retirada" && unidade ? "Retirar em" : "Entregar em"}</span>
              <span className="block max-w-[140px] truncate text-sm font-semibold transition-colors group-hover:text-neutral-950" style={{ color: BRAND.night }}>{rotuloLocal}</span>
            </span>
          </button>

          <div className="relative mx-3 min-w-[200px] max-w-[470px] flex-1 min-[1400px]:min-w-[270px]">
            <input id="ip-busca-desktop" type="search" value={termo} onChange={(e) => setTermo(e.target.value)}
                   placeholder="O que seu pet precisa?"
                   className="h-12 w-full rounded border border-neutral-300 bg-white py-4 pl-4 pr-12 text-sm tracking-wide text-neutral-800 outline-none transition-all focus:border-neutral-900"
                   onFocus={() => setBuscaFocada(true)} onBlur={() => setBuscaFocada(false)}
                   onKeyDown={(e) => e.key === "Escape" && e.target.blur()} />
            <Search size={24} className="pointer-events-none absolute right-4 top-3 text-neutral-400" />
            {buscaFocada && <OverlayBusca termo={termo} onEscolher={(t) => { setTermo(t); setBuscaFocada(false); }} />}
          </div>

          <a href="#clube" aria-label="Compras recorrentes" className="group flex h-full shrink-0 items-center gap-3 px-3">
            <Repeat size={24} className="text-neutral-800 transition-colors group-hover:text-neutral-950" />
            <span className="hidden text-sm font-medium text-neutral-800 transition-colors group-hover:text-neutral-950 min-[1400px]:inline">Compras recorrentes</span>
          </a>

          <a href="#" aria-label="Meus pedidos" className="group flex h-full shrink-0 items-center gap-3 px-3">
            <Package size={24} className="text-neutral-800 transition-colors group-hover:text-neutral-950" />
            <span className="hidden text-sm font-medium text-neutral-800 transition-colors group-hover:text-neutral-950 min-[1400px]:inline">Meus pedidos</span>
          </a>

          <button onClick={onAbrirCarrinho} aria-label={`Abrir carrinho com ${totalCarrinho} itens`} className="relative ml-4 shrink-0 p-1">
            <ShoppingCart size={26} style={{ color: BRAND.night }} />
            {totalCarrinho > 0 && (
              <span data-anime="badge"
                    className="absolute right-0 top-0 grid h-5 min-w-[20px] -translate-y-1/3 translate-x-1/2 place-items-center rounded-full px-1 text-xs font-bold ring-2 ring-[#F4C400]"
                    style={{ background: BRAND.night, color: BRAND.yellow }}>
                {totalCarrinho}
              </span>
            )}
          </button>

          <div className="relative ml-4 h-full w-[180px] shrink-0 min-[1400px]:ml-7 min-[1400px]:w-[230px]" style={{ background: "rgba(0,0,0,0.06)" }}
               onMouseEnter={() => setContaAberta(true)} onMouseLeave={() => setContaAberta(false)}>
            <button className="flex h-full w-full items-center justify-center gap-3 text-base font-medium text-neutral-900">
              Entrar | Cadastrar
              <ChevronDown size={20} className="transition-transform" style={{ transform: contaAberta ? "rotate(180deg)" : "none" }} />
            </button>
            {contaAberta && (
              <ul className="absolute right-0 top-[74px] z-50 w-[260px] rounded bg-white px-2 py-2 shadow-drop ip-pop">
                {MENU_CONTA.map(({ rotulo, Icon }) => (
                  <li key={rotulo}>
                    <a href="#" className="flex items-center gap-3 rounded px-3 py-3 text-sm text-neutral-600 transition-colors hover:bg-neutral-50">
                      <Icon size={20} className="text-neutral-400" />{rotulo}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* Barra de menu — centralizada, 52px, sublinhado de 3px no item ativo */}
      <nav className="relative z-50 hidden h-[52px] border-b bg-white lg:block" style={{ borderColor: "var(--ip-n-light)" }}
           aria-label="Menu de navegação" onMouseLeave={() => setMenuAtivo(null)}>
        <ul className="flex h-full items-center justify-center">
          {ITENS_MENU.map((it) => {
            const aberto = menuAtivo === it.id;
            const temDrop = it.tipo !== "link";
            return (
              <li key={it.id} className={`h-full ${it.tipo === "lista" ? "relative" : ""}`}
                  onMouseEnter={() => setMenuAtivo(temDrop ? it.id : null)}>
                <a href="#" onFocus={() => setMenuAtivo(temDrop ? it.id : null)} aria-expanded={temDrop ? aberto : undefined}
                   className="flex h-full flex-col justify-center px-3 text-sm transition-colors lg:px-3.5 xl:text-base"
                   style={{ color: it.destaque ? BRAND.amberDark : aberto ? BRAND.night : "#6B6B6B", fontWeight: it.destaque ? 600 : 400 }}>
                  <span className="flex items-center gap-2">
                    {it.destaque && <Crown size={16} style={{ color: BRAND.amber }} />}
                    {it.rotulo}
                    {temDrop && <ChevronDown size={16} className="text-neutral-400 transition-transform duration-300" style={{ transform: aberto ? "rotate(-180deg)" : "none" }} />}
                  </span>
                  <span className="mt-2.5 h-[3px] rounded-full transition-opacity duration-200"
                        style={{ background: BRAND.amber, opacity: aberto ? 1 : 0 }} />
                </a>
                {aberto && it.tipo === "lista" && <ListaSuspensa itens={it.itens} />}
              </li>
            );
          })}
        </ul>
        {deptAberto && <MegaPainel dept={deptAberto} />}
      </nav>

      {/* ══════ MOBILE ══════ */}
      <header data-mobile-header className="sticky z-50 shadow-sm lg:hidden" style={{ top: "env(safe-area-inset-top, 0px)", background: BRAND.yellow }}>
        <div className="flex items-center gap-3 px-4 pt-3">
          <button onClick={onAbrirMenu} aria-label="Abrir menu" className="-ml-1.5 rounded-lg p-1.5"><Menu size={24} style={{ color: BRAND.night }} /></button>
          <a href="#" className="mx-auto flex items-center gap-1.5" aria-label="Império Pet — página inicial">
            <Logo className="h-9 w-auto object-contain" />
            <Marca className="text-[24px]" />
          </a>
          <button onClick={onAbrirCarrinho} aria-label={`Abrir carrinho com ${totalCarrinho} itens`} className="relative -mr-1.5 rounded-lg p-1.5">
            <ShoppingCart size={24} style={{ color: BRAND.night }} />
            {totalCarrinho > 0 && (
              <span data-anime="badge" className="absolute right-0 top-0 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-bold ring-2 ring-[#F4C400]" style={{ background: BRAND.night, color: BRAND.yellow }}>
                {totalCarrinho}
              </span>
            )}
          </button>
        </div>
        <div className="relative px-4 pt-2.5">
          <input id="ip-busca-mobile" type="search" placeholder="O que seu pet precisa?"
                 className="h-11 w-full rounded border border-neutral-300 bg-white pl-4 pr-11 text-sm outline-none focus:border-neutral-900" />
          <Search size={20} className="pointer-events-none absolute right-7 top-[22px] text-neutral-400" />
        </div>
        <div className="px-4 pb-2.5 pt-2">
          <button onClick={onAbrirLocal} className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-left" style={{ background: "rgba(0, 0, 0, 0.07)" }}>
            <MapPin size={14} className="shrink-0" style={{ color: BRAND.night }} />
            <span className="flex-1 truncate text-xs font-medium text-neutral-900">
              {modo === "retirada" && unidade ? "Retirar na " : "Receber hoje em: "}
              <strong style={{ color: BRAND.night }}>{modo === "retirada" && unidade ? unidade.nome : bairro}</strong>
              <span className="text-neutral-700"> (Toque para alterar)</span>
            </span>
            <ChevronDown size={15} className="shrink-0 text-neutral-700" />
          </button>
        </div>
      </header>
    </React.Fragment>
  );
}

/* ════════════════════════════════════════════════════════════
   HOME — secções
   ════════════════════════════════════════════════════════════ */

/* Cards de próxima ação — entram com overshoot, como na Petlove */
function ProximaAcao({ onIr }) {
  return (
    <div className="scrollbar-hide mx-auto flex max-w-[1050px] snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 pt-4 md:px-0">
      {SUGESTOES.map(({ titulo, desc, Icon, cor, destaque, alvo }, i) => (
        <button key={titulo} onClick={() => onIr(alvo)}
                className="ip-overshoot flex max-h-[108px] min-w-[300px] snap-start items-center gap-3 rounded-2xl border p-4 text-left md:w-1/3 md:min-w-[330px]"
                style={{ animationDelay: `${i * 120}ms`, borderColor: BRAND.amberLightest, background: destaque ? BRAND.amberLightest : "#fff" }}>
          <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full" style={{ background: destaque ? "#fff" : "var(--ip-n-light)", color: cor }}>
            <Icon size={22} strokeWidth={2.2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-medium leading-tight" style={{ color: BRAND.night }}>{titulo}</span>
            <span className="mt-1 line-clamp-2 text-sm leading-tight text-neutral-600">{desc}</span>
          </span>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white shadow-card" style={{ color: BRAND.night }}>
            <ArrowRight size={18} />
          </span>
        </button>
      ))}
    </div>
  );
}

/* Chips de atalho — sticky logo abaixo do cabeçalho no desktop */
function ChipsAtalho({ ativo, onIr }) {
  const trilhoRef = useRef(null);
  const sentinelaRef = useRef(null);
  const [grudado, setGrudado] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const s = sentinelaRef.current;
      if (s) setGrudado(s.getBoundingClientRect().top < 84);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <React.Fragment>
      <div ref={sentinelaRef} aria-hidden="true" />
      <div className="relative z-30 bg-transparent transition-shadow lg:sticky lg:top-[83px]"
           style={grudado ? { background: "#fff", boxShadow: "0 4px 8px var(--ip-n-light), 0 0 4px var(--ip-n-light)" } : undefined}>
        <div className="relative mx-auto flex max-w-[1050px] items-center">
          <div ref={trilhoRef} className="scrollbar-hide flex w-full gap-2 overflow-x-auto scroll-smooth px-4 py-2 md:pl-0.5 md:pr-12">
            {CHIPS.map(({ id, rotulo, Icon }) => {
              const sel = ativo === id;
              return (
                <button key={id} onClick={() => onIr(id)} aria-pressed={sel}
                        className="inline-flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-4 text-base font-medium transition-all hover:shadow-card"
                        style={sel
                          ? { background: BRAND.amberLightest, borderColor: BRAND.amber, color: BRAND.amberDark }
                          : { background: "#fff", borderColor: BRAND.amberLightest, color: "#6B6B6B" }}>
                  <Icon size={22} style={{ color: sel ? BRAND.amberDark : "#9A9A9A" }} />{rotulo}
                </button>
              );
            })}
          </div>
          <BotaoSeta direcao="dir" rotulo="Próximo" className="absolute right-0 hidden md:grid"
                     onClick={() => trilhoRef.current?.scrollBy({ left: 320, behavior: "smooth" })} />
        </div>
      </div>
    </React.Fragment>
  );
}

function ArteBanner({ tipo, acento }) {
  const comum = { className: "h-full w-full", viewBox: "0 0 220 160", "aria-hidden": true };
  if (tipo === "entrega") return (
    <svg {...comum}>
      <circle cx="140" cy="76" r="60" fill={acento} opacity=".16" />
      <rect x="40" y="70" width="80" height="46" rx="8" fill="#fff" />
      <path d="M120 84h28l22 22v10h-50Z" fill={acento} />
      <circle cx="66" cy="120" r="12" fill="#fff" /><circle cx="66" cy="120" r="5" fill={acento} />
      <circle cx="148" cy="120" r="12" fill="#fff" /><circle cx="148" cy="120" r="5" fill={acento} />
      <path d="M14 90h22M6 102h30M20 78h16" stroke="#fff" strokeOpacity=".55" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
  if (tipo === "clube") return (
    <svg {...comum}>
      <circle cx="120" cy="78" r="62" fill={acento} opacity=".2" />
      <path d="M76 54h60l-8 64a8 8 0 0 1-8 7H92a8 8 0 0 1-8-7Z" fill="#fff" />
      <path d="M84 72h44" stroke={acento} strokeWidth="6" strokeLinecap="round" />
      <path d="M91 40c.5-.9 1.8-.9 2.3 0l7 9c.4.6 1.1.7 1.7.3l8.6-5c1-.6 2.2.3 2 1.4l-4 21H82.5l-4-21c-.2-1.1 1-2 2-1.4l8.6 5c.6.4 1.3.3 1.7-.3Z" fill={acento} />
      <circle cx="170" cy="44" r="6" fill="#fff" opacity=".7" /><circle cx="44" cy="112" r="9" fill="#fff" opacity=".5" />
    </svg>
  );
  if (tipo === "farmacia") return (
    <svg {...comum}>
      <circle cx="120" cy="80" r="62" fill={acento} opacity=".2" />
      <rect x="72" y="46" width="84" height="74" rx="8" fill="#fff" />
      <rect x="72" y="46" width="84" height="20" rx="8" fill={acento} />
      <rect x="86" y="80" width="56" height="9" rx="4.5" fill={acento} opacity=".7" />
      <rect x="86" y="96" width="34" height="7" rx="3.5" fill={acento} opacity=".45" />
      <circle cx="174" cy="112" r="7" fill="#fff" opacity=".6" />
    </svg>
  );
  return (
    <svg {...comum}>
      <circle cx="132" cy="78" r="60" fill={acento} opacity=".18" />
      <rect x="84" y="46" width="76" height="76" rx="14" fill="#fff" />
      <path d="M122 62v44M100 84h44" stroke={acento} strokeWidth="12" strokeLinecap="round" />
      <path d="M40 74c0-6 4-10 10-10s10 4 10 10-4 14-10 20c-6-6-10-14-10-20Z" fill="#fff" opacity=".55" />
    </svg>
  );
}

/* Banner em carrossel centrado: vizinhos desfocados, a .5 de opacidade e a .8 de escala */
function BannerCarrossel() {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const toqueRef = useRef(null);

  useEffect(() => {
    if (pausado) return;
    const t = setInterval(() => setIndice((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [pausado]);

  const ir = (d) => setIndice((i) => (i + d + SLIDES.length) % SLIDES.length);

  return (
    <section className="ip-banner relative pt-5 md:mb-12" aria-roledescription="carrossel" aria-label="Campanhas em destaque"
             onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)}
             onTouchStart={(e) => { toqueRef.current = e.touches[0].clientX; setPausado(true); }}
             onTouchEnd={(e) => {
               const ini = toqueRef.current; toqueRef.current = null; setPausado(false);
               if (ini == null) return;
               const dx = e.changedTouches[0].clientX - ini;
               if (Math.abs(dx) > 40) ir(dx < 0 ? 1 : -1);
             }}>
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-700 ease-out"
             style={{ gap: "var(--gap)", transform: `translateX(calc(50% - var(--w) / 2 - ${indice} * (var(--w) + var(--gap))))` }}>
          {SLIDES.map((s, i) => {
            const ativo = i === indice;
            return (
              <a key={s.id} href="#" aria-hidden={!ativo} tabIndex={ativo ? 0 : -1}
                 className="ip-cq relative block aspect-[320/176] shrink-0 overflow-hidden rounded-2xl transition-all duration-500 md:aspect-[1078/428]"
                 style={{
                   width: "var(--w)",
                   background: `linear-gradient(115deg, ${s.de} 0%, ${s.para} 100%)`,
                   filter: ativo ? "none" : "blur(2px)",
                   opacity: ativo ? 1 : 0.5,
                   transform: ativo ? "scale(1)" : "scale(.8)",
                 }}>
                <div className="flex h-full items-center gap-[3cqw] px-[6cqw]">
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center rounded-full font-bold uppercase"
                          style={{ background: s.claro ? "rgba(17,17,17,.1)" : "rgba(255,255,255,.14)", color: s.claro ? "#111111" : s.acento, fontSize: "clamp(9px, 1.5cqw, 13px)", padding: "0.4em 1em", letterSpacing: ".12em" }}>
                      {s.eyebrow}
                    </span>
                    <h2 className="font-petlove mt-[1.6cqw] font-extrabold leading-[1.05]" data-claro={s.claro ? "1" : "0"}
                        style={{ fontSize: "clamp(18px, 5cqw, 50px)", textWrap: "balance", color: s.claro ? "#111111" : "#fff" }}>{s.titulo}</h2>
                    <p className="mt-[1.2cqw] max-w-[46ch]" style={{ fontSize: "clamp(11px, 1.7cqw, 17px)", color: s.claro ? "rgba(17,17,17,.75)" : "rgba(255,255,255,.75)" }}>{s.texto}</p>
                    <span className="mt-[2.2cqw] inline-flex items-center gap-2 rounded-lg font-bold"
                          style={{ background: s.claro ? BRAND.ink : BRAND.yellow, color: s.claro ? BRAND.yellow : BRAND.ink, fontSize: "clamp(11px, 1.6cqw, 16px)", padding: "0.8em 1.4em" }}>
                      {s.cta}<ArrowRight size={16} />
                    </span>
                  </div>
                  <div className="h-[70%] w-[30%] shrink-0"><ArteBanner tipo={s.arte} acento={s.acento} /></div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <BotaoSeta direcao="esq" rotulo="Voltar para o banner anterior" tamanho={48} onClick={() => ir(-1)}
                 className="absolute top-1/2 z-10 hidden md:grid" />
      <BotaoSeta direcao="dir" rotulo="Ir para o próximo banner" tamanho={48} onClick={() => ir(1)}
                 className="absolute top-1/2 z-10 hidden md:grid" />
      <style>{`
        .ip-banner > button { top: calc(20px + var(--w) * 0.1985); transform: translateY(-50%); }
        .ip-banner > button:nth-of-type(1) { left: max(8px, calc(50% - var(--w) / 2 - 24px)); }
        .ip-banner > button:nth-of-type(2) { right: max(8px, calc(50% - var(--w) / 2 - 24px)); }
      `}</style>

      <div className="mt-3 flex justify-center gap-3 md:mt-6">
        {SLIDES.map((s, i) => (
          <button key={s.id} onClick={() => setIndice(i)} aria-label={`Ir para a campanha ${i + 1}`}
                  className="h-3 w-3 rounded-full transition-colors duration-300"
                  style={{ background: i === indice ? BRAND.amber : "var(--ip-n-light)" }} />
        ))}
      </div>
    </section>
  );
}

/* Categorias por pet: foto num círculo com aro amarelo, item de 105px */
function ComprePorPet() {
  return (
    <section className="mx-auto my-8 max-w-[1078px] px-4 md:px-0">
      <h2 className="font-petlove text-2xl font-extrabold" style={{ color: BRAND.night }}>Compre por pet</h2>
      <ul className="scrollbar-hide -mx-4 mt-6 flex gap-3 overflow-x-auto px-4 pt-1 md:mx-0 md:justify-between md:px-0">
        {COMPRE_POR_PET.map(({ nome, img, alt }) => (
          <li key={nome} className="w-[105px] shrink-0">
            <a href="#" className="group flex flex-col items-center">
              <span className="block h-[92px] w-[92px] overflow-hidden rounded-full transition-transform duration-200 group-hover:scale-105"
                    style={{ background: "#FFF4CC", border: `4px solid ${BRAND.yellow}` }}>
                <img src={img} alt={alt} width="92" height="92" loading="lazy" className="h-full w-full object-cover" />
              </span>
              <span className="mt-3 text-center text-base font-medium leading-tight" style={{ color: BRAND.night }}>{nome}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Card de produto ─────────────────────────────────────── */
function ArteProduto({ tipo, cor }) {
  if (tipo === "caixa") return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <rect x="26" y="30" width="68" height="62" rx="6" fill={cor} />
      <rect x="26" y="30" width="68" height="18" rx="6" fill="#fff" opacity=".22" />
      <rect x="36" y="56" width="48" height="8" rx="4" fill="#fff" opacity=".9" />
      <rect x="36" y="70" width="30" height="6" rx="3" fill="#fff" opacity=".55" />
      <circle cx="80" cy="78" r="8" fill="#fff" opacity=".85" />
      <path d="M76.5 78h7M80 74.5v7" stroke={cor} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <path d="M34 26h52a4 4 0 0 1 4 4v62a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6V30a4 4 0 0 1 4-4Z" fill={cor} />
      <path d="M34 26h52l-6 8H40Z" fill="#fff" opacity=".3" />
      <rect x="40" y="48" width="40" height="26" rx="5" fill="#fff" opacity=".92" />
      <path d="M60 55c3 0 5 2.4 5 5.5S62.6 68 60 68s-5-2.4-5-5.5S57 55 60 55Z" fill={cor} opacity=".85" />
      <circle cx="51" cy="54" r="2.6" fill={cor} opacity=".85" /><circle cx="69" cy="54" r="2.6" fill={cor} opacity=".85" />
      <rect x="42" y="80" width="36" height="5" rx="2.5" fill="#fff" opacity=".5" />
    </svg>
  );
}

function Estrelas({ nota, avaliacoes }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Nota ${nota} de 5, com ${avaliacoes} avaliações`}>
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={12} fill={n <= Math.round(nota) ? BRAND.amber : "none"}
                strokeWidth={n <= Math.round(nota) ? 0 : 1.6} style={{ color: BRAND.amber }} />
        ))}
      </span>
      <span className="text-xs font-bold" style={{ color: BRAND.night }}>{nota.toFixed(1)}</span>
      <span className="text-xs text-neutral-400">({avaliacoes})</span>
    </div>
  );
}

function CardProduto({ produto, favorito, quantidade, onFavoritar, onAdicionar, onIncrementar, onDecrementar }) {
  const desconto = Math.round((1 - produto.pix / produto.tabela) * 100);
  const [variacao, setVariacao] = useState(produto.variacoes[0]);
  const cardRef = useRef(null);
  const coracaoRef = useRef(null);

  const aoFavoritar = () => {
    onFavoritar(produto.id);
    animar(coracaoRef.current, { scale: [1, 1.5, 1], rotate: [0, -14, 0], duration: 560,
      ease: createSpring ? createSpring({ stiffness: 260, damping: 11 }) : "outBack" });
  };
  const aoAdicionar = () => {
    onAdicionar(produto.id);
    animar(cardRef.current, { translateY: [0, -10, 0], duration: 440, ease: "out(3)" });
  };

  return (
    <article ref={cardRef} className="group/card flex h-full w-full flex-col rounded-2xl bg-white p-3 shadow-card transition-shadow duration-300 shadow-card-hover md:p-4">
      <div className="relative mb-2.5 overflow-hidden rounded-xl">
        <div className="absolute left-0 top-0 z-10 flex flex-col items-start gap-1">
          <span className="inline-flex h-6 items-center rounded-lg px-2 text-xs font-bold" style={{ background: BRAND.ink, color: BRAND.yellow }}>-{desconto}%</span>
          {produto.freteGratis && (
            <span className="inline-flex h-6 items-center rounded-lg px-2 text-[11px] font-medium" style={{ background: "#F4F4F4", color: "#111111" }}>Frete Grátis SLZ</span>
          )}
        </div>
        <button onClick={aoFavoritar} aria-pressed={favorito}
                aria-label={favorito ? `Remover ${produto.marca} dos favoritos` : `Favoritar ${produto.marca}`}
                className="absolute right-0 top-0 z-10 grid h-9 w-9 place-items-center rounded-full bg-white shadow-card">
          <span ref={coracaoRef} className="grid place-items-center">
            <Heart size={18} fill={favorito ? BRAND.ink : "none"} style={{ color: favorito ? BRAND.ink : "#9A9A9A" }} />
          </span>
        </button>
        <div className="mx-auto aspect-square w-full transition-transform duration-300 group-hover/card:scale-105">
          <ArteProduto tipo={produto.arte} cor={produto.cor} />
        </div>
      </div>

      <div className="mb-2 flex flex-wrap gap-1" role="group" aria-label="Escolher variação">
        {produto.variacoes.map((v) => {
          const ativa = v === variacao;
          return (
            <button key={v} onClick={() => setVariacao(v)} aria-pressed={ativa}
                    className="inline-flex h-7 items-center rounded-full border px-2.5 text-[11px] font-medium transition-all"
                    style={ativa
                      ? { borderColor: BRAND.amber, background: BRAND.amberLightest, color: BRAND.amberDark }
                      : { borderColor: "#E6E6E6", background: "#fff", color: "#6B6B6B" }}>
              {v}
            </button>
          );
        })}
      </div>

      {produto.expresso && (
        <p className="mb-1.5 inline-flex h-6 w-fit items-center gap-1 rounded-lg px-2 text-[11px] font-medium" style={{ background: "#FFF4CC", color: "#111111" }}>
          <Zap size={11} fill={BRAND.orange} strokeWidth={0} />Império Express: chega hoje em São Luís
        </p>
      )}

      <Estrelas nota={produto.nota} avaliacoes={produto.avaliacoes} />
      <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400">{produto.marca}</p>
      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-tight text-neutral-800">{produto.nome}</h3>

      <div className="mt-2.5">
        <p className="text-xs text-neutral-400 line-through">{brl(produto.tabela)}</p>
        <p className="font-petlove text-xl font-extrabold text-neutral-900" style={{ fontVariantNumeric: "tabular-nums" }}>
          {brl(produto.pix)}<span className="ml-1 align-middle text-[10px] font-bold text-neutral-400">no Pix</span>
        </p>
        <div className="mt-1 flex items-center gap-1.5 rounded-lg border border-[#F5B800] bg-[#FFF4CC] p-1.5">
          <Crown size={13} className="shrink-0" style={{ color: BRAND.amber }} />
          <span className="text-[11px] font-bold leading-tight text-[#111111]" style={{ fontVariantNumeric: "tabular-nums" }}>{brl(produto.clube)} com Clube Império</span>
        </div>
      </div>

      <div className="mt-auto pt-3">
        {quantidade > 0 ? (
          <div className="flex h-10 items-center justify-between rounded-xl px-1" style={{ background: BRAND.ink }}>
            <button onClick={() => onDecrementar(produto.id)} aria-label={`Diminuir ${produto.marca}`}
                    className="grid h-8 w-8 place-items-center rounded-lg text-white hover:bg-white/20">
              {quantidade === 1 ? <Trash2 size={15} /> : <Minus size={16} strokeWidth={2.6} />}
            </button>
            <span className="font-petlove text-sm font-extrabold text-white" style={{ fontVariantNumeric: "tabular-nums" }}>{quantidade}</span>
            <button onClick={() => onIncrementar(produto.id)} aria-label={`Aumentar ${produto.marca}`}
                    className="grid h-8 w-8 place-items-center rounded-lg text-white hover:bg-white/20">
              <Plus size={16} strokeWidth={2.6} />
            </button>
          </div>
        ) : (
          <button onClick={aoAdicionar}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#F5B800] text-sm font-bold text-[#111111] shadow-sm transition-all hover:bg-[#111111] hover:text-[#F5B800] active:scale-95">
            <ShoppingCart size={15} />Adicionar
          </button>
        )}
      </div>
    </article>
  );
}

function Vitrine({ produtos, favoritos, quantidades, onFavoritar, onAdicionar, onIncrementar, onDecrementar }) {
  const trilhoRef = useRef(null);
  const props = (p) => ({ produto: p, favorito: favoritos.includes(p.id), quantidade: quantidades[p.id] || 0, onFavoritar, onAdicionar, onIncrementar, onDecrementar });

  return (
    <section id="mais-vendidos" className="scroll-mt-40">
      <Onda cor="var(--ip-n-light)" posicao="topo" />
      <div style={{ background: "var(--ip-n-light)" }}>
        <div className="mx-auto max-w-[1078px] py-8 md:py-12">
          <div className="flex items-end justify-between gap-4 px-4 pb-5 md:px-0">
            <div>
              <span className="inline-flex h-6 items-center rounded-lg px-2.5 text-xs font-medium" style={{ background: "#FFF4CC", color: "#111111" }}>Ofertas relâmpago</span>
              <h2 className="font-petlove mt-2 text-2xl font-extrabold md:text-[32px]" style={{ color: BRAND.night }}>Mais Vendidos em São Luís</h2>
              <p className="mt-1 text-sm text-neutral-500">O que mais sai das nossas três lojas na Ilha</p>
            </div>
            <div className="hidden gap-4 md:flex">
              <BotaoSeta direcao="esq" rotulo="Produtos anteriores" onClick={() => trilhoRef.current?.scrollBy({ left: -440, behavior: "smooth" })} />
              <BotaoSeta direcao="dir" rotulo="Próximos produtos" onClick={() => trilhoRef.current?.scrollBy({ left: 440, behavior: "smooth" })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 px-4 md:hidden">
            {produtos.map((p) => <CardProduto key={p.id} {...props(p)} />)}
          </div>
          <div ref={trilhoRef} className="scrollbar-hide hidden snap-x gap-4 overflow-x-auto scroll-smooth py-2 md:flex">
            {produtos.map((p) => (
              <div key={p.id} className="w-[calc((100%-3rem)/4)] shrink-0 snap-start"><CardProduto {...props(p)} /></div>
            ))}
          </div>
        </div>
      </div>
      <Onda cor="var(--ip-n-light)" posicao="base" />
    </section>
  );
}

/* ── Clube Império ─────────────────────────────────────────── */
function SecaoClube() {
  return (
    <section id="clube" className="scroll-mt-40">
      <Onda cor={BRAND.amberLightest} posicao="topo" />
      <div className="overflow-hidden pb-6 pt-8 md:pt-12" style={{ background: BRAND.amberLightest }}>
        <div className="mx-auto max-w-[1078px] px-4 md:px-0">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 font-petlove text-lg font-extrabold" style={{ color: BRAND.amberDark }}>
              <Crown size={22} style={{ color: BRAND.amber }} />Clube Império
            </span>
            <div className="mt-2"><TituloSecao centro>Quer frete grátis, descontos exclusivos e brindes?</TituloSecao></div>
          </div>

          <div className="mx-auto mt-8 grid max-w-[640px] gap-4 sm:grid-cols-2">
            {PLANOS_CLUBE.map((p) => (
              <div key={p.id} className="relative flex h-[250px] flex-col rounded-2xl bg-white p-6 shadow-card"
                   style={p.destaque ? { outline: `4px solid ${BRAND.amber}`, outlineOffset: -4 } : undefined}>
                {p.destaque && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: BRAND.amber }}>
                    <Star size={12} fill="#fff" strokeWidth={0} />A melhor escolha
                  </span>
                )}
                <h3 className="font-petlove text-[32px] font-extrabold leading-none" style={{ color: BRAND.night }}>{p.nome}</h3>
                <div className="flex flex-1 flex-col justify-center gap-1">
                  {p.prefixo && <span className="text-base font-medium" style={{ color: BRAND.night }}>{p.prefixo}</span>}
                  <span className="font-petlove text-[40px] font-extrabold leading-none" style={{ color: BRAND.night }}>{p.parcela}</span>
                  <span className="text-sm font-medium text-neutral-500">{p.rodape}</span>
                </div>
                <button className="h-10 w-full rounded-lg text-sm font-bold transition-transform active:scale-[.96]"
                        style={p.destaque ? { background: BRAND.yellow, color: BRAND.ink } : { background: BRAND.ink, color: BRAND.yellow }}>
                  Quero assinar
                </button>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-4 grid max-w-[640px] gap-3 sm:grid-cols-2">
            <button className="h-10 rounded-lg border-2 text-sm font-bold" style={{ borderColor: BRAND.ink, background: "#fff", color: BRAND.ink }}>Conferir benefícios</button>
            <button className="h-10 rounded-lg text-sm font-bold" style={{ background: BRAND.ink, color: BRAND.yellow }}>Calcular economia</button>
          </div>
        </div>

        {/* Marquee infinito de benefícios */}
        <div className="relative my-8 overflow-hidden py-4" style={{ background: BRAND.night }} aria-label="Benefícios do Clube">
          <ul className="ip-marquee flex w-max gap-10">
            {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((m, i) => (
              <li key={i} className="flex items-center gap-2 whitespace-nowrap font-petlove text-lg font-extrabold text-white" aria-hidden={i >= MARQUEE.length}>
                <Crown size={20} style={{ color: BRAND.amber }} />{m}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto max-w-[1078px] px-4 md:px-0">
          <h3 className="font-petlove text-center text-xl font-extrabold md:text-2xl" style={{ color: BRAND.night }}>Como funciona</h3>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {PASSOS_CLUBE.map(({ n, titulo, desc, Icon }) => (
              <li key={n} className="rounded-2xl bg-white p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: BRAND.amberLightest, color: BRAND.amberDark }}><Icon size={20} /></span>
                  <span className="font-petlove grid h-8 w-8 place-items-center rounded-full text-lg font-extrabold" style={{ background: BRAND.yellow, color: BRAND.ink }}>{n}</span>
                </div>
                <h4 className="mt-3 text-base font-bold leading-tight" style={{ color: BRAND.night }}>{titulo}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{desc}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-center text-xs text-neutral-500">*Desconto válido em produtos vendidos e entregues pela Império Pet.</p>
        </div>
      </div>
      <Onda cor={BRAND.amberLightest} posicao="base" />
    </section>
  );
}

/* ── Benefícios pra você ───────────────────────────────────── */
function Beneficios({ onIr }) {
  const [ativo, setAtivo] = useState(2);
  return (
    <section id="beneficios" className="ip-beneficios relative my-12 scroll-mt-40">
      <div className="absolute inset-x-0 top-0 h-[120px] md:h-[150px]"
           style={{ background: "var(--ip-n-light)", borderBottomLeftRadius: "50% 60%", borderBottomRightRadius: "50% 60%" }} />
      <div className="relative pb-6 pt-4"><TituloSecao centro>Benefícios pra você</TituloSecao></div>

      <ul className="scrollbar-hide relative flex gap-6 overflow-x-auto px-4 pb-6 md:justify-center md:gap-16">
        {BENEFICIOS.map(({ id, nome, Icon, cor }, i) => {
          const sel = i === ativo;
          return (
            <li key={id} className="flex shrink-0 flex-col items-center" style={{ transform: `translateY(${[-20, -10, 0, -10, -20][i]}px)` }}>
              <button onClick={() => setAtivo(i)} aria-pressed={sel} aria-label={nome}
                      className="grid h-24 w-24 place-items-center rounded-full bg-white transition-all duration-300"
                      style={{ boxShadow: "0 8px 16px rgba(17,17,17,.04), 0 0 12px rgba(17,17,17,.12)", transform: sel ? "scale(1)" : "scale(.6)", border: sel ? `4px solid ${BRAND.amber}` : "4px solid transparent", color: cor }}>
                <Icon size={40} strokeWidth={1.8} />
              </button>
              <span className="mt-1 w-[90px] text-center text-xs font-bold leading-tight transition-opacity" style={{ color: BRAND.night, opacity: sel ? 1 : 0.5, fontSize: sel ? 14 : 12 }}>{nome}</span>
            </li>
          );
        })}
      </ul>

      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-out"
             style={{ transform: `translateX(calc(50% - var(--w) / 2 - ${ativo} * var(--w)))` }}>
          {BENEFICIOS.map((b, i) => {
            const sel = i === ativo;
            const Icone = b.Icon;
            return (
              <div key={b.id} className="shrink-0 px-2" style={{ width: "var(--w)" }}>
                <div className="flex h-full min-h-[237px] items-center gap-3 rounded-2xl p-5 transition-all duration-300"
                     style={{ background: "var(--ip-n-light)", filter: sel ? "none" : "blur(1.5px)", opacity: sel ? 1 : 0.5, transform: sel ? "scale(1)" : "scale(.9)" }}
                     onClick={() => setAtivo(i)}>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-bold" style={{ color: BRAND.amberDark }}>{b.rotulo}</span>
                    <h3 className="font-petlove mb-4 mt-1 font-extrabold leading-tight" style={{ color: BRAND.night, fontSize: sel ? 24 : 16 }}>{b.titulo}</h3>
                    <button onClick={(e) => { e.stopPropagation(); if (b.alvo) onIr(b.alvo); }}
                            className="h-10 w-full rounded-lg text-sm font-bold transition-transform active:scale-[.96]"
                            style={{ background: BRAND.ink, color: BRAND.yellow }} tabIndex={sel ? 0 : -1}>
                      {b.cta}
                    </button>
                  </div>
                  <span className="grid shrink-0 place-items-center rounded-full bg-white transition-all" style={{ width: sel ? 140 : 110, height: sel ? 140 : 110, color: b.cor }}>
                    <Icone size={sel ? 64 : 48} strokeWidth={1.6} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Serviços ──────────────────────────────────────────────── */
function SecaoServicos() {
  const trilhoRef = useRef(null);
  return (
    <section id="servicos" className="my-10 scroll-mt-40">
      <Onda cor="var(--ip-sky)" posicao="topo" />
      <div style={{ background: "var(--ip-sky)" }}>
        <div className="mx-auto max-w-[1078px] px-4 py-8 md:px-5">
          <TituloSecao centro>Serviços Império Pet</TituloSecao>

          {/* Banner de assinatura de serviços */}
          <div className="relative mt-8 flex flex-col gap-3 overflow-hidden rounded-[20px] md:flex-row md:items-center" style={{ background: BRAND.night }}>
            <div className="relative flex items-center gap-6 px-6 py-4 md:w-[300px] md:shrink-0">
              <div className="absolute -left-2.5 -top-2.5 h-[calc(100%+20px)] w-full" style={{ background: BRAND.amberLightest, borderRadius: "20px 0 90% 20px" }} />
              <h3 className="font-petlove relative text-2xl font-extrabold leading-tight" style={{ color: BRAND.night }}>Assine e tenha até 20% OFF sempre</h3>
            </div>
            <ul className="flex flex-1 flex-col gap-2 px-5 md:flex-row md:justify-center md:gap-4 md:py-5">
              {[["Equipe própria:", "veterinários nas 3 unidades"], ["Todo tipo de cuidado:", "banho, tosa, consulta e vacina"], ["Sem limite de uso:", "para todos os seus pets"]].map(([t, d]) => (
                <li key={t} className="flex items-center gap-2 rounded-[40px] px-1 py-3 text-white md:w-[155px] md:flex-col md:gap-1 md:px-3 md:text-center" style={{ background: "rgba(255,255,255,.06)" }}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl" style={{ background: BRAND.amber }}><ShieldCheck size={16} className="text-white" /></span>
                  <span><strong className="block text-sm">{t}</strong><span className="text-xs text-neutral-300">{d}</span></span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 px-5 pb-5 md:py-3 md:pl-1 md:pr-6">
              <button className="h-10 rounded-lg px-4 text-sm font-bold" style={{ background: BRAND.yellow, color: BRAND.ink }}>Ativar descontos</button>
              <button className="h-10 rounded-lg border-2 px-4 text-sm font-bold" style={{ borderColor: BRAND.yellow, background: "transparent", color: BRAND.yellow }}>Calcular economia</button>
            </div>
          </div>

          <div className="mt-6 hidden justify-end gap-4 md:flex">
            <BotaoSeta direcao="esq" rotulo="Voltar serviços" onClick={() => trilhoRef.current?.scrollBy({ left: -340, behavior: "smooth" })} />
            <BotaoSeta direcao="dir" rotulo="Ver mais serviços" onClick={() => trilhoRef.current?.scrollBy({ left: 340, behavior: "smooth" })} />
          </div>
          <div ref={trilhoRef} className="scrollbar-hide -mx-4 mt-4 flex snap-x gap-4 overflow-x-auto scroll-smooth px-4 py-2 md:mx-0 md:px-0">
            {SERVICOS.map(({ id, nome, sub, desc, Icon, cor, fundo, cta }) => (
              <article key={id} className="flex w-[240px] shrink-0 snap-start flex-col items-center rounded-2xl bg-white p-4 text-center shadow-card md:w-[320px]">
                <span className="grid h-[125px] w-[125px] place-items-center rounded-full" style={{ background: fundo, color: cor }}><Icon size={56} strokeWidth={1.6} /></span>
                <h3 className="font-petlove pb-3 pt-4 text-xl font-extrabold" style={{ color: BRAND.night }}>{nome}</h3>
                <span className="text-sm font-bold text-neutral-700">{sub}</span>
                <p className="mb-3 mt-1 flex-1 text-xs leading-relaxed text-neutral-600">{desc}</p>
                <div className="flex w-full flex-col gap-2">
                  <button className="flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-bold" style={{ background: BRAND.ink, color: BRAND.yellow }}>
                    <MessageCircle size={16} />{cta}
                  </button>
                  <button className="h-10 rounded-lg border-2 text-sm font-bold" style={{ borderColor: BRAND.ink, background: "#fff", color: BRAND.ink }}>Saiba mais</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Onda cor="var(--ip-sky)" posicao="base" />
    </section>
  );
}

/* ── Marcas ────────────────────────────────────────────────── */
function MarcasParceiras() {
  const trilhoRef = useRef(null);
  return (
    <section id="marcas" className="scroll-mt-40 pb-4 pt-12 md:pb-12" style={{ background: "var(--ip-n-light)" }}>
      <div className="mb-6"><TituloSecao centro>Marcas que você confia</TituloSecao></div>
      <div className="mx-auto flex max-w-[1040px] items-center justify-center gap-4 px-0 md:px-4">
        <BotaoSeta direcao="esq" rotulo="Voltar marcas" className="hidden md:grid" onClick={() => trilhoRef.current?.scrollBy({ left: -310, behavior: "smooth" })} />
        <div ref={trilhoRef} className="scrollbar-hide flex max-w-[940px] snap-x gap-2 overflow-x-auto scroll-smooth px-4 py-2 md:px-0">
          {MARCAS_PARCEIRAS.map(({ nome, cor }) => (
            <a key={nome} href="#" className="grid h-[113px] w-[146px] shrink-0 snap-start place-items-center rounded-2xl bg-white px-3 shadow-card transition-shadow shadow-card-hover">
              {/* Marca nominativa — sem logótipos de terceiros */}
              <span className="font-petlove text-center text-base font-extrabold" style={{ color: cor }}>{nome}</span>
            </a>
          ))}
        </div>
        <BotaoSeta direcao="dir" rotulo="Avançar marcas" className="hidden md:grid" onClick={() => trilhoRef.current?.scrollBy({ left: 310, behavior: "smooth" })} />
      </div>
    </section>
  );
}

/* ── Nossas lojas ──────────────────────────────────────────── */
function ArteLoja({ cor }) {
  return (
    <svg viewBox="0 0 203 180" className="h-full w-full" aria-hidden="true">
      <rect width="203" height="180" fill="#F4F4F4" />
      <rect x="0" y="150" width="203" height="30" fill="#E6E6E6" />
      <rect x="30" y="58" width="143" height="94" rx="4" fill="#fff" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M${30 + i * 20.4} 46h20.4v16a10.2 10.2 0 0 1-20.4 0Z`} fill={i % 2 ? "#fff" : cor} />
      ))}
      <rect x="44" y="80" width="46" height="36" rx="3" fill="#F4F4F4" />
      <rect x="112" y="80" width="46" height="72" rx="3" fill={cor} opacity=".85" />
      <circle cx="150" cy="118" r="2.5" fill="#fff" />
      <rect x="66" y="28" width="71" height="16" rx="8" fill={cor} />
      <path d="M96 36a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm7 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" fill="#fff" />
    </svg>
  );
}

function NossasLojas() {
  const trilhoRef = useRef(null);
  return (
    <section id="lojas" className="mx-auto my-12 max-w-[1078px] scroll-mt-40">
      <div className="relative px-4 md:px-0">
        <TituloSecao centro>Nossas lojas</TituloSecao>
        <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 gap-4 md:flex">
          <BotaoSeta direcao="esq" rotulo="Lojas anteriores" onClick={() => trilhoRef.current?.scrollBy({ left: -220, behavior: "smooth" })} />
          <BotaoSeta direcao="dir" rotulo="Mais lojas" onClick={() => trilhoRef.current?.scrollBy({ left: 220, behavior: "smooth" })} />
        </div>
      </div>
      <div ref={trilhoRef} className="scrollbar-hide mt-6 flex snap-x gap-4 overflow-x-auto scroll-smooth px-4 py-2 md:justify-center md:px-0">
        {UNIDADES.map((u) => (
          <article key={u.id} className="relative h-[380px] w-[203px] shrink-0 snap-center overflow-hidden rounded-2xl bg-white shadow-card">
            <span className="absolute right-2 top-2 z-10 inline-flex h-6 items-center rounded-lg bg-white px-3 text-xs capitalize" style={{ color: BRAND.night }}>loja</span>
            <div className="h-[180px]"><ArteLoja cor={u.cor} /></div>
            <div className="mx-6 my-3">
              <h3 className="font-petlove mb-1 text-xl font-extrabold leading-tight" style={{ color: BRAND.night }}>{u.curto}</h3>
              <p className="line-clamp-3 text-sm leading-tight text-neutral-600">{u.endereco}</p>
              <p className="mt-2 flex items-start gap-1.5 text-xs text-neutral-500"><Clock size={13} className="mt-px shrink-0" />{u.horario}</p>
            </div>
            <a href="#" className="absolute bottom-6 left-6 inline-flex items-center gap-2 text-base font-medium" style={{ color: BRAND.night }}>
              Entrar em contato<ArrowRight size={18} style={{ color: BRAND.amber }} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Newsletter ────────────────────────────────────────────── */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [pet, setPet] = useState("");
  const [enviado, setEnviado] = useState(false);
  const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <section id="novidades" className="my-10 scroll-mt-40 py-8" style={{ background: BRAND.night }}>
      <div className="mx-auto max-w-[1078px] px-4 md:px-0">
        <h3 className="font-petlove mb-5 text-center text-2xl font-extrabold text-white" style={{ textWrap: "balance" }}>
          Cadastre-se e fique sabendo das ofertas antes de todos!
        </h3>
        {enviado ? (
          <p className="mx-auto max-w-md rounded-2xl p-5 text-center text-base font-medium" style={{ background: BRAND.amberLightest, color: BRAND.night }}>
            Pronto! As ofertas da Império Pet vão chegar em <strong>{email}</strong>.
          </p>
        ) : (
          <form className="grid gap-3 md:grid-cols-12 md:items-start" onSubmit={(e) => { e.preventDefault(); if (valido) setEnviado(true); }}>
            <div className="relative md:col-span-5">
              <input id="ip-news-email" type="email" value={email} placeholder=" " onChange={(e) => setEmail(e.target.value)}
                     className="peer h-16 w-full rounded-lg border border-neutral-300 bg-white px-4 pb-3 pt-6 text-base text-neutral-700 outline-none focus:border-2 focus:border-[#F5B800]" />
              <label htmlFor="ip-news-email" className="pointer-events-none absolute left-4 top-3 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs">
                seu@email.com
              </label>
            </div>
            <div className="relative md:col-span-4">
              <select id="ip-news-pet" value={pet} onChange={(e) => setPet(e.target.value)}
                      className="h-16 w-full appearance-none rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-700 outline-none focus:border-2 focus:border-[#F5B800]">
                <option value="" disabled>Qual seu pet?</option>
                <option>Cachorro</option><option>Gato</option><option>Pássaro</option><option>Roedor</option><option>Peixe</option>
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute right-5 top-[23px] text-neutral-500" />
            </div>
            <button type="submit" disabled={!valido}
                    className="h-16 rounded-2xl text-base font-medium transition-transform active:scale-[.96] disabled:cursor-not-allowed disabled:opacity-60 md:col-span-3"
                    style={{ background: valido ? BRAND.yellow : "#F7F7F7", color: valido ? BRAND.ink : "#9A9A9A", fontWeight: 700 }}>
              Cadastrar
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ── Título principal + texto SEO recolhível ────────────────── */
function TextoInstitucional() {
  const [aberto, setAberto] = useState(false);
  return (
    <React.Fragment>
      <div className="mb-6 flex items-center justify-center px-8 py-4 text-center md:py-6" style={{ background: "var(--ip-n-light)" }}>
        <h1 className="font-petlove text-base font-extrabold md:text-xl" style={{ color: BRAND.night }}>Império Pet: o pet shop completo da Ilha de São Luís</h1>
      </div>
      <div className="mx-auto mb-8 max-w-[1080px] px-4">
        <div className="relative overflow-hidden transition-[max-height] duration-500" style={{ maxHeight: aberto ? 1200 : 130 }}>
          <div className="space-y-3 text-base leading-relaxed text-neutral-700">
            <p>Na Império Pet você encontra mais do que um <strong>pet shop em São Luís</strong>: rações, petiscos, medicamentos, higiene e acessórios, com entrega no mesmo dia em toda a Ilha e retirada grátis nas unidades Ponta d'Areia, Cohatrac e Olho d'Água.</p>
            <h2 className="font-petlove pt-2 text-xl font-extrabold" style={{ color: BRAND.night }}>Tudo para cachorro e gato</h2>
            <p>Ração super premium das marcas Royal Canin, PremieR, Golden e N&D, sachês, areia sanitária, arranhadores, coleiras e caminhas para cada fase da vida do seu pet.</p>
            <h2 className="font-petlove pt-2 text-xl font-extrabold" style={{ color: BRAND.night }}>Farmácia veterinária</h2>
            <p>Antipulgas e carrapatos como Bravecto, NexGard e Simparic, vermífugos, suplementos e medicamentos de uso contínuo, com orientação da nossa equipa pelo WhatsApp.</p>
            <h2 className="font-petlove pt-2 text-xl font-extrabold" style={{ color: BRAND.night }}>Clube Império e serviços</h2>
            <p>Assinando o Clube você tem 15% OFF permanente e frete grátis na Ilha. Nas lojas, agende banho & tosa com Taxi Dog, consultas e vacinação.</p>
            <p className="text-sm text-neutral-500">*Consulte condições e bairros atendidos.</p>
          </div>
          {!aberto && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12" style={{ background: "linear-gradient(transparent, var(--ip-bg))" }} />}
        </div>
        <button onClick={() => setAberto((a) => !a)} className="mt-4 inline-flex items-center gap-2 text-base font-medium" style={{ color: BRAND.night }}>
          {aberto ? "Mostrar menos" : "Continue lendo"}
          <ChevronDown size={20} className="transition-transform" style={{ transform: aberto ? "rotate(180deg)" : "none", color: BRAND.amber }} />
        </button>
      </div>
    </React.Fragment>
  );
}

/* ── Rodapé ────────────────────────────────────────────────── */
function GrupoLinks({ titulo, links }) {
  const [expandido, setExpandido] = useState(false);
  const visiveis = expandido ? links : links.slice(0, 5);
  return (
    <div className="pb-4">
      <h3 className="mb-3 whitespace-nowrap font-bold" style={{ color: BRAND.night }}>{titulo}</h3>
      {visiveis.map((l) => (
        <a key={l} href="#" className="mb-2 block truncate text-neutral-700 transition-colors hover:text-neutral-900 hover:underline">{l}</a>
      ))}
      {links.length > 5 && (
        <button onClick={() => setExpandido((e) => !e)} aria-expanded={expandido}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium" style={{ color: BRAND.amberDark }}>
          {expandido ? "Recolher" : "Expandir"}
          <ChevronDown size={18} className="transition-transform" style={{ transform: expandido ? "rotate(180deg)" : "none" }} />
        </button>
      )}
    </div>
  );
}

function Rodape() {
  return (
    <footer className="border-t bg-white pb-5 pt-12" style={{ borderColor: "var(--ip-n-light)" }}>
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="mb-12 flex flex-col gap-8 md:flex-row">
          <div className="relative h-fit w-full shrink-0 rounded p-8 text-white md:w-[260px] xl:w-[360px]" style={{ background: BRAND.night }}>
            <p className="font-petlove mb-3 text-2xl font-extrabold leading-none">Como podemos<br />ajudar você?</p>
            <p className="leading-relaxed text-neutral-300">Conheça a Império Pet, as nossas políticas e fale com a equipa de São Luís.</p>
            <Heart size={32} fill={BRAND.orange} strokeWidth={0} className="absolute -right-4 top-1/2 -translate-y-1/2" />
          </div>
          <div className="grid flex-1 gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {RODAPE_MENUS.map((m) => <GrupoLinks key={m.titulo} titulo={m.titulo} links={m.links} />)}
            <div>
              <h3 className="mb-3 font-bold" style={{ color: BRAND.night }}>Onde estamos</h3>
              <div className="mb-3 flex gap-3">
                {[{ Icon: Instagram, r: "Instagram @imperiopetslz" }, { Icon: Facebook, r: "Facebook da Império Pet" }, { Icon: MessageCircle, r: "WhatsApp da Império Pet" }].map(({ Icon, r }) => (
                  <a key={r} href="#" aria-label={r} className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "var(--ip-n-light)", color: BRAND.night }}><Icon size={18} /></a>
                ))}
              </div>
              <p className="text-sm text-neutral-600">@imperiopetslz</p>
            </div>
          </div>
        </div>

        <div className="mb-10 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {RODAPE_GRUPOS.map((g) => <GrupoLinks key={g.titulo} titulo={g.titulo} links={g.links} />)}
        </div>

        <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {["Pix", "Cartão de crédito", "Cartão de débito", "Pagamento na loja"].map((m) => (
              <span key={m} className="inline-flex h-8 items-center rounded-lg px-3 text-sm" style={{ background: "var(--ip-n-light)", color: BRAND.night }}>{m}</span>
            ))}
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "#111111" }}><ShieldCheck size={20} />Compra segura</span>
        </div>

        <div className="flex flex-col gap-3 text-sm leading-relaxed text-neutral-400 md:flex-row md:justify-between">
          <div>Império Pet — São Luís/MA<br />CNPJ: [preencher antes de publicar]</div>
          <div className="md:text-right">A Império Pet protege as suas informações pessoais e financeiras.<br />© 2026 Império Pet. Todos os direitos reservados.</div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════
   GAVETA DO CARRINHO
   ════════════════════════════════════════════════════════════ */
function CarrinhoDrawer({ aberto, onFechar, itens, onIncrementar, onDecrementar, onRemover }) {
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aberto, onFechar]);
  if (!aberto) return null;

  const linhas = itens.map((i) => ({ ...i, produto: PRODUTOS.find((p) => p.id === i.id) })).filter((l) => l.produto);
  const qtd = linhas.reduce((s, l) => s + l.qtd, 0);
  const subtotal = linhas.reduce((s, l) => s + l.produto.pix * l.qtd, 0);
  const subtotalClube = linhas.reduce((s, l) => s + l.produto.clube * l.qtd, 0);
  const freteGratis = subtotal >= 99;

  return (
    <div className="fixed inset-0 z-[90] ip-fade" role="dialog" aria-modal="true" aria-label="Carrinho de compras">
      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={onFechar} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl ip-cart">
        <header className="flex items-center justify-between border-b border-neutral-100 px-5 py-4" style={{ paddingTop: "calc(1rem + env(safe-area-inset-top, 0px))" }}>
          <div>
            <h2 className="font-petlove text-lg font-extrabold" style={{ color: BRAND.night }}>Seu carrinho</h2>
            <p className="text-xs text-neutral-500">{qtd === 0 ? "Nenhum item ainda" : `${qtd} ${qtd === 1 ? "item" : "itens"}`}</p>
          </div>
          <button onClick={onFechar} aria-label="Fechar carrinho" className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100"><X size={20} /></button>
        </header>

        {linhas.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-neutral-100"><ShoppingCart size={26} className="text-neutral-400" /></span>
            <p className="text-base font-bold" style={{ color: BRAND.night }}>Seu carrinho está vazio</p>
            <p className="text-sm text-neutral-500">Toque em <strong>Adicionar</strong> em qualquer produto. A entrega na Ilha sai hoje mesmo.</p>
            <button onClick={onFechar} className="mt-2 h-10 rounded-lg px-5 text-sm font-bold" style={{ background: BRAND.ink, color: BRAND.yellow }}>Continuar comprando</button>
          </div>
        ) : (
          <React.Fragment>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-neutral-700" style={{ background: freteGratis ? "#F4F4F4" : BRAND.amberLightest }}>
                <Truck size={15} style={{ color: freteGratis ? BRAND.zap : BRAND.amber }} />
                {freteGratis ? "Frete grátis liberado para São Luís" : `Faltam ${brl(99 - subtotal)} para o frete grátis`}
              </p>
              <ul className="space-y-3">
                {linhas.map(({ id, qtd: q, produto }) => (
                  <li key={id} className="flex gap-3 rounded-2xl p-2.5 shadow-card">
                    <div className="h-16 w-16 shrink-0 rounded-lg bg-neutral-50 p-1"><ArteProduto tipo={produto.arte} cor={produto.cor} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{produto.marca}</p>
                      <h3 className="line-clamp-2 text-xs font-semibold leading-tight text-neutral-800">{produto.nome}</h3>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 rounded-lg border border-neutral-200">
                          <button onClick={() => onDecrementar(id)} aria-label={`Diminuir ${produto.marca}`} className="grid h-7 w-7 place-items-center text-neutral-500">
                            {q === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                          </button>
                          <span className="min-w-[18px] text-center text-xs font-bold" style={{ color: BRAND.night }}>{q}</span>
                          <button onClick={() => onIncrementar(id)} aria-label={`Aumentar ${produto.marca}`} className="grid h-7 w-7 place-items-center text-neutral-500"><Plus size={13} /></button>
                        </div>
                        <p className="text-sm font-extrabold" style={{ color: BRAND.night, fontVariantNumeric: "tabular-nums" }}>{brl(produto.pix * q)}</p>
                      </div>
                    </div>
                    <button onClick={() => onRemover(id)} aria-label={`Remover ${produto.marca} do carrinho`} className="self-start rounded-md p-1 text-neutral-300 hover:text-[#111111]"><X size={15} /></button>
                  </li>
                ))}
              </ul>
            </div>
            <footer className="border-t border-neutral-100 px-5 py-4" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-neutral-500">Subtotal no Pix</span>
                <span className="font-petlove text-xl font-extrabold" style={{ color: BRAND.night, fontVariantNumeric: "tabular-nums" }}>{brl(subtotal)}</span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#F5B800] bg-[#FFF4CC] p-1.5 text-xs font-bold text-[#111111]">
                <Crown size={13} style={{ color: BRAND.amber }} />{brl(subtotalClube)} no Clube Império — economize {brl(subtotal - subtotalClube)}
              </p>
              <button className="mt-3 h-12 w-full rounded-2xl text-base font-bold transition-transform active:scale-[.96]" style={{ background: BRAND.yellow, color: BRAND.ink }}>Finalizar compra</button>
              <button onClick={onFechar} className="mt-2 w-full py-1.5 text-sm font-medium text-neutral-500">Continuar comprando</button>
            </footer>
          </React.Fragment>
        )}
      </aside>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   BOTTOM NAVIGATION (mobile)
   ════════════════════════════════════════════════════════════ */
function BottomNav({ aba, setAba, totalCarrinho, onAbrirMenu, onAbrirCarrinho, onIr }) {
  const abas = [
    { id: "inicio", label: "Início", Icon: Home },
    { id: "categorias", label: "Categorias", Icon: LayoutGrid },
    { id: "servicos", label: "Serviços", Icon: Stethoscope },
    { id: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
    { id: "carrinho", label: "Carrinho", Icon: ShoppingCart, badge: totalCarrinho },
  ];
  const tocar = (id) => {
    if (id === "categorias") return onAbrirMenu();
    if (id === "carrinho") return onAbrirCarrinho();
    setAba(id);
    if (id === "inicio") window.scrollTo({ top: 0, behavior: "smooth" });
    if (id === "servicos") onIr("servicos");
  };
  return (
    <nav aria-label="Navegação principal"
         className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-neutral-200 bg-white/95 px-4 py-1.5 backdrop-blur lg:hidden"
         style={{ paddingBottom: "calc(0.375rem + env(safe-area-inset-bottom, 0px))" }}>
      {abas.map(({ id, label, Icon, badge }) => {
        const ativo = aba === id;
        return (
          <button key={id} onClick={() => tocar(id)} aria-current={ativo ? "page" : undefined} className="relative flex flex-1 flex-col items-center gap-0.5 py-1">
            <span className="relative">
              <Icon size={21} strokeWidth={ativo ? 2.4 : 1.9} style={{ color: ativo ? BRAND.ink : "#6B6B6B" }} />
              {badge > 0 && (
                <span className="absolute -right-2 -top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full px-1 text-[9px] font-bold ring-2 ring-white" style={{ background: BRAND.yellow, color: BRAND.ink }}>{badge}</span>
              )}
            </span>
            <span className="text-[10px] font-bold leading-none" style={{ color: ativo ? BRAND.ink : "#6B6B6B" }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ════════════════════════════════════════════════════════════
   PÁGINA
   ════════════════════════════════════════════════════════════ */
function ImperioPetHome() {
  const [itensCarrinho, setItensCarrinho] = useState([{ id: "p11", qtd: 1 }]);
  const [favoritos, setFavoritos] = useState(["p11"]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("inicio");
  const [chipAtivo, setChipAtivo] = useState(null);

  const [modo, setModo] = useState("entrega");
  const [bairro, setBairro] = useState("São Luís - MA");
  const [unidade, setUnidade] = useState(null);

  const totalCarrinho = useMemo(() => itensCarrinho.reduce((s, i) => s + i.qtd, 0), [itensCarrinho]);
  const quantidades = useMemo(() => Object.fromEntries(itensCarrinho.map((i) => [i.id, i.qtd])), [itensCarrinho]);

  const adicionar = useCallback((id) => {
    setItensCarrinho((a) => a.find((i) => i.id === id) ? a.map((i) => i.id === id ? { ...i, qtd: i.qtd + 1 } : i) : [...a, { id, qtd: 1 }]);
  }, []);
  const incrementar = useCallback((id) => setItensCarrinho((a) => a.map((i) => i.id === id ? { ...i, qtd: i.qtd + 1 } : i)), []);
  const decrementar = useCallback((id) => setItensCarrinho((a) => a.flatMap((i) => i.id === id ? (i.qtd > 1 ? [{ ...i, qtd: i.qtd - 1 }] : []) : [i])), []);
  const remover = useCallback((id) => setItensCarrinho((a) => a.filter((i) => i.id !== id)), []);
  const favoritar = useCallback((id) => setFavoritos((a) => a.includes(id) ? a.filter((f) => f !== id) : [...a, id]), []);

  /* Rola até a secção descontando o que fica grudado no topo:
     cabeçalho (83px) + chips (64px) no desktop, cabeçalho móvel no telemóvel. */
  const irPara = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setChipAtivo(id);
    const desktop = window.innerWidth >= 1024;
    const cab = document.querySelector("[data-mobile-header]");
    const offset = desktop ? 83 + 72 : (cab ? cab.offsetHeight : 140) + 12;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: semMovimento() ? "auto" : "smooth" });
  }, []);

  const travado = carrinhoAberto || menuAberto || modalAberto;
  useEffect(() => {
    document.body.style.overflow = travado ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [travado]);

  return (
    <div className="min-h-screen font-['Plus_Jakarta_Sans',system-ui,sans-serif] text-neutral-600" style={{ background: "var(--ip-bg)" }}>
      <EstilosImperio />
      <Cabecalho totalCarrinho={totalCarrinho} onAbrirCarrinho={() => setCarrinhoAberto(true)} onAbrirMenu={() => setMenuAberto(true)}
                 onAbrirLocal={() => setModalAberto(true)} modo={modo} bairro={bairro} unidade={unidade} />

      <main className="pb-24 lg:pb-0">
        <ProximaAcao onIr={irPara} />
        <ChipsAtalho ativo={chipAtivo} onIr={irPara} />
        <BannerCarrossel />
        <ComprePorPet />
        <Vitrine produtos={PRODUTOS} favoritos={favoritos} quantidades={quantidades}
                 onFavoritar={favoritar} onAdicionar={adicionar} onIncrementar={incrementar} onDecrementar={decrementar} />
        <SecaoClube />
        <Beneficios onIr={irPara} />
        <SecaoServicos />
        <MarcasParceiras />
        <NossasLojas />
        <Newsletter />
        <TextoInstitucional />
      </main>

      <Rodape />

      <BottomNav aba={abaAtiva} setAba={setAbaAtiva} totalCarrinho={totalCarrinho}
                 onAbrirMenu={() => setMenuAberto(true)} onAbrirCarrinho={() => setCarrinhoAberto(true)} onIr={irPara} />
      <MenuDrawer aberto={menuAberto} onFechar={() => setMenuAberto(false)} onAbrirLocal={() => setModalAberto(true)} />
      <CarrinhoDrawer aberto={carrinhoAberto} onFechar={() => setCarrinhoAberto(false)} itens={itensCarrinho}
                      onIncrementar={incrementar} onDecrementar={decrementar} onRemover={remover} />
      <ModalUnidades aberto={modalAberto} onFechar={() => setModalAberto(false)} modo={modo} setModo={setModo}
                     bairro={bairro} setBairro={setBairro} unidade={unidade} setUnidade={setUnidade} />
    </div>
  );
}

export default ImperioPetHome;
