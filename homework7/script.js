//информация о кнопках
var button, start, restart, new_player, record;

//информация о таблице
var game, table_record;

//смещение указателя
var transX, transY;

//проверка cостояния
var status_game;

//основное
var canvas, ctx, game_timer, pause;;

//фон и спрайты
var back = new Image(),
    one = new Image(),
    two = new Image(),
    three = new Image(),
    four = new Image();

back.src = 'new_wall.png';
one.src = 'dragon.png';
two.src = 'bul.png';
three.src = 'snake.png';
four.src = 'five.png';

//данные об игроке
var name = ''; //имя игрока
var score; //счёт
var health; //здоровья
var level;
var enemies = []; //враги
var bullets = []; //ядра

//объекты
var gun; //пушка
var angle; //начальный угол орудия
var draw_angle;

//cтираю данные после перезагрузки страницы
localStorage.clear();

//при загрузке страницы
function new_game() {
    check_name();
    init();
}

function check_name() {
    firstName = prompt('Введите свое имя:');
    if (Boolean(firstName)) {
        name = firstName;
        alert('Удачи, ' + firstName + '!');
    } else
        check_name();
}

function init() {
    button = 'game';
    canvas = document.getElementById('canvas');
    gun = new Gun;
    health = 5;
    level = 1;
    score = 0;
    angle = 45 * 180 / Math.PI;
    draw_angle = 45 * 180 / Math.PI;
    pause = 0;
    enemies = [];
    bullets = [];
    if (canvas.getContext) {
        drawBack();
        transX = canvas.getBoundingClientRect().left;
        transY = canvas.getBoundingClientRect().top;
    }
    start = document.getElementById('button_one');
    restart = document.getElementById('button_two');
    new_player = document.getElementById('button_three');
    record = document.getElementById('button_four');
    game = document.getElementById('game');
    table_record = document.getElementById('table_record');
    stoped = document.getElementById('button_five');
    status_game = false;
}

//рисую фон, информацию и остальное
function drawBack() {
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(back, 0, 0);
    draw_info();

    for (i = 0; i < bullets.length; i++)
        bullets[i].draw(ctx);

    for (i = 0; i < enemies.length; i++)
        enemies[i].draw(ctx);

    gun.draw(ctx);
}

function rotate(event) {
    if (status_game) {
        let dx = event.x - transX - 50;
        let dy = canvas.height + transY - event.y - 50;
        if (dy >= 0 && dx >= 0) {
            angle = Math.atan2(dy, dx);
            draw_angle = Math.atan2(dx, dy);
        }
    }
}

//продолжить играть
function start_play() {
    status_game = true;
    start.disabled = true;
    record.disabled = true;
    stoped.disabled = false;
    game_timer = setInterval(play, 1);
    return;
}

//пауза
function stop() {
    status_game = false;
    start.disabled = false;
    stoped.disabled = true;
    record.disabled = false;
    clearInterval(game_timer);
    return;
}

//кнопка рекордов
function records() {
    if (button == 'record') {
        button = 'game';
        start.disabled = false;
        restart.disabled = false;
        stoped.disabled = false;
        new_player.disabled = false;
        record.value = 'Records';
        table_record.style.display = 'none';
        game.style.display = 'block';
        return;
    }
    if (button == 'game') {
        button = 'record';
        start.disabled = true;
        restart.disabled = true;
        new_player.disabled = true;
        stoped.disabled = true;
        record.value = 'Back to game';
        table_record.style.display = 'block';
        game.style.display = 'none';
        fill_table();
        return;
    }
}

function clash(figure_one, figure_two) {
    check_one = false;
    check_two = false;
    if (figure_one.posX - figure_two.size / 2 <= figure_two.posX && figure_one.posX + figure_two.size / 2 >= figure_two.posX)
        check_one = true;
    if (figure_one.posY - figure_two.size / 2 <= figure_two.posY && figure_one.posY + figure_two.size / 2 >= figure_two.posY)
        check_two = true;
    return check_one && check_two;
}

function play() {
    if (health > 0) {
        drawBack(ctx, canvas.width, canvas.height);
        pause += 1;
        level = score / 200 + 1;

        //удаляю пулю, если она ушла за правый край экрана
        for (i = 0; i < bullets.length; i++) {
            if (bullets[i].posX + bullets[i].size >= canvas.width)
                bullets.splice(i, 1);
        }

        //столкновение врага и пули
        for (i = 0; i < bullets.length; i++) {
            for (j = 0; j < enemies.length; j++) {
                if (clash(bullets[i], enemies[j])) {
                    score += enemies[j].points;
                    enemies.splice(j, 1);
                }
            }
        }

        //если враг ушел за левую сторону игра, но минус одно сердечко
        for (j = 0; j < enemies.length; j++) {
            if (enemies[j].posX <= 0) {
                enemies.splice(j, 1);
                health -= 1;
            }
        }

        for (j = 0; j < enemies.length; j++) {
            enemies[j].posX -= enemies[j].speed;
        }

        //генерация врагов
        while (enemies.length < 10)
            get_enemy();
    } else {
        end();
    }
}

