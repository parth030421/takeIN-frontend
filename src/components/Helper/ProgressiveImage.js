import React, { Component } from 'react';
import { Image } from 'react-native';
import { AppImages } from '../../res';

export default class ProgressiveImage extends Component {
    state = { showDefault: true, error: false };

    render() {
        var image = this.state.showDefault ? AppImages.dummyCart : (this.state.error ? AppImages.dummyCart : { uri: this.props.uri });

        return (
            <Image style={this.props.style}
                source={image}
                onLoadEnd={() => this.setState({ showDefault: false })}
                onError={() => this.setState({ error: true })}
                resizeMode={this.props.resizeMode} />
        );
    }
}