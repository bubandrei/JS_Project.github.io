"use strict";
btnScore.addEventListener('click', showScore);//показываем результат на кнопке Score в меню
let arrResult = [];
let inputName = document.createElement('input');
// inputName.innerHTML = 'Input your name';
inputName.classList = 'inputName';
inputName.setAttribute('placeholder','Input your name')
const headerResult = document.createElement('div');
headerResult.classList = 'headResult';
headerResult.innerText = 'Result';
const saveName = document.createElement('button');
saveName.innerHTML = 'Save result';
saveName.classList = 'btnSave';
saveName.addEventListener('click', storeInfo)
function saveResult() {
    wrap.append(inputName);
    wrap.append(saveName);
}
let showList = document.createElement('div');
showList.classList = "resultStyle";

var ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
let updatePassword;
let stringName = 'BUBELEV_TEST_INFO';

function storeInfo() {
    updatePassword = Math.random();
    console.log(updatePassword)
    $.ajax({
        url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
        data: { f: 'LOCKGET', n: stringName, p: updatePassword },
        success: lockGetReady, error: errorHandler
    }
    );
    backMenu();
}
function lockGetReady(callresult) {
    if (callresult.error != undefined)
        alert(callresult.error);
    else {
        // нам всё равно, что было прочитано -
        // всё равно перезаписываем
        let info = {
            name: inputName.value,
            score: score
        };
        arrResult.push(info)
        $.ajax({
            url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
            data: { f: 'UPDATE', n: stringName, v: JSON.stringify(arrResult), p: updatePassword },
            success: updateReady, error: errorHandler
        }
        );
    }
}

function updateReady(callresult) {
    if (callresult.error != undefined)
        alert(callresult.error);
}

// function restoreInfo() {
//     $.ajax(
//         {
//             url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
//             data: { f: 'READ', n: stringName },
//             success: readReady, error: errorHandler
//         }
//     );
// }

// function readReady(callresult) {
//     if (callresult.error != undefined)
//         alert(callresult.error);
//     else if (callresult.result != "") {
//         let info = JSON.parse(callresult.result);
//     }
// }
// function errorHandler(jqXHR, statusStr, errorStr) {
//     alert(statusStr + ' ' + errorStr);
// }
function showScore() {
    $.ajax(
        {
            url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
            data: { f: 'READ', n: stringName },
            success: ReadReady, error: ErrorHandler
        }
    );
}
function ReadReady(ResultH) {
    if (ResultH.error != undefined)
        alert(ResultH.error);
    else {
        var strName = '';
        var strScore = '';
        arrResult = JSON.parse(ResultH.result);
        function compareScores(A, B) {
            return B.score - A.score;
        }
        arrResult.sort(compareScores);
        function getFrom(V, I, A) {
            strName += `<div class = "resultFlex"><span>${V.name}</span><span>${V.score}</span></div>`;
        }
        arrResult.forEach(getFrom)
        showList.innerHTML = strName + strScore;
        btnStart.remove();
        btnRules.remove();
        btnScore.remove();
        wrap.append(headerResult);
        wrap.append(btnMainMenu);
        wrap.append(showList)
    }
}
function ErrorHandler(jqXHR, StatusStr, ErrorStr) {
    alert(StatusStr + ' ' + ErrorStr);
}
// restoreInfo();
if (window.jQuery) {
    console.log('ok')
}


