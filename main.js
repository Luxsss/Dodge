let arr = []
let dot = document.getElementById("circle");
let computedStyle = getComputedStyle(dot);
let posY = parseInt(computedStyle.top);
let posX = parseInt(computedStyle.left);
let stopGame = false;
let speedShot = 500;
let speedFroze = false;
let scorePoint = 0;

// Add of the text Timer
let timerText = document.createElement("p");
timerText.classList.add("timer")
timerText.innerHTML = 3

// Change number of time before the game start
let inter1 = setInterval(() => {
    setTimeout(() => {
      clearInterval(inter1)
      document.body.removeChild(timerText);
    }, 2000);
    timerText.innerHTML -= 1
}, 1000);

document.body.appendChild(timerText);

// Timer of how long the user survive
let timer = 0;
let timerInterval = setInterval(() => {
  timer += 1;
}, 1000);

// Add points

let point = document.createElement("div")
point.classList.add("point")


function createPoint(){
  let posYRandom = Math.floor(Math.random() * (window.innerHeight - 5))
  let posXRandom = Math.floor(Math.random() * (window.innerHeight - 5))

  point.style.top = posYRandom + "px";
  point.style.left = posXRandom + "px";

  document.body.appendChild(point)
}

createPoint()

dot.addEventListener("click", () => {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);
  dot.style.backgroundColor = "#" + randomColor;
});

document.addEventListener("keydown", (e) => {
  if (!arr.includes(e.key)) {
    if(e.key === "ArrowUp" || e.key === "z" ) up()
    if(e.key === "ArrowLeft" || e.key === "q") left()
    if(e.key === "ArrowRight" || e.key === "d") right()
    if(e.key === "ArrowDown" || e.key === "s") down()
    arr.push(e.key)
  }
});

document.addEventListener("keyup", (e) => {
  arr = arr.filter(o => o !== e.key)
})

function up(){
  if (posY > 0) {
    posY -= 2.5;
    dot.style.top = posY + "px";
  }
  setTimeout(() => {
    if(arr.includes('ArrowUp') || arr.includes("z")) up()
  }, 10);
}

function left(){
  if(posX > 0){
    posX -= 2.5;
    dot.style.left = posX + "px";
  }
  setTimeout(() => {
    if(arr.includes('ArrowLeft') || arr.includes("q") ) left()
  }, 10);
}

function right(){
  let maxX = window.innerWidth - dot.offsetWidth;
  if (posX < maxX) {
    posX += 2.5;
    dot.style.left = posX + "px";
  }
  setTimeout(() => {
    if(arr.includes('ArrowRight') || arr.includes("d") ) right()
  }, 10);
}

function down(){
  let maxY = window.innerHeight - dot.offsetHeight;
  if (posY < maxY) {
    posY += 2.5;
    dot.style.top = posY + "px";
  }
  setTimeout(() => {
    if(arr.includes('ArrowDown') || arr.includes("s") ) down()
  }, 10);
}

class Shot {
  constructor(){
    this.shot = document.createElement("div")
    document.body.appendChild(this.shot)
    this.randomColor()
    this.randomSpeed()
    this.random()
    this.computedStyleShot = getComputedStyle(this.shot);
    this.moveShot()
  }

  randomColor(){
    let arrColors = ["#e41313", "#d8bf1f", "#31c42b", "#3295c7" ]
    let result = Math.floor(Math.random () * 4)
    this.colorShot = arrColors[result];
    this.shot.style.backgroundColor = this.colorShot
  }

  randomSpeed(){
    switch (this.colorShot) {
      case "#d8bf1f":
        this.bulletSpeed = 1.5
        break;
      case "#31c42b":
        this.bulletSpeed = 2
        break;
      case "#3295c7":
        this.bulletSpeed = 2.5
        break;

      default:
        this.bulletSpeed = 1
        break;
    }
  }

