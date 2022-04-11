import React, { useState } from 'react';
import { View } from 'react-native';

interface Props { }

const Right: React.FC<Props> = (props: any) => {
    return (
        <View style={{
            justifyContent: 'flex-end',
            flex: props.flex || 0.5,
            flexDirection: 'row',
            alignItems: 'center'
        }}>{props.children}</View>
    );
}
export default Right;