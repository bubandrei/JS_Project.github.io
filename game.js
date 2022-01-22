const wrap = document.getElementById("wrap");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = 500;
const height = 500;
canvas.width = width;
canvas.height = height;

const playerSize = 20;
const playerSpeed = 1.5;
const playerHealth = 3;
const beginWave = 1;
// const START_SPEED = 1;
// const MAX_SPEED = 4;

const shotDelay = 50;
const shotSpeed = 3;
const bulletSpeed = 4;

const smokeSize = 3;

const heartSize = 30;
// const UI_POWERUP_SIZE = 0.025;
// const UI_POWERUP_ADJUST = 0.0125;

let keysDown = [];
let inGame = false;// по умолчанию не в игре фолс
let inMenu = true;// по умолчанию в меню тру
let displayWave = 0;
let score = 0;
let speed = playerSpeed;
let numStars = 10;
let stars = [];//пыль
let bullets = [];//пули
let smoke = [];//выхлоп от игрока
let player;
let currentWave = 0;//текущая волна
let startWave = false;//начинаем с неволны
let enemies = []; //создаем массив для врагов

let spritePlayer = new Image();
spritePlayer.src = "player1.png";
let enemies1 = new Image();
enemies1.src = "alien1.png";
let enemies2 = new Image();
enemies2.src = "alien2.png";
let enemies3 = new Image();
enemies3.src = "alien3.png";
let enemies4 = new Image();
enemies4.src = "alien4.png";
let enemies5 = new Image();
enemies5.src = "alien5.png";
let heart = new Image();
heart.src = "heart1.png";

const startAudio = new Audio('bgmusic.mp3');
startAudio.volume = 0.2;
const bulletSound = new Audio('3.mp3');
bulletSound.volume = 0.4;
const alienBulletSound = new Audio('2.mp3')
alienBulletSound.volume = 0.4;
const hitPlayer = new Audio('explode1.mp3')
const hitTarget = new Audio('explode2.mp3')
hitTarget.volume = 0.4;
const destroyPlayerSound = new Audio('explode.m4a')
//создаем массив волн врагов
let waves = [
    [1, 1, 0, 0],
    [1, 1, 0, 0, 2, 2],
    [2, 2, 2, 2, 2, 0, 0],
    [1, 0, 0, 2, 2, 3, 3],
    [1, 1, 0, 0, 2, 4, 4, 3, 3],
    [3, 3, 3, 3, 3, 3, 4, 2, 1],
    [1, 1, 0, 0, 0, 0, 2, 4, 4, 3, 3]
]


// Alien Patterns (0 up, 1 down, 2 left, 3 right, 4 shoot, 5 delay)
let moveEnemies = [
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 4, 5, 1, 1, 1, 1
];
let moveEnemies2 = [
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5, 4, 5, 4, 5, 4, 5, 5, 5
];
let moveEnemies3 = [
    1, 1, 1, 1, 2, 1, 1, 1, 1, 3
];
let moveEnemies4 = [
    1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 2, 4, 2, 4, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2
];
let moveEnemies5 = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 2, 2, 2, 2, 2
];

// Alien Types - 0 normal / 1 longranged / 2 kamakazi / 3 small fighter / 4 heavybomber
//определяем все показатели врагов(здоровье, скорость, размеры, скорость стрельбы, очки, действие)
let enemiesSprites = [enemies1, enemies2, enemies3, enemies4, enemies5];
let enemiesHealths = [4, 3, 2, 1, 10];
let enemiesSpeeds = [1.5, 1, 2, 3, 0.5];
let enemiesSizes = [25, 40, 20, 20, 35];
let enemiesBulletSpeeds = [1, 3, 0, 2.5, 1.5];
let enemiesValues = [100, 150, 50, 100, 300];
let enemiesPatterns = [moveEnemies, moveEnemies2, moveEnemies3, moveEnemies4, moveEnemies5];


let btnStart = document.createElement("button");
btnStart.innerHTML = "Start";
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
btnScore.classList.add('btn', 'score');
// btnScore.addEventListener('click', showScore);