  random(){
    let result = Math.floor(Math.random() * 4) + 1
    switch (result) {
      case 1:
        this.shot.classList.add("shotY")
        this.posX = Math.random() * (window.innerWidth - 7)
        this.posY = -40
        this.shot.style.left = this.posX + "px";
        this.shot.style.top = this.posY + "px";
        this.direction = "up";
        break;
      case 2:
        this.shot.classList.add("shotX")
        this.posX = 0
        this.posY = Math.random() * (window.innerHeight - 7)
        this.shot.style.left = this.posX + "px";
        this.shot.style.top = this.posY + "px";
        this.direction = "left";
        break;
      case 3:
        this.shot.classList.add("shotX");
        this.posX = window.innerWidth - 40;
        this.posY = Math.random() * (window.innerHeight - 7);
        this.shot.style.left = this.posX + "px";
        this.shot.style.top = this.posY + "px";
        this.direction = "right";
        break;

      default:
        this.shot.classList.add("shotY")
        this.posX = Math.random() * (window.innerWidth - 7);
        this.posY = window.innerHeight - 40;
        this.shot.style.left = this.posX + "px";
        this.shot.style.top = this.posY + "px";
        this.direction = "down";
        break;
    }
  }

  moveShot(){
    const interval = setInterval(() => {
      if (stopGame) {
        clearInterval(interval);
        return;
      }

      switch (this.direction) {
        case "up":
          this.posY += this.bulletSpeed;
          this.shot.style.top = this.posY + "px"
          if(this.posY > window.innerHeight - 40){
            clearInterval(interval)
            document.body.removeChild(this.shot);

          }
        break;
        case "left":
          this.posX += this.bulletSpeed;
          this.shot.style.left = this.posX + "px"
          if(this.posX > window.innerWidth - 40){
            clearInterval(interval)
            document.body.removeChild(this.shot);
          }
        break;
        case "right":
          this.posX -= this.bulletSpeed;
          this.shot.style.left = this.posX + "px"
          if(this.posX < 0){
            clearInterval(interval)
            document.body.removeChild(this.shot);
          }
        break;
        default:
          this.posY -= this.bulletSpeed;
          this.shot.style.top = this.posY + "px"
          if(this.posY < 0){
            clearInterval(interval)
            document.body.removeChild(this.shot);
          }
        break;
      }
      if(this.checkCollisionPoint(dot, point)) {
        createPoint()
        scorePoint += 1;
      }
      if(this.checkCollision(dot, this.shot)) {
        dot.style.backgroundColor = "black"
        this.removeAllShots();
        stopGame = true; // stop shooting
        arr = [] // Reset all movement
        clearInterval(timerInterval)
        alert("Vous avez obtenu un score de : " + (timer + scorePoint) + "\nPS: Temps : " + timer + " Points : " + scorePoint )
        window.location.reload()
      }
    }, 1);
  }

  checkCollision(dot, shot) {
    const boxDot = dot.getBoundingClientRect();
    const boxShot = shot.getBoundingClientRect();

    return !(
      boxDot.top > boxShot.bottom ||
      boxDot.bottom < boxShot.top ||
      boxDot.left > boxShot.right ||
      boxDot.right < boxShot.left
    );
  }

  checkCollisionPoint(dot, point) {
    const boxDot = dot.getBoundingClientRect();
    const boxPoint = point.getBoundingClientRect();

    return !(
      boxDot.top > boxPoint.bottom ||
      boxDot.bottom < boxPoint.top ||
      boxDot.left > boxPoint.right ||
      boxDot.right < boxPoint.left
    );
  }

  removeAllShots() {
    const shotsY = document.querySelectorAll(".shotY");
    const shotsX = document.querySelectorAll(".shotX");

    shotsY.forEach(shot => {
      document.body.removeChild(shot);
    });
    shotsX.forEach(shot => {
      document.body.removeChild(shot);
    });
  }
}

setTimeout(() => {
  start(speedShot)
}, 3000);


function start(vitesse){
  if(!stopGame && vitesse >= 75 && vitesse <= 110){
    speedFroze = true
    setTimeout(() => {
      speedFroze = false
    }, 3000);
  }

  setTimeout(() => {
    if (!stopGame) {
      new Shot();
      if (speedShot > 70 && !speedFroze) {
        speedShot -= 5;
        start(speedShot)
      }else{
        start(speedShot)
      }
    }
  }, vitesse);
}
