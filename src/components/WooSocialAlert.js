import React from 'react';
import {
    StyleSheet, Button, Text, View, AppState, Image as ImageReact
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as onesignalUtil from '../utilities/onesignal';
import AlertBox from './AlertBox';
import { Image } from 'react-native-elements';
import opts from '../../config';
import * as langStore from '../store/language';
import * as settingsRepo from '../repositories/settings';
import i18n from '../locales';
import * as notificationApi from '../apis/notification';

export default class WooSocialAlert extends React.Component {
    constructor(props) {
        super(props);

        this.oneSignal = null;
        this.notificationControlStatus = true;
        this.lastScreenState = AppState.currentState;

        this.state = {
            i18n: i18n(),
            notificationVisible: false,
            notificationData: null,
        };
    }

    async componentDidMount() {
        this.oneSignal = new onesignalUtil.default({
            onOpened: this.recievedMessageOnOpened,
            onReceived: this.recievedMessageWhileOpened,
            onIds: this.listenOnDeviceId
        });

        langStore.default.addListener(langStore.LANG, this.langChanged);
        AppState.addEventListener('change', this.screenChanged);

        this.notificationControl();
    }

    componentWillUnmount() {
        this.oneSignal.removeOnesignalEventListener();

        langStore.default.removeListener(langStore.LANG, this.langChanged);
        AppState.removeEventListener('change', this.screenChanged);
    }

    langChanged = () => {
        var lang = langStore.getLanguage();
        onesignalUtil.sendLang(lang);
    }

    listenOnDeviceId = async (e) => {
        var startup = await settingsRepo.getStartupOnesignal();

        if (startup) {
            var deviceId = await DeviceInfo.getUniqueId();
            onesignalUtil.sendDevice(deviceId);
            onesignalUtil.sendGeneralNotification(true);
            onesignalUtil.sendLang(langStore.getLanguage());
            await settingsRepo.setStartupOnesignal();
        }
    };

    recievedMessageOnOpened = (e) => {
        this.notificationControlStatus = false;
        setTimeout(() => {
            this.onNotificationSave(e);
        }, 1500);
    };

    recievedMessageWhileOpened = (e) => {
        this.notificationControlStatus = false;
        setTimeout(() => {
            this.onNotificationSave(e);
        }, 1500);
    };

    notificationControl = async () => {
        if (!this.notificationControlStatus)
            return;

        let isNotificationOpen = await settingsRepo.getNotification();

        if (isNotificationOpen) {
            let createdDate = await settingsRepo.getLastNotificationDate();

            if (createdDate) {
                let lastNotification = (await notificationApi.getNotificationList({ createdDate }))[0];

                var lastSpecialNotification = null;

                if (this.props.getSpecialNotification)
                    lastSpecialNotification = await this.props.getSpecialNotification({ createdDate });

                lastNotification = lastNotification ? (lastSpecialNotification ? (new Date(lastNotification.date) > new Date(lastSpecialNotification.date) ? lastNotification : lastSpecialNotification) : lastNotification) : lastSpecialNotification;

                if (lastNotification && this.notificationControlStatus) {
                    this.onNotificationSave({
                        notification: {
                            payload: {
                                title: lastNotification.title,
                                body: lastNotification.message,
                                additionalData: {
                                    url: lastNotification.link,
                                    image: lastNotification.image
                                }
                            }
                        }
                    });
                }
            }
        }
    }

    screenChanged = nextState => {
        if (nextState.match(/inactive|background/)) {
            settingsRepo.setLastNotificationDate(new Date().toISOString());
        }

        if (
            this.lastScreenState.match(/inactive|background/) &&
            nextState === 'active'
        ) {
            this.notificationControl();
        }

        this.lastScreenState = nextState;
    };

    onNotificationSave = async (e) => {
        var notification;
        if (e.notification != null) {
            notification = e.notification;
        } else {
            notification = e;
        }

        var payload = notification.payload || {};
        var additionalData = payload.additionalData || {};
        var rawpayload = payload.rawpayload || {};
        var att = rawpayload.att || {};

        var nofificationItem = {
            Title: payload.title,
            Message: payload.body,
            Date: new Date().toISOString(),
            Image: additionalData.image || rawpayload.bigPicture || att.id || "",
            Url: additionalData.url
        };

        this.setState({
            notificationVisible: true,
            notificationData: nofificationItem
        });
    };

    alertClose = () => {
        this.setState({ notificationVisible: false, notificationData: null });
        this.notificationControlStatus = true;
    }

    openDetail = () => {
        this.alertClose()
        if (this.props.openDetail)
            this.props.openDetail(this.state.notificationData.Url);
    }

    renderContent = () => {
        return this.props.renderContent ? this.props.renderContent(this.state) : <View>
            {this.state.notificationData.Image ? (
                <Image
                    resizeMode="contain"
                    style={style.alertImage}
                    source={{ uri: this.state.notificationData.Image }}
                />
            ) : null}

            <Text>{this.state.notificationData.Message}</Text>
        </View>
    }

    renderLeftButton = () => {
        return this.props.renderLeftButton ? this.props.renderLeftButton(this.state) : this.state.notificationData.Url ? (
            <Button
                onPress={this.openDetail}
                title={this.state.i18n.alertbox.show}
                color={opts.color.PRIMARY}
            />
        ) : null;
    }

    render() {
        return this.state.notificationVisible ? (
            <AlertBox
                visible={true}
                title={this.state.notificationData.Title}
                closeButtonFunc={this.alertClose}
                content={this.renderContent()}
                leftButton={this.renderLeftButton()}
            />
        ) : null;
    }
};

const style = StyleSheet.create({
    container: {
        flex: 1
    },
    alertImage: {
        width: '100%', height: 150
    }
});