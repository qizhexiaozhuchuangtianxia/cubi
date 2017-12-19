/**
 * HTTP响应状态枚举
 *
 * @author qiuwei
 * @date 2016年09月10日
 */
const HTTP_RESPONSE_STATE = {
    SUCCESS: 99999,
    // Others failure state
    // ...
    UN_AUTHORIZATION: 400001,       // 未登录
    AUTHORIZATION_TIMEOUT: 400002,  // 登录超时 
    SERVER_ERROR: 50000,            // 服务器错误
    NODE_ERROR: 60000,              // nodejs 发生错误 
    NODE_ERROR_ROUTER_NOT_HIT: 60001, // 路由未命中
};

const HTTP_METHOD = {
    OPTIONS: 'OPTIONS',
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
};


export {
    HTTP_RESPONSE_STATE,
    HTTP_METHOD,
};
