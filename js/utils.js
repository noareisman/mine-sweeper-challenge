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

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function openModal(milisec) {
    elModal.style.display = 'block';
    setTimeout(closeModal, milisec)
}

function closeModal() {
    elModal.style.display = 'none'
}


//FOR UNDO BONUS
// function copyMat(mat) {
//     var newMat = [];
//     for (var i = 0; i < mat.length; i++) {
//         newMat[i] = [];
//         for (var j = 0; j < mat[0].length; j++) {
//             newMat[i][j] = mat[i][j];
//         }
//     }
//     return newMat;
// }



