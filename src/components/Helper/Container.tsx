import React, { useState } from 'react';
import { View } from 'react-native';

interface Props { }

const Container: React.FC<Props> = (props: any) => {

    const { style } = props;
    const defaultStyle = {
        paddingHorizontal: 15
    };

    return (
        <View style={[defaultStyle, style]}>
            {props.children}
        </View>
    );
}

export default Container;