const showResult = document.getElementById('ajax');

wrap.append(btnStart);
wrap.append(btnRules);
wrap.append(btnScore);

let rule = document.createElement('span');
rule.innerHTML = "STAR WARS online is cool space shooter! Take control on spaceship and protect Earth from alien swarms!";
rule.classList.add('rule')

let btnMainMenu = document.createElement('button');
btnMainMenu.innerHTML = "Return";
btnMainMenu.classList.add('btn', 'returnFromRule')
btnMainMenu.addEventListener('click', backMenu);
function backMenu() {
    setupGame();
    wrap.append(btnStart);
    wrap.append(btnRules);
    wrap.append(btnScore);
    rule.remove();
    btnMainMenu.remove();
    showList.remove();
    inputName.remove();
    saveName.remove();
    headerResult.remove();
}

//создаем звездное небо

// class Player {
//     constructor(x, y, sprite) {
//         this.pos = { x, y };
//         this.sprite = sprite;
//         this.upKey = 87;
//         this.downKey = 83;
//         this.leftKey = 65;
//         this.rightKey = 68;
//         this.shootKey = 32;
//         this.playerNum = 1;

//         this.health = playerHealth;
//         this.die = false;
//         this.control = false;
//         this.playerExitScreen = true;
//         this.gunLoaded = 0;

//         // this.speedBoost = 0;
//         // this.bulletBoost = 0;
//         // this.immortalBoost = 0;
//         // this.actualSpeedBoost = 1; //можно задать скорость жестко или удалить вообще и из hasControl

//         this.update = function () {
//             smoke.push(new Smoke(this.pos.x, this.pos.y + 10));
//             if (this.playerExitScreen) {
//                 this.pos.y -= 1;
//                 // this.immortalBoost = 55;
//                 if (this.pos.y <= canvas.height - 100) {
//                     this.control = true;
//                     this.playerExitScreen = false;
//                 }
//             } else {
//                 for (let i = 0; i < bullets.length; i++) { //попадание пули
//                     if (bullets[i].speed < 0) {
//                         if (Math.abs(this.pos.x - bullets[i].pos.x) < playerSize / 1.5 &&
//                             Math.abs(this.pos.y - bullets[i].pos.y) < playerSize / 1.5) {
//                             hitPlayer.play();
//                             this.health--;
//                             bullets[i].destroy();
//                         }
//                     }
//                 }
//                 // столкновение с пришельцем
//                 for (let i = 0; i < enemies.length; i++) {
//                     if (Math.abs(this.pos.x - enemies[i].pos.x) < (playerSize + enemies[i].size) / 2 &&
//                         Math.abs(this.pos.y - enemies[i].pos.y) < (playerSize + enemies[i].size) / 2) {
//                         this.health--;
//                         enemies[i].destroy();
//                     }
//                 }
//                 //границ слева по х
//                 if (this.pos.x < playerSize) {
//                     this.pos.x = playerSize;
//                 }
//                 //граница справа по х
//                 if (this.pos.x + playerSize > canvas.width) {
//                     this.pos.x = canvas.width - playerSize;
//                 }
//                 //граница по y низ
//                 if (this.pos.y > canvas.height - 10 - playerSize) {
//                     this.pos.y = canvas.height - 10 - playerSize;
//                 }
//                 //граница по y вверх
//                 if (this.pos.y < playerSize + 55) {
//                     this.pos.y = playerSize + 55;
//                 }
//                 //пули
//                 if (this.gunLoaded > 0) {
//                     this.gunLoaded--;
//                 } else {
//                     this.gunLoaded = 0;
//                 }
//                 if (this.health <= 0) {
//                     destroyPlayerSound.play();
//                     this.death();
//                 }
//                 if (this.control) {
//                     // Apply powerup effects// изменение скорости при получении улучшения
//                     // if (this.speedBoost > 0) {
//                     //     this.actualSpeedBoost = 1.75;
//                     // } else {
//                     //     this.actualSpeedBoost = 1;
//                     // }
//                     // if (this.bulletBoost > 0)
//                     //     this.actualBulletBoost = 0.5;
//                     // else
//                     //     this.actualBulletBoost = 1;
//                     // передвижение
//                     if (keysDown[this.upKey]) {
//                         this.pos.y -= playerSpeed;
//                     } else if (keysDown[this.downKey]) {
//                         this.pos.y += playerSpeed;
//                     }
//                     if (keysDown[this.leftKey]) {
//                         this.pos.x -= playerSpeed;
//                     }
//                     if (keysDown[this.rightKey]) {
//                         this.pos.x += playerSpeed;
//                     }
//                     if (keysDown[this.shootKey] && this.gunLoaded == 0) {
//                         bullets.push(new Bullet(this.pos.x, this.pos.y, shotSpeed));
//                         this.gunLoaded = shotDelay;
//                         // this.gunLoaded = PLAYER_SHOOTDELAY * this.actualBulletBoost;
//                         bulletSound.play();

