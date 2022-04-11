import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar, Pressable, Image, BackHandler,
    Text, ToastAndroid, TextInput, Platform, Dimensions, Modal
} from 'react-native';
// import { BackAndroid } from 'react-native'
import SyncStorage from 'sync-storage';
import Config from '../Config';
import Icon from "react-native-vector-icons/Ionicons";
import { Footer, Button, Wrapper, Header, Left, Right, H4, ScrollViewIndicator, Container, Space, Row, Col, H3, LabelIconInput, VirtualKeyboard, P, SelectPhoneCode } from '../components/componentIndex';

import APIKit from '../APIKit';
import { AppImages } from '../res';
import AsyncStorage from '@react-native-async-storage/async-storage';
const marginTop = Platform.OS === 'ios' ? 0 : 0;
export default class Login extends React.Component {
    inputs = {};
    state = {
        mobile: 'Enter Number',
        Isbuttondisable: true,
        selectedCode: null,
        buttonMargin: 0,
        text: '',
        myNumber: 'Enter Number',
        countryCode: "1111",
        islogin: false,
        numberTextColor: '#999999'
    }
    countryCode = '+966'
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


    constructor(props) {
        super(props);
        console.log("pppppp", props.token)

        // console.log("kkkk", Config.userAuthToken)
        //         Config.userAuthToken = value
    }

