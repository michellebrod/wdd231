document.querySelector('#anoAtual').textContent = new Date().getFullYear();
const ultimaModificacao = new Date(document.lastModified);
const textoData = Number.isNaN(ultimaModificacao.getTime()) ? 'Data indisponível' : ultimaModificacao.toLocaleString('pt-BR', {dateStyle:'short', timeStyle:'short'});
document.querySelector('#ultimaModificacao').textContent = `Última modificação: ${textoData}`;
