import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import * as settingsRepo from '../repositories/settings';
import * as onesignalUtil from '../utilities/onesignal';
import i18n from '../locales';
import * as langStore from '../store/language';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const font = {
    FONT_SIZE_MEDIUM: fontsize(14),
    FONT_WEIGHT_BOLD: '700'
};

function fontsize(value) {
    return value * Dimensions.get('window').width / 411;
}

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

    renderIcon = (name, color, type) => {
        return <Icon
            iconStyle={this.props.iconStyle || styles.itemLeftAvatarImage}
            name={name}
            color={color}
            type={type}
        />
    }

    render() {
        return <ListItem
            leftElement={this.renderIcon("notifications", color.ALIZARIN, 'material')}
            title={this.state.i18n.settings.changeNotificationStatus}
            checkmark={
                this.state.notificationSwitchValue
                    ? this.renderIcon("check", color.EMERALD, 'antdesign')
                    : this.renderIcon("close", color.ALIZARIN, 'antdesign')
            }
            bottomDivider
            onPress={this.toggleNotificationSwitchValue}
            contentContainerStyle={this.props.contentContainerStyle || styles.itemContainerStyle}
            titleStyle={this.props.titleStyle || styles.itemTitleStyle}
        />
    }
}

const styles = StyleSheet.create({
    itemLeftAvatarImage: {
        fontSize: wp(5.5)
    },
    itemTitleStyle: {
        fontWeight: font.FONT_WEIGHT_BOLD,
        fontSize: font.FONT_SIZE_MEDIUM
    },
    itemContainerStyle: {
        paddingVertical: wp(1),
    },
});