    componentDidMount = async () => {

    }
    login = () => {
        fetch(Config.baseUrl + 'user/send/otp', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "payload": {
                    "mobileNumber": Number(this.state.mobileNumber),
                    "countryCode": this.countryCode
                }
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("responseJson", responseJson);
                if (responseJson.status == true) {
                    const storeData = async (responseJson) => {
                        try {
                            await AsyncStorage.setItem('userId', responseJson.success.data.userId)
                        } catch (e) {
                        }
                    }

                    SyncStorage.set('userId', responseJson.success.data.userId);
                    APIKit.mobileNumber = this.countryCode + ' ' + this.state.mobileNumber
                    SyncStorage.set('countryCode', this.countryCode)
                    APIKit.showCommonToast('OTP SENT SUCCESSFULLY', 3000, 'success');
                    console.log('userId', responseJson.success.data.userId)
                    this.props.navigation.navigate('MobileVerify')
                } else {
                    if (responseJson.error.code === 'USER_ALREADY_EXISTS') {
                        APIKit.showCommonToast('USER ALREADY EXISTS', 3000, 'info');
                    }
                }
            })
            .catch((error) => {
                console.error("errorerror", error);
            });
    };

    handledisableenable(value) {
        let inputValue = value.mobile.match(/^(\+|\d)[0-9]{7,16}$/)
        // let inputValue2 = 2
        if (inputValue === null) {
            this.setState({ Isbuttondisable: true })
        }
        else {
            this.setState({ Isbuttondisable: false })
            this.setState({ mobileNumber: value.mobile })
            SyncStorage.set('mobileNumber', value.mobile);


        }
    }

    isNumeric(value) {
        return /^-?\d+$/.test(value);
    }

    onChanged(text) {
        let newText = '';
        let numbers = '0123456789';
        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                // alert("please enter numbers only");
            }
        }
        this.setState({ myNumber: newText });
        let inputValue = text.match(/^(\+|\d)[0-9]{7,16}$/)
        // let inputValue2 = 2
        if (inputValue === null) {
            this.setState({ Isbuttondisable: true })
        }
        else {
            this.setState({ Isbuttondisable: false })

            this.setState({ mobileNumber: text })
            SyncStorage.set('mobileNumber', text);
        }
        if (text.length == 0) {
            this.setState({ myNumber: 'Enter Number' })
            this.setState({ numberTextColor: '#999999' })
        } else {
            this.setState({ numberTextColor: '#333333' })
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

    handleCallback = (childData) => { this.countryCode = childData.dial_code; this.setState({ countryCode: childData.dial_code }); console.log("ll", this.countryCode.length); }
    changeText(newText) {
        this.setState({ myNumber: newText });
    }
    render() {
        // const [value, setValue] = useState("");
        // const [valid, setValid] = useState(false);
        // const [showMessage, setShowMessage] = useState(false);
        // const phoneInput = useRef < PhoneInput > (null);

        const CS = Config.style;
        const footer = (
            <Footer style={{ marginBottom: -60 }}>
                <Row size={12}>
                    <Col sm={12}>
                        <Pressable
                            style={[CS.greenBtn, { marginBottom: this.state.buttonMargin }, this.state.Isbuttondisable ? { opacity: 0.5 } : { opacity: 1 }]}
                            onPress={() => this.login()}
                            disabled={this.state.Isbuttondisable}
                            activeOpacity={0.5}
                            activeOpacity={this.state.Isbuttondisable ? 0.7 : 1}>
                            <Row>
                                <Col><Text style={[CS.boldText, CS.Col, CS.whiteText]}>Next</Text></Col>
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
            // loginBG

            <Wrapper style={[{
                backgroundColor: '#442B7E', borderBottomWidth: 60,
                borderBottomColor: "#ffffff"
            }]} footer={footer}>

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
                    <View style={[{ margin: 0, marginLeft: -15, marginTop: -10, borderRadius: 17, padding: 20, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, backgroundColor: '#ffffff', width: Dimensions.get('window').width }]} >
                        <View style={[{ padding: 10, paddingBottom: 0 }]}>
                            <Text style={[CS.font26, CS.FW500]}>Enter your</Text>
                            <Text style={[CS.font26, CS.FW500]}>mobile number.</Text>
                            <Space height={20} />
                            <Text style={[CS.font15, CS.FontRegular, CS.FW400, { color: '#999999' }]}>We will send you a confirmation code</Text>
                        </View>
                        <Space height={40} />
                        <Row style={[CS.Col, { height: 32 }]}>
                            <Col>
                                <SelectPhoneCode parentCallback={this.handleCallback}></SelectPhoneCode></Col>
                            <Col style={[]}>
                                <Text style={[CS.font28, CS.FW400, CS.FontRegular, { marginLeft: 5, color: this.state.numberTextColor }]}>{this.state.myNumber}</Text>
                            </Col>
                        </Row>

                        <Space height={20} />
                        <VirtualKeyboard maxLength={10} onPress={(val) => { this.onChanged(val) }}></VirtualKeyboard>
                    </View>
                </Container>



                <Modal
                    animationType="none"
                    transparent={true}
                    visible={false}
                    onRequestClose={() => {
                        this.setMenuVisible(false)
                    }}>
                    <View style={CS.blurBGView}>
                        <View style={[CS.modalView, { width: 284, height: 384, marginBottom: 150, borderRadius: 10, padding: 0, paddingTop: 0, paddingBottom: 0, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }]}>
                            <ScrollViewIndicator shouldIndicatorHide={false}
                                scrollIndicatorStyle={{ backgroundColor: '#5CAC7D', width: 12, opacity: 1, borderRadius: 10, marginLeft: -2 }}
                                scrollIndicatorContainerStyle={{ backgroundColor: '#F4F4F4', width: 16, marginVertical: 5 }}>
                                <Row Hidden={this.categoryList?.length == 0} style={{ marginRight: 22, marginLeft: 15, paddingTop: 10, paddingRight: 5 }}>
                                    {/* {this.categoryList.map((list) => ( */}
                                    <Pressable>
                                        <Row>
                                            <Col sm={12}>
                                                <Pressable onPress={() => this.selectMenu('Soups')}>
                                                    <Text style={[CS.font16, this.state.selectedMenu == 'Soups' ? [CS.greenText, CS.FontBold] : [CS.FontRegular, CS.FW400]]}>Soups</Text>
                                                </Pressable>
                                            </Col>
                                            <Col sm={12} style={Config.style.listDivider}></Col>
                                            <Col sm={12}>
                                                <Pressable onPress={() => this.selectMenu('Appetizers')}>
                                                    <Text style={[CS.font16, this.state.selectedMenu == 'Appetizers' ? [CS.greenText, CS.FontBold] : [CS.FontRegular, CS.FW400]]}>Appetizers</Text>
                                                </Pressable>
                                            </Col>
                                            <Col sm={12} style={Config.style.listDivider}></Col>
                                            <Col sm={12}>
                                                <Pressable onPress={() => this.selectMenu('WestrenMeals')}>
                                                    <Text style={[CS.font16, this.state.selectedMenu == 'WestrenMeals' ? [CS.greenText, CS.FontBold] : [CS.FontRegular, CS.FW400]]}>Westren Meals</Text>
                                                </Pressable>
                                            </Col>
                                            <Col sm={12} style={Config.style.listDivider}></Col>
                                            <Col sm={12}>
                                                <Pressable onPress={() => this.selectMenu('WestrenSandwiches')}>
                                                    <Text style={[CS.font16, this.state.selectedMenu == 'WestrenSandwiches' ? [CS.greenText, CS.FontBold] : [CS.FontRegular, CS.FW400]]}>Westren Sandwiches</Text>
                                                </Pressable>
                                            </Col>

                                        </Row>

                                    </Pressable>
                                    {/* ))} */}
                                </Row>
                            </ScrollViewIndicator>


                        </View>

                    </View>
                </Modal>

            </Wrapper >

        );
    }
}

const styles = StyleSheet.create({
    flagSelect: {
        position: 'absolute',
        top: 29,
        left: 15,
        borderRightColor: '#cccccc',
        borderRightWidth: 1,
        paddingRight: 15,
    },
    NumberInput: {
        marginTop: 0,
        height: 32,
        fontSize: 30,
        width: '100%',
        zIndex: 10,
        marginLeft: 5,
        paddingLeft: 3,
        width: 220,
        marginTop: 10
        // borderWidth:0
    },
    inputContainer: {
        // borderWidth: 2,
        // borderColor: '#CCCCCC',
        height: 48,
        borderRadius: 10,
        marginTop: 6,
    }
});