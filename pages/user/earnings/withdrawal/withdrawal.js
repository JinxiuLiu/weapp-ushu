/**
 * Created by Liujx on 2017-10-23 16:24:52
 */
const withdrawalRecordUrl = require('../../../../config').withdrawalRecordUrl;
const util = require('../../../../utils/util');
let sessionId = wx.getStorageSync('sessionId')
Page({
    data: {
        page: 1,
        loadmore: true,
        withdrawalRecordItem: [],
    },
    onLoad: function() {
        this.withdrawalRecord()
    },
    onReachBottom: function() {
        this.withdrawalRecord()
    },
    withdrawalRecord: function() {
        let self = this;
        wx.request({
            url: withdrawalRecordUrl,
            data: {
                page: self.data.page
            },
            header: {
                'Cookie': 'JSESSIONID=' + sessionId
            },
            success: data => {
                if (data.data.success) {
                    if (data.data.data.rows.length == 0) {
                        util.showMessage(self, '没有更多数据了！')
                        self.setData({
                            loadmore: false,
                        })
                        return false;
                    }
                    self.data.page++
                        self.setData({
                            page: self.data.page,
                            loadmore: false,
                            withdrawalRecordItem: data.data.data.rows
                        })
                } else {
                    util.showMessage(self, data.data.msg)
                }
            }
        })
    }
})