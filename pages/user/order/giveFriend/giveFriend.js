/**
 * Created by Liujx on 2017-11-07 17:32:05
 */
const orderDetailUrl = require('../../../../config').orderDetailUrl;
const checkTextUrl = require('../../../../config').checkTextUrl;
const util = require('../../../../utils/util');
Page({
    data: {
        id: '',
        isShare: true,
        bookItem: [],
        bindinput: '那时我们有梦，关于文学，关于爱情，关于穿越世界。'
    },
    onLoad: function(options) {
        let self = this;
        let id = options.id;
        wx.request({
            url: orderDetailUrl,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            data: {
                id: id
            },
            success: data => {
                if (data.data.success) {
                    self.setData({
                        id: id,
                        bookItem: data.data.data.itemList
                    })
                }
            }
        })
    },
    bindinput: function(e) {
        this.setData({
            bindinput: e.detail.value
        })
    },
    // 确认赠言
    confirmGiveText: function() {
        let self = this;
        wx.showLoading({
            title: '易盾校验中...'
        })
        wx.request({
            url: checkTextUrl,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            data: {
                content: self.data.bindinput
            },
            success: data => {
                if (data.data.success) {
                    wx.hideLoading()
                    if(data.data.msg == '') {
                        self.setData({
                            isShare: false,
                        })
                    } else {
                        wx.showModal({
                            title: '审核结果',
                            showCancel: false,
                            confirmText: '确定',
                            confirmColor: '#ff4444',
                            content: '赠言内容涉嫌违规，请您重新修改！',
                            success: function(res) {
                                if (res.confirm) {
                                   
                                }
                            }
                        })
                    }
                }
            }
        })
    },
    // 赠朋友
    onShareAppMessage: function(res) {
        let self = this;
        let id = self.data.id;
        let item = self.data.bookItem;
        let array = [];
        let title = '';
        let path = '';
        for (var j = 0; j < item.length; j++) {
            for (var k = 0; k < item[j].items.length; k++) {
                array.push(item[j].items[k]);
            }
        }
        if (res.from === 'button') {
            title = '我刚从邮书给你买了' + array.length + '本书，希望你喜欢~'
            path = '/pages/giveAddress/giveAddress?orderId=' + id
        }
        return {
            title: title,
            path: path,
            success: function(res) {
                // 转发成功
                wx.showModal({
                    title: '赠送成功',
                    showCancel: false,
                    confirmText: '确定',
                    confirmColor: '#ff4444',
                    content: '请提示朋友尽快填写收货地址~',
                    success: function(res) {
                        if (res.confirm) {
                            wx.navigateBack()
                        }
                    }
                })
            },
            fail: function(res) {
                // 转发失败
            }
        }
        
    }
})