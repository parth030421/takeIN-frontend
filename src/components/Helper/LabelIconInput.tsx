import React, { useState } from 'react';
import { Text } from 'react-native';
import { TextInput } from 'react-native';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Config from '../../Config';


interface Props { }

const LabelIconInput: React.FC<Props> = (props: any) => {

    const { label, icon, afterInput } = props;

    return (
        <View style={Config.style.formField}>
            <View style={Config.style.labelWrapper}>
                <View>
                    <Text style={[Config.style.labelText, Config.style.FontMedium, Config.style.font14, Config.style.FW500, { color: '#333333' }]}>{label}</Text>
                </View>
            </View>
            <View>
                <TextInput {...props} style={[Config.style.formInput, props.style, Config.style.MT5, { height: 44, borderColor: '#A2A2A2' }]} textBreakStrategy={'simple'} />
                {afterInput}
            </View>
        </View>
    );

}

export default LabelIconInput;