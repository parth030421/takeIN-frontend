import React, { useState } from 'react';
import { View } from 'react-native';

interface Props { }

const Left: React.FC<Props> = (props: any) => {
    const [distValue, setDistValue] = useState(50.0);
    const defaultStyle = {
        justifyContent: 'flex-start',
        flex: props.flex || 0.5,
        flexDirection: props.flexDirection || 'row',
        alignItems: 'flex-start'
    };

    return (
        <View style={[defaultStyle, props.style]}>{props.children}</View>
    );
}
export default Left;