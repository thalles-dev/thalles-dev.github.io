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

async function pegarHoraBrasil() {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo');
    const data = await response.json();
    const hora = parseInt(data.datetime.slice(11,13)); // pega os dois dígitos da hora
    return hora;
  } catch (error) {
    console.error("Erro ao pegar hora do Brasil:", error);
    return new Date().getHours(); // fallback: hora local
  }
}


// =========================
// Função: muda layout pela hora
// =========================
async function carregar() {
  const hora = await pegarHoraBrasil(); // pega hora de Brasília

  if (hora >= 0 && hora < 6) {
    imagemHora.src = 'images/madrugada.gif';
    document.body.style.background = '#000102';
    pokemonGif.src = 'images/pokemon-madrugada.gif';
    msgII.innerHTML = '<em>"Nos meus sonhos inquietos, vejo aquela cidade... Silent Hill."</em>';

  } else if (hora >= 6 && hora < 12) {
    imagemHora.src = 'images/manha.gif';
    document.body.style.background = '#6B9CC6';
    pokemonGif.src = 'images/pokemon-manha.gif';
    msgII.innerHTML = '<em>"Bom dia! Que as musas inspirem teu início."</em>';

  } else if (hora >= 12 && hora < 18) {
    imagemHora.src = 'images/tarde.jpg';
    document.body.style.background = '#623217';
    pokemonGif.src = 'images/pokemon-tarde.gif';
    msgII.innerHTML = '<em>"O sol alto testemunha teus passos."</em>';

  } else {
    imagemHora.src = 'images/noite.gif';
    document.body.style.background = '#374a82ff';
    pokemonGif.src = 'images/pokemon-noite.gif';
    msgII.innerHTML = '<em>"Será que a Rita está olhando para a mesma lua neste mesmo momento?<br>Eu gosto disso... Conectados pela luz."</em>';
  }


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
