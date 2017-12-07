/**
 * Created by Liujx on 2017-10-19 13:21:53
 */
const sendCodeUrl = require('../../config').sendCodeUrl;
const registerUrl = require('../../config').registerUrl;
const util = require('../../utils/util');
Page({
    data: {
        countDown: "发送验证码",
        isClick: false,
        NowMobile: '',
        verificationCode: '',
        checked: false,
    },
    // 新手机号 input
    NowMobileFun: function(e) {
        this.setData({
            NowMobile: e.detail.value
        })
    },
    // 验证码 input
    verificationCodeFun: function(e) {
        this.setData({
            verificationCode: e.detail.value
        })
    },
    // 发送短信验证码
    sendMsgFun: function() {
        let self = this;
        let NowMobile = self.data.NowMobile;
        if (self.data.isClick) return false;
        if (!/^1\d{10}$/.test(NowMobile) || NowMobile == "") {
            util.showMessage(self, '请输入正确的新手机号!')
            return false;
        }
        wx.request({
            url: sendCodeUrl,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            data: {
                mobile: NowMobile
            },
            success: data => {
                if (data.data.success) {
                    util.showMessage(self, data.data.msg);
                    self.countDownFun(100);
                } else {
                    util.showMessage(self, data.data.msg);
                }
            }
        })
    },
    // 提交
    submitFun: function() {
        let self = this;
        let NowMobile = self.data.NowMobile;
        let verificationCode = self.data.verificationCode;

        if (!/^1\d{10}$/.test(NowMobile) || NowMobile == "") {
            util.showMessage(self, '请输入正确的新手机号!')
            return false;
        }

        if (!/^\d{4}$/.test(verificationCode) || verificationCode == "") {
            util.showMessage(self, '请输入正确的短信验证码!')
            return false;
        }

        if(!self.data.checked) {
            util.showMessage(self, '请同意用户协议!')
            return false;
        }

        wx.request({
            url: registerUrl,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            data: {
                mobile: NowMobile,
                dynamicCode: verificationCode
            },
            success: data => {
                if (data.data.success) {
                    util.showMessage(self, data.data.msg);
                    setTimeout(function() {
                        wx.switchTab({
                            url: '../index/index'
                        })
                    }, 2000)
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
    },
    // 查看用户协议
    tapAgreementFun: function() {
        wx.navigateTo({
            url: '../agreement/agreement'
        })
    },
    // 选择用户协议
    checkboxChange: function(e) {
        let checked = !e.currentTarget.dataset.checked;
        this.setData({
            checked: checked
        })
    }
})