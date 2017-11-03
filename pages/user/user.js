/**
 * Created by Liujx on 2017-10-13 09:41:21
 */
const aboutUrl = require('../../config').aboutUrl;
const totalMoneyUrl = require('../../config').totalMoneyUrl;

Page({
	data: {
		userName: '',
		avatarUrl: '',
		totalMoney: '',
	},
	onLoad: function() {
		this.userRequest();
		this.totalMoneyRequest();
	},
	// 获取用户头像
	userRequest: function() {
		let self = this;
		wx.request({
            url: aboutUrl,
            data: {},
            success: data => {
                self.setData({
                    userName: data.data.data.name,
                    avatarUrl: data.data.data.photo.url
                })
            }
        })
	},
	// 获取总收益
	totalMoneyRequest: function() {
		let self = this;
		wx.request({
            url: totalMoneyUrl,
            data: {},
            success: data => {
                self.setData({
                    totalMoney: data.data.data
                })
            }
        })
	}
})