function formatTime(time) {
    if (typeof time !== 'number' || time < 0) {
        return time
    }

    // var hour = parseInt(time / 3600)
    time = time % 3600
    var minute = parseInt(time / 60)
    time = time % 60
    var second = time

    return ([minute, second]).map(function(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }).join(':')
}

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
 
    var uuid = s.join("");
    return uuid;
}

function formatLocation(longitude, latitude) {
    if (typeof longitude === 'string' && typeof latitude === 'string') {
        longitude = parseFloat(longitude)
        latitude = parseFloat(latitude)
    }

    longitude = longitude.toFixed(2)
    latitude = latitude.toFixed(2)

    return {
        longitude: longitude.toString().split('.'),
        latitude: latitude.toString().split('.')
    }
}

function showMessage(that, text, time) {
    let thisTime = time || 3000;
    that.setData({
        showMessage: true,
        messageContent: text
    })
    setTimeout(function() {
        that.setData({
            showMessage: false,
            messageContent: ''
        })
    }, thisTime)
}

module.exports = {
    uuid: uuid,
    formatTime: formatTime,
    formatLocation: formatLocation,
    showMessage: showMessage
}