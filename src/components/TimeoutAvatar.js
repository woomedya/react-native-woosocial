import React, { Component } from "react";
import FastImage from "react-native-fast-image";
import opts from '../../config';

var logo = null;

export default class TimeoutAvatar extends Component {
    constructor (props) {
        super(props)
        this.props = props;

        logo = props.logo;

        this.deleted = false;

        this.state = {
            uri: "",
            hasError: false
        }
    }

    componentDidMount() {
        if (this.props.timeout) {
            setTimeout(() => {
                if (this.deleted == false && this.props.source && this.props.source.uri)
                    this.setState({
                        uri: this.props.source.uri
                    })
            }, this.props.timeout);
        }
    }

    componentWillUnmount() {
        this.deleted = true;
    }

    onErrorHandler() {
        this.setState({
            hasError: true
        })
    }

    render() {
        var source = null;

        if (this.props.timeout) {
            if (this.state.uri)
                source = {
                    uri: this.state.uri,
                    headers: { Authorization: this.state.uri },
                    priority: FastImage.priority.normal,
                }
        } else if (this.props.source && this.props.source.uri) {
            source = {
                uri: this.props.source.uri,
                headers: { Authorization: this.props.source.uri },
                priority: FastImage.priority.normal,
            }
        }

        return (
            source ?
                <FastImage
                    key={ source.uri }
                    style={ this.props.style }
                    onError={ this.onErrorHandler.bind(this) }
                    source={ this.state.hasError ? logo :
                        {
                            uri: source.uri,
                            headers: { Authorization: source.uri },
                            priority: FastImage.priority.normal,
                            cache: FastImage.cacheControl.immutable,
                        } }
                    resizeMode={ this.props.resizeMode ? this.props.resizeMode : FastImage.resizeMode.stretch }

                /> : <FastImage
                    style={ [this.props.style, { backgroundColor: opts.color.PRIMARY }] }
                    source={ logo }
                    resizeMode={ this.props.resizeMode ? this.props.resizeMode : FastImage.resizeMode.center } />
        );
    }

} 