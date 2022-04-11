import React, { useState } from 'react';
import { View } from 'react-native';

interface Props { }

const Header: React.FC<Props> = (props: any) => {

    const { style } = props;
    const defaultStyle = {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginBottom: 15
    };

    return (
        <View style={[defaultStyle, style]}>
            {props.children}
        </View>
    );
}
export default Header;