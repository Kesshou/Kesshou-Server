/*
*Author: blackkite0206233
*Description: This file is the API of forum.
*/
var express = require('express');
var ForumlistRepository = require('../Kesshou/Repositories/ForumlistRepository');
var ForumarticleRepository = require('../Kesshou/Repositories/ForumarticleRepository');
var ForumresponseRepository = require('../Kesshou/Repositories/ForumresponseRepository');
var RedisRepository = require('../Kesshou/Repositories/RedisRepository');
var UserRepository = require('../Kesshou/Repositories/UserRepository');

var CheckCharactersService = require('../Kesshou/Services/CheckCharactersService');
var ErrorCodeService = require('../Kesshou/Services/ErrorCodeService');
var ImgurService = require('../Kesshou/Services/ImgurService');

var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return forum list.
*Usage:
    return:
        forumlist: forum list.
        error: it is a string to explain the reason of error.
        code:
            400: server error.
*/
router.post('/getList', function(req, res, next) {
    var search = (req.body.search != undefined) ? req.body.search : "";
    if(search) {
        ForumlistRepository.searchForumlist(search).then(function(result) {
            res.status(200).json(result);
        }).catch(function(error) {
            res.status(400).json(ErrorCodeService.serverError);
        });
    } else {
        ForumlistRepository.getForumlist().then(function(result) {
            res.status(200).json(result);
        }).catch(function(error) {
            res.status(400).json(ErrorCodeService.serverError);
        });
    }
});

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return article list.
*Usage:
    return:
        forumarticle: forum article.
        error: it is a string to explain the reason of error.
        code:
            301: some essential input are empty.
            400: server error.
*/
router.post('/getAllArticle', function(req, res, next) {
    var forumlistId = req.body.listId;
    if(forumlistId == undefined)
        res.status(400).json(ErrorCodeService.emptyInput);
    var search = (req.body.search != undefined) ? req.body.search : "";
    if(search) {
        ForumarticleRepository.searchForumarticle(forumlistId, search).then(function(result) {
            res.status(200).json(result);
        }).catch(function(error) {
            res.status(400).json(ErrorCodeService.serverError);
        });
    } else {
        ForumarticleRepository.getForumarticle(forumlistId).then(function(result) {
            res.status(200).json(result);
        }).catch(function(error) {
            res.status(400).json(ErrorCodeService.serverError);
        });
    }
});

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return article content.
*Usage:
    return:
        article: article content.
        error: it is a string to explain the reason of error.
        code:
            301: some essential input are empty.
            400: server error.
*/
router.post('/getOneArticle', function(req, res, next) {
    var articleID = req.body.articleID;
    if(articleID == undefined)
        res.status(400).json(ErrorCodeService.emptyInput);
    ForumarticleRepository.getArticleById(articleID).then(function(result) {
        var article = result;
        return UserRepository.getUserById(article.memid);
    }).then(function(result) {
        article.nick = result.nick;
        res.status(200).json(article);
    }).catch(function(error) {
        res.status(400).json(ErrorCodeService.serverError);
    });
})

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return forum article.
*Usage:
    return:
        forumresponse: forum article's response.
        error: it is a string to explain the reason of error.
        code:
            301: some essential input are empty.
            400: server error.
*/
router.post('/getResponse', function(req, res, next) {
    var articleId = req.body.articleId;
    if(articleId == undefined)
        res.status(400).json(ErrorCodeService.emptyInput);
    ForumresponseRepository.getForumresponse(articleId).then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(400).json(ErrorCodeService.serverError);
    });
});

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to create a new forum list.
*Usage:
    return:
        status: successful message.
        error: it is a string to explain the reason of error.
        code:
            301: some essential input are empty.
            400: server error.
*/
router.post('/list', function(req, res, next) {
    var name = req.body.name;
    if(name == undefined)
        res.status(400).json(ErrorCodeService.emptyInput);
    ForumlistRepository.createForum(name).then(function(reault) {
        res.status(200).json({"status" : "新增成功"});
    }).catch(function(error) {
        res.status(400).json(ErrorCodeService.serverError);
    });
});

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to create a new forum article.
*Usage:
    return:
        status: successful message.
        error: it is a string to explain the reason of error.
        code:
            301: some essential input are empty.
            400: server error.
*/
router.post('/article', function(req, res, next) {
    var token = req.get("Authorization");
    var article = req.body;
    if(article.forumID == undefined || article.sort == undefined ||
        article.title == undefined || article.content == undefined || article.date == undefined)
        res.status(400).json(ErrorCodeService.emptyInput);
    RedisRepository.getUserInfo(token).then(function(result) {
        article.memid = result.id;
        return ForumarticleRepository.createArticle(article);
    }).then(function(result) {
        res.status(200).json({"status" : "新增成功"});
    }).catch(function(error) {
        if(error == "token過期")
            res.status(401).json(ErrorCodeService.tokenExpired);
        else
            res.status(400).json(ErrorCodeService.serverError);
    });
});

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to create a new article response.
*Usage:
    return:
        status: successful message.
        error: it is a string to explain the reason of error.
        code:
            301: some essential input are empty.
            400: server error.
*/
router.post('/response', function(req, res, next) {
    var token = req.get("Authorization");
    var response = req.body;
    if(response.articleID == undefined || response.sort == undefined ||
        response.content == undefined || response.date == undefined)
        res.status(400).json(ErrorCodeService.emptyInput);
    RedisRepository.getUserInfo(token).then(function(result) {
        response.memid = result.id;
        return ForumresponseRepository.createResponse(response);
    }).then(function(result) {
        res.status(200).json({"status" : "新增成功"});
    }).catch(function(error) {
        if(error == "token過期")
            res.status(401).json(ErrorCodeService.tokenExpired);
        else
            res.status(400).json(ErrorCodeService.serverError);
    });
});

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to upload picture.
*Usage:
    return:
        picture: picture's code.
        error: it is a string to explain the reason of error.
        code:
            301: some essential input are empty.
            400: server error.
*/
router.post('/uploadPicture', function(req, res, next) {
    var pic = req.body.picture;
    if(pic == undefined)
        res.status(400).json(ErrorCodeService.emptyInput);
    ImgurService.upload(pic).then(function(result) {
        res.status(200).json({"picture" : result});
    }).catch(function(error) {
        res.status(400).json(ErrorCodeService.serverError);
    });
});

module.exports = router;
