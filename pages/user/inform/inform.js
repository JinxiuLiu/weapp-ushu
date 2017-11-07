/**
 * Created by Liujx on 2017-10-19 10:26:26
 */
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const informAttentionUrl = require('../../../config').informAttentionUrl;
const informEarningsUrl = require('../../../config').informEarningsUrl;
const informSystemUrl = require('../../../config').informSystemUrl;
const informCommentUrl = require('../../../config').informCommentUrl;
const util = require('../../../utils/util');

Page({
    data: {
        tabs: ["系统", "收益", "关注", "评论"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        attentionPage: 1,
        attentionLoad: true,
        attentionList: [],
        systemPage: 1,
        systemLoad: true,
        systemList: [],
        earningsPage: 1,
        earningsLoad: true,
        earningsList: []
    },
    // 加载页面
    onLoad: function () {
        var self = this;
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    sliderLeft: (res.windowWidth / self.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / self.data.tabs.length * self.data.activeIndex
                });
            } 
        })
        this.informSystem()
    },
    // 上拉加载
    onReachBottom: function() {
        let activeIndex = this.data.activeIndex;
        if(activeIndex == 0) {
            this.informSystem()
        }
        if(activeIndex == 1) {
            this.informEarnings()
        }
        if(activeIndex == 2) {
            this.informAttention()
        }
        if(activeIndex == 3) {
            this.informComment()
        }
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        })

        if(this.data.activeIndex == 1) {
            this.setData({
                earningsPage: 1,
                earningsLoad: true,
                earningsList: []
            })
            this.informEarnings()
        }

        if(this.data.activeIndex == 2) {
            this.setData({
                attentionPage: 1,
                attentionLoad: true,
                attentionList: []
            })
            this.informAttention()
        }

        if(this.data.activeIndex == 3) {
            this.setData({
                commentPage: 1,
                commentLoad: true,
                commentList: []
            })
            this.informComment()
        }
    },
    // 系统通知
    informSystem: function() {
        let self = this;
        wx.request({
            url: informSystemUrl,
            data: {
                page: self.data.systemPage
            },
            success: data => {
                if(!data.data.rows.length) {
                    util.showMessage(self, '没有更多数据了！')
                    self.setData({
                        systemLoad: false,
                    })
                    return false;
                }
                self.data.systemPage++
                self.setData({
                    systemPage: self.data.systemPage,
                    systemLoad: false,
                    systemList: self.data.systemList.concat(data.data.rows)
                })
            }
        })
    },
    // 关注通知
    informAttention: function() {
        let self = this;
        wx.request({
            url: informAttentionUrl,
            data: {
                page: self.data.attentionPage
            },
            success: data => {
                if(!data.data.rows.length) {
                    util.showMessage(self, '没有更多数据了！')
                    self.setData({
                        attentionLoad: false,
                    })
                    return false;
                }
                self.data.attentionPage++
                self.setData({
                    attentionPage: self.data.attentionPage,
                    attentionLoad: false,
                    attentionList: self.data.attentionList.concat(data.data.rows)
                })
            }
        })
    },
    // 收益通知
    informEarnings: function() {
        let self = this;
        wx.request({
            url: informEarningsUrl,
            data: {
                page: self.data.earningsPage
            },
            success: data => {
                if(!data.data.rows.length) {
                    util.showMessage(self, '没有更多数据了！')
                    self.setData({
                        earningsLoad: false,
                    })
                    return false;
                }
                self.data.earningsPage++
                self.setData({
                    earningsPage: self.data.earningsPage,
                    earningsLoad: false,
                    earningsList: self.data.earningsList.concat(data.data.rows)
                })
            }
        })
    },
    // 评论通知
    informComment: function() {
        let self = this;
        wx.request({
            url: informCommentUrl,
            data: {
                page: self.data.commentPage
            },
            success: data => {
                if(!data.data.rows.length) {
                    util.showMessage(self, '没有更多数据了！')
                    self.setData({
                        commentLoad: false,
                    })
                    return false;
                }
                self.data.commentPage++
                self.setData({
                    commentPage: self.data.commentPage,
                    commentLoad: false,
                    commentList: self.data.commentList.concat(data.data.rows)
                })
            }
        })
    },
    // 点击书单
    clickBookListFun: function(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../bookList/bookList?id=' + id
        })
    }
});