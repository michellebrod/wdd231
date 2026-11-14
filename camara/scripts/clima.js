const CHAVE_OPENWEATHER = '';
const LATITUDE = -23.6939;
const LONGITUDE = -46.5650;

const areaAtual = document.querySelector('#clima-atual');
const areaPrevisao = document.querySelector('#previsao-tres-dias');

function textoElemento(tag, texto, classe = '') {
  const el = document.createElement(tag);
  el.textContent = texto;
  if (classe) el.className = classe;
  return el;
}

async function obterJSON(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`OpenWeatherMap respondeu HTTP ${resposta.status}`);
  }
  return resposta.json();
}

function formatarDia(iso) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
}

function dataLocalCidade(unixSegundos, deslocamentoSegundos) {
  return new Date((unixSegundos + deslocamentoSegundos) * 1000).toISOString().slice(0, 10);
}

function horaLocalCidade(unixSegundos, deslocamentoSegundos) {
  return new Date((unixSegundos + deslocamentoSegundos) * 1000).getUTCHours();
}

function mostrarTempoAtual(dados) {
  const bloco = textoElemento('div', '', 'tempo-flex');
  const iconeCodigo = dados.weather?.[0]?.icon;
  if (iconeCodigo && /^[0-9]{2}[dn]$/.test(iconeCodigo)) {
    const icone = document.createElement('img');
    icone.src = `https://openweathermap.org/img/wn/${iconeCodigo}@2x.png`;
    icone.alt = dados.weather[0].description || 'Condição do tempo';
    icone.width = 72;
    icone.height = 72;
    bloco.append(icone);
  }
  const infos = document.createElement('div');
  infos.append(textoElemento('strong', `${Math.round(dados.main.temp)} °C`));
  infos.append(textoElemento('p', dados.weather?.[0]?.description ?? 'Condição indisponível'));
  bloco.append(infos);
  areaAtual.replaceChildren(bloco);
}

function mostrarPrevisao(dados) {
  const fuso = dados.city?.timezone ?? -10800;
  const hoje = dataLocalCidade(Math.floor(Date.now() / 1000), fuso);
  const porDia = new Map();

  for (const item of dados.list || []) {
    const dia = dataLocalCidade(item.dt, fuso);
    if (dia <= hoje) continue;
    const hora = horaLocalCidade(item.dt, fuso);
    const diferenca = Math.abs(hora - 12);
    if (!porDia.has(dia) || diferenca < porDia.get(dia).diferenca) {
      porDia.set(dia, { temperatura: item.main.temp, diferenca });
    }
  }

  const proximos = [...porDia.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(0, 3);
  if (proximos.length < 3) throw new Error('Previsão insuficiente para três dias');
  const cards = proximos.map(([dia, info]) => {
    const card = textoElemento('div', '', 'dia-previsao');
    card.append(textoElemento('span', formatarDia(dia)));
    card.append(textoElemento('strong', `${Math.round(info.temperatura)} °C`));
    card.append(textoElemento('small', 'Por volta de 12h'));
    return card;
  });
  areaPrevisao.replaceChildren(...cards);
}

async function carregarClima() {
  if (!CHAVE_OPENWEATHER || CHAVE_OPENWEATHER === '') {
    areaAtual.textContent = 'Previsão indisponível: configure a chave da OpenWeatherMap em scripts/clima.js.';
    areaPrevisao.textContent = 'Dados ainda não disponíveis.';
    return;
  }
  const base = 'https://api.openweathermap.org/data/2.5';
  const parametros = new URLSearchParams({lat: String(LATITUDE), lon: String(LONGITUDE), appid: CHAVE_OPENWEATHER, units: 'metric', lang: 'pt_br'});
  try {
    const [atual, previsao] = await Promise.all([
      obterJSON(`${base}/weather?${parametros}`),
      obterJSON(`${base}/forecast?${parametros}`)
    ]);
    mostrarTempoAtual(atual);
    mostrarPrevisao(previsao);
  } catch (erro) {
    console.error('Falha ao consultar a OpenWeatherMap:', erro);
    areaAtual.textContent = 'Não foi possível consultar o tempo agora. Verifique sua chave de API e a conexão.';
    areaPrevisao.textContent = 'Previsão indisponível no momento.';
  }
}

carregarClima();
