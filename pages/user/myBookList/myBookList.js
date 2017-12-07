/**
 * Created by Liujx on 2017-10-17 17:14:39
 */
const myBookListUrl = require('../../../config').myBookListUrl;
const changeBookListUrl = require('../../../config').changeBookListUrl;
const deleteBookListUrl = require('../../../config').deleteBookListUrl;
const util = require('../../../utils/util');
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
    data: {
        tabs: ["已通过", "审核中", "未通过"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        page: 1,
        loadmore: true,
        myBookList: [],
    },
    onReachBottom: function() {
        this.onLoad();
    },
    onLoad: function() {
        let self = this;
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    sliderLeft: (res.windowWidth / self.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / self.data.tabs.length * self.data.activeIndex
                });
            }
        })
        self.setData({
            loadmore: true
        })
        wx.request({
            url: myBookListUrl,
            data: {
                page: self.data.page,
                sort: "operateTime",
                order: "desc",
                rows: 100,
            },
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if (!data.data.rows.length) {
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
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    // 更改发布状态
    switchChange: function(e) {
        let self = this;
        let myBookList = self.data.myBookList;
        let publishedNum = 0;
        let published = e.detail.value;
        let id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        myBookList.filter(function(item) {
            if (item.published) {
                publishedNum++
                myBookList[index].published = false;
                self.setData({
                    myBookList: self.data.myBookList
                })
            }
        })
        if (publishedNum >= 100 && published) {
            util.showMessage(self, '最多开启100个书单！', 3000);
            return false;
        }
        wx.request({
            url: changeBookListUrl,
            data: {
                id: id,
                published: published
            },
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if (data.data.success) {
                    self.data.myBookList[index].published = published;
                    self.setData({
                        myBookList: self.data.myBookList
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
        let index = e.currentTarget.dataset.index;
        wx.request({
            url: deleteBookListUrl,
            data: {
                id: id
            },
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                if (data.data.success) {
                    util.showMessage(self, data.data.msg);
                    let myBookList = self.data.myBookList
                    myBookList.splice(index, 1)
                    self.setData({
                        myBookList: self.data.myBookList
                    })
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
    },
    // 进入书单
    tapBookList: function(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../bookList/bookList?id=' + id
        })
    },
    // 查看审核原因
    reasonFun: function(e) {
        let reason = e.currentTarget.dataset.reason;
        wx.showModal({
            title: '审核结果',
            showCancel: false,
            content: reason,
            confirmColor: '#ff4444',
            success: res => {
                
            }
        })
    }
})