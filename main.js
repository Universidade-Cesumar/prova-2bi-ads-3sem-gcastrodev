const API_URL = "https://6a309d45a7f8866418d63819.mockapi.io/api/v1/materiais";

const form = document.getElementById("form-material");
const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const listaMateriais = document.getElementById("lista-materiais");
const inputBusca = document.getElementById("input-busca");
const totalItens = document.getElementById("total-itens");

// Guarda a ultima lista vinda da API para filtrar a busca sem refazer o GET.
let materiaisCache = [];

// Regra de negocio: so permite retirar uma quantidade positiva e que nao
// ultrapasse o estoque disponivel. Retorna true (valida) ou false (invalida).
function validarRetirada(estoqueAtual, quantidadeRetirada) {
    if (quantidadeRetirada <= 0) {
        return false;
    }
    if (quantidadeRetirada > estoqueAtual) {
        return false;
    }
    return true;
}

async function carregarMateriais() {
    try {
        const resposta = await fetch(API_URL);
        materiaisCache = await resposta.json();
        renderizarMateriais(materiaisCache);
    } catch (erro) {
        console.error("Erro ao carregar materiais:", erro);
        listaMateriais.innerHTML = `
            <tr>
                <td colspan="3" class="py-10 px-6 text-center text-rose-500">
                    Nao foi possivel carregar os materiais. Verifique sua conexao
                    com a internet e tente novamente.
                </td>
            </tr>
        `;
    }
}

// Recebe uma lista (completa ou filtrada), desenha a tabela e atualiza o
// contador do dashboard com o total de itens exibidos.
function renderizarMateriais(materiais) {
    listaMateriais.innerHTML = "";
    totalItens.textContent = materiais.length;

    if (materiais.length === 0) {
        listaMateriais.innerHTML = `
            <tr>
                <td colspan="3" class="py-10 px-6 text-center text-slate-400">
                    Nenhum material encontrado.
                </td>
            </tr>
        `;
        return;
    }

    materiais.forEach((material) => {
        const linha = document.createElement("tr");
        linha.className = "hover:bg-slate-50 transition-colors";

        // Alerta visual: marca a linha como estoque critico quando o saldo
        // estiver abaixo de 10 unidades.
        const estoqueBaixo = material.quantidade < 10;
        if (estoqueBaixo) {
            linha.classList.add("estoque-critico");
        }

        const corBadge = estoqueBaixo
            ? "bg-rose-100 text-rose-700"
            : "bg-brand-600/10 text-brand-700";

        linha.innerHTML = `
                <td class="py-3 px-6 font-medium text-slate-800">
                    ${material.nome}
                    ${estoqueBaixo ? '<span class="ml-2 text-xs font-semibold text-rose-600">estoque baixo</span>' : ""}
                </td>
                <td class="py-3 px-6 text-right">
                    <span class="inline-flex items-center rounded-full ${corBadge} px-2.5 py-0.5 text-xs font-semibold">
                        ${material.quantidade}
                    </span>
                </td>
                <td class="py-3 px-6">
                    <div class="flex items-center justify-end gap-2">
                        <button type="button" class="btn-baixar inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors"
                            data-id="${material.id}" data-estoque="${material.quantidade}">
                            Baixar
                        </button>
                        <button type="button" class="btn-excluir inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors"
                            data-id="${material.id}">
                            Excluir
                        </button>
                    </div>
                </td>
            `;
        listaMateriais.appendChild(linha);
    });
}

// Filtra a lista em memoria pelo nome digitado na barra de pesquisa.
function filtrarMateriais() {
    const termo = inputBusca.value.trim().toLowerCase();
    const filtrados = materiaisCache.filter((material) =>
        material.nome.toLowerCase().includes(termo)
    );
    renderizarMateriais(filtrados);
}

async function cadastrarMaterial(evento) {
    evento.preventDefault();

    const novoMaterial = {
        nome: inputNome.value,
        quantidade: Number(inputQuantidade.value),
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoMaterial),
        });

        form.reset();
        carregarMateriais();
    } catch (erro) {
        console.error("Erro ao cadastrar material:", erro);
        alert(
            "Nao foi possivel cadastrar o material. Verifique sua conexao com " +
            "a internet e tente novamente."
        );
    }
}

async function baixarEstoque(id, estoqueAtual) {
    const inputRetirada = document.getElementById("input-retirada");
    const quantidadeRetirada = Number(inputRetirada.value);

    if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
        alert(
            "Quantidade invalida. Informe um valor maior que zero e que nao " +
            "ultrapasse o estoque disponivel (" + estoqueAtual + ")."
        );
        return;
    }

    const novoEstoque = estoqueAtual - quantidadeRetirada;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantidade: novoEstoque }),
        });

        inputRetirada.value = "";
        carregarMateriais();
    } catch (erro) {
        console.error("Erro ao baixar estoque:", erro);
    }
}

async function excluirMaterial(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        carregarMateriais();
    } catch (erro) {
        console.error("Erro ao excluir material:", erro);
    }
}

// Usa delegacao de eventos: como os botoes sao criados dinamicamente, ouvimos
// os cliques na tabela e identificamos qual botao foi acionado.
function tratarCliqueLista(evento) {
    const botaoBaixar = evento.target.closest(".btn-baixar");
    if (botaoBaixar) {
        const id = botaoBaixar.dataset.id;
        const estoqueAtual = Number(botaoBaixar.dataset.estoque);
        baixarEstoque(id, estoqueAtual);
        return;
    }

    const botaoExcluir = evento.target.closest(".btn-excluir");
    if (botaoExcluir) {
        const id = botaoExcluir.dataset.id;
        if (confirm("Tem certeza que deseja excluir este material?")) {
            excluirMaterial(id);
        }
    }
}

// So liga os eventos e busca os dados quando rodando no navegador (com fetch
// disponivel). Isso evita que os testes unitarios quebrem ao importar o arquivo.
if (typeof fetch !== "undefined" && form) {
    form.addEventListener("submit", cadastrarMaterial);
    listaMateriais.addEventListener("click", tratarCliqueLista);
    inputBusca.addEventListener("input", filtrarMateriais);
    carregarMateriais();
}
