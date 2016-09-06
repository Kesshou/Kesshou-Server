/*
*Author: blackkite0206233
*Description: This file is the API of actmanage.
*/
var Promise = require('bluebird');
var express = require('express');
var bcrypt = require('bcrypt-nodejs');

var UserRepository = require('../Kesshou/Repositories/UserRepository');
var RedisRepository = require('../Kesshou/Repositories/RedisRepository');
var CheckCharactersService = require('../Kesshou/Services/CheckCharactersService');
var CheckStuWebSpider = require('../Kesshou/WebSpiders/CheckStuWebSpider');

var router = express.Router();

/*
*Author: blackkite0206233
*Description: A function used to get an unused token.  Used promise.
*Usage:
    resolve: token;
*/
var getUnusedToken = function() {
    var token = bcrypt.genSaltSync(40).toString('base64').substr(7, 20);
    return new Promise(function(resolve, reject) {
        RedisRepository.getAccount(token)
            .then(function(result){
                if(result == null) {
                    resolve(token);
                } else {
                    getUnusedToken().then(resolve);
                };
            })
    });
}


/*
*Author: blackkite0206233
*Description:
    This function is used to create a token.  Used promise.
*Usage:
    account: user's account.
    return:
        resolve: token.
*/
var createToken = function(account) {
    return new Promise(function(resolve, reject) {
        getUnusedToken()
            .then(function(result) {
                RedisRepository.set(result, account);
                resolve(result);
            });
    })
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
            it is a string which was produced by random and it was used to confirmed whether
            the login time is expire or not.
        error(if login failed): it is a string to explain the reason of error.
*/
router.post('/login', function(req, res, next) {
    var user =  req.body;

    CheckCharactersService.checkEmail(user.account)
    .then(function(){
        UserRepository.getUserPassword(user.account, "")
        .then(function() {
            if(undefined == user.password || !bcrypt.compareSync(user.password, password)) {
                res.status(401).json({"error" : "密碼錯誤"});
            } else {
                this.createToken(user.account)
                .then(function(result) {
                    res.status(200).json({ "token" :  result});
                });
            }
        })
        .catch(function(error) {
            res.status(401).json({"error" : error});
        });
    })
    .catch(function(error) {
        res.status(406).json({"error" : error});
    });
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
            500: server error.
        token(if register successfully):
            it is a string which was produced by random and it was used to confirmed whether
            the login time is expire or not.
        error(if register failed): it is a string to explain the reason of error.
*/
router.post('/register', function(req, res, next) {
    var user =  req.body;
    if(user.password == undefined || user.password == "") {
        res.status(406).json({"error" : "非法字元"});
    }
    var hsahPassword = bcrypt.hashSync(user.password);
    var schoolAccount = (user.school_account != undefined) ? user.school_account : "";
    var schoolPwd = (user.school_pwd != undefined) ? user.school_pwd : "";
    var name = (user.name != undefined) ? user.name : "";

    var checkEmail = CheckCharactersService.checkEmail(user.email);
    var checkSchoolAccount = CheckCharactersService.allowNumbersAndAlphabets(schoolAccount);
    var checkSchoolPwd = CheckCharactersService.allowNumbersAndAlphabets(schoolPwd);
    var checkNick = CheckCharactersService.allowNumbersAndAlphabets(user.nick);
    var checkUserGroup = CheckCharactersService.checkData(user.user_group, ["student", "graduated", "outside"]);

    Promise.all([checkEmail, checkSchoolAccount, checkSchoolPwd, checkNick, checkUserGroup])
    .then(function() {
        CheckStuWebSpider.checkStuAccount(schoolAccount, schoolPwd, name)
        .then(function(result) {
            var userName = result;
            UserRepository.getUserPassword(user.email, "")
            .then(function(result) {
                res.status(401).json({"error" : "帳號已被使用"});
            })
            .catch(function(error) {
                UserRepository.createUser(user.email, hsahPassword, user.user_group, schoolAccount, schoolPwd, user.nick, userName)
                .then(function() {
                    createToken(user.account)
                    .then(function(result) {
                        res.status(200).json({ "token" :  result});
                    });
                })
                .catch(function(error) {
                    res.status(500).json({"error" : error});
                });
            });
        })
        .catch(function(error) {
            res.status(406).json({"error" : error});
        });
    })
    .catch(function(error) {
        res.status(406).json({"error" : error});
    });
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
        408: your token was expired.
        500: server error.
    success(if update successfully): it is a string to tell you update successfully.
    error(if update failed): it is a string to explain the reason of error.
*/
router.put('/updateinfo', function(req, res, next) {
    var updateData =  req.body;

    RedisRepository.getAccount(updateData.token)
    .then(function(result) {
        UserRepository.getUserInfo(result)
        .then(function(result) {
            var userInfo = result;
            var newSchoolPwd = (updateData.new_school_pwd != undefined) ? updateData.new_school_pwd : userInfo.school_pwd;
            var newNick = (updateData.new_nick != undefined) ? updateData.new_nick : userInfo.nick;
            var newPassword = (updateData.new_password != undefined) ? bcrypt.hashSync(updateData.new_password) : userInfo.pwd;
            var newEmail = (updateData.new_email != undefined) ? updateData.new_email : userInfo.email;

            var checkEmail = CheckCharactersService.checkEmail(newEmail);
            var checkSchoolPwd = CheckCharactersService.allowNumbersAndAlphabets(newSchoolPwd);
            var checkNick = CheckCharactersService.allowNumbersAndAlphabets(newNick);

            if (updateData.password == undefined || updateData.password == "" || !bcrypt.compareSync(updateData.password, userInfo.pwd)) {
                res.status(401).json({"error" : "帳號密碼錯誤"});
            } else {
                Promise.all([checkEmail, checkSchoolPwd, checkNick])
                .then(function() {
                    CheckStuWebSpider.checkStuAccount(userInfo.school_account, newSchoolPwd, userInfo.name)
                    .then(function(result) {
                        var newName = result;
                        UserRepository.getUserPassword(newEmail, userInfo.email)
                        .then(function(result) {
                            res.status(401).json({"error" : "帳號已被使用"});
                        })
                        .catch(function(error) {
                            UserRepository.updateUserInfo(userInfo.email, newSchoolPwd, newNick, newPassword, newEmail, newName)
                            .then(function() {
                                RedisRepository.set(updateData.token, userInfo.email);
                                res.status(200).json({ "success" :  "更新成功"});
                            })
                            .catch(function(error) {
                                res.status(500).json({"error" : error});
                            });
                        });
                    })
                    .catch(function(error) {
                        res.status(406).json({"error" : error});
                    });
                })
                .catch(function(error) {
                    res.status(406).json({"error" : error});
                });
            }
        })
        .catch(function(error) {
            res.status(500).json({"error" : error});
        });
    })
    .catch(function(error) {
        res.status(408).json({"error" : error});
    });
});

module.exports = router;
