/**
 * Created by Liujx on 2017-10-23 15:47:07
 */
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const gridMyListRankingUrl = require('../../config').gridMyListRankingUrl;
const userMoneyRankingUrl = require('../../config').userMoneyRankingUrl;
Page({
    data: {
        tabs: ["收益排行", "书单排行"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        userLoadMore: true,
        bookListLoadMore: true,
        bookListRankingItem: [],
        userRankingItem: []
    },
    onLoad: function() {
        var self = this;
        self.userRanking();
        self.bookListRanking();
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    sliderLeft: (res.windowWidth / self.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / self.data.tabs.length * self.data.activeIndex
                });
            }
        });
    },
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    // 书单收益排行
    bookListRanking: function() {
        let self = this;
        wx.request({
            url: gridMyListRankingUrl,
            data: {},
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if(data.data.success) {
                    self.setData({
                        bookListLoadMore: false,
                        bookListRankingItem: data.data.data
                    })
                }
            }
        })
    },
    // 用户收益排行
    userRanking: function() {
        let self = this;
        wx.request({
            url: userMoneyRankingUrl,
            data: {},
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if(data.data.success) {
                    self.setData({
                        userLoadMore: false,
                        userRankingItem: data.data.data
                    })
                }
            }
        })
    },
    // 点击查看书单详情
    tapBookList: function(e) {
        let BookListID = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../bookList/bookList?id=' + BookListID
        })
    },
    // 点击查看此人书单
    tapOtherList: function(e) {
        let id = e.currentTarget.dataset.id;
        let name = e.currentTarget.dataset.name;
        wx.navigateTo({
            url: '../otherBookList/otherBookList?id=' + id + '&name=' + name
        })
    }
});