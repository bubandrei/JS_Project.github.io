const wrap = document.getElementById("wrap");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = 600;
const height = 800;
canvas.width = width;
canvas.height = height;



const PLAYER_SIZE = 20;
const PLAYER_SPEED = 1.5;


var keysDown = [];
let inGame = false;// по умолчанию не в игре фолс
let inMenu = true;// по умолчанию в меню тру
// let progressToGame = 0;
let speed = PLAYER_SPEED;
let numDuts = 10;
let dusts = [];//пыль
let player1;

var tex_player1 = new Image();
tex_player1.src = "player1.png";



let btnStart = document.createElement("button");
btnStart.innerHTML = "Start Game";
btnStart.classList.add('btn')
btnStart.addEventListener('click', function () {
    if (inMenu) {
        startGame();
        inGame = true;
    }
});

let btnRules = document.createElement('button');
btnRules.innerHTML = "Rules";
btnRules.classList.add('btn', 'rules')
btnRules.addEventListener('click', readRules);
// btnRules.addEventListener('click', update)

let btnScore = document.createElement('button');
btnScore.innerHTML = "Score";
btnScore.classList.add('btn', 'score')

wrap.append(btnStart);
wrap.append(btnRules);
wrap.append(btnScore);

let rule = document.createElement('span');
rule.innerHTML = "STAR WARS online is cool space shooter! Take control on spaceship and protect Earth from alien swarms! Upgrade spacecraft and win galaxy battle.";
rule.classList.add('rule')

let btnMainMenu = document.createElement('button');
btnMainMenu.innerHTML = "Return";
btnMainMenu.classList.add('btn', 'score')
btnMainMenu.addEventListener('click', backMenu);
function backMenu() {
    setupGame();
    setInterval(update, 10);
    wrap.append(btnStart);
    wrap.append(btnRules);
    wrap.append(btnScore);
    rule.remove();
    btnMainMenu.remove();
}


// function Player(x, y, _sprite) {
//     this.pos = { x, y };
//     this.sprite = _sprite;

//     if (this.sprite == tex_player1) { this.upKey = 87; this.downKey = 83; this.leftKey = 65; this.rightKey = 68; this.shootKey = 87; this.playerNum = 1; }
//     else { this.upKey = 38; this.downKey = 40; this.leftKey = 37; this.rightKey = 39; this.shootKey = 38; this.playerNum = 2; }

//     // this.health = PLAYER_HEALTH;
//     this.alive = true;
//     this.hasControl = false;
//     this.flyingOnScreen = true;
//     this.gunLoaded = 0;

//     this.speedBoost = 0;
//     this.bulletBoost = 0;
//     this.immortalBoost = 0;

//     this.update = function () {
//         if (this.alive) {
//             // Exhaust
//             // exhausts.push(new Exhaust(this.pos.x, this.pos.y + 10));

//             // If flying into game
//             if (this.flyingOnScreen) {
//                 this.pos.y -= 2;
//                 this.immortalBoost = 50;
//                 if (this.pos.y <= canvas.height - 100) {
//                     this.hasControl = true;
//                     this.flyingOnScreen = false;
//                 }
//             }

//             // If in game
//             else {
//                 // Collisions from bullets
//                 // for (var i = 0; i < bullets.length; i++) {
//                 // 	if (bullets[i].speed < 0) {
//                 // 		if (Math.abs(this.pos.x - bullets[i].pos.x) < PLAYER_SIZE / 1.5 &&
//                 // 			Math.abs(this.pos.y - bullets[i].pos.y) < PLAYER_SIZE / 1.5) {
//                 // 			if (this.immortalBoost == 0)
//                 // 				this.health--;
//                 // 			else
//                 // 				for (var j = 0; j < NUM_DEBRIS; j++) debris.push(new Debris(this.pos.x, this.pos.y));

//                 // 			bullets[i].Destroy();
//                 // 		}
//                 // 	}
//                 // }

//                 // Collisions from aliens
//                 // for (var i = 0; i < aliens.length; i++) {
//                 // 	if (Math.abs(this.pos.x - aliens[i].pos.x) < (PLAYER_SIZE + aliens[i].size) / 2 &&
//                 // 		Math.abs(this.pos.y - aliens[i].pos.y) < (PLAYER_SIZE + aliens[i].size) / 2) {
//                 // 		if (this.immortalBoost == 0)
//                 // 			this.health = 0;
//                 // 		else
//                 // 			for (var j = 0; j < NUM_DEBRIS; j++) debris.push(new Debris(this.x, this.y));

