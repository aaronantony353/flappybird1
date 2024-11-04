const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOverScreen = document.getElementById("game-over");
const finalScoreText = document.getElementById("final-score");
const restartButton = document.getElementById("restart-btn");

// Bird properties
const bird = {
  x: 50,
  y: 150,
  width: 20,
  height: 20,
  gravity: 0.6,
  lift: -15,
  velocity: 0
};

let pipes = [];
const pipeWidth = 50;
const pipeGap = 120;
let pipeSpeed = 2;
let frameCount = 0;
let score = 0;
let gameOver = false;

// Restart the game on button click
restartButton.addEventListener("click", function () {
  resetGame();
  gameLoop();
});

// Bird control (flap on spacebar)
document.addEventListener("keydown", function(event) {
  if (event.code === "Space" && !gameOver) {
    bird.velocity = bird.lift;
  }
});

function gameLoop() {
  if (gameOver) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw bird
  drawBird();

  // Bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    endGame();
  }

  // Generate pipes
  if (frameCount % 100 === 0) {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
      x: canvas.width,
      top: pipeHeight,
      bottom: pipeHeight + pipeGap
    });
  }

  // Move and draw pipes
  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;
    drawPipe(pipe);

    // Collision detection
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipeWidth &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      endGame();
    }

    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score++;
    }
  });

  // Display score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  frameCount++;
  requestAnimationFrame(gameLoop);
}

function drawBird() {
  ctx.fillStyle = "#FFD700"; // Golden color
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  ctx.strokeStyle = "black";
  ctx.strokeRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(pipe) {
  ctx.fillStyle = "green";
  ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top); // Top pipe
  ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom); // Bottom pipe
}

function endGame() {
  gameOver = true;
  gameOverScreen.classList.remove("hidden");
  finalScoreText.textContent = score;
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  frameCount = 0;
  score = 0;
  gameOver = false;
  gameOverScreen.classList.add("hidden");
}

// Start game loop
gameLoop();
