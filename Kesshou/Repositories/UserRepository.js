/*
*Author: blackkite0206233,yoyo930021
*Description: This file is used to control the user's data..
*/
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../../models'));
/*
*Author: blackkite0206233,yoyo930021
*Description:
    This function is used to get the use's password.
*Usage:
    account: user's account(email).
    return: user's password, if the account doen't exist, return "".
*/
var getUserPassword = function(account, oldAccount) {
    return new Promise(function(resolve, reject) {
        if(oldAccount == account) {
            reject("old");
        } else {
            models.Account.findOne({ where: {email: account} })
            .then(function(result){
                resolve(result.get("pwd"));
            })
            .catch(function(error) {
                //debug(error.toString());
                reject("帳號有誤");
            });
        }
    });
}

/*
*Author: blackkite0206233,yoyo930021
*Description:
    This function is used to create a new user.
*Usage:
    email: user's email(account).
    password: user's password.
    userGroup: user's status(student or graduated or outside).
    schoolAccount: user's school account(optional).
    schoolPwd: user's school password(optional).
    nick: user's nick.
    return: if create successfully, return true, otherwise return false.
*/
var createUser = function (email, password, userGroup, schoolAccount, schoolPwd, nick, name) {
    return new Promise(function(resolve, reject) {
        models.Group.findOne({ where: {comment: userGroup} })
        .then(function(group){
            var NewAccount={
                email:email,
                pwd:password,
                group_id:group.get("id"),
                school_account:schoolAccount,
                school_pwd:schoolPwd,
                nick:nick,
                name:name
            }
            models.Account.create(NewAccount)
            .then(function(account) {
                resolve();
            })
            .catch(function(error) {
                reject(error);
            });
        })
        .catch(function(error){
            reject(error);
        });
    });
}

/*
*Author: blackkite0206233,yoyo930021
*Description:
    This function is used to update user's info.
*Usage:
    account: user's old account.
    newSchoolPwd: user's new school password(optional).
    newNick: user's new nick.
    newPassword: user's new password.
    newEmail: user's new email.
    newName: user's new name.
    return: if update successfully, return true, otherwise return false.
*/
var updateUserInfo = function (account, newSchoolPwd, newNick, newPassword, newEmail, newName) {
    return new Promise(function(resolve, reject){
        models.Account.findOne({where: {email: account}})
        .then(function(result){
            result.update({school_pwd: newSchoolPwd, nick: newNick, pwd: newPassword, email: newEmail, name: newName})
            .then(function(result){
                resolve();
            })
            .catch(function(error){
                reject(error);
            });
        })
        .catch(function(error){
            reject(error);
        });
    });

}

/*
*Author: blackkite0206233,yoyo930021
*Description:
    This function is used to get user's information.
*Usage:
    account: user's account.
    return: if update successfully, return a Object, otherwise return null.
*/
var getUserInfo = function (account) {
    return new Promise(function(resolve, reject) {
        models.Account.findOne({where:{email:account}})
        .then(function(result){
            resolve(result);
        })
        .catch(function(error){
            reject(error);
        });
    });

}

module.exports = {

    getUserPassword: getUserPassword,

    createUser: createUser,

    updateUserInfo: updateUserInfo,

    getUserInfo: getUserInfo
};
