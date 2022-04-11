

import React from 'react';
import { View } from 'react-native';

interface Props { }

const Space: React.FC<Props> = (props: any) => {
    return (
        <View style={{ height: props.height || 20 }}></View>
    );
}
export default Space;