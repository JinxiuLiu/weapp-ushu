/**
 * Created by Liujx on 2017-10-18 11:28:42
 */
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const collectBookViewUrl = require('../../../config').collectBookViewUrl;
const collectBookListUrl = require('../../../config').collectBookListUrl;
const util = require('../../../utils/util');
let sessionId = wx.getStorageSync('sessionId')
Page({
    data: {
        tabs: ["收藏的书单", "收藏的书"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        bookLoadMore: true,
        bookListLoadMore: true,
        bookPage: 1,
        bookListPage: 1,
        bookListItem: [],
        bookItem: []
    },
    onLoad: function() {
        var self = this;
        self.collectBookList();
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    sliderLeft: (res.windowWidth / self.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / self.data.tabs.length * self.data.activeIndex
                });
            }
        });
    },
    // 上拉加载更多
    onReachBottom: function() {
        if (this.data.activeIndex == 0) {
            this.setData({
                bookListLoadMore: true,
            })
            this.collectBookList()
        }
        if (this.data.activeIndex == 1) {
            this.setData({
                bookLoadMore: true,
            })
            this.collectBook()
        }
    },
    // tab栏切换
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        })
        if (this.data.activeIndex == 0) {
            this.setData({
                bookListPage: 1,
                bookListLoadMore: true,
                bookListItem: [],
            })
            this.collectBookList()
        }
        if (this.data.activeIndex == 1) {
            this.setData({
                bookPage: 1,
                bookLoadMore: true,
                bookItem: [],
            })
            this.collectBook()
        }
    },
    // 收藏书单请求
    collectBookList: function() {
        let self = this;
        wx.request({
            url: collectBookListUrl,
            data: {
                page: self.data.bookListPage,
                rows: 10,
                sort: "created",
                sorder: "desc"
            },
            header: {
                'Cookie': 'JSESSIONID=' + sessionId
            },
            success: data => {
                if (data.data.rows.length == 0) {
                    self.setData({
                        bookListLoadMore: false,
                    })
                    util.showMessage(self, '没有数据啦！')
                    return false;
                }
                self.data.bookListPage++
                    self.setData({
                        bookListPage: self.data.bookListPage,
                        bookListLoadMore: false,
                        bookListItem: self.data.bookListItem.concat(data.data.rows)
                    })
            }
        })
    },
    // 收藏图书请求
    collectBook: function() {
        let self = this;
        wx.request({
            url: collectBookViewUrl,
            data: {
                page: self.data.bookPage,
                rows: 10,
                sort: "created",
                sorder: "desc"
            },
            header: {
                'Cookie': 'JSESSIONID=' + sessionId
            },
            success: data => {
                if (data.data.rows.length == 0) {
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
                        bookItem: self.data.bookItem.concat(data.data.rows)
                    })
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