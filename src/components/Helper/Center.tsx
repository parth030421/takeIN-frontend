import React, { useState } from 'react';
import { View } from 'react-native';

interface Props { }

const Center: React.FC<Props> = (props: any) => {
    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: props.flex || 1,
            flexDirection: props.flexDirection || 'row'
        }}>{props.children}</View>
    );
}
export default Center;