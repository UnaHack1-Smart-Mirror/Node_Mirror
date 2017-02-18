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

$(document).ready(function () {
    setInterval("time()", 1000);
    setInterval("update_room_data", 20000);
    setInterval("update_yahoo", 10000);
    $("#shift").click(function () {
        $(this).toggleClass("active");
    });
    $.getJSON("http://api.waqi.info/feed/taipei/?token=4be6f1d2f01637e9b69ea4106ad6f6a1c3026157", (data) => {
        var pm25 = data.data.iaqi.pm25.v;
        if (pm25 <= 50) {
            var airMsg = "Air quality is considered satisfactory, and air pollution poses little or no risk";
        } else if (pm25 > 50 && pm25 <= 100) {
            var airMsg = "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.";
        } else if (pm25 > 100 && pm25 <= 150) {
            var airMsg = "Members of sensitive groups may experience health effects. The general public is not likely to be affected.";
        } else if (pm25 > 150 && pm25 <= 200) {
            var airMsg = "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
        } else if (pm25 > 200 && pm25 <= 300) {
            var airMsg = "Health warnings of emergency conditions. The entire population is more likely to be affected.";
        } else {
            var airMsg = "Health alert: everyone may experience more serious health effects.";
        }
        msgs.push(airMsg);
    });
    update_room_data();
    update_yahoo();
});

function update_room_data() {
    $.getJSON("/config", (data) => {
        var url = data.url;
        $.getJSON(url, (data) => {
            var hum = data.hum;
            var temp = data.temp;
            document.getElementById("temp").innerText = "Room Temperature : " + temp + "℃";
            document.getElementById("hum").innerText = "Hum : " + hum + "%";
        });
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
        if ((nowTime > sunsetTime) | (nowTime < sunriseTime)) {
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
    })
}