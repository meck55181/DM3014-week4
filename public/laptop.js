let socket;
let input = { dx: 0, dy: 0 };
let player = { x: 50, y: 0, vy: 0, w: 30, h: 30 };
let playerImg;
let backgroundImg;
let gravity = 0.6;
let ground = 760;
let speed = 4;
let platform1;
let platform2;
let platform3;
let platform4;
let platform5;
let connected = false;

function preload() {
  playerImg = loadImage('pearl-earring.png');
  backgroundImg = loadImage('girl-with-pearl-earring.png');
}

function setup() {
  createCanvas(600, 800);

  platform1 = new Platform(150, 650, 50, 10);
  platform2 = new Platform(240, 600, 50, 10);
  platform3 = new Platform(300, 550, 50, 10);
  platform4 = new Platform(350, 500, 50, 10);
  platform5 = new Platform(380, 400, 50, 10);

  socket = io();

  socket.on('connect', () => {
    connected = true;
    document.getElementById('status').textContent = 'phone connected — waiting for input';
  });

  socket.on('control', (data) => {
    document.getElementById('status').textContent = 'receiving input from phone';
    if (typeof data.dx === 'number') input.dx = data.dx;
    if (typeof data.dy === 'number') input.dy = data.dy;
    if (data.jump) doJump();
  });
}

function draw() {
  background(20);

  //background image(Girl with a Pearl Earring)
  image(backgroundImg, 30, 50, backgroundImg.width * 0.5, backgroundImg.height * 0.5);

  player.x += input.dx * speed;
  player.x = constrain(player.x, 0, width - player.w);

  player.vy += gravity;
  player.y += player.vy;

  if (player.y + player.h > ground) {
    player.y = ground - player.h;
    player.vy = 0;
  }

  fill(20);
  rect(0, ground, width, height - ground);

  platform1.display();
  platform1.checkLanding(player);
  platform2.display();
  platform2.checkLanding(player);
  platform3.display();
  platform3.checkLanding(player);
  platform4.display();
  platform4.checkLanding(player);
  platform5.display();
  platform5.checkLanding(player);


  image(playerImg, player.x, player.y, player.w, player.h);

  // also allow keyboard for testing without a phone
  if (keyIsDown(LEFT_ARROW)) player.x -= speed;
  if (keyIsDown(RIGHT_ARROW)) player.x += speed;
}

function keyPressed() {
  if (key === ' ') doJump();
}

function doJump() {
  if (player.y + player.h >= ground || player.vy === 0) {
    player.vy = -12;
  }
}

// I added a Platform class to make it easier to create and manage multiple platforms. 
// Each platform has its own position and size, and the checkLanding method checks if the player is landing on that specific platform.
class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    fill("#6b7880");
    rect(this.x, this.y, this.w, this.h);
  }

  checkLanding(player) {
    let landing =
      player.x + player.w > this.x &&
      player.x < this.x + this.w &&
      player.y + player.h > this.y &&
      player.y + player.h < this.y + this.h + 10 &&
      player.vy >= 0;

    if (landing) {
      player.y = this.y - player.h;
      player.vy = 0;
    }
  }
}