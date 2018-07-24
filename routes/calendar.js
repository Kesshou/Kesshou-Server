/*
*Author: blackkite0206233
*Description: This file is the API of calendar.
*/
var express = require('express');

var CalendarService = require('../Kesshou/Services/CalendarService');
var ErrorCodeService = require('../Kesshou/Services/ErrorCodeService');

var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return calendar.
*Usage:
    return:
        calendar: school's schedule.
        error: it is a string to explain the reason of error.
        code:
            400: server error.
*/
router.get('/', function(req, res, next) {
    var calendarUrl = "https://calendar.google.com/calendar/ical/mail.taivs.tp.edu.tw_lg08uahp6viuq3fls6578vvgk8%40group.calendar.google.com/public/basic.ics";
    CalendarService.getCalendar(calendarUrl).then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(400).json(ErrorCodeService.serverError);
    });
});

module.exports = router;
