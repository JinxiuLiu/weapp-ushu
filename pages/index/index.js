/**
 * Created by Liujx on 2017-10-13 09:42:07
 */
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const getBookListUrl = require('../../config').getBookListUrl;
const addAttentionUrl = require('../../config').addAttentionUrl;
const cancelAttentionUrl = require('../../config').cancelAttentionUrl;
const collectUrl = require('../../config').collectUrl;
const cancelCollectUrl = require('../../config').cancelCollectUrl;
const bannerUrl = require('../../config').bannerUrl;
const shareSaveUrl = require('../../config').shareSaveUrl;
const suggestionUrl = require('../../config').suggestionUrl;
const util = require('../../utils/util');
const app = getApp();
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
        isCreate: false,
        isShowList: true,
        suggestionList: []
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        let self = this;
        if (this.data.activeIndex == 0) {
            this.setData({
                pageOne: 1,
                inputVal: "",
                loadmoreDef: true,
                bookListItem: [],
            })
            this.getBookListDefRequest(self.data.searchVal)
        }

        if (this.data.activeIndex == 1) {
            this.setData({
                pageTwo: 1,
                inputVal: "",
                loadmoreHot: true,
                hotBookListItem: [],
            })
            this.getBookListHotRequest(self.data.searchVal)
        }
    },
    clearInput: function() {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function(e) {
        let self = this;
        this.data.suggestionList = [];
        this.setData({
            inputVal: e.detail.value,
            isShowList: true,
        })
        if(e.detail.value == '') return false;
        // wx.request({
        //     url: suggestionUrl,
        //     data: {
        //         keyword: e.detail.value,
        //         count: 6
        //     },
        //     header: {
        //         'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
        //     },
        //     success: data => {
        //         if(data.data.success) {
        //             self.setData({
        //                 suggestionList: data.data.data
        //             })
        //         } else {
        //             util.showMessage(self, data.data.msg)
        //         }
        //     }
        // })
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
    onShow: function() {
        let isCreate = wx.getStorageSync('isCreate')
        if (!isCreate) return false;
        this.setData({
            pageOne: 1,
            bookListItem: [],
        })
        this.getBookListDefRequest()
        wx.setStorageSync('isCreate', false)
    },
    // 上拉加载更多
    onReachBottom: function() {
        let self = this;
        if (this.data.activeIndex == 0) {
            this.setData({
                loadmoreDef: true,
            })
            this.getBookListDefRequest(self.data.searchVal)
        }

        if (this.data.activeIndex == 1) {
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

        if (this.data.activeIndex == 0) {
            this.setData({
                pageOne: 1,
                inputVal: "",
                loadmoreDef: true,
                bookListItem: [],
            })
            this.getBookListDefRequest()
        }

        if (this.data.activeIndex == 1) {
            this.setData({
                pageTwo: 1,
                inputVal: "",
                loadmoreHot: true,
                hotBookListItem: [],
            })
            this.getBookListHotRequest()
        }
    },
    // 关注
    attentionFun: function(e) {
        let self = this;
        let creatorId = e.currentTarget.dataset.creatorid;
        let index = e.currentTarget.dataset.index;
        if (e.currentTarget.dataset.followed) {
            self.attentionRequest(cancelAttentionUrl, creatorId, index, '取消关注成功！', false)
        } else {
            self.attentionRequest(addAttentionUrl, creatorId, index, '关注成功！', true)
        }

    },
    // 关注&&取消关注接口
    attentionRequest: function(url, creatorId, index, msg, isFollowed) {
        let self = this;
        wx.request({
            url: url,
            data: {
                targetId: creatorId
            },
            header: {
                'X-Requested-With': 'XMLHttpRequest',
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if (data.data.success) {
                    util.showMessage(self, msg);
                    if (self.data.activeIndex == 0) {
                        self.data.bookListItem[index].followed = isFollowed;
                        self.setData({
                            bookListItem: self.data.bookListItem
                        })
                    }
                    if (self.data.activeIndex == 1) {
                        self.data.hotBookListItem[index].followed = isFollowed;
                        self.setData({
                            hotBookListItem: self.data.hotBookListItem
                        })
                    }
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
            url: '../bookList/bookList?id=' + BookListID + '&isIndex=true'
        })
    },
    // 点击图书
    tapBook: function(e) {
        let bookId = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../bookDetails/bookDetails?id=' + bookId
        })
    },
    // 分享
    onShareAppMessage: function(res) {
        let self = this;
        let title = res.target.dataset.item.title;
        let bookListId = res.target.dataset.item.id;
        let uuid = util.uuid();
        let path = '/pages/bookList/bookList?id=' + bookListId + '&uuid=' + uuid;
        let imageUrl = res.target.dataset.item.thumbnail.url;
        if (res.from === 'button') {
            // 来自分享按钮
        }
        return {
            title: title,
            path: path,
            imageUrl: imageUrl,
            success: function(res) {
                // 转发成功
                wx.request({
                    url: shareSaveUrl,
                    method: 'POST',
                    header: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'content-type': 'application/x-www-form-urlencoded',
                        'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
                    },
                    data: {
                        id: uuid,
                        bookListId: bookListId
                    },
                    success: data => {
                        if (data.data.success) {

                        } else {
                            if(data.data.data == 401) {
                                app.loginFun()
                                return false;
                            }
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
                    if (self.data.activeIndex == 0) {
                        self.data.bookListItem[index].collected = isCollect;
                        self.setData({
                            bookListItem: self.data.bookListItem
                        })
                    }
                    if (self.data.activeIndex == 1) {
                        self.data.hotBookListItem[index].collected = isCollect;
                        self.setData({
                            hotBookListItem: self.data.hotBookListItem
                        })
                    }
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
    // 书单列表请求-最新
    getBookListDefRequest: function(keyword) {
        let self = this;
        wx.request({
            url: getBookListUrl,
            data: {
                page: self.data.pageOne,
                rows: 10,
                sort: 'publishDate',
                order: "desc",
                keyword: keyword || '',
                published: true
            },
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: result => {
                if (result.data.success) {
                    let items = result.data.data.rows;
                    wx.stopPullDownRefresh()
                    if (items.length == 0) {
                        self.setData({
                            loadmoreDef: false
                        })
                        util.showMessage(self, '没有更多数据！')
                        return false;
                    }
                    items.filter(function(item) {
                        let index = 0;
                        if (item.tags) {
                            item.tags = item.tags.split(',')
                        }
                        if(item.title) {
                            item.voiceTitle = item.title.substring(0,6)
                        }
                        if(item.video) {
                            index++
                        }
                        if(item.voice) {
                            index++
                        }
                        if(item.images.length) {
                            index++
                        }
                        item.ItemIndex = index;
                    })
                    self.data.pageOne++
                        self.setData({
                            page: self.data.pageOne,
                            loadmoreDef: false,
                            bookListItem: self.data.bookListItem.concat(items)
                        })
                } else {
                    util.showMessage(self, result.data.msg);
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
                keyword: keyword || '',
                published: true
            },
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: result => {
                if (result.data.success) {
                    let items = result.data.data.rows;
                    wx.stopPullDownRefresh()
                    if (items.length == 0) {
                        self.setData({
                            loadmoreHot: false
                        })
                        util.showMessage(self, '没有更多数据！')
                        return false;
                    }
                    items.filter(function(item) {
                        let index = 0;
                        if (item.tags) {
                            item.tags = item.tags.split(',')
                        }
                        if(item.title) {
                            item.voiceTitle = item.title.substring(0,6)
                        }
                        if(item.video) {
                            index++
                        }
                        if(item.voice) {
                            index++
                        }
                        if(item.images.length) {
                            index++
                        }
                        item.ItemIndex = index;
                    })
                    self.data.pageTwo++
                    self.setData({
                        page: self.data.pageTwo,
                        loadmoreHot: false,
                        hotBookListItem: self.data.hotBookListItem.concat(items)
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
        if (this.data.activeIndex == 0) {
            this.setData({
                pageOne: 1,
                loadmoreDef: true,
                bookListItem: []
            })
            this.getBookListDefRequest(e.detail.value);
        }
        if (this.data.activeIndex == 1) {
            this.setData({
                pageTwo: 1,
                loadmoreHot: true,
                hotBookListItem: []
            })
            this.getBookListHotRequest(e.detail.value);
        }
    },
    // 书单提示搜索
    tapSuggestionFun: function(e) {
        let self = this;
        let keyword = e.currentTarget.dataset.item;
        this.setData({
            inputVal: keyword,
            isShowList: false,
        })
        if (this.data.activeIndex == 0) {
            this.setData({
                pageOne: 1,
                loadmoreDef: true,
                bookListItem: []
            })
            this.getBookListDefRequest(keyword);
        }
        if (this.data.activeIndex == 1) {
            this.setData({
                pageTwo: 1,
                loadmoreHot: true,
                hotBookListItem: []
            })
            this.getBookListHotRequest(keyword);
        }
    },
    // banner 
    bannerRequest: function() {
        let self = this;
        wx.request({
            url: bannerUrl,
            data: {},
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                self.setData({
                    imgUrls: data.data
                })
            }
        })
    }
});