# O cardápio da lanchonete

Vamos construir, em cinco etapas, o site de pedidos de uma lanchonete: o
cardápio chega de um arquivo JSON, vira cards na tela, ganha um filtro e as
promoções do dia, e no fim o pedido é enviado.

É tudo o que vimos hoje, na ordem dos slides: `fetch` com os estados da tela,
`Promise.all` e uma Promise criada por você, com `async`/`await` e
`try`/`catch`/`finally`.

---

## Antes de começar

1. Baixe o projeto de partida (o professor entrega) e crie um repositório
   novo, `cardapio-lanchonete`.
2. **Abra o projeto pelo Live Server.** Abrindo o `index.html` direto, o
   navegador bloqueia o `fetch` dos arquivos JSON.
3. Ao fim de cada etapa, teste no navegador e faça o commit (`Etapa 1`,
   `Etapa 2`...).

**O que já vem pronto:**

| arquivo | o que tem |
|---|---|
| `index.html` | tudo pronto: o filtro, o cardápio e o pedido. Você não precisa mexer nele |
| `style.css` | o layout da página pronto. Só falta o visual dos cards (etapa 2) |
| `cardapio.json` | os 10 itens da lanchonete |
| `promocoes.json` | os descontos do dia |
| `script.js` | vazio, só com o roteiro em comentários |

**Os elementos do HTML que você vai usar:**

| elemento | para quê |
|---|---|
| `#aviso` | as mensagens de carregando e de erro |
| `#cardapio` | onde os cards aparecem |
| `#filtro` | o select das categorias |
| `#lista-pedido` | os itens do pedido |
| `#total` | o total do pedido |
| `#finalizar` | o botão Finalizar pedido |
| `#status-pedido` | as mensagens do envio do pedido |

**Como são os dados.** Um item do `cardapio.json`:

```json
{
  "id": 4,
  "nome": "X-salada",
  "descricao": "Hambúrguer, queijo...",
  "preco": 15,
  "categoria": "lanches",
  "disponivel": true
}
```

E uma promoção do `promocoes.json`:

```json
{ "id": 4, "desconto": 20 }
```

Repare que a promoção aponta para o item pelo **`id`**, não pelo nome.

---

## Etapa 1 — Carregar o cardápio (≈ 20 min)

**1.** No topo do `script.js`, anote em comentário os **estados da tela**:
cada situação em que a página pode estar.

```js
// Estados: carregando, cardápio na tela, erro.
```

| estado | o que aparece |
|---|---|
| carregando | o `fetch` ainda não voltou: o aviso mostra "Carregando cardápio..." |
| cardápio na tela | deu certo: o aviso some e os itens aparecem |
| erro | algo falhou: o aviso explica o que aconteceu |

**2.** Crie a `buscarDados(url)`: faz o `fetch`, confere o `resposta.ok` e
devolve o `json()`. É o molde do slide "O molde completo". Deixe ela
recebendo a `url`: na etapa 4, você vai usá-la para dois arquivos.

**3.** Crie a `mostrarAviso(texto)`, que escreve o texto no `#aviso`.

**4.** Crie a `carregarCardapio()`, que passa pelos três estados:

- antes do `await`: `mostrarAviso('Carregando cardápio...')`;
- no `try`: busca o `cardapio.json`, limpa o aviso e escreve o **nome** de
  cada item num parágrafo dentro do `#cardapio` (os cards vêm na etapa 2);
- no `catch`: mostra o aviso de erro.

E chame a `carregarCardapio()` no fim do arquivo.

**5.** Erre de propósito: troque para `cardapo.json` e veja o estado de erro.
Depois, volte o nome certo.

| no console | deve devolver |
|---|---|
| `await buscarDados('cardapio.json')` | uma lista com 10 itens |
| `await buscarDados('cardapo.json')` | um erro vermelho: `Erro 404` |

**Funcionou se:**

