import judel from 'judel';
import AsyncStorage from '@react-native-community/async-storage';

var adaptor = judel.adaptor.AsyncStorage(AsyncStorage);

const repo = new judel.Repo({
    adaptor
});

const settingsModel = repo.create("woosocial_settings");

var defaultSettings = {
    startupOnesignal: true,
    notification: true,
    lastNotificationDate: ''
};

var cacheValue = null;

const get = async () => {
    if (cacheValue == null) {
        var list = await settingsModel.list();
        if (list.length) {
            cacheValue = list[0];
        } else {
            cacheValue = defaultSettings;
        }
    }
    return cacheValue;
}

const set = async (key, value) => {
    cacheValue = await get();
    cacheValue[key] = value;
    await settingsModel.upsert(cacheValue);
}

export const getNotification = async () => {
    var value = await get();
    return value.notification;
}

export const setNotification = async (value) => {
    await set("notification", value);
}

export const getStartupOnesignal = async () => {
    var value = await get();
    return value.startupOnesignal;
}

export const setStartupOnesignal = async () => {
    await set("startupOnesignal", true);
}

export const getLastNotificationDate = async () => {
    var value = await get();
    return value.lastNotificationDate;
}

export const setLastNotificationDate = async (value) => {
    await set('lastNotificationDate', value);
}