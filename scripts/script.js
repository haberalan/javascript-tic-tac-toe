// gameboard and checking for winner

const gameboard = (() => {
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  const checkWinner = () => {
    let winner = null;

    const equalsThreeCells = (one, two, three) => {
      return one == two && two == three && one != '';
    };

    for (let i = 0; i < 3; i++) {
      if (equalsThreeCells(gameboard.board[i][0], gameboard.board[i][1], gameboard.board[i][2])) {
        winner = gameboard.board[i][0];
      }
      if (equalsThreeCells(gameboard.board[0][i], gameboard.board[1][i], gameboard.board[2][i])) {
        winner = gameboard.board[0][i];
      }
    }

    if (equalsThreeCells(gameboard.board[0][0], gameboard.board[1][1], gameboard.board[2][2])) {
      winner = gameboard.board[0][0];
    }
    if (equalsThreeCells(gameboard.board[2][0], gameboard.board[1][1], gameboard.board[0][2])) {
      winner = gameboard.board[2][0];
    }

    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameboard.board[i][j] == '') {
          openSpots++;
        }
      }
    }

    if (winner == null && openSpots == 0) {
      return 'tie';
    } else {
      return winner;
    }
  };

  return { board, checkWinner };
})();

// game controller

const gameController = (() => {
  let currentPlayer = 'X';
  let isComputer = false;

  const move = (e) => {
    if (gameboard.board[e.target.id[0]][e.target.id[1]] == '') {
      if (isComputer) {
        if (currentPlayer === 'X') {
          gameboard.board[e.target.id[0]][e.target.id[1]] = 'X';
          document.getElementById(e.target.id).textContent = 'X';
          document.getElementById(e.target.id).classList.remove('empty');
          currentPlayer = 'O';
          computerController.bestMove();
          end();
          currentPlayer = 'X';
        }
      } else {
        if (currentPlayer === 'X') {
          gameboard.board[e.target.id[0]][e.target.id[1]] = 'X';
          document.getElementById(e.target.id).textContent = 'X';
          document.getElementById(e.target.id).classList.remove('empty');
          currentPlayer = 'O';
          document.querySelector('.main-game-controller-turn').innerText = `It is ${currentPlayer} turn!`;

          end();
        } else if (currentPlayer === 'O') {
          gameboard.board[e.target.id[0]][e.target.id[1]] = 'O';
          document.getElementById(e.target.id).textContent = 'O';
          document.getElementById(e.target.id).classList.remove('empty');
          currentPlayer = 'X';
          document.querySelector('.main-game-controller-turn').innerText = `It is ${currentPlayer} turn!`;

          end();
        }
      }
    }
  };

  const resetGame = () => {
    gameboard.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];

    document.querySelectorAll('.main-game-board-cell').forEach((e) => {
      e.textContent = '';
      e.classList.add('empty');
    });

    currentPlayer = 'X';

    document.querySelector('.main-game-controller-turn').textContent = '';
    document.querySelector('.backdrop-box-winner').textContent = '';
    document.querySelector('.backdrop').classList.remove('hidden');
  };

  const start = (status) => {
    resetGame();
    isComputer = status;
    document.querySelector('.backdrop').classList.toggle('hidden');
    if (!status) document.querySelector('.main-game-controller-turn').textContent = `It is ${currentPlayer} turn`;
    if (status) document.querySelector('.main-game-controller-turn').textContent = `You are playing against AI`;
  };

  const end = () => {
    switch (gameboard.checkWinner()) {
      case null: {
        break;
      }
      case 'tie': {
        document.querySelector('.backdrop').classList.remove('hidden');
        document.querySelector('.main-game-controller-turn').textContent = '';
        document.querySelector('.backdrop-box-winner').textContent = 'Tie!';
        break;
      }
      case 'X': {
        document.querySelector('.backdrop').classList.remove('hidden');
        document.querySelector('.main-game-controller-turn').textContent = '';
        document.querySelector('.backdrop-box-winner').textContent = 'Player X won!';
        break;
      }
      case 'O': {
        document.querySelector('.backdrop').classList.remove('hidden');
        document.querySelector('.main-game-controller-turn').textContent = '';
        document.querySelector('.backdrop-box-winner').textContent = 'Player O won!';
        break;
      }
    }
  };

  return { start, move, resetGame, end };
})();

const computerController = (() => {
  const bestMove = () => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameboard.board[i][j] == '') {
          gameboard.board[i][j] = 'O';
          let score = minimax(gameboard.board, 0, false);
          gameboard.board[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    gameController.end();
    gameboard.board[move.i][move.j] = 'O';
    document.getElementById(move.i + '' + move.j).innerText = 'O';
    document.getElementById(move.i + '' + move.j).classList.remove('empty');
  };

  let scores = {
    O: 10,
    X: -10,
    tie: 0,
  };

  const minimax = (board, depth, isMaximizing) => {
    let result = gameboard.checkWinner();
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = 'O';
            let score = minimax(board, depth + 1, false);
            board[i][j] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = 'X';
            let score = minimax(board, depth + 1, true);
            board[i][j] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  };

  return { bestMove };
})();

document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('button')) {
    if (e.target.textContent === 'AI') gameController.start(true);
    if (e.target.textContent === 'Player') gameController.start(false);
  }
  if (e.target && e.target.classList.contains('main-game-board-cell')) {
    gameController.move(e);
  }
  if (e.target && e.target.classList.contains('main-game-controller-reset')) {
    gameController.resetGame();
  }
});
