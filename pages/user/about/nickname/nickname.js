/**
 * Created by Liujx on 2017-10-19 11:30:56
 */
 const updateNameUrl = require('../../../../config').updateNameUrl;
 const util = require('../../../../utils/util');

 Page({
 	data: {
 		inputVal: '',
        memberId: ''
 	},
    onLoad: function(option) {
        this.setData({
            inputVal: option.name,
            memberId: option.memberId
        })
    },
    // 提交修改
    nickNameFun: function() {
        let self = this;
        wx.request({
            url: updateNameUrl,
            method: 'POST',
            header: {
                  'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                memberId: self.data.memberId,
                name: self.data.inputVal
            },
            success: data => {
                if(data.data.success) {
                    util.showMessage(self, data.data.msg)
                    setTimeout(function() {
                        wx.navigateBack()
                    }, 2000)
                } else {
                    util.showMessage(self, data.data.msg)
                }
            }
        })
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