/**
 * Created by Liujx on 2017-11-17 15:56:51
 */
const getLogisticsUrl = require('../../../config').getLogisticsUrl;
const util = require('../../../utils/util');
Page({
	data: {
		expressNo: '',
		expressItem: [],
	},
	onLoad: function(options) {
		let self = this;
		let id = options.id || '';
        wx.request({
            url: getLogisticsUrl,
            method: 'POST',
            data: {
                expressNo: id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if(data.data.success) {
                	let expressItem = JSON.parse(data.data.data)
                	self.setData({
                		expressNo: id,
                		expressItem: expressItem
                	})
                } else {
                	util.showMessage(self, data.data.msg)
                }
            }
        })
	}
})