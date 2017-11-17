/**
 * Created by Liujx on 2017-10-20 16:50:51
 */
const orderDetailUrl = require('../../../config').orderDetailUrl;
const commitUrl = require('../../../config').commitUrl;
const paymentUrl = require('../../../config').paymentUrl;
const pingpp = require('../../../utils/pingpp.js');
const util = require('../../../utils/util');
let sessionId = wx.getStorageSync('sessionId')
Page({
    data: {
        orderDetailList: []
    },
    // 生命周期函数--监听页面显示
    onLoad: function(option) {
        let self = this;
        let id = option.id;
        wx.request({
            url: orderDetailUrl,
            method: 'POST',
            data: {
                id: id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'Cookie': 'JSESSIONID=' + sessionId
            },
            success: data => {
                if (data.data.success) {
                    self.setData({
                        orderDetailList: self.data.orderDetailList.concat(data.data.data)
                    })
                } else {
                    util.showMessage(self, data.data.msg)
                }
            }
        });
    },
    // 电子发票
    selectInvoice: function(e) {
        let self = this;
        let isInvoice = !e.currentTarget.dataset.isinvoice;
        self.data.orderDetailList[0].invoice = isInvoice;
        self.setData({
            orderDetailList: self.data.orderDetailList
        })
    },
    // 支付
    submitOrderFun: function() {
        let self = this;
        let sessionId = wx.getStorageSync('sessionId');
        let data = self.data.orderDetailList[0];
        let id = data.id;
        let totalMoney = data.totalMoney;
        wx.request({
            url: paymentUrl,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=' + sessionId
            },
            data: {
                orderId: id,
                money: totalMoney
            },
            success: data => {
                if (data.data.success) {
                    pingpp.createPayment(data.data.data, function(result, err) {
                        if (result == "success") {
                            // payment succeeded
                            util.showMessage(self, '支付成功！')
                            setTimeout(function() {
                                wx.navigateTo({
                                    url: '../../user/order/order'
                                })
                            }, 2000)
                        } else {

                        }
                    })
                }
            }
        })
    },
    // 跳转图书
    tapBookFun: function(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../../bookDetails/bookDetails?id=' + id
        })
    },
    // 查看物流
    tapLogistics: function(e) {
        let id = e.currentTarget.dataset.id;
        if(!id) {
            util.showMessage(this, '您的订单还未发货哦~')
            return false
        }
        wx.navigateTo({
            url: '../../user/getLogistics/getLogistics?id=' + id
        })
    }
})