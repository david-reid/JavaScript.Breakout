// Constants and variables
let canvas; 
let context;
const FRAMES_PER_SECOND = 30;


window.onload = function() {
    
    console.log('JavaScript Breakout v1.0.0');

    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    resize();

    setInterval(gameLoop, 1000/FRAMES_PER_SECOND);
}

// Utility functions

function resize() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 6;
}

// Game Loop Functions
function gameLoop() {

    moveEverything();
    drawEverything();
}

function moveEverything() {
    //console.log('move everything');
}

function drawEverything() {
    //console.log('draw everything');
}