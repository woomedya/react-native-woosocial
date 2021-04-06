import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Button } from "react-native";
import i18n from '../locales';
import opts from '../../config';
import * as langStore from '../store/language';


export default class AlertBox extends Component {
    state = {
        modalVisible: true,
        i18n: i18n(),
    };

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        langStore.default.addListener(langStore.LANG, this.langChanged);
    }

    componentWillUnmount() {
        langStore.default.removeListener(langStore.LANG, this.langChanged);
    }

    langChanged = () => {
        this.setState({
            i18n: i18n()
        });
    }

    setModalVisible(visible) {
        if (!this.props.alwaysShow)
            this.setState({ modalVisible: visible });
    }

    closeButtonFunc = async () => {
        if (this.props.closeButtonFunc) {
            await this.props.closeButtonFunc()
            this.setModalVisible(false);
        } else {
            this.setModalVisible(false);
        }
    }

    render() {
        return this.state.modalVisible && this.props.visible ? <View style={{ zIndex: 1000, elevation: 1000, backgroundColor: '#00000080', top: 0, bottom: 0, right: 0, left: 0, position: 'absolute' }}>
            <View style={styles.root}>
                <View style={styles.content}>

                    {this.props.title ? <Text style={styles.title}>{this.props.title}</Text> : null}

                    {this.props.content ? <View style={styles.centercomponent}>{this.props.content}</View> : null}

                    {
                        this.props.alwaysShow ? null :
                            (
                                <View style={styles.bottomComponent}>
                                    {this.props.leftButton ?
                                        <TouchableOpacity style={styles.button}>
                                            {this.props.leftButton}
                                        </TouchableOpacity> : null}

                                    <TouchableOpacity style={styles.button}>
                                        <Button
                                            onPress={this.closeButtonFunc}
                                            title={this.props.closeButtonText ? this.props.closeButtonText : this.state.i18n.alertbox.done}
                                            color={opts.color.PRIMARY}
                                            accessibilityLabel={this.props.closeButtonText}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )
                    }
                </View>
            </View>
        </View> : null
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',

    },
    content: {
        position: "relative",
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 300,
        backgroundColor: '#fff',
        padding: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    title: {
        position: "relative",
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 11,

    },
    centercomponent: {
        padding: 11,
        flexDirection: 'row',
        alignItems: 'center',

    },
    bottomComponent: {
        position: "relative",
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    button: {
        flex: 1,
        padding: 5
    },
});
