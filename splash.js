import React, { Component } from 'react';
import LottieView from 'lottie-react-native';
import App from './App';
import { Image, View, StatusBar } from 'react-native';
import { AppImages } from './src/res';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from './src/Config';
import SyncStorage from 'sync-storage';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');
export default class Splash extends Component {

    state = {
        hasViewedVideo: false
    }
    getToken = async () => {

    }
    playSound = () => {
        let sound = new Sound('Splash_Page_Sound.wav', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                return;
            }
            // when loaded successfully
            sound.play();
        });
    }
    componentDidMount = async () => {
        try {
            const value = await AsyncStorage.getItem('accessToken')
            if (value !== null) {
                Config.userAuthToken = value
                SyncStorage.set('Token', value);
            } else {
                SyncStorage.set('Token', null);
            }
            this.playSound();
        } catch (e) {
            // error reading value
        }
        setTimeout(() => {
            this.setState({ hasViewedVideo: true })
        }, 2700)
    }

    render() {
        if (!this.state.hasViewedVideo) {
            return (<View>
                <StatusBar hidden />
                <Image
                    source={AppImages.splash}
                    style={{ width: '100%', height: '100%' }}
                />
            </View>)
        }
        return (
            <App token={Config.userAuthToken}></App>
            //   <Provider store={store}>
            //     <AppContainer />
            //   </Provider>
        )
    }
}


