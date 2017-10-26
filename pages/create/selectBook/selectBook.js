/**
 * Created by Liujx on 2017-10-23 16:55:08
 */
const util = require('../../../utils/util.js');
const SelectBookUrl = require('../../../config').SelectBookUrl

Page({
 	data: {
 		loadmore: true,
 		tempBookKey: [],
 		tempImgUrl: [],
        inputVal: "",
        rows: [],
        seq: 1,
        page: 2
    },
    onLoad: function(option) {
    	var self = this;
    	this.setData({
            seq: Number(option.seq)
        });
	    wx.request({
			url: SelectBookUrl,
			data: {
				"searchStr": ""
			},
			success: function(result) {
				self.setData({
					loadmore: false,
		            rows: result.data.rows
		        });
		        console.log(result.data.rows);
			},
			fail: function({errMsg}) {
				console.log('request fail', errMsg)
				self.setData({
					loading: false
				})
			}
	    })
    },
    onReachBottom: function() {
    	var self = this
		wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 5000
        })
    	wx.request({
			url: SelectBookUrl,
			data: {
				"searchStr": self.data.inputVal || '',
				"page": self.data.page
			},
			success: function(result) {
				wx.hideToast();
				if(result.total === 0) {
					util.showMessage(self, "没有更多数据了！", 3000);
				} else {
					self.data.page++
					self.setData({
						loadmore: false,
			            rows: self.data.rows.concat(result.data.rows),
			            page: self.data.page
			        });
				}
			},
			fail: function({errMsg}) {
				wx.hideToast()
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
		            inputVal: e.detail.value,
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
	selectBook: function(e) {
		let that = this;
		let pages = getCurrentPages();
		let currPage = pages[pages.length - 1];   //当前页面
		let prevPage = pages[pages.length - 2];  //上一个页面
		let bookImgUrl = e.target.dataset.img;
		let bookKey = e.target.dataset.id;
		that.data.tempBookKey.push({"bookId": bookKey, "seq": that.data.seq});
		that.data.tempImgUrl.push(bookImgUrl);
		prevPage.setData({
			tempBookImgUrl: that.data.tempImgUrl,
			tempBookKey: that.data.tempBookKey
		});
		wx.navigateBack();
	}
 })