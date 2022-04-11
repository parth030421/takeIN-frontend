import React from 'react';
import {
    View,
    StyleSheet, Pressable,
    PressableOpacity, StatusBar, TouchableOpacity, TextInput, Keyboard,
    Text, Image, ToastAndroid, Dimensions
} from 'react-native';

import { Footer, Button, Wrapper, Header, Left, Right, Row, Col, H4, Container, Space, H3, LabelIconInput, P } from '../components/componentIndex';
const marginTop = Platform.OS === 'ios' ? 0 : 0;
import SyncStorage from 'sync-storage';
import Icon from "react-native-vector-icons/Ionicons";
import Config from '../Config';
import { AppImages } from '../res';
import APIKit from '../APIKit';
export default class Register extends React.Component {
    userId;
    inputs = {};
    state = {
        password: '',
        emailValid: false,
        emailFocus: false,
        Isbuttondisable: true,
        isShowKeyboard: false
    }

    constructor(props) {
        super(props);
        this.userId = SyncStorage.get('userId')
        // setInterval(() => {
        //     if (this.state.firstName != '') {
        //         console.log("111")
        //         // this.setState({ Isbuttondisable: true });
        //     } else {
        //         console.log("222")
        //         // if (!this.state.emailValid) {
        //         //     this.setState({ Isbuttondisable: true });
        //         // } else {
        //         //     this.setState({ Isbuttondisable: false });
        //         // }
        //     }
        // }, 1000)
    }

    validateLogin() { }

    showToast(message, time) {
        if (Platform.OS === 'android') {
            ToastAndroid.showWithGravityAndOffset(
                message, time,
                ToastAndroid.TOP,
                25,
                50
            );
        } else {
            AlertIOS.alert("error");
        }
    }

