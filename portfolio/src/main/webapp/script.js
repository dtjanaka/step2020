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
  ];

  // Pick a random quote.
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  // Add it to the page.
  const quoteContainer = document.getElementById('quote-container');
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

  // Pick random image.
  const img = images[Math.floor(Math.random() * images.length)];

  // Add it to the page.
  document.getElementById('pfp-link').href = '/images/' + img;
  document.getElementById('pfp').src = '/images/' + img;
}

let xando = [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]];

/**
 * Process tic-tac-toe game.
 */
function ticTacToe(cell) {
    const playerTurn = document.getElementById("player-turn").className;
    const whichCell = document.getElementById(cell);
    if (playerTurn === "0") {
        whichCell.innerText = "❌";
    }
    else {
        whichCell.innerText = "⭕";
    }
    whichCell.disabled = true;
    
    if (cell < 4) { xando[+playerTurn][0]++; }
    else if (cell < 7) { xando[+playerTurn][1]++; }
    else { xando[+playerTurn][2]++; }

    if (cell === 1 || cell === 4 || cell === 7) { xando[+playerTurn][3]++; }
    else if (cell === 2 || cell === 5 || cell === 8) { xando[+playerTurn][4]++; }
    else { xando[+playerTurn][5]++; }

    if (cell === 1 || cell === 5 || cell === 9) { xando[+playerTurn][6]++; }
    else if (cell === 3 || cell === 5 || cell === 7) { xando[+playerTurn][7]++; }

    let winner;

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 8; j++) {
            if (xando[i][j] >= 3) {
                winner = i;
            }
        }
    }

    if (winner !== undefined) {
        for (let i = 1; i < 10; i++) {
            document.getElementById(i).disabled = true;
        }
        document.getElementById("player-turn").innerText = "Player" + (winner ? "O" : "X") + " wins!";
        return;
    }

    document.getElementById("player-turn").className = +playerTurn ? "0" : "1";
    document.getElementById("player-turn").innerText = "Player " + (+playerTurn ? "X" : "O") + ", make your move.";
}
