const wrap = document.getElementById("wrap");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = 500;
const height = 500;
canvas.width = width;
canvas.height = height;

const playerSize = 30;
const playerSpeed = 1.5;
const playerHealth = 3;//количество жизней
const beginWave = 1;
const shotDelay = 25;//задержка выстрела
const shotSpeed = 3;
const bulletSpeed = 4;
const smokeSize = 3;
const heartSize = 30;

let keysDown = [];
let inGame = false;// по умолчанию не в игре фолс
let inMenu = true;// по умолчанию в меню тру
let displayWave = 0;
let score = 0;
let speed = 2;
let numStars = 50;//количество звезд
let stars = [];//звезды
let bullets = [];//пули
let smoke = [];//выхлоп от игрока
let player;
let currentWave = 0;//текущая волна
let startWave = false;//начинаем с неволны
let enemies = []; //создаем массив для врагов

let spritePlayer = new Image();
spritePlayer.src = "assets/img/shuttle.png";
let enemies1 = new Image();
enemies1.src = "assets/img/enemy_1.png";
let enemies2 = new Image();
enemies2.src = "assets/img/enemy_2.png";
let enemies3 = new Image();
enemies3.src = "assets/img/enemy_3.png";
let enemies4 = new Image();
enemies4.src = "assets/img/enemy_4.png";
let enemies5 = new Image();
enemies5.src = "assets/img/enemy_5.png";
let heart = new Image();
heart.src = "assets/img/heart.png";

const startAudio = new Audio('assets/sound/bgmusic.mp3');
const bulletSound = new Audio('assets/sound/3.mp3');
const enemiesBulletSound = new Audio('assets/sound/2.mp3')
const hitPlayer = new Audio('assets/sound/explode1.mp3')
const hitTarget = new Audio('assets/sound/explode2.mp3')
const destroyPlayerSound = new Audio('assets/sound/explode.m4a')
startAudio.volume = 0.2;
bulletSound.volume = 0.4;
enemiesBulletSound.volume = 0.4;
hitTarget.volume = 0.4;


// типы врагов
//определяем все показатели врагов(здоровье, скорость, размеры, скорость стрельбы, очки, действие)
let enemiesSprites = [enemies1, enemies2, enemies3, enemies4, enemies5];
let enemiesHealths = [4, 3, 2, 1, 10];
let enemiesSpeeds = [1.5, 1, 2, 3, 0.5];
let enemiesSizes = [25, 40, 20, 20, 35];
let enemiesBulletSpeeds = [1, 3, 0, 2.5, 1.5];
let enemiesValues = [100, 150, 50, 100, 300];


//создаем массив волн врагов, можем делать любые волны
let waves = [
    [1, 1, 0],
    [1, 1, 0, 0, 2, 2],
    [2, 2, 2, 2, 1, 0, 0],
    [1, 0, 0, 2, 2, 3, 3],
    [1, 1, 0, 0, 2, 4, 4, 3, 3],
    [3, 3, 3, 3, 3, 3, 4, 2, 1],
    [1, 1, 0, 0, 0, 0, 2, 4, 4, 3, 3]
]


// 0 вверх, 1 вниз, 2 лево, 3 право, 4 выстрел, 5 задеркжа)
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
let enemiesPatterns = [moveEnemies, moveEnemies2, moveEnemies3, moveEnemies4, moveEnemies5];


const btnStart = document.createElement("button");
btnStart.innerHTML = "Start";
btnStart.classList.add('btn')
btnStart.addEventListener('click', function () {
    if (inMenu) {
        startGame();
        inGame = true;
    }
});

const btnRules = document.createElement('button');
btnRules.innerHTML = "Rules";
btnRules.classList.add('btn', 'rules')
btnRules.addEventListener('click', readRules);

const btnScore = document.createElement('button');
btnScore.innerHTML = "Score";
btnScore.classList.add('btn', 'score');

const showResult = document.getElementById('ajax');

wrap.append(btnStart);
wrap.append(btnRules);
wrap.append(btnScore);

const rule = document.createElement('span');
rule.innerHTML = "STAR WARS online is cool space shooter! Take control on spaceship and protect Earth from alien swarms!";
rule.classList.add('rule')

const btnMainMenu = document.createElement('button');
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
    gameover.remove();
}

//класс звездное небо
class Stars {
    constructor() {
        this.pos = {
            x: Math.floor(Math.random() * canvas.width),
            y: Math.floor(Math.random() * canvas.height)
        };
    }
        update() {
            this.pos.y += speed;
            if (this.pos.y > canvas.height + 10) {
                this.pos.x = Math.floor(Math.random() * canvas.width);
                this.pos.y = -10;
            }
        };
        draw() {
            ctx.fillRect(this.pos.x, this.pos.y, 1, 1);
        };
    
}
//заполняем массив звездами
function setupGame() {
    for (let i = 0; i < numStars; i++) {
        stars.push(new Stars());//в массив каждый раз добавляем
    }
    if (inMenu) {
        startAudio.play();
    }
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
        player.update();
        for (let i = 0; i < enemies.length; i++)
            enemies[i].update();
    } else {
    }
    // обновляем волны
    if (inGame) {
        updateWave();
    }
    if (inGame && player.die) {
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

    //границы
    ctx.fillStyle = "orange";
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
        } else {
            for (let i = 0; i < currentWave; i++) { //пока i меньше длинны подмассива(кол-во врагов
                // в волне) 
                enemies.push(new Enemie(
                    Math.random() * (canvas.width - 100) + 50,
                    55,
                    Math.floor(Math.random() * 5)));//двумерный массив
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
    ctx.fillStyle = "orange";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(0, canvas.height - 20, canvas.width, 0);
    ctx.fillStyle = "grey";
    ctx.fill();

    // номр волны
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Wave " + currentWave, 10, 35);

    ctx.fillStyle = "white";
    ctx.font = "35px Arial";
    if (displayWave > 0) {
        displayWave--;
        ctx.fillText("Wave " + currentWave, canvas.width / 2.5, canvas.height / 2);
    }

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score " + score, canvas.width - 150, 35);

    //жизнь
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
    saveResult();
    startAudio.pause();
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
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)
        e.preventDefault();
    keysDown[e.keyCode] = true;
});
document.addEventListener("keyup", function (e) {
    keysDown[e.keyCode] = false;
});



let allowPrompt = true;
window.onbeforeunload = WarnUser;
    function WarnUser()
    {
       if(allowPrompt)
       {
          event.returnValue = "You have made changes. They will be lost if you continue.";
       }
       else
       {
          allowPrompt = true;
       }
    }
