/**
 * Created by Liujx on 2017-10-17 13:48:07
 */
const aboutUrl = require('../../../config').aboutUrl;
Page({
	data: {
		isAuthenticated: false,
		aboutList: [],
		phone: '',
	},
	onLoad: function() {
		let self = this;
		wx.request({
			url: aboutUrl,
			method: 'POST',
			data: {},
			header: {
				'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
			},
			success: data  => {
				if(data.data.success) {
					let mobile = data.data.data.mobile;
					let mphone = mobile.substr(0, 3) + '****' + mobile.substr(7);   
					self.setData({
						aboutList: [data.data.data],
						phone: mphone,
						isAuthenticated: data.data.data.authenticated
					})
				}
			}
		})
	},
	authenticatedFun: function() {
		// if(this.data.isAuthenticated) return false;
		wx.navigateTo({
			url: './certification/certification'
		})
	}
})