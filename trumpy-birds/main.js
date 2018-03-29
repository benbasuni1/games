let menuState = {
  preload : function() {
    game.load.audio('theme', './assets/theme.wav');
  },
  create: function() {
    this.themeSound = game.add.audio('theme');
    this.themeSound.play();
    let nameLabel = game.add.text(100, 200, 'Trumpy Birds', {
      font: '50px Arial',
      fill: '#ffffff'
    });

    let startLabel = game.add.text(90, game.world.height - 80, 'Press the Space Bar to start', {
      font: '25px Arial',
      fill: '#ffffff'
    });

    let start = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    start.onDown.addOnce(this.startGame, this);
  },

  startGame: function() {
    this.themeSound.stop();
    setTimeout(() => game.state.start('play'), 100);
  },
};

let playState = {
  score: 0,
  preload     : function() { 
    game.load.audio('theme', './assets/theme.wav');
    game.load.audio('jump', './assets/jump.wav');
    game.load.audio('lost', './assets/lost.wav');
    game.load.image('bird', './assets/duck.png')
    game.load.image('pipe', './assets/brick-wall.png')
    game.load.image('background', './assets/donald-trump.png')
  },

  update      : function() { 
    if (this.bird.angle < 20) this.bird.angle += 1;
    if (this.bird.y < 0 || this.bird.y > 490)  this.restartGame(); 
    game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
  },

  hitPipe: function() {
    if (!this.bird.alive) return;
    this.bird.alive = false;
    game.time.events.remove(this.timer);
    this.themeSound.stop();
    this.lostSound.play();
    this.pipes.forEach(function(p) {
      p.body.velocity.x = 0;
    }, this);
  },

  jump        : function() { 
    if (!this.bird.alive) return;
    this.bird.body.velocity.y = -350; 
    game.add.tween(this.bird).to({angle: -20}, 100).start();
    this.jumpSound.play();
  },

  restartGame : function() { 
    game.state.start('gameOver'); 
  },

  addOnePipe: function(x, y) {
    var pipe = game.add.sprite(x, y, 'pipe');
    this.pipes.add(pipe);
    game.physics.arcade.enable(pipe);
    pipe.body.velocity.x  = -300;
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill  = true;
  },

  addRowOfPipes: function() {
    var hole = Math.floor(Math.random() * 3) + 1;
    for (var i = 0; i < 10; i++) {
      if (i != hole && i != hole + 1) this.addOnePipe(500, i * 60 + 10);
    }
    this.score++;
    this.labelScore.text = this.score;
  },
  create : function() {
    this.themeSound = game.add.audio('theme');
    this.jumpSound = game.add.audio('jump');
    this.lostSound = game.add.audio('lost');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.background = this.game.add.tileSprite(0, 0, 400, 300, 'background');
    this.background = this.game.add.sprite(0, 0, 'background');
    this.bird = game.add.sprite(50, 100, 'bird');
    game.physics.arcade.enable(this.bird);
    this.bird.anchor.setTo(-0.2, 0.5);
    this.bird.body.gravity.y = 1000;
    let spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);
    this.pipes = game.add.group();
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
    this.score = -1;
    this.labelScore = game.add.text(20, 20, "0", {
      font : "30px Arial", 
      fill : "black"
    });
    this.themeSound.play();
  },
}

let gameOverState = {
  create: function() {
    let gameOverLabel = game.add.text(80, 80, `GAME OVER\n\nScore: ${(playState.score < 1) ? 0 : playState.score}`, {
      font: '50px Arial',
      fill: '#ffffff'
    });

    let startLabel = game.add.text(80, game.world.height - 80, 'Press the Spacebar to Restart', {
      font: '25px Arial',
      fill: '#ffffff'
    });

    let restart = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    restart.onDown.addOnce(this.restart, this);
  },

  restart: function() { game.state.start('play'); },
}

let game = new Phaser.Game(500, 600);

game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('gameOver', gameOverState);

game.state.start('menu');


