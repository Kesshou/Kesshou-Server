$(document).ready(function(){
    $('.menu').click(function(){
        $('.sidebar').animate({
            left: "0px"
        },500);
    });
    $('.close').click(function(){
        $('.sidebar').animate({
            left: "-285px"
        },500);
    });
});