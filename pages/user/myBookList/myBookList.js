/**
 * Created by Liujx on 2017-10-17 17:14:39
 */
const myBookListUrl = require('../../../config').myBookListUrl;
const changeBookListUrl = require('../../../config').changeBookListUrl;
const deleteBookListUrl = require('../../../config').deleteBookListUrl;
const util = require('../../../utils/util');

Page({
    data: {
        page: 1,
        loadmore: true,
        myBookList: []
    },
    onReachBottom: function() {
        this.onLoad();
    },
    onLoad: function() {
        let self = this;
        self.setData({
            loadmore: true
        })
        wx.request({
            url: myBookListUrl,
            data: {
                page: self.data.page
            },
            success: data => {
                if(!data.data.rows.length) {
                    util.showMessage(self, '没有更多数据了！');
                    self.setData({
                        loadmore: false
                    })
                    return false;
                }
                self.data.page++
                self.setData({
                    loadmore: false,
                    page: self.data.page,
                    myBookList: self.data.myBookList.concat(data.data.rows)
                })
            }
        })
    },
    // 更改发布状态
    switchChange: function(e) {
        let self = this;
        let myBookList = self.data.myBookList;
        let publishedNum = 0;
        let published = e.detail.value;
        let id = e.currentTarget.dataset.id;
        myBookList.filter(function(item) {
            if(item.published) {
                publishedNum++
            }
        })
        if(publishedNum >= 5 && published) {
            util.showMessage(self, '最多开启5个书单！');
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
            return false;
        }
        wx.request({
            url: changeBookListUrl,
            data: {
                id: id,
                published: published
            },
            success: data => {
                if (data.data.success) {
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
                    util.showMessage(self, data.data.msg);
                } else {
                    util.showMessage(self, data.data.msg);
                }
            }
        })
    },
    // 删除书单
    delBookListFun: function(e) {
        let self = this;
        let id = e.currentTarget.dataset.id;
        wx.request({
            url: deleteBookListUrl,
            data: {
                id: id
            },
            success: data => {
                if (data.data.success) {
                    util.showMessage(self, data.data.msg);
                } else {
                    util.showMessage(self, data.data.msg);
                }
            }
        })
    },
    // 编辑书单
    editBookListFun: function(e) {
        let id = e.currentTarget.dataset.id;
        wx.setStorage({
            key: 'bookListId',
            data: id
        })
        wx.switchTab({
            url: '../../create/create'
        })
    }
})