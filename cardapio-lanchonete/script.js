// Cardápio da lanchonete
// Estados da tela (etapa 1): Carregando,cardápio na tela,erro

// CONSTANTES GERAIS:
const aviso= document.querySelector('.aviso')
const cardapioItens= document.querySelector('.cardapioItens')
// FUNCOES:

// 1. Busca

function mostrarAviso(texto){
    aviso.textContent=`${texto}` 
}

async function buscarDados(url) {
    const resposta = await fetch(url);
    
    if (!resposta.ok) {
        throw new Error(`Erro HTTP! Status: ${resposta.status}`);
    }
    
    return await resposta.json();
}

async function carregarCardapio() {
   
    cardapioItens.innerHTML = '';
    
    aviso.textContent = "Carregando cardápio...";

    try {
        const dados = await buscarDados('cardapio.json');

        aviso.textContent = ""; 
        
        dados.forEach(item => {
            const p = document.createElement('p');
            p.textContent = `${item.nome} — ${item.descricao} — $${item.preco}`;
            cardapioItens.appendChild(p);
        });

    } catch (erro) {
        aviso.textContent = `Atenção: Não foi possível carregar os dados. (${erro.message})`;
        console.error("Detalhes técnicos do erro:", erro);
    }
}

carregarCardapio();


// 2. Dados

// 3. Tela

// 4. Eventos
