// import React from 'react';
import React from 'react';
import {
    View,
    StyleSheet, Pressable,
    PressableOpacity, StatusBar, BackHandler, Clipboard,
    Text, Image, ToastAndroid, Keyboard, Dimensions, TouchableOpacity
} from 'react-native';

import { Footer, Button, Wrapper, Header, Left, Row, Col, Container, Space, Right, H3, OTPTextInput, VirtualKeyboard, P } from '../components/componentIndex';
const marginTop = Platform.OS === 'ios' ? 0 : 0;
import Icon from "react-native-vector-icons/FontAwesome";
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
// import OTPInputView from '@twotalltotems/react-native-otp-input'
export default class MobileVerify extends React.Component {
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
        buttonMargin: 0,
        code: '',
        clearOTP: false
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
        console.log(message)
        if (message != null) {
            const otp = /(\d{4})/g.exec(message)[1];
            // console.log("fhghgjhj", otp)
            this.onChanged(otp)
            this.setState({ code: otp })
            // this.handleDisableEnable(otp)
            // this.otpInput.setValue(otp)
            RNOtpVerify.removeListener();
            // Keyboard.dismiss();
        }

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
        Clipboard.setString('')
        this.clipboardInterval = setInterval(() => {
            this.fetchCopiedText()
        }, 1000)
        if (Platform.OS != 'ios') {
            RNOtpVerify.getHash()
                .then(console.log) //05/neZS12E+
                .catch(console.log);
            RNOtpVerify.getOtp()
                .then(p => RNOtpVerify.addListener(this.otpHandler))
                .catch(p => console.log(p));
            // this.otpInput.clear();
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
        }

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.setState({ countryCode: SyncStorage.get('countryCode') + SyncStorage.get('mobileNumber') })
            this.mobileNumber = SyncStorage.get('mobileNumber');
            this.userId = SyncStorage.get('userId')
            console.log("focus", this.state.countryCode)
            this.setState({ timer: 60 })
            this.otpInput.clear();
        });
        this.interval = setInterval(
            () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
            1000
        );
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

    componentWillUnmount() {
        setInterval(() => {
            // this.startListeningForOtp();
        }, 2000)
        // RNOtpVerify.removeListener();
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
        clearInterval(this.interval);
    }

    onBackButtonPressed() {
        this.props.navigation.navigate('Home')
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
        console.log("OTP", this.otp);
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
                                await AsyncStorage.setItem('userId', responseJson.success.data.userId)
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
                        this.setState({ clearOTP: true })
                        this.setState({ isOtpWrong: true })
                        this.setState({ Isbuttondisable: false })
                    }
                    if (responseJson.error.code == 'OTP_EXPIRED') {
                        APIKit.showCommonToast('OTP EXPIRED', 3000, 'success');
                        this.props.navigation.navigate('Login')
                    }
                }

            })
            .catch((error) => {
                console.error("errorerror", error);
            });
    };

    resendOTP = () => {
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

                    // this.otpInput.clear();
                    this.props.navigation.navigate('MobileVerify');
                    this.setState({ timer: 60 });
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

    onChanged(newText) {
        console.log("cccccc", newText)
        this.setState({ clearOTP: false })
        this.setState({ code: newText });
        if (newText.length == 4) {
            this.otp = newText
            this.VerifyOTP()
        }

    }
    render() {
        // console.log(this.props.navigation.state.params.mobileNumber)
        const CS = Config.style;
        const footer = (
            <Footer style={{ marginBottom: -60 }}>
                <Row size={12}>
                    <Col sm={12} Hidden={this.state.timer == 1}>
                        <Text style={[CS.font14, CS.FW400, CS.FontRegular, { color: '#333333', textAlign: 'center' }]}>Resend code in 00:{this.state.timer < 10 ? (0) : null}{this.state.timer}</Text>
                    </Col>
                    <Col sm={12}>
                        <Pressable
                            style={[CS.greenBtn, { marginBottom: this.state.buttonMargin }, this.state.timer > 1 ? { opacity: 0.5 } : { opacity: 1 }]}
                            onPress={() => this.resendOTP()}
                            disabled={this.state.timer > 1}
                            activeOpacity={0.5}
                            activeOpacity={this.state.timer > 1 ? 0.7 : 1}>
                            <Row>
                                <Col><Text style={[CS.boldText, CS.Col, CS.whiteText]}>Resend Code</Text></Col>
                            </Row>
                        </Pressable>
                    </Col>
                    <Col sm={12}>
                        <Text style={[CS.font14, CS.FW400, CS.FontRegular, { paddingTop: 10, color: '#707070', textAlign: 'center' }]}>By creating passcode you agree with our</Text>
                    </Col>
                    <Col sm={12}>
                        <Text style={[CS.font14, CS.FW400, CS.FontMedium, { paddingBottom: 10, color: '#442B7E', textAlign: 'center' }]}> Terms & Conditions
                            <Text style={[CS.font14, CS.FW400, CS.FontRegular, { paddingTop: 10, color: '#707070', textAlign: 'center' }]}> and</Text> Privacy Policy</Text>
                    </Col>
                </Row>
            </Footer>
        );
        return (

            <Wrapper style={[{
                backgroundColor: '#442B7E', borderBottomWidth: 60,
                borderBottomColor: "#ffffff"
            }]} footer={footer}>

                <StatusBar backgroundColor="#442B7E" barStyle="light-content" />
                <Container style={{ backgroundColor: '#442B7E', padding: 0, margin: 0 }}>
                    <Row>
                        <Col sm={2}>
                            <Left>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={[CS.iconBtn, CS.MT10]}>
                                    <Image source={AppImages.backWhite} style={{ width: 11, height: 21 }} />
                                </TouchableOpacity>
                            </Left>
                        </Col>
                        <Col sm={10}>
                            <Right style={{ padding: 0, margin: 0 }}>
                                <Image source={AppImages.loginBG} style={{ width: 180, height: 140, marginLeft: 0, marginRight: -15 }} />
                            </Right>
                        </Col>
                    </Row>
                    <View style={[{ margin: 0, marginLeft: -15, marginTop: -10, borderRadius: 17, padding: 38, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, backgroundColor: '#ffffff', width: Dimensions.get('window').width }]} >
                        <Text style={[CS.font26, CS.FW500, CS.FontMedium]}>Enter code sent</Text>
                        <Text style={[CS.font26, CS.FW500, CS.FontMedium]}>to your phone</Text>
                        <Space height={20} />
                        {this.state.isOtpWrong ? (<Text style={{ color: '#C6345C' }}>Wrong code please re-enter the code</Text>) :
                            <Text style={[{ color: '#999999' }, CS.font15, CS.FW400, CS.FontRegular]}>we sent it to the number <Text style={[{ color: '#000000' }]}>{APIKit.mobileNumber}</Text></Text>}

                        <Space height={40} />
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name={this.state.code.length >= 1 ? 'circle' : 'circle-thin'} color={'#333333'} size={15} style={{ paddingHorizontal: 5 }}></Icon>
                            <Icon name={this.state.code.length >= 2 ? 'circle' : 'circle-thin'} color={'#333333'} size={15} style={{ paddingHorizontal: 5 }}></Icon>
                            <Icon name={this.state.code.length >= 3 ? 'circle' : 'circle-thin'} color={'#333333'} size={15} style={{ paddingHorizontal: 5 }}></Icon>
                            <Icon name={this.state.code.length >= 4 ? 'circle' : 'circle-thin'} color={'#333333'} size={15} style={{ paddingHorizontal: 5 }}></Icon>
                        </View>
                        <Space height={5} />
                        <VirtualKeyboard maxLength={4} isClear={this.state.clearOTP} onPress={(val) => { this.onChanged(val) }}></VirtualKeyboard>
                    </View>
                </Container>
            </Wrapper>

        );
    }
}

const styles = StyleSheet.create({
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
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
        width: Dimensions.get('window').width / 4 - 17,
        borderWidth: 3,
        marginTop: 20,
        marginRight: 12,
        fontSize: 28
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