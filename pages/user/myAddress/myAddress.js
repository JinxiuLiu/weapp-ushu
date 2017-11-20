/**
 * Created by Liujx on 2017-10-18 14:28:33
 */
const addressListUrl = require('../../../config').addressListUrl;
const defAddressUrl = require('../../../config').defAddressUrl;
const delAddressUrl = require('../../../config').delAddressUrl;
Page({
    data: {
        checked: false,
        loadmore: true,
        addressList: [],
        isOrder: false,
    },
    // 加载页面
    onLoad: function(options) {
        let isOrder = options ? options.order : false;
        this.setData({
            isOrder: isOrder
        })
    },
    // 显示页面
    onShow: function() {
        let self = this;
        wx.request({
            url: addressListUrl,
            method: 'POST',
            data: {},
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    self.setData({
                        loadmore: false,
                        addressList: res.data.data
                    })
                }
            }
        })
    },
    // 单选-设为默认地址
    radioChange: function(e) {
        let self = this;
        wx.request({
            url: defAddressUrl,
            method: 'POST',
            data: {
                'id': e.detail.value
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    self.showMessage('设置成功！')
                    self.onLoad();
                }
            }
        })
    },
    // 删除地址
    delAddress: function(e) {
        let self = this;
        let id = e.currentTarget.dataset.id;
        wx.request({
            url: delAddressUrl,
            method: 'POST',
            data: {
                'id': id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    self.showMessage('删除成功！')
                    self.onLoad();
                    return false;
                }
            }
        })
    },
    // 编辑地址
    editFun: function(e) {
        let self = this;
        let id = e.currentTarget.dataset.id;
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '../addAddress/addAddress?id=' + id + '&item=' + JSON.stringify(item)
        })
    },
    // 订单-选择地址
    selectAddressFun: function(e) {
        if(!this.data.isOrder) return false;
        let item = e.currentTarget.dataset.list;
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1]; //当前页面
        let prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.data.orderDetailList[0].consignee = item;
        prevPage.setData({
            orderDetailList: prevPage.data.orderDetailList
        })
        wx.navigateBack();
    },
    showMessage: function(text) {
        var that = this
        that.setData({
            showMessage: true,
            messageContent: text
        })
        setTimeout(function() {
            that.setData({
                showMessage: false,
                messageContent: ''
            })
        }, 3000)
    }
})