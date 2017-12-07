//app.js
const loginUrl = require('config').loginUrl;
const QQMapWX = require('utils/qqmap-wx-jssdk.min.js');
App({
    globalData: {
        code: '',
        encryptedData: null,
        ivStr: null,
        isLogin: true,
    },
    onLaunch: function() {
        // 获取地理位置
        this.getLocationFun()
        // 登录
        // this.loginFun()
    },
    // 登录
    loginFun: function(callback) {
        let self = this;
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                self.globalData.code = res.code;
                this.authorizeFun(callback);
            }
        })
    },
    // 授权
    authorizeFun: function(callback) {
        let self = this;
        // 获取用户信息
        wx.authorize({
            scope: 'scope.userInfo',
            success: data => {
                wx.getUserInfo({
                    success: res => {
                        self.globalData.encryptedData = res.encryptedData
                        self.globalData.ivStr = res.iv
                        self.loginRequest(callback)
                    }
                })
            },
            fail: res => {
                if (res.errMsg == 'authorize:fail auth deny') {
                    // 未授权提示
                    self.noAuthorizationFun(callback);
                }
            }
        })
    },
    // 注册请求
    loginRequest: function(callback) {
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
                        self.globalData.isLogin = false;
                    }
                    if(self.globalData.isLogin && callback) {
                        callback()
                    }
                    wx.setStorageSync('sessionId', data.data.data.sessionId)
                }
            }
        })
    },
    // 未授权提示
    noAuthorizationFun: function(callback) {
        let self = this;
        wx.showModal({
            title: '警告',
            cancelText: '不授权',
            confirmText: '授权',
            confirmColor: '#ff4444',
            content: '若不授权微信登录，则无法使用邮书功能；点击重新获取授权，则可重新使用；若点击不授权，后期还使用小程序，需在微信【发现】--【小程序】--删掉【邮书】，重新搜索授权登录，方可使用。',
            success: res => {
                if (res.confirm) {
                    self.openSettingFun(callback)
                } else {
                    wx.switchTab({
                        url: '../index/index'
                    })
                }
            }
        })
    },
    // 二次授权，通过设置进行授权
    openSettingFun: function(callback) {
        let self = this;
        wx.openSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: res => {
                            self.globalData.encryptedData = res.encryptedData
                            self.globalData.ivStr = res.iv
                            self.loginRequest(callback)
                        }
                    })
                }
            }
        })
    },
    // 获取经纬度
    getLocationFun: function() {
        let self = this;
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                let latitude = res.latitude // 纬度
                let longitude = res.longitude   // 经度
                self.QQMapWXFun(latitude, longitude)
            }
        })
    },
    // 逆地址解析
    QQMapWXFun: function(latitude, longitude) {
        const demo = new QQMapWX({
            key: 'W2SBZ-AXFCV-BLDPY-UPBFN-K6B6Q-TOF6H' // 必填
        })
        demo.reverseGeocoder({
            location: {
                latitude: latitude,
                longitude: longitude
            },
            success: function(res) {
            },
            fail: function(res) {
            },
            complete: function(res) {
            }
        })
    }
})