//                     }
//                 }
//             }
//         };
//         this.draw = function () {
//             // if (this.alive) {
//             ctx.drawImage(
//                 this.sprite,
//                 this.pos.x - playerSize / 2,
//                 this.pos.y - playerSize / 2,
//                 playerSize,
//                 playerSize);
//             // }
//         };
//         this.death = function () {
//             // this.alive = false;
//             this.die = true;
//             this.hasControl = false;
//             this.speedBoost = 0;
//             this.bulletBoost = 0;

//             this.pos.x = (Math.random() * canvas.width / 2) + canvas.width / 4;
//             this.pos.y = canvas.height;

//             // bulletSound.pause();
//         };
//     }
// }
//функция конструктор пуль
// class Bullet {
//     constructor(x, y, speed) {
//         this.pos = { x, y };
//         this.speed = speed;
//         //движение пули
//         this.update = function () {
//             this.pos.y -= this.speed;
//             if (this.pos.y < 55 || this.pos.y > canvas.height) { /////////условие уничтожения пули вверху и внизу
//                 this.destroy();
//             }
//         };
//         //рисуем пули
//         this.draw = function () {
//             ctx.fillRect(
//                 this.pos.x - bulletSpeed / 2,
//                 this.pos.y - bulletSpeed / 2,
//                 bulletSpeed, bulletSpeed);
//         };
//         //////уничтожаем пули
//         this.destroy = function () {
//             this.index = bullets.indexOf(this);
//             bullets.splice(this.index, 1);
//         };
//     }
// }
// class Enemie {
//     constructor(x, y, type) {
//         this.pos = { x, y };
//         this.type = type; // номер волны начинается с 1

//         if (this.type == 1) { //координаты начала движения врагов 1
//             this.pos.x = -((Math.random() * 250) + 20);
//             this.pos.y = (Math.random() * 100) + 100;
//             if (Math.random() > 0.5) {
//                 this.pos.x = canvas.width - this.pos.x; //???????????????????????????????????????????????????????????????
//             }
//         }
//         this.sprite = enemiesSprites[this.type];
//         this.health = enemiesHealths[this.type];
//         this.speed = enemiesSpeeds[this.type];
//         this.size = enemiesSizes[this.type];
//         this.bulletSpeed = enemiesBulletSpeeds[this.type];
//         this.pattern = enemiesPatterns[this.type];

//         this.stepInPattern = Math.floor(Math.random() * this.pattern.length * 10);
//         this.changeDir = 1; //отталкивание врагов от стен
//         this.shoot = false;

//         this.update = function () {
//             //попадание пули во врага
//             for (let i = 0; i < bullets.length; i++) {
//                 if (bullets[i].speed > 0) {
//                     if (Math.abs(this.pos.x - bullets[i].pos.x) < this.size / 1.5 &&
//                         Math.abs(this.pos.y - bullets[i].pos.y) < this.size / 1.5) {
//                         hitTarget.play();
//                         this.health--; //уменьшаем здоровье
//                         bullets[i].destroy(); //чистим пули
//                     }
//                 }
//             }
//             // Checks health
//             if (this.health <= 0) {
//                 this.destroy();
//             };
//             // Вернуться к началу, если дошел до низа
//             if (this.pos.y > canvas.height - 15) {
//                 this.pos.x = Math.random() * (canvas.width - 100) + 50;
//                 this.pos.y = 55;
//             }

