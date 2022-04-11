// import React from 'react';
import React from 'react';
import {
    View,
    StyleSheet, Pressable,
    PressableOpacity, StatusBar, BackHandler, Clipboard,
    Text, Image, ToastAndroid, Keyboard, TextInput
} from 'react-native';

import { Footer, Button, Wrapper, Header, Left, Row, Col, Container, Space, H3, OTPTextInput, P } from '../components/componentIndex';
const marginTop = Platform.OS === 'ios' ? 0 : 0;
import Icon from "react-native-vector-icons/Ionicons";
import SyncStorage from 'sync-storage';
import Config from '../Config';
import { AppImages } from '../res';
import APIKit from '../APIKit';
import RNOtpVerify from 'react-native-otp-verify';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import OtpAutoFillViewManager from 'react-native-otp-auto-fill';
// const handleComplete = ({
//     nativeEvent: { code },
// }: NativeSyntheticEvent<{ code: string }>) => {
//     // Alert.alert('OTP Code Received!', code);
//     alert('OTP Code Received!', code)
// };

export default class ChangeEmail extends React.Component {
    mobileNumber;
    userId;
    otp;
    inputs = {};
    checkTimerInterval;
    clipboardInterval;
    state = {
        timer: 60,
        Isbuttondisable: true,
        isOtpWrong: false,
        isOtpResent: false,
        buttonMargin: 0
    }

    getHash = () =>
        RNOtpVerify.getHash()
            .then(console.log)
            .catch(console.log);

    startListeningForOtp = () =>
        RNOtpVerify.getOtp()
            .then(p => RNOtpVerify.addListener(this.otpHandler))
            .catch(p => console.log(p));

    otpHandler = (message) => {
        // console.log(message)
        // const otp = /(\d{4})/g.exec(message)[1];
        // this.setState({ otp });
        // RNOtpVerify.removeListener();
        // Keyboard.dismiss();
    }

    fetchCopiedText = async () => {
        const text = await Clipboard.getString();
        if (text) {
            this.otpInput.setValue(text);
            this.clearInterval(this.clipboardInterval)
        }

    }

    componentWillUnmount() {
        RNOtpVerify.removeListener();
    }
    componentDidMount() {
        // Clipboard.setString('')
        // this.clipboardInterval = setInterval(() => {
        //     this.fetchCopiedText()
        // }, 1000)
        // // RNOtpVerify.getHash()
        // //     .then(console.log)
        // //     .catch(console.log);
        // // RNOtpVerify.getOtp()
        // //     .then(p => RNOtpVerify.addListener(this.otpHandler))
        // //     .catch(p => console.log(p));
        // this.otpInput.clear();
        // BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
        // this.focusListener = this.props.navigation.addListener('focus', () => {
        //     this.setState({ countryCode: SyncStorage.get('countryCode') + SyncStorage.get('mobileNumber') })
        //     this.mobileNumber = SyncStorage.get('mobileNumber');
        //     this.userId = SyncStorage.get('userId')
        //     console.log("focus", this.state.countryCode)
        //     this.setState({ timer: 60 })
        //     this.otpInput.clear();
        // });
        // this.interval = setInterval(
        //     () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
        //     1000
        // );
    }

    componentDidUpdate() {
        // this.checkTimerInterval = setInterval(() => {
        //     console.log("ttt", this.state.timer)
        // }, 1000)
        // if (this.state.timer === 1) {

        // }
        if (this.state.timer === 1) {
            clearInterval(this.interval);
            console.log("ttt", this.state.timer)
            // this.props.navigation.goBack()
        }
    }

    // componentDidMount() {
    //     RNOtpVerify.getOtp()
    //         .then(p => RNOtpVerify.addListener(this.otpHandler))
    //         .catch(p => console.log(p));
    // }

    // otpHandler = (message) => {
    //     console.log('SMS :: ', message)
    // }

    // onChangeText = (value) => {
    //     this.setState({
    //         text: value
    //     })
    // }

    componentWillUnmount() {
        setInterval(() => {
            // this.startListeningForOtp();
        }, 2000)
        // RNOtpVerify.removeListener();
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
        clearInterval(this.interval);
    }

    onBackButtonPressed() {
        this.props.navigation.navigate('Setting')
        return true;
    }



    constructor(props) {
        super(props);
        // console.log('ss', props)
        this.mobileNumber = SyncStorage.get('mobileNumber');
        this.userId = SyncStorage.get('userId')
    }

    showToast(message, time) {
        if (Platform.OS === 'android') {
            ToastAndroid.showWithGravityAndOffset(
                message, time,
                ToastAndroid.TOP,
                25,
                50
            );
        } else {
            // AlertIOS.alert("error");
        }
    }

