/*
*Author: blackkite0206233,yoyo930021
*Description: This file is used to control the user's data..
*/


var models  = require('../../models');

module.exports = {
    /*
    *Author: blackkite0206233,yoyo930021
    *Description:
        This function is used to get the use's password.
    *Usage:
        account: user's account(email).
        return: user's password, if the account doen't exist, return "".
    */
    getUserPassword:function(account) {
        models.Account.findOne({ where: {email: account} }).then(function(result){
            return result.get('pwd');
        }).catch(function(error) {
            debug(error.toString());
            return "";
        });
    },

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
    createUser:function (email, password, userGroup, schoolAccount, schoolPwd, nick,name) {
        models.Group.findOne({ where: {comment:userGroup} }).then(function(group){
            var NewAccount={
                email:email,
                pwd:password,
                group_id:group.get("id"),
                school_account:schoolAccount,
                school_pwd:schoolPwd,
                nick:nick,
                name:name
            }
            models.Account.create(NewAccount).then(function(account) {
                return true;
            }).catch(function(error) {
                debug(error.toString());
                return false;
            });
        }).catch(function(error){
            debug(error.toString());
            return false;
        });


    },

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
        return: if update successfully, return true, otherwise return false.
    */
    updateUserInfo:function (account, newSchoolPwd, newNick, newPassword, newEmail) {
        models.Account.findOne({where:{email:account}}).then(function(result){
            result.update({school_pwd:newSchoolPwd,nick:newNick,pwd:newPassword,email:newEmail}).then(function(result){
                return true;
            }).catch(function(error){
                debug(error.toString());
                return false;
            });
        }).catch(function(error){
            debug(error.toString());
            return false;
        });
    },

    /*
    *Author: blackkite0206233,yoyo930021
    *Description:
        This function is used to get user's information.
    *Usage:
        account: user's account.
        return: if update successfully, return a Object, otherwise return null.
    */
    getUserInfo:function (account) {
        models.Account.findOne({where:{email:account}}).then(function(result){
            return result;
        }).catch(function(error){
            debug(error.toString());
            return null;
        });
    }
};
