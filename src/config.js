/**
 * 小程序配置文件, 使用前更名为config.js
 */

var host = 'https://board.upwki.com/api/weapp';


var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/upload`
    }
};

module.exports = config;