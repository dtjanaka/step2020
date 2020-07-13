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
    'pfp_gwc.jpg',
    'pfp_mer.jpg',
    'pfp_terra.jpg',
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

/**
 * Reset tic-tac-toe board.
 */
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
async function updateComments(profile) {
  let numCom = document.getElementById('num-comments');
  let numComments = numCom.options[numCom.selectedIndex].text;
  let howSort = document.getElementById('sort-type');
  let sortType = howSort.options[howSort.selectedIndex].value;
  let trLang = document.getElementById('lang-comments');
  let newLang = trLang.options[trLang.selectedIndex].value;

  let url =
    '/comments?' +
    'numComments=' +
    numComments +
    '&sortType=' +
    sortType +
    '&profile=' +
    profile +
    '&lang=' +
    newLang;

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
    commentContainer.appendChild(createPElement(msg[numComment].comment));
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
 * Creates a <p> element containing text.
 */
function createPElement(text) {
  const pElement = document.createElement('p');
  pElement.innerText = text;
  return pElement;
}

/**
 * Callback to render reCAPTCHA.
 */
function onloadCallback() {
  grecaptcha.render('recaptcha', {
    sitekey: '6LcBoK8ZAAAAADiONXD5MJKnevKoPu3-tifMOeaM',
  });
}

/**
 * Only submit if a reCAPTCHA response was received.
 */
function verifyRecaptcha() {
  if (grecaptcha.getResponse().length !== 0) {
    document.getElementById('comment-form').submit();
  } else {
    alert('Please verify you are human!');
  }
}

/**
 * Create login or logout button.
 *
 * @param type  0 for login, 1 for logout
 * @param url   link for login/logout
 */
function createLoginLogout(type, url) {
  let link = document.createElement('a');
  link.href = url;
  let buttonElement = document.createElement('button');
  buttonElement.classList.add('center', 'misc-button');
  buttonElement.innerText = type ? 'Logout' : 'Login';
  link.appendChild(buttonElement);
  return link;
}

/**
 * Runs when the body of comments page loads.
 * Either displays login button or full comments page and logout button.
 */
async function onloadComments(profile) {
  const response = await fetch('/login-status');
  const result = await response.json();
  if (result.loggedIn) {
    document.getElementById('comments-logged-in').style.display = 'initial';
    document
      .getElementById('login-logout')
      .appendChild(createLoginLogout(1, result.url));
    updateComments(profile);
  } else {
    document
      .getElementById('login-logout')
      .appendChild(createLoginLogout(0, result.url));
  }
}
