/**
 * Created by Liujx on 2017-10-24 14:59:47
 * 小程序配置文件
 */

var host = "http://192.168.0.111:8081"

var config = {

    // 下面的地址配合云端 Server 工作
    host,

    // 选择图书
    getBookListUrl: `${host}/bookList/grid_items`,

    // 选择图书
    SelectBookUrl: `${host}/book/grid`,

    // 创建书单
    CreateListUrl: `${host}/bookList/save`,

    // 上传文件接口
    uploadFileUrl: `${host}/file_upload`,

    // 新增收货地址
    addAddressUrl: `${host}/consignee/edit`,

    // 收货地址列表
    addressListUrl: `${host}/consignee/list_my`,

    // 设为默认地址
    defAddressUrl: `${host}/consignee/def`,

    // 删除地址
    delAddressUrl: `${host}/consignee/del`,

    // 加入购物车
    addCartUrl: `${host}/shopCart/save`,

    // 购物车列表
    shopCartUrl: `${host}/shopCart/list_my`,

    // 选择商品
    selectCartUrl: `${host}/shopCart/total_money`,

    // 更改购物车数量
    changeCartUrl: `${host}/shopCart/change_quantity`,

    // 购物车删除商品
    delCartUrl: `${host}/shopCart/delete`,

    // 书单详情
    detailUrl: `${host}/bookList/detail`,

    

};

module.exports = config