//             //Повторно увеличивает шаблон (меняется каждые 10 кадров)
//             this.stepInPattern++;
//             if (this.stepInPattern > this.pattern.length * 10) {
//                 this.stepInPattern = 0;
//             }

//             // 1 пуля
//             if (this.stepInPattern % 10 == 0) {
//                 this.shoot = false;
//             }

//             if (this.pattern[Math.floor(this.stepInPattern / 10)] === 1) {
//                 this.pos.y += this.speed;
//             } else if (this.pattern[Math.floor(this.stepInPattern / 10)] === 2) {
//                 this.pos.x -= this.speed * this.changeDir;
//             } else if (this.pattern[Math.floor(this.stepInPattern / 10)] === 3) {
//                 this.pos.x += this.speed * this.changeDir;
//             } else if (this.pattern[Math.floor(this.stepInPattern / 10)] === 4) {
//                 if (!this.shoot) {
//                     bullets.push(new Bullet(this.pos.x, this.pos.y, -this.bulletSpeed));
//                     this.shoot = true;
//                     alienBulletSound.play();
//                 }
//             }


//             // отталкивание врагов от стен
//             if (this.pos.x < this.size)
//                 this.changeDir = -1;
//             if (this.pos.x > canvas.width - this.size)
//                 this.changeDir = 1;

//         };
//         // Draws to frame
//         this.draw = function () {
//             ctx.drawImage(
//                 this.sprite,
//                 this.pos.x - this.size / 2,
//                 this.pos.y - this.size / 2 + 15,
//                 this.size,
//                 this.size);
//         };
//         this.destroy = function () {
//             score += enemiesValues[this.type];
//             this.index = enemies.indexOf(this);
//             enemies.splice(this.index, 1);
//         };

//     }
// }
//функцмя звезды
class Stars {
    constructor() {
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
        };
        this.draw = function () {
            ctx.fillRect(this.pos.x, this.pos.y, 1, 1);
        };
    }
}

// class Smoke {
//     constructor(x, y) {
//         this.pos = { x: x + Math.floor(Math.random() * 8) - 4, y };
//         this.lifetime = Math.floor(Math.random() * 30);

//         this.update = function () {
//             //движение
//             this.pos.x += (Math.random() * 2) - 1;
//             this.pos.y += speed;

//             this.lifetime--;
//             if (this.lifetime <= 0) {
//                 this.index = smoke.indexOf(this);
//                 smoke.splice(this.index, 1);
//             }

//         };
//         this.draw = function () {
//             ctx.fillRect(
//                 this.pos.x - smokeSize / 2,
//                 this.pos.y - smokeSize / 2,
//                 smokeSize, smokeSize);

//         };
//     }
// }
//заполняем массив звездами
function setupGame() {
    // progressToGame = 0;
    for (let i = 0; i < numStars; i++) {
        stars.push(new Stars());//в массив каждый раз добавляем
    }
    // if (inMenu) {
    //     startAudio.play();
    // }
}
//обновляем все
function update() {
    //обновляем звезды
    for (let i = 0; i < stars.length; i++) {
        stars[i].update();
    }
    //обновляем пули
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].update();
    }
    //обновляем выхлоп
    for (let i = 0; i < smoke.length; i++) {
        smoke[i].update();
    }
    if (inGame) {
        if (inMenu) {
            inMenu = false;
        }
        // if (speed <= MAX_SPEED) speed += 0.02;
        player.update();
        // Updates Aliens
        for (var i = 0; i < enemies.length; i++)
            enemies[i].update();
    } else {
        // if (speed >= START_SPEED) speed -= 0.01;
    }
    // Updates wave
    if (inGame) {
        updateWave();
    }
    if (inGame && player.die) {
        // clearInterval(interval)
        endGame();
    }
    draw()
}
function showScore() {
    showResult.style.display = 'block';
}

