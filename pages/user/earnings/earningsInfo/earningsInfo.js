/**
 * Created by Liujx on 2017-10-19 17:45:27
 */
const gridMyListUrl = require('../../../../config').gridMyListUrl;
Page({
    data: {
        bookListName: '',
        gridMyList: [],
        page: 1,
    },
    onLoad: function(option) {
        this.canGetMoneyRequest(option.id);
    },
    // 书单收益明细
    canGetMoneyRequest: function(val) {
        let self = this;
        wx.request({
            url: gridMyListUrl,
            data: {
                bookListId: val,
                page: self.data.page,
                rows: 30,
            },
            header: {
                'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
            },
            success: data => {
                self.setData({
                    bookListName: data.data.rows[0].bookListItem.bookListTitle,
                    gridMyList: data.data.rows
                })
            }
        })
    },
})