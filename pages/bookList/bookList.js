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
const shareSaveUrl = require('../../config').shareSaveUrl;
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
        fromId: ''
    },
    // 首屏渲染
    onLoad: function(options) {
        let id = options.id || options.scene;
        this.detailRequest(id);
        this.readBookListRequest(id);
        this.commentRequest(id);
        this.cartTotalRequest();
        let fromId = options.uuid || '';
        this.setData({
            fromId: fromId
        })
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
                    if(data.data.data.tags) {
                        data.data.data.tags = data.data.data.tags.split(',')
                    }
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
                fromShareId: self.data.fromId
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
    // 分享
    onShareAppMessage: function(res) {
        let self = this;
        let title = '';
        let path = '';
        let bookListId = res.target.dataset.item.id;
        let uuid = util.uuid();
        if (res.from === 'button') {
            title = res.target.dataset.item.title;
            path = '/pages/bookList/bookList?id=' + bookListId + '&uuid=' + uuid
        }
        return {
            title: title,
            path: path,
            success: function(res) {
                // 转发成功
                wx.request({
                    url: shareSaveUrl,
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        id: uuid,
                        bookListId: bookListId,
                        fromId: self.data.fromId
                    },
                    success: data => {
                        if(data.data.success) {
                            util.showMessage(self, data.data.msg)
                        } else {
                            util.showMessage(self, data.data.msg)
                        }
                    }
                })
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
    // 关注
    attentionFun: function(e) {
        let self = this;
        let creatorId = e.currentTarget.dataset.creatorid;
        if(e.currentTarget.dataset.followed) {
            util.showMessage(self, '已关注');
            return false;
        }
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
                if(data.data.rows.length == 0) {
                    self.setData({
                        isComment: false
                    })
                }
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
                        cartTotal: data.data.data || 0
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