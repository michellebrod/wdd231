
"use strict";

import { locais } from "../data/locais.mjs";

const gradeLugares = document.querySelector("#grade-lugares");
const mensagemVisita = document.querySelector("#mensagem-visita");

const modal = document.querySelector("#modal-lugar");
const modalTitulo = document.querySelector("#modal-lugar-titulo");
const modalDescricao = document.querySelector("#modal-lugar-descricao");
const modalEndereco = document.querySelector("#modal-lugar-endereco");
const botaoFechar = document.querySelector("#fechar-modal-lugar");


function mostrarUltimaVisita() {
    if (!mensagemVisita) {
        return;
    }

    const chave = "ultimaVisitaSobreSBC";
    const agora = Date.now();
    const milissegundosPorDia = 24 * 60 * 60 * 1000;

    try {
        const valorAnterior = localStorage.getItem(chave);

        if (valorAnterior === null) {
            mensagemVisita.textContent =
                "Boas-vindas! Entre em contato conosco caso tenha alguma dúvida.";
        } else {
            const ultimaVisita = Number(valorAnterior);

            if (
                !Number.isFinite(ultimaVisita) ||
                ultimaVisita <= 0 ||
                ultimaVisita > agora
            ) {
                mensagemVisita.textContent =
                    "Boas-vindas! Entre em contato conosco caso tenha alguma dúvida.";
            } else {
                const diferenca = agora - ultimaVisita;
                const dias = Math.floor(
                    diferenca / milissegundosPorDia
                );

                if (dias < 1) {
                    mensagemVisita.textContent =
                        "Já voltou? Que legal!";
                } else if (dias === 1) {
                    mensagemVisita.textContent =
                        "Seu último acesso foi há 1 dia.";
                } else {
                    mensagemVisita.textContent =
                        `Seu último acesso foi há ${dias} dias.`;
                }
            }
        }

        localStorage.setItem(chave, String(agora));

    } catch (erro) {
        console.error("Erro ao acessar localStorage:", erro);

        mensagemVisita.textContent =
            "Boas-vindas! Conheça os lugares da nossa cidade.";
    }
}


function abrirDetalhes(local) {
    if (!modal) {
        return;
    }

    modalTitulo.textContent = local.nome;
    modalDescricao.textContent = local.detalhes;
    modalEndereco.textContent = local.endereco;

    modal.showModal();
}


function criarCartao(local) {
    const cartao = document.createElement("article");

    cartao.className = `lugar-cartao area-${local.id}`;

    // Título
    const titulo = document.createElement("h2");
    titulo.textContent = local.nome;

    // Figura e imagem
    const figura = document.createElement("figure");

    const imagem = document.createElement("img");
    imagem.src = local.imagem;
    imagem.alt = `Vista de ${local.nome}, em São Bernardo do Campo`;
    imagem.width = 300;
    imagem.height = 200;
    imagem.loading = "lazy";
    imagem.decoding = "async";

    figura.append(imagem);

    // Endereço
    const endereco = document.createElement("address");
    endereco.textContent = local.endereco;

    // Descrição
    const descricao = document.createElement("p");
    descricao.textContent = local.descricao;

    // Botão Saiba mais
    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "botao-saiba-mais";
    botao.textContent = "Saiba mais";
    botao.setAttribute(
        "aria-label",
        `Saiba mais sobre ${local.nome}`
    );

    botao.addEventListener("click", () => {
        abrirDetalhes(local);
    });

    // Adiciona os elementos ao cartão
    cartao.append(
        titulo,
        figura,
        endereco,
        descricao,
        botao
    );

    return cartao;
}


function mostrarLugares() {
    if (!gradeLugares) {
        return;
    }

    const fragmento = document.createDocumentFragment();

    locais.forEach(local => {
        const cartao = criarCartao(local);
        fragmento.append(cartao);
    });

    gradeLugares.replaceChildren(fragmento);
}


if (botaoFechar && modal) {
    botaoFechar.addEventListener("click", () => {
        modal.close();
    });
}


mostrarUltimaVisita();
mostrarLugares();
