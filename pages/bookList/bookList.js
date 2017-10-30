/**
 * Created by Liujx on 2017-10-22 22:38:21
 */
const detailUrl = require('../../config').detailUrl;
const addCartUrl = require('../../config').addCartUrl;
const readBookListUrl = require('../../config').readBookListUrl;
const util = require('../../utils/util');

Page({
    data: {
        loadmore: true,
        detailList: [],
        readCount: 0,
    },
    // 首屏渲染
    onLoad: function(options) {
        let self = this;
        wx.request({
            url: detailUrl,
            method: 'POST',
            data: {
                id: options.id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: data => {
                if(data.data.success) {
                    wx.setNavigationBarTitle({
                        title: data.data.data.title
                    })
                    self.setData({
                        loadmore: false,
                        detailList: [data.data.data],
                        readCount: data.data.data.readCount
                    })
                } else {
                    util.showMessage(self, data.data.msg)
                }
            }
        })
        // 浏览记录
        wx.request({
            url: readBookListUrl,
            method: 'POST',
            data: {
                id: options.id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: data => {}
        })
    },
    // 添加购物车
    addCartFun: function(e) {
        let self = this;
        let bookId = e.currentTarget.dataset.bookid;
        let bookListId = e.currentTarget.dataset.booklistid;
        wx.request({
            url: addCartUrl,
            method: 'POST',
            data: {
                bookId: bookId,
                bookListItemId: bookListId,
                fromShareId: ''
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: data => {
                if(data.data.success) {
                    util.showMessage(self, data.data.msg)
                } else {
                    util.showMessage(self, data.data.msg)
                }
            }
        })
    }
})