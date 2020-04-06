import React from 'react';
import { StyleSheet, Text, View, Image as ImageReact } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as onesignalUtil from '../utilities/onesignal';
import AlertBox from './AlertBox';
import { Image } from 'react-native-elements';
import opts from '../../config';
import * as langStore from '../store/language';
import * as settingsRepo from '../repositories/settings';

export default class WooSocialAlert extends React.Component {
    constructor(props) {
        super(props);

        this.oneSignal = null;
    }

    state = {
        notificationVisible: false,
        notificationData: null,
    };

    async componentDidMount() {
        this.oneSignal = new onesignalUtil.default({
            onOpened: this.recievedMessageOnOpened,
            onReceived: this.recievedMessageWhileOpened,
            onIds: this.listenOnDeviceId
        });

        langStore.default.addListener(langStore.LANG, this.langChanged);
    }

    componentWillUnmount() {
        this.oneSignal.removeOnesignalEventListener();

        langStore.default.removeListener(langStore.LANG, this.langChanged);
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
        this.onNotificationSave(e);
    };

    recievedMessageWhileOpened = (e) => {
        this.onNotificationSave(e);
    };

    onNotificationSave = async (e) => {
        var notification;
        if (e.notification != null) {
            notification = e.notification;
        } else {
            notification = e;
        }

        var nofificationItem = {
            Title: notification.payload.title,
            Message: notification.payload.body,
            Date: new Date().toISOString(),
            Image: notification.payload.additionalData.image || notification.payload.rawpayload.bigPicture || notification.payload.rawpayload.att.id || "",
            Url: notification.payload.additionalData.url
        };

        this.setState({
            notificationVisible: true,
            notificationData: nofificationItem
        });
    };

    alertClose = () => {
        this.setState({ notificationVisible: false, notificationData: null });
    }

    openDetail = () => {
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
                    placeholderStyle={style.alertPlaceholder}
                    PlaceholderContent={
                        <ImageReact
                            resizeMode="contain"
                            source={opts.logo}
                            style={style.alertPlaceholderImage}
                        />
                    }
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
    },
    alertPlaceholderImage: {
        width: '50%',
        height: '100%',
    },
    alertPlaceholder: {
        backgroundColor: '#ffffff'
    }
});