
import React, { useState } from 'react';
import { Text } from 'react-native';
import Config from '../../Config';

interface Props { }

const H3: React.FC<Props> = (props: any) => {

    const { style } = props;
    const defaultStyle = {
        fontFamily: Config.headingFont,
        fontSize: Config.defaultFontSize * 1.5,
        marginBottom: 0,
        color: Config.defaultFontColor,

    };

    return (
        <Text style={[defaultStyle, style, Config.style.FW500, Config.style.font20]}>{props.children}</Text>
    );
}

export default H3;