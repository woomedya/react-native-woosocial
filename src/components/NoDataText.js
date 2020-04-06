import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

export default class NoDataText extends Component {
    render() {
        return this.props.visible ? <ListItem
            title={ this.props.text }
            titleStyle={ style.noDataText }
            containerStyle={ style.noDataContainer }
            bottomDivider
        /> : null
    }
}

const style = StyleSheet.create({
    noDataContainer: {
        margin: 10
    },
    noDataText: {
        textAlign: 'center',
        color: '#7f8c8d',
        fontSize: 16
    }
});