/**
 * Created by Liujx on 2017-10-23 16:55:08
 */
const util = require('../../../utils/util.js');
const SelectBookUrl = require('../../../config').SelectBookUrl

Page({
    data: {
        loadmore: true,
        isNone: false,
        tempBookKey: [],
        tempImgUrl: [],
        inputVal: "",
        rows: [],
        seq: 1,
        page: 2,
        number: 0,
    },
    // 首屏加载
    onLoad: function(option) {
        var self = this;
        this.setData({
            seq: Number(option.seq)
        });
        wx.request({
            url: SelectBookUrl,
            data: {
                "searchStr": ""
            },
            success: function(result) {
                for(var i = 0; i < result.data.rows.length; i++) {
                    result.data.rows[i].checked = false;
                }
                self.setData({
                    loadmore: false,
                    rows: result.data.rows
                });
            },
            fail: function({ errMsg }) {
                self.setData({
                    loading: false
                })
            }
        })
    },
    // 上拉加载
    onReachBottom: function() {
        var self = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 5000
        })
        wx.request({
            url: SelectBookUrl,
            data: {
                "searchStr": self.data.inputVal || '',
                "page": self.data.page
            },
            success: function(result) {
                wx.hideToast();
                if (result.total === 0) {
                    util.showMessage(self, "没有更多数据了！", 3000);
                } else {
                    self.data.page++
                        self.setData({
                            loadmore: false,
                            rows: self.data.rows.concat(result.data.rows),
                            page: self.data.page
                        });
                }
            },
            fail: function({ errMsg }) {
                wx.hideToast()
                self.setData({
                    loading: false
                })
            }
        })
    },
    // 清除input
    clearInput: function() {
        this.setData({
            inputVal: ""
        });
    },
    // 输入
    inputTyping: function(e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    // 搜索接口e.detail.value
    searchRequest: function(val) {
        let self = this
        self.setData({
            isNone: false
        })
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 5000
        })
        wx.request({
            url: SelectBookUrl,
            data: {
                "searchStr": val
            },
            success: data => {
                if(!data.data.rows.length) {
                    self.setData({
                        isNone: true
                    })
                }
                wx.hideLoading();
                self.setData({
                    rows: data.data.rows,
                    inputVal: val,
                });
            },
            fail: function({ errMsg }) {
                self.setData({
                    loading: false
                })
            }
        })
    },
    // 点击搜索
    searchFun: function(e) {
        this.searchRequest(e.detail.value);
    },
    // 选择图书
    selectBook: function(e) {
        let self = this;
        let isSelect = !e.currentTarget.dataset.isselect;
        if(isSelect) {
            if(self.data.number + self.data.seq > 9) {
                util.showMessage(self, "最多选择9本图书！");
                return false;
            }
            self.data.number++
            this.setData({
                number: self.data.number
            })
        } else {
            self.data.number--
            this.setData({
                number: self.data.number--
            })
        }
        let index = e.currentTarget.dataset.index;
        let rowsArray = this.data.rows;
        rowsArray[index].checked = isSelect;
        this.setData({
            rows: self.data.rows
        })

    },
    // 扫码搜索
    scanFun: function() {
        var self = this
        wx.scanCode({
            success: data => {
                self.setData({
                    inputVal: data.result
                })
                self.searchRequest(data.result);
            }
        })
    },
    // 确认选择
    confirmSelect: function() {
        let self = this;
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1]; //当前页面
        let prevPage = pages[pages.length - 2]; //上一个页面
        let items = self.data.rows;
        for(var i = 0; i < items.length; i++) {
            if(items[i].checked) {
                let seq = self.data.seq++
                self.data.tempBookKey.push({ "bookId": items[i].bookId, "seq": seq });
                self.data.tempImgUrl.push(items[i].picPath);
            }
        }
        prevPage.setData({
            tempBookImgUrl: self.data.tempImgUrl,
            tempBookKey: self.data.tempBookKey,
            isSelectBook: true,
        });
        wx.navigateBack();
    }
})