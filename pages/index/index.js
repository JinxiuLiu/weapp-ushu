/**
 * Created by Liujx on 2017-10-13 09:42:07
 */

const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const getBookListUrl = require('../../config').getBookListUrl;
const host = require('../../config').host;

Page({
    data: {
        host: host,
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
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    onLoad: function () {
        var that = this;
        that.getBookListRequest();
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    tapBookList: function(e) {
        let BookListID = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../bookList/bookList?id=' + BookListID
        })
    },
    tapBook: function() {
        wx.navigateTo({
            url: '../bookDetails/bookDetails?id='
        })
    },
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
            success: function(result) {
                wx.hideLoading();
                self.setData({
                    bookListItem: result.data.data.rows
                });
            },
            fail: function({errMsg}) {
                console.log('request fail', errMsg)
                self.setData({
                    loading: false
                })
            }
        })
    }
});
