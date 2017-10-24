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
    uploadFileUrl: `${host}/file_upload`

};

module.exports = config
