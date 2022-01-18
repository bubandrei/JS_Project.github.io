// "use strict";
btnScore.addEventListener('click', showScore);//показываем результат на кнопке Score в меню
let arrResult = [];
let inputName = document.createElement('input');
inputName.innerHTML = 'Input your name';
let saveName = document.createElement('button');
saveName.innerHTML = 'Save result';
saveName.addEventListener('click', storeInfo)
function saveResult() {
wrap.append(inputName);
wrap.append(saveName);
}
let showList = document.createElement('div');
showList.classList = "resultStyle";

let ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
let updatePassword;
let stringName = 'BUBELEV_TEST_INFO';

// let arr = [];


function storeInfo() {
    updatePassword = Math.random();
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
        console.log(arrResult)
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

function restoreInfo() {
    $.ajax(
        {
            url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
            data: { f: 'READ', n: stringName },
            success: readReady, error: errorHandler
        }
    );
}

function readReady(callresult) {
    if (callresult.error != undefined)
        alert(callresult.error);
    else if (callresult.result != "") {
        let info = JSON.parse(callresult.result);
        // document.getElementById('IName').value = info.name;
        // document.getElementById('IAge').value = info.age;
    }
}

function errorHandler(jqXHR, statusStr, errorStr) {
    alert(statusStr + ' ' + errorStr);
}

restoreInfo();

function showScore() {
    // let StringName = document.getElementById('Name').value;
  
        $.ajax(
        {
            url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
            data: { f: 'READ', n: stringName },
            success: ReadReady, error: ErrorHandler
        }
    );
}

function ReadReady(ResultH) {
    // showList = JSON.parse(ResultH.result)
    // console.log(typeof showList)
    if (ResultH.error != undefined)
        alert(ResultH.error);
    else {
        var strName='';
        strScore='';
        arrResult=JSON.parse(ResultH.result);
        function compareScores(A,B) {
            return B.score-A.score;
        }
        arrResult.sort(compareScores);
     function getFrom(V,I,A) {
       strName+=`<div class = "resultFlex"><span>${V.name}</span><span>${V.score}</span></div>`;
    //    strScore+=V.score+"<br />";
     }
     arrResult.forEach(getFrom)
      showList.innerHTML=strName + strScore;
    //   document.getElementById('IAge').innerHTML=strScore;
     
         btnStart.remove();
        btnRules.remove();
        btnScore.remove();
        wrap.append(btnMainMenu);
        // arr = ResultH.result;
        // showList.innerHTML = ResultH.result;
        wrap.append(showList)
    }
}

function ErrorHandler(jqXHR, StatusStr, ErrorStr) {
    alert(StatusStr + ' ' + ErrorStr);
}