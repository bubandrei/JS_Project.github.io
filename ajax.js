"use strict";
console.log(score)
let ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
let updatePassword;
let stringName = 'LOKTEV_TEST_INFO';

function storeInfo() {
    updatePassword = Math.random();
    $.ajax({
        url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
        data: { f: 'LOCKGET', n: stringName, p: updatePassword },
        success: lockGetReady, error: errorHandler
    }
    );
}

function lockGetReady(callresult) {
    if (callresult.error != undefined)
        alert(callresult.error);
    else {
        // нам всё равно, что было прочитано -
        // всё равно перезаписываем
        let info = {
            name: document.getElementById('IName').value,
            age: document.getElementById('IAge').value
        };
        $.ajax({
            url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
            data: { f: 'UPDATE', n: stringName, v: JSON.stringify(info), p: updatePassword },
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
        document.getElementById('IName').value = info.name;
        document.getElementById('IAge').value = info.age;
    }
}

function errorHandler(jqXHR, statusStr, errorStr) {
    alert(statusStr + ' ' + errorStr);
}

restoreInfo();

function Read() {
    let StringName = document.getElementById('Name').value;
    $.ajax(
        {
            url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
            data: { f: 'READ', n: StringName },
            success: ReadReady, error: ErrorHandler
        }
    );
}

function ReadReady(ResultH) {
    if (ResultH.error != undefined)
        alert(ResultH.error);
    else {
        document.getElementById('Value').innerHTML = ResultH.result;
    }
}

function ErrorHandler(jqXHR, StatusStr, ErrorStr) {
    alert(StatusStr + ' ' + ErrorStr);
}