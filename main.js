let arr = []
let dot = document.getElementById("circle");
let computedStyle = getComputedStyle(dot);
let posY = parseInt(computedStyle.top);
let posX = parseInt(computedStyle.left);
let stopGame = false;

let timer = 0;

let timerInterval = setInterval(() => {
  timer += 1;
}, 1000);

dot.addEventListener("click", () => {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);
  dot.style.backgroundColor = "#" + randomColor;
});

document.addEventListener("keydown", (e) => {
  if (!arr.includes(e.key)) {
    if(e.key === "ArrowUp") up()
    if(e.key === "ArrowLeft") left()
    if(e.key === "ArrowRight") right()
    if(e.key === "ArrowDown") down()
    arr.push(e.key)
  }
});

document.addEventListener("keyup", (e) => {
  arr = arr.filter(o => o !== e.key)
})

function up(){
  if (posY > 0) {
    posY -= 2;
    dot.style.top = posY + "px";
  }
  setTimeout(() => {
    if(arr.includes('ArrowUp')) up()
  }, 10);
}

function left(){
  if(posX > 0){
    posX -= 2;
    dot.style.left = posX + "px";
  }
  setTimeout(() => {
    if(arr.includes('ArrowLeft')) left()
  }, 10);
}

function right(){
  let maxX = window.innerWidth - dot.offsetWidth;
  if (posX < maxX) {
    posX += 2;
    dot.style.left = posX + "px";
  }
  setTimeout(() => {
    if(arr.includes('ArrowRight')) right()
  }, 10);
}

function down(){
  let maxY = window.innerHeight - dot.offsetHeight;
  if (posY < maxY) {
    posY += 2;
    dot.style.top = posY + "px";
  }
  setTimeout(() => {
    if(arr.includes('ArrowDown')) down()
  }, 10);
}

class Shot {
  constructor(){
    this.shot = document.createElement("div")
    document.body.appendChild(this.shot)
    this.random()
    this.computedStyleShot = getComputedStyle(this.shot);
    this.moveShot()
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
          this.posY += 1.5;
          this.shot.style.top = this.posY + "px"
          if(this.posY > window.innerHeight - 40){
            clearInterval(interval)
            document.body.removeChild(this.shot);

          }
        break;
        case "left":
          this.posX += 1.5;
          this.shot.style.left = this.posX + "px"
          if(this.posX > window.innerWidth - 40){
            clearInterval(interval)
            document.body.removeChild(this.shot);
          }
        break;
        case "right":
          this.posX -= 1.5;
          this.shot.style.left = this.posX + "px"
          if(this.posX < 0){
            clearInterval(interval)
            document.body.removeChild(this.shot);
          }
        break;
        default:
          this.posY -= 1.5;
          this.shot.style.top = this.posY + "px"
          if(this.posY < 0){
            clearInterval(interval)
            document.body.removeChild(this.shot);
          }
        break;
      }
      if(this.checkCollision(dot, this.shot)) {
        dot.style.backgroundColor = "yellow"
        // this.removeAllShots();
        stopGame = true;
        clearInterval(timerInterval)
        alert("Vous avez tenu " + timer + " secondes")
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
  setInterval(() => {
    if (!stopGame) {
      new Shot();
    }
  }, 100);
}, 3000);

// new Shot()