- aparecem os 10 nomes;
- com o arquivo errado, aparece o aviso de erro;
- você viu o "Carregando cardápio..." (com arquivo local ele some rápido
  demais: na aba Network, escolha **Slow 4G** e recarregue).

Commit: `Etapa 1`.

---

## Etapa 2 — Cards com cara de cardápio (≈ 20 min)

**1.** Crie a `criarCard(item)`, que devolve um `article` com o nome, a
descrição, o preço e um botão "Adicionar". Cada parte do card tem a sua
classe:

| parte | classe |
|---|---|
| o card | `card` |
| o nome | `card__nome` |
| a descrição | `card__descricao` |
| o preço | `card__preco` |
| o botão | `card__botao` |

Depois, a `renderizarCardapio(lista)` limpa o `#cardapio` e coloca um card
para cada item, com `appendChild`. É o mesmo jeito do controle de gastos.

**2.** Mostre o preço em reais com uma `formatarMoeda(valor)`:

```js
valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
```

**3.** Item com `disponivel: false` ganha a classe `card--esgotado`, e o botão
vira "Esgotado", desativado (`botao.disabled = true`). Um botão desativado não
dispara o clique: isso vai ajudar na etapa 5.

**4.** Estilize os cards no `style.css`, no lugar marcado com o comentário da
etapa 2: fundo, borda, espaçamento, o preço em destaque e o card esgotado
diferente dos outros (mais apagado, por exemplo).

| no console | deve devolver |
|---|---|
| `formatarMoeda(15)` | `'R$ 15,00'` |

**Funcionou se:**

- os cards ficam em 2 colunas no computador e em 1 no celular (modo de
  celular do DevTools);
- os esgotados se destacam dos outros, com o botão "Esgotado" que não clica.

**Mande no WhatsApp do professor** um print dos seus cards.

Commit: `Etapa 2`.

---

## Etapa 3 — Filtro por categoria (≈ 15 min)

Os dados já estão na memória: não precisamos buscar o arquivo de novo a cada
troca do filtro.

**1.** Guarde a lista carregada numa variável `cardapio`, fora das funções:

```js
let cardapio = [];
```

Na `carregarCardapio()`, guarde nela o que chegou do `fetch`.

**2.** Crie a `filtrarPorCategoria(categoria)`, que devolve só os itens
daquela categoria.

**3.** No `change` do `#filtro`, desenhe os cards de novo com a lista
filtrada.

**4.** "Todas as categorias" volta a mostrar o cardápio inteiro.

| no console | deve devolver |
|---|---|
| `filtrarPorCategoria('bebidas')` | só itens com `categoria: 'bebidas'` |
| `filtrarPorCategoria('xyz')` | `[]` |

**Funcionou se:**

- cada opção mostra só a sua categoria;
- trocando a opção, a aba **Network** não mostra nenhum `fetch` novo.

Commit: `Etapa 3`.

---

## Etapa 4 — Promoções do dia (≈ 20 min)

**1.** Busque o `cardapio.json` e o `promocoes.json` **ao mesmo tempo**, com
`Promise.all` e a sua `buscarDados`:

```js
const dados = await Promise.all([
    buscarDados('cardapio.json'),
    buscarDados('promocoes.json')
]);
// dados[0] é o cardápio, dados[1] são as promoções
```

**2.** Crie a `aplicarPromocoes(itens, promocoes)`, que guarda em cada item
o `desconto` e o `precoFinal`:

- para achar a promoção de um item, percorra as promoções com `forEach`,
  comparando `promocao.id` com `item.id`;
- o cálculo: `reducao = preco * desconto / 100` e
  `precoFinal = preco - reducao`;
- item sem promoção: `desconto` 0 e `precoFinal` igual ao `preco`.

A partir daqui, o card (e o total do pedido, na etapa 5) usa o `precoFinal`.

**3.** No card em promoção: um selo com o desconto (`-20%`) e o preço antigo
riscado. Para riscar, use a tag `<s>`, que é nova:

```html
<s>R$ 15,00</s> R$ 12,00
```

