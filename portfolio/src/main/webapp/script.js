// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random quote to the page.
 */
function addRandomPrequelQuote() {
  const quotes = [
    'Hello there.',
    'There’s always a bigger fish.',
    'I don’t like sand. It’s coarse and rough and irritating and it gets' +
      ' everywhere.',
    'Now this is podracing!',
    'I don’t care what universe you’re from, that’s got to hurt!',
    'I sense Count Dooku.',
    'His cells have the highest concentration of midi-chlorians I have' +
      ' seen in a life-form.',
    'I AM the Senate!',
    'I’m just a simple man, trying to make my way in the universe.',
    'This is getting out of hand! Now, there are two of them!',
  ];

  const quoteContainer = document.getElementById('content-container');

  // Pick a random different quote.
  let quote = quoteContainer.innerText;
  while (quote === quoteContainer.innerText) {
    quote = quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Add it to the page.
  quoteContainer.innerText = quote;
}

/**
 * Changes profile picture to random image.
 */

function changeProfilePic() {
  const images = [
    'IMG_1502.png',
    'pfp_fr.jpg',
    'pfp_eg.jpg',
    'pfp_gr.jpg',
    'pfp_in.jpg',
    'pfp_it.jpg',
    'pfp_mtr.jpg',
    'pfp_sol.jpg',
    'pfp_uk.jpg',
  ];

  // Pick random different image.
  imgElement = document.getElementById('pfp');
  let img = imgElement.src;
  while (img === imgElement.src) {
    img = images[Math.floor(Math.random() * images.length)];
    img = '/images/' + img;
  }

  // Add it to the page.
  document.getElementById('pfp-link').href = img;
  imgElement.src = img;
}

// Keep track of Xs and Os in each row, column, and diagonal
// Top row, middle row, bottom row, L col, M col, R col,
// upper left to lower right diag, lower left to upper right diag
let xando = [
  [0, 0, 0, 0, 0, 0, 0, 0] /* Xs */,
  [0, 0, 0, 0, 0, 0, 0, 0] /* Os */,
];
let playerTurn = 0;

/**
 * Process tic-tac-toe game.
 */
function ticTacToe(cell) {
  const whichCell = document.getElementById(cell);
  if (playerTurn === 0) {
    whichCell.innerText = '❌';
  } else {
    whichCell.innerText = '⭕';
  }
  whichCell.onclick = ''; // instead of disabling button, which greys out text

  const row = Math.floor((cell - 1) / 3);
  xando[playerTurn][row]++;

  const column = (cell - 1) % 3;
  xando[playerTurn][column + 3]++;

  if (row === column) {
    // upper left - lower right diag
    xando[playerTurn][6]++;
  }

  if (row + column === 2) {
    // lower left - upper right diag
    xando[playerTurn][7]++;
  }

  let winner;

  for (let player = 0; player < 2; player++) {
    for (let j = 0; j < 8; j++) {
      if (xando[player][j] >= 3) {
        winner = player;
      }
    }
  }

  if (winner !== undefined) {
    for (let i = 1; i < 10; i++) {
      document.getElementById(i).onclick = '';
    }
    document.getElementById('player-turn').innerText =
      'Player ' + (winner ? 'O' : 'X') + ' wins!';
    return;
  }

  let tied = true;

  for (let i = 1; i < 10; i++) {
    if (document.getElementById(i).onclick !== '') {
      tied = false;
    }
  }

  if (tied) {
    document.getElementById('player-turn').innerText = 'Draw! No winner.';
  } else {
    document.getElementById('player-turn').innerText =
      'Player ' + (playerTurn ? 'X' : 'O') + ', make your move.';
    playerTurn = +!playerTurn;
  }
}

function resetTicTacToe() {
  xando = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  for (let i = 1; i < 10; i++) {
    document.getElementById(i).innerText = '';
    document.getElementById(i).onclick = function () {
      ticTacToe(i);
    };
    playerTurn = 0;
    document.getElementById('player-turn').innerText =
      'Player X, make your move.';
  }
}

/**
 * Fetch content from data servlet and place in container.
 */
async function updateComments() {
  let numCom = document.getElementById('num-comments');
  let numComments = numCom.options[numCom.selectedIndex].text;
  let howSort = document.getElementById('sort-type');
  let sortType = howSort.options[howSort.selectedIndex].value;

  let url =
    '/comments?' + 'numComments=' + numComments + '&sortType=' + sortType;

  const response = await fetch(url);
  const msg = await response.json();

  const commentContainer = document.getElementById('content-container');

  commentContainer.innerHTML = '';

  for (let numComment = 0; numComment < msg.length; numComment++) {
    commentContainer.appendChild(
      createNameElement(
        msg[numComment].name,
        msg[numComment].date,
        msg[numComment].time
      )
    );
    commentContainer.appendChild(createCommentElement(msg[numComment].comment));
  }
}

/**
 * Creates a <h3> element containing commenter name.
 */
function createNameElement(name, date, time) {
  const h3Element = document.createElement('h3');
  h3Element.innerText = name;
  h3Element.className = 'commenter-name';
  const pElement = document.createElement('p');
  pElement.innerText = date + ' at ' + time + ' GMT'; //TODO: display time in local timezone
  pElement.className = 'commenter-time';
  divElement = document.createElement('div');
  divElement.appendChild(h3Element);
  divElement.appendChild(pElement);
  return divElement;
}

/**
 * Creates a <p> element containing comment.
 */
function createCommentElement(text) {
  const pElement = document.createElement('p');
  pElement.innerText = text;
  return pElement;
}

function onloadCallback() {
  grecaptcha.render('recaptcha', {
    sitekey: '6LdVqqsZAAAAALmVvlgvJIg8fA8dBuu4n_x1Uz6y',
  });
}

function verifyRecaptcha() {
  if (grecaptcha.getResponse().length !== 0) {
    document.getElementById('comment-form').submit();
  } else {
    alert('Please verify you are human!');
  }
}

async function deleteData() {
  const request = new Request('/delete-data', { method: 'POST' });
  const response = await fetch(request);
  updateComments();
}

/** 
 * Creates a map and adds it to the page.
 */
function createMap() {
  const map = new google.maps.Map(
      document.getElementById('map'),
      {
        center: {lat: 37.42341667, lng: -121.97611111}, 
        zoom: 20
      });
  const GRTStartMarker = new google.maps.Marker({
    position: {lat: 37.423404, lng: -121.975947},
    map: map,
    title: 'Beginning of the Guadalupe River Trail'
  });

  // Coordinates from Directions API
  // https://maps.googleapis.com/maps/api/directions/json?origin=37.423404,-121.975947&destination=37.400976,-121.941955&avoid=highways&mode=bicycling&key=AIzaSyD1Z43pgCsowhu2vY_ue5MasPUST6TDiew
  const GRTCoordinates = [
    {lat: 37.423404, lng: -121.975947},
    {lat: 37.42328, lng: -121.97517},
    {lat: 37.42316, lng: -121.97415},
    {lat: 37.423, lng: -121.97298},
    {lat: 37.42282, lng: -121.97185},
    {lat: 37.42264, lng: -121.97118},
    {lat: 37.42244, lng: -121.97062},
    {lat: 37.42232, lng: -121.97037},
    {lat: 37.42219, lng: -121.97013},
    {lat: 37.4219, lng: -121.96966},
    {lat: 37.4216, lng: -121.96924},
    {lat: 37.42131, lng: -121.96889},
    {lat: 37.42088, lng: -121.96848},
    {lat: 37.42032, lng: -121.96805},
    {lat: 37.42007, lng: -121.96789},
    {lat: 37.41982, lng: -121.96779},
    {lat: 37.41938, lng: -121.96765},
    {lat: 37.41877, lng: -121.96746},
    {lat: 37.41864, lng: -121.96742},
    {lat: 37.41833, lng: -121.96734},
    {lat: 37.41795, lng: -121.96715},
    {lat: 37.41777, lng: -121.96701},
    {lat: 37.41773, lng: -121.96695},
    {lat: 37.41772, lng: -121.96691},
    {lat: 37.41713, lng: -121.9664},
    {lat: 37.41539, lng: -121.96485},
    {lat: 37.41429, lng: -121.96387},
    {lat: 37.41314, lng: -121.96288},
    {lat: 37.41165, lng: -121.96155},
    {lat: 37.41113, lng: -121.96112},
    {lat: 37.41104, lng: -121.96109},
    {lat: 37.41086, lng: -121.96095},
    {lat: 37.41051, lng: -121.9606},
    {lat: 37.41014, lng: -121.96018},
    {lat: 37.41007, lng: -121.96004},
    {lat: 37.41, lng: -121.95984},
    {lat: 37.40993, lng: -121.95959},
    {lat: 37.40973, lng: -121.95898},
    {lat: 37.40961, lng: -121.95853},
    {lat: 37.40924, lng: -121.95729},
    {lat: 37.40901, lng: -121.95665},
    {lat: 37.40869, lng: -121.95587},
    {lat: 37.4084, lng: -121.95525},
    {lat: 37.40825, lng: -121.95498},
    {lat: 37.40794, lng: -121.95446},
    {lat: 37.4075, lng: -121.95382},
    {lat: 37.40701, lng: -121.9532},
    {lat: 37.40658, lng: -121.95275},
    {lat: 37.40584, lng: -121.95212},
    {lat: 37.40564, lng: -121.952},
    {lat: 37.4053, lng: -121.9518},
    {lat: 37.40489, lng: -121.95146},
    {lat: 37.40464, lng: -121.95121},
    {lat: 37.40426, lng: -121.95072},
    {lat: 37.40426, lng: -121.95072},
    {lat: 37.40395, lng: -121.95017},
    {lat: 37.40369, lng: -121.94969},
    {lat: 37.40348, lng: -121.94936},
    {lat: 37.40331, lng: -121.94913},
    {lat: 37.40303, lng: -121.94878},
    {lat: 37.40245, lng: -121.9481},
    {lat: 37.40196, lng: -121.94748},
    {lat: 37.40173, lng: -121.94699},
    {lat: 37.40163, lng: -121.94674},
    {lat: 37.40148, lng: -121.94631},
    {lat: 37.40137, lng: -121.94588},
    {lat: 37.40127, lng: -121.94537},
    {lat: 37.40121, lng: -121.94475},
    {lat: 37.40121, lng: -121.94447},
    {lat: 37.40125, lng: -121.94399},
    {lat: 37.4013, lng: -121.94344},
    {lat: 37.4013, lng: -121.94313},
    {lat: 37.40128, lng: -121.94284},
    {lat: 37.4012, lng: -121.94247},
    {lat: 37.401, lng: -121.942},
    {lat: 37.40097, lng: -121.94195}
  ];

  console.log(GRTCoordinates);

  const GRTPath = new google.maps.Polyline({
    path: GRTCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  GRTPath.setMap(map);
}
