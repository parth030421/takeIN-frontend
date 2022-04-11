
import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
import Config from '../../Config';

interface Props { }

const Button: React.FC<Props> = (props: any) => {
    const [distValue, setDistValue] = useState(50.0);
    let { style }: any = props;
    if (!style) {
        style = {};
    }

    let textStyle: any = {};

    switch (props.type) {
        case 'secondary':
            style.backgroundColor = Config.secondaryColor;
            break;

        case 'light':
            style.backgroundColor = Config.lightColor;
            break;

        case 'warning':
            style.backgroundColor = Config.warningColor;
            break;

        case 'success':
            style.backgroundColor = Config.successColor;
            break;

        case 'primary-outline':
            style.backgroundColor = 'transparent';
            style.borderWidth = 2;
            style.borderColor = Config.primaryColor;
            textStyle.color = Config.primaryColor;
            break;

        case 'secondary-outline':
            style.backgroundColor = 'transparent';
            style.borderWidth = 2;
            style.borderColor = Config.secondaryColor;
            textStyle.color = Config.secondaryColor;
            break;

        case 'light-outline':
            style.backgroundColor = 'transparent';
            style.borderWidth = 2;
            style.borderColor = Config.lightColor;
            textStyle.color = Config.lightColor;
            break;

        case 'warning-outline':
            style.backgroundColor = 'transparent';
            style.borderWidth = 2;
            style.borderColor = Config.warningColor;
            textStyle.color = Config.warningColor;
            break;

        case 'success-outline':
            style.backgroundColor = 'transparent';
            style.borderWidth = 2;
            style.borderColor = Config.successColor;
            textStyle.color = Config.successColor;
            break;
    }

    if (props.block === false) {
        style.alignSelf = 'flex-start';
        style.paddingHorizontal = 15;
    } else {
        style.width = '100%';
    }
    return (
        <Pressable {...props} style={[Config.style.btnLg, style]} >
            <Text style={[Config.style.btnLgTxt, textStyle]}>{props.label}</Text>
        </Pressable>
    );
};

export default Button;
