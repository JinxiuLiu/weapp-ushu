/**
 * Created by Liujx on 2017-10-20 14:17:34
 */
const getBookListUrl = require('../../config').getBookListUrl;
const collectUrl = require('../../config').collectUrl;
const cancelCollectUrl = require('../../config').cancelCollectUrl;
const util = require('../../utils/util');
const app = getApp()
Page({
    data: {
    	loadmore: true,
    	creatorId: '',
    	bookListItem: []
    },
    onLoad: function(options) {
    	let id = options.id
    	let name = options.name
        wx.setNavigationBarTitle({
            title: name + '的书单'
        })
        this.setData({
        	creatorId: id
        })
        this.requestOtherList()
    },
    // 获取用户书单
    requestOtherList: function() {
    	let self = this;
        wx.request({
            url: getBookListUrl,
            data: {
                page: 1,
                rows: 10,
                sort: 'created',
                order: "desc",
                creatorId: self.data.creatorId,
                published: true
            },
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if (data.data.success) {
                    self.setData({
                        loadmore: false,
                        bookListItem: data.data.data.rows
                    })
                } else {
                    util.showMessage(self, data.data.msg);
                }
            }
        })
    },
    // 收藏
    collectFun: function(e) {
    	let self = this;
        let id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        let isCollect = e.currentTarget.dataset.iscollect;
        if (isCollect) {
            self.collectRequest(cancelCollectUrl, id, index, '取消收藏成功！', false)
        } else {
            self.collectRequest(collectUrl, id, index, '收藏成功！', true)
        }
    },
    // 收藏&&取消收藏
    collectRequest: function(url, id, index, msg, isCollect) {
        let self = this;
        wx.request({
            url: url,
            data: {
                bookListId: id
            },
            header: {
                'X-Requested-With': 'XMLHttpRequest',
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if (data.data.success) {
                    util.showMessage(self, msg);
                    self.data.bookListItem[index].collected = isCollect;
                    self.setData({
                        bookListItem: self.data.bookListItem
                    })
                } else {
                    if(data.data.data == 401) {
                        app.loginFun()
                        return false;
                    }
                    util.showMessage(self, data.data.msg);
                }
            }
        })
    },
    // 点击书单
    tapBookList: function(e) {
        let BookListID = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../bookList/bookList?id=' + BookListID
        })
    },
})