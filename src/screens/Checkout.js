import React from 'react';
import {
    View,
    StatusBar, Pressable, ActivityIndicator, CheckBox, BackHandler,
    Text, Image, StyleSheet, LogBox, TextInput, Modal
} from 'react-native';

import { Footer, Header, Wrapper, Row, Col, ProgressiveImage, Right, AddressSelect, Left, RadioButton, ContentLoader } from '../components/componentIndex';
import Icon from "react-native-vector-icons/Ionicons";
const marginTop = Platform.OS === 'ios' ? 0 : 0;
import Config from '../Config';
import { AppImages } from '../res';
import APIKit from '../APIKit';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { WebView } from 'react-native-webview';
export default class Checkout extends React.Component {
    isFavorite = false;
    totalAmount;
    restaurantDetail;
    orderDetail;
    defaultAddress;
    state = {
        showLoader: 0,
        selectedIndex: 0,
        favoriteIcon: AppImages.likeWhite,
        itemQuantity: 1,
        isNull: false,
        isSelectable: false,
        deletePopupVisible: false,
        isAllSelected: false,
        isCouponApplied: 0,
        showItemPopupVisible: false,
        deletesinglePopupVisible: false,
        showPaymentModalVisible: false,
        payWith: 'Cash',
        ShowLaunchPopup: false
    };
    cartList = [];
    constructor(props) {
        super(props);

    }

