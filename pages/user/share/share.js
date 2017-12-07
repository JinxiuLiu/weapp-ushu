/**
 * Created by Liujx on 2017-10-18 15:16:20
 */
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const shareListUrl = require('../../../config').shareListUrl;
const util = require('../../../utils/util');
Page({
    data: {
        tabs: ["分享的书单", "分享的书"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        bookPage: 1,
        bookListPage: 1,
        bookListLoadMore: true,
        bookLoadMore: true,
        shareBookListItem: [],
        shareBookItem: [],
    },
    onLoad: function() {
        var self = this;
        self.shareBookList()
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    sliderLeft: (res.windowWidth / self.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / self.data.tabs.length * self.data.activeIndex
                });
            }
        })
    },
    // 上拉加载
    onReachBottom: function() {
        if (this.data.activeIndex == 0) {
            this.setData({
                bookListLoadMore: true,
            })
            this.shareBookList()
        }
        if (this.data.activeIndex == 1) {
            this.setData({
                bookLoadMore: true,
            })
            this.shareBook()
        }
    },
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        })
        if (this.data.activeIndex == 0) {
            this.setData({
                bookListPage: 1,
                bookListLoadMore: true,
                shareBookListItem: [],
            })
            this.shareBookList()
        }
        if (this.data.activeIndex == 1) {
            this.setData({
                bookPage: 1,
                bookLoadMore: true,
                shareBookItem: [],
            })
            this.shareBook()
        }
    },
    // 分享的书单
    shareBookList: function() {
        let self = this;
        wx.request({
            url: shareListUrl,
            data: {
                item: false,
                page: self.data.bookListPage,
                rows: 10
            },
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if (data.data.success) {
                    if (data.data.data.rows.length == 0) {
                        self.setData({
                            bookListLoadMore: false,
                        })
                        util.showMessage(self, '没有数据啦！')
                        return false;
                    }
                    self.data.bookListPage++
                        self.setData({
                            bookListLoadMore: false,
                            bookListPage: self.data.bookListPage,
                            shareBookListItem: self.data.shareBookListItem.concat(data.data.data.rows)
                        })
                } else {
                    util.showMessage(self, '服务端错误！')
                    self.setData({
                        bookListLoadMore: false,
                    })
                }
            }
        })
    },
    // 分享的书
    shareBook: function() {
        let self = this;
        wx.request({
            url: shareListUrl,
            data: {
                item: true,
                page: self.data.bookPage,
                rows: 10
            },
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if (data.data.success) {
                    if (data.data.data.rows.length == 0) {
                        self.setData({
                            bookLoadMore: false,
                        })
                        util.showMessage(self, '没有数据啦！')
                        return false;
                    }
                    self.data.bookPage++
                        self.setData({
                            bookPage: self.data.bookPage,
                            bookLoadMore: false,
                            shareBookItem: self.data.shareBookItem.concat(data.data.data.rows)
                        })
                }
            }
        })
    },
    // 跳转书单
    tapBookList: function(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../bookList/bookList?id=' + id
        })
    },
    // 跳转图书
    tapBook: function(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../bookDetails/bookDetails?id=' + id
        })
    }
});