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

var msgs = [];
var config;

$(document).ready(function () {
    $.getJSON("/config", (data) => {
        config = data;
        update_room_data();
        update_pm25();
        update_yahoo();
    });

    $("#shift").click(function () {
        $(this).toggleClass("active");
    });

    setInterval("time()", 1000);
    setInterval("update_room_data()", 20000);
    setInterval("update_pm25()", 600000);
    setInterval("update_yahoo()", 600000);

});

function action() {
    $("#shift").click(function () {
        $(this).toggleClass("active");
    });
}


function update_room_data() {
    $.getJSON("/db", (data) => {
        var hum = data.hum;
        var temp = data.temp;
        document.getElementById("temp").innerText = "Room Temperature : " + temp + "℃";
        document.getElementById("hum").innerText = "Hum : " + hum + "%";
    });
}

function update_yahoo() {
    $.getJSON("https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='taipei, tw') and u='c'&format=json", (callback) => {
        var data = callback.query.results.channel;
        var weather = data.item.condition.temp;
        var wc = " " + data.item.condition.text;
        var currentdate = new Date();
        var sunrise = data.astronomy.sunrise.slice(0, -3).split(":");
        var sunset = data.astronomy.sunset.slice(0, -3).split(":");
        var sunriseTime = (parseInt(sunrise[0], 10)) * 60 + (parseInt(sunrise[1], 10));
        var sunsetTime = (parseInt(sunset[0], 10) + 12) * 60 + (parseInt(sunset[1], 10));
        var nowTime = currentdate.getHours() * 60 + currentdate.getMinutes();

        if (wc.indexOf('Cloudy') > 0) {
            var imgLink = 'clouds';
        }
        if (wc.indexOf('Sunny') > 0) {
            var imgLink = 'clear';
            var warn = "Remember to bring an umbrella with you!";
        }
        if (wc.indexOf('Rain') > 0) {
            var imgLink = 'rain';
            var warn = "Remember to bring an umbrella with you!";
        }
        if (wc.indexOf('Shower') > 0) {
            var imgLink = 'showers';
            var warn = "Remember to bring an umbrella with you!";
        }
        if ((nowTime > sunsetTime) | (nowTime < sunriseTime)) {
            var time = 'night';
        } else {
            var time = 'day';
        }
        if (weather <= 25) {
            var warn = "Remember warm clothes!";
        }
        msgs.push(warn);
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
    })
}

function update_pm25() {
    $.getJSON("http://api.waqi.info/feed/taipei/?token=4be6f1d2f01637e9b69ea4106ad6f6a1c3026157", (data) => {
        var pm25 = data.data.iaqi.pm25.v;
        if (pm25 <= 50) {
            var id = 0;
        } else if (pm25 > 50 && pm25 <= 100) {
            var id = 1;
        } else if (pm25 > 100 && pm25 <= 150) {
            var id = 2;
        } else if (pm25 > 150 && pm25 <= 200) {
            var id = 3;
        } else if (pm25 > 200 && pm25 <= 300) {
            var id = 4;
        } else {
            var id = 5;
        }
        msgs.push(lang[config.lang].pm25[id]);
    });
}