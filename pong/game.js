const GAME = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload : preload,
  create  : create,
  update  : update
});

let paddle1, paddle2,
    ballLaunched, ballVelocity,
    score1Text, score2Text,
    score1, score2;

function preload() {
  GAME.load.image('paddle', 'assets/paddle.png');
  GAME.load.image('ball', 'assets/ball.png');

  GAME.load.bitmapFont('font', 'assets/font.png', 'assets/font.xml');

  GAME.load.audio('hit1', 'assets/coin1.wav');
  GAME.load.audio('hit2', 'assets/coin2.wav');
}

function create() {
  ballLaunched = false;
  ballVelocity = 400;

  paddle1 = createPaddle(0, GAME.world.centerY);
  paddle2 = createPaddle(GAME.world.width - 8, GAME.world.centerY);

  ball    = createBall(GAME.world.centerX, GAME.world.centerY);

  GAME.input.onDown.add(launchBall, this);

  /*score1Text = GAME.add.text(128, 128, '0', {
    font  : "64px Gabriella",
    fill  : "#ffffff",
    align : "center"
  });

  score2Text = GAME.add.text(GAME.world.width - 128, 128, '0', {
    font  : "64px Gabriella",
    fill  : "#ffffff",
    align : "center"
  });*/

  score1Text = GAME.add.bitmapText(128, 128, 'font', '0', 64);
  score2Text = GAME.add.bitmapText(GAME.world.width - 128, 128, 'font', '0', 64);

  score1 = 0;
  score2 = 0;
}

function update() {
  score1Text.text = score1;
  score2Text.text = score2;

  controlPaddle(paddle1, GAME.input.y);

  if (ball.body.blocked.left)
    score2++;
  else if (ball.body.blocked.right)
    score1++;

  paddle2.body.velocity.setTo(ball.body.velocity.y);
  paddle2.body.velocity.x = 0;
  paddle2.body.maxVelocity.y = 250;

  GAME.physics.arcade.collide(paddle1, ball, function() { GAME.sound.play('hit1') });
  GAME.physics.arcade.collide(paddle2, ball, function() { GAME.sound.play('hit2') });
}

function createPaddle(x, y) {
  let paddle = GAME.add.sprite(x, y, 'paddle');
  paddle.anchor.setTo(0.5, 0.5);
  GAME.physics.arcade.enable(paddle);
  paddle.body.collideWorldBounds = true;
  paddle.body.immovable = true;
  paddle.scale.setTo(0.5, 0.5);

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

function createBall(x, y) {
  let ball = GAME.add.sprite(x, y, 'ball');
  ball.anchor.setTo(0.5, 0.5);
  GAME.physics.arcade.enable(ball);
  ball.body.collideWorldBounds = true;
  ball.body.bounce.setTo(1, 1);

  return ball;
}

function launchBall() {
  if (ballLaunched) {
    ball.x = GAME.world.centerX;
    ball.y = GAME.world.centerY;
    ball.body.velocity.setTo(0, 0);
    ballLaunched = false;
  } else {
    ball.body.velocity.x = -ballVelocity;
    ball.body.velocity.y = ballVelocity;
    ballLaunched = true;
  }
}
