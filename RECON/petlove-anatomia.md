# Anatomia da Petlove — extraída do HTML salvo pelo utilizador

Origem: "Petlove_ o maior petshop online do Brasil.html" (guardado no browser
após passar o Cloudflare). Todas as medidas abaixo vêm do CSS inline desse
ficheiro (SOURCE), não de estimativa visual.

Modo: **visual remix** — copia-se a anatomia e as medidas; a marca, a paleta,
as fotos, os logótipos, as ilustrações e as fontes (Gooper) da Petlove NÃO
são copiados.

## Escalas
- Espaçamento: 2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 px
- Raios: 4 (xs) · 8 (s) · 12 (m) · 16 (l) · 20 (xl) · 9999 (círculo)
- Tipo: 12 · 14 · 16 · 20 · 24 · 32 · 40 · 48 px; line-height 1 · 1.25 · 1.5
- Corpo: 16px, Roboto 400/500/700; títulos em Gooper 600/900 (proprietária)

## Sombras
- card: `0 4px 8px #867e740a, 0 0 4px #867e741f`
- card clicável hover: `0 0 24px #867e741f, 0 16px 28px #867e741f`
- dropdown: `0 4px 14px #0003, 0 4px 8px #0000000a`

## Cabeçalho
- Linha única, branca, sticky top 0, `border-bottom 1px #f3eee8`, itens com 83px de altura
- Ordem: logo 142×35 · "Informar CEP" com pin · busca · Compras recorrentes · Meus pedidos · carrinho com badge · bloco "Entrar | Cadastrar" (230px, fundo neutro)
- Busca: 48px de altura, raio 4px, borda `#d9d3cc`, 14px, ícone à direita, largura máx. 470px; foco = borda primária
- Dropdown de conta: 260px, raio 4px, sombra de dropdown, abre em hover

## Barra de menu
- 52px, branca, `border-bottom #f3eee8`, lista **centralizada**
- Item: 16px regular cinza, padding 14px; hover = cor primária + barra de 3px sob o texto
- Mega dropdown em **2 painéis**: trilho de setores à esquerda (300px, itens de 56px, fundo branco, raio 16 à esquerda, seta desliza 8px no ativo) + painel de categorias à direita (fundo neutro claro, raio 16 à direita)
- Serviços / Plano / Mais: lista simples alinhada à direita, raio 16

## Home, de cima para baixo
1. **Next best action**: 3 cards de 330px × ≤108px, borda 1px primary-lightest, raio 16, entram com overshoot `cubic-bezier(.175,.885,.32,1.275)` 1.5s
2. **Chips de atalho**: 48px, raio 8, borda 1px, 16px medium, ícone 24px; ficam sticky a 82px com sombra; cada chip rola até uma secção
3. **Banner**: carrossel centrado; slide ativo 1078×428 (raio 16), vizinhos com `blur(2px)`, opacidade .5, escala .8; setas redondas de 48px; pontos de 12px com gap de 12
4. **Destaques por pet**: título 24px, itens de 105px com ilustração 106×95 sobre mancha orgânica
5. **Secções em faixa com onda SVG** em cima e em baixo (verde, azul claro)
6. **Clube**: faixa neutra, card de plano com etiqueta "A melhor escolha", marquee infinito de benefícios
7. **Vitrine**: faixa neutra, largura 970px, card de 177px
8. **Benefícios pra você**: círculos de 96px (inativo escala .6, ativo borda 4px), cards centrados com blur nos vizinhos
9. **Serviços**: banner de assinatura (raio 20) + cards de 320px com imagem redonda de 125px e 2 botões
10. **Marcas**: cards de 146×113, raio 16, carrossel de 940px
11. **Nossas lojas**: cards de 203×380, imagem de topo, etiqueta "loja", endereço em 3 linhas, link "Entrar em contato"
12. **Newsletter**: faixa primária escura, input de 64px com label flutuante
13. **Título principal + texto SEO** recolhível ("Continue lendo")
14. **Rodapé**: card de destaque primário (360px) + grelha `auto-fill minmax(200px)` + grupos "Expandir" + selos

## Botões
- Padrão 64px raio 16; pequeno 40px raio 8 14px; `active: scale(.96)`; hover `brightness(120%)`
- Secundário: fundo primary-lightest + borda primary-light

## Não copiado
Logótipo, paleta roxa, fotos de banner e de loja, ilustrações SVG, fonte Gooper, textos comerciais.
