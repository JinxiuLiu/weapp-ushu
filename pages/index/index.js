/**
 * Created by Liujx on 2017-10-13 09:42:07
 */

const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const getBookListUrl = require('../../config').getBookListUrl;
const addAttentionUrl = require('../../config').addAttentionUrl;
const collectUrl = require('../../config').collectUrl;
const bannerUrl = require('../../config').bannerUrl;
const shareSaveUrl = require('../../config').shareSaveUrl;
const util = require('../../utils/util');

Page({
    data: {
        inputVal: "",
        searchVal: "",
        imgUrls: [],
        tabs: ["最新", "最热"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        loadmoreDef: true,
        loadmoreHot: true,
        pageOne: 1,
        pageTwo: 1,
        isMore: true,
        isHotMore: true,
        bookListItem: [],
        hotBookListItem: [],
        isCollect: false,
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
        this.bannerRequest()
        this.getBookListDefRequest()
        wx.getSystemInfo({
            success: res => {
                self.setData({
                    sliderLeft: (res.windowWidth / self.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / self.data.tabs.length * self.data.activeIndex
                });
            }
        })
    },
    // 上拉加载更多
    onReachBottom: function() {
        let self = this;
        if(this.data.activeIndex == 0) {
            this.setData({
                loadmoreDef: true,
            })
            this.getBookListDefRequest(self.data.searchVal)
        }

        if(this.data.activeIndex == 1) {
            this.setData({
                loadmoreHot: true,
            })
            this.getBookListHotRequest(self.data.searchVal)
        }
    },
    // tab 栏切换
    tabClick: function(e) {
        let self = this;
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        })

        if(this.data.activeIndex == 0) {
            this.setData({
                pageOne: 1,
                loadmoreDef: true,
                bookListItem: [],
            })
            this.getBookListDefRequest(self.data.searchVal)
        }

        if(this.data.activeIndex == 1) {
            this.setData({
                pageTwo: 1,
                loadmoreHot: true,
                hotBookListItem: [],
            })
            this.getBookListHotRequest(self.data.searchVal)
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
                        bookListId: bookListId
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
                } else {
                    util.showMessage(self, data.data.msg);
                }
            }
        })
    },
    // 书单列表请求-最新
    getBookListDefRequest: function(keyword) {
        let self = this;
        wx.request({
            url: getBookListUrl,
            data: {
                page: self.data.pageOne,
                rows: 10,
                sort: 'created',
                order: "desc",
                keyword: keyword || ''
            },
            success: result => {
                if (result.data.success) {
                    let items = result.data.data.rows;
                    if(items.length == 0) {
                        self.setData({
                            loadmoreDef: false
                        })
                        util.showMessage(self, '没有更多数据！')
                        return false;
                    }
                    items.filter(function(item) {
                        if(item.tags) {
                            item.tags = item.tags.split(',')
                        }
                    })
                    self.data.pageOne++
                        self.setData({
                            page: self.data.pageOne,
                            loadmoreDef: false,
                            bookListItem: self.data.bookListItem.concat(result.data.data.rows)
                        })
                } else {
                    util.showMessage(self, '服务端错误！');
                }
            }
        })
    },
    // 书单列表请求-最热
    getBookListHotRequest: function(keyword) {
        let self = this;
        wx.request({
            url: getBookListUrl,
            data: {
                page: self.data.pageTwo,
                rows: 10,
                sort: 'readCount',
                order: "desc",
                keyword: keyword || ''
            },
            success: result => {
                if (result.data.success) {
                    let items = result.data.data.rows;
                    if(items.length == 0) {
                        self.setData({
                            loadmoreHot: false
                        })
                        util.showMessage(self, '没有更多数据！')
                        return false;
                    }
                    items.filter(function(item) {
                        if(item.tags) {
                            item.tags = item.tags.split(',')
                        }
                    })
                    self.data.pageTwo++
                    self.setData({
                        page: self.data.pageTwo,
                        loadmoreHot: false,
                        hotBookListItem: self.data.hotBookListItem.concat(result.data.data.rows)
                    })
                } else {
                    util.showMessage(self, '服务端错误！');
                }
            }
        })
    },
    // 书单搜索
    searchFun: function(e) {
        this.setData({
            searchVal: e.detail.value
        })
        if(this.data.activeIndex == 0) {
            this.setData({
                pageOne: 1,
                loadmoreDef: true,
                bookListItem: []
            })
            this.getBookListDefRequest(e.detail.value);
        }
        if(this.data.activeIndex == 1) {
            this.setData({
                pageTwo: 1,
                loadmoreHot: true,
                hotBookListItem: []
            })
            this.getBookListHotRequest(e.detail.value);
        }
    },
    // banner 
    bannerRequest: function() {
        let self = this;
        wx.request({
            url: bannerUrl,
            data: {},
            success: data => {
                self.setData({
                    imgUrls: data.data
                })
            }
        })
    }
});