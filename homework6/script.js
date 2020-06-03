var canvas, ctx, figures, idTimer, speed = 1;

class Main_Figure {
    constructor(pX, pY) {
        this.posX = pX;
        this.posY = pY;
        this.color = this.constructor.random_color();
        this.size = this.constructor.random_size();
        this.course = Math.floor(Math.random() * 4);
    }
    static random_color() {
        return 'rgb(' + Math.floor(Math.random() * 256) + ',' +
            Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';

    }
    static random_size() {
        return 5 + Math.random() * 30;
    }

}

class Balls extends Main_Figure {
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.size, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
}

class Squares extends Main_Figure {
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.posX, this.posY);
        ctx.lineTo(this.posX + this.size, this.posY);
        ctx.lineTo(this.posX + this.size, this.posY + this.size);
        ctx.lineTo(this.posX, this.posY + this.size);
        ctx.lineTo(this.posX, this.posY);
        ctx.closePath();
        ctx.fill();
    }
}

class Triangle extends Main_Figure {
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.posX - this.size, this.posY + this.size);
        ctx.lineTo(this.posX + this.size, this.posY + this.size);
        ctx.lineTo(this.posX, this.posY - this.size);
        ctx.closePath();
        ctx.fill();
    }

}

function drawBack(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
}

var all_classes = [Balls, Squares, Triangle];

function random_figure() {
    return Math.floor(Math.random() * all_classes.length);
}

function random_coordinates(support) {
    return (10 + Math.floor(Math.random() * (support - 30)));
}

function init() {
    canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        drawBack(ctx, canvas.width, canvas.height);
        figures = [];
        for (var i = 1; i <= 20; i++) {
            var item = new all_classes[random_figure()](random_coordinates(canvas.width), random_coordinates(canvas.height));
            item.draw(ctx);
            figures.push(item);
        }
    }
}

function goInput(event) {
    var item = new all_classes[random_figure()](event.clientX, event.clientY);
    item.draw(ctx);
    figures.push(item);
}

all_courses = [
    function top(x, y) {
        x += Math.floor(Math.random()) - 1;
        y += Math.floor(Math.random()) - speed;
        return [x, y];
    },
    function bottom(x, y) {
        x += Math.floor(Math.random()) - 1;
        y += Math.floor(Math.random()) + speed;
        return [x, y];
    },
    function left(x, y) {
        x += Math.floor(Math.random()) - speed;
        y += Math.floor(Math.random()) - 1;
        return [x, y];
    },
    function right(x, y) {
        x += Math.floor(Math.random()) + speed;
        y += Math.floor(Math.random()) - 1;
        return [x, y];
    },
    function chaos(x, y) {
        return all_courses[Math.floor(Math.random() * 4)](x, y);
    }
]

function clash(figure_one, figure_two) {
    if (figure_one instanceof Balls && figure_two instanceof Balls) {
        let sum = figure_one.size + figure_two.size;
        return (Math.floor(Math.sqrt(Math.pow(figure_one.posX - figure_two.posX, 2) + Math.pow(figure_one.posY - figure_two.posY, 2))) <= sum);
    } else {
        check_one = false;
        check_two = false;
        if ((figure_one.posX + figure_one.size >= figure_two.posX) && (figure_one.posX <= figure_two.posX + figure_two.size)) {
            check_one = true;
        }
        if ((figure_one.posY + figure_one.size >= figure_two.posY) && (figure_one.posY <= figure_two.posY + figure_two.size)) {
            check_two = true;
        }
        return check_one && check_two;
    }
}

function move_figures(course) {
    drawBack(ctx, canvas.width, canvas.height);
    for (var i = 0; i < figures.length; i) {
        x = figures[i].posX;
        y = figures[i].posY;

        figures[i].size += 0.2;

        n = Number(document.getElementById('num').value);

        if (figures[i].size >= n) {
            figures.splice(i, 1);
            continue;
        }

        if (course == undefined) {
            [figures[i].posX, figures[i].posY] = all_courses[figures[i].course](x, y);
        } else
            [figures[i].posX, figures[i].posY] = all_courses[course](x, y);

        figures[i].draw(ctx);

        for (var j = 0; j < figures.length; j++) {
            if (i != j)
                if (clash(figures[i], figures[j])) {
                    figures.splice(i, 1);
                    figures.splice(j, 1);
                }
        }

        figures[i].draw(ctx);

        if ((x > canvas.width) || (x < 0) || (y < 0) || (y > canvas.height)) {
            figures.splice(i, 1);
        } else {
            i++;
        }
    }
}

function faster() {
    if (speed > 10) {
        return;
    }
    speed += 1;
}

function slower() {
    if (speed < 1) {
        stop();
        return;
    }
    speed -= 1;
}

function stop() {
    clearInterval(idTimer);
}

function move(course) {
    stop();
    idTimer = setInterval(move_figures, 15, course);
}