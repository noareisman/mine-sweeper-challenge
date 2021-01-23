'use strict';
const SMILEY = '🙂';
const BOM = '💣';
const EXPLODED = '🤯';
const FLAG = '🚩';
const EMPTY = '';
const CHAMP = '😎';
const OOPS = '🖤';
const LIFE = '❤️';
const HINT = '❓';
const USEDHINT = '❗';
const BESTSCORE = '🥳';

var gBoard;
var gInterval;
var gMinesCoords;
var gMineFreeCoords;
var gElTimer = document.querySelector('.timer');
var elBtnEmoji = document.querySelector('.emoji-button');
var elBtnHint1 = document.querySelector('.hint-button-1');
var elBtnHint2 = document.querySelector('.hint-button-2');
var elBtnHint3 = document.querySelector('.hint-button-3');
var elBtnSafeClick = document.querySelector('.safe-click-button');
var elLives = document.querySelector('.lives')
var elModal = document.querySelector('.modal')
var gGame = {};
var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gMinesPositionedCount;
var gLastActions;
var gGameOverMines;
var gFinishTime

function init() {
    initGame()
}

function initGame() {
    gGame.isPositionMines = false;
    gMinesPositionedCount = 0;
    gGame.isOn = true;
    gGame.isHint = false;
    gGame.showCount = 0;
    gGame.markCount = 0;
    gGame.secPassed = 0;
    gGame.lifeCount = 3;
    gGame.safeClickCount = 3;
    gLastActions = [];
    gGame.hints = [];
    gMinesCoords = [];
    gMineFreeCoords = [];
    gGameOverMines = [];
    closeModal();
    gFinishTime = 0;
    elModal.innerText = 'OOPS You steped on a mine!';
    elBtnSafeClick.innerText = 'SAFE CLICK: 3'
    renderLife(gGame.lifeCount);
    elBtnHint1.innerText = HINT;
    elBtnHint2.innerText = HINT;
    elBtnHint3.innerText = HINT;
    gBoard = buildBoard(gLevel);
    renderBoard(gBoard);
    elBtnEmoji.innerText = SMILEY;
    resetTimer(gGame);
    // renderBestScoreTable(gLevel.SIZE)//////////////////////////////////////////////////////////////////////////////////////////
}

function isPositionMines() {
    if (gGame.secPassed !== 0) return;
    gGame.isPositionMines = true;
}

function safeClick(elBtnSafeClick) {
    if (gGame.secPassed < 1) return;
    if (gGame.safeClickCount < 1) return;
    gGame.safeClickCount--;
    var mineFreeCoordsNotShown = [];
    for (var i = 0; i < gMineFreeCoords.length; i++) {
        var currCell = gBoard[gMineFreeCoords[i].cellI][gMineFreeCoords[i].cellJ];
        if (!currCell.isShown) mineFreeCoordsNotShown.push(gMineFreeCoords[i]);
    }
    var safeCoord = mineFreeCoordsNotShown.slice(getRandomIntInclusive(0, mineFreeCoordsNotShown.length - 1))[0];
    renderSafeCoord(safeCoord.cellI, safeCoord.cellJ);
    elBtnSafeClick.innerText = `SAFE CLICK: ${gGame.safeClickCount}`;
    setRecordMoveTemplate();
    gLastActions[gLastActions.length - 1].isSafeClick = true;
}

function renderSafeCoord(i, j) {
    var elCell = document.getElementById(`cell${i}-${j}`);
    elCell.style = "background-color:yellow";
    setTimeout(function () {
        elCell.style = "background-color:rgb(119, 113, 113)"
    }, 1500);
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
    init();
}

function hint(elBtnHint, hintNum) {
    if (gGame.showCount < 1) return;
    if (gGame.isHint) return;
    if (gGame.hints.length < 3) {
        for (var i = 0; i < gGame.hints.length; i++) {
            if (hintNum === gGame.hints[i]) return;
        }
        gGame.hints.push(hintNum);
        elBtnHint.innerText = USEDHINT;
        gGame.isHint = true;
        setRecordMoveTemplate();
        gLastActions[gLastActions.length - 1].isHint = true;
        gLastActions[gLastActions.length - 1].hintNum = hintNum;
    }
}

function flash(i, j) {
    for (var m = i - 1; m <= i + 1; m++) {
        if (m < 0 || m > gBoard.length - 1) continue;
        for (var n = j - 1; n <= j + 1; n++) {
            if (n < 0 || n > gBoard[0].length - 1) continue;
            if (gBoard[m][n].isMarked) continue;
            if (!gBoard[m][n].isShown) parallelFlash(m, n);
        }
    }
}

