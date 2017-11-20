/**
 * Created by Liujx on 2017-11-03 10:44:57
 */
const addWithdrawalUrl = require('../../../../config').addWithdrawalUrl;
const util = require('../../../../utils/util');
Page({
    data: {
        money: '',
        inputMoney: '',
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
    // 确认提现
    affirmWithdrawFun: function() {
        let self = this;
        let money = self.data.inputMoney;
        console.log(money > 0)
        if (!(money > 0)) {
            util.showMessage(self, '提现金额不正确！');
            return false;
        }
        wx.request({
            url: addWithdrawalUrl,
            data: {
                money: money
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
    }
})