/**
 * Created by Liujx on 2017-10-13 09:42:07
 */

const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const getBookListUrl = require('../../config').getBookListUrl;
const addAttentionUrl = require('../../config').addAttentionUrl;
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
        page: 1,
        bookListItem: []
    },
    clearInput: function() {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function(e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    onLoad: function() {
        var that = this;
        that.getBookListRequest();
        wx.getSystemInfo({
            success: res => {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
    },
    // 页面显示
    onShow: function() {
        this.onLoad();
    },
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
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
                if(data.data.success) {
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
    // 书单列表
    getBookListRequest: function() {
        var self = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 5000
        })
        wx.request({
            url: getBookListUrl,
            data: {
                "page": self.data.page
            },
            success: result => {
                wx.hideLoading();
                if(result.data.success) {
                    self.setData({
                        bookListItem: result.data.data.rows
                    });
                } else {
                    console.log(result.data.msg)
                }
            },
            fail: function({ errMsg }) {
                self.setData({
                    loading: false
                })
            }
        })
    }
});