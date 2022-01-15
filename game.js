const wrap = document.getElementById("wrap");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = 500;
const height = 500;
canvas.width = width;
canvas.height = height;



const PLAYER_SIZE = 20;
const PLAYER_SPEED = 1.5;
const PLAYER_HEALTH = 3;
const START_WAVE = 1;
const START_SPEED = 1;
const MAX_SPEED = 4;

const PLAYER_SHOOTDELAY = 15
const BULLET_SPEED = 6;
const BULLET_SIZE = 4;

const EXHAUST_SIZE = 3;

const UI_HEART_SIZE = 30;
const UI_POWERUP_SIZE = 0.025;
const UI_POWERUP_ADJUST = 0.0125;

let keysDown = [];
let inGame = false;// по умолчанию не в игре фолс
let inMenu = true;// по умолчанию в меню тру
let displayWave = 0;
let score = 0;
// let progressToGame = 0;
let speed = PLAYER_SPEED;
let numDuts = 10;
let dusts = [];//пыль
let bullets = [];//пули
let exhausts = [];//выхлоп от игрока
let player1;
let curWave = 0;//текущая волна
let startWave = false;//начинаем с неволны
let aliens = []; //создаем массив для врагов

let tex_player1 = new Image();
tex_player1.src = "player1.png";
let tex_alien1 = new Image();
tex_alien1.src = "alien1.png";
let tex_alien2 = new Image();
tex_alien2.src = "alien2.png";
let tex_alien3 = new Image();
tex_alien3.src = "alien3.png";
let tex_alien4 = new Image();
tex_alien4.src = "alien4.png";
let tex_alien5 = new Image();
tex_alien5.src = "alien5.png";
let tex_heart1 = new Image();
tex_heart1.src = "heart1.png";

//создаем массив волн врагов
let waves = [
    [1, 1],
    [1, 1, 0, 0],
    [2, 2, 2, 2, 2],
    [1, 0, 0, 2, 2],
    [1, 1, 0, 0, 2, 4, 4],
    [3, 3, 3, 3, 3, 3],
    [1, 1, 0, 0, 0, 0, 2, 4, 4, 3, 3]
]


// Alien Patterns (0 up, 1 down, 2 left, 3 right, 4 shoot, 5 delay)
let pattern_1 = [
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 4, 5, 1, 1, 1, 1
];
let pattern_2 = [
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5, 4, 5, 4, 5, 4, 5, 5, 5
];
let pattern_3 = [
    1, 1, 1, 1, 2, 1, 1, 1, 1, 3
];
let pattern_4 = [
    1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 2, 4, 2, 4, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2
];
let pattern_5 = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 2, 2, 2, 2, 2
];

