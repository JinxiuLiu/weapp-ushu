/**
 * Created by Liujx on 2017-10-13 09:41:39
 */
const shopCartUrl = require('../../config').shopCartUrl;
const selectCartUrl = require('../../config').selectCartUrl;
const changeCartUrl = require('../../config').changeCartUrl;
const delCartUrl = require('../../config').delCartUrl;

Page({
	data: {
		isEdit: false,
        loadmore: true,
        cartList: [],
        selectGoods: [],
        isChecked: false,
        goodsChecked: false,
        selectAllStatus: false,
        total: '0'
	},
    onLoad: function() {
        let self = this;
        wx.request({
            url: shopCartUrl,
            method: 'POST',
            data: {},
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
        self.data.cartList[index].items[i].checked = !self.data.cartList[index].items[i].checked;                    // 获取购物车列表
        let tempCartList = self.data.cartList;
        for (var j = 0; j < tempCartList.length; j++) {
            for (var k = 0; k < tempCartList[j].items.length; k++) {
                if(!tempCartList[j].items[k].checked) {
                    self.data.selectAllStatus = false;
                    break;
                } else {
                    self.data.selectAllStatus = true;
                }
            }
        }
        self.data.selectGoods = [];
        for (var j = 0; j < tempCartList.length; j++) {
            for (var k = 0; k < tempCartList[j].items.length; k++) {
                if(tempCartList[j].items[k].checked) {
                    self.data.selectGoods.push(tempCartList[j].items[k].id);
                }
            }
        }
        // 判断是否为空数组
        if(self.data.selectGoods.length) {
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
    // 全选
    selectAll: function(e) {
        let self = this;
        let selectAllStatus = !self.data.selectAllStatus;
        let tempCartList = self.data.cartList;
        if(selectAllStatus) {
            tempCartList.filter(function (item) {
                item.items.filter(function(val) {
                    val.checked = true;
                })
            })
        } else {
            tempCartList.filter(function (item) {
                item.items.filter(function(val) {
                    val.checked = false;
                })
            })
        }
        self.data.selectGoods = [];
        for (var j = 0; j < tempCartList.length; j++) {
            for (var k = 0; k < tempCartList[j].items.length; k++) {
                if(tempCartList[j].items[k].checked) {
                    self.data.selectGoods.push(tempCartList[j].items[k].id);
                }
            }
        }
        self.selectGoodsRequest(self.data.selectGoods);
        self.setData({
            selectAllStatus: selectAllStatus,
            cartList: self.data.cartList
        })
    },
    // 选择商品
    selectGoodsRequest: function(data) {
        let self = this;
        wx.request({
            url: selectCartUrl,
            method: 'POST',
            data: data,
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
        if( this.data.cartList[index].items[i].quantity <= 0 ) {
            this.data.cartList[index].items[i].quantity = 1;
            this.showMessage('已经不能再减少了!')
        }else {
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
        for(var i=0; i<this.data.cartList.length; i++) {
            this.data.cartList[i].items.filter(function (item) {
                if(item.checked) {
                    idArr.push(item.id);
                }
            })
        }
        var self = this;
        wx.request({
            url: changeCartUrl,
            method: 'POST',
            data:{
                id: id,
                quantity: quantity,
                checkedIds: idArr
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(data){
                console.log(data.data.success);
                if(data.data.success) {
                    if(!!data.data.data) {
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
    delCart: function() {
        let self = this;
        wx.request({
            url: delCartUrl,
            method: 'POST',
            data: {id: id},
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success:function(data){
                if(data.data.success) {
                    self.data.cartList[index].items.splice(i, 1);
                    if(!self.data.cartList[index].items.length) {
                        self.data.cartList.splice(index, 1);
                    }
                    self.setData({
                        cartList: self.data.cartList
                    })
                    self.showMessage('操作成功!');
                }else{
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
    showMessage: function(text) {
        var that = this
        that.setData({
          showMessage: true,
          messageContent: text
        })
        setTimeout(function(){
          that.setData({
            showMessage: false,
            messageContent: ''
          })
        }, 3000)
    }
})