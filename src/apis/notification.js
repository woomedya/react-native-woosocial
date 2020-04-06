import Crypto from 'woo-crypto';
import { getUTCTime } from 'woo-utilities/date';
import opts from '../../config';
import Axios from "axios";

const post = async (baseURL, url, headers, data) => {
    var instance = Axios.create({
        baseURL: baseURL,
        timeout: 10000,
        headers: { 'Content-Type': 'application/json', ...headers }
    });
    var responseJson = await instance.post(url, data);

    return responseJson.data
}

const baseRequest = async (url, type, obj = {}) => {
    try {
        var token = (Crypto.encrypt(JSON.stringify({ expire: getUTCTime(opts.tokenTimeout).toString(), type }), opts.publicKey, opts.privateKey));
        var result = await post(opts.wooServerUrl, url, {
            public: opts.publicKey,
            token
        }, {
            ...obj
        });

        return result;
    } catch (error) {
        return { status: false };
    }
}

export const getNotificationList = async (lang) => {
    var result = await baseRequest('/notification/unread', 'notification.unread', {
        lang
    });
    var list = result.data || [];
    return list.length ? list :
        opts.dummyNotificationlist.length ? opts.dummyNotificationlist : [];
}