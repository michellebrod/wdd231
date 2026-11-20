
"use strict";

const campoDataHora = document.querySelector("#timestamp");

if (campoDataHora) {
    campoDataHora.value = new Date().toISOString();
}

const linksModais = document.querySelectorAll("[data-modal]");

linksModais.forEach(link => {

    link.addEventListener("click", evento => {

        evento.preventDefault();

        const idModal = link.dataset.modal;

        const modal = document.getElementById(idModal);

        if (modal instanceof HTMLDialogElement && !modal.open) {
            modal.showModal();
        }

    });

});
