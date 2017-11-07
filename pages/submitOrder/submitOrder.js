/**
 * Created by Liujx on 2017-10-20 16:50:51
 */
const orderDetailUrl = require('../../config').orderDetailUrl;
const commitUrl = require('../../config').commitUrl;
const util = require('../../utils/util');

 Page({
 	data: {
        id: '',
 		orderDetailList: []
 	},
 	// 生命周期函数--监听页面显示
	onLoad: function(option) {
		let self = this;		
		this.setData({
            id: option.id
        })
	},
    onShow: function() {
        this.orderDetailRequest()
    },
    orderDetailRequest: function() {
        let self = this;
        wx.request({
            url: orderDetailUrl,
            method: 'POST',
            data: {
                id: self.data.id
            },
            header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: data => {
                console.log(data);
                if (data.data.success) {
                    self.setData({
                        orderDetailList: [data.data.data]
                    })
                } else {
                    util.showMessage(self, data.data.msg)
                }
            }
        })
    },
    // 电子发票
	selectInvoice: function(e) {
		let self = this;
		let isInvoice = !e.currentTarget.dataset.isinvoice;
		self.data.orderDetailList[0].invoice = isInvoice;
		self.setData({
			orderDetailList: self.data.orderDetailList
		})
	},
    // 提交订单
	submitOrderFun: function() {
		let self = this;
		let data = self.data.orderDetailList[0];
		let id = data.id;
		let totalMoney = data.totalMoney;
		let invoice = data.invoice;
		let consigneeId = data.consignee ? data.consignee.id : '';
		wx.request({
            url: commitUrl,
            method: 'POST',
            data: {
                id: id,
                totalMoney: totalMoney,
                invoice: invoice,
                express: {
                	consigneeId: consigneeId
                }
            },
            success: data => {
                if (data.data.success) {
                    wx.navigateTo({
                        url: 'payment/payment?id=' + id + '&money=' + totalMoney
                    })
                } else {
                    util.showMessage(self, data.data.msg)
                }
            }
        });
	},
    // 添加收货地址
    addAddressFun: function() {
        wx.navigateTo({
            url: '../user/addAddress/addAddress'
        })
    },
    // 选择地址
    selectAddress: function() {
        wx.navigateTo({
            url: '../user/myAddress/myAddress'
        })
    }
 })