**4.** Erre de propósito: renomeie o `promocoes.json`. O que acontece com o
cardápio? Por quê? Depois, volte o nome certo.

| no console | deve devolver |
|---|---|
| o X-salada na `cardapio` (o de `id` 4) | `desconto: 20` e `precoFinal: 12` |
| um item sem promoção | `desconto: 0` e `precoFinal` igual ao `preco` |

**Funcionou se:**

- o X-salada aparece por R$ 12,00 e o suco por R$ 3,00, cada um com o seu selo;
- você sabe explicar por que o cardápio inteiro sumiu no passo 4.

**Mande no WhatsApp do professor** um print do X-salada com o selo de -20%.

Commit: `Etapa 4`.

---

## Etapa 5 — Fazer o pedido (≈ 25 min)

**1.** O botão "Adicionar" coloca o item numa lista `pedido` (fora das
funções, como o `cardapio`) e atualiza a lista do `#lista-pedido` e o
`#total`. O total soma o `precoFinal` dos itens.

**2.** Não temos um servidor de verdade, então vamos fingir um. Crie a
`enviarPedido(itens)` com `new Promise`, igual à `jogarMoeda` do slide
"resolve cumpre, reject rejeita":

- espera 2 segundos (`setTimeout`);
- falha 3 em cada 10 vezes: `Math.random() < 0.3` chama o `reject` com
  `new Error('...')`, com uma mensagem para o usuário;
- senão, chama o `resolve` com um número de pedido sorteado.

O parâmetro `itens` não é usado por enquanto: um servidor de verdade
receberia o pedido.

**3.** No clique de "Finalizar pedido", uma função `async` que:

- desativa o botão e mostra "Enviando pedido..." no `#status-pedido`;
- no `try`: espera a `enviarPedido(pedido)`, mostra o número do pedido e
  esvazia o pedido;
- no `catch`: mostra a mensagem do erro;
- no `finally`: reativa o botão.

**4.** Pedido vazio não é enviado: avise para adicionar um item.

| no console | deve devolver |
|---|---|
| `await enviarPedido([])` | depois de 2 s, um número, ou um erro vermelho com a sua mensagem (rode algumas vezes) |

**Funcionou se:**

- clicando algumas vezes, você vê o pedido confirmado e também a falha;
- o botão volta a funcionar nos dois casos;
- com o pedido vazio, aparece o aviso, e nada é enviado.

Pergunta para pensar: por que o botão é reativado no `finally`, e não no
`try`?

Commit: `Etapa 5`.

---

## Se travar

| etapa | aconteceu isso? | pergunte-se |
|---|---|---|
| 1 | Apareceu `Promise` no console? | Qual linha está sem `await`? |
| 1 | O arquivo errado não dá aviso? | Quem está conferindo o `resposta.ok`? |
| 2 | O botão do card não responde? | O `querySelector` do botão veio depois do `innerHTML`? |
| 3 | O filtro não acha nada? | O `value` do select é igual à categoria do JSON? |
| 4 | Como achar a promoção do item? | Percorra as promoções comparando os `id`. |
| 5 | O botão não volta a funcionar? | Qual bloco roda nos dois casos? |

---

## Se sobrar tempo

- **Remover do pedido.** Um botão em cada linha do pedido, que tira aquele
  item e atualiza o total.
- **Entrega pelo CEP.** Um campo de CEP que usa o ViaCEP, como no exemplo
  comentado, para mostrar o endereço de entrega. (Esse precisa de internet.)
- **Limite de tempo.** Com `Promise.race` e a `rejeitarDepoisDe` do slide,
  desista do envio se ele demorar mais de 1,5 s. Depois, suba o limite para
  3 s e veja o envio ganhar a corrida.
- **Lembrar o pedido.** Salve o pedido no `localStorage`, para ele não sumir
  quando a página recarregar. Cuidado com a primeira vez, quando ainda não há
  nada salvo.

---

## Para entregar

Faça o commit e envie para o GitHub, mesmo que incompleto.
