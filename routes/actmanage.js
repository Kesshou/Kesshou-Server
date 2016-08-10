/*
*Auther: blackkite0206233
*Description: This file is the API of actmanage.
*/
var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var UserRepository = require('/Kesshou/Repositories/UserRepository');
var CheckCharactersService = require('Kesshou/Services/CheckCharactersService');
var router = express.Router();

/*
*Auther: blackkite0206233
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
    var checkAccount = CheckCharactersService.checkNumberAndAlphabet(user.account);

    if (false) { //just used at debug
        res.status(408);
    } else if(!checkAccount) {
        res.status(406);
    } else if(password == null || bcrypt.compareSync(user.password, password)){
        res.status(401);
    } else {
        var token = bcrypt.genSaltSync(40).toString('base64').substr(7, 20);
        res.status(200).json({ token:  token});
    }

});

/*
*Auther: blackkite0206233
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
    var status = UserRepository.createNewUser(user.email, user.password,
         user.user_group, user.school_account, user.school_pwd, user.nick);

});

/*
*Auther: blackkite0206233
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
    var status = UserRepository.updateUserInfo();

});

module.exports = router;
