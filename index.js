// Constants and variables
let canvas; 
let context;
const FRAMES_PER_SECOND = 30;

const BACKGROUND_COLOR = '#313639';
const COLOR_WHITE = '#f5f5f5';
const COLOR_BLUE  = '#6abef0';
const COLOR_PINK  = '#ec88e8';
const COLOR_GREEN = '#88ECC8';

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DISTANCE_FROM_EDGE = 40;

const BRICK_WIDTH = 80; // New constants for our bricks
const BRICK_HEIGHT = 20;
let BRICK_COLS = 10;
const BRICK_GAP = 2;
const BRICK_ROWS = 14;

let bricksLeft; // New variables for our bricks
let brickGrid = Array(BRICK_COLS * BRICK_ROWS);
let paletteGrid = Array(BRICK_COLS * BRICK_ROWS);

let paddleX = 400;
let mouseX;
let mouseY;

var ballX = 0; // New variables for our ball.
var ballY = 0;
var ballSpeedX = 0;
var ballSpeedY = 7;



window.onload = function() {
    
    console.log('JavaScript Breakout v1.0.0');

    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    resize();

    setInterval(gameLoop, 1000/FRAMES_PER_SECOND);

    canvas.addEventListener('mousemove', updateMousePos);

    brickReset();
    ballReset(); 
}

// Utility functions

function resize() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 6;

    brickReset();
}

// Game Loop Functions
function gameLoop() {

    moveEverything();
    drawEverything();
}

function moveEverything() {
    ballMove();
    ballPaddleHandling(); 
    ballBrickHandling();
}

function drawEverything() {

    // Background color painted over the entire canvas.
    colorRect(0, 0, canvas.width, canvas.height, BACKGROUND_COLOR);
    
    // Paddle player
    colorRect(paddleX, canvas.height-PADDLE_DISTANCE_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, COLOR_WHITE);

    drawBricks();

    // The function that draws our ball.
    colorCircle(ballX,ballY, 10, COLOR_WHITE);
}

// Graphic utility functions
function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
    context.fillStyle = fillColor;
    context.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX,centerY, radius, fillColor) {
    context.fillStyle = fillColor;
    context.beginPath();
    context.arc(centerX,centerY, 10, 0,Math.PI*2, true);
    context.fill();
}

function printText(text, xPos, yPos, size, font, color) {
    context.fillStyle = color;
    context.font = `${size} ${font}`;
    context.fillText(text, xPos, yPos);
}

// Input Functions
function updateMousePos(evt) {
            
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
    paddleX = mouseX - PADDLE_WIDTH / 2;
}

// Brick Functions
function brickReset() {
    
    BRICK_COLS = Math.ceil(canvas.width / BRICK_WIDTH);
    
    brickGrid = Array(BRICK_COLS * BRICK_ROWS);
    paletteGrid = Array(BRICK_COLS * BRICK_ROWS);

    bricksLeft = 0;
        
    for (let i = 0; i < BRICK_COLS * BRICK_ROWS; i++) {
        
        brickGrid[i] = true;
        bricksLeft++;

        let index = Math.floor(Math.random() * Math.floor(3));
        
        switch (index) {
            case 1:
                paletteGrid[i] = COLOR_BLUE;
                break;
            case 2:
                paletteGrid[i] = COLOR_GREEN;
                break;
            default:
                paletteGrid[i] = COLOR_PINK;
        }
    }
}

function rowColToArrayIndex(col, row) {
    return col + BRICK_COLS * row;
}

function isBrickAtColRow(col, row) {
    
    if (col >= 0 && col < BRICK_COLS &&
        row >= 0 && row < BRICK_ROWS) {
        
        var brickIndexUnderCoord = rowColToArrayIndex(col, row);
        return brickGrid[brickIndexUnderCoord];
    }
    else {
        return false;
    }
}

function drawBricks() {
    for (let eachRow=0; eachRow<BRICK_ROWS; eachRow++) {
        for (let eachCol=0; eachCol<BRICK_COLS; eachCol++) {
            let arrayIndex = rowColToArrayIndex(eachCol, eachRow);
            if (brickGrid[arrayIndex] == true) {
                colorRect(BRICK_WIDTH*eachCol,BRICK_HEIGHT*eachRow, BRICK_WIDTH-BRICK_GAP,BRICK_HEIGHT-BRICK_GAP, paletteGrid[arrayIndex]);
            }
        }
    }
}

// Ball functions

function ballReset() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = 0;
    ballSpeedY = 7;
}

function ballMove() {
    
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0 && ballSpeedX < 0.0) { // left
        ballSpeedX *= -1;
    }
    if (ballX > canvas.width && ballSpeedX > 0.0) { // right
        ballSpeedX *= -1;
    }
    if (ballY < 0 && ballSpeedY < 0.0) { // top
        ballSpeedY *= -1;
    }
    if (ballY > canvas.height) { // bottom
        ballReset();
        brickReset();
    }
}

function ballPaddleHandling() {
    
    let paddleTopEdgeY = canvas.height - PADDLE_DISTANCE_FROM_EDGE;
    let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS; 
    let paddleLeftEdgeX = paddleX;
    let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
    
    // Check if we have collided with the paddle.
    if (ballY > paddleTopEdgeY &&
        ballY < paddleBottomEdgeY &&
        ballX > paddleLeftEdgeX &&
        ballX < paddleRightEdgeX) {
        ballSpeedY *= -1;
        
        // Changes x speed based on where the ball collides with the paddle.
        // This technique gives the player some ball control.
        let centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
        let ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
        ballSpeedX = ballDistFromPaddleCenterX * 0.35;
        if (bricksLeft == 0) {
            brickReset();
        }
    } 
}

function ballBrickHandling() {
    
    let ballBrickCol = Math.floor(ballX / BRICK_WIDTH);
    let ballBrickRow = Math.floor(ballY / BRICK_HEIGHT);
    let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
    
    if (ballBrickCol >= 0 
        
        && ballBrickCol < BRICK_COLS 
        && ballBrickRow >= 0 
        && ballBrickRow < BRICK_ROWS) {
        
            if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
            
            brickGrid[brickIndexUnderBall] = false;
            bricksLeft--;

            let prevBallX = ballX - ballSpeedX;
            let prevBallY = ballY - ballSpeedY;
            let prevBrickCol = Math.floor(prevBallX / BRICK_WIDTH);
            let prevBrickRow = Math.floor(prevBallY / BRICK_HEIGHT);
            let bothTestsFailed = true;
            
            if (prevBrickCol != ballBrickCol) {
                if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
                    ballSpeedX *= -1;
                    bothTestsFailed = false;
                }
            }
            if (prevBrickRow != ballBrickRow) {
                
                if (isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
                    ballSpeedY *= -1;
                    bothTestsFailed = false;
                }
            }
            if (bothTestsFailed) { // The armpit scenario
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }
            
        }
    }
}