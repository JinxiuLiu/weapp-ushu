/**
 * Created by Liujx on 2017-10-18 09:56:58
 */
 const myAttentionUrl = require('../../../config').myAttentionUrl;
 const util = require('../../../utils/util');

 Page({
 	data: {
 		loadmore: true,
 		myAttentionList: []
 	},
 	onLoad: function() {
 		let self = this;
 		wx.request({
            url: myAttentionUrl,
            data: {},
            success: data => {
                if(data.data.success) {
                	self.setData({
                		loadmore: false,
                		myAttentionList: data.data.data
                	})
                } else {
                    util.showMessage(self, data.data.msg);
                }
            }
        })
 	}
 })