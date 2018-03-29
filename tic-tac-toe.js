const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var boardInit = `
     |     |
  1  |  2  |  3
------------------
     |     |
  4  |  5  |  6
------------------
     |     |
  7  |  8  |  9
`;

let printIntro = () => {
  console.log('\nWelcome to Tic Tac Toe!');
  console.log(boardInit);
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
}

let setup = (player1, board, num, places) => {
  if (player1) board = (board === '') ? boardInit.replace(num, '0') : board.replace(num, '0');
  else board         = (board === '') ? boardInit.replace(num, 'X') : board.replace(num, 'X');
  places[num]        = player1;
  console.log(board);

  return board;
}

let game = () => {
  var gameActive = true;
  var player1    = true;
  var board      = '';
  var places     = {};
  var endMessage = null;
  var validPlay  = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  printIntro();
  process.stdin.on('keypress', (str, key) => {
    if (validPlay.includes(str)) {
      board   = setup(player1, board, str, places);
      player1 = !player1;
    } else console.log(' Please select an appropriate number');
    for (var keys in places) {
      if ((places['1'] && places['5'] && places['9']) || (places['3'] && places['5'] && places['7']) || 
          (places['1'] && places['2'] && places['3']) || (places['4'] && places['5'] && places['6']) ||
          (places['7'] && places['8'] && places['9']) || (places['1'] && places['4'] && places['7']) ||
          (places['2'] && places['5'] && places['8']) || (places['3'] && places['6'] && places['9'])) 
        endMessage = 'Player 1 Wins!';

      if ((places['1'] === false && places['5'] === false && places['9'] === false) || (places['3'] === false && places['5'] === false && places['7'] === false) || 
          (places['1'] === false && places['2'] === false && places['3'] === false) || (places['4'] === false && places['5'] === false && places['6'] === false) ||
          (places['7'] === false && places['8'] === false && places['9'] === false) || (places['1'] === false && places['4'] === false && places['7'] === false) ||
          (places['2'] === false && places['5'] === false && places['8'] === false) || (places['3'] === false && places['6'] === false && places['9'] === false)) 
        endMessage = 'Player 2 Wins!';
    }
    if (endMessage) {
      console.log(endMessage);
      console.log('\nWould you like to play again? (Y/n)');
      process.stdin.on('keypress', (str, key) => {
        if (str === 'y') {
          endMessage = null;
          places     = {};
          game();
        } else if (str === 'n') process.exit();
      });
    }
  });

  return;
}

game();
