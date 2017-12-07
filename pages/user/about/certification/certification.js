/**
 * Created by Liujx on 2017-10-19 13:52:27
 */
const identityCardUrl = require('../../../../config').identityCardUrl;
const commitCardUrl = require('../../../../config').commitCardUrl;
const myCardUrl = require('../../../../config').myCardUrl;
const util = require('../../../../utils/util');
Page({
    data: {
        imageListOne: [],
        imageListTwo: [],
        id: '',
        frontId: '',
        backId: '',
    },
    onLoad: function() {
        let self = this;
        wx.request({
            url: myCardUrl,
            method: 'POST',
            data: {},
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if (data.data.success) {
                    if (!data.data.data) return false;
                    self.setData({
                        imageListOne: [data.data.data.front.url],
                        imageListTwo: [data.data.data.back.url],
                        frontId: data.data.data.front.id,
                        backId: data.data.data.back.id,
                        id: data.data.data.id
                    })
                }
            }
        })
    },
    sourceTypeChange: function(e) {
        this.setData({
            sourceTypeIndex: e.detail.value
        })
    },
    sizeTypeChange: function(e) {
        this.setData({
            sizeTypeIndex: e.detail.value
        })
    },
    countChange: function(e) {
        this.setData({
            countIndex: e.detail.value
        })
    },
    // 个人信息面 上传
    chooseImageOne: function() {
        var self = this
        wx.chooseImage({
            count: 1,
            success: res => {
                self.setData({
                    imageListOne: res.tempFilePaths
                })
                wx.uploadFile({
                    url: identityCardUrl,
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    header: {
                        'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
                    },
                    success: data => {
                        let frontID = JSON.parse(data.data).data[0].id
                        self.setData({
                            frontId: frontID
                        })
                    },
                    fail: res => {
                        util.showMessage(self, "服务器端错误！");
                    }
                })
            }
        })
    },
    // 国徽面 上传
    chooseImageTwo: function() {
        var self = this
        wx.chooseImage({
            count: 1,
            success: res => {
                self.setData({
                    imageListTwo: res.tempFilePaths
                })
                wx.uploadFile({
                    url: identityCardUrl,
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    header: {
                        'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
                    },
                    success: data => {
                        let backID = JSON.parse(data.data).data[0].id
                        self.setData({
                            backId: backID
                        })
                    },
                    fail: res => {
                        util.showMessage(self, "服务器端错误！");
                    }
                })
            }
        })
    },
    // 提交认证
    authenticationFun: function() {
        let self = this;
        wx.request({
            url: commitCardUrl,
            method: 'POST',
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            data: {
                id: self.data.id,
                front: {
                    id: self.data.frontId
                },
                back: {
                    id: self.data.backId
                }
            },
            success: data => {
                let self = this;
                if (data.data.success) {
                    util.showMessage(self, data.data.msg);
                    setTimeout(function() {
                        wx.navigateBack()
                    }, 2000)
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        confirmText: '确定',
                        confirmColor: '#ff4444',
                        content: data.data.msg,
                        success: res => {
                            
                        }
                    })
                }
            }
        })
    }
})