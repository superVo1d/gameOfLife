"use strict"

var canvas;
var canvasContext;

canvas = document.getElementById("gameCanvas");
canvasContext = canvas.getContext("2d");
canvasContext.fillStyle = "#f38c4f";
canvasContext.fillRect(0, 0, canvas.width, canvas.height);

var gameField = [];
var N = 50;
var timerId;
var generationCounter = 1;
var previousField = [];


createStartingField(N);

function game() {
	document.getElementById("start_btn").onclick = playWithTimeInterval;
	gameField = getNewField();
	//console.log(gameField);
	drawField();
	//console.log(generationCounter);
	if (generationCounter % 2 == 0) {
		if (compareGenerations()) {
			gameOver();
		}
		saveGeneration();
	}
	generationCounter++;	
	//console.log(checkNeighbors(5,5));
}

function playWithTimeInterval() {
	timerId = setInterval(game, 30);
	document.getElementById("pause").disabled = false;
	document.getElementById("start_btn").disabled = true;
}

function pauseGame() {
    clearInterval(timerId);
    document.getElementById("pause").disabled = true;
    let state = document.getElementById("start_btn").disabled;
    if (state == true) {
    	document.getElementById("start_btn").disabled = false;
    }
}

function compareGenerations() {
	let differensesCounter = 0;
	for (let i = 0; i < N; i++) {
		for (let j = 0; j < N; j++) {
		    if (gameField[i][j] != previousField[i][j]) {
		    	differensesCounter++;
		    } 
	    }
	}
	if (differensesCounter == 0) {
		return true;
	} else {
		return false;
	}
}

function saveGeneration() {
	for (let i = 0; i < N; i++) {
		for (let j = 0; j < N; j++) {
		    previousField[i][j] = gameField[i][j];
	    }
	}
}

function gameOver() {
	clearInterval(timerId);
	document.getElementById("nxt_stp").disabled = true;
	document.getElementById("pause").disabled = true;
	document.getElementById("start_btn").disabled = false;
	document.getElementById("start_btn").onclick = clearGameField;
	document.getElementById("game_over").innerHTML = "GAME OVER / " + generationCounter + " GENERATONS";
    generationCounter = 1;
	canvasContext.fillStyle = "rgba(243, 140, 79, 0.8)";
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

function clearGameField() {
	document.getElementById("nxt_stp").disabled = false;
	document.getElementById("start_btn").onclick = playWithTimeInterval;
	document.getElementById("game_over").innerHTML = "";
	pauseGame();
	createStartingField(N);
}

function createStartingField(N) {
	for (let i = 0; i < N; i++) {
		previousField[i] = [];
		gameField[i] = [];
		for (let j = 0; j < N; j++) {
			gameField[i][j] = (Math.floor(Math.random() * 10) % 2) ? "1" : "0";
		}
	}
	drawField();
}

function getNewField() {
	let newGameField = [];
	for (let i = 0; i < N; i++) {
		newGameField[i] = [];
		for (let j = 0; j < N; j++) {
			let aliveNeighbors = checkNeighbors(i, j);
			if (gameField[i][j] == "0" && aliveNeighbors == 3){
				newGameField[i][j] = "1";
			} else if ((gameField[i][j] == "1") && 
				(aliveNeighbors == 2 || aliveNeighbors ==3)){
				newGameField[i][j] = gameField[i][j];
			} else if (gameField[i][j] == "1" && 
				(aliveNeighbors < 2 || aliveNeighbors > 3)) {
				newGameField[i][j] = "0";
			} else {
				newGameField[i][j] = gameField[i][j];
			}
		}
	}
	return (newGameField);
}

function checkNeighbors(x, y) {
	let counter = 0;
	for (let i = -1; i < 2; i++) { 
		for (let j = -1; j < 2; j++) {
			let tempX = x + i;
			let tempY = y + j;
			if (gameField[(N + tempX) % N][(N + tempY) % N] == "1") {
				counter += 1;
				if (i == 0 && j == 0) {
					counter -= 1;
			    }
			}
		}
	}
	return counter;
}

function drawField() {
	canvasContext.fillStyle = "#f38c4f";
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	let x = canvas.width / N;
	let y = canvas.height / N;
	for (let i = 0; i < N; i++) {
		for (let j = 0; j < N; j++) {
			if (gameField[i][j] == "1") {
				canvasContext.fillStyle = "black"; 
				canvasContext.fillRect(j * x, i * y, x, y);
			}
		}
	}
}
