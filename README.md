[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/72Bdl6Wn)

# Almoxarifado - Controle de Estoque (Enfermagem)

Sistema web simples para controle de estoque de um almoxarifado de enfermagem.
Permite **cadastrar materiais**, **listar** o estoque atual, **dar baixa** (retirada)
e **excluir** itens, consumindo uma API na nuvem (MockAPI).

O projeto nasceu de um levantamento de requisitos com a área de enfermagem, cuja
maior dor era o controle manual (Excel + rascunho em papel) das entradas e saídas
de materiais, sem contabilização automática de quantidades.

> **Projeto acadêmico** — desenvolvido como avaliação da disciplina de Front-end
> (ADS, 3º semestre). O trabalho é dividido em sprints e, no momento, a
> **última sprint (Sprint 3) ainda está em andamento** (veja [Status do projeto](#status-do-projeto)).

## Funcionalidades

- **Cadastro de material** (POST): nome e quantidade inicial.
- **Listagem dinâmica** (GET): a tabela é preenchida ao abrir a página.
- **Baixa de estoque** (PUT): subtrai a quantidade retirada e atualiza o servidor.
- **Exclusão** (DELETE): remove o material do servidor e da tela.
- **Validação de regras de negócio**: não permite retirar quantidades negativas,
  zero ou maiores que o estoque disponível.
- **Tratamento de erros** com `try/catch` nas chamadas à API.

## Tecnologias utilizadas

- **HTML5**
- **CSS / [Tailwind CSS](https://tailwindcss.com/)** (via CDN) para estilização.
- **JavaScript (Vanilla)** com a API `fetch` para a comunicação HTTP.
- **[MockAPI](https://mockapi.io/)** como backend simulado (REST na nuvem).
- **[Jest](https://jestjs.io/)** + **jsdom** para os testes automatizados.

## Como rodar o projeto

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd prova-2bi-ads-3sem-gcastrodev
```

2. Abra o arquivo `index.html` no navegador. Pode ser:
   - Dois cliques no arquivo, ou
   - Usando uma extensão como **Live Server** (VS Code), ou
   - Servindo localmente:

```bash
npx serve .
```

> A aplicação já aponta para uma instância do MockAPI, então funciona direto no
> navegador, sem necessidade de subir um backend.

## Como rodar os testes

Instale as dependências e rode os testes por sprint:

```bash
npm install

npm run test:sprint1   # Estrutura HTML e contrato da Sprint 1
npm run test:sprint2   # Validação, baixa (PUT) e exclusão (DELETE)
npm run test:sprint3   # Dashboard, busca e tratamento de erro (em andamento)
```

## Status do projeto

| Sprint   | Escopo                                                        | Status            |
| -------- | ------------------------------------------------------------- | ----------------- |
| Sprint 1 | Fundação e inventário (estrutura do formulário e da listagem) | ✅ Concluída       |
| Sprint 2 | Regras de negócio e saídas (validação, baixa, exclusão)       | ✅ Concluída       |
| Sprint 3 | Dashboard e polimento (busca + contador de itens)             | 🚧 Em andamento   |

**O que ainda falta na Sprint 3:**

- Barra de pesquisa de materiais (`#input-busca`) para filtrar a listagem.
- Indicador de **total de itens** no dashboard (`#total-itens`).
- Polimento geral da interface.

> O `try/catch` exigido na Sprint 3 já está implementado no `main.js`.

## Contrato técnico (IDs e classes)

| Elemento                         | Seletor              | Status        |
| -------------------------------- | -------------------- | ------------- |
| Input de nome do material        | `#input-nome`        | ✅ Implementado |
| Input de quantidade              | `#input-quantidade`  | ✅ Implementado |
| Botão de cadastrar               | `#btn-cadastrar`     | ✅ Implementado |
| Tabela/lista de materiais        | `#lista-materiais`   | ✅ Implementado |
| Input de quantidade a retirar    | `#input-retirada`    | ✅ Implementado |
| Botão de baixa (PUT)             | `.btn-baixar`        | ✅ Implementado |
| Botão de exclusão (DELETE)       | `.btn-excluir`       | ✅ Implementado |
| Input de busca                   | `#input-busca`       | 🚧 Pendente    |
| Contador de itens (dashboard)    | `#total-itens`       | 🚧 Pendente    |

### Função de validação

```js
validarRetirada(estoqueAtual, quantidadeRetirada)
```

Retorna `true` se a retirada for válida e `false` caso contrário (quantidade
menor ou igual a zero, ou maior que o estoque atual).

## Estrutura do projeto

```
.
├── index.html        # Interface (formulário + tabela)
├── main.js           # Lógica e integração com o MockAPI
├── style.css         # Espaço para estilos adicionais
├── __tests__/        # Testes automatizados (Jest)
│   ├── sprint1.test.js
│   ├── sprint2.test.js
│   └── sprint3.test.js
└── README.md
```
