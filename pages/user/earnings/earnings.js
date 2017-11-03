/**
 * Created by Liujx on 2017-10-19 16:42:36
 */
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const canGetMoneyUrl = require('../../../config').canGetMoneyUrl;
const moneyListUrl = require('../../../config').moneyListUrl;


Page({
    data: {
        tabs: ["我的书单收益", "我的分享收益"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        page: 1,
        canGetMoney: '',
        totalMoney: '',
        bookListMoneyItem: [],
        shareMoneyItem: []
    },
    onLoad: function (option) {
        let self = this;
        self.setData({
            totalMoney: option.totalMoney
        })
        self.canGetMoneyRequest();
        self.moneyListRequest(false);
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    sliderLeft: (res.windowWidth / self.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / self.data.tabs.length * self.data.activeIndex
                });
            } 
        })
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
        if(this.data.activeIndex == '0') {
            this.moneyListRequest(false);
        } else {
            this.moneyListRequest(true);
        }
    },
    // 获取可提现收益
    canGetMoneyRequest: function() {
        let self = this;
        wx.request({
            url: canGetMoneyUrl,
            data: {},
            success: data => {
                self.setData({
                    canGetMoney: data.data.data,
                })
            }
        })
    },
    // 收益列表
    moneyListRequest: function(isShare) {
        let self = this;
        wx.request({
            url: moneyListUrl,
            data: {
                share: isShare,
                page: self.data.page,
                rows: 30
            },
            success: data => {
                if(isShare) {
                    self.setData({
                        shareMoneyItem: data.data.data,
                    })
                } else {
                    self.setData({
                        bookListMoneyItem: data.data.data,
                    })
                }
            }
        })
    },
});