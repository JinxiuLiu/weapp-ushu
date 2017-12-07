/**
 * Created by Liujx on 2017-11-03 10:44:57
 */
const addWithdrawalUrl = require('../../../../config').addWithdrawalUrl;
const kitingSendUrl = require('../../../../config').kitingSendUrl;
const util = require('../../../../utils/util');
Page({
    data: {
        money: '',
        inputMoney: '',
        isClick: false,
        verificationCode: '',
        countDown: "获取验证码",
    },
    onLoad: function(option) {
        this.setData({
            money: option.money
        })
    },
    // 全部提现
    allWithdrawFun: function() {
        let self = this;
        this.setData({
            inputMoney: self.data.money
        })
    },
    // 验证码 input
    verificationCodeFun: function(e) {
        this.setData({
            verificationCode: e.detail.value
        })
    },
    // 确认提现
    affirmWithdrawFun: function() {
        let self = this;
        let money = self.data.inputMoney;
        let dynamicCode = self.data.verificationCode
        if (!(money > 0)) {
            util.showMessage(self, '提现金额不正确！');
            return false;
        }
        if (!/^\d{4}$/.test(dynamicCode) || dynamicCode == "") {
            util.showMessage(self, '请输入正确的短信验证码!')
            return false;
        }
        wx.request({
            url: addWithdrawalUrl,
            data: {
                money: money,
                dynamicCode: dynamicCode
            },
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if (data.data.success) {
                    util.showMessage(self, '提现成功！');
                } else {
                    util.showMessage(self, data.data.msg);
                }
            }
        })
    },
    bindKeyInput: function(e) {
        this.setData({
            inputMoney: e.detail.value
        })
    },
    // 发送短信验证码
    sendMsgFun: function() {
        let self = this;
        if (self.data.isClick) return false;
        wx.request({
            url: kitingSendUrl,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            data: {},
            success: data => {
                if (data.data.success) {
                    wx.showModal({
                        title: '提示',
                        content: '短信验证码发送到您的尾号：' + data.data.data + '的手机，请注意查收~',
                        success: function(res) {}
                    })
                    self.countDownFun(100);
                } else {
                    util.showMessage(self, data.data.msg);
                }
            }
        })
    },
    // 倒计时
    countDownFun: function(timer) {
        let self = this;
        self.setData({
            countDown: timer,
            isClick: true
        })
        let time = setInterval(() => {
            let countDown = self.data.countDown
            countDown--
            self.setData({
                countDown: countDown
            })
            if (countDown == 0) {
                clearInterval(time)
                self.setData({
                    countDown: "发送验证码",
                    isClick: false
                })
            }
        }, 1000)
    }
})