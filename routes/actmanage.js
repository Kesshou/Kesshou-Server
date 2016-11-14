/*
*Author: blackkite0206233
*Description: This file is the API of actmanage.
*/
var Promise = require('bluebird');
var express = require('express');
var bcrypt = require('bcrypt-nodejs');

var UserRepository = require('../Kesshou/Repositories/UserRepository');
var RedisRepository = require('../Kesshou/Repositories/RedisRepository');
var ClassRepository = require('../Kesshou/Repositories/ClassRepository');
var GroupRepository = require('../Kesshou/Repositories/GroupRepository');

var CheckCharactersService = require('../Kesshou/Services/CheckCharactersService');
var ErrorCodeService = require('../Kesshou/Services/ErrorCodeService');

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
        RedisRepository.getAccount(token).then(function(result){
            if(result) {
                getUnusedToken().then(resolve);
            } else {
                resolve(token);
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
        getUnusedToken().then(function(result) {
            RedisRepository.checkAccount(result, account);
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
            500: server error.
        token(if login successfully):
            it is a string which was produced by random and it was used to confirmed whether
            the login time is expire or not.
        error(if login failed): it is a string to explain the reason of error.
        code:
            100: password doesn't match.
            101: account doesn't match.
            300: inputs have some illegal chars.
            400: server error.
*/
router.post('/login', function(req, res, next) {
    var user =  req.body;

    if(user.account == undefined || user.password == undefined)
        res.status(200).json({"error" : "非法字元", "code" : ErrorCodeService.illegalChar});

    CheckCharactersService.checkEmail(user.account).then(function() {
            return UserRepository.getUserPassword(user.account);
        }).then(function(result) {
            if(!bcrypt.compareSync(user.password, result)) {
                res.status(200).json({"error" : "密碼錯誤", "code" : ErrorCodeService.pwdError});
            } else {
                createToken(user.account).then(function(result) {
                    res.status(200).json({ "token" :  result});
                });
            }
        }).catch(function(error) {
            switch (error) {
                case "非法字元":
                    res.status(200).json({"error" : error, "code" : ErrorCodeService.illegalChar});
                    break;
                case "帳號錯誤":
                    res.status(200).json({"error" : error, "code" : ErrorCodeService.accountError});
                    break;
                default:
                    res.status(500).json({"error" : "伺服器錯誤", "code" : ErrorCodeService.serverError});
                    break;
            }
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
        code:
            300: inputs have some illegal chars.
            400: server error.
*/
router.post('/register', function(req, res, next) {
    var user =  req.body;

    if(user.password == undefined || user.email == undefined) {
        res.status(200).json({"error" : "非法字元", "code" : ErrorCodeService.illegalChar});
    }

    var hsahPassword = bcrypt.hashSync(user.password);
    var schoolAccount = (user.school_account != undefined) ? user.school_account : "";
    var schoolPwd = (user.school_pwd != undefined) ? user.school_pwd : "";
    var name = (user.name != undefined) ? user.name : "";

    var checkAccount = CheckCharactersService.checkEmail(user.email);
    var checkSchoolAccount = CheckCharactersService.allowNumbersAndAlphabets(schoolAccount);
    var checkSchoolPwd = CheckCharactersService.allowNumbersAndAlphabets(schoolPwd);
    var checkName = CheckCharactersService.checkIllegalChar(name, ["<", ">", ".", "/", "\\", ";", "\'", ":", "\"", "-", "#"]);
    var checkNick = CheckCharactersService.checkIllegalChar(user.nick, ["<", ">", ".", "/", "\\", ";", "\'", ":", "\"", "-", "#"]);
    var checkUserGroup = CheckCharactersService.checkData(user.user_group, ["student", "graduated", "night"]);

    var stuClass = "";
    var finishYear = "";

    Promise.all([checkAccount, checkSchoolAccount, checkSchoolPwd, checkName, checkNick, checkUserGroup]).then(function() {
        return CheckStuWebSpider.checkStuAccount(schoolAccount, schoolPwd, name);
    }).then(function(result) {
        if(user.user_group != "night") {
            name = result[0];
            stuClass = result[1];
        }
        return ClassRepository.getFinishYear(stuClass);
    }).then(function(result) {
        if(user.user_group == "student") {
            finishYear = result;
        }
        UserRepository.getUserPassword(user.email).then(function() {
            res.status(200).json({"status" : "帳號已被使用", "code" : ErrorCodeService.accountUsed});
        }).catch(function() {
            UserRepository.checkSameNick(user.nick).then(function() {
                return UserRepository.createUser(user.email, hsahPassword, user.user_group,
                    schoolAccount, schoolPwd, user.nick, name, stuClass, finishYear);
            }).then(function() {
                return createToken(user.email);
            }).then(function(result) {
                res.status(200).json({ "token" :  result});
            }).catch(function(error) {
                if(error == "暱稱已被使用")
                    res.status(.nickUsed).json({"status" : error, "code" : ErrorCodeService.nickUsed});
                res.status(500).json({"error" : "伺服器錯誤", "code" : ErrorCodeService.serverError});
            });
        });
    }).catch(function(error) {
        switch(error) {
            case "非法字元":
                res.status(200).json({"error" : error, "code" : ErrorCodeService.illegalChar});
                break;
            case "學校驗證錯誤":
                res.status(200).json({"error" : error, "code" : ErrorCodeService.schoolError});
                break;
            default:
                res.status(500).json({"error" : "伺服器錯誤", "code" : ErrorCodeService.serverError});
                break;
        }

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
        401: your token was expired.
        406: the input of school doesn't exist.
        406: your inputs have some illegal chars.
        500: server error.
    success(if update successfully): it is a string to tell you update successfully.
    error(if update failed): it is a string to explain the reason of error.
    code:
        100: password doesn't match.
        102: school sccount or school password doesn't match.
        300: inputs have some illegal chars.
        400: server error.
*/
router.put('/updateinfo', function(req, res, next) {
    var updateData =  req.body;

    RedisRepository.getAccount(updateData.token).then(function(result) {
        if(result) {
            UserRepository.getUserInfo(result).then(function(result) {
                var userInfo = result;
                var newSchoolPwd = (updateData.new_school_pwd != undefined) ? updateData.new_school_pwd : userInfo.school_pwd;
                var newNick = (updateData.new_nick != undefined) ? updateData.new_nick : userInfo.nick;
                var newPassword = (updateData.new_password != undefined) ? bcrypt.hashSync(updateData.new_password) : userInfo.pwd;
                var newEmail = (updateData.new_email != undefined) ? updateData.new_email : userInfo.email;

                var checkAccount = CheckCharactersService.checkEmail(newEmail);
                var checkNick = CheckCharactersService.checkIllegalChar(newNick, ["<", ">", ".", "/", "\\", ";", "\'", ":", "\"", "-", "#"]);
                var checkSchoolPwd = CheckCharactersService.allowNumbersAndAlphabets(newSchoolPwd);

                if (updateData.password == undefined || updateData.password == "" || !bcrypt.compareSync(updateData.password, userInfo.pwd)) {
                    res.status(200).json({"error" : "密碼錯誤", "code" : ErrorCodeService.pwdError});
                } else {
                    Promise.all([checkAccount, checkSchoolPwd, checkNick]).then(function() {
                        return UserRepository.checkSameNick(nick);
                    }).then(function() {
                        UserRepository.getUserPassword(newEmail).then(function() {
                            res.status(200).json({"status" : "帳號已被使用", "code" : ErrorCodeService.accountUsed});
                        }).catch(function() {
                            CheckStuWebSpider.checkStuAccount(userInfo.school_account, newSchoolPwd, userInfo.name).then(function(result) {
                                var newName = result;
                                return UserRepository.updateUserInfo(userInfo.email, newSchoolPwd, newNick, newPassword, newEmail, newName);
                            }).then(function() {
                                RedisRepository.set(updateData.token, userInfo.email);
                                res.status(200).json({ "success" :  "更新成功"});
                            }).catch(function(error) {
                                res.status(500).json({"error" : "伺服器錯誤", "code" : ErrorCodeService.serverError});
                            });
                        });
                    }).catch(function(error) {
                        switch (error) {
                            case "暱稱已被使用":
                                res.status(200).json({"status" : error, "code" : ErrorCodeService.nickUsed});
                                break;
                            case "非法字元":
                                res.status(200).json({"error" : error, "code" : ErrorCodeService.illegalChar});
                                break;
                            case "學校驗證錯誤":
                                res.status(200).json({"error" : error, "code" : ErrorCodeService.schoolError});
                                break;
                            default:
                                res.status(500).json({"error" : "伺服器錯誤", "code" : ErrorCodeService.serverError});
                                break;
                        }
                    });
                }
            }).catch(function(error) {
                res.status(500).json({"error" : error,  "code" : ErrorCodeService.serverError});
            });
        } else {
            res.status(200).json({"error" : "token過期",  "code" : ErrorCodeService.tokenExpired});
        }
    }).catch(function(error) {
        res.status(500).json({"error" : error, "code" : ErrorCodeService.serverError});
    });
});

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to check user's nick.
*Usage:
    status code:
        200: nick can be used.
        401: nick is used.
        406: nick has some illegal chars.
        500: server error.
    success: it is a string to tell you the nick can be used.
    error: it is a string to explain the reason of error.
    code
        300: input has some illegal chars.
        400: server error.
        500: nick is used.
*/
router.post('/confirmNick', function(req, res, next) {
    var nick = req.body.nick;
    CheckCharactersService.checkIllegalChar(nick, ["<", ">", ".", "/", "\\", ";", "\'", ":", "\"", "-", "#"]).then (function() {
        return UserRepository.checkSameNick(nick);
    }).then(function() {
        res.status(200).json({"success" : "暱稱無人使用"});
    }).catch(function(error) {
        if(error == "暱稱已被使用") {
            res.status(200).json({"error" : error, "code" : ErrorCodeService.nickUsed});
        } else if(error == "非法字元") {
            res.status(200).json({"error" : error, "code" : ErrorCodeService.illegalChar});
        } else {
            res.status(500).json({"error" : "伺服器錯誤", "code" : ErrorCodeService.serverError});
        }
    });
});

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to check user's account.
*Usage:
    status code:
        200: account can be used.
        401: account is used.
        406: account has some illegal chars.
    success: it is a string to tell you the account can be used.
    error: it is a string to explain the reason of error.
    code:
        300: input has some illegal chars.
        500: account is used.
*/
router.post('/confirmAccount', function(req, res, next) {
    var account = req.body.account;
    CheckCharactersService.checkEmail(account).then(function() {
        return UserRepository.getUserPassword(account);
    }).then(function() {
        res.status(200).json({"error" : "帳號已被使用", "code" : ErrorCodeService.accountUsed});
    }).catch(function(error) {
        console.log(error);
        if(error == "非法字元") {
            res.status(200).json({"error" : error, "code" : ErrorCodeService.illegalChar});
        } else {
            res.status(200).json({"success" : "帳號無人使用"});
        }
    });
});

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to check user's school account.
*Usage:
    status code:
        200: school account is correct.
        406: account has some illegal chars or the school account is incorrect..
        500: server error.
    success: it is a string to tell you the school account is correct.
    error: it is a string to explain the reason of error.
    code:
        102: school account is incorrect.
        300: input has some illegal chars.
        400: server error.
*/
router.post('/confirmSchool', function(req, res, next) {
    var schoolAccount = req.body.schoolAccount;
    var schoolPwd = req.body.schoolPwd;

    var checkAccount = CheckCharactersService.allowNumbersAndAlphabets(schoolAccount);
    var checkPwd = CheckCharactersService.allowNumbersAndAlphabets(schoolPwd);

    Promise.all([checkAccount, schoolPwd]).then(function() {
        return CheckStuWebSpider.checkStuAccount(schoolAccount, schoolPwd, "");
    }).then(function() {
        res.status(200).json({"success" : "學校驗證正確"});
    }).catch(function(error) {
        switch(error) {
            case "非法字元":
                res.status(200).json({"error" : error, "code" : ErrorCodeService.illegalChar});
                break;
            case "學校驗證錯誤":
                res.status(200).json({"error" : error, "code" : ErrorCodeService.schoolError});
                break;
            default:
                res.status(500).json({"error" : "伺服器錯誤", "code" : ErrorCodeService.serverError});
                break;
        }
    });
});

router.post('/getUserInfo', function(req, res, next) {
    var token = req.body.token;
    var user = {};
    return new Promise(function(resolve, reject) {
        RedisRepository.getUserData(token).then(function(result) {
            if(result) {
                user.name = result.name;
                user.class = result.class;
                user.nick = result.nick;
                GroupRepository.getGroupName(result.group_id).then(function(result) {
                    user.group = result;
                    res.status(200).json(user);
                }).catch(function(error) {
                    res.status(500).json({"error" : "伺服器錯誤", "code" : ErrorCodeService.serverError});
                });
            } else {
                res.status(200).json({"error" : "token過期",  "code" : ErrorCodeService.tokenExpired});
            }
        }).catch(function(error) {
            res.status(500).json({"error" : "伺服器錯誤", "code" : ErrorCodeService.serverError});
        });
    });
});

module.exports = router;