// Alien Types - 0 normal / 1 longranged / 2 kamakazi / 3 small fighter / 4 heavybomber
//определяем все показатели врагов(здоровье, скорость, размеры, скорость стрельбы, очки, действие)
let alienSprites = [tex_alien1, tex_alien2, tex_alien3, tex_alien4, tex_alien5];
let alienHealths = [4, 3, 2, 1, 10];
let alienSpeeds = [1.5, 1, 2, 3, 0.5];
let alienSizes = [25, 40, 20, 20, 35];
let alienBulletSpeeds = [2, 4, 0, 2.5, 1.5];
let alienValues = [100, 150, 50, 100, 300];
let alienPatterns = [pattern_1, pattern_2, pattern_3, pattern_4, pattern_5];


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
    wrap.append(btnStart);
    wrap.append(btnRules);
    wrap.append(btnScore);
    rule.remove();
    btnMainMenu.remove();
}

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
    this.shootKey = 32;
    this.playerNum = 1;

    this.health = PLAYER_HEALTH;
    this.die = false;
    this.hasControl = false;
    this.flyingOnScreen = true;
    this.gunLoaded = 0;

    this.speedBoost = 0;
    this.bulletBoost = 0;
    // this.immortalBoost = 0;
    this.actualSpeedBoost = 1;//можно задать скорость жестко или удалить вообще и из hasControl

    this.update = function () {
        exhausts.push(new Exhaust(this.pos.x, this.pos.y + 10));
        if (this.flyingOnScreen) {
            this.pos.y -= 1;
            // this.immortalBoost = 55;
            if (this.pos.y <= canvas.height - 100) {
                this.hasControl = true;
                this.flyingOnScreen = false;
            }
        } else {
            for (let i = 0; i < bullets.length; i++) {//попадание пули
                if (bullets[i].speed < 0) {
                    if (Math.abs(this.pos.x - bullets[i].pos.x) < PLAYER_SIZE / 1.5 &&
                        Math.abs(this.pos.y - bullets[i].pos.y) < PLAYER_SIZE / 1.5) {
                        this.health--;
                        bullets[i].destroy();
                    }
                }
            }
            // столкновение с пришельцем
            for (let i = 0; i < aliens.length; i++) {
                if (Math.abs(this.pos.x - aliens[i].pos.x) < (PLAYER_SIZE + aliens[i].size) / 2 &&
                    Math.abs(this.pos.y - aliens[i].pos.y) < (PLAYER_SIZE + aliens[i].size) / 2) {
                    this.health--;
                    aliens[i].destroy();
                }
            }
            //границ слева по х
            if (this.pos.x < PLAYER_SIZE) {
                this.pos.x = PLAYER_SIZE;
            }
            //граница справа по х
            if (this.pos.x + PLAYER_SIZE > canvas.width) {
                this.pos.x = canvas.width - PLAYER_SIZE;
            }
            //граница по y низ
            if (this.pos.y > canvas.height - 10 - PLAYER_SIZE) {
                this.pos.y = canvas.height - 10 - PLAYER_SIZE;
            }
            //граница по y вверх
            if (this.pos.y < PLAYER_SIZE + 55) {
                this.pos.y = PLAYER_SIZE + 55;
            }
            //пули
            if (this.gunLoaded > 0) {
                this.gunLoaded--;
            } else {
                this.gunLoaded = 0;
            }
            if (this.health <= 0) {
                this.death();
            }
            if (this.hasControl) {
                // Apply powerup effects// изменение скорости при получении улучшения
                // if (this.speedBoost > 0) {
                //     this.actualSpeedBoost = 1.75;
                // } else {
                //     this.actualSpeedBoost = 1;
                // }

                if (this.bulletBoost > 0) this.actualBulletBoost = 0.5;
                else this.actualBulletBoost = 1;
                // передвижение
                if (keysDown[this.upKey]) {
                    this.pos.y -= PLAYER_SPEED * this.actualSpeedBoost;
                } else if (keysDown[this.downKey]) {
                    this.pos.y += PLAYER_SPEED * this.actualSpeedBoost;
                }
                if (keysDown[this.leftKey]) {
                    this.pos.x -= PLAYER_SPEED * this.actualSpeedBoost;
                }
                if (keysDown[this.rightKey]) {
                    this.pos.x += PLAYER_SPEED * this.actualSpeedBoost;
                }
                if (keysDown[this.shootKey] && this.gunLoaded == 0) {
                    bullets.push(new Bullet(this.pos.x, this.pos.y, BULLET_SPEED));
                    this.gunLoaded = PLAYER_SHOOTDELAY * this.actualBulletBoost;
                }
            }
        }
    }
    this.draw = function () {
        // if (this.alive) {
        ctx.drawImage(
            this.sprite,
            this.pos.x - PLAYER_SIZE / 2,
            this.pos.y - PLAYER_SIZE / 2,
            PLAYER_SIZE,
            PLAYER_SIZE);
        // }
    }
    this.death = function () {
        // this.alive = false;
        this.die = true;
        this.hasControl = false;
        this.speedBoost = 0;
        this.bulletBoost = 0;

        this.pos.x = (Math.random() * canvas.width / 2) + canvas.width / 4;
        this.pos.y = canvas.height;
    }
}
//функция конструктор пуль
function Bullet(x, y, _speed) {
    this.pos = { x, y };
    this.speed = _speed;
    //движение пули
    this.update = function () {
        this.pos.y -= this.speed;
        if (this.pos.y < 55 || this.pos.y > canvas.height) {/////////условие уничтожения пули вверху и внизу
            this.destroy()
        }
    }
    //рисуем пули
    this.draw = function () {
        ctx.fillRect(
            this.pos.x - BULLET_SIZE / 2,
            this.pos.y - BULLET_SIZE / 2,
            BULLET_SIZE, BULLET_SIZE);
    }
    //////уничтожаем пули
    this.destroy = function () {
        this.index = bullets.indexOf(this);
        bullets.splice(this.index, 1);
    }
}
function Alien(x, y, _type) {
    this.pos = { x, y };
    this.type = _type; // номер волны начинается с 1

    if (this.type == 1) {//координаты начала движения врагов 1
        this.pos.x = -((Math.random() * 250) + 20);
        this.pos.y = (Math.random() * 100) + 100;
        if (Math.random() > 0.5) {
            this.pos.x = canvas.width - this.pos.x;//???????????????????????????????????????????????????????????????
        }
    }
    this.sprite = alienSprites[this.type];
    this.health = alienHealths[this.type];
    this.speed = alienSpeeds[this.type];
    this.size = alienSizes[this.type];
    this.bulletSpeed = alienBulletSpeeds[this.type];
    this.pattern = alienPatterns[this.type];

    this.stepInPattern = Math.floor(Math.random() * this.pattern.length * 10);
    this.dir = 1;//отталкивание врагов от стен
    this.firedShot = false;

    this.update = function () {
        //попадание пули во врага
        for (let i = 0; i < bullets.length; i++) {
            if (bullets[i].speed > 0) {
                if (Math.abs(this.pos.x - bullets[i].pos.x) < this.size / 1.5 &&
                    Math.abs(this.pos.y - bullets[i].pos.y) < this.size / 1.5) {

                    this.health--;//уменьшаем здоровье
                    bullets[i].destroy();//чистим пули
                }
            }
        }
        // Checks health
        if (this.health <= 0) {
            this.destroy()
        };
        // Вернуться к началу, если дошел до низа
        if (this.pos.y > canvas.height - 15) {
            this.pos.x = Math.random() * (canvas.width - 100) + 50;
            this.pos.y = 55;
        }

        //Повторно увеличивает шаблон (меняется каждые 10 кадров)
        this.stepInPattern++;
        if (this.stepInPattern > this.pattern.length * 10) {
            this.stepInPattern = 0;
        }

        // 1 пуля
        if (this.stepInPattern % 10 == 0) {
            this.firedShot = false;
        }

        if (this.pattern[Math.floor(this.stepInPattern / 10)] === 1) {
            this.pos.y += this.speed;
        } else if (this.pattern[Math.floor(this.stepInPattern / 10)] === 2) {
            this.pos.x -= this.speed * this.dir;
        } else if (this.pattern[Math.floor(this.stepInPattern / 10)] === 3) {
            this.pos.x += this.speed * this.dir;
        } else if (this.pattern[Math.floor(this.stepInPattern / 10)] === 4) {
            if (!this.firedShot) {
                bullets.push(new Bullet(this.pos.x, this.pos.y, -this.bulletSpeed));
                this.firedShot = true;
            }
        }


        // отталкивание врагов от стен
        if (this.pos.x < this.size)
            this.dir = -1;
        if (this.pos.x > canvas.width - this.size)
            this.dir = 1;

    }
    // Draws to frame
    this.draw = function () {
        ctx.drawImage(
            this.sprite,
            this.pos.x - this.size / 2,
            this.pos.y - this.size / 2 + 15,
            this.size,
            this.size);
    }
    this.destroy = function () {
        score += alienValues[this.type];
        this.index = aliens.indexOf(this);
        aliens.splice(this.index, 1);
    }

}
//функцмя звезды
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

