import oneSignal from 'react-native-onesignal/index';

export const getTags = async () => {
    return new Promise(res => {
        oneSignal.getTags((receivedTags) => {
            res(receivedTags);
        });
    });
}

export const sendGeneralNotification = value => {
    oneSignal.sendTags({
        general: value
    });
}

export const sendDevice = async value => {
    oneSignal.sendTags({
        device: value
    });
}

export const sendLang = async value => {
    oneSignal.sendTags({
        lang: value
    });
}

export const sendTags = (values) => {
    oneSignal.sendTags(values);
}

export const getPermissionSubscriptionState = () => {
    oneSignal.getPermissionSubscriptionState((status) => {
        // TODO: Abone mi değil mi kullanılırsa burası yazılacak
    });
}

export const setSubscription = (value) => {
    oneSignal.setSubscription(value);
}

export default class OneSignalUtils {
    constructor(props) {
        this.props = props;
        this.added = false;

        this.add();
    }

    add = () => {
        if (!this.added) {
            oneSignal.addEventListener('received', this.onReceived);
            oneSignal.addEventListener('opened', this.onOpened);
            oneSignal.addEventListener('ids', this.onIds);
        }
        this.added = true;
    }

    remove = () => {
        if (this.added) {
            oneSignal.removeEventListener('received', this.onReceived);
            oneSignal.removeEventListener('opened', this.onOpened);
            oneSignal.removeEventListener('ids', this.onIds);
        }
        this.added = false;
    }

    removeOnesignalEventListener = () => {
        oneSignal.removeEventListener('received', this.onReceived);
        oneSignal.removeEventListener('opened', this.onOpened);
        oneSignal.removeEventListener('ids', this.onIds);

        this.added = false;
    }

    onReceived = (notification) => {
        if (this.props.onReceived)
            this.props.onReceived(notification);
    }

    onOpened = (openResult) => {
        if (this.props.onOpened)
            this.props.onOpened(openResult);
    }

    onIds = (device) => {
        if (this.props.onIds)
            this.props.onIds(device);
    }
}