function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dusts
    ctx.fillStyle = "white";
    for (let i = 0; i < stars.length; i++) {
        stars[i].draw();
    }

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

    //Borders
    ctx.fillStyle = "grey";
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(0, canvas.height, canvas.width, -4);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(0, 0, 4, canvas.height);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(canvas.width, 0, -4, canvas.height);
    ctx.fill();


}
function updateWave() {
    if (enemies.length == 0 && !inMenu) {//если врагов 0 и мы не в меню
        startWave = true;//флаг тру для волны
        currentWave++; // добавлеям волну
    }
    if (startWave) {
        startWave = false;
        displayWave = 200;
        if (currentWave <= waves.length) {//если текущая волна меньши длинны массива
            for (let i = 0; i < waves[currentWave - 1].length; i++) { //пока i меньше длинны подмассива(кол-во врагов
                // в волне) 
                enemies.push(new Enemie(
                    Math.random() * (canvas.width - 100) + 50,
                    55,
                    waves[currentWave - 1][i]));//двумерный массив

            }
        }
    }
}

function drawMenu() {
    let shakingX = (Math.random() * 3) - 1.5;
    let shakingY = (Math.random() * 3) - 1.5;
    ctx.fillStyle = "orange";
    ctx.font = "50px Arial";
    ctx.fillText("STAR WARS", (canvas.width / 2 - 150) + shakingX, 97 + shakingY);
    ctx.fillStyle = "orange";
    ctx.font = "50px Arial";
    ctx.fillText("STAR WARS", (canvas.width / 2 - 150) + shakingX, 100 + shakingY);

    ctx.beginPath();
    ctx.rect((canvas.width / 2 - 135) + shakingX, 110 + shakingY, 265, 10);
    ctx.fillStyle = "darkred";
    ctx.fill();
    ctx.beginPath();
    ctx.rect((canvas.width / 2 - 135) + shakingX, 115 + shakingY, 265, 10);
    ctx.fillStyle = "orange";
    ctx.fill();

    ctx.fillStyle = "orange";
    ctx.font = "50px Arial";
    ctx.fillText("STAR WARS", (canvas.width / 2 - 150) + shakingX, 97 + shakingY);

}
function drawUI() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, 55);
    ctx.fillStyle = "grey";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(0, canvas.height - 20, canvas.width, 0);
    ctx.fillStyle = "grey";
    ctx.fill();

    // Wave Number
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Wave " + currentWave, 10, 35);

    ctx.fillStyle = "white";
    ctx.font = "35px Arial";
    if (displayWave > 0) {
        displayWave--;
        // console.log(displayWave)
        ctx.fillText("Wave " + currentWave, canvas.width / 2.5, canvas.height / 2);
    }

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score " + score, canvas.width - 150, 35);

    //Hearts
    for (let i = 0; i < player.health; i++) {
        ctx.drawImage(
            heart,
            i * (heartSize + 10) + 100,
            10,
            heartSize,
            heartSize);
    }
}
function drawGame() {
    //пули
    ctx.fillStyle = "white";
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].draw()
    }
    //выхлоп
    ctx.fillStyle = 'white';
    for (let i = 0; i < smoke.length; i++) {
        smoke[i].draw();
    }
    //враги
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw();
    }

    player.draw();
}
function endGame() {
    inGame = false;
    inMenu = true;
    enemies.splice(0);
    bullets.splice(0);
    smoke.splice(0);
    player = null;
    // backMenu();
    saveResult();
    startAudio.pause();
    // startAudio.load();
}
function readRules() {
    btnStart.remove();
    btnRules.remove();
    btnScore.remove();
    wrap.append(rule);
    wrap.append(btnMainMenu);

}
function startGame() {
    player = new Player(150, canvas.height + 50, spritePlayer);
    startAudio.load();
    startAudio.play();
    currentWave = beginWave - 1;
    score = 0;
    btnStart.remove();
    btnRules.remove();
    btnScore.remove();
}
setupGame();
setInterval(update, 10);
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
