//app.js
const loginUrl = require('config').loginUrl;
App({
    onLaunch: function() {
        let self = this;
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                self.globalData.code = res.code;
                this.authorizeFun();
            }
        })
    },
    globalData: {
        code: '',
        encryptedData: null,
        ivStr: null
    },
    // 授权
    authorizeFun: function() {
        let self = this;
        // 获取用户信息
        wx.authorize({
            scope: 'scope.userInfo',
            success: data => {
                wx.getUserInfo({
                    success: res => {
                        self.globalData.encryptedData = res.encryptedData
                        self.globalData.ivStr = res.iv
                        self.loginRequest()
                    },
                    fail: res => {
                        if (res.errMsg == 'getUserInfo:fail auth deny') {
                            wx.showModal({
                                title: '警告',
                                cancelText: '不授权',
                                confirmText: '授权',
                                content: '若不授权微信登录，则无法使用邮书功能；点击重新获取授权，则可重新使用；若点击不授权，后期还使用小程序，需在微信【发现】--【小程序】--删掉【邮书】，重新搜索授权登录，方可使用。',
                                success: function(res) {
                                    if (res.confirm) {
                                        wx.openSetting({
                                            success: res => {
                                                if (res.authSetting['scope.userInfo']) {
                                                    wx.getUserInfo({
                                                        success: res => {
                                                            self.globalData.encryptedData = res.encryptedData
                                                            self.globalData.ivStr = res.iv
                                                            self.loginRequest()
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
    },
    // 注册请求
    loginRequest: function() {
        let self = this;
        wx.request({
            url: loginUrl,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                code: self.globalData.code,
                encryptedData: self.globalData.encryptedData,
                ivStr: self.globalData.ivStr
            },
            success: data => {
                if (data.data.success) {
                    if (!data.data.data.login) {
                        wx.navigateTo({
                            url: '/pages/login/login'
                        })
                    }
                    wx.setStorageSync('sessionId', data.data.data.sessionId)
                }
            }
        })
    }
})