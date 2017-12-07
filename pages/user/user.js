/**
 * Created by Liujx on 2017-10-13 09:41:21
 */
const aboutUrl = require('../../config').aboutUrl;
const totalMoneyUrl = require('../../config').totalMoneyUrl;
const app = getApp();

Page({
    data: {
        userName: '',
        avatarUrl: '',
        totalMoney: '',
    },
    onShow: function() {
        this.userRequest();
        this.totalMoneyRequest();
    },
    // 获取用户头像
    userRequest: function() {
        let self = this;
        wx.request({
            url: aboutUrl,
            data: {},
            header: {
                'X-Requested-With': 'XMLHttpRequest',
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if(data.data.success) {
                    self.setData({
                        userName: data.data.data.name,
                        avatarUrl: data.data.data.photo.url
                    })
                } else {
                    if(data.data.data == 401) {
                        app.loginFun(self.onShow)
                    }
                }
                
            }
        })
    },
    // 获取总收益
    totalMoneyRequest: function() {
        let self = this;
        wx.request({
            url: totalMoneyUrl,
            header: {
                'X-Requested-With': 'XMLHttpRequest',
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            data: {},
            success: data => {
                self.setData({
                    totalMoney: data.data.data
                })
            }
        })
    }
})