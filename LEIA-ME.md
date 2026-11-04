# Cardápio da lanchonete

Vamos construir, em cinco etapas, o site de pedidos da Lanchonete Bom Bocado: do cardápio carregado de um JSON até o pedido enviado.

## Antes de começar

- Abra a pasta no VS Code e rode a página com o **Live Server**. Com duplo clique no `index.html`, o `fetch` dos arquivos JSON não funciona.
- O `index.html` já está pronto. Não precisamos mexer nele.
- O `style.css` já tem o layout da página. Falta só o visual dos cards (etapa 2).
- Todo o JavaScript vai no `script.js`, organizado nas quatro partes que já estão marcadas: busca, dados, tela e eventos.
- Ao fim de cada etapa: testar no navegador e fazer um commit.

## Etapa 1 · Carregar o cardápio (≈ 20 min)

1. No topo do `script.js`, anotar em comentário os **estados da tela**, ou seja, as situações em que a página pode estar:
   - **Carregando:** o fetch ainda não voltou, e o aviso mostra "Carregando cardápio...".
   - **Cardápio na tela:** deu certo, o aviso some e os itens aparecem.
   - **Erro:** algo falhou, e o aviso explica o que aconteceu.
2. Criar `buscarDados(url)`: fetch, conferir o `ok` e devolver o `json()`.
3. Criar `carregarCardapio()`, que passa pelos três estados: mostra o aviso, busca e lista o nome de cada item no `#cardapio`.
4. Errar de propósito: trocar para `cardapo.json` e ver o estado de erro.

**Pronto quando:** vemos os três estados (o carregando, os 10 nomes e o aviso de erro com o arquivo errado).

## Etapa 2 · Cards com cara de cardápio (≈ 20 min)

1. Criar `criarCard(item)`: um `article` com nome, descrição, preço e botão "Adicionar".
2. Mostrar o preço em reais com `formatarMoeda`.
3. Item com `disponivel: false` ganha a classe `card--esgotado`, e o botão vira "Esgotado", desativado.
4. Estilizar os cards no `style.css`: fundo, borda, espaçamento e preço em destaque.

**Pronto quando:** os cards ficam em 2 colunas no computador e 1 no celular, e os esgotados se destacam dos outros.

## Etapa 3 · Filtro por categoria (≈ 15 min)

1. Guardar a lista carregada numa variável `cardapio`, fora das funções.
2. Criar `filtrarPorCategoria(categoria)`, que devolve só os itens daquela categoria.
3. No `change` do select, redesenhar os cards com a lista filtrada.
4. "Todas as categorias" volta a mostrar o cardápio inteiro.

**Pronto quando:** cada opção mostra só a sua categoria, e a aba Network não mostra nenhum fetch novo.

## Etapa 4 · Promoções do dia (≈ 20 min)

1. Buscar `cardapio.json` e `promocoes.json` ao mesmo tempo, com `Promise.all`.
2. Criar `aplicarPromocoes(itens, promocoes)`: guardar em cada item o `desconto` e o `precoFinal`.
3. No card em promoção: um selo com o desconto e o preço antigo riscado (tag `<s>`).
4. Errar de propósito: renomear o `promocoes.json`. O que acontece com o cardápio?

**Pronto quando:** o X-salada aparece por R$ 12,00 e o suco por R$ 3,00, cada um com o seu selo.

## Etapa 5 · Fazer o pedido (≈ 25 min)

1. O botão "Adicionar" coloca o item no pedido e atualiza a lista e o total.
2. Criar `enviarPedido(itens)` com `new Promise`: espera 2 segundos e falha 3 em cada 10 vezes.
3. "Finalizar pedido": mostra "Enviando pedido...", desativa o botão e, no fim, mostra o número do pedido ou o erro.
4. Pedido vazio não é enviado: avisamos para adicionar um item.

**Pronto quando:** clicando algumas vezes, vemos o pedido confirmado e também a falha, e o botão volta a funcionar nos dois casos.

## Terminou? Desafios

- **Remover do pedido:** um botão em cada linha do pedido que tira aquele item e atualiza o total.
- **Entrega pelo CEP:** um campo de CEP que usa o ViaCEP, como no exemplo comentado, para mostrar o endereço de entrega.
- **Limite de tempo:** com `Promise.race`, desistir do envio do pedido se ele demorar mais de 1,5 segundo.
- **Lembrar o pedido:** salvar o pedido no `localStorage` para ele não sumir quando a página recarregar.
