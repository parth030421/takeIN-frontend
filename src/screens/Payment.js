import React from 'react';
import {
    View,
    StatusBar, Pressable, SafeAreaView, Modal, BackHandler,
    Text, Image, StyleSheet, TouchableHighlight, TextInput, KeyboardAvoidingView, Dimensions
} from 'react-native';
import { Footer, Header, Row, Col, MenuButton, Wrapper, Right, Left, RadioButton, ContentLoader, AddAddress, CustomSwipeable } from '../components/componentIndex';
import Icon from "react-native-vector-icons/Ionicons";
const marginTop = Platform.OS === 'ios' ? 0 : 0;
import Config from '../Config';
import { AppImages } from '../res';
import APIKit from '../APIKit';
// import { WebView } from 'react-native-webview';
// import { SwipeListView } from 'react-native-swipe-list-view';
import axios from 'axios';
import RNReactNativePayfortSdk from '../res/SDK/react-native-payfort-sdk';
import {
    getPayFortDeviceId,
    RNPayFort,
} from "../res/SDK/@logisticinfotech/react-native-payfort-sdk/PayFortSDK/PayFortSDK";
const keyboardVerticalOffset = Platform.OS === 'ios' ? -20 : -350
export default class Payment extends React.Component {
    state = {
        isSwiping: false,
        deletePopupVisible: false,
        lastRefresh: Date(Date.now()).toString(),
        showLoader: 1,
        showPaymentModalVisible: false,
        addCardVisible: false,
        savedAddressList: [{ _id: AppImages.Card2 }, { _id: AppImages.Card3 }]
    };
    updateAddressInterwal;
    reference;
    constructor(props) {
        super(props);
    }
    onAndroidBackPress = () => {
        this.props.navigation.navigate('Setting')
        return true;
    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
    }

    componentWillUnmount() {
        clearInterval(this.updateAddressInterval)
        BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    }

    cancle() {
        this.setModalVisible(false);
        this.setState({ isSelectable: false })
    }
    setModalVisible = (visible) => {
        APIKit.getAddress();
        this.setState({ deletePopupVisible: visible });
    }

    deleteItems() {
        // this.setState({ isSwiping: false })
        fetch(Config.baseUrl + 'user/address/' + this.state.deletedItemId, {
            method: 'DELETE',
            headers: APIKit.CommonHeaders,
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("deleteItems", responseJson)
                APIKit.getAddress();
                this.setState({ savedAddressList: APIKit.savedAddressList })
                this.setState({ deletePopupVisible: false })
            })
            .catch((error) => {
                console.error("deleteItemserror", error);
                this.setState({ deletePopupVisible: false })
                APIKit.getAddress();
                this.setState({ savedAddressList: APIKit.savedAddressList })
            });
    }

    onDefaultChange(id) {
        APIKit.setDefaultAddress(id);
        APIKit.getAddress();
        this.setState({ savedAddressList: APIKit.savedAddressList })
    }
    updateAddress(id) {
        APIKit.updateAddressId = id
    }

    setPaymentModalVisible(visible) {
        this.setState({ showPaymentModalVisible: visible });
    }


    pay() {
        let data = {};
        data['access_code'] = 'J6QvsQwYqnKooB8EpgqV';          // require field
        data['merchant_identify'] = '8b9c9a14';        // require field
        data['request_phrase'] = '51tCYlVh0Zh2pMc3.j8K6F-(';              // require field
        data['customer_email'] = 'v@example.com';       // require field
        data['currency'] = 'USD';                       // require field
        data['amount'] = '10';                          // require field
        data['merchant_reference'] = '12345446';          // require field
        data['customer_name'] = 'Glenn';
        data['customer_ip'] = '27.79.60.231';
        data['payment_option'] = 'VISA';
        data['order_description'] = 'Order for testing';

        RNReactNativePayfortSdk.open(data, (response) => {
            console.log(response);
        }, (message) => {
            // Message in case payment is failure or cancel
        });
    }