    setShowLaunchPopup = (visible) => {
        this.setState({ ShowLaunchPopup: visible });
    }
    showAlert = () => {
        this.setState({
            showAlert: true
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false
        });

    };
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
    onAndroidBackPress = () => {
        this.props.navigation.navigate('Cart')
        return true;
    }
    componentDidMount() {
        this.state = { showAlert: false };
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
        this.getToken();
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        LogBox.ignoreAllLogs()
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.getToken();
        });
    }

    getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('accessToken')
            if (value !== null) {
                console.log("accessToken", value)
                Config.userAuthToken = value;
                APIKit.getHeader();
                this.getCartItemList();
            }
        } catch (e) {
            // error reading valu
        }
    }

    PlaceOrder() {
        this.setShowLaunchPopup(false)
        this.orderDetail = {
            "deliveryType": "Delivery",
            "payWith": "Cash"
        }
        fetch('https://d13j9g2ks667w2.cloudfront.net/api/v1/order', {
            method: 'POST',
            headers: APIKit.CommonHeaders2,
            body: JSON.stringify({ "payload": this.orderDetail })
        }).then((response) => response.json())
            .then((responseJson) => {
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
                this.showAlert();
            });
    }

    cancle() {
        this.setModalVisible(false);
        this.setState({ isSelectable: false })
    }
    setModalVisible = (visible) => {
        this.setState({ showItemPopupVisible: visible });
    }
    setPaymentModalVisible(visible) {
        this.setState({ showPaymentModalVisible: visible });
    }

    getCartItemList() {
        fetch(Config.baseUrl + 'cart/checkout', {
            method: 'GET',
            headers: APIKit.CommonHeaders2
        }).then((response) => response.json())
            .then((responseJson) => {
                let sortedCartList = [];
                responseJson.success.data.cartItems.forEach((item) => {
                    item.amount = item.amount + this.getExtrasTotal(item.extras)
                    item.totalAmount = item.quantity * item.amount
                    sortedCartList.push(item)
                })
                this.cartList = sortedCartList.sort(APIKit.sortList);
                this.checkOutdata = responseJson.success.data;
                this.defaultAddress = responseJson.success.data.defaultAddress[0];
                // this.restaurantDetail = responseJson.success.data.restaurant;
                // this.totalAmount = responseJson.success.data.totalAmount
                this.setState({ showLoader: 1 })
                // this.setState({ isNull: false })
                this.cartList.forEach((item) => {
                    this.setState({ [item._id]: false })
                })
            })
            .catch((error) => {
                console.error("getMenuItemDetail", error);
            });
    }

    getExtrasTotal(items) {
        let total = 0;
        items.forEach((item) => {
            total = total + item.amount
        })
        return total
    }

    selectAll() {
        this.setState({ isAllSelected: true })
        this.cartList.forEach((item) => {
            this.setState({ [item._id]: true })
        })

    }

    clear() {
        this.setState({ isAllSelected: false })
        this.cartList.forEach((item) => {
            this.setState({ [item._id]: false })
        })
    }
    onRadioChange(item) {
        if (this.state[item._id] == false) {
            this.setState({ [item._id]: true })
        } else {
            this.setState({ [item._id]: false })
        }
    }

    updateItemQuantity(value, id, quantity) {
        if (value == 'add') {
            this.setState({ itemQuantity: this.state.itemQuantity + 1 })
            fetch(Config.baseUrl + 'cart/item/' + id, {
                method: 'PUT',
                headers: APIKit.CommonHeaders2,
                body: JSON.stringify({ "payload": { "quantity": quantity + 1, "additionalComments": "Nothingsdsdasdasdasdasdasdasd", } })
            }).then((response) => response.json())
                .then((responseJson) => {
                    this.getCartItemList()
                })
                .catch((error) => {
                    console.error("PlaceOrderError", error);
                });
        }
        if (value == 'sub') {
            if (quantity >= 2) {
                fetch(Config.baseUrl + 'cart/item/' + id, {
                    method: 'PUT',
                    headers: APIKit.CommonHeaders2,
                    body: JSON.stringify({ "payload": { "quantity": quantity - 1 } })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        this.getCartItemList()
                    })
                    .catch((error) => {
                        console.error("PlaceOrderError", error);
                    });
            } else {
                this.setState({ [id]: true })
                this.setModalVisible(false);
                this.setSingleDeleteModalVisible(true)
            }
        }
    }

    setSingleDeleteModalVisible = (visible) => {
        this.setState({ deletesinglePopupVisible: visible });
    }

    deleteItems() {
        this.cartList.forEach((item) => {
            if (this.state[item._id] == true) {
                fetch(Config.baseUrl + 'cart/item/' + item._id, {
                    method: 'DELETE',
                    headers: APIKit.CommonHeaders2
                }).then((response) => response.json())
                    .then((responseJson) => {
                        this.setState({ isSelectable: false })
                        // this.setModalVisible(false);
                        this.setSingleDeleteModalVisible(false)
                        this.setModalVisible(true);
                        if (this.cartList.length > 1) {
                            this.getCartItemList();
                        } else {
                            this.props.navigation.navigate('Cart')
                        }
                    })
                    .catch((error) => {
                        console.error("getMenuItemDetail", error);
                    });
            }
        })
    }
    closeModal = () => {
        this.getCartItemList();
    }
    render() {
        const { showAlert } = this.state;
        const CS = Config.style;
        const footer = (
            <Row style={[CS.topShadow]}>
                <Footer>
                    <Row>
                        <Col sm={12} Hidden={this.state.payWith == 'Debit/Credit Card'}>
                            <Pressable onPress={() => this.setShowLaunchPopup(true)} style={[CS.greenBtn, { marginBottom: 0 }]}>
                                <Row>
                                    <Col style={[CS.Col]}>
                                        <Text style={[CS.font16, CS.whiteText]}>Place Order</Text>
                                    </Col>
                                    <Col style={[CS.Col]}>
                                        <Image source={AppImages.arrowWhite} style={[{ width: 7, height: 10, marginLeft: 8, marginTop: 3 }]} />
                                    </Col>
                                </Row>

                            </Pressable>
                        </Col>
                        <Col sm={12} Hidden={this.state.payWith == 'Cash' || this.state.payWith == "Takein Wallet"}>
                            <Pressable onPress={() => { APIKit.payAmount = this.checkOutdata.payableAmount.toFixed(0); this.props.navigation.navigate('PaymentMethod') }} style={[CS.greenBtn, { marginBottom: 0 }]}>
                                <Row>
                                    <Col style={[CS.Col]}>
                                        <Text style={[CS.font16, CS.whiteText]}>Pay</Text>
                                    </Col>
                                    <Col style={[CS.Col]}>
                                        <Image source={AppImages.arrowWhite} style={[{ width: 7, height: 10, marginLeft: 8, marginTop: 3 }]} />
                                    </Col>
                                </Row>

                            </Pressable>
                        </Col>
                    </Row>
                </Footer>
            </Row>
        );
        return (
            <Wrapper footer={footer} style={{ marginTop }}>
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <Header style={{ paddingTop: 10 }}>
                    <Left style={CS.imageIcon}>
                        <Pressable onPress={() => this.props.navigation.navigate('Cart')} >
                            <Image source={AppImages.backBlack} style={{ width: 33, height: 33 }} />
                        </Pressable>
                    </Left>
                    <Pressable style={CS.Col}>
                        <Text style={[CS.greyText, CS.font16]}>Checkout</Text>
                        {this.state.showLoader == 1 ? (
                            <Text style={[CS.font12, CS.FW400]}>{this.checkOutdata.restaurant.name}</Text>
                        ) : (<Text></Text>)}
                    </Pressable>
                </Header>

                {
                    this.state.showLoader == 1 ? (
                        <View>

                            {/* Hidden={this.state.showLoader == 0} */}
                            <Row >
                                <View style={[CS.PD15]}>
                                    <Text style={[CS.font14, CS.FW700, CS.FontBold]}>Items</Text>
                                    <Row>
                                        <Col sm={9}>
                                            <Row size={12}>
                                                {this.checkOutdata.cartItems.map((item) => (
                                                    <Col sm={2} style={[{ marginRight: 5, borderRadius: 5, }]}>
                                                        <ProgressiveImage style={{ width: 45, height: 45 }}
                                                            uri={item.image}
                                                            resizeMode='contain' />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                        <Col sm={3} style={[CS.Col]}>
                                            <Pressable onPress={() => this.setModalVisible(true)}>
                                                <Text style={[CS.greenText, CS.FontRegular, CS.font12, CS.FW400]}>
                                                    Show items
                                                </Text>
                                            </Pressable>
                                        </Col>
                                    </Row>
                                </View>
                                <View style={[CS.PD15]}>
                                    <Text style={[CS.font14, CS.FW700, CS.FontBold]}>Order Type</Text>
                                    <Row size={12}>
                                        <Col sm={1} style={[CS.MT10]}>
                                            <RadioButton style={{
                                                width: 20,
                                                height: 20,
                                                borderColor: Config.primaryColor,
                                                borderWidth: 2,
                                            }}
                                                innerBackgroundColor={Config.primaryColor}
                                                isActive={true}
                                                onPress={() => this.selectAll()}
                                                innerContainerStyle={{ height: 14, width: 14 }}></RadioButton>
                                        </Col>
                                        <Col sm={11} style={[CS.MT10]}>
                                            <Text style={[CS.font14, CS.FW700, CS.FontBold]}>Delivery</Text>
                                        </Col>
                                        <Col sm={1} style={[CS.MT10, { opacity: 0.1 }]}>
                                            <RadioButton style={{
                                                width: 20,
                                                height: 20,
                                                borderColor: Config.primaryColor,
                                                borderWidth: 2,
                                            }}
                                                innerBackgroundColor={Config.primaryColor}
                                                isActive={false}
                                                onPress={() => this.selectAll()}
                                                innerContainerStyle={{ height: 14, width: 14 }}></RadioButton>
                                        </Col>
                                        <Col sm={11} style={[CS.MT10, { opacity: 0.1 }]}>
                                            <Text style={[CS.font14, CS.FW700, CS.FontBold]}>Restaurant Pickup</Text>
                                        </Col>
                                        <Col sm={1} style={[CS.MT10, { opacity: 0.1 }]}>
                                            <RadioButton style={{
                                                width: 20,
                                                height: 20,
                                                borderColor: Config.primaryColor,
                                                borderWidth: 2,
                                            }}
                                                innerBackgroundColor={Config.primaryColor}
                                                isActive={false}
                                                onPress={() => this.selectAll()}
                                                innerContainerStyle={{ height: 14, width: 14 }}></RadioButton>
                                        </Col>
                                        <Col sm={11} style={[CS.MT10, { opacity: 0.1 }]}>
                                            <Text style={[CS.font14, CS.FW700, CS.FontBold]}>Curbside pickup</Text>
                                        </Col>
                                    </Row>
                                </View>
                                <View style={[CS.PD15]}>
                                    <Row size={12}>
                                        <Col sm={10}>
                                            <Text style={[CS.font14, CS.FW700, CS.FontBold]}>Delivery Address</Text>
                                        </Col>
                                        <Col sm={2}>
                                            <AddressSelect pageName="checkout" closeModal={this.closeModal}></AddressSelect>
                                            {/* <Text style={[CS.font11, CS.FW400, { color: '#C6345C' }]}>Change</Text> */}
                                        </Col>
                                    </Row>
                                    <Row style={[CS.shadowLessCard, CS.MT10]} size={12} Hidden={this.defaultAddress == undefined}>
                                        <Col sm={3.5}>
                                            <Image
                                                source={AppImages.Map} style={{ resizeMode: 'stretch', width: 92, height: 89 }} />
                                        </Col>
                                        <Col sm={8.5} style={{ justifyContent: 'center', paddingLeft: 10 }}><Text style={[CS.font17, CS.FW500]}>{this.defaultAddress?.nickName}</Text>
                                            <Row>
                                                <Col sm={12}>
                                                    <Text style={[CS.font12, CS.FW400, CS.greyText]}>{this.defaultAddress?.addressLine1},{this.defaultAddress?.addressLine2}</Text>
                                                </Col>
                                                <Col sm={0.8} style={[CS.MT10, { justifyContent: 'center' }]}>
                                                    <Image source={AppImages.telephone} style={{ width: 13, height: 13 }} />
                                                </Col>
                                                <Col sm={11} style={[CS.MT10, { justifyContent: 'center' }]}>
                                                    <Text style={[CS.font12, CS.FW400, { marginTop: -1 }]}>{this.defaultAddress?.phoneNumber}</Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </View>
                                <View style={[CS.PD15]}>
                                    <Text style={[CS.font14, CS.FW700, CS.FontBold]}>Order schedule</Text>
                                    <Row style={[CS.shadowLessCard, CS.MT5, { padding: 10 }]} size={12}>
                                        <Col sm={2}>
                                            <Image source={AppImages.Delivery4} style={{ resizeMode: 'contain', width: 30, height: 23 }} />
                                        </Col>
                                        <Col sm={10} style={{ justifyContent: 'center' }}>
                                            <Text style={[CS.greyText, CS.FontMedium, CS.font14, CS.FW500]}>Within 45 mins</Text>
                                        </Col>
                                    </Row>
                                </View>

                                <View style={[CS.PD15]}>
                                    <Text style={[CS.font14, CS.FW700, CS.FontBold]}>Pay with</Text>
                                    {this.checkOutdata.payWtih.map((item) => (
                                        <Row size={12}>
                                            <Col sm={1} style={[CS.MT10]}>
                                                <RadioButton style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderColor: Config.primaryColor,
                                                    borderWidth: 2,
                                                }}
                                                    innerBackgroundColor={Config.primaryColor}
                                                    isActive={this.state.payWith == item}
                                                    onPress={() => this.setState({ payWith: item })}
                                                    innerContainerStyle={{ height: 14, width: 14 }}></RadioButton>
                                            </Col>
                                            <Col sm={11} style={[CS.MT10]}>
                                                <Pressable onPress={() => this.setState({ payWith: item })}>
                                                    <Text style={[CS.font14, CS.FW500, CS.FontMedium]}>{item}</Text>
                                                </Pressable>
                                            </Col>
                                        </Row>
                                    ))}

                                </View>

                                {/* <View style={[CS.PD15]}>
                                    <Text style={[CS.font14, CS.FW700, CS.FontBold]}>Promo code</Text>
                                    <Row size={12} style={[CS.MT5, this.state.isCouponApplied == 0 ? { borderColor: '#442B7E' } : (this.state.isCouponApplied == 1 ? { borderColor: '#5CAC7D' } : { borderColor: '#C6345C' }), styles.promocodeRow]}>
                                        <Col sm={9} style={[{ justifyContent: 'center' }]}>
                                            <View >
                                                <TextInput placeholder={'Promocode'} returnKeyType='done' onChangeText={text => this.setState({ nickName: text })} placeholderStyle={CS.font12} placeholderTextColor={'#999999'} style={[styles.promoInput]} />
                                            </View>
                                        </Col>
                                        <Col sm={3}>
                                            <Pressable onPress={() => this.props.navigation.navigate('RestaurentList')} style={[styles.promoBtn, this.state.isCouponApplied == 0 ? { backgroundColor: '#442B7E' } : (this.state.isCouponApplied == 1 ? { backgroundColor: '#5CAC7D' } : { backgroundColor: '#C6345C' })]}>
                                                {this.state.isCouponApplied == 0 ? (<Text style={[CS.font12, CS.FW500, CS.whiteText]}>Apply</Text>) : (this.state.isCouponApplied == 1 ? (<Icon name='checkmark-done-circle' size={30} color={'#ffffff'}></Icon>) : (<Icon name='alert-circle' size={30} color={'#ffffff'}></Icon>))}
                                            </Pressable>
                                        </Col>
                                    </Row>
                                </View> */}

                                <View style={[CS.PD15]}>
                                    <Text style={[CS.font14, CS.FW700, CS.FontBold]}>Payment Summary</Text>
                                    <Row size={12}>
                                        <Col sm={9}><Text style={[CS.font14, CS.LBText, CS.MT12, CS.FW400]}>Total</Text></Col>
                                        <Col sm={3}><Text style={[CS.font14, CS.LBText, CS.MT12, CS.FW400]}>SAR {this.checkOutdata.totalAmount.toFixed(3)}</Text></Col>
                                        <Col sm={9}><Text style={[CS.font14, CS.LBText, CS.MT12, CS.FW400]}>Delivery Charge</Text></Col>
                                        <Col sm={3}><Text style={[CS.font14, CS.LBText, CS.MT12, CS.FW400]}>SAR {this.checkOutdata.deliveryCharge}.00</Text></Col>
                                        <Col sm={9}><Text style={[CS.font14, CS.LBText, CS.MT12, CS.FW400]}>VAT</Text></Col>
                                        <Col sm={3}><Text style={[CS.font14, CS.LBText, CS.MT12, CS.FW400]}>SAR {this.checkOutdata.VATCharge}.00</Text></Col>
                                        <Col sm={9}><Text style={[CS.font14, CS.LBText, CS.MT18, CS.FW500]}>Total Amount</Text></Col>
                                        <Col sm={3}><Text style={[CS.font14, CS.LBText, CS.MT18, CS.FW500]}>SAR {this.checkOutdata.payableAmount.toFixed(3)}</Text></Col>
                                    </Row>
                                </View>
                            </Row>
                        </View>
                    ) : <View>

                        <Row style={[styles.container2, styles.horizontal]} Hidden={this.state.isNull}>
                            <Col sm={12} style={[styles.itemContainer]}>
                                <ContentLoader active avatar pRows={3} pWidth={['50%', '100%', '70%']} avatarStyles={{ borderRadius: 3 }} title={false}></ContentLoader>
                            </Col>
                            <Col sm={12} style={[styles.itemContainer]}>
                                <ContentLoader active avatar pRows={3} pWidth={['50%', '100%', '70%']} avatarStyles={{ borderRadius: 3 }} title={false}></ContentLoader>
                            </Col>
                            <Col sm={12} style={[styles.itemContainer]}>
                                <ContentLoader active avatar pRows={3} pWidth={['50%', '100%', '70%']} avatarStyles={{ borderRadius: 3 }} title={false}></ContentLoader>
                            </Col>
                        </Row>
                    </View>
                }

                <View>
                    <Modal
                        animationType="none"
                        transparent={true}
                        visible={this.state.deletesinglePopupVisible}
                        onRequestClose={() => {
                            this.setSingleDeleteModalVisible(!this.state.deletesinglePopupVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={[styles.modalView, { padding: 15, width: 310 }]}>
                                <Text style={[CS.font24, CS.FW700]}>Remove Item</Text>
                                <Text style={[CS.greyText, CS.font14, CS.TextCenter, CS.FW400, CS.MT18]}>Are you sure you would like remove item from cart?</Text>
                                <Pressable onPress={() => this.deleteItems()} style={[CS.greenBtn, CS.MT18, { backgroundColor: '#C6345C' }]}>
                                    <Text style={[CS.font16, CS.whiteText]}>Remove item</Text>
                                </Pressable>
                                <Pressable onPress={() => { this.setSingleDeleteModalVisible(false); this.setModalVisible(true) }} style={[CS.greenBtn, { backgroundColor: '#ffffff', borderColor: '#56678942', borderWidth: 2 }]}>
                                    <Text style={[CS.font16, CS.greyText]}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
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
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.ShowLaunchPopup}
                        onRequestClose={() => {
                            navigation.setParams({ isShowLaunchPopup: false })
                            // navigation.getParam('isShowLaunchPopup') = false
                        }}>
                        <View style={CS.blurBGView}>
                            <View style={[styles.modalView, styles.launchSoonPopup, { width: '100%' }]}>
                                <Row size={12} >

                                    <Col sm={12} style={CS.Col}>
                                        <View style={[{ width: 104, height: 104, marginTop: 50, borderRadius: 50, backgroundColor: '#ffffff' }, CS.Col]}>
                                            <Image source={AppImages.NonContact} style={[{ width: 42, height: 58 }]} />
                                        </View>

                                    </Col>
                                    <Col sm={12} style={CS.Col}>
                                        <Text style={[CS.FontBold, CS.FW700, CS.MT16, { fontSize: 34, color: '#442B7E', padding: 40, paddingTop: 10, paddingBottom: 0, textAlign: 'center' }]}>No contact delivery</Text>
                                    </Col>
                                    <Col sm={12} style={CS.Col}>
                                        <Text style={[CS.font17, CS.FontRegular, CS.FW400, { color: '#9586A8', textAlign: 'center', padding: '7%', paddingBottom: 0 }]}>When placing an order, select the option “Contactless delivery” and the courier will leave your order at the door.
                                        </Text>
                                    </Col>
                                    <Col sm={12} style={[CS.Col, { paddingTop: 20 }]}>
                                        <Pressable onPress={() => this.PlaceOrder()}
                                            style={[CS.greenBtn]} >
                                            <Text style={[CS.boldText, CS.whiteText]}>order now</Text>
                                        </Pressable>
                                    </Col>
                                    <Col sm={12} style={[CS.Col, { paddingTop: 10 }]}>
                                        <Pressable onPress={() => this.PlaceOrder()}>
                                            <Text style={[CS.boldText, { color: '#9586A8' }]}>Dismiss</Text>
                                        </Pressable>
                                    </Col>
                                </Row>
                            </View>
                        </View>
                    </Modal>
                </View >
                <View>
                    {this.state.showLoader == 1 ? (
                        <Modal
                            animationType="none"
                            transparent={true}
                            visible={this.state.showItemPopupVisible}
                            onRequestClose={() => {
                                this.setModalVisible(!deletePopupVisible);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <View style={[CS.MT16, CS.PD8]}>
                                        <Text style={[CS.font14, CS.FW700]}>Items</Text>{
                                            this.checkOutdata.cartItems.map((item) => (
                                                <Row size={12} style={[CS.MT10]}>
                                                    <Col sm={1.5} style={{ paddingTop: 45 }} Hidden={!this.state.isSelectable}>
                                                        <RadioButton style={{
                                                            width: 25,
                                                            height: 25,
                                                            borderColor: Config.primaryColor,
                                                            borderWidth: 2,
                                                        }}
                                                            innerBackgroundColor={Config.primaryColor}
                                                            isActive={this.state[item._id]}
                                                            onPress={() => this.onRadioChange(item)}
                                                            innerContainerStyle={{ height: 18, width: 18 }}></RadioButton>
                                                    </Col>
                                                    <Col sm={this.state.isSelectable ? 10.5 : 12}>
                                                        <Row style={[CS.shadowLessCard, this.state.isSelectable ? { marginRight: -25 } : { marginRight: 0 }]}>
                                                            <Col sm={2.5}>
                                                                <ProgressiveImage style={{ width: 55, height: 55 }}
                                                                    uri={item.image}
                                                                    resizeMode='contain' />
                                                            </Col>
                                                            <Col sm={6} style={{ justifyContent: 'center' }}><Text style={[CS.font17, CS.FW500]}>{item.name}</Text>
                                                                <Text style={[CS.font15, CS.FW400, CS.greyText]}>SAR {APIKit.round(item.totalAmount, 2)}</Text>
                                                            </Col>
                                                            <Col sm={3.5}>
                                                                <View style={[styles.addBtnBox, CS.MT18, { backgroundColor: '#5CAC7D', borderColor: '#5CAC7D' }]}>
                                                                    <Pressable onPress={() => this.updateItemQuantity('sub', item._id, item.quantity)} style={[styles.addBtn, CS.Col]} >
                                                                        <Image source={AppImages.minusGreen} style={{ width: 12, height: 12 }} />
                                                                        {/* <Text style={[CS.textCenter, CS.font18, { color: '#5CAC7D' }]}>-</Text> */}
                                                                    </Pressable>
                                                                    <Text style={[styles.addBtntext, CS.Col, CS.textCenter, CS.font18]}>{item.quantity}</Text>
                                                                    <Pressable onPress={() => this.updateItemQuantity('add', item._id, item.quantity)} style={[styles.addBtn, CS.Col]} >
                                                                        <Image source={AppImages.plusGreen} style={{ width: 12, height: 12 }} />
                                                                        {/* <Icon name='add' color={'#5CAC7D'} size={27} /> */}
                                                                    </Pressable>
                                                                </View>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            ))
                                        }
                                    </View>

                                </View>
                            </View>
                            <View style={[CS.Col]}>
                                <Pressable onPress={() => this.setModalVisible(false)} style={[{ position: 'absolute', bottom: 30, width: 70, height: 70, borderRadius: 40, backgroundColor: '#fff' }, CS.Col]} >
                                    <Icon name='close-sharp' size={35} />
                                </Pressable>
                            </View>
                        </Modal>) : (<View></View>)}
                </View>
                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title="Whoops!"
                    message="There seems to be a problem with your Network Connection"
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    cancelText="No, cancel"
                    confirmText="Ok"
                    confirmButtonColor="#442B7E"
                    onCancelPressed={() => {
                        this.hideAlert();
                    }}
                    onConfirmPressed={() => {
                        this.hideAlert();
                    }}
                />
            </Wrapper>)
    }

}


const styles = StyleSheet.create({
    launchSoonPopup: {
        backgroundColor: '#F6F5F5',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: 550,
        padding: 15
    },
    promocodeRow: {
        borderWidth: 2,
        // borderColor: '#5CAC7D',
        borderRadius: 10,
        maxHeight: 43,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        justifyContent: 'center'
    },
    promoInput: {
        width: '100%',
        marginLeft: 10,
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'Ubuntu-Regular',
        justifyContent: 'center'
    },
    promoBtn: {
        backgroundColor: '#5CAC7D',
        height: 40,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginRight: -2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addBtnBox: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#999999',
        width: 88,
        height: 30,
        maxHeight: 30,
        borderRadius: 5,
        borderColor: '#999999',
        borderWidth: 1
    },
    addBtn: {
        width: 28,
        height: 28,
        borderRadius: 5,
        padding: 0,
        backgroundColor: '#F8F8F8'
    },
    addBtntext: {
        width: 30,
        height: 30,
        paddingTop: 3,
        color: '#ffffff'
    },
    addMoreBtn: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#CCCCCC',
        borderRadius: 1,
        margin: 5,
        height: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        maxHeight: 30,
        paddingVertical: 0
    },
    headerIcon1: {
        backgroundColor: '#442B7E',
        width: 38,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        padding: 0,
        // marginRight: 10
    },
    headerBox: {
        paddingTop: 20
    },
    itemContainer: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 10,
        height: 88,
        marginTop: 15,
        padding: 10
    },
    requestContainer: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#C4C4C4',
        borderRadius: 1,
        padding: 15,
        marginLeft: -2,
        marginRight: -2
    },
    resturentLogo: {
        marginTop: -50,
        margin: 'auto',
        width: 75,
        height: 75,
        borderRadius: 37,

    },
    content: {
        width: '100%',
        marginTop: -50,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: 2
    },
    foodType: {
        paddingHorizontal: 5,
        color: '#707070'
    },
    ratingText: {
        fontSize: 10,
        paddingBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold'
    },
    groupOrderBox: {
        backgroundColor: '#442B7E',
        width: '100%',
        marginTop: 15,
        height: 77,
        padding: 15
    },

    groupOrderButton: {
        backgroundColor: '#C6345C',
        marginLeft: 20,
        height: 36,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    price: {
        color: '#5CAC7D',
        fontSize: 14
    },
    footerBox: {
        backgroundColor: '#442B7E',
        width: '100%',
        marginTop: 5,
        borderRadius: 10,
        paddingVertical: 12,
        paddingLeft: 15,
        height: 45
    },
    requestInput: {
        backgroundColor: '#F4F4F4',
        width: '100%',
        borderRadius: 10,
        marginTop: 5,
        textAlignVertical: 'top',
        paddingLeft: 10
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
        padding: 0,
        paddingBottom: 20,
        width: '93%',
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
        margin: 20
    },
    foodType: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
})