function parallelFlash(i, j) {
    gBoard[i][j].isShown = true;
    renderBoard(gBoard);
    setTimeout(function () {
        gBoard[i][j].isShown = false;
        renderBoard(gBoard);
    }, 1000)
    gGame.isHint = false;
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
function stopTimer() {
    gFinishTime = gGame.secPassed;
    gElTimer.innerText = gFinishTime;
    clearInterval(gInterval)
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
    if (gGame.secPassed > 0) return;
    var mineFreeCoords = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (i === m && j === n) continue;
            var coord = { cellI: i, cellJ: j }
            mineFreeCoords.push(coord);
        }
    }
    mineFreeCoords.push(coord);
    for (var i = 0; i < gLevel.MINES; i++) {
        var mineCoords = mineFreeCoords.splice(getRandomIntInclusive(0, mineFreeCoords.length - 1), 1)[0];
        gBoard[mineCoords.cellI][mineCoords.cellJ].isMine = true;
        gMinesCoords.push(mineCoords);
    }
    setMineNegsCount(gBoard);
    gMineFreeCoords = mineFreeCoords;
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
                    cell = BOM;
                } else {
                    cell = (board[i][j].minesAroundCount) ? board[i][j].minesAroundCount : EMPTY;
                }
            } else {
                cell = (gBoard[i][j].isMarked) ? FLAG : '';
            }
            strHTML += `\t<td style="background-color:${color}" id="cell${i}-${j}" oncontextmenu="cellMarked(this,event,${i},${j})" onclick="cellClicked(this, ${i},${j})">\n${cell}\t</td>\n`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}

function cellMarked(elCell, event, i, j) {
    event.preventDefault();
    if (!gGame.isOn) return;
    if (gGame.showCount === 0 && gGame.secPassed < 1) {
        startTimer();
    }
    if (gBoard[i][j].isShown) return;
    setRecordMoveTemplate();
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        elCell.innerText = '';
        gGame.markCount--;
        gLastActions[gLastActions.length - 1].isRemoveMarked = true;
        gLastActions[gLastActions.length - 1].coords = {cellI:i,cellJ:j};
    } else {
        gBoard[i][j].isMarked = true;
        elCell.innerText = FLAG;
        gGame.markCount++;
        gLastActions[gLastActions.length - 1].isMarked = true;
        gLastActions[gLastActions.length - 1].coords = {cellI:i,cellJ:j};
        checkGameOver(gBoard)///////////////////////////////////////////////////////////////////////////
    }
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return;
    if (gGame.isPositionMines && gMinesPositionedCount < gLevel.MINES) {
        if (gBoard[i][j].isMine) return;
        gBoard[i][j].isMine = true;
        gBoard[i][j].isShown = true;
        elCell.innerText = BOM;
        gMinesCoords.push({ cellI: i, cellJ: j });
        gMinesPositionedCount++;
        if (gMinesPositionedCount === gLevel.MINES) {
            setMineNegsCount(gBoard);
            for (var i = 0; i < gBoard.length; i++) {
                for (var j = 0; j < gBoard[0].length; j++) {
                    gBoard[i][j].isShown = false;
                    if (gBoard[i][j].isMine) continue;
                    var coord = { cellI: i, cellJ: j }
                    gMineFreeCoords.push(coord);
                }
            }
        }
        return;
    }
    if (gBoard[i][j].isShown) return;
    if (gBoard[i][j].isMarked) return;
    if (gGame.showCount === 0 && !gGame.isPositionMines) {
        locateMinesRandomly(i, j);
        if (gGame.secPassed < 1) startTimer();
    }
    if (gGame.isHint) {
        flash(i, j);
        return;
    } else {
        setRecordMoveTemplate();
        if (gGame.isPositionMines && gGame.secPassed < 1) startTimer();
        if (gBoard[i][j].isMine) {
            gGame.lifeCount--;
            renderLife(gGame.lifeCount);
            gLastActions[gLastActions.length - 1].isMine = true
            if (gGame.lifeCount > 0) {
                openModal(1000);
                return;
            } else {
                for (var k = 0; k < gLevel.MINES; k++) {
                    if (!gBoard[gMinesCoords[k].cellI][gMinesCoords[k].cellJ].isShown) {
                        gBoard[gMinesCoords[k].cellI][gMinesCoords[k].cellJ].isShown = true;
                        gGameOverMines.push({ cellI: gMinesCoords[k].cellI, cellJ: gMinesCoords[k].cellJ })
                    }
                }
                renderBoard(gBoard);
                stopTimer();
                gGame.isOn = false;
                gLastActions[gLastActions.length - 1].isOn=false;
                gameOver(-1);
                return;
            }
        } else {
            if (!gBoard[i][j].isShown) gBoard[i][j].isShown = true;
            gLastActions[gLastActions.length - 1].isShown = true;
            gGame.showCount++;
            if (gBoard[i][j].minesAroundCount === 0) expendShown(gBoard, elCell, i, j);
            gLastActions[gLastActions.length - 1].coords = { cellI: i, cellJ: j };
            checkGameOver(gBoard);
            renderBoard(gBoard);
            return;
        }
    }
}
function setRecordMoveTemplate() {
    var move = {
        isHint: false,
        hintNum: 0,
        isSafeClick: false,
        isMarked: false,
        isRemoveMarked: false,
        isMine: false,
        isGameOver: false,
        coords: { cellI: null, cellJ: null },
        coordsExpended: []
    }
    gLastActions.push(move);
}
function continueTimer() {
    gGame.secPassed = gFinishTime;
    gInterval = setInterval(function () {
        gGame.secPassed++;
        renderTimer()
    }, 1000);
    return gInterval;
}


