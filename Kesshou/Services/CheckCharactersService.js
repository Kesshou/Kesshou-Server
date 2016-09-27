/*
*Author: blackkite0206233
*Description: This file is used to check the sentence whether it has some illegal characters.
*/
var Promise = require('bluebird');
/*
*Author: blackkite0206233
*Description:
    This function is used to check the sentence only has numbers and alphabets.  Used promise.
*Usage:
    input: a sentence which you want to check.
    return:
        resolve:
        reject: "非法字元".
*/
var allowNumbersAndAlphabets = function(input) {
    return new Promise(function(resolve, reject) {
        if(input == "") {
            resolve();
        }
        for (var i = 0; i < input.length; i++) {
            if(!(input[i] >= "0" && input[i] <= "9" ||
                input[i] >= "A" && input[i] <= "Z" ||
                input[i] >= "a" && input[i] <= "z")) {
                reject("非法字元");
            }
        }
        resolve();
    })

}

/*
*Author: blackkite0206233
*Description:
    This function is used to check if the sentence has illegal characters.  Used promise.
*Usage:
    input: a sentence which you want to check.
    check: an array has illegal characters.
    return:
        resolve:
        reject: "非法字元".
*/
var checkIllegalChar = function(input, checkArray) {
    return new Promise(function(resolve, reject) {
        for(var i = 0; i < checkArray.length; i++){
            if(input.indexOf(checkArray[i]) != -1) {
                reject("非法字元");
            }
        }
        resolve();
    });

}

/*
*Author: blackkite0206233
*Description:
    This function is used to check Email's format.  Used promise.
*Usage:
    input: an email which you want to check.
    return:
        resolve:
        reject: "非法字元".
*/
var checkEmail = function(input) {
    var emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    return new Promise(function(resolve, reject) {
        if(input.search(emailRule) != -1) {
            resolve();
        } else {
            reject("非法字元");
        }
    })

}

/*
*Author: blackkite0206233
*Description:
    This function is used to check whether the input exists in the checkData array.  Used promise.
*Usage:
    input: a sentence which you want to check.
    checkData: an array contains several item, and the input should exists in it.
    return:
        resolve:
        reject: "非法字元".
*/
var checkData = function(input, checkData) {
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < checkData.length; i++) {
            if(input == checkData[i]) {
                resolve();
            }
        }
        reject("非法字元");
    });

}

module.exports = {
    allowNumbersAndAlphabets: allowNumbersAndAlphabets,

    checkIllegalChar: checkIllegalChar,

    checkEmail: checkEmail,

    checkData: checkData
}
