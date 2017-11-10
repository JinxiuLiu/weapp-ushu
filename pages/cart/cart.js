/**
 * Created by Liujx on 2017-10-13 09:41:39
 * 购物车
 */
const shopCartUrl = require('../../config').shopCartUrl;
const selectCartUrl = require('../../config').selectCartUrl;
const changeCartUrl = require('../../config').changeCartUrl;
const delCartUrl = require('../../config').delCartUrl;
const generateUrl = require('../../config').generateUrl;
let sessionId = wx.getStorageSync('sessionId')
Page({
    data: {
        isEdit: false,
        loadmore: true,
        cartList: [],
        selectGoods: [],
        settlementItems: [],
        isChecked: false,
        goodsChecked: false,
        selectAllStatus: false,
        total: '0'
    },
    onShow: function() {
        let self = this;
        wx.request({
            url: shopCartUrl,
            method: 'POST',
            data: {},
            header: {
                'Cookie': 'JSESSIONID=' + sessionId
            },
            success: function(res) {
                self.setData({
                    loadmore: false,
                    cartList: res.data.data
                })
            }
        })
    },
    // 单选
    selectList: function(e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        let i = e.currentTarget.dataset.i;
        self.data.cartList[index].items[i].checked = !self.data.cartList[index].items[i].checked; // 获取购物车列表

        let tempCartList = self.data.cartList;
        for (var j = 0; j < tempCartList.length; j++) {
            for (var k = 0; k < tempCartList[j].items.length; k++) {
                if (!tempCartList[j].items[k].checked) {
                    self.data.selectAllStatus = false;
                    break;
                } else {
                    self.data.selectAllStatus = true;
                }
            }
        }
        for (var j = 0; j < tempCartList[index].items.length; j++) {
            if (!tempCartList[index].items[j].checked) {
                tempCartList[index].checked = false;
                break;
            } else {
                tempCartList[index].checked = true;
            }
        }
        self.data.selectGoods = [];
        self.data.settlementItems = [];
        for (var j = 0; j < tempCartList.length; j++) {
            for (var k = 0; k < tempCartList[j].items.length; k++) {
                if (tempCartList[j].items[k].checked) {
                    self.data.selectGoods.push(tempCartList[j].items[k].id);
                    self.data.settlementItems.push({"bookListItemId": tempCartList[j].items[k].bookListItemId,"shopCartId": tempCartList[j].items[k].id,"fromShareId": tempCartList[j].items[k].fromShareId,"quantity": tempCartList[j].items[k].quantity});
                }
            }
        }
        // 判断是否为空数组
        if (self.data.selectGoods.length) {
            // 获取总价
            self.selectGoodsRequest(self.data.selectGoods);
        } else {
            self.setData({
                total: '0'
            })
        }
        self.setData({
            selectAllStatus: self.data.selectAllStatus,
            cartList: self.data.cartList
        })
    },
    // 书单全选
    selectAllBookList: function(e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        let tempCartList = self.data.cartList;
        let bookListItem = tempCartList[index];
        bookListItem.checked = !bookListItem.checked;
        if (bookListItem.checked) {
            bookListItem.items.filter(function(val) {
                val.checked = true;
            })
        } else {
            bookListItem.items.filter(function(val) {
                val.checked = false;
            })
        }

        for (var j = 0; j < tempCartList.length; j++) {
            if (!tempCartList[j].checked) {
                self.data.selectAllStatus = false;
                break;
            } else {
                self.data.selectAllStatus = true;
            }
        }

        self.data.settlementItems = [];
        self.data.selectGoods = [];
        for (var j = 0; j < tempCartList.length; j++) {
            for (var k = 0; k < tempCartList[j].items.length; k++) {
                if (tempCartList[j].items[k].checked) {
                    self.data.selectGoods.push(tempCartList[j].items[k].id);
                    self.data.settlementItems.push({"bookListItemId": tempCartList[j].items[k].bookListItemId,"shopCartId": tempCartList[j].items[k].id,"fromShareId": tempCartList[j].items[k].fromShareId,"quantity": tempCartList[j].items[k].quantity});
                }
            }
        }
        self.selectGoodsRequest(self.data.selectGoods);
        self.setData({
            selectAllStatus: self.data.selectAllStatus,
            cartList: self.data.cartList
        })
    },
    // 全选
    selectAll: function(e) {
        let self = this;
        let selectAllStatus = !self.data.selectAllStatus;
        let tempCartList = self.data.cartList;
        if (selectAllStatus) {
            tempCartList.filter(function(item) {
                item.checked = true;
                item.items.filter(function(val) {
                    val.checked = true;
                })
            })
        } else {
            tempCartList.filter(function(item) {
                item.checked = false;
                item.items.filter(function(val) {
                    val.checked = false;
                })
            })
        }
        self.data.selectGoods = [];
        self.data.settlementItems = [];
        for (var j = 0; j < tempCartList.length; j++) {
            for (var k = 0; k < tempCartList[j].items.length; k++) {
                if (tempCartList[j].items[k].checked) {
                    self.data.selectGoods.push(tempCartList[j].items[k].id);
                    self.data.settlementItems.push({"bookListItemId": tempCartList[j].items[k].bookListItemId,"shopCartId": tempCartList[j].items[k].id,"fromShareId": tempCartList[j].items[k].fromShareId,"quantity": tempCartList[j].items[k].quantity});
                }
            }
        }
        self.selectGoodsRequest(self.data.selectGoods);
        self.setData({
            selectAllStatus: selectAllStatus,
            cartList: self.data.cartList
        })
    },
    // 获取商品总价
    selectGoodsRequest: function(data) {
        let self = this;
        wx.request({
            url: selectCartUrl,
            method: 'POST',
            data: data,
            header: {
                'Cookie': 'JSESSIONID=' + sessionId
            },
            success: function(res) {
                let price = Number(res.data.data);
                self.setData({
                    total: price
                })
            }
        })
    },
    // 增加数量
    addCount: function(e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        let i = e.currentTarget.dataset.i;
        let id = e.currentTarget.dataset.id;
        this.data.cartList[index].items[i].quantity++;
        this.setData({
            cartList: self.data.cartList
        })
        this.changeNum(id, this.data.cartList[index].items[i].quantity);
    },
    // 减少数量
    minusCount: function(e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        let i = e.currentTarget.dataset.i;
        let id = e.currentTarget.dataset.id;
        this.data.cartList[index].items[i].quantity--;
        if (this.data.cartList[index].items[i].quantity <= 0) {
            this.data.cartList[index].items[i].quantity = 1;
            this.showMessage('已经不能再减少了!')
        } else {
            this.setData({
                cartList: self.data.cartList
            })
            this.changeNum(id, this.data.cartList[index].items[i].quantity);
        }
    },
    // 键盘输入数量
    changeInput: function(e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        let i = e.currentTarget.dataset.i;
        let id = e.currentTarget.dataset.id;
        this.data.cartList[index].items[i].quantity = e.detail.value;
        this.setData({
            cartList: self.data.cartList
        })
        this.changeNum(id, this.data.cartList[index].items[i].quantity);
    },
    //更改购物车数量
    changeNum(id, quantity) {
        var idArr = [];
        for (var i = 0; i < this.data.cartList.length; i++) {
            this.data.cartList[i].items.filter(function(item) {
                if (item.checked) {
                    idArr.push(item.id);
                }
            })
        }
        var self = this;
        wx.request({
            url: changeCartUrl,
            method: 'POST',
            data: {
                id: id,
                quantity: quantity,
                checkedIds: idArr
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'Cookie': 'JSESSIONID=' + sessionId
            },
            success: function(data) {
                if (data.data.success) {
                    if (!!data.data.data) {
                        self.setData({
                            total: data.data.data
                        })
                    }
                } else {
                    self.showMessage(data.data.msg);
                }
            }
        });
    },
    // 删除
    delCart: function(e) {
        let self = this;
        let id = e.currentTarget.dataset.id;
        wx.request({
            url: delCartUrl,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=' + sessionId
            },
            data: {
                id: id
            },
            success: function(data) {
                if (data.data.success) {
                    self.onShow()
                    self.showMessage('删除成功!');
                } else {
                    self.showMessage(data.data.msg);
                }
            }
        });
    },
    // 编辑
    cartEditFun: function() {
        let self = this;
        self.setData({
            isEdit: !self.data.isEdit
        })
    },
    // 结算 && 赠送朋友 生成订单
    settlementFun: function(e) {
        const self = this;
        let isGive = e.currentTarget.dataset.give;
        let items = self.data.settlementItems;
        if(!items.length) {
            self.showMessage('请选择商品！');
            return false;
        }
        wx.request({
            url: generateUrl,
            method: 'POST',
            data: {
                give: isGive,
                items: items
            },
            header: {
                'Cookie': 'JSESSIONID=' + sessionId
            },
            success: function(data) {
                if (data.data.success) {
                    wx.navigateTo({
                        url: '../submitOrder/submitOrder?id=' + data.data.data
                    })
                } else {
                    self.showMessage(data.data.msg);
                }
            }
        });
        
    },
    // 点击图书
    tapBook: function(e) {
        let bookId = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../bookDetails/bookDetails?id=' + bookId
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