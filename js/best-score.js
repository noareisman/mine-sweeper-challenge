// 'use strict';
// var gBegginerScores = createBestTimesTemplate(5);
// var gMediumScores = createBestTimesTemplate(5);
// var gExpertScores = createBestTimesTemplate(5);

// var gAllLevelsBestScoresLists = {
//     4: gBegginerScores,
//     8: gMediumScores,
//     12: gExpertScores,
// }


// function createBestTimesTemplate(numOfPlaces) {
//     var gamersScores = [];
//     for (var i = 0; i < numOfPlaces - 1; i++) {
//         gamersScores.push([['NOA'], ['40']]);
//     }
//     return gamersScores;
// }

// function getLastPlaceTime(level) {
//     var lastPlaceTime = gAllLevelsBestScoresLists.level[gAllLevelsBestScoresLists.level.length - 1][1];
//     return lastPlaceTime;
// }
// // isBestScore


// function checkIfBestScore(time, level) {
//     if (time < getLastPlaceTime(level)) {
//         var name = prompt('YOU GOT TO THE BEST-SCORES LIST!!!\n Please enter your name');
//         var newChamp = [name, time];
//         var placeIdx = gAllLevelsBestScoresLists.level.length - 1
//         while (time < gAllLevelsBestScoresLists.level[i][1] && i >= 0) {
//             placeIdx--;
//             i--;
//         }
//         gAllLevelsBestScoresLists.level.splice(placeIdx, 0, newChamp);
//         gAllLevelsBestScoresLists.level.pop();
//         return gAllLevelsBestScoresLists;
//     } else {
//         return;
//     }
// }

// function renderBestScoreTable(level) {
//     var strHTML = '<table border="2" class="score-table"><tbody>';
//     for (var i = 0; i < level.length; i++) {
//         strHTML += '<tr>\n';
//         for (var j = 0; j < level[0].length; j++) {
//             var cell = gAllLevelsBestScoresLists.level[i][j];
//             strHTML += `\t<td class="score-td">\n${cell}\t</td>\n`
//         }
//         strHTML += '</tr>'
//     }
//     strHTML += '</tbody></table>';
//     var elBestScoreContainer = document.querySelector('.best-score-container');
//     elBestScoreContainer.innerHTML = strHTML;
// }




