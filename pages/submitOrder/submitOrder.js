/**
 * Created by Liujx on 2017-10-20 16:50:51
 */
const orderDetailUrl = require('../../config').orderDetailUrl;
const commitUrl = require('../../config').commitUrl;
const util = require('../../utils/util');

 Page({
 	data: {
 		orderDetailList: []
 	},
 	// 生命周期函数--监听页面显示
	onLoad: function(option) {
		let self = this;		
		let id = option.id;
		wx.request({
            url: orderDetailUrl,
            method: 'POST',
            data: {
                id: id
            },
            header: {
			      'content-type': 'application/x-www-form-urlencoded' // 默认值
			},
            success: data => {
                if (data.data.success) {
                    self.setData({
                    	orderDetailList: self.data.orderDetailList.concat(data.data.data)
                    })
                } else {
                    util.showMessage(self, data.data.msg)
                }
            }
        });
	},
	selectInvoice: function(e) {
		let self = this;
		let isInvoice = !e.currentTarget.dataset.isinvoice;
		self.data.orderDetailList[0].invoice = isInvoice;
		self.setData({
			orderDetailList: self.data.orderDetailList
		})
	},
	submitOrderFun: function() {
		let self = this;
		let data = self.data.orderDetailList[0];
		let id = data.id;
		let totalMoney = data.totalMoney;
		let invoice = data.invoice;
		let consigneeId = data.consignee.id;
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
            	console.log(data);
                if (data.data.success) {
                    
                } else {
                    util.showMessage(self, data.data.msg)
                }
            }
        });
	}
 })