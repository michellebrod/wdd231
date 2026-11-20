
"use strict";

const parametros = new URLSearchParams(window.location.search);

const areaDados = document.querySelector("#dados-solicitacao");

function obterValor(nome) {
    const valor = parametros.get(nome);

    return valor?.trim() || "Não informado";
}

function formatarDataHora(valor) {

    if (!valor || valor === "Não informado") {
        return "Não informado";
    }

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        return "Data inválida";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "long",
        timeStyle: "medium",
        timeZone: "America/Sao_Paulo"
    }).format(data);
}

function adicionarInformacao(destino, rotulo, valor) {

    const grupo = document.createElement("div");
    grupo.className = "dado-item";

    const titulo = document.createElement("dt");
    titulo.textContent = rotulo;

    const conteudo = document.createElement("dd");
    conteudo.textContent = valor;

    grupo.append(titulo, conteudo);

    destino.append(grupo);
}

function mostrarDados() {

    if (!areaDados) {
        return;
    }

    areaDados.replaceChildren();

    const camposObrigatorios = [
        "primeiroNome",
        "sobrenome",
        "email",
        "telefone",
        "organizacao",
        "timestamp"
    ];

    const dadosCompletos = camposObrigatorios.every(campo => {
        const valor = parametros.get(campo);
        return valor !== null && valor.trim() !== "";
    });

    if (!dadosCompletos) {

        adicionarInformacao(
            areaDados,
            "Aviso",
            "Nenhuma solicitação completa foi encontrada. " +
            "Preencha o formulário de associação."
        );

        return;
    }

    const dados = [
        ["Nome", obterValor("primeiroNome")],
        ["Sobrenome", obterValor("sobrenome")],
        ["E-mail", obterValor("email")],
        ["Celular", obterValor("telefone")],
        ["Empresa ou organização", obterValor("organizacao")],
        [
            "Data e hora de abertura",
            formatarDataHora(obterValor("timestamp"))
        ]
    ];

    dados.forEach(([rotulo, valor]) => {
        adicionarInformacao(areaDados, rotulo, valor);
    });
}

mostrarDados();
