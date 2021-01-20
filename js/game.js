'use strict';
const SMILEY = '🙂';
const BOM = '💣';
const EXPLODED = '🤯';
const FLAG = '🚩';
const EMPTY = '';
const CHAMP = '😎'

var gBoard;
var gFlagCount;
var gInterval;
var gElTimer = document.querySelector('.timer');
var elBtn = document.querySelector(".emoji-button");
var gClickCounter;
var gMinesCoords;

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    inOn: false,
    showCount: 0,//how many cells are shown
    markedCount: 0,//how many cells are marked with a flag
    secPassed: 0//how many seconds passed
};

function init() {
    initGame()
}

function initGame() {
    gGame.isOn = true;
    gGame.showCount = 0;
    gGame.markCount = 0;
    gGame.secPassed = 0;
    gClickCounter = 0
    gBoard = buildBoard(gLevel);
    renderBoard(gBoard);
    gFlagCount = 0;
    elBtn.innerText = SMILEY;
    resetTimer(gGame);
}

function levelClicked(size, mines) {
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    gGame.isOn = false;
    resetTimer();
    init();
}

function resetTimer() {
    gElTimer.innerHTML = '000';
    gInterval = clearInterval(gInterval);
}

function startTimer() {
    gInterval = setInterval(function () {
        gGame.secPassed++;
        renderTimer()
    }, 1000)
        ;
    return gInterval;
}

function renderTimer() {
    gElTimer.innerText = gGame.secPassed
}

function buildBoard(level) {

    var board = createMat(level.SIZE, level.SIZE);

    for (var i = 0; i < level.SIZE; i++) {
        for (var j = 0; j < level.SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            board[i][j] = cell;
        }
    }
    ///temp manualy set mines
    // board[3][0].isMine = true;
    // board[2][0].isMine = true;
    return board;
}


function locateMinesRandomly(m, n) {
    mineFreeCoords = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (i === m && j === n) continue;
            var coord = { cellI: i, cellJ: j }
            mineFreeCoords.push(coord);
        }
    }
    for (var i = 0; i < gLevel.MINES; i++) {
        var coords = mineFreeCoords.splice(getRandomIntInclusive(0, gMineFreeCoords.length - 1), 1)[0];
        gBoard[coords.cellI][coords.cellJ].isMine = true;
        gMinesCoords.push(coords);
    }
    setMineNegsCount(gBoard);
    
}

//count mines around each cell and set the cell's minesAroundCount
function setMineNegsCount(board) {
    var currCell;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            currCell = board[i][j];
            var count = 0;
            for (var m = i - 1; m <= i + 1; m++) {
                if (m < 0 || m > board.length - 1) continue;
                for (var n = j - 1; n <= j + 1; n++) {
                    if (n < 0 || n > board[0].length - 1) continue;
                    if (m === i && n === j) continue;
                    if (board[m][n].isMine) count++;
                }
            }
            currCell.minesAroundCount = count;
        }
    }
}

function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var cell;
            var color = 'rgb(119, 113, 113)';
            if (board[i][j].isShown) {
                color = 'rgb(181, 176, 176)';
                if (board[i][j].isMine) {
                    cell = BOM
                } else {
                    cell = (board[i][j].minesAroundCount) ? board[i][j].minesAroundCount : EMPTY;
                }
            } else {
                cell = '';
            }
            var className = `cell${i}-${j}`;
            strHTML += `\t<td style="background-color:${color}" class="${className}" onclick="cellClicked(this, ${i},${j})">\n${cell}\t</td>\n`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
    console.log(strHTML);
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return;
    if (!gClickCounter) {
        gClickCounter++;
        locateMinesRandomly(i, j);
    }
    var elCell = elCell.innerText;
    if (gClickCounter === 1) startTimer();
    if (elCell === BOM) {
        revealBoms(elCell);
        gameOver(false);
        return;
    } else if (elCell === EMPTY) {
        gBoard[i][j].isShown = true;
        expendShown(gBoard, elCell, i, j);
        checkGameOver(gBoard);
        return;
    } else {
        gBoard[i][j].isShown = true;
        checkGameOver(gBoard);
        return;
    }
}

function revealBoms(elCell){
    for (var i=0; i<gMinesCoords.length;i++){
        gMinesCoords[i].isShown=true;
    }
    // elCell.style.background-color='red';
} 


function checkGameOver(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine && !board[i][j].isMarked ||
                !board[i][j].isMine && board[i][j].isMarked && !board[i][j].isShown ||
                !board[i][j].isMine && board[i][j].isMarked) {
                return;
            }
        }
    }
    gameOver(true);
}


function gameOver(boolean) {
    if (boolean) {
        console.log('You win!');
        elBtn.innerText = CHAMP;
    } else {
        console.log('Game over!');
        elBtn.innerText = EXPLODED;
    }
    stopTimer();
    gGame.isOn = false;
}

function stopTimer() {
    var finishTime = gInterval;
    gElTimer.innerText = finishTime;
    clearInterval(gInterval)
}

function expendShown(board, elCell, i, j) {
    for (var m = i - 1; m <= i + 1; m++) {
        if (m < 0 || m > board.length - 1) continue;
        for (var n = j - 1; n <= j + 1; n++) {
            if (n < 0 || n > board[0].length - 1) continue;
            if (m === i && n === j) continue;
            if (board[m][n].isMarked) continue;
            if (!board[m][n].isMine) board[m][n].isShown = true;
        }
    }
    renderBoard(board)
}

function cellMarked(elCell, i, j) {
    if (!gGame.isOn) {
        gGame.isOn = true;
        gClickCounter++;
    }
    //TODO: toggle:if on mark plus prevent onClick
    gBoard[i][j].isMarked = true;
    elCell.innerText = FLAG;
    renderBoard(gBoard);
    gFlagCount++;
}




