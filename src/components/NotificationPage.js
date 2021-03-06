import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import * as notificationApi from '../apis/notification';
import i18n from '../locales';
import NotificationCard from './NotificationCard';
import NoDataText from './NoDataText';
import opts from '../../config';
import * as langStore from '../store/language';
import WooSocialAlert from './WooSocialAlert';

export default class Notification extends Component {
    constructor(props) {
        super(props)
        this.props = props;

        this.state = {
            i18n: i18n(),
            notificationsList: [],
            initial: false,
            refreshing: true
        };

        this.wooSocialAlert = null;
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
            initial: false,
            refreshing: true
        });

        var notificationsList = await this.getNotificationList();
        this.setState({
            notificationsList,
            initial: true,
            refreshing: false
        });
    }

    langChanged = () => {
        this.setState({
            i18n: i18n()
        });
    }

    getNotificationList = async () => {
        var lang = langStore.getLanguage();
        return await notificationApi.getNotificationList({ lang });
    }

    openDetail = (url) => {
        if (this.props.openDetail)
            this.props.openDetail(url);
    }

    showNotificationAlertBox = (item) => {
        if (this.wooSocialAlert)
            this.wooSocialAlert.onNotificationSave({
                notification: {
                    payload: {
                        title: item.title,
                        body: item.message,
                        additionalData: {
                            url: item.link,
                            image: item.image
                        }
                    }
                }
            });
    }

    keyItem = (item, index) => {
        return index.toString();
    }

    renderItem = ({ item }) => {
        return opts.renderItem ? opts.renderItem(item) : <NotificationCard
            url={item.link}
            title={item.title}
            message={item.message}
            date={item.createdDate}
            image={item.image}
            onpress={() => { this.showNotificationAlertBox(item) }}
            urlDescription={this.state.i18n.notification.urlDescription}
        />
    }

    renderNoText = () => {
        return opts.renderNoText ? opts.renderNoText(this.state.notificationsList.length == 0) : <NoDataText
            visible={this.state.notificationsList.length == 0 && !this.state.refreshing && this.state.initial}
            text={this.state.i18n.notification.noData} />
    }

    render() {
        return <View style={styles.container}>
            {this.renderNoText()}

            <WooSocialAlert
                ref={r => this.wooSocialAlert = r}
                openDetail={this.openDetail}
            />

            <FlatList
                key={this.props.numColumns || "notification"}
                contentContainerStyle={{ padding: 10, }}
                numColumns={this.props.numColumns || 2}
                keyExtractor={this.itemKey}
                refreshing={this.state.refreshing}
                onRefresh={this.refresh}
                data={this.state.notificationsList}
                initialNumToRender={4}
                renderItem={this.renderItem}
                style={styles.list}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});