function Exhaust(x, y) {
    this.pos = { x: x + Math.floor(Math.random() * 8) - 4, y };
    this.lifetime = Math.floor(Math.random() * 30);

    this.update = function () {
        //движение
        this.pos.x += (Math.random() * 2) - 1;
        this.pos.y += speed;

        this.lifetime--;
        if (this.lifetime <= 0) {
            this.index = exhausts.indexOf(this);
            exhausts.splice(this.index, 1);
        }

    }
    this.draw = function () {
        ctx.fillRect(
            this.pos.x - EXHAUST_SIZE / 2,
            this.pos.y - EXHAUST_SIZE / 2,
            EXHAUST_SIZE, EXHAUST_SIZE);

    }
}
//заполняем массив звездами
function setupGame() {
    progressToGame = 0;
    for (let i = 0; i < numDuts; i++) {
        dusts.push(new Dust());//в массив каждый раз добавляем
    }
}
//обновляем все
function update() {
    //обновляем звезды
    for (let i = 0; i < dusts.length; i++) {
        dusts[i].update();
    }
    //обновляем пули
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].update();
    }
    //обновляем выхлоп
    for (let i = 0; i < exhausts.length; i++) {
        exhausts[i].update();
    }
    if (inGame) {
        if (inMenu) {
            inMenu = false;
        }
        if (speed <= MAX_SPEED) speed += 0.02;
        player1.update();
        // Updates Aliens
        for (var i = 0; i < aliens.length; i++)
            aliens[i].update();
    } else {
        if (speed >= START_SPEED) speed -= 0.01;
    }
    // Updates wave
    if (inGame) {
        updateWave();
    }
    if (inGame && player1.die) {
        // clearInterval(interval)
        endGame();
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
    if (aliens.length == 0 && !inMenu) {//если врагов 0 и мы не в меню
        startWave = true;//флаг тру для волны
        curWave++; // добавлеям волну
    }
    if (startWave) {
        startWave = false;
        displayWave = 200;
        if (curWave <= waves.length) {//если текущая волна меньши длинны массива
            for (let i = 0; i < waves[curWave - 1].length; i++) { //пока i меньше длинны подмассива(кол-во врагов
                // в волне) 
                aliens.push(new Alien(
                    Math.random() * (canvas.width - 100) + 50,
                    55,
                    waves[curWave - 1][i]));//двумерный массив

            }
        }
    }
}

setupGame();
setInterval(update, 10);

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
    ctx.fillText("Wave " + curWave, 10, 35);

    ctx.fillStyle = "white";
    ctx.font = "35px Arial";
    if (displayWave > 0) {
        displayWave--;
        ctx.fillText("Wave " + curWave, canvas.width / 2.5, canvas.height / 2);
    }

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score " + score, canvas.width - 150, 35);

    	//Hearts
	for (let i = 0; i < player1.health; i++) {
		ctx.drawImage(
			tex_heart1,
			i * (UI_HEART_SIZE + 10) + 100,
			10,
			UI_HEART_SIZE,
			UI_HEART_SIZE);
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
    for (let i = 0; i < exhausts.length; i++) {
        exhausts[i].draw();
    }
    //враги
    for (let i = 0; i < aliens.length; i++) {
        aliens[i].draw();
    }

    player1.draw();
}
function endGame() {
    inGame = false;
    inMenu = true;
    aliens.splice(0);
    bullets.splice(0);
    exhausts.splice(0);
    player1 = null;
    backMenu();
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
    curWave = START_WAVE - 1;
    score = 0;
    btnStart.remove();
    btnRules.remove();
    btnScore.remove();
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
