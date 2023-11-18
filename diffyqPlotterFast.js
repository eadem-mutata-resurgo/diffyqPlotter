
let speed = 100;            // computations per frame
let dt = 0.001;             // time step per computation
let defaultAxLength = 28;

window.onload = (event) => {
    context.translate(w/2, h/2);;
    context.scale(1, -1);
    context.save();
    context.scale((w/2-1)/axLength, (h/2-1)/axLength);
    reset();
    startStop();
}

function reset() {
    if (running) startStop();
    x = Number(xInitInput.value);
    y = Number(yInitInput.value);
    z = Number(zInitInput.value);
    maxZ = z+0.001;
    minZ = z-0.001;
    tail = [[x,y], [x,y]];
    t = 0;

    axLength = Math.max(defaultAxLength, Math.abs(x), Math.abs(y), Math.abs(z));
    context.restore();
    context.save();
    context.scale((w/2-1)/axLength, (h/2-1)/axLength);
    context.clearRect(-axLength, -axLength, 2*axLength, 2*axLength);
    drawAxes();
}

function update() {
    xDot = Function("x", "y", "z", "return " + xDotInput.value + ";");
    yDot = Function("x", "y", "z", "return " + yDotInput.value + ";");
    zDot = Function("x", "y", "z", "return " + zDotInput.value + ";");
    x += xDot(x, y, z)*dt;
    y += yDot(x, y, z)*dt;
    z += zDot(x, y, z)*dt;
    maxZ = Math.max(maxZ, z);
    minZ = Math.min(minZ, z);
    t += dt;
    tail.push([x,y]);
    tail.shift();
}

function draw() {
    context.lineWidth = 1/((w/2)/(axLength));
    for (let i = 0; i < speed; i++) {
        update();
        context.beginPath();
        context.moveTo(tail[0][0], tail[0][1]);
        context.lineTo(tail[1][0], tail[1][1]);
        context.strokeStyle = getCol(255*((z-minZ)/(maxZ-minZ)), 0, 255*(0.5*(-z+maxZ)/(maxZ-minZ)));
        context.stroke();
        context.closePath();
    }

    if (running) window.requestAnimationFrame(draw);
}

function drawAxes() {
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

//variables
let running = false;
let xDot, yDot, zDot, x, y, z, t, maxZ, minZ, tail, axLength;

//html canvas stuff
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const w = canvas.width;
const h = canvas.height;

//function inputs
const xDotInput = document.getElementById("xDot");
    xDotInput.addEventListener("input", reset);
const yDotInput = document.getElementById("yDot");
    yDotInput.addEventListener("input", reset);
const zDotInput = document.getElementById("zDot");
    zDotInput.addEventListener("input", reset);

//initial point inputs
const xInitInput = document.getElementById("xInit");
    xInitInput.addEventListener("input", reset);
const yInitInput = document.getElementById("yInit");
    yInitInput.addEventListener("input", reset);
const zInitInput = document.getElementById("zInit");
    zInitInput.addEventListener("input", reset);

//button inputs
const resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", reset);
const startButton = document.getElementById("startButton"); 
    startButton.addEventListener("click", startStop);

function sin(x) { return Math.sin(x % (2*pi)); }
function cos(x) { return Math.cos(x % (2*pi)); }
function tan(x) { return Math.tan(x % (2*pi)); }
const pi = Math.PI;
const e = Math.E;