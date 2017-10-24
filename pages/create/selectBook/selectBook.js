/**
 * Created by Liujx on 2017-10-23 16:55:08
 */

 const SelectBookUrl = require('../../../config').SelectBookUrl

 Page({
 	data: {
        inputVal: "",
        rows: []
    },
    onLoad: function() {
    	var self = this
		wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 5000
        })
	    wx.request({
			url: SelectBookUrl,
			data: {
				"searchStr": ""
			},
			success: function(result) {
				wx.hideLoading();
				self.setData({
		            rows: result.data.rows
		        });
			},
			fail: function({errMsg}) {
				console.log('request fail', errMsg)
				self.setData({
					loading: false
				})
			}
	    })
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
    },
	searchRequest: function(e) {
		var self = this
		wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 5000
        })
	    wx.request({
			url: SelectBookUrl,
			data: {
				"searchStr": e.detail.value
			},
			success: function(result) {
				wx.hideLoading();
				self.setData({
		            rows: result.data.rows,
		            inputVal: ""
		        });
			},
			fail: function({errMsg}) {
				console.log('request fail', errMsg)
				self.setData({
					loading: false
				})
			}
	    })
	}
 })