    getDeviceToken = async () => {
        getPayFortDeviceId().then(async (deviceId) => {
            await axios.post("https://sbpaymentservices.payfort.com/FortAPI/paymentApi", {
                deviceId: deviceId,
            })
                .then((response) => {
                    this.setState({ sdk_token: response.data.sdk_token }, () => {
                        this.onPay();
                    });
                })
                .catch((error) => {
                    console.log("getDeviceToken", error);
                });
        });
    };

    onPay = async () => {
        this.reference = Math.ceil(Math.random() * 10513)
        console.log("APIKit.payAmount ", APIKit.payAmount)
        await RNPayFort({
            command: "PURCHASE",
            access_code: "J6QvsQwYqnKooB8EpgqV",
            merchant_identifier: "8b9c9a14",
            sha_request_phrase: '51tCYlVh0Zh2pMc3.j8K6F-(',
            merchant_reference: this.reference,
            amount: APIKit.payAmount * 100,
            currencyType: "SAR",
            language: "en",
            email: "naishadh@logisticinfotech.co.in",
            testing: true,
            response_message: "Payfort payment",
            sdk_token: this.state.sdk_token,
        })
            .then((response) => {
                this.PlaceOrder();
                console.log("asasa", response);
            })
            .catch((error) => {
                APIKit.orderStatus = 'error'
                this.props.navigation.navigate('OrderStatus')
                console.log("onPay", error);
            });
    }

