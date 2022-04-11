
import React, { useState } from 'react';
import { ScrollView, Platform, } from 'react-native';
import { SafeAreaView, StatusBar } from 'react-native';
import Config from '../../Config';

interface Props { }

const Wrapper: React.FC<Props> = (props: any) => {

    const { style } = props;
    const defaultStyle = {
        backgroundColor: Config.backgroundColor,
        flex: 1,
        paddingTop: 0
    };


    return (
        <>
            <StatusBar barStyle={Config.layoutMode == 'dark' ? 'light-content' : 'dark-content'} />
            <SafeAreaView {...props} style={[defaultStyle, style]}>
                <ScrollView keyboardShouldPersistTaps={'handled'} style={{ flex: 1, backgroundColor: '#FFFFFF' }} alwaysBounceHorizontal={false}
                    alwaysBounceVertical={false}
                    bounces={false}>
                    {props.children}
                </ScrollView>
                {props.footer}
            </SafeAreaView>
        </>
    );
}

export default Wrapper;

