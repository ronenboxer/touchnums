'use strict'

var hintTime; //miliseconds
var paneltyTime;
var squareLength;
var numbers;
var gNums = [];
var nextNum;
var startTime;
var endTime;
var isWrong;
var lastFoundNumTime;
var intervalId;
var lastFoundIntervalId;


function onLevel(level) {
    document.querySelector(`.table-container`).innerHTML = '';
    var elRestart = document.querySelector(`.restart-button`);
    elRestart.style.visibility = 'hidden';
    switch (level) {
        case 'Easy':
            squareLength = 3;
            break;
        case 'Intermediate':
            squareLength = 4;
            break;
        case 'Hard':
            squareLength = 6;
            break;
        case 'Extreme':
            squareLength = 8;
            break;
        case 'Insane':
            squareLength = 10;
            break;
    }
    hintTime = squareLength * 1000;
    paneltyTime = squareLength * 1000
    numbers = squareLength ** 2;
    gNums = [];
    for (var i = 0; i < numbers; i++) {
        gNums[i] = i + 1;
    }
    onRestart();
}

function onRestart() {
    gameOver();
    if (!squareLength) return;
    nextNum = 1;
    var wrongHeader = document.querySelector('h2');
    // wrongHeader.hidden = true;
    wrongHeader.style.opacity = 0;
    // setTimeout(() => wrongHeader.hidden = false, 500);
    var elRestart = document.querySelector(`.restart-button`);
    var timer = document.querySelector('.timer');
    timer.innerText = `Your time :`;
    elRestart.style.visibility = 'hidden';
    numbers = squareLength ** 2;
    isWrong = false;
    if (intervalId) {
        gameOver();
    }
    gNums.sort((n1, n2) => 0.5 - Math.random());
    renderTable();
}

function renderTable() {
    var elTableContainer = document.querySelector(`.table-container`);
    var newTable = '';
    newTable += `<table>\n`;
    for (var i = 0; i < squareLength; i++) {
        newTable += `<tr>\n`;
        for (var j = 0; j < squareLength; j++) {
            var currNum = gNums[i * squareLength + j]
            var dataAtt = `onclick="onCheckCell(this, ${currNum})"`;
            dataAtt += ` class="not-marked"`;
            dataAtt += ` id="${currNum}"`
            if (currNum !== 1) dataAtt += ` style="opacity: 0"`;
            newTable += `<td ${dataAtt}>`;
            newTable += `${currNum}</td>\n`;
        }
        newTable += `</tr>\n`;
    }
    newTable += `</table>`;
    elTableContainer.innerHTML = newTable;
}

function onCheckCell(elCell, numInCell) {
    if (nextNum === 1 && numInCell !== 1) return;
    if (numInCell === 1) {
        var elRestart = document.querySelector(`.restart-button`);
        elRestart.style.visibility = 'visible';
        var elCells = document.querySelectorAll('td');
        for (var i = 0; i < numbers; i++) {
            elCells[i].style.opacity = 1;
        }
        startTime = Date.now();
        intervalId = setInterval(renderTime, 1);
    }
    if (isWrong) return;
    if (numInCell > nextNum) return wrongPress(elCell);
    showHint(elCell);
    if (numInCell < nextNum) return;
    elCell.classList.remove('not-marked');
    elCell.classList.add('marked');
    if (numInCell === numbers) return foundAll();
    nextNum++;
}

function foundAll() {
    gameOver();
    var elCells = document.querySelectorAll(`td`);
    for (var i = 0; i < elCells.length; i++) {
        elCells[i].style.transition = '900ms'
        elCells[i].style.background = 'white';
        elCells[i].style.boxShadow = '3px 3px 1.5px rgb(57, 57, 57)';
    }
    setTimeout(() => {
        for (var i = 0; i < elCells.length; i++) {
            elCells[i].style.transition = '300ms'
            elCells[i].style.background = 'rgb(153, 182, 247)';
        }
    }, 300);
}

function gameOver() {
    clearInterval(intervalId);
    clearInterval(lastFoundIntervalId);
}

function showHint(elCell) {
    clearInterval(lastFoundIntervalId);
    lastFoundNumTime = Date.now();
    lastFoundIntervalId = setInterval(flashNum, hintTime);
}

function flashNum() {
    var elNextCell = document.getElementById(`${nextNum}`);
    if (Date.now() - lastFoundNumTime > hintTime) {
        elNextCell.style.opacity = 0.7;
        setTimeout(() => {
            elNextCell.style.opacity = 1;
        }, 400);
    }
}

function wrongPress(elCell) {
    var wrongHeader = document.querySelector('h2');
    wrongHeader.innerText = `Wrong! ${squareLength} Seconds panelty :(`
    wrongHeader.style.opacity = 1;
    isWrong = true;
    elCell.classList.remove('not-marked');
    elCell.classList.add('wrong');
    clearInterval(lastFoundIntervalId);
    setTimeout(() => {
        wrongHeader.style.opacity = 0;
        elCell.classList.remove('wrong');
        elCell.classList.add('not-marked');
        isWrong = false;
        showHint(elCell);
    }, paneltyTime);
}

function renderTime() {
    var currTime = Date.now();
    var difference = currTime - startTime;
    var milisec = difference % 1000;
    var minutes = '';
    var secs = parseInt(difference / 1000);
    var timer = document.querySelector('.timer');
    if (milisec < 10) milisec = '0' + milisec;
    if (milisec < 100) milisec = '0' + milisec;
    if (secs >= 60) {
        minutes = parseInt(secs / 60) + ':';
        secs %= 60;
        if (secs < 10) secs = '0' + secs;
    }
    timer.innerText = `Your time : ${minutes}${secs}.${'' + milisec}`;
}