/**
 * Created by Liujx on 2017-11-05 15:21:54
 */
const paymentUrl = require('../../../config').paymentUrl;
const pingpp = require('../../../utils/pingpp.js');
const util = require('../../../utils/util.js');
Page({
    data: {
        id: '',
        money: ''
    },
    onLoad: function(option) {
        this.setData({
            id: option.id,
            money: option.money
        })
    },
    // 支付
    paymentFun: function() {
        let self = this;
        wx.request({
            url: paymentUrl,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            data: {
                orderId: self.data.id,
                money: self.data.money
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
    }
})