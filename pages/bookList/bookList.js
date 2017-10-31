/**
 * Created by Liujx on 2017-10-22 22:38:21
 */
const detailUrl = require('../../config').detailUrl;
const addCartUrl = require('../../config').addCartUrl;
const readBookListUrl = require('../../config').readBookListUrl;
const commentListUrl = require('../../config').commentListUrl;
const commentGridUrl = require('../../config').commentGridUrl;
const cartTotalUrl = require('../../config').cartTotalUrl;
const addAttentionUrl = require('../../config').addAttentionUrl;
const collectUrl = require('../../config').collectUrl;
const util = require('../../utils/util');

Page({
    data: {
        loadmore: true,
        detailList: [],
        commentList: [],
        commentTotal: 0,
        readCount: 0,
        cartTotal: 0,
        isComment: true,
    },
    // 首屏渲染
    onLoad: function(options) {
        this.detailRequest(options.id);
        this.readBookListRequest(options.id);
        this.commentRequest(options.id);
        this.cartTotalRequest();
    },
    // 请求详情
    detailRequest: function(val) {
        let self = this;
        wx.request({
            url: detailUrl,
            method: 'POST',
            data: {
                id: val
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
                    self.data.cartTotal++
                    self.setData({
                        cartTotal: self.data.cartTotal
                    })
                    util.showMessage(self, data.data.msg)
                } else {
                    util.showMessage(self, data.data.msg)
                }
            }
        })
    },
    // 浏览记录
    readBookListRequest: function(val) {
        wx.request({
            url: readBookListUrl,
            method: 'POST',
            data: {
                id: val
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: data => {}
        })
    },
    // 关注
    attentionFun: function(e) {
        let self = this;
        let creatorId = e.currentTarget.dataset.creatorid;
        wx.request({
            url: addAttentionUrl,
            data: {
                targetId: creatorId
            },
            success: data => {
                if (data.data.success) {
                    util.showMessage(self, '关注成功！');
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
        wx.request({
            url: collectUrl,
            data: {
                bookListId: id
            },
            success: data => {
                if (data.data.success) {
                    self.detailRequest(id);
                    util.showMessage(self, '收藏成功！');
                } else {
                    util.showMessage(self, data.data.msg);
                }
            }
        })
    },
    // 评论分页接口
    commentRequest: function(val) {
        let self = this;
        wx.request({
            url: commentGridUrl,
            method: 'POST',
            data: {
                bookListId: val,
                page: 1,
                rows: 2
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: data => {
                self.setData({
                    commentList: data.data.rows,
                    commentTotal: data.data.total
                })
            }
        })
    },
    // 查看全部评论
    commentTotalFun: function(e) {
        let self = this;
        let bookListId = e.currentTarget.dataset.id;
        wx.request({
            url: commentListUrl,
            method: 'POST',
            data: {
                bookListId: bookListId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: data => {
                self.setData({
                    commentList: data.data,
                    isComment: false
                })
            }
        })
    },
    // 获取购物车总数量
    cartTotalRequest: function() {
        let self = this;
        wx.request({
            url: cartTotalUrl,
            method: 'POST',
            data: {},
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: data => {
                if(data.data.success) {
                    self.setData({
                        cartTotal: data.data.data
                    })
                }
            }
        })
    },
    // 跳转购物车
    navigateToCart: function() {
        wx.switchTab({
            url: '../cart/cart'
        })
    }
})