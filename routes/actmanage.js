/*
*Author: blackkite0206233
*Description: This file is the API of actmanage.
*/
var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var UserRepository = require('/Kesshou/Repositories/UserRepository');
var RedisRepository = require('/Kesshou/Repositories/RedisRepository');
var CheckCharactersService = require('Kesshou/Services/CheckCharactersService');
var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is used to create a token.
*Usage:
    account: user's account.
    return:
        token: a sentence contains 20 random characters.
*/
function createToken(account) {
    var token = bcrypt.genSaltSync(40).toString('base64').substr(7, 20);
    while(RedisRepository.getAccount(token) != "") {
        token = bcrypt.genSaltSync(40).toString('base64').substr(7, 20);
    }
    RedisRepository.set(account, token);
    return token;
}

/*
*Author:
*Description:
    This function is used to confirm user's school account and password.
*Usage:
    schoolAccount: user's school account.
    schoolPwd: user's school password.
    return:
        name: student's name, if the user's school account and password isn't valid, return "".
*/
function confirmSchoolAccAndPwd(schoolAccount, schoolPwd) {
    /*code*/
}

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to confirm user's account and password.
*Usage:
    return:
        status code:
            200: login successfully.
            401: your account or password is wrong.
            406: your inputs have some illegal chars.
            408: your token was expired.(just used at debug)
        token(if login successfully):
            It is a string which was produced by random and it was used to confirmed whether
            the login time is expire or not.
        error(if login failed):
            It is a string to explain the reason of error.
*/
router.get('/login', function(req, res, next) {
    var user = JSON.parse(req.body);
    var password = UserRepository.getUserPassword(user.account);
    var checkAccount = CheckCharactersService.checkEmail(user.account);

    if (false) { //just used at debug
        res.status(408).json({"error" : "Token過期"});
    } else if(!checkAccount) {
        res.status(406).json({"error" : "非法字元"});
    } else if(!bcrypt.compareSync(user.password, password)){
        res.status(401).json({"error" : "帳號密碼錯誤"});
    } else {
        var token = this.createToken(user.account);
        res.status(200).json({ "token" :  token});
    }

});

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to register a new user.
*Usage:
    return:
        status code:
            200: register successfully.
            401: this account has been used.
            406: the input of school doesn't exist.
            406: your inputs have some illegal chars.
        token(if register successfully):
            It is a string which was produced by random and it was used to confirmed whether
            the login time is expire or not.
        error(if register failed):
            It is a string to explain the reason of error.
*/
router.get('/register', function(req, res, next) {
    var user = JSON.parse(req.body);
    var hsahPassword = bcrypt.hashSync(user.password);
    var schoolAccount = (typeof(user.school_account) != "undefined") ? user.school_account : "";
    var schoolPwd = (typeof(user.school_pwd) != "undefined") ? user.school_pwd : "";
    var name = (typeof(user.name) != "undefined") ? user.name : confirmSchoolAccAndPwd(schoolAccount, schoolPwd);

    var checkEmail = CheckCharactersService.checkEmail(user.email);
    var checkSchoolAccount = CheckCharactersService.allowNumbersAndAlphabets(schoolAccount);
    var checkSchoolPwd = CheckCharactersService.allowNumbersAndAlphabets(schoolPwd);
    var checkNick = CheckCharactersService.allowNumbersAndAlphabets(user.nick);
    var checkUserGroup = CheckCharactersService.checkData(user.user_group,
         ["student", "graduated", "outside"]);

    var checkAccount = UserRepository.getUserPassword(user.email);

    if(!(checkEmail && checkSchoolAccount && checkSchoolPwd && checkNick && checkUserGroup)) {
        res.status(406).json({"error" : "非法字元"});
    } else if(name == "") {
        res.status(406).json({"error" : "學校驗證錯誤"});
    } else if(checkAccount != "") {
        res.status(401).json({"error" : "帳號已被使用"});
    } else {
        var status = UserRepository.createNewUser(user.email, hsahPassword,
             user.user_group, schoolAccount, schoolPwd, user.nick, name);
        if(status) {
            var token = this.createToken(user.email);
            res.status(200).json({ "token" :  token});
        } else {
            res.status(500).json({"error" : "伺服器錯誤"});
        }
    }

});

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to update user's information.
*Usage:
    status code:
        200: update successfully.
        401: your account or password is wrong.
        406: the input of school doesn't exist.
        406: your inputs have some illegal chars.
    success(if update successfully):
        It is a string to tell you update successfully.
    error(if update failed):
        It is a string to explain the reason of error.
*/
router.get('/updateinfo', function(req, res, next) {
    var updateData = JSON.parse(req.body);
    var account = RedisRepository.getAccount(updateData.token);
    if(account == ""){
        res.status(408).json({"error" : "Token過期"});
    }

    var userInfo = UserRepository.getUserInfo(account);

    if(userInfo == null) {
        res.status(500).json({"error" : "伺服器錯誤"});
    }

    var newSchoolPwd =
        (typeof(updateData.new_school_pwd) != "undefined") ? updateData.new_school_pwd : userInfo.school_pwd;
    var newNick =
        (typeof(updateData.new_nick) != "undefined") ? updateData.new_nick : userInfo.nick;
    var newPassword =
        (typeof(updateData.new_password) != "undefined") ? bcrypt.hashSync(updateData.new_password) : userInfo.pwd;
    var newEmail =
        (typeof(updateData.new_email) != "undefined") ? updateData.new_email : userInfo.email;

    var checkEmail = CheckCharactersService.checkEmail(newEmail);
    var checkSchoolPwd = CheckCharactersService.allowNumbersAndAlphabets(newSchoolPwd);
    var checkNick = CheckCharactersService.allowNumbersAndAlphabets(newNick);
    var checkAccount = UserRepository.getUserPassword(newEmail);

    if(!(checkEmail && checkSchoolPwd && newEmail)) {
        res.status(406).json({"error" : "非法字元"});
    } else if(confirmSchoolAccAndPwd(userInfo.school_account, newSchoolPwd) == "") {
        res.status(406).json({"error" : "學校驗證錯誤"});
    } else if (newEmail != userInfo.email && checkAccount != "") {
        res.status(401).json({"error" : "帳號已被使用"});
    } else if (!bcrypt.compareSync(updateData.password, userInfo.pwd)) {
        res.status(401).json({"error" : "帳號密碼錯誤"});
    } else {
        var status = UserRepository.updateUserInfo(account, newSchoolPwd, checkNick, newPassword, newEmail);
        if(status) {
            res.status(200).json({ "success" :  "更新成功"});
        } else {
            res.status(500).json({"error" : "伺服器錯誤"});
        }
    }
});

module.exports = router;
