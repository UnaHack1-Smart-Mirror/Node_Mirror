function time() {
    var currentdate = new Date();
    var date = currentdate.getFullYear() + " / " +
        (currentdate.getMonth() + 1) + " / " +
        currentdate.getDate();
    var time = currentdate.getHours() + ":" +
        (currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes();
    document.getElementById("time").innerText = time;
    document.getElementById("date").innerText = date;
};

var callbackFunction = function (callback) {
    var data = callback.query.results.channel.item;
    var weather = data.condition.temp;
    var wc = data.condition.text;
    var currentdate = new Date();
    var msgs = [];
    if (wc.indexOf('Cloudy') > 0) {
        var imgLink = 'clouds';

    }
    if (wc.indexOf('Sunny') > 0) {
        var imgLink = 'clear';
        msgs.push("Remember to bring an umbrella with you!");
    }
    if (wc.indexOf('Rain') > 0) {
        var imgLink = 'rain';
        msgs.push("Remember to bring an umbrella with you!");
    }
    if (wc.indexOf('Shower') > 0) {
        var imgLink = 'showers';
        msgs.push("Remember to bring an umbrella with you!");
    }
    if ((currentdate.getHours() > 18) | (currentdate.getHours() < 6)) {
        var time = 'night';
    } else {
        var time = 'day';
    }
    if (weather <= 25) {
        msgs.push("Remember warm clothes!");
    }
    $(".weather>img").attr('src', '/assets/images/icon/weather-' + imgLink + '-' + time + '.png');
    $("#next").css("background-image", "url(/assets/images/" + time + "-bg.jpg)");
    var app = new Vue({
        el: '#next',
        data: {
            weather: weather,
            wc: wc,
            msgs: msgs
        }
    })
};

$(document).ready(function () {
    setInterval("time()", 1000);
    setInterval("callbackFunction", 1000);
    $("#shift").click(function () {
        $(this).toggleClass("active");
    });
    $.getJSON("/config", (data) => {
        var url = data.url;
        $.getJSON(url, (data) => {
            var hum = data.hum;
            var temp = data.temp;
            document.getElementById("temp").innerText = "Room Temperature : " + temp + "℃";
            document.getElementById("hum").innerText = "Hum : " + hum + "%";
        });
    });
});