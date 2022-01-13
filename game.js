const wrap = document.getElementById("wrap");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = 600;
const height = 800;
canvas.width = width;
canvas.height = height;



const PLAYER_SIZE = 20;
const PLAYER_SPEED = 1.5;

const PLAYER_SHOOTDELAY = 15
const BULLET_SPEED = 6;
const BULLET_SIZE = 4;

const EXHAUST_SIZE = 3;


var keysDown = [];
let inGame = false;// по умолчанию не в игре фолс
let inMenu = true;// по умолчанию в меню тру
// let progressToGame = 0;
let speed = PLAYER_SPEED;
let numDuts = 10;
let dusts = [];//пыль
let bullets = [];//пули
let exhausts = [];//выхлоп от игрока
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

    this.alive = true;
    this.hasControl = false;
    this.flyingOnScreen = true;
    this.gunLoaded = 0;

    this.speedBoost = 0;
    this.bulletBoost = 0;
    this.immortalBoost = 0;
    this.actualSpeedBoost = 1;//можно задать скорость жестко или удалить вообще и из hasControl

    this.update = function () {
        exhausts.push(new Exhaust(this.pos.x, this.pos.y + 10));
        if (this.flyingOnScreen) {
            this.pos.y -= 1;
            this.immortalBoost = 0;
            if (this.pos.y <= canvas.height - 100) {
                this.hasControl = true;
                this.flyingOnScreen = false;
            }

        } else {
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

            if (this.gunLoaded > 0) this.gunLoaded--;
            else this.gunLoaded = 0;


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
    ctx.rect(0, 0, canvas.width, 55);
    ctx.fillStyle = "grey";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(0, canvas.height - 20, canvas.width, 0);
    ctx.fillStyle = "grey";
    ctx.fill();

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