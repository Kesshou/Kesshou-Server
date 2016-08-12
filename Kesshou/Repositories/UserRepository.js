/*
*Author: blackkite0206233
*Description: This file is used to control the user's data..
*/

/*
*Author: blackkite0206233
*Description:
    This function is used to get the use's password.
*Usage:
    account: user's account(email).
    return: user's password, if the account doen't exist, return "".
*/
function getUserPassword(account) {
    return password;
};

/*
*Author: blackkite0206233
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
function createUser(email, password, userGroup, schoolAccount, schoolPwd, nick) {

    return status;
}

/*
*Author: blackkite0206233
*Description:
    This function is used to update user's info.
*Usage:
    password: user's old password.
    newSchoolPwd: user's new school password(optional).
    newNick: user's new nick.
    newPassword: user's new password.
    newEmail: user's new email.
    return: if update successfully, return true, otherwise return false.
*/
function updateUserInfo(password, newSchoolPwd, newNick, newPassword, newEmail) {

    return status;
}

/*
*Author: blackkite0206233
*Description:
    This function is used to get user's information.
*Usage:
    account: user's account.
    return: 
*/
function getUserInfo(account) {


}
module.exports = UserRepository;
