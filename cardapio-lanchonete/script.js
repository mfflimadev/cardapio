// Cardápio da lanchonete
// Estados da tela (etapa 1): Carregando,cardápio na tela,erro

// CONSTANTES GERAIS:
const aviso= document.querySelector('.aviso')
const cardapioItens= document.querySelector('.cardapioItens')
let cardapio = [];
// FUNCOES:

// 1. Busca

function formatarMoeda(valor){
    return 'R$ ' + valor.toLocaleString('pt-BR', {
         minimumFractionDigits: 2, maximumFractionDigits: 2 
    });
}

function criarCard(item){
            
            const linha = document.createElement('article');
            const nome= document.createElement('span');
            const descricao=document.createElement('span');
            const preco=document.createElement('span');
            const botaoadicionar=document.createElement('button')

            linha.classList.add('linha')
            nome.classList.add('nome')
            descricao.classList.add('descricao');
            preco.classList.add('preco');
            botaoadicionar.classList.add('adicionar');

             nome.textContent= `${item.nome}`
             descricao.textContent= `${item.descricao}`
             preco.textContent= formatarMoeda(item.preco);
             botaoadicionar.textContent='Adicionar'

            linha.appendChild(nome);
            linha.appendChild(descricao);
            linha.appendChild(preco);
            linha.appendChild(botaoadicionar);
        
            return linha;
    }

function mostrarAviso(texto){
    aviso.textContent=texto;
}

async function buscarDados(url) {
    const resposta = await fetch(url);
    if (!resposta.ok) {
        throw new Error(`Erro HTTP! Status: ${resposta.status}`);
    }
    
    return await resposta.json();
}

async function renderizarCardapio(lista) {
    cardapioItens.innerHTML = '';
    lista.forEach(item=>{
        const card=criarCard(item);
    cardapioItens.appendChild(card) ; 
    })
    

async function carregarCardapio() {
    
}
    mostrarAviso("Carregando cardápio...");

    try {
        mostrarAviso("");
        const dados =await buscarDados('cardapio.json');
        
        renderizarCardapio(dados)

    } catch (erro) {
        mostrarAviso(`Atenção: Não foi possível carregar os dados. (${erro.message})`);
        console.error("Detalhes técnicos do erro:", erro);
    }
}

//carregarCardapio();
renderizarCardapio(cardapio);


// 2. Dados

// 3. Tela

// 4. Eventos
