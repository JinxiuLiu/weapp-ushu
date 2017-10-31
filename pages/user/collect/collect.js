/**
 * Created by Liujx on 2017-10-18 11:28:42
 */
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const collectBookUrl = require('../../../config').collectBookUrl;
const collectBookListUrl = require('../../../config').collectBookListUrl;
const util = require('../../../utils/util');

Page({
    data: {
        tabs: ["收藏的书单", "收藏的书"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        isTabClick: true,
        loadmore: true,
        isMore: true,
        isBookMore: true,
        pageOne: 2,
        pageTwo: 2,
        bookListItem: [],
        bookItem: []
    },
    onLoad: function () {
        var self = this;
        self.collectRequest(collectBookListUrl, false);
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
        var self = this
        if(self.data.isTabClick) {
            if(!self.data.isMore) return false;
            // 默认列表
            wx.request({
                url: collectBookListUrl,
                data: {
                    page: self.data.pageOne
                },
                success: data => {
                    if(!data.data.rows.length) {
                        util.showMessage(self, '没有更多数据了！');
                        self.setData({
                            isMore: false
                        })
                    }
                    self.data.pageOne++
                    self.setData({
                        pageOne: self.data.pageOne,
                        loadmore: false,
                        bookListItem: self.data.bookListItem.concat(data.data.rows)
                    })
                }
            })
        } else {
            if(!self.data.isBookMore) return false;
            // 热门列表
            wx.request({
                url: collectBookUrl,
                data: {
                    page: self.data.pageTwo
                },
                success: data => {
                    if(!data.data.rows.length) {
                        util.showMessage(self, '没有更多数据了！');
                        self.setData({
                            isMore: false
                        })
                    }
                    self.data.pageTwo++
                    self.setData({
                        pageTwo: self.data.pageTwo,
                        loadmore: false,
                        bookItem: self.data.bookItem.concat(data.data.rows)
                    })
                }
            })
        }
    },
    // tab栏切换
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        })
        if (!this.data.isTabClick) {
            return false;
        }
        if (e.currentTarget.id) {
            this.collectRequest(collectBookUrl, true)
            this.setData({
                isTabClick: false
            })
        }
    },
    // 收藏请求
    collectRequest: function(url, isBook) {
        let self = this;
        wx.request({
            url: url,
            data: {},
            success: data => {
                if(isBook) {
                    self.setData({
                        loadmore: false,
                        bookItem: data.data.rows
                    })
                } else {
                    self.setData({
                        loadmore: false,
                        bookListItem: data.data.rows
                    })
                }
                
            }
        })
    }
});