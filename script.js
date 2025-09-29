// Configuração Last.fm
const CHAVE_API = 'e90a48c85fd4bc75f2a0e34533be9ccb';
const USUARIO = 'samievski';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
const endpoint = `${BASE_URL}?method=user.getrecenttracks&user=${USUARIO}&api_key=${CHAVE_API}&limit=1&format=json`;

// Elementos da página
const elementoDestino = document.getElementById('lastfm-status');
const imagemHora = document.getElementById("imagem-hora");
const pokemonGif = document.getElementById("pokemon-gif");
const msgII = document.getElementById("msg-ii");

// =========================
// Função: configura o layout fixo (somente madrugada)
// =========================
function carregar() {
  // Banner fixo
  imagemHora.src = 'images/madrugada.gif';
  document.body.style.background = '#000102';
  
  // Gif do Pokémon fixo
  pokemonGif.src = 'images/pokemon-madrugada.gif';
  
  // Mensagem fixa
  msgII.innerHTML = '<em>"Nos meus sonhos inquietos, vejo aquela cidade... Silent Hill."</em>';

  // Atualiza música do Last.fm
  atualizarMusica();
  setInterval(atualizarMusica, 30000); // atualiza a cada 30s
}

// =========================
// Função: busca a música do Last.fm
// =========================
async function atualizarMusica() {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (!data.recenttracks || data.recenttracks.track.length === 0) {
      elementoDestino.innerText = "Nenhuma música encontrada.";
      return;
    }

    const track = data.recenttracks.track[0];
    const musica = track.name;
    const artista = track.artist["#text"];

    if (track["@attr"] && track["@attr"].nowplaying === "true") {
      elementoDestino.innerText = `🎧 Ouvindo agora: ${musica} – ${artista}`;
    } else {
      elementoDestino.innerHTML = `Não estou escutando nenhuma música agora... mas a última foi:<br>${musica} – ${artista}`;
    }

  } catch (error) {
    console.error("Erro ao carregar música:", error);
    elementoDestino.innerText = "Erro ao carregar música.";
  }
}
