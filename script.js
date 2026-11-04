// Cardápio da lanchonete
// Estados da tela (etapa 1): Carregando, cardápio na tela, erro

// -------------------------------------------------------------
// VARIÁVEIS GERAIS E ELEMENTOS DA TELA
// -------------------------------------------------------------
let cardapio = [];
let pedido = [];

const elementoAviso = document.querySelector('#aviso');
const elementoCardapio = document.querySelector('#cardapio');
const elementoFiltro = document.querySelector('#filtro');
const elementoListaPedido = document.querySelector('#lista-pedido');
const elementoTotal = document.querySelector('#total');
const elementoBotaoFinalizar = document.querySelector('#finalizar');
const elementoStatusPedido = document.querySelector('#status-pedido');

// -------------------------------------------------------------
// FUNÇÕES AUXILIARES E DE FORMATACÃO
// -------------------------------------------------------------

// Formata valores numéricos para Moeda BRL (Etapa 2)
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Atualiza o texto da div de aviso (Etapa 1)
function mostrarAviso(texto) {
  elementoAviso.textContent = texto;
}

// Realiza a requisição genérica com validação de status HTTP (Etapa 1)
async function buscarDados(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status}`);
  }
  return await resposta.json();
}

// -------------------------------------------------------------
// ETAPA 4: APLICAÇÃO DE PROMOÇÕES
// -------------------------------------------------------------
function aplicarPromocoes(itens, promocoes) {
  return itens.map(item => {
    let desconto = 0;
    
    // Procura se existe promoção para o id do item
    promocoes.forEach(promocao => {
      if (promocao.id === item.id) {
        desconto = promocao.desconto;
      }
    });

    if (desconto > 0) {
      const reducao = (item.preco * desconto) / 100;
      const precoFinal = item.preco - reducao;
      return { ...item, desconto, precoFinal };
    } else {
      return { ...item, desconto: 0, precoFinal: item.preco };
    }
  });
}

// -------------------------------------------------------------
// ETAPA 2: CRIAÇÃO E RENDERIZAÇÃO DOS CARDS
// -------------------------------------------------------------
function criarCard(item) {
  const card = document.createElement('article');
  card.classList.add('card');

  if (!item.disponivel) {
    card.classList.add('card--esgotado');
  }

  const nome = document.createElement('h3');
  nome.classList.add('card__nome');
  nome.textContent = item.nome;

  const descricao = document.createElement('p');
  descricao.classList.add('card__descricao');
  descricao.textContent = item.descricao;

  const preco = document.createElement('p');
  preco.classList.add('card__preco');

  // Formatação de preço com promoção (Etapa 4)
  if (item.desconto > 0) {
    const selo = document.createElement('span');
    selo.classList.add('card__selo');
    selo.textContent = `-${item.desconto}% `;

    preco.appendChild(selo);
    preco.innerHTML += `<s>${formatarMoeda(item.preco)}</s> ${formatarMoeda(item.precoFinal)}`;
  } else {
    preco.textContent = formatarMoeda(item.precoFinal);
  }

  const botao = document.createElement('button');
  botao.classList.add('card__botao', 'botao');

  if (!item.disponivel) {
    botao.textContent = 'Esgotado';
    botao.disabled = true;
  } else {
    botao.textContent = 'Adicionar';
    // Evento para adicionar item ao pedido (Etapa 5)
    botao.addEventListener('click', () => adicionarAoPedido(item));
  }

  card.appendChild(nome);
  card.appendChild(descricao);
  card.appendChild(preco);
  card.appendChild(botao);

  return card;
}

function renderizarCardapio(lista) {
  elementoCardapio.innerHTML = '';
  lista.forEach(item => {
    const card = criarCard(item);
    elementoCardapio.appendChild(card);
  });
}

// -------------------------------------------------------------
// ETAPA 3: FILTRO POR CATEGORIA
// -------------------------------------------------------------
function filtrarPorCategoria(categoria) {
  if (categoria === 'todas') {
    return cardapio;
  }
  return cardapio.filter(item => item.categoria === categoria);
}

// Listener para o evento de troca no select do filtro
elementoFiltro.addEventListener('change', (evento) => {
  const categoriaSelecionada = evento.target.value;
  const listaFiltrada = filtrarPorCategoria(categoriaSelecionada);
  renderizarCardapio(listaFiltrada);
});

// -------------------------------------------------------------
// ETAPA 1 E 4: CARREGAMENTO DOS DADOS (PROMISE.ALL)
// -------------------------------------------------------------
async function carregarCardapio() {
  mostrarAviso('Carregando cardápio...');

  try {
    // Busca do cardápio e promoções em paralelo (Etapa 4)
    const dados = await Promise.all([
      buscarDados('cardapio.json'),
      buscarDados('promocoes.json')
    ]);

    const itensCardapio = dados[0];
    const promocoes = dados[1];

    // Aplica as promoções e salva na variável global 'cardapio'
    cardapio = aplicarPromocoes(itensCardapio, promocoes);

    mostrarAviso(''); // Limpa o aviso
    renderizarCardapio(cardapio);
  } catch (erro) {
    mostrarAviso(`Erro ao carregar cardápio: ${erro.message}`);
    console.error('Detalhes do erro:', erro);
  }
}

// -------------------------------------------------------------
// ETAPA 5: GERENCIAMENTO DO PEDIDO E ENVIO
// -------------------------------------------------------------
function adicionarAoPedido(item) {
  pedido.push(item);
  atualizarPedidoUI();
}

function atualizarPedidoUI() {
  elementoListaPedido.innerHTML = '';

  let totalCalculado = 0;

  pedido.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nome} - ${formatarMoeda(item.precoFinal)}`;
    elementoListaPedido.appendChild(li);
    totalCalculado += item.precoFinal;
  });

  elementoTotal.textContent = formatarMoeda(totalCalculado);
}

// Simulação de backend via Promise criada manualmente (Etapa 5)
function enviarPedido(itens) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Falha 3 em 10 vezes (30%)
      if (Math.random() < 0.3) {
        reject(new Error('Falha de conexão com o servidor. Tente novamente.'));
      } else {
        const numeroPedido = Math.floor(Math.random() * 9000) + 1000;
        resolve(numeroPedido);
      }
    }, 2000);
  });
}

// Evento do botão Finalizar Pedido
elementoBotaoFinalizar.addEventListener('click', async () => {
  if (pedido.length === 0) {
    elementoStatusPedido.textContent = 'Adicione pelo menos um item ao pedido!';
    return;
  }

  // Prepara estado visual para envio
  elementoBotaoFinalizar.disabled = true;
  elementoStatusPedido.textContent = 'Enviando pedido...';

  try {
    const numeroPedido = await enviarPedido(pedido);
    elementoStatusPedido.textContent = `Pedido #${numeroPedido} confirmado com sucesso!`;
    
    // Limpa o carrinho/pedido após sucesso
    pedido = [];
    atualizarPedidoUI();
  } catch (erro) {
    elementoStatusPedido.textContent = `Erro ao enviar pedido: ${erro.message}`;
  } finally {
    // Reativa o botão sempre, independe do resultado
    elementoBotaoFinalizar.disabled = false;
  }
});

// Inicialização da aplicação
carregarCardapio();