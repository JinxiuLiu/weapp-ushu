/**
 * Created by Liujx on 2017-12-04 14:03:09
 */
const getAssistListUrl = require('../../../config').getAssistListUrl;

Page({
	data: {
		assistList: []
	},
	onLoad: function() {
		this._getAssistList()
	},
	_getAssistList: function() {
		let self = this;
        wx.request({
            url: getAssistListUrl,
            data: {
				page: 1,
				rows: 100
			},
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if(!data.data.emptyMsg) {
                	self.setData({
                		assistList: data.data.rows
                	})
                }
            }
        })
	},
	tapInfo: function(e) {
		let id = e.currentTarget.dataset.id;
		let name = e.currentTarget.dataset.name;
		wx.navigateTo({
		    url: './assistInfo/assistInfo?id=' + id + '&name=' + name
		})
	}
})