    register() {
        console.log(SyncStorage.get('userId'))
        fetch(Config.baseUrl + 'user/sign-up', {
            method: 'POST',
            headers: APIKit.CommonHeaders,
            body: JSON.stringify({
                "payload": {
                    "firstName": this.state.firstName,
                    "lastName": this.state.lastName,
                    "email": this.state.email,
                    "referralCode": this.state.Referralcode,
                    "userId": SyncStorage.get('userId')
                }
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.status == true) {
                    // this.showToast(responseJson.success.message, 7000)
                    SyncStorage.set('accessToken', responseJson.success.data.accessToken)

                    Config.accessToken = responseJson.success.data.accessToken;
                    this.props.navigation.navigate('Home');

                }
            })
            .catch((error) => {
                console.error("errorerror", error);
            });
        // this.props.navigation.navigate('FoodPrefered');
    }

    validate(text) {
        this.setState({ email: text });
        if (text != '') {
            if (this.validateEmail(text)) {
                this.setState({ emailValid: false });
            }
            else {
                this.setState({ emailValid: true });
            }
        } else {
            this.setState({ emailValid: true });
        }

    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    Isbuttondisable() {
        if (this.validateEmail(this.state.email)) {
            if ((this.state.firstName && this.state.firstName !== '') && (this.state.lastName && this.state.lastName !== '')) {
                return false
            } else {
                return true
            }
        } else {
            return true
        }
    }

    restrictFName(event) {

        this.setState({ firstName: event.replace(/[^a-zA-Z]+/g, '') })

    }


    render() {
        const CS = Config.style;
        const footer = (
            <Footer>
                <Row size={12}>
                    <Col sm={12}>
                        <P>By singing up you are ready to accept the <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>privacy policy</Text> & <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>terms & conditions</Text></P>
                    </Col>
                    <Col sm={12}>
                        <Pressable
                            activeOpacity={0.5}
                            onPress={() => this.register()}
                            style={[Config.style.greenBtn, CS.Col, this.Isbuttondisable() ? { opacity: 0.5 } : { opacity: 1 }]} disabled={this.Isbuttondisable()}
                        >
                            <Row>
                                <Col><Text style={[CS.boldText, CS.Col, CS.whiteText]}>Sign Up</Text></Col>
                                <Col style={{ paddingLeft: 5 }}><Image source={AppImages.whiteArrow} style={{ width: 22, height: 18 }} />
                                </Col>
                            </Row>
                        </Pressable>
                    </Col>
                    <Col sm={12} Hidden={this.state.isShowKeyboard}>
                        <Text style={[CS.font14, CS.FW400, CS.FontLight, { color: '#333333', textAlign: 'center' }]}>By creating passcode you agree with our</Text>
                    </Col>
                    <Col sm={12} Hidden={this.state.isShowKeyboard}>
                        <Text style={[CS.font14, CS.FW400, CS.FontLight, { paddingBottom: 10, color: '#333333', textAlign: 'center' }]}> Terms & Conditions and Privacy Policy</Text>
                    </Col>
                </Row>
            </Footer>
        );
        return (

            <Wrapper style={[{ backgroundColor: '#442B7E' }]} footer={footer}>
                <StatusBar backgroundColor="#442B7E" barStyle="light-content" />
                <Container style={{ backgroundColor: '#442B7E', padding: 0, margin: 0 }}>
                    <Row>
                        <Col sm={2}>
                            <Left>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')} style={[CS.iconBtn, CS.MT10]}>
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

                    <View style={[CS.form, { margin: 0, marginLeft: -15, marginTop: -10, borderRadius: 17, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: 10, paddingTop: 8, backgroundColor: '#ffffff', width: Dimensions.get('window').width }]} >
                        <H3 style={{ color: '#442B7E' }}>Complete your Info</H3>
                        <View style={Config.style.form}>
                            <Row size={12}>
                                <Col sm={6}><Text style={[CS.font14, CS.MT10, CS.FW500, CS.FontMedium]}>First name</Text></Col>
                                <Col sm={6}><Text style={[CS.font14, CS.MT10, CS.FW500, CS.FontMedium]}>Last name</Text></Col>
                                <Col sm={6}>
                                    <TextInput placeholder={'First name'} returnKeyType='done'
                                        onBlur={() => this.setState({ isShowKeyboard: false })}
                                        onFocus={() => this.setState({ isShowKeyboard: true })}
                                        onChangeText={text => this.setState({ firstName: text.replace(/[^a-zA-Z]+/g, '') })} style={[CS.MT10, styles.formInput, this.state.firstName == '' ? styles.formInputErr : null, { marginRight: 10 }]} placeholderStyle={CS.font16} placeholderTextColor={'#999999'} textBreakStrategy={'simple'} />
                                </Col>
                                <Col sm={6}>
                                    <TextInput placeholder={'Last name'} returnKeyType='done'
                                        onBlur={() => this.setState({ isShowKeyboard: false })}
                                        onFocus={() => this.setState({ isShowKeyboard: true })}
                                        onChangeText={text => this.setState({ lastName: text.replace(/[^a-zA-Z]+/g, '') })} placeholderStyle={CS.font16} placeholderTextColor={'#999999'} style={[CS.MT10, styles.formInput, this.state.lastName == '' ? styles.formInputErr : null]} textBreakStrategy={'simple'} />
                                </Col>

                                <Col sm={6}><Text style={styles.errorText}>{this.state.firstName == '' ? ('First name is required') : null}</Text></Col>
                                <Col sm={6}><Text style={styles.errorText}>{this.state.lastName == '' ? ('Last name is required') : null}</Text></Col>
                                
                                <Col sm={12}><Text style={[CS.font14, CS.MT18, CS.FW500, , CS.FontMedium]}>Email</Text></Col>
                                <Col sm={12}>
                                    <TextInput placeholder={'Enter your email'} returnKeyType='done'
                                        onBlur={() => this.setState({ isShowKeyboard: false, emailFocus: true })}
                                        onFocus={() => this.setState({ isShowKeyboard: true })}
                                        onChangeText={text => this.validate(text)} placeholderStyle={CS.font16} placeholderTextColor={'#999999'} style={[CS.MT10, styles.formInput, this.state.emailValid && this.state.emailFocus ? styles.formInputErr : null]} textBreakStrategy={'simple'} />
                                </Col>
                                <Text style={styles.errorText}>{this.state.emailValid && this.state.emailFocus ? ('Email id is required and should be valid') : null}</Text>
                                <Col sm={12}><Text style={[CS.font14, CS.MT18, CS.FW500, , CS.FontMedium]}>Referral code<Text style={[{ color: '#CED6E0' }]}>(Optional)</Text></Text></Col>
                                <Col sm={12}>
                                    <TextInput placeholder={'Referral code'} returnKeyType='done'
                                        onBlur={() => this.setState({ isShowKeyboard: false })}
                                        onFocus={() => this.setState({ isShowKeyboard: true })}
                                        onChangeText={text => this.setState({ Referralcode: text })} placeholderTextColor={'#999999'} placeholderStyle={[CS.FontMedium, CS.font14]} style={[CS.MT10, styles.formInput]} textBreakStrategy={'simple'} />
                                </Col>
                            </Row>
                            <Space />
                        </View>
                    </View>
                </Container>

            </Wrapper>


        );
    }
}

const styles = StyleSheet.create({
    headerBox: {
        paddingTop: 5
    },
    errorText: {
        color: '#C6345C',
        marginTop: 6,
        marginBottom: 15,
        fontWeight: '400',
        fontFamily: 'Ubuntu-Regular'
    },
    formInput: {
        fontWeight: "bold",
        fontSize: 14,
        height: 44,
        paddingLeft: 15,
        paddingRight: 3,
        paddingTop: 6,
        paddingBottom: 6,
        borderWidth: 2,
        borderRadius: 5,
        fontWeight: '400',
        borderColor: '#CED6E0',
        alignSelf: 'stretch',
    },
    formInputErr: {
        borderColor: '#C6345C'
    }
});