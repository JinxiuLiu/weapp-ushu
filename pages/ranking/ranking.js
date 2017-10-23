/**
 * Created by Liujx on 2017-10-23 15:47:07
 */
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
    data: {
        tabs: ["收入排行", "书单排行"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            } 
        });
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
});