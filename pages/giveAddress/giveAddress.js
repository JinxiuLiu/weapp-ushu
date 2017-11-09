/**
 * Created by Liujx on 2017-10-19 15:35:47
 */
const giveAddressUrl = require('../../config').giveAddressUrl
const orderDetailUrl = require('../../config').orderDetailUrl
var area = require('../../utils/area')
var p = 0,
    c = 0,
    d = 0
Page({
    data: {
        cartList: [],
        provinceName: [],
        provinceCode: [],
        provinceSelIndex: '',
        cityName: [],
        cityCode: [],
        citySelIndex: '',
        districtName: [],
        districtCode: [],
        districtSelIndex: '',
        cityEnabled: false,
        districtEnabled: false,
        showMessage: false,
        messageContent: '',
        checked: false,
        defProvinceName: '请选择所在省',
        defCityName: '请选择所在市',
        defDistrictName: '请选择所在区',
        orderId: '',
    },
    onLoad: function(options) {
        this.setAreaData()
        let orderId = options.orderId;
        this.setData({
            orderId: orderId
        })
        this.orderDetile()
    },
    // 选择省
    changeProvince: function(e) {
        this.resetAreaData('province')
        p = e.detail.value
        this.setAreaData('province', p)
    },
    // 选择市
    changeCity: function(e) {
        this.resetAreaData()
        c = e.detail.value
        this.setAreaData('city', p, c)
    },
    // 选择区
    changeDistrict: function(e) {
        d = e.detail.value
        this.setAreaData('district', p, c, d)
    },
    setAreaData: function(t, p, c, d) {
        switch (t) {
            case 'province':
                this.setData({
                    provinceSelIndex: p,
                    cityEnabled: true
                })
                break;
            case 'city':
                this.setData({
                    citySelIndex: c,
                    districtEnabled: true
                })
                break;
            case 'district':
                this.setData({
                    districtSelIndex: d
                })
        }

        var p = p || 0 // provinceSelIndex
        var c = c || 0 // citySelIndex
        var d = d || 0 // districtSelIndex
        // 设置省的数据
        var province = area['100000']
        var provinceName = [];
        var provinceCode = [];
        for (var item in province) {
            provinceName.push(province[item])
            provinceCode.push(item)
        }
        this.setData({
            provinceName: provinceName,
            provinceCode: provinceCode
        })
        // 设置市的数据
        var city = area[provinceCode[p]]
        var cityName = [];
        var cityCode = [];
        for (var item in city) {
            cityName.push(city[item])
            cityCode.push(item)
        }
        this.setData({
            cityName: cityName,
            cityCode: cityCode
        })
        // 设置区的数据
        var district = area[cityCode[c]]
        var districtName = [];
        var districtCode = [];
        for (var item in district) {
            districtName.push(district[item])
            districtCode.push(item)
        }
        this.setData({
            districtName: districtName,
            districtCode: districtCode
        })
    },
    // 重置数据
    resetAreaData: function(type) {
        this.setData({
            districtName: [],
            districtCode: [],
            districtSelIndex: '',
            districtEnabled: false
        })
        if (type == 'province') {
            this.setData({
                cityName: [],
                cityCode: [],
                citySelIndex: ''
            })
        }
    },
    // 提交数据
    savePersonInfo: function(e) {
        var self = this
        var data = e.detail.value
        var telRule = /^1[3|4|5|7|8]\d{9}$/
        if (data.name == '') {
            this.showMessage('请输入姓名')
        } else if (data.mobile == '') {
            this.showMessage('请输入手机号码')
        } else if (!telRule.test(data.mobile)) {
            this.showMessage('手机号码格式不正确')
        } else if (data.provinceName == '') {
            this.showMessage('请选择所在省')
        } else if (data.cityName == '') {
            this.showMessage('请选择所在市')
        } else if (data.countyName == '') {
            this.showMessage('请选择所在区')
        } else if (data.address == '') {
            this.showMessage('请输入详细地址')
        } else {
            wx.request({
                url: giveAddressUrl,
                data: data,
                success: function(result) {
                    if (result.data.success) {
                        self.showMessage('提交成功！');
                        setTimeout(function() {
                            wx.switchTab({
                                url: '../index/index'
                            })
                        }, 2000)
                    } else {
                        self.showMessage(result.data.msg);
                    }
                },
                fail: function(errMsg) {
                    self.showMessage(errMsg);
                }
            })
        }
    },
    // 订单列表
    orderDetile: function() {
        let self = this;
        wx.request({
            url: orderDetailUrl,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                id: self.data.orderId
            },
            success: data => {
                console.log(data);
                if(data.data.success) {
                    self.setData({
                        cartList: [data.data.data]
                    })
                }
            }
        })
    },
    showMessage: function(text) {
        var that = this
        that.setData({
            showMessage: true,
            messageContent: text
        })
        setTimeout(function() {
            that.setData({
                showMessage: false,
                messageContent: ''
            })
        }, 3000)
    }
})