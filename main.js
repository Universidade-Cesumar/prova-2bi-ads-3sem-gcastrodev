const API_URL = "https://6a309d45a7f8866418d63819.mockapi.io/api/v1/materiais";

const form = document.getElementById("form-material");
const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const listaMateriais = document.getElementById("lista-materiais");

async function carregarMateriais() {
    const resposta = await fetch(API_URL);
    const materiais = await resposta.json();

    listaMateriais.innerHTML = "";

    if (materiais.length === 0) {
        listaMateriais.innerHTML = `
            <tr>
                <td colspan="2" class="py-10 px-6 text-center text-slate-400">
                    Nenhum material cadastrado ainda.
                </td>
            </tr>
        `;
        return;
    }

    materiais.forEach((material) => {
        const linha = document.createElement("tr");
        linha.className = "hover:bg-slate-50 transition-colors";
        linha.innerHTML = `
            <td class="py-3 px-6 font-medium text-slate-800">${material.nome}</td>
            <td class="py-3 px-6 text-right">
                <span class="inline-flex items-center rounded-full bg-brand-600/10 text-brand-700 px-2.5 py-0.5 text-xs font-semibold">
                    ${material.quantidade}
                </span>
            </td>
        `;
        listaMateriais.appendChild(linha);
    });
}

async function cadastrarMaterial(evento) {
    evento.preventDefault();

    const novoMaterial = {
        nome: inputNome.value,
        quantidade: Number(inputQuantidade.value),
    };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoMaterial),
    });

    form.reset();
    carregarMateriais();
}

form.addEventListener("submit", cadastrarMaterial);

carregarMateriais();
