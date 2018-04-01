const GAME = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload : preload,
  create  : create,
  update  : update
});

let paddle1, paddle2;

function preload() {
  GAME.load.image('paddle', 'assets/paddle.png');
}

function create() {
  paddle1 = createPaddle(0, GAME.world.centerY);
  paddle2 = createPaddle(GAME.world.width - 16, GAME.world.centerY);
}

function update() {
  controlPaddle(paddle1, GAME.input.y);
}

function createPaddle(x, y) {
  let paddle = GAME.add.sprite(x, y, 'paddle');
  paddle.anchor.setTo(0.5, 0.5);
  GAME.physics.arcade.enable(paddle);
  paddle.body.collideWorldBounds = true;

  return paddle;
}

function controlPaddle(paddle, y) {
  paddle.y = y;

  if (paddle.y < paddle.height / 2) {
    paddle.y = paddle.height / 2;
  } else if (paddle.y > GAME.world.height - paddle.height / 2) {
    paddle.y = GAME.world.height - paddle.height / 2;
  }
}
