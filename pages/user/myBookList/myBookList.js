/**
 * Created by Liujx on 2017-10-17 17:14:39
 */
const myBookListUrl = require('../../../config').myBookListUrl;
const changeBookListUrl = require('../../../config').changeBookListUrl;
const deleteBookListUrl = require('../../../config').deleteBookListUrl;
const util = require('../../../utils/util');

 Page({
 	data: {
 		page: 2,
 		loadmore: true,
 		myBookList: []
 	},
 	onLoad: function() {
 		let self = this;
 		wx.request({
            url: myBookListUrl,
            data: {
            	page: 1
            },
            success: data => {
            	self.setData({
            		loadmore: false,
            		myBookList: data.data.rows
            	})
            }
        })
 	},
 	// 更改发布状态
 	switchChange: function(e) {
 		let self = this;
 		let published = e.detail.value;
 		let id = e.currentTarget.dataset.id;
 		wx.request({
            url: changeBookListUrl,
            data: {
            	id: id,
            	published: published
            },
            success: data => {
            	if(data.data.success) {
            		self.onLoad();
            		util.showMessage(self, data.data.msg);
            	} else {
            		util.showMessage(self, data.data.msg);
            	}
            }
        })
 	},
 	delBookListFun: function(e) {
 		let self = this;
 		let id = e.currentTarget.dataset.id;
 		wx.request({
            url: deleteBookListUrl,
            data: {
            	id: id
            },
            success: data => {
            	if(data.data.success) {
            		util.showMessage(self, data.data.msg);
            	} else {
            		util.showMessage(self, data.data.msg);
            	}
            }
        })
 	}
 })