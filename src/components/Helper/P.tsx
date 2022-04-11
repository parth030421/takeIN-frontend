import React from 'react';
import { Text } from 'react-native';
import Config from '../../Config';

interface Props { }

const P: React.FC<Props> = (props: any) => {

    const { style } = props;
    const defaultStyle = {
        fontFamily: props.bold ? Config.headingFont : Config.defaultFont,
        fontSize: 12,
        marginBottom: props.nomargin === true ? 0 : 3,
        color: Config.defaultFontColor
    };

    return (
        <Text style={[defaultStyle, style]}>{props.children}</Text>
    );
}
export default P