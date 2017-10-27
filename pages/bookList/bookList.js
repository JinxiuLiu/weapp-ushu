/**
 * Created by Liujx on 2017-10-22 22:38:21
 */
const detailUrl = require('../../config').detailUrl;
const addCartUrl = require('../../config').addCartUrl;

Page({
	data: {
		loadmore: true,
		detailList: [],
 	},
 	onLoad: function(options) {
 		let self = this;
	    wx.request({
		  url: detailUrl,
		  method: 'POST',
		  data: {
		     id: options.id
		  },
		  header: {
		      'content-type': 'application/x-www-form-urlencoded' // 默认值
		  },
		  success: function(res) {
		  	self.setData({
		  		loadmore: false,
		  		detailList: [res.data.data]
		  	})
		  }
		})
	},
	onShow: function() {
		wx.setNavigationBarTitle({
		  title: '《从A到Z》'
		})
	},
	addCartFun: function(e) {
		let self = this;
		let bookId = e.currentTarget.dataset.bookid;
		let bookListId = e.currentTarget.dataset.booklistid;
	    wx.request({
		  url: addCartUrl,
		  method: 'POST',
		  data: {
		    bookId: bookId,
		    bookListItemId: bookListId,
		    fromShareId: ''
		  },
		  header: {
		    'content-type': 'application/x-www-form-urlencoded' // 默认值
		  },
		  success: function(res) {
			console.log(res);
		  }
		})
	}
})