//выстрел
function pop() {
    if (status_game && pause >= 150) {
        pause = 0;
        bullets.push(new Bullet(angle));
    }
}

//может выстретить два раза
function special() {
    if (status_game && score >= 200) {
        score = score - 200;
        bullets.push(new Bullet(angle, 20));
    }
}

//пушка
Gun = new Class({
    draw: function(ctx) {
        with(this) {
            //рисую верх пушки
            ctx.save();
            ctx.translate(50, canvas.height - 50);
            ctx.rotate(draw_angle);
            ctx.fillStyle = '#FEFEE7';
            ctx.beginPath();
            ctx.arc(0, 0, 35, 2 * Math.PI, Math.PI, false);
            ctx.moveTo(15 - 50, 0);
            ctx.lineTo(30 - 50, 0 - 65);
            ctx.lineTo(70 - 50, 0 - 65);
            ctx.lineTo(85 - 50, 0);
            ctx.lineTo(15 - 50, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            //рисую низ
            ctx.save();
            ctx.fillStyle = '#8E44AD';
            ctx.beginPath();
            //бортик
            ctx.moveTo(0, canvas.height);
            ctx.lineTo(20, canvas.height - 20);
            ctx.lineTo(80, canvas.height - 20);
            ctx.lineTo(100, canvas.height);
            ctx.lineTo(0, canvas.height);
            //сужающийся низ
            ctx.moveTo(20, canvas.height);
            ctx.lineTo(20, canvas.height - 30);
            ctx.lineTo(80, canvas.height - 30);
            ctx.lineTo(80, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }
})

function random_color() {
    return 'rgb(' + Math.floor(Math.random() * 256) + ',' +
        Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';

}

Bullet = new Class({
    initialize: function(angle, pS = 5) {
        this.posX = 0;
        this.posY = 0;
        this.speed = 26;
        this.size = pS;
        this.angle = angle;
    },
    fly: function() {
        pos_one = this.posX * Math.tan(this.angle);
        pos_two = 0.4 * (this.posX ** 2);
        pos_three = 2 * (this.speed ** 2) * (Math.cos(this.angle) ** 2);
        this.posY = pos_one - (pos_two / pos_three);
        this.posX += this.speed * Math.cos(this.angle) / 5;
    },
    draw: function(ctx) {
        ctx.fillStyle = random_color();
        ctx.save();
        ctx.translate(50, canvas.height - 50);
        ctx.beginPath();
        ctx.arc(this.posX, -this.posY, this.size + 10, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        this.fly();
    }
})

all_enemies = [{
    points: 1,
    img: one
}, {
    points: 5,
    img: two
}, {
    points: 10,
    img: three
}, {
    points: 15,
    img: four
}]


function random_speed(level) {
    return (level + Math.random() * 3) / 5;
}

function random_size() {
    return 150 + Math.random() * 70;
}


Enemy = new Class({
    initialize: function(pX, pY, pP, pI) {
        this.posX = pX;
        this.posY = pY;
        this.size = random_size();
        this.speed = random_speed(level);
        this.points = pP;
        this.img = pI;
    },

    draw: function(ctx) {
        ctx.drawImage(this.img, this.posX - this.size / 2, canvas.height - this.posY - this.size / 2, this.size, this.size);
    },
})

//выбираем рандомного врага
function get_enemy() {
    x_pos = canvas.width + 70 + Math.floor(Math.random() * 1000);
    y_pos = 100 + Math.floor(Math.random() * (canvas.height - 200));
    random_enemy = all_enemies[Math.floor(Math.random() * 4)];
    enemies.push(new Enemy(x_pos, y_pos, random_enemy.points, random_enemy.img));
}

//информация
function draw_info() {
    ctx.fillStyle = '#8E44AD';
    ctx.font = '30px Lucida Sans';
    ctx.fillText(get_health(), 10, 40);
    ctx.font = '30px Lucida Sans';
    ctx.fillText('score: ' + score, 15, 70);
}


function get_health() {
    string = '';
    i = 0;
    while (i++ < health)
        string = string + '❤';
    while (i++ <= 5)
        string = string + '♡';
    return string;
}

function fill_table() {
    let table = '<table id=\'set\'><th>nickname:</th><th>points:</th>';
    for (let i = 0; i < localStorage.length && i < 15; i++) {
        table += '<tr aling=\'center\'>';
        for (let j = 0; j < 1; j++) {
            let key = localStorage.key(i)
            table += '<td>' + localStorage.key(i) + '</td>';
            table += '<td>' + localStorage.getItem(key) + '</td>'
        }
        table += '</tr>';
    }
    table += '</table>';

    document.getElementById('top').innerHTML = table;
}