    PlaceOrder() {
        this.orderDetail = {
            "deliveryType": "Delivery",
            "payWith": "Cash"
        }
        fetch('https://d13j9g2ks667w2.cloudfront.net/api/v1/order', {
            method: 'POST',
            headers: APIKit.CommonHeaders,
            body: JSON.stringify({ "payload": this.orderDetail })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.status == true) {
                    APIKit.orderStatus = 'done'
                    this.props.navigation.navigate('OrderStatus')
                } else if (responseJson.error.status == false) {
                    APIKit.orderStatus = 'error'
                    this.props.navigation.navigate('OrderStatus')
                } else {
                    APIKit.orderStatus = 'error'
                    this.props.navigation.navigate('OrderStatus')
                }
            })
            .catch((error) => {
                console.error("PlaceOrderError", error);
            });
    }

    fixDateText(text) {
        if (text.length == 2 && this.state.date.length == 1) {
            text += '/'
        } else if (text.length == 2 && this.state.date.length == 3) {
            text = text.substring(0, text.length - 1)
        }
        this.setState({ date: text })
    }



    setCardVisible = (visible) => {
        this.setState({ addCardVisible: visible });
    }
    render() {
        // this.setState({ savedAddressList: APIKit.savedAddressList })
        const CS = Config.style;
        const footer = (
            <Footer style={CS.Col}>
                <Pressable onPress={() => this.setCardVisible(!this.state.addCardVisible)} style={[CS.Col, { width: 68, height: 68, borderRadius: 35, backgroundColor: "#5CAC7D" }]}>
                    <Text style={[{ color: '#fff', fontSize: 40 }]}>+</Text>
                </Pressable>
            </Footer>
        )
        return (

            <Wrapper footer={footer} style={{ marginTop }}>
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <SafeAreaView style={{ flex: 3, backgroundColor: '#FFFFFF' }} >

                    <Header>
                        <Left style={CS.imageIcon}>
                            <Pressable onPress={() => this.props.navigation.navigate('Setting')}>
                                <Image source={AppImages.backBlack} style={{ width: 33, height: 33, marginLeft: 0 }} />
                            </Pressable>
                        </Left>
                        <Text style={[CS.font16, CS.FW500, CS.MT10]}>Payment Method</Text>

                    </Header>
                    <View style={{ padding: 10, paddingTop: 0 }}>
                        <Text style={[CS.font14, CS.FW700, CS.FontBold]}>Saved Cards</Text>
                        {this.state.savedAddressList.map((list) => (
                            <View>
                                <CustomSwipeable rightButtonWidth={70} key={list._id}
                                    onSwipeRelease={() => this.state.isSwiping ? this.setState({ isSwiping: false }) : this.setState({ isSwiping: true })}
                                    rightButtons={[
                                        <Pressable style={{ paddingLeft: 10 }}>
                                            <Row>
                                                <Col style={CS.Col}>
                                                    <View style={[styles.rightSwipeBtn, { position: 'relative' }]}><Image source={AppImages.Edit} style={{ resizeMode: 'contain', width: 23, height: 23 }}></Image>
                                                    </View>
                                                </Col>
                                            </Row>
                                        </Pressable>

                                    ]}>

                                    <Pressable style={{ marginTop: 10 }}>
                                        <Row size={12}>
                                            <Col sm={12}>
                                                <Image source={list._id} style={[{ width: '100%', borderRadius: 7, height: 74 }, CS.Col]} />
                                            </Col>
                                        </Row>
                                    </Pressable>
                                </CustomSwipeable>
                            </View>
                        ))}
                    </View>

                    <Row Hidden={this.state.savedAddressList.length != 0} style={[styles.container2, styles.horizontal]} >
                        <Col sm={12} style={[CS.card, CS.col, { height: 130, marginBottom: 15 }]}>
                            <ContentLoader active avatar pRows={3} pWidth={['50%', '100%', '70%']} avatarStyles={{ borderRadius: 3 }} title={false}></ContentLoader>
                        </Col>
                        <Col sm={12} style={[CS.card, CS.col, { height: 130, marginBottom: 15 }]}>
                            <ContentLoader active avatar pRows={3} pWidth={['50%', '100%', '70%']} avatarStyles={{ borderRadius: 3 }} title={false}></ContentLoader>
                        </Col>
                        <Col sm={12} style={[CS.card, CS.col, { height: 130, marginBottom: 15 }]}>
                            <ContentLoader active avatar pRows={3} pWidth={['50%', '100%', '70%']} avatarStyles={{ borderRadius: 3 }} title={false}></ContentLoader>
                        </Col>
                    </Row>
                    <View>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.addCardVisible}
                            onRequestClose={() => {
                                this.setCardVisible(!this.state.addCardVisible);
                            }}>
                            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset} style={[styles.paymentCenteredView]}>

                                <View style={[styles.paymentModalView, { padding: 20, height: 470 }]}>
                                    <Row size={12}>
                                        <Col sm={11}><Text style={[styles.modalText, Config.style.font18, Config.style.FW700]}>Enter card details</Text></Col>
                                        <Col sm={1}>
                                            <Pressable onPress={() => this.setCardVisible(!this.state.addCardVisible)}>
                                                <Icon name='close-sharp' size={30}></Icon>
                                            </Pressable></Col>
                                        <Col sm={12}><Text style={[CS.font14, CS.MT10, CS.FW500, { textAlign: 'left' }]}>Name on the card</Text></Col>
                                        <Col sm={12}>
                                            <TextInput placeholder={'Alaa Nabil Sallam'} returnKeyType='done' onChangeText={text => this.setState({ nickName: text })} placeholderStyle={{ fontWeight: '500', fontFamily: 'Ubuntu-Regular', fontSize: 12 }} placeholderTextColor={'#999999'} style={[CS.MT5, CS.formInput]} textBreakStrategy={'simple'} />
                                            {this.state.emailValid ? (<Text style={styles.errorText}>Email id is required and should be in correct format</Text>) : null}
                                        </Col>
                                        <Col sm={12}><Text style={[CS.font14, CS.MT10, CS.FW500, { textAlign: 'left' }]}>Credit Card Number</Text></Col>
                                        <Col sm={12}>
                                            <TextInput placeholder={'XXXX XXXX XXXX XXXX'} value={this.state.cardNumber} maxLength={16} returnKeyType='done' keyboardType='number-pad' placeholderStyle={{ fontWeight: '500', fontFamily: 'Ubuntu-Regular', fontSize: 12 }} placeholderTextColor={'#999999'} style={[CS.MT5, CS.formInput]} textBreakStrategy={'simple'} />
                                            {this.state.emailValid ? (<Text style={styles.errorText}>Email id is required and should be in correct format</Text>) : null}
                                        </Col>
                                        <Col sm={6} style={{ paddingRight: 5 }}><Text style={[CS.font14, CS.MT18, CS.FW500]}>Expiry Date</Text></Col>
                                        <Col sm={6}><Text style={[CS.font14, CS.MT18, CS.FW500]}>CVV</Text></Col>
                                        <Col sm={6} style={{ paddingRight: 5 }}>
                                            <TextInput placeholder={'10/25'} value={this.state.date}
                                                onChangeText={(text) => { this.fixDateText(text) }} maxLength={5} returnKeyType='done' keyboardType='number-pad' style={[CS.MT5, CS.formInput]} placeholderStyle={CS.font16} placeholderTextColor={'#999999'} textBreakStrategy={'simple'} />
                                        </Col>
                                        <Col sm={6}>
                                            <TextInput value={this.state.LastName} placeholder={'123'} maxLength={3} returnKeyType='done' keyboardType='number-pad' style={[CS.MT5, CS.formInput]} placeholderStyle={CS.font16} placeholderTextColor={'#999999'} textBreakStrategy={'simple'} />
                                        </Col>
                                        <Col sm={1} style={CS.MT14}>
                                            <RadioButton style={{
                                                width: 20,
                                                height: 20,
                                                borderColor: '#AAACAE',
                                                borderWidth: 2,
                                            }}
                                                innerBackgroundColor={Config.primaryColor}
                                                isActive={false}
                                                innerContainerStyle={{ height: 14, width: 14 }}></RadioButton>
                                        </Col>
                                        <Col sm={8.7} style={[{ justifyContent: 'center' }, CS.MT14]}>
                                            <Text style={[CS.font12, CS.FW500, { color: '#707070' }]}>Save Card For Future Use
                                            </Text>
                                        </Col>
                                        <Col sm={12} style={[{ justifyContent: 'center' }, CS.MT14]}>
                                            <Text style={[CS.font14, CS.FW500, { color: '#707070' }]}>We accept these payments
                                            </Text>
                                        </Col>
                                        <Col sm={1.5}><Image source={require('./../res/Icons/master.png')} style={{ width: 34, height: 20, marginTop: 7 }} /></Col>
                                        <Col sm={2}><Image source={require('./../res/Icons/visa.png')} style={{ width: 51, height: 15, marginTop: 10 }} /></Col>

                                    </Row>
                                    {/* <Col sm={12}><Text style={[CS.font14, CS.MT10, CS.FW500]}>Area</Text></Col> */}
                                    <Pressable onPress={() => this.setCardVisible(!this.state.addCardVisible)} style={[Config.style.greenBtn, CS.Col, { marginVertical: 20, width: Dimensions.get('window').width - 20 }]}>
                                        <Text style={[CS.font16, CS.whiteText]}>Save</Text>
                                    </Pressable>
                                </View>
                            </KeyboardAvoidingView>
                        </Modal>
                    </View >


                </SafeAreaView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showPaymentModalVisible}
                    onRequestClose={() => {
                        this.setPaymentModalVisible(!this.state.showPaymentModalVisible);
                    }}>
                    <View style={[styles.paymentCenteredView]}>
                        <View style={[styles.paymentModalView]}>
                            {/* <WebView source={{ uri: 'https://dbt.teb.mybluehostin.me/payforts/public/' }} style={{ width: '109%', height: 500, marginLeft: -17, marginTop: -55, marginBottom: -15 }} /> */}
                        </View>
                    </View>
                </Modal>
            </Wrapper>
        );
    }
};

const styles = StyleSheet.create({
    whiteBox: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
    },
    itemContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 10
    },
    rightSwipeBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        backgroundColor: '#D9AE56',
        width: 56,
        zIndex: 100,
        borderRadius: 28,
        marginTop: 18
    },
    rightSwipeBtn2: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 159,
        backgroundColor: '#C6345C',
        width: 80,
        zIndex: 0,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        // marginLeft: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 29,
        paddingBottom: 40,
        width: 310,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    container2: {
        margin: 20,
    },
    paymentCenteredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    paymentModalView: {
        backgroundColor: "white",
        borderRadius: 20,
        // padding: 15,
        paddingBottom: 0,
        width: '100%',
        height: 550,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        // alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
});

