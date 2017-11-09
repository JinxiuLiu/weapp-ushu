/**
 * Created by Liujx on 2017-10-24 14:59:47
 * 小程序配置文件
 */

var host = "https://rkkscs.xatime.com"

var config = {

    host,

    // 上传文件接口
    uploadFileUrl: `${host}/file_upload`,

    // 身份证上传接口
    identityCardUrl: `${host}/identityCard/upload`,

    // 登录接口
    loginUrl: `${host}/wxa/login`,

    // 赠朋友-地址
    giveAddressUrl: `${host}/order/express/add`,

    // 身份证提交认证
    commitCardUrl: `${host}/identityCard/commit`,

    // 我的身份证信息
    myCardUrl: `${host}/identityCard/my`,

    // 发送验证码
    sendCodeUrl: `${host}/mobile/code`,

    // 绑定手机号
    bindMobileUrl: `${host}/mobile/bind`,

    // 注册
    registerUrl: `${host}/wxa/register`,

    // 选择图书
    getBookListUrl: `${host}/bookList/grid_items`,

    // 首页banner
    bannerUrl: `${host}/banner/list`,

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
    collectBookViewUrl: `${host}/collection/grid_item_my`,

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
    myAttentionUrl: `${host}/follow/grid_my`,

    // 我的资料
    aboutUrl: `${host}/member/detail/my`,

    // 修改昵称
    updateNameUrl: `${host}/member/detail/update_name`,

    // 累计收益
    totalMoneyUrl: `${host}/profit/total_money`,

    // 可提现收益
    canGetMoneyUrl: `${host}/profit/can_get_money`,

    // 收益列表
    moneyListUrl: `${host}/profit/money_list_by_book_list_my`,

    // 提现记录
    withdrawalRecordUrl: `${host}/withdrawal/grid_my`,

    // 提现
    addWithdrawalUrl: `${host}/withdrawal/add`,

    // 支付
    paymentUrl: `${host}/charge/req_lite`,

    // 书单收益明细
    gridMyListUrl: `${host}/profit/grid_my`,

    // 书单收益排行
    gridMyListRankingUrl: `${host}/profit/money_list_by_book_list`,

    // 用户收益排行
    userMoneyRankingUrl: `${host}/profit/money_list_by_member`,

    // 分享成功回调
    shareSaveUrl: `${host}/share/save`,

    // 我的分享
    shareListUrl: `${host}/share/grid_distinct_my`,

    // 关注通知
    informAttentionUrl: `${host}/follow/grid_follow_me`,

    // 收益通知
    informEarningsUrl: `${host}/profit/grid_my`,

    // 系统通知
    informSystemUrl: `${host}/notice/grid_my`,

    // 评论通知
    informCommentUrl: `${host}/comment/to_me`,

    // 图书详情
    bookDetailUrl: `${host}/bookListItem/detail`,

    // 图书收藏
    collectBookUrl: `${host}/collection/add`,

};

module.exports = config