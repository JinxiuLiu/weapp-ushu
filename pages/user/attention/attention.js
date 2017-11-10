/**
 * Created by Liujx on 2017-10-18 09:56:58
 */
const myAttentionUrl = require('../../../config').myAttentionUrl;
const util = require('../../../utils/util');
let sessionId = wx.getStorageSync('sessionId')
Page({
    data: {
        loadmore: true,
        myAttentionList: [],
        page: 1
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
            url: myAttentionUrl,
            data: {
                page: self.data.page
            },
            header: {
                'Cookie': 'JSESSIONID=' + sessionId
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
                        page: self.data.page,
                        loadmore: false,
                        myAttentionList: self.data.myAttentionList.concat(data.data.rows)
                    })
            }
        })
    }
})