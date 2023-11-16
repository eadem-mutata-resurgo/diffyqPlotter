const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const xDotInput = document.getElementById("xDot");
    xDotInput.addEventListener("input", reset);
const yDotInput = document.getElementById("yDot");
    yDotInput.addEventListener("input", reset);
const zDotInput = document.getElementById("zDot");
    zDotInput.addEventListener("input", reset);
const startButton = document.getElementById("startButton"); 
    startButton.addEventListener("click", startStop);
    let running = false;

const w = canvas.width;
const h = canvas.height;


let xDot, yDot, zDot, x, y, z, t;
let tail = [];

let axLength = 4;  // maximum absolute value of both axes
let speed = 20;    // computations per frame
let dt = 0.002;    // time step per computation
let initX = 1;
let initY = 1;
let initZ = 1;
let tailLength = 100000;



window.onload = (event) => {
    context.translate(w/2, h/2);;
    context.scale(1, -1);
    context.save();
    context.lineWidth = 1/((w/2)/axLength)
    context.scale((w/2-1)/axLength, (h/2-1)/axLength);
    reset();
    startStop();
}

function reset() {
    if (running) startStop();
    tail = [initX,initY];
    x = initX;
    y = initY;
    z = initZ;
    t = 0;
    axLength = 4;
    context.restore();
    context.save();
    context.scale((w/2-1)/axLength, (h/2-1)/axLength);
    context.lineWidth = 1/((w/2)/axLength)
}

function rescale() {
    let a = Math.abs(x);
    let b = Math.abs(y);

    if (a > axLength || b > axLength) {
        axLength = Math.ceil(Math.max(a,b));
        context.restore();
        context.save();
        context.scale((w/2-1)/axLength, (h/2-1)/axLength);
        context.lineWidth = 1/((w/2)/axLength)
    }
}

function update() {
    xDot = Function("x", "y", "z", "return " + xDotInput.value + ";");
    yDot = Function("x", "y", "z", "return " + yDotInput.value + ";");
    zDot = Function("x", "y", "z", "return " + zDotInput.value + ";");
}

function draw() {
    context.clearRect(-axLength, -axLength, 2*axLength, 2*axLength);
    drawAxes();
    update();
    drawTail();
    drawCursor();
    for(let i = 0; i < speed; i++) {
        x += xDot(x, y, z)*dt;
        y += yDot(x, y, z)*dt;
        z += zDot(x, y, z)*dt;
        rescale();
        tail.push([x, y]);
        if (tail.length > tailLength) tail.shift();
    }
    t += dt;
    if (running) window.requestAnimationFrame(draw);
}

function drawTail() {
    context.save();

    context.beginPath();
    context.moveTo(tail[0][0], tail[0][1]);
    
    for (let i = 1; i < tail.length; i++) {
        context.lineTo(tail[i][0], tail[i][1]);
    }

    context.lineWidth = 1.5/((w/2)/axLength);
    context.strokeStyle = getCol(255, 100, 0);
    context.stroke();
    context.closePath();

    context.restore();
}

function drawCursor() {
    context.save();

    context.beginPath();
    context.arc(x, y, 0.1, 0, 2*pi);
    context.fillStyle = "cyan";
    context.fill();
    context.closePath();

    context.restore();
}

function drawAxes() {
    context.save();
    context.lineWidth = 1/((w/2)/(axLength**(1/2)));
    context.beginPath();
    for (let i = 1; i <= axLength; i++) {
        //horizontal grid lines
        context.moveTo(-axLength, i);
        context.lineTo(axLength, i);
        context.moveTo(-axLength, -i);
        context.lineTo(axLength, -i);
        //vertical grid lines
        context.moveTo(i, -axLength);
        context.lineTo(i, axLength);
        context.moveTo(-i, -axLength);
        context.lineTo(-i, axLength);
    }
    context.strokeStyle = "gray";
    context.stroke();
    context.closePath();
    
    //axes
    context.lineWidth = 1/((w/2)/axLength);
    context.beginPath();
    context.moveTo(-axLength, 0);
    context.lineTo(axLength, 0);
    context.moveTo(0, -axLength);
    context.lineTo(0, axLength);
    context.strokeStyle = "black";
    context.stroke();
    context.stroke();
    context.closePath();

    context.restore();
}

function startStop() {
    if (running) startButton.value = "Start";
    else {
        t = 0;
        startButton.value = "Stop";
    }
    running = !running;
    if (running) window.requestAnimationFrame(draw);
}

function getCol(r, g, b) {
    return "rgb(" + r.toString() + " " + g.toString() + " " + b.toString() + ")";
}

function sin(x) { return Math.sin(x % (2*pi)); }
function cos(x) { return Math.cos(x % (2*pi)); }
function tan(x) { return Math.tan(x % (2*pi)); }
const pi = Math.PI;
const e = Math.E;