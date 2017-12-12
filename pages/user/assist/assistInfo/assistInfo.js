/**
 * Created by Liujx on 2017-12-04 15:34:30
 */
const getAssistListInfoUrl = require('../../../../config').getAssistListInfoUrl;

Page({
	data: {
		imageList: ''
	},
	onLoad: function(options) {
		let id = options.id;
        let name = options.name;
        wx.setNavigationBarTitle({
            title: name
        })
		this._getAssistInfo(id);
	},
	_getAssistInfo: function(id) {
		let self = this;
        wx.request({
            url: getAssistListInfoUrl,
            data: {
				id: id
			},
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if(data.data.success) {
                	self.setData({
                		imageList: data.data.data.wxaDocImage.url
                	})
                }
            }
        })
	}
})