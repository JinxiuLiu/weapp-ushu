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
 	},
 	onLoad: function() {
 		let self = this;
 		wx.request({
		  url: addressListUrl,
		  method: 'POST',
		  data: {},
		  success: function(res) {
		  	if(res.statusCode == 200) {
		  		self.setData({
		    		loadmore: false,
		    		addressList: res.data.data
		    	})
		  	}
		  }
		})
 	},
 	onShow: function() {
 		this.onLoad();
 	},
 	radioChange: function(e) {
 		let self = this;
 		wx.request({
		  url: defAddressUrl,
		  method: 'POST',
		  data: {
		  	'id': e.detail.value
		  },
		  header: {
		      'content-type': 'application/x-www-form-urlencoded' // 默认值
		  },
		  success: function(res) {
		  	if(res.statusCode == 200) {
		  		self.showMessage('设置成功！')
		  		self.onLoad();
		  	}
		  }
		})
	},
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
		      'content-type': 'application/x-www-form-urlencoded' // 默认值
		  },
		  success: function(res) {
		  	if(res.statusCode == 200) {
		  		self.showMessage('删除成功！')
		  		self.onLoad();
		  		return false;
		  	}
		  }
		})
	},
	editFun: function(e) {
		let self = this;
		let id = e.currentTarget.dataset.id;
		let item = e.currentTarget.dataset.item;
		wx.navigateTo({
		  url: '../addAddress/addAddress?id=' + id + '&item=' + JSON.stringify(item)
		})
	},
 	showMessage: function(text) {
	    var that = this
	    that.setData({
	      showMessage: true,
	      messageContent: text
	    })
	    setTimeout(function(){
	      that.setData({
	        showMessage: false,
	        messageContent: ''
	      })
	    }, 3000)
	}
 })