
import React, { useState } from 'react';
import { View } from 'react-native';

interface Props { }

const Footer: React.FC<Props> = (props: any) => {
    const [distValue, setDistValue] = useState(50.0);
    const { style } = props;
    const defaultStyle = {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 0,
        backgroundColor: '#ffffff',
        paddingBottom: 10,
    };
    return (
        <View style={[defaultStyle, style]}>
            {props.children}
        </View>
    );
};

export default Footer;
