// Keep track of Xs and Os in each row, column, and diagonal
// Top row, middle row, bottom row, L col, M col, R col,
// upper left to lower right diag, lower left to upper right diag
let xando = [
  [ 0, 0, 0, 0, 0, 0, 0, 0 ] /* Xs */,
  [ 0, 0, 0, 0, 0, 0, 0, 0 ] /* Os */,
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
  whichCell.onclick = null; // instead of disabling button, which greys out text

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
      document.getElementById(i).onclick = null;
    }
    document.getElementById('player-turn').innerText =
        'Player ' + (winner ? 'O' : 'X') + ' wins!';
    return;
  }

  let tied = true;

  for (let i = 1; i < 10; i++) {
    if (document.getElementById(i).onclick !== null) {
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
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  ];
  for (let i = 1; i < 10; i++) {
    document.getElementById(i).innerText = '';
    document.getElementById(i).onclick = function() { ticTacToe(i); };
    playerTurn = 0;
    document.getElementById('player-turn').innerText =
        'Player X, make your move.';
  }
}