//                 // 		aliens[i].Destroy();
//                 // 	}
//                 // }

//                 // Bondaries
//                 // if (this.pos.y < PLAYER_SIZE + 40) this.pos.y = PLAYER_SIZE + 40;
//                 // if (this.pos.y > canvas.height - PLAYER_SIZE - 50) this.pos.y = canvas.height - PLAYER_SIZE - 50;
//                 // if (this.pos.x < PLAYER_SIZE) this.pos.x = PLAYER_SIZE;
//                 // if (this.pos.x > canvas.width - PLAYER_SIZE) this.pos.x = canvas.width - PLAYER_SIZE;

//                 // Reload bullets
//                 // if (this.gunLoaded > 0) this.gunLoaded--;
//                 // else this.gunLoaded = 0;

//                 // Remove powerups
//                 // if (this.speedBoost > 0) this.speedBoost--;
//                 // else this.speedBoost = 0;

//                 // if (this.bulletBoost > 0) this.bulletBoost--;
//                 // else this.bulletBoost = 0;

//                 // if (this.immortalBoost > 0) this.immortalBoost -= 2;
//                 // else this.immortaltBoost = 0;

//                 // Checks health
//                 // if (this.health <= 0) this.Death();

//                 // Control
//                 if (this.hasControl) {

//                     // Apply powerup effects
//                     if (this.speedBoost > 0) this.actualSpeedBoost = 1.75;
//                     else this.actualSpeedBoost = 1;

//                     // if (this.bulletBoost > 0) this.actualBulletBoost = 0.5;

//                     // Moving
//                     if (keysDown[this.upKey]) this.pos.y -= PLAYER_SPEED * this.actualSpeedBoost;
//                     else if (keysDown[this.downKey]) this.pos.y += PLAYER_SPEED * this.actualSpeedBoost;
//                     if (keysDown[this.leftKey]) this.pos.x -= PLAYER_SPEED * this.actualSpeedBoost;
//                     if (keysDown[this.rightKey]) this.pos.x += PLAYER_SPEED * this.actualSpeedBoost;

//                     // Shooting
//                     // if (keysDown[this.shootKey] && this.gunLoaded == 0) {
//                     // 	bullets.push(new Bullet(this.pos.x, this.pos.y, BULLET_SPEED));
//                     // 	this.gunLoaded = PLAYER_SHOOTDELAY * this.actualBulletBoost;
//                     // }
//                 }
//             }
//         }
//     }

//     // Draws to frame
//     this.draw = function () {
//         // if (this.alive) {
//         // if (this.immortalBoost > 0) {
//         // 	ctx.beginPath();
//         // 	ctx.arc(this.pos.x, this.pos.y, PLAYER_SIZE, 0, 2 * Math.PI, false);
//         // 	ctx.fillStyle = "rgb(0,150,255)"; ctx.fill();
//         // 	ctx.lineWidth = 3; ctx.strokeStyle = "rgb(0,255,255)"; ctx.stroke();
//         // }

//         ctx.drawImage(
//             this.sprite,
//             this.pos.x - PLAYER_SIZE / 2,
//             this.pos.y - PLAYER_SIZE / 2,
//             PLAYER_SIZE,
//             PLAYER_SIZE);
//         // }
//     }
// }



//создаем звездное небо

function Player(x, y, sprite) {
    this.pos = { x, y };
    this.sprite = sprite;

    //         if (this.sprite == tex_player1) { this.upKey = 87; this.downKey = 83; this.leftKey = 65; this.rightKey = 68; this.shootKey = 87; this.playerNum = 1; }
    // else { this.upKey = 38; this.downKey = 40; this.leftKey = 37; this.rightKey = 39; this.shootKey = 38; this.playerNum = 2; }
    this.upKey = 87;
    this.downKey = 83;
    this.leftKey = 65;
    this.rightKey = 68;
    this.shootKey = 87;
    this.playerNum = 1;

    this.alive = true;
    this.hasControl = false;
    this.flyingOnScreen = true;

    this.speedBoost = 0;
    this.immortalBoost = 0;

    this.update = function () {
        if (this.flyingOnScreen) {
            this.pos.y -= 2;
            this.immortalBoost = 50;
            if (this.pos.y <= canvas.height - 100) {
                this.hasControl = true;
                this.flyingOnScreen = false;
            }
        } else {
            if (this.hasControl) {
                // Apply powerup effects
                if (this.speedBoost > 0) this.actualSpeedBoost = 1.75;
                else this.actualSpeedBoost = 1;
                // Moving
                if (keysDown[this.upKey]) this.pos.y -= PLAYER_SPEED * this.actualSpeedBoost;
                else if (keysDown[this.downKey]) this.pos.y += PLAYER_SPEED * this.actualSpeedBoost;
                if (keysDown[this.leftKey]) this.pos.x -= PLAYER_SPEED * this.actualSpeedBoost;
                if (keysDown[this.rightKey]) this.pos.x += PLAYER_SPEED * this.actualSpeedBoost;
            }
        }
    }
    this.draw = function () {
        if (this.alive) {
            ctx.drawImage(
                this.sprite,
                this.pos.x - PLAYER_SIZE / 2,
                this.pos.y - PLAYER_SIZE / 2,
                PLAYER_SIZE,
                PLAYER_SIZE);

        }
    }


}


