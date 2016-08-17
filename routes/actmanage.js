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

function createToken(account) {
    var token = bcrypt.genSaltSync(40).toString('base64').substr(7, 20);
    while(RedisRepository.getAccount(token) != "") {
        token = bcrypt.genSaltSync(40).toString('base64').substr(7, 20);
    }
    RedisRepository.set(account, token);
    return token;
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
*/
router.get('/login', function(req, res, next) {
    var user = JSON.parse(req.body);
    var password = UserRepository.getUserPassword(user.account);
    var checkAccount = CheckCharactersService.allowNumbersAndAlphabets(user.account);

    if (false) { //just used at debug
        res.status(408);
    } else if(!checkAccount) {
        res.status(406);
    } else if(password == null || bcrypt.compareSync(user.password, password)){
        res.status(401);
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
*/
router.get('/register', function(req, res, next) {
    var user = JSON.parse(req.body);
    var hsahPassword = bcrypt.hashSync(user.password);
    var schoolAccount = (typeof(user.school_account) != "undefined") ? user.school_account : "";
    var schoolPwd = (typeof(user.school_pwd) != "undefined") ? user.school_pwd : "";

    var checkEmail = CheckCharactersService.checkEmail(user.email);
    var checkSchoolAccount = CheckCharactersService.checkIllegalCharacters(schoolAccount);
    var checkSchoolPwd = CheckCharactersService.checkIllegalCharacters(schoolPwd);
    var checkNick = CheckCharactersService.checkIllegalCharacters(user.nick);
    var checkUserGroup = CheckCharactersService.checkData(user.user_group,
         ["student", "graduated", "outside"]);

    var checkAccount = UserRepository.getUserPassword(user.email);

    if(!(checkEmail && checkSchoolAccount && checkSchoolPwd && checkNick)) {
        res.status(406);
    }
    else if(!checkUserGroup) {
        res.status(406);
    } else if(checkAccount != "") {
        res.status(401);
    } else {
        var status = UserRepository.createNewUser(user.email, hsahPassword,
             user.user_group, schoolAccount, schoolPwd, user.nick);
        if(status) {
            var token = this.createToken(user.email);
            res.status(200).json({ "token" :  token});
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
*/
router.get('/updateinfo', function(req, res, next) {
    var user = JSON.parse(req.body);

    var userInfo = UserRepository.getUserInfo()

    var newSchoolPwd =
        (typeof(user.new_school_pwd) != "undefined") ? user.new_school_pwd : userInfo.school_pwd;
    var newNick =
        (typeof(user.new_nick) != "undefined") ? user.new_nick : userInfo.nick;
    var newPassword =
        (typeof(user.new_password) != "undefined") ? user.new_password : userInfo.pwd;
    var newEmail =
        (typeof(user.new_email) != "undefined") ? user.new_email : userInfo.email;


    var status = UserRepository.updateUserInfo();

});

module.exports = router;
