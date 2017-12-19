/* global process */
/**
 * 统一请求方式
 */
import moment from 'moment';
import axios from 'axios';
import { HTTP_METHOD , HTTP_RESPONSE_STATE} from '../constants/http';

/**
 * axios
 *
 * need to import 'axios' at top
 * https://github.com/mzabriskie/axios
 */
export default function httpProxy(url, method = HTTP_METHOD.GET, data = {}, credentials = false) {
    const options = {
        url,
        method,
        headers: {
            sessionId: sessionStorage.getItem("SID") || '',
            terminalType: 'PC'
        },
        withCredentials: credentials
    };

    if (method !== HTTP_METHOD.GET) {
        options.headers['Accept'] = 'application/json';
        options.headers['Content-Type'] = 'application/json;charset=UTF-8';
        options.data = data;
    } else if (method === HTTP_METHOD.GET) {
        options.params = data;
    } else {
        throw new Error(`未知的HTTP Method: ${ method }`);
    }

    return axios(options).then((response) => {
        sessionStorage.setItem("SID", response.data.sessionId);
        return response;
    });
}

httpProxy.request = async (url, method, data, credentials) => {
    const response = await httpProxy(url, method, data, credentials);
    if (response.status < 200 || response.status >= 300) {
        const err = new Error(`HTTP(${url}) ERROR(${response.statusText})`);
        err.code = response.status;
        throw err;
    }

    console.dir(response.data)
    const { code, dataObject, success, message } = response.data;
    if (code !== HTTP_RESPONSE_STATE.SUCCESS) {
        const err = new Error(message);
        throw err;
    }

    return dataObject;
};
