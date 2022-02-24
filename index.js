import { Platform } from 'react-native';
import opts from './config';
import OneSignal from 'react-native-onesignal/index';
import NotificationPage from './src/components/NotificationPage';
import WoosocialAlert from './src/components/WooSocialAlert';
import NotificationSettingsItem from './src/components/NotificationSettingsItem';
import * as langStore from './src/store/language';

export const config = async ({ wooServerUrl, publicKey, privateKey, tokenTimeout, dummyNotificationlist, locales, color, logo, lang, renderNoText, renderItem, oneSignalAppId, notificationCard }) => {
    opts.wooServerUrl = wooServerUrl;
    opts.publicKey = publicKey;
    opts.privateKey = privateKey;
    opts.logo = logo;

    opts.lang = lang;
    langStore.setLanguage(lang);

    opts.dummyNotificationlist = dummyNotificationlist || [];
    opts.locales = locales || {};
    opts.color = color || opts.color;
    opts.renderNoText = renderNoText || null;
    opts.renderItem = renderItem || null;
    opts.notificationCard = notificationCard || {};

    if (tokenTimeout != null)
        opts.tokenTimeout = tokenTimeout;

    OneSignal.init(oneSignalAppId, {
        kOSSettingsKeyAutoPrompt: true,
    });
    OneSignal.setLogLevel(6, 0);
    OneSignal.pauseInAppMessages(false);
    OneSignal.inFocusDisplaying(2);
    OneSignal.setLocationShared(true);
    OneSignal.setSubscription(true);
    // Calling registerForPushNotifications
    if (Platform.OS == "ios")
        OneSignal.registerForPushNotifications();
}

export const setLang = (lang) => {
    opts.lang = lang;
    langStore.setLanguage(lang);
}

export const WooSocialAlert = WoosocialAlert;

export const WooSocialNotificationSettingsItem = NotificationSettingsItem;

export default NotificationPage;