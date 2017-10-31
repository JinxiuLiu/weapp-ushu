/**
 * Created by Liujx on 2017-10-24 14:59:47
 * 小程序配置文件
 */

var host = "http://192.168.0.111:8081"

var config = {

    host,

    // 选择图书
    getBookListUrl: `${host}/bookList/grid_items`,

    // 选择图书
    SelectBookUrl: `${host}/book/grid`,

    // 创建书单
    CreateListUrl: `${host}/bookList/save`,

    // 我的书单
    myBookListUrl: `${host}/bookList/grid_my`,

    // 书单 更改发布状态
    changeBookListUrl: `${host}/bookList/change`,

    // 删除书单
    deleteBookListUrl: `${host}/bookList/delete`,

    // 书单浏览记录
    readBookListUrl: `${host}/bookList/read`,

    // 书单详情-评论列表
    commentListUrl: `${host}/comment/list`,

    // 书单详情-评论分页
    commentGridUrl: `${host}/comment/datagrid`,

    // 收藏接口
    collectUrl: `${host}/collection/add`,

    // 我的收藏（书单)
    collectBookListUrl: `${host}/collection/grid_list_my`,

    // 我的收藏（图书）
    collectBookUrl: `${host}/collection/grid_item_my`,

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

    // 购物车总数量
    cartTotalUrl: `${host}/shopCart/total_quantity`,

    // 购物车删除商品
    delCartUrl: `${host}/shopCart/delete`,

    // 生成订单
    generateUrl: `${host}/order/generate`,

    // 提交订单
    commitUrl: `${host}/order/commit`,

    // 订单详情
    orderDetailUrl: `${host}/order/detail`,

    // 订单列表
    orderListUrl: `${host}/order/list_my`,

    // 书单详情
    detailUrl: `${host}/bookList/detail`,

    // 添加关注
    addAttentionUrl: `${host}/follow/add`,

    // 我的关注
    myAttentionUrl: `${host}/follow/list_my`,

};

module.exports = config