function Dust() {
    this.pos = {
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height)
    };
    this.update = function () {
        this.pos.y += speed;
        if (this.pos.y > canvas.height + 10) {
            this.pos.x = Math.floor(Math.random() * canvas.width);
            this.pos.y = -10;
        }
    }
    this.draw = function () {
        ctx.fillRect(this.pos.x, this.pos.y, 1, 1);
    }
}

//заполняем массив звездами
function setupGame() {
    progressToGame = 0;
    for (let i = 0; i < numDuts; i++) {
        dusts.push(new Dust());
    }
}
//обновляем звезды
function update() {
    for (let i = 0; i < dusts.length; i++) {
        dusts[i].update();
    }
    if (inGame) {
        if (inMenu) {
            inMenu = false;
        }

        player1.update();
    } else {

    }
    draw()
}

function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dusts
    ctx.fillStyle = "white";
    for (let i = 0; i < dusts.length; i++) {
        dusts[i].draw();
    }
    //Borders
    ctx.fillStyle = "grey";
    ctx.beginPath();
    ctx.rect(0, 20, canvas.width, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(0, canvas.height, canvas.width, -4);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(0, 20, 4, canvas.height);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(canvas.width, 20, -4, canvas.height);
    ctx.fill();

    if (inMenu) {
        drawMenu();
    }
    //если в игре, то рисуем ui
    if (inGame) {
        drawUI()
    }
    //если в игре то рисуем игру
    if (inGame) {
        drawGame();
    }
}

setupGame();
setInterval(update, 10);

function drawMenu() {
    let shakingX = (Math.random() * 3) - 1.5;
    let shakingY = (Math.random() * 3) - 1.5;
    ctx.fillStyle = "orange";
    ctx.font = "50px Arial";
    ctx.fillText("STAR WARS", (canvas.width / 2 - 150) + shakingX, (97 - progressToGame) + shakingY);
    ctx.fillStyle = "orange";
    ctx.font = "50px Arial";
    ctx.fillText("STAR WARS", (canvas.width / 2 - 150) + shakingX, (100 - progressToGame) + shakingY);

    ctx.beginPath();
    ctx.rect((canvas.width / 2 - 135) + shakingX, (110 - progressToGame) + shakingY, 265, 10);
    ctx.fillStyle = "darkred";
    ctx.fill();
    ctx.beginPath();
    ctx.rect((canvas.width / 2 - 135) + shakingX, (115 - progressToGame) + shakingY, 265, 10);
    ctx.fillStyle = "orange";
    ctx.fill();

    ctx.fillStyle = "orange";
    ctx.font = "50px Arial";
    ctx.fillText("STAR WARS", (canvas.width / 2 - 150) + shakingX, (97 - progressToGame) + shakingY);

}

function drawUI() {
    ctx.beginPath();
    ctx.rect(0, 50, canvas.width, 5);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.beginPath();
    ctx.rect(0, -5, canvas.width, 55);
    ctx.fillStyle = "blue";
    ctx.fill();

}

function drawGame() {
    player1.draw();
}

function readRules() {
    btnStart.remove();
    btnRules.remove();
    btnScore.remove();
    wrap.append(rule);
    wrap.append(btnMainMenu);

}

function startGame() {
    player1 = new Player(150, canvas.height + 50, tex_player1);
    btnStart.remove();
    btnRules.remove();
    btnScore.remove();

    // inGame = true;

}







document.addEventListener("keydown", function (e) {
    // Stops scrolling with arrows and space bar
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)
        e.preventDefault();

    // If in menu
    // if (inMenu) {
    //     startGame();
    //     inGame = true;
    // }

    keysDown[e.keyCode] = true;
});
// // --- Keyboard Input (Up) ---
document.addEventListener("keyup", function (e) {
    keysDown[e.keyCode] = false;
});