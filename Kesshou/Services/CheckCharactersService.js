/*
*Author: blackkite0206233
*Description: This file is used to check the sentence whether it has some illegal characters.
*/

/*
*Author: blackkite0206233
*Description:
    This function is used to check the sentence only has numbers and alphabets.
*Usage:
    input: a sentence which you want to check.
    return: if the input only has numbers and alphabets, return true, otherwise return false.
*/
var allowNumbersAndAlphabets = function(input) {
    if(input == "") {
        return true;
    }
    for (var i = 0; i < input.length; i++) {
        if(!(input[i] >= "0" && input[i] <= "9" ||
            input[i] >= "A" && input[i] <= "Z" ||
            input[i] >= "a" && input[i] <= "z")) {
            return false;
        }
    }
    return true;
}

/*
*Author: blackkite0206233
*Description:
    This function is used to check Email's format.
*Usage:
    input: an email which you want to check.
    return: if the input matchs the format, return true, otherwise return false.
*/
var checkEmail = function(input) {
    var emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    if(input.search(emailRule) != -1) {
        return true;
    } else {
        return false;
    }
}

/*
*Author: blackkite0206233
*Description:
    This function is used to check whether the input exists in the checkData array.
*Usage:
    input: a sentence which you want to check.
    checkData: an array contains several item, and the input should exists in it.
    return: if the input exists in the array, return true, otherwise return false.
*/
var checkData = function(input, checkData) {
    for (var i = 0; i < checkData.length; i++) {
        if(input == checkData[i]) {
            return true;
        }
    }
    return false;
}

module.exports = {
    /*
    *Author: blackkite0206233
    *Description:
        This function is used to check the sentence whether it has some illegal characters.
    *Usage:
        input: a sentence which you want to check.
        illegalCharacters: a sentence include all illegal characters which you don't want the input has.
        return: if the input contains illegal characters, return false, otherwise return true.
    */
    // checkIllegalCharacters: function(input, illegalCharacters = "") {
    //     if(input == "") {
    //         return true;
    //     }
    //     for (var i = 0; i < checkCode.length; i++) {
    //         if(input.indexOf(checkCode[i]) < 0)
    //             return false;
    //     }
    //     return true;
    // }

    allowNumbersAndAlphabets: allowNumbersAndAlphabets,

    checkEmail: checkEmail,

    checkData: checkData
}
