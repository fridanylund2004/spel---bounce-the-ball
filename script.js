var canvas = document.getElementById("myCanvas");

      var ctx = canvas.getContext("2d");
      var ballRadius = 8;
      var x = canvas.width / 2;
      var y = canvas.height - 30;
      var dx = 6;
      var dy = -6;
      var paddleHeight = 10;
      var paddleWidth = 75;
      var paddleX = (canvas.width - paddleWidth) / 2;
      var rightPressed = false;
      var leftPressed = false;
      var brickRowCount = 9;
      var brickColumnCount = 6;
      var brickWidth = 45;
      var brickHeight = 10;
      var brickPadding = 15;
      var brickOffsetTop = 30;
      var brickOffsetLeft = 30;
      var score = 0;
      var lives = 5;

      var bricks = [];
      for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }

      //dessa tangentknappar ska inte funka//
      document.addEventListener("keydown", keyDownHandler, false);
      document.addEventListener("keyup", keyUpHandler, false);
      document.addEventListener("mousemove", mouseMoveHandler, false);

      //när man trycker på knapparna höger eller vänster//
      function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
          rightPressed = true;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
          leftPressed = true;
        }
      }

      //när man släpper knapparna höger eller vänster//
      function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
          rightPressed = false;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
          leftPressed = false;
        }
      }

      //hur musen fungerar//
      function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
          paddleX = relativeX - paddleWidth / 2;
        }
      }

      //när alla bricks är borta vinner man//
      function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
          for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
              if (
                x > b.x &&
                x < b.x + brickWidth &&
                y > b.y &&
                y < b.y + brickHeight
              ) {
                dy = -dy;
                b.status = 0;
                score++;
                if (score == brickRowCount * brickColumnCount) {
                  alert("YOU WIN, CONGRATS!");
                  document.location.reload();
                }
              }
            }
          }
        }
      }

      //bollen ritas upp//
      function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }

      //paddle ritas upp//
      function drawPaddle() {
        ctx.beginPath();
        ctx.rect(
          paddleX,
          canvas.height - paddleHeight,
          paddleWidth,
          paddleHeight
        );
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }

      //bricks ritas upp//
      function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
          for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
              var brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
              var brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
              bricks[c][r].x = brickX;
              bricks[c][r].y = brickY;
              ctx.beginPath();
              ctx.rect(brickX, brickY, brickWidth, brickHeight);
              ctx.fillStyle = "#0095DD";
              ctx.fill();
              ctx.closePath();
            }
          }
        }
      }

      //score visas//
      function drawScore() {
        ctx.font = "20px Lato";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: " + score, 4, 20);
      }

      //liven visas//
      function drawLives() {
        ctx.font = "20px Lato";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
      }

      //om liven tar slut när bricks finns kvar, förlora//
      //när man förlorat ett liv ritas det upp igen med nya insträllningar//
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
          dx = -dx;
        }
        if (y + dy < ballRadius) {
          dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
          if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
          } else {
            lives--;
            if (!lives) {
              alert("GAME OVER");
              document.location.reload();
            } else {
              x = canvas.width / 2;
              y = canvas.height - 30;
              dx = 7;
              dy = -7;
              paddleX = (canvas.width - paddleWidth) / 2;
              paddleWidth = 50;
              ballRadius = 6;
            }
          }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
          paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
          paddleX -= 7;
        }

        x += dx;
        y += dy;
        requestAnimationFrame(draw);
      }

      draw();