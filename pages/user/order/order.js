/**
 * Created by Liujx on 2017-10-18 15:43:27
 */
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const orderListUrl = require('../../../config').orderListUrl;
const util = require('../../../utils/util');
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
        var self = this;
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    sliderLeft: (res.windowWidth / self.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / self.data.tabs.length * self.data.activeIndex
                });
            }
        });
        this.orderListRequest();
    },
    onPullDownRefresh: function () {
        this.orderListRequest();
    },
    orderListRequest: function() {
        let self = this;
        wx.request({
            url: orderListUrl,
            method: 'POST',
            data: {
                rows: 999
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if (data.data.success) {
                    self.setData({
                        loadmore: false,
                        orderList: data.data.data
                    })
                } else {
                    util.showMessage(self, data.data.msg)
                }
                wx.stopPullDownRefresh()
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
        let myself = e.currentTarget.dataset.myself;
        wx.navigateTo({
            url: '../../submitOrder/orderDetails/orderDetails?id=' + id + '&myself=' + myself,
            fail: res => {
                wx.redirectTo({
                    url: '../../submitOrder/orderDetails/orderDetails?id=' + id + '&myself=' + myself,
                })
            }
        })
    },
    // 赠朋友
    giveFriendFun: function(e) {
        let self = this;
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: './giveFriend/giveFriend?id=' + id,
            fail: res => {
                wx.redirectTo({
                    url: './giveFriend/giveFriend?id=' + id
                })
            }
        })
    },
    // 图书详情
    tapBookFun: function(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../bookDetails/bookDetails?id=' + id,
            fail: res => {
                wx.redirectTo({
                    url: '../../bookDetails/bookDetails?id=' + id
                })
            }
        })
    },
    // 查看物流
    getLogisticsFun: function(e) {
        let id = e.currentTarget.dataset.id;
        if(!id) {
            util.showMessage(this, '您的订单还未发货哦~')
            return false
        }
        wx.navigateTo({
            url: '../getLogistics/getLogistics?id=' + id,
            fail: res => {
                wx.redirectTo({
                    url: '../getLogistics/getLogistics?id=' + id
                })
            }
        })
    }
});