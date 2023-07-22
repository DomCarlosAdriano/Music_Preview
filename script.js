const form = document.querySelector("#form");
const searchInput = document.querySelector("#search");
const songsContainer = document.querySelector("#songs-container");
const precAndNextContainer = document.querySelector("#prev-and-next-container");

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

// INSERIR A MUSICA

songsContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const indice = event.target.getAttribute("data-indice-song");
    const audio = dadosArry.data[indice].preview;
    const capa = dadosArry.data[indice].album.cover;
    const nameSong = dadosArry.data[indice].title;
    const artistName = dadosArry.data[indice].artist.name;

    songsContainer.innerHTML = `
    <li class="song-preview">
    <img
      src="${capa}"
      alt="capa da musica"
    />
    <span class="player-songName"> <strong>${artistName}</strong> - ${nameSong}  </span>
    <audio controls>
      <source
        src="${audio}"
        type="audio/mpeg"
      />
    </audio>
  </li>`;

    precAndNextContainer.innerHTML = `<button class="btn" onclick="paginaAnterior()">Voltar</button> `;
  }
});

// VOLTAR A PAGINA ANTERIOR AO PLAY

function paginaAnterior() {
  insertSongsIntoPage(dadosArry);
}