    VerifyOTP = () => {
        payload = {
            "mobileNumber": Number(this.mobileNumber),
            "otp": Number(this.otp),
            "userId": SyncStorage.get('userId')
        }
        console.log('payload', payload)
        this.setState({ isOtpResent: false })
        fetch(Config.baseUrl + 'user/verify/otp', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "payload": {
                    "mobileNumber": Number(this.mobileNumber),
                    "otp": Number(this.otp),
                    "userId": SyncStorage.get('userId')
                }
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("responseJson", responseJson);
                if (responseJson.status == true) {
                    SyncStorage.set('verified', responseJson.success.data.verified);


                    APIKit.showCommonToast(responseJson.success.message, 3000, 'success');
                    clearInterval(this.interval);
                    if (responseJson.success.data.accessToken) {
                        SyncStorage.set('accessToken', responseJson.success.data.accessToken);
                        const storeData = async (responseJson) => {
                            try {
                                await AsyncStorage.setItem('accessToken', responseJson.success.data.accessToken)
                                Config.userAuthToken = responseJson.success.data.accessToken;
                                console.log("Cressss", Config.userAuthToken)
                            } catch (e) {
                            }
                        }
                        this.props.navigation.navigate('Home')
                    } else {
                        this.props.navigation.navigate('Register')
                    }


                } else {
                    if (responseJson.error.code == 'OTP_DID_NOT_MATCH') {
                        APIKit.showCommonToast('OTP did not match', 3000, 'error');
                        this.setState({ isOtpWrong: true })
                    }
                }

            })
            .catch((error) => {
                console.error("errorerror", error);
            });
    };



    resendOTP = () => {
        let payload = {
            "mobileNumber": Number(SyncStorage.get('mobileNumber')),
            "userId": SyncStorage.get('userId')
        }
        console.log("sss", payload)
        fetch(Config.baseUrl + 'user/resend/otp', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "payload": {
                    "mobileNumber": Number(SyncStorage.get('mobileNumber')),
                    "userId": SyncStorage.get('userId')
                }
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("responseJson", responseJson);
                if (responseJson.status == true) {
                    APIKit.showCommonToast('"OTP Resend Successfully!"', 3000, 'success');
                    this.setState({ isOtpResent: true })
                    console.log('userId', responseJson.success.data.userId)
                    this.setState({ timer: 60 });
                    this.otpInput.clear();
                    this.props.navigation.navigate('MobileVerify')
                    this.interval = setInterval(
                        () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
                        1000
                    );
                }
            })
            .catch((error) => {
                console.error("errorerror", error);
            });
    };

    login() {
        this.props.navigation.navigate('Register')
    }

    ShowMaxAlert = (EnteredValue) => {
        if (EnteredValue < 1) {
            this.setState({ number: EnteredValue });
        } else {
            alert('Maximum number');
        }
    };

    clearText = () => {
        this.otpInput.clear();
    }

    setText = () => {
        this.otpInput.setValue("1234");
    }

    handleDisableEnable(value) {
        // this.otpInput = value;

        console.log("value", value)
        if (value.length == 4) {
            this.otp = value;
            this.setState({ Isbuttondisable: false })
        }
        else {
            this.setState({ isOtpWrong: false })
            this.setState({ Isbuttondisable: true })
        }
    }

    focusedInput = () => {
        if (Platform.OS === 'ios') {
            this.setState({ buttonMargin: 300 })
        }
    }

    blurredInput = () => {
        this.setState({ buttonMargin: 0 })
    }
    render() {
        // console.log(this.props.navigation.state.params.mobileNumber)
        const CS = Config.style;
        const footer = (
            <Footer>
                <Pressable
                    style={[CS.greenBtn, { marginBottom: this.state.buttonMargin }, this.state.Isbuttondisable ? { opacity: 0.5 } : { opacity: 1 }]}
                    onPress={() => this.VerifyOTP()}
                    disabled={this.state.Isbuttondisable}
                    activeOpacity={0.5}
                    activeOpacity={this.state.Isbuttondisable ? 0.7 : 1}>
                    <Row>
                        <Col><Text style={[CS.boldText, CS.Col, CS.whiteText]}>Send OTP</Text></Col>
                        {/* <Col style={{ paddingLeft: 5 }}><Image source={AppImages.whiteArrow} style={{ width: 22, height: 18 }} />
                        </Col> */}
                    </Row>
                    {/* <Text style={[CS.boldText, CS.whiteText, CS.MR12]}>Verify  <Image source={AppImages.whiteArrow} style={{ width: 22, height: 18 }} style={{ paddingLeft: 25 }} /></Text> */}
                </Pressable>
            </Footer>
        );
        return (

            <Wrapper style={{ marginTop }} footer={footer}>

                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <Header style={styles.headerBox}>
                    <Left>
                        <Pressable onPress={() => this.props.navigation.navigate('Setting')} >
                            <Image source={AppImages.backBlack} style={{ width: 33, height: 33 }} />
                        </Pressable>
                    </Left>
                </Header>

                <Container>

                    <Space height={60} />
                    <Row>
                        <Col sm={10} >
                            <Text style={[CS.font20, CS.FW500, { color: '#333333' }]}>Please enter your new Email Address</Text>
                        </Col>
                        <Col sm={12}>
                            <TextInput placeholder={'example@gmail.com'} onFocus={this.focusedInput}
                                onBlur={this.blurredInput} returnKeyType='done' onChangeText={text => this.setState({ nickName: text })} placeholderStyle={{ fontWeight: '500', fontFamily: 'Ubuntu-Regular', fontSize: 12 }} placeholderTextColor={'#999999'} style={[CS.MT18, CS.formInput]} textBreakStrategy={'simple'} />
                            {this.state.emailValid ? (<Text style={styles.errorText}>Email id is required and should be in correct format</Text>) : null}
                        </Col>
                    </Row>
                </Container>

            </Wrapper>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        width: 300,
        height: 55,
        marginVertical: 20,
        borderColor: 'red',
        borderWidth: 1,
    },
    headerBox: {
        paddingTop: 5
    },
    otpContainerStyle: {
        borderColor: '#442B7E',
        borderRadius: 5,
        width: '20%',
        height: 70,
        borderWidth: 3,
        marginTop: 20
    },
    form: {
        width: '75%',
        maxWidth: 400,
        minWidth: 200,
        alignSelf: 'center'
    },
    field: {
        marginTop: 25
    },
    labelWrapper: {
        flexDirection: 'row'
    },
    labelIconWrapper: {
        width: 23
    },
    labelText: {
        color: '#a7a6b4',
        fontSize: 13.5
    },
    labelIcon: {

    },

});