/**
 * Created by Liujx on 2017-10-20 16:50:51
 */
const orderDetailUrl = require('../../../config').orderDetailUrl;
const commitUrl = require('../../../config').commitUrl;
const paymentUrl = require('../../../config').paymentUrl;
const pingpp = require('../../../utils/pingpp.js');
const util = require('../../../utils/util');
Page({
    data: {
        orderDetailList: [],
        myself: true,
    },
    // 生命周期函数--监听页面显示
    onLoad: function(option) {
        let self = this;
        let id = option.id;
        let myself = option.myself;
        this.setData({
            myself: myself
        })
        wx.request({
            url: orderDetailUrl,
            method: 'POST',
            data: {
                id: id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
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
        let data = self.data.orderDetailList[0];
        let id = data.id;
        let totalMoney = data.totalMoney;
        wx.request({
            url: paymentUrl,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
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
    // 退货退款
    tapRefunds: function() {
        wx.showModal({
            title: '退货退款提示',
            cancelText: '取消',
            confirmText: '拨打',
            content: '如需退款，请在工作时间联系邮书客服\n客服电话：010-62991200\n咨询时间：周一至周五，9:00-16:30',
            success: function(res) {
                if (res.confirm) {
                    wx.makePhoneCall({
                        phoneNumber: '010-62991200'
                    })
                }
            }
        })
    },
    // 申请发票
    tapInvoice: function() {
        wx.showModal({
            title: '申请发票提示',
            cancelText: '取消',
            confirmText: '拨打',
            content: '如需发票，请在工作时间联系邮书客服\n客服电话：010-62991200\n咨询时间：周一至周五，9:00-16:30',
            success: function(res) {
                if (res.confirm) {
                    wx.makePhoneCall({
                        phoneNumber: '010-62991200'
                    })
                }
            }
        })
    }
})