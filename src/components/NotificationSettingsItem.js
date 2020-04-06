import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import * as settingsRepo from '../repositories/settings';
import * as onesignalUtil from '../utilities/onesignal';
import i18n from '../locales';
import * as langStore from '../store/language';

const color = {
    EMERALD: '#2ecc71', // Cırtlak Yeşil
    ALIZARIN: '#e74c3c', // Cırtlak Kırmızı
};

export default class NotificationSettingsItem extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            i18n: i18n(),
            notificationSwitchValue: true
        }
    }

    componentDidMount() {
        this.refresh();

        langStore.default.addListener(langStore.LANG, this.langChanged);
    }

    componentWillUnmount() {
        langStore.default.removeListener(langStore.LANG, this.langChanged);
    }

    refresh = async () => {
        this.setState({
            notificationSwitchValue: await settingsRepo.getNotification()
        });
    };

    langChanged = () => {
        this.setState({
            i18n: i18n()
        });
    }

    toggleNotificationSwitchValue = async () => {
        var value = !this.state.notificationSwitchValue;

        await settingsRepo.setNotification(value);

        this.setState({ notificationSwitchValue: value });

        onesignalUtil.sendGeneralNotification(value);
    };

    render() {
        return <ListItem
            leftIcon={{ name: 'notifications', type: 'material', color: color.ALIZARIN }}
            title={this.state.i18n.settings.changeNotificationStatus}
            checkmark={
                this.state.notificationSwitchValue
                    ? { type: 'antdesign', name: 'check', color: color.EMERALD }
                    : { type: 'antdesign', name: 'close', color: color.ALIZARIN }
            }
            bottomDivider
            onPress={this.toggleNotificationSwitchValue}
        />
    }
}

const styles = StyleSheet.create({});