/**
 * Created by Liujx on 2017-10-18 15:43:27
 */
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const orderListUrl = require('../../../config').orderListUrl;
let sessionId = wx.getStorageSync('sessionId')
Page({
    data: {
        tabs: ["全部", "待付款", "待收货"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        loadmore: true,
        orderList: [],
    },
    onLoad: function() {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
        wx.request({
            url: orderListUrl,
            method: 'POST',
            data: {
                rows: 999
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'Cookie': 'JSESSIONID=' + sessionId
            },
            success: data => {
                if (data.data.success) {
                    that.setData({
                        loadmore: false,
                        orderList: data.data.data
                    })
                } else {
                    util.showMessage(that, data.data.msg)
                }
            }
        });
    },
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    // 查看详情
    SeeDetailsFun: function(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../submitOrder/orderDetails/orderDetails?id=' + id
        })
    },
    // 赠朋友
    giveFriendFun: function(e) {
        let self = this;
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: './giveFriend/giveFriend?id=' + id
        })
    },
    // 图书详情
    tapBookFun: function(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../bookDetails/bookDetails?id=' + id
        })
    }
});