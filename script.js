const form = document.querySelector("#form");
const searchInput = document.querySelector("#search");
const songsContainer = document.querySelector("#songs-container");
const precAndNextContainer = document.querySelector("#prev-and-next-container");

const playerSongs = document.querySelector(".song-preview");
const playButton = document.querySelector(".play");
const pauseButton = document.querySelector(".pause");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const restartButton = document.querySelector(".restart");

const volumeButton = document.querySelector(".volume-button");
const audio = document.querySelector("audio");
const barraDeAltura = document.querySelector(".altura ");
const progressoDaAltura = document.querySelector(".altura-progresso");
const capaAlbum = document.querySelector(".player-container img");
const tempoTotalDaMusica = document.querySelector(".time-end");
const tempoAtualDaMusica = document.querySelector(".time-atual");
const barraDeTempo = document.querySelector(".barra-de-progresso ");
const progressoDoTempo = document.querySelector(".progresso");

const apiURL = `https://api.lyrics.ovh`;

let dadosArry = "";

// Salvar dados na variavel
const salvarDados = (dado) => {
  dadosArry = dado;
};

// PEGA O VALUE DO INPUT E PASSA POR PARAMETRO
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    songsContainer.innerHTML = `<li class="warning-message"> Por favor, digite um termo valido </li>`;
    return;
  }

  fetchSongs(searchTerm);
});

// FAZ UMA REQUISIÇÃO PARA API COM OS DADOS
const fetchSongs = async (term) => {
  const response = await fetch(`${apiURL}/suggest/${term}`);
  const data = await response.json();

  insertSongsIntoPage(data);
  salvarDados(data);
};

// INSERI AS COISAS NO HTML
const insertSongsIntoPage = (songsInfo) => {
  songsContainer.innerHTML = songsInfo.data
    .map(
      (song, indice) =>
        `<li class="song"> 
         <span class="song-artist"> <strong>${song.artist.name}</strong> - ${song.title}  </span>
         <button class="btn" data-indice-song="${indice}" >Escutar </button>
         </li>`
    )
    .join(``);

  if (songsInfo.prev || songsInfo.next) {
    precAndNextContainer.innerHTML = `
     ${
       songsInfo.prev
         ? `<button class="btn" onClick="getMoreSongs('${songsInfo.prev}')">Anteriores</button>`
         : ``
     }
      ${
        songsInfo.next
          ? `<button class="btn" onClick="getMoreSongs('${songsInfo.next}')">Proximas</button>`
          : ``
      }
   `;

    return;
  }

  precAndNextContainer.innerHTML = "";
};

// QUANDO OS BUTÕES DE ANTERIOR OU PROXIMO SÃO CLICADOS, ELA FAZ UMA REQUISIÇÃO COM MAIS 15 SONGS
const getMoreSongs = async (url) => {
  const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await response.json();

  insertSongsIntoPage(data);
  salvarDados(data);
};

// INSERIR A PLAYER MUSIC

songsContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const indice = event.target.getAttribute("data-indice-song");
    const audio = dadosArry.data[indice].preview;
    const capa = dadosArry.data[indice].album.cover;
    const nameSong = dadosArry.data[indice].title;
    const artistName = dadosArry.data[indice].artist.name;

    const imgCapa = document.querySelector(".player-container img");
    const namemusica = document.querySelector(".song-name");
    const nameartista = document.querySelector(".artist-name");
    const tagaudio = document.querySelector(".barra-de-progresso audio");

    songsContainer.innerHTML = " ";
    playerSongs.style.display = "inline-block";

    imgCapa.src = capa;
    namemusica.innerText = `${nameSong}`;
    nameartista.innerText = `${artistName}`;
    tagaudio.src = audio;

    console.log(playerSongs);

    precAndNextContainer.innerHTML = ``;
  }
});

// VOLTAR A PAGINA ANTERIOR AO PLAY

function paginaAnterior() {
  playerSongs.style.display = "none";
  insertSongsIntoPage(dadosArry);
}

// ==================== player ========================

/*
    = next music button
    = previous musicbutton
    = segurar o progresso e soltar e ele ir pro lugar determinado
*/

//play na musica
playButton.addEventListener("click", () => {
  audio.play();
  pauseButton.style.display = "inline-block";
  playButton.style.display = "none";

  const songMinutos = Math.floor(audio.duration / 60);
  const songSegundos = Math.floor(audio.duration % 60);

  tempoTotalDaMusica.innerText = `${songMinutos}:${songSegundos}`;
});

//pause a musica
pauseButton.addEventListener("click", () => {
  audio.pause();
  pauseButton.style.display = "none";
  playButton.style.display = "inline-block";
});

// abrir controle de volume
volumeButton.addEventListener("click", () => {
  const volumeAtual = (100 * audio.volume) / 1;
  progressoDaAltura.style.width = `${volumeAtual}%`;

  if (
    barraDeAltura.style.display === "" ||
    barraDeAltura.style.display === "none"
  ) {
    barraDeAltura.style.display = "block";
    return;
  } else {
    barraDeAltura.style.display = "none";
  }
});

// editar volume

barraDeAltura.addEventListener("click", (event) => {
  const larguraDaBarra = parseInt(window.getComputedStyle(barraDeAltura).width);
  const ondeFoiClicado = event.offsetX;
  const porcDetd = Math.floor((ondeFoiClicado / larguraDaBarra) * 100);

  const numberVolume = (porcDetd * 1) / 100;
  audio.volume = numberVolume;
  const volumeAtual = (100 * audio.volume) / 1;
  progressoDaAltura.style.width = `${volumeAtual}%`;

  if (audio.volume >= 0.45) {
    volumeButton.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
  }
  if (audio.volume <= 0.45) {
    volumeButton.innerHTML = `<i class="fa-solid fa-volume-low"></i>`;
  }
  if (audio.volume <= 0.19) {
    volumeButton.innerHTML = `<i class="fa-solid fa-volume-off"></i>`;
  }
  if (audio.volume <= 0.06) {
    volumeButton.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    audio.volume = 0.0;
  }
});

//  contador de progresso

audio.addEventListener("timeupdate", () => {
  const songMinutos = Math.floor(audio.currentTime / 60);
  const songSegundos = Math.floor(audio.currentTime % 60);
  tempoAtualDaMusica.innerText = `${songMinutos}:${songSegundos
    .toString()
    .padStart(2, "0")}`;

  const tempoPercorrido = Math.floor(
    (audio.currentTime / audio.duration) * 100
  );

  progressoDoTempo.style.width = ` ${tempoPercorrido}%`;
});

// Barra de progresso

barraDeTempo.addEventListener("click", (event) => {
  const larguraDaBarra = parseInt(window.getComputedStyle(barraDeTempo).width);
  const ondeFoiClicado = event.offsetX;
  const porcDetd = Math.floor((ondeFoiClicado / larguraDaBarra) * 100);

  progressoDoTempo.style.width = ` ${porcDetd}%`;

  audio.currentTime = Math.floor((porcDetd * audio.duration) / 100);
});

// começar de novo o audio

audio.addEventListener("ended", () => {
  pauseButton.style.display = "none";
  playButton.style.display = "none";
  restartButton.style.display = "block";
});

restartButton.addEventListener("click", () => {
  playButton.style.display = "block";
  restartButton.style.display = "none";
  audio.play();
});
