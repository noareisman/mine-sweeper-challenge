'use strict';
const SMILEY = '🙂';
const BOM = '💣';
const EXPLODED = '🤯';
const FLAG = '🚩';
const EMPTY = '';
const CHAMP = '😎';
const OOPS = '🖤';
const LIFE = '❤️';

var gBoard;
var gFlagCount;
var gInterval;
var gMinesCoords;
var gElTimer = document.querySelector('.timer');
var elBtn = document.querySelector(".emoji-button");
var elLives = document.querySelector(".lives")

var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    inOn: true,
    showCount: 0,//how many cells are shown
    markedCount: 0,//how many cells are marked with a flag
    secPassed: 0,//how many seconds passed
    lifeCount: 3
};

function init() {
    initGame()
}

function initGame() {
    gGame.isOn = true;
    gGame.showCount = 0;
    gGame.markCount = 0;
    gGame.secPassed = 0;
    gGame.lifeCount = 3;
    gMinesCoords = [];
    renderLife(gGame.lifeCount);
    gBoard = buildBoard(gLevel);
    renderBoard(gBoard);
    gFlagCount = 0;
    elBtn.innerText = SMILEY;
    resetTimer(gGame);
}

function renderLife(lifeCount) {
    var str = '';
    for (var i = 0; i < lifeCount; i++) {
        str += `${LIFE}`
    }
    for (var j = 0; j < 3 - lifeCount; j++) {
        str += `${OOPS}`
    }
    elLives.innerText = str;
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
    }, 1000);
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
    return board;
}


function locateMinesRandomly(m, n) {
    var mineFreeCoords = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (i === m && j === n) continue;
            var coord = { cellI: i, cellJ: j }
            mineFreeCoords.push(coord);
        }
    }
    mineFreeCoords.push(coord);
    mineFreeCoords.push(coord);
    for (var i = 0; i < gLevel.MINES; i++) {
        var mineCoords = mineFreeCoords.splice(getRandomIntInclusive(0, mineFreeCoords.length - 1), 1)[0];
        gBoard[mineCoords.cellI][mineCoords.cellJ].isMine = true;
        gMinesCoords.push(mineCoords);
    }
    setMineNegsCount(gBoard);
    if (gGame.showCount > 0) startTimer();
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
}


function cellClicked(elCell, i, j) {

    if (!gGame.isOn) return;
    if (gGame.showCount === 0) {
        locateMinesRandomly(i, j);
        startTimer();
    }
    if (gBoard[i][j].isMine) {
        // gBoard[i][j].isShown=true;
        gGame.lifeCount--;
        renderLife(gGame.lifeCount);
        if (gGame.lifeCount > 0) {
            return;
        } else {
            for (var k = 0; k < gLevel.MINES; k++) {
                gBoard[gMinesCoords[k].cellI][gMinesCoords[k].cellJ].isShown = true;
            }
            renderBoard(gBoard);
            stopTimer();
            gameOver(-1);
            return;
        }
    } else if (gBoard[i][j].minesAroundCount === 0) {
        gGame.showCount++;
        gBoard[i][j].isShown = true;
        expendShown(gBoard, elCell, i, j);
        checkGameOver(gBoard);
        return;
    } else {
        gBoard[i][j].isShown = true;
        renderBoard(gBoard)
        checkGameOver(gBoard);
        gGame.showCount++;
        return;
    }
}

function checkGameOver(board) {
    renderBoard(board);
    if (gFlagCount + gGame.showCount === gLevel.SIZE ** 2) {
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[0].length; j++) {
                if (board[i][j].isMine && !board[i][j].isMarked ||
                    !board[i][j].isMine && board[i][j].isMarked && !board[i][j].isShown ||
                    !board[i][j].isMine && board[i][j].isMarked) {
                    return;
                }
            }
        }
        stopTimer();
        gGame.isOn = false;
        gameOver(1);
    }
    return
}


function gameOver(num) {
    if (num > 0) {
        console.log('You win!');
        elBtn.innerText = CHAMP;
    } else {
        console.log('Game over!');
        elBtn.innerText = EXPLODED;
    }
}

function stopTimer() {
    var finishTime = gInterval;
    gElTimer.innerText = finishTime;
    gGame.secPassed = finishTime;
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
            gGame.showCount++
        }
    }
    renderBoard(board);
}

function cellMarked(elCell, i, j) {
    if (!gGame.isOn) {
        gGame.isOn = true;
        gGame.showCoun
    }
    //TODO: toggle:if on mark plus prevent onClick
    gBoard[i][j].isMarked = true;
    elCell.innerText = FLAG;
    renderBoard(gBoard);
    gFlagCount++;
}




