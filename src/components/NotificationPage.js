import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import * as notificationApi from '../apis/notification';
import i18n from '../locales';
import NotificationCard from './NotificationCard';
import NoDataText from './NoDataText';
import opts from '../../config';
import * as langStore from '../store/language';

export default class Notification extends Component {
    constructor(props) {
        super(props)
        this.props = props;

        this.state = {
            i18n: i18n(),
            notificationsList: [],
            initial: false,
            refreshing: false
        };
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
            initial: false
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
        return await notificationApi.getNotificationList(lang);
    }

    openDetail = (url) => {
        if (this.props.openDetail)
            this.props.openDetail(url);
    }

    handleRefresh = () => {
        this.setState({
            refreshing: true
        }, this.refresh);
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
            onpress={this.openDetail}
            urlDescription={this.state.i18n.notification.urlDescription}
        />
    }

    renderNoText = () => {
        return opts.renderNoText ? opts.renderNoText(this.state.notificationsList.length == 0) : <NoDataText
            visible={this.state.notificationsList.length == 0}
            text={this.state.i18n.notification.noData} />
    }

    render() {
        return <View style={styles.container}>
            {this.renderNoText()}

            <FlatList
                contentContainerStyle={styles.container}
                numColumns={2}
                keyExtractor={this.itemKey}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
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