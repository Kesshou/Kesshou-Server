console.time("爬蟲執行時間");

var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));
var iconv = require("iconv-lite");
var cheerio = require("cheerio");
var urlencode = require('urlencode');
//var Sequelize = require('sequelize');
//var sequelize = new Sequelize('DaanX', 'root', 'u,4aup3vm0 ', {host : '127.0.0.1', port : '3306', dialect : 'mariadb'});
var models = Promise.promisifyAll(require('../../models'));

var checkNewsExist = function (newsKey) {
    return new Promise(function (reslove, reject){
        var newsReq = {
            url: "http://ta.taivs.tp.edu.tw/news/news.asp?KEY="+newsKey+"&PageNo=1&board=1&SearchWay=no0",
            encoding: null,
            followAllRedirects: true
        };
        request.getAsync(newsReq)
            .then(function (res) {
                var $ = cheerio.load(iconv.decode(new Buffer(res.body), "Big5", {decodeEntities: false}));
                if($("div[align=center]").eq(1).text().length >10)
                    reslove($);
                else
                    reject();
            })
            .catch(function(err){
                console.log(err);
            });

    });
}

var getSort = function (title) {
    return new Promise(function (reslove, reject){
        var sortGet = {
            url: "http://ta.taivs.tp.edu.tw/news/news.asp?SearchRole=%BC%D0%C3D&SearchWord="+urlencode(title, 'Big5')+"&SearchWay=no0&board=1",
            encoding: null,
            followAllRedirects: true
        };
        request.getAsync(sortGet)
            .then(function (res) {
                var $ = cheerio.load(iconv.decode(new Buffer(res.body),"Big5"),{decodeEntities: false});
                reslove($("table").find("tr").eq(3).children("td").eq(1).text().trim());
            });
    });
}

var getNewsParser = function ($) {
    return new Promise(function (reslove, reject) {
        var newsone = {
            title:"",
            sort:"",
            author:"",
            date:"",
            body:"",
            linked:"",
            file:[],
            image:[]
        };


        $("table").eq(1).children("tr").each(function () {
            var items = $(this);
            if (items.find("td").length > 1) {
                var key = items.find("td").eq(0).text().trim();
                var value = items.find("td").eq(1).text().trim();
                var type = {
                    "內　　容": "body",
                    "公 佈 者": "author",
                    "參考網址": "linked"
                };
                if(type[key]) {
                    newsone[type[key]] = value;
                }else if(key != "有效日期") {
                    newsone.title = value;
                    newsone.date = key;
                }
            } else if(items.find("td").html().indexOf("img") >-1) {
                items.find("img").each(function (i, item) {
                    newsone.image.push("http://ta.taivs.tp.edu.tw/news/" + item.attr("src"));
                });
            } else if (items.find("td").text().indexOf("附件") >-1) {
                items.find("a").each(function () {
                    var item = $(this);
                    newsone.file.push([item.text(),"http://ta.taivs.tp.edu.tw/news/"+item.attr("href")]);
                })
            }
        })

        getSort(newsone.title)
            .then(function (result) {
                newsone.sort = result;
                reslove(newsone);
            });
    });

}

var keyNotExist=0;
var keyNotExistLimit=15;

var keySave=33349;

var repeater = function (startKey) {
    return checkNewsExist(startKey).then(function ($) {
        keyNotExist = 0;
        console.log(startKey+"存在！");
        getNewsParser($).then(function(newsone) {
            console.log(newsone.file);
            var newsOne = newsone;
            var news = {
                "title" : newsOne.title,
                "date" : newsOne.date,
                "body" : newsOne.body,
                "linked" : newsOne.linked,
                "author" : newsOne.author,
                "sort" : newsOne.sort
            }
            models.News.create(news).then(function() {
                models.News.findOne({ where: {title: newsOne.title} }).then(function(result) {
                    var id = result.get("id");
                    var promises = [];
                    if(newsOne.img != undefined) {
                        for(var i = 0; i < newsOne.img.length; i++) {
                            var img = {
                                "file_src" : newsOne.img[i],
                                "news_key" : id,
                                "type" : "img"
                            };
                            promises.push(models.News_file.create(img));
                        }
                    }
                    if(newsOne.file != undefined) {
                        for(var i = 0; i < newsOne.file.length; i++) {
                            var file = {
                                "file_src" : newsOne.file[i][1],
                                "news_key" : id,
                                "type" : "file",
                                "file_name" : newsOne.file[i][0]
                            };
                            promises.push(models.News_file.create(file));
                        }
                    }
                    if(promises != undefined) {
                        Promise.all(promises);
                    }
                });
            });
        });
        return repeater(startKey+1);
    }).catch(function () {
        console.log(startKey+"不存在");
        if(keyNotExist >= keyNotExistLimit){
            console.timeEnd("爬蟲執行時間");
            return;
        }
        keyNotExist++;
        return repeater(startKey+1);
    });
}
repeater(keySave);
