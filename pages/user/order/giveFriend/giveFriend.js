/**
 * Created by Liujx on 2017-11-07 17:32:05
 */
 const orderDetailUrl = require('../../../../config').orderDetailUrl;
 Page({
 	data: {
 		id: '',
 		isShare: true,
 		bookItem: [],
 		bindinput: '那是我们有梦，关于文学，关于爱情，关于穿越世界。'
 	},
 	onLoad: function(options) {
 		let self = this;
 		let id = options.id;
 		wx.request({
            url: orderDetailUrl,
            method: 'POST',
            header: {
		        'content-type': 'application/x-www-form-urlencoded'
		    },
            data: {
                id: id
            },
            success: data => {
            	console.log(data);
                if(data.data.success) {
                    self.setData({
                    	id: id,
                    	bookItem: data.data.data.itemList
                    })
                }
            }
        })
 	},
 	bindinput: function(e) {
 		this.setData({
	    	bindinput: e.detail.value
	    })
 	},
 	// 赠朋友
    onShareAppMessage: function(res) {
        let self = this;
        let id = self.data.id;
        let item = self.data.bookItem;
        let array = [];
        let title = '';
        let path = '';
        self.setData({
        	isShare: false,
        })
        for (var j = 0; j < item.length; j++) {
            for (var k = 0; k < item[j].items.length; k++) {
                array.push(item[j].items[k]);
            }
        }
        if (res.from === 'button') {
            title = '我刚从邮书给你买了' + array.length + '本书，希望你喜欢~'
            path = '/pages/giveAddress/giveAddress?orderId=' + id
        }
        return {
            title: title,
            path: path,
            success: function(res) {
                // 转发成功
                wx.showModal({
                    title: '赠送成功',
                    cancelText: '取消',
                    confirmText: '确定',
                    content: '请提示朋友尽快填写收货地址~',
                    success: function(res) {
                        
                    }
                })
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }
 })