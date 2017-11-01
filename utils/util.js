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
    formatLocation: formatLocation,
    showMessage: showMessage
}