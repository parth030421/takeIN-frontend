import React from 'react';
import { Text } from 'react-native';
import Config from '../../Config';

interface Props { }

const H4: React.FC<Props> = (props: any) => {

    const { style } = props;
    const defaultStyle = {
        fontFamily: Config.headingFont,
        fontSize: Config.defaultFontSize * 1.25,
        marginBottom: 10,
        color: Config.defaultFontColor
    };

    return (
        <Text style={[defaultStyle, style, Config.style.FW500]}>{props.children}</Text>
    );
}
export default H4