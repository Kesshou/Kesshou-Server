/*
*Author: blackkite0206233
*Description: This file is the API of announcementdisplay.
*/
var express = require('express');
var RedisRepository = require('../Kesshou/Repositories/RedisRepository');
var AnnounceRepository = require('../Kesshou/Repositories/AnnounceRepository');
var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return announcement.
*Usage:
    return:
        status code:
            200: register successfully.
        title:
            The announcement's title.
        content:
            The announcement's content.
        date:
            The announcement's release date.
*/
router.get('/announce', function(req, res, next) {
    var announce;
    var type = req.type;
    if(type != "collect") {
        announce = AnnounceRepository.getAnnouncement(type);
    } else {
        var user = RedisRepository.getAccount(req.token);
        announce = AnnounceRepository.getCollection(user);
    }
    res.status(200).json({"title" : announce.title,
                                        "content" : announce.content,
                                        "date" : announce.release_date});
});

module.exports = router;
