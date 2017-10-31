/**
 * Created by Liujx on 2017-10-13 09:42:07
 */

const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const getBookListUrl = require('../../config').getBookListUrl;
const addAttentionUrl = require('../../config').addAttentionUrl;
const collectUrl = require('../../config').collectUrl;
const util = require('../../utils/util');

Page({
    data: {
        inputVal: "",
        imgUrls: [
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        tabs: ["最新", "最热"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        loadmore: true,
        isTabClick: true,
        pageOne: 2,
        pageTwo: 2,
        isMore: true,
        isHotMore: true,
        isCollect: false,
        bookListItem: [],
        hotBookListItem: []
    },
    clearInput: function() {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function(e) {
        this.setData({
            inputVal: e.detail.value
        })
    },
    onLoad: function() {
        var self = this;
        wx.getSystemInfo({
            success: res => {
                self.setData({
                    sliderLeft: (res.windowWidth / self.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / self.data.tabs.length * self.data.activeIndex
                });
            }
        });
    },
    // 页面显示
    onShow: function() {
        this.getBookListRequest(false);
    },
    // 页面隐藏
    onHide: function() {
        this.setData({
            isTabClick: true,
            isMore: true,
            isHotMore: true,
        })
    },
    // 上拉加载更多
    onReachBottom: function() {
        var self = this
        
        if(self.data.isTabClick) {
            if(!self.data.isMore) return false;
            // 默认列表
            wx.request({
                url: getBookListUrl,
                data: {
                    page: self.data.pageOne,
                    rows: 10,
                    sort: 'created',
                    order: 'desc'
                },
                success: result => {
                    if (result.data.success) {
                        if(!result.data.data.rows.length) {
                            util.showMessage(self, '没有更多数据了！');
                            self.setData({
                                isMore: false
                            })
                        }
                        self.data.pageOne++
                        self.setData({
                            pageOne: self.data.pageOne,
                            loadmore: false,
                            bookListItem: self.data.bookListItem.concat(result.data.data.rows)
                        })
                    } else {
                        util.showMessage(self, result.data.msg);
                    }
                }
            })
        } else {
            if(!self.data.isHotMore) return false;
            // 热门列表
            wx.request({
                url: getBookListUrl,
                data: {
                    page: self.data.pageOne,
                    rows: 10,
                    sort: 'readCount',
                    order: 'desc'
                },
                success: result => {
                    if (result.data.success) {
                        if(!result.data.data.rows.length) {
                            util.showMessage(self, '没有更多数据了！');
                            self.setData({
                                isHotMore: false
                            })
                        }
                        self.data.pageTwo++
                        self.setData({
                            pageTwo: self.data.pageTwo,
                            loadmore: false,
                            hotBookListItem: self.data.hotBookListItem.concat(result.data.data.rows)
                        })
                    } else {
                        util.showMessage(self, result.data.msg);
                    }
                }
            })
        }
    },
    // tab 栏切换
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        })
        if (!this.data.isTabClick) {
            return false;
        }
        if (e.currentTarget.id) {
            this.getBookListRequest(true)
            this.setData({
                isTabClick: false
            })
        }
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
    // 点击书单
    tapBookList: function(e) {
        let BookListID = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../bookList/bookList?id=' + BookListID
        })
    },
    // 点击图书
    tapBook: function() {
        wx.navigateTo({
            url: '../bookDetails/bookDetails?id='
        })
    },
    // 分享
    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '自定义转发标题',
            path: '/page/user?id=123',
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
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
                    util.showMessage(self, '收藏成功！');
                    self.getBookListRequest(!this.data.isTabClick)
                } else {
                    util.showMessage(self, data.data.msg);
                }
            }
        })
    },
    // 书单列表请求
    getBookListRequest: function(isReadCount) {
        let self = this;
        let sort = isReadCount ? "readCount" : "created";
        self.setData({
            loadmore: true
        })
        wx.request({
            url: getBookListUrl,
            data: {
                page: 1,
                rows: 10,
                sort: sort,
                order: "desc"
            },
            success: result => {
                if (result.data.success) {
                    if (isReadCount) {
                        self.setData({
                            loadmore: false,
                            hotBookListItem: result.data.data.rows
                        })
                    } else {
                        self.setData({
                            loadmore: false,
                            bookListItem: result.data.data.rows
                        })
                    }
                } else {
                    util.showMessage(self, result.data.msg);
                }
            },
            fail: function({ errMsg }) {
                self.setData({
                    loadmore: false
                })
            }
        })
    }
});