/**
 * Created by Liujx on 2017-10-19 11:30:56
 */
 Page({
 	data: {
 		inputVal: 'showmetheloli'
 	},
 	showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    }
 })