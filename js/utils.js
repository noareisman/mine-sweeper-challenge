function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}




// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle() {
    var randIdx, keep, i;
    for (i = gNumbers.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, gNumbers.length - 1);
        keep = gNumbers[i];
        gNumbers[i] = gNumbers[randIdx];
        gNumbers[randIdx] = keep;
    }
    return gNumbers;
}


function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function restartGame(selector) {
    var strHTML = ''
    switch (selector) {
        case '.modal1':
            strHTML += '<div>GAME OVER!</div>\n'
            break;
        case '.modal2':
            strHTML += '<div>YOU WIN!</div>\n'
    }
    strHTML += '<button onclick="init()">Restart</button>';
    var elModal = document.querySelector(selector);
    elModal.innerHTML = strHTML;
    elModal.style.display = 'block';
}

function timer() {
    startTime = Date.now();
    gInterval = setInterval(function (){
        elapsedTime = Date.now() - startTime;
        elTimer=document.querySelector('.timer')
        elTimer.innerHTML = (elapsedTime / 1000).toFixed(3);
    }, 100);
}