function undo() {
    if (gLastActions.length === 0) return;
    console.log(gLastActions);
    var lastMove = gLastActions[gLastActions.length - 1];
    if (lastMove.isGameOver = true) {
        elBtnEmoji.innerText = SMILEY;
        gGame.isOn = true;
        for (var k = 0; k < gGameOverMines.length; k++) {
            gBoard[gGameOverMines[k].cellI][gGameOverMines[k].cellJ].isShown = false;
        }
        closeModal();
        elModal.innerText = 'OOPS You steped on a mine!';
        // continueTimer();
    }
    if (!lastMove.isMarked && !lastMove.isHint && lastMove.isMine) {
        gGame.lifeCount++;
        renderLife(gGame.lifeCount);
    } else if (lastMove.isHint) {
        document.querySelector(`.hint-button-${lastMove.hintNum}`).innerText = HINT;
        gGame.isHint = false;
        gGame.hints.pop();
    } else if (lastMove.isShown) {
        gBoard[lastMove.coords.cellI][lastMove.coords.cellJ].isShown = false;
        gMineFreeCoords.push({ cellI: lastMove.coords.cellI, cellJ: lastMove.coords.cellJ });
        gGame.showCount--;
        if (lastMove.coordsExpended.length > 0) {
            for (var i = 0; i < lastMove.coordsExpended.length; i++) {
                gBoard[lastMove.coordsExpended[i].cellI][lastMove.coordsExpended[i].cellJ].isShown = false;
                gGame.showCount--;
            }
        }
    } else if (lastMove.isSafeClick) {
        gGame.safeClickCount++;
        elBtnSafeClick.innerText = `SAFE CLICK: ${gGame.safeClickCount}`;
    } else if (lastMove.isMarked) {
        gBoard[lastMove.coords.cellI][lastMove.coords.cellJ].isMarked = false;
    } else if (lastMove.isRemoveMarked) {
        gBoard[lastMove.coords.cellI][lastMove.coords.cellJ].isMarked = true;
    }
    renderBoard(gBoard);
    gLastActions.pop();
}



function checkGameOver(board) {
    renderBoard(board);
    if (gMineFreeCoords.length !== gGame.showCount) return;
    for (var i = 0; i < gMinesCoords.length; i++) {
        if (!board[gMinesCoords[i].cellI][gMinesCoords[i].cellJ].isMarked) return;
    }
    stopTimer();
    gGame.isOn = false;
    gameOver(1);
}

function gameOver(num) {
    if (num > 0) {
        elModal.innerText = 'YOU WON!'
        elBtnEmoji.innerText = CHAMP;
        console.log('You won!');
        openModal(10000);
    } else {
        elModal.innerText = 'GAME OVER!'
        elBtnEmoji.innerText = EXPLODED;
        console.log('Game over!');
        openModal(10000)
    }
    gLastActions[gLastActions.length - 1].isGameOver = true;
}


function expendShown(board, elCell, i, j) {
    for (var m = i - 1; m <= i + 1; m++) {
        if (m < 0 || m > board.length - 1) continue;
        for (var n = j - 1; n <= j + 1; n++) {
            if (n < 0 || n > board[0].length - 1) continue;
            if (m === i && n === j) continue;
            if (board[m][n].isMarked) continue;
            if (board[m][n].isShown) continue;
            if (!board[m][n].isShown) gGame.showCount++;
            if (!board[m][n].isMine) board[m][n].isShown = true;
            gLastActions[gLastActions.length - 1].coordsExpended.push({ cellI: m, cellJ: n });
            if (board[m][n].minesAroundCount === 0) expendShown(board, elCell, m, n);
        }
    }
    renderBoard(board);
}
