import React from 'react';
import {
    View,
    StatusBar, Pressable, ActivityIndicator, ImageBackground, BackHandler, Linking,
    Text, Image, StyleSheet, LogBox, TextInput, Modal, Dimensions
} from 'react-native';
import { Footer, Header, Wrapper, Row, Col, ProgressiveImage, Right, Left, OrderTrackMap, RadioButton, ProgressBar } from '../components/componentIndex';
import Icon from "react-native-vector-icons/Ionicons";
const marginTop = Platform.OS === 'ios' ? 0 : 0;
import Config from '../Config';
import { AppImages } from '../res';
import APIKit from '../APIKit';
import LottieView from 'lottie-react-native';
import SyncStorage from 'sync-storage';
// import ProgressBar from "@ramonak/react-progress-bar";
// import * as Progress from 'react-native-progress';
export default class OrderTracking extends React.Component {

    state = {};
    ResturentList = [];
    isFavorite = false;
    totalAmount;
    restaurantDetail;
    orderDetail;
    defaultAddress = {};
    checkOutdata = {};
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
        payWith: 'Cash',
    };
    cartList = [];
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
    onAndroidBackPress = () => {
        this.props.navigation.navigate('Home')
        return true;
    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
        this.getOrderTrackingDetail();
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        LogBox.ignoreAllLogs()
        this.focusListener = this.props.navigation.addListener('focus', () => {
        });
    }

    PlaceOrder() {
        this.orderDetail = {
            "deliveryType": "Delivery",
            "payWith": "Cash"
        }
        fetch(Config.baseUrl + 'order', {
            method: 'POST',
            headers: APIKit.CommonHeaders,
            body: JSON.stringify({ "payload": this.orderDetail })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.status == true) {
                    this.props.navigation.navigate('OrderStatus')
                }
            })
            .catch((error) => {
                console.error("PlaceOrderError", error);
            });
    }

    cancle() {
        this.setModalVisible(false);
        this.setState({ isSelectable: false })
    }
    setModalVisible = (visible) => {
        this.setState({ showItemPopupVisible: visible });
    }

    setOrderModalVisible = (visible) => {
        this.setState({ showItemPopupVisible: visible });
    }
    OrderList = [];
    getOrderTrackingDetail = async () => {
        const { navigation } = this.props;
        console.log("ooooo", navigation.getParam('id'))
        let payload = {
            "_id": '61dd2d45235a0d001c3df7f7'// navigation.getParam('id')
        }
        fetch('https://d13j9g2ks667w2.cloudfront.net/api/v1/order-track', {
            method: 'POST',
            headers: APIKit.CommonHeaders,
            body: JSON.stringify({ payload })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == true) {
                    console.log("length", responseJson.success.data)
                    this.cartList = responseJson.success.data.cartItems
                    this.checkOutdata = responseJson.success.data;
                    if (responseJson.success.data.cookieMonster != {}) {
                        // this.defaultAddress = responseJson.success.data.cookieMonster.address[0];
                    }
                    // this.defaultAddress = responseJson.success.data.cookieMonster.address[0];
                    console.log("length", this.defaultAddress);
                    // this.restaurantDetail = responseJson.success.data.restaurant;
                    // this.totalAmount = responseJson.success.data.totalAmount
                    this.setState({ showLoader: 1 })
                    // this.setState({ isNull: false })
                    // this.cartList.forEach((item) => {
                    //     this.setState({ [item._id]: false })
                    // })
                }
            })
            .catch((error) => {
                console.error("getOrderTrackingDetail", error);
                this.setState({ isNull: true })
                this.setState({ showLoader: 0 })
                // this.props.navigation.navigate('Cart')
            });
    }

    render() {
        const { order } = this.state;
        const CS = Config.style
        return (

            <Wrapper>
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <Header style={{ paddingTop: 10 }}>
                    <Left style={CS.imageIcon}>
                        <Pressable onPress={() => this.props.navigation.navigate('Home')} >
                            <Icon name='close' size={30}></Icon>
                        </Pressable>
                    </Left>
                    <Text style={[CS.font16, CS.FW500, CS.MT10]}>Order Tracking</Text>
                    <Right>
                        {/* <Pressable style={styles.headerIcon}>
                            <Image source={AppImages.about2} style={[{ width: 22, height: 22 }]} />
                        </Pressable> */}
                    </Right>
                </Header>
                <Row style={{ marginTop: -5 }}>
                    <Col sm={12} style={CS.Col}>
                        {/* <LottieView source={require('../res/Animation/Delivery.json')} autoPlay loop style={[{ width: '100%', height: 399 }]} /> */}
                        <Image source={AppImages.trackBG} style={[{ width: '100%', height: 399 }]} />
                    </Col>
                </Row>
                {/* <ProgressBar completed={60} /> */}
                <Row style={[CS.card, { margin: 15, borderColor: '#442B7E', borderTopWidth: 5, padding: 0 }]}>
                    <Col style={[CS.Col, { height: 107, borderBottomWidth: 2, borderBottomColor: '#E5E5E5' }]} sm={12}>
                        <Text style={[CS.font24, CS.FontBold, CS.FW700]}>Within 30 min</Text>
                        <Text style={[CS.font14, CS.FontRegular, CS.FW400, CS.MT10]}>The driver is on his way to your door step</Text>
                    </Col>
                    <Col style={[CS.Col, { height: 97, paddingHorizontal: 47 }]} sm={12}>
                        <Text style={[CS.font14, CS.FontRegular, CS.FW400, { textAlign: 'center' }]}>This shop delivers with its own rider, so the estimated time might not be accurate</Text>
                        <OrderTrackMap></OrderTrackMap>
                    </Col>
                </Row>
                <Row size={12} style={[CS.Col, { margin: 15, height: 68, borderColor: '#E5E5E5', borderRadius: 13, borderWidth: 2, padding: 0 }]}>
                    <Col style={[CS.Col]} sm={2.5}>
                        <Image source={AppImages.DBoy} style={[{ width: 50, height: 50, borderWidth: 3, borderColor: '#442B7E', borderRadius: 6, marginTop: 3 }]} />
                        <Image source={AppImages.verify} style={[{ width: 18, height: 20, position: 'absolute', top: 43, left: 49 }]} />
                    </Col>
                    <Col style={[{ justifyContent: 'center' }]} sm={5.5}>
                        <Text style={[CS.font16, CS.FontMedium, CS.FW500]}>Ahmed Ali</Text>
                        <Text style={[CS.font12, CS.FontMedium, CS.FW500, { color: '#8950FC' }]}>Vaccinated</Text>
                    </Col>
                    <Col style={[CS.Col]} sm={4}>
                        <Pressable onPress={() => Linking.openURL('tel:8901007953')} style={[Config.style.greenBtn, CS.Col, { marginRight: 15, height: 37, width: 88, borderRadius: 35 }]}>
                            <Row>
                                <Col>
                                    <Image source={AppImages.callWhite} style={[{ width: 15, height: 15, marginRight: 8 }]} />
                                </Col>
                                <Col>
                                    <Text style={[CS.font14, CS.FontMedium, CS.whiteText, CS.FW500]}>Call</Text>
                                </Col>
                            </Row>
                        </Pressable>
                    </Col>
                </Row>
                <View>

                    {
                        this.state.showLoader == 1 ? (
                            <View>
                                {/* <Row style={[CS.shadowLessCard, { margin: 15, marginTop: 0 }]} size={12} Hidden={this.defaultAddress == undefined}>
                                    <Col sm={3.5}>
                                        <Image
                                            source={AppImages.Map} style={{ resizeMode: 'stretch', width: 92, height: 89 }} />
                                    </Col>
                                    <Col sm={8.5} style={{ justifyContent: 'center', paddingLeft: 10 }}><Text style={[CS.font17, CS.FW500]}>{this.defaultAddress?.nickName}</Text>
                                        <Text style={[CS.font12, CS.FW400, CS.greyText]}>{this.defaultAddress?.addressLine1},{this.defaultAddress?.addressLine2}</Text>
                                        <Text style={[CS.font12, CS.FW400, CS.MT10]}> <Image source={AppImages.telephone} style={{ width: 13, height: 13 }} />{this.defaultAddress?.phoneNumber}</Text>
                                    </Col>
                                </Row> */}

                                <Row style={[CS.shadowLessCard, { margin: 15 }]} size={12} Hidden={this.cartList == []}>
                                    <Col sm={9}>
                                        <Row size={12}>
                                            {this.cartList.map((item) => (
                                                <Col sm={2} style={[{ marginRight: 5, borderRadius: 5, }]}>
                                                    <ProgressiveImage style={{ width: 53, height: 53 }}
                                                        uri={item.image}
                                                        resizeMode='contain' />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Col>
                                    <Col sm={3} style={[CS.Col]}>
                                        <Pressable onPress={() => this.setOrderModalVisible(!this.state.showItemPopupVisible)}>
                                            <Text style={[CS.greenText, CS.FontRegular, CS.font12, CS.FW400, { textDecorationLine: 'underline' }]}>
                                                Show items
                                            </Text>
                                        </Pressable>
                                    </Col>
                                </Row>

                                <Row Hidden={this.checkOutdata == {}}>
                                    <Col sm={12} style={[{ padding: 15 }, CS.Col]}>
                                        <Image source={AppImages.trackBG2} style={[{ width: Dimensions.get('window').width - 20, borderTopLeftRadius: 10, borderTopRightRadius: 10, height: 281 }]} />
                                        <View style={[{ width: Dimensions.get('window').width - 20, height: 281, marginTop: -281, paddingHorizontal: 15, paddingTop: 5 }]}>
                                            <Row>
                                                <Col sm={6} style={{ height: 30, justifyContent: 'center' }}>
                                                    <Text style={[CS.FontMedium, CS.font12, CS.FW500, { color: '#AFAFAF' }]}>RECEIPTS</Text>
                                                </Col>
                                                <Col sm={6} style={[{ height: 30, justifyContent: 'center', alignItems: 'flex-end' }]}>
                                                    <Text style={[CS.FontMedium, CS.font12, CS.FW500, { color: '#707070' }]}>Cash Payment</Text>
                                                </Col>
                                                <View style={{ width: '100%', borderStyle: 'dotted', borderTopColor: '#EAEAEA', borderTopWidth: 1, marginVertical: 3 }}></View>

                                                <Col sm={6} style={[{ height: 30, justifyContent: 'center' }, CS.MT10]}>
                                                    <Text style={[CS.FontRegular, CS.font14, CS.FW500, { color: '#333333' }]}>Sub Total</Text>
                                                </Col>
                                                <Col sm={6} style={[{ height: 30, justifyContent: 'center', alignItems: 'flex-end' }, CS.MT10]}>
                                                    <Text style={[CS.FontMedium, CS.font12, CS.FW500, { color: '#333333' }]}>SAR 90.00</Text>
                                                </Col>
                                                <Col sm={6} style={{ height: 30, justifyContent: 'center' }}>
                                                    <Text style={[CS.FontMedium, CS.font12, CS.FW500, { color: '#AFAFAF' }]}>VAT</Text>
                                                </Col>
                                                <Col sm={6} style={{ height: 30, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                    <Text style={[CS.FontMedium, CS.font12, CS.FW500, { color: '#333333' }]}>SAR {this.checkOutdata.VATCharge}</Text>
                                                </Col>
                                                <Col sm={6} style={{ height: 30, justifyContent: 'center' }}>
                                                    <Text style={[CS.FontMedium, CS.font12, CS.FW500, { color: '#AFAFAF' }]}>Delivery Charge</Text>
                                                </Col>
                                                <Col sm={6} style={{ height: 30, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                    <Text style={[CS.FontMedium, CS.font12, CS.FW500, { color: '#333333' }]}>SAR {this.checkOutdata.deliveryCharge}</Text>
                                                </Col>
                                                <View style={{ width: '100%', borderTopColor: '#EAEAEA', borderTopWidth: 1, marginVertical: 10 }}></View>
                                                <Col sm={6} style={{ height: 30, justifyContent: 'center' }}>
                                                    <Text style={[CS.FontMedium, CS.font12, CS.FW500, { color: '#333333' }]}>Gross Total</Text>
                                                </Col>
                                                <Col sm={6} style={{ height: 30, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                    <Text style={[CS.FontMedium, CS.font12, CS.FW500, { color: '#333333' }]}>SAR {this.checkOutdata.totalAmount}</Text>
                                                </Col>
                                                <Col sm={6} style={{ height: 30, justifyContent: 'center' }}>
                                                    <Text style={[CS.FontMedium, CS.font12, CS.FW500, { color: '#AFAFAF' }]}>Coupon Discount</Text>
                                                </Col>
                                                <Col sm={6} style={{ height: 30, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                    <Text style={[CS.FontMedium, CS.font12, CS.FW500, { color: '#333333' }]}>SAR 10.00</Text>
                                                </Col>
                                                <View style={{ width: '100%', borderTopColor: '#EAEAEA', borderTopWidth: 1, marginVertical: 8 }}></View>
                                                <Col sm={6} style={{ height: 30, justifyContent: 'center' }}>
                                                    <Text style={[CS.FontMedium, CS.font12, CS.FW500, { color: '#333333' }]}>Total Amount</Text>
                                                </Col>
                                                <Col sm={6} style={{ height: 30, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                    <Text style={[CS.FontMedium, CS.font12, CS.FW500, { color: '#333333' }]}>SAR {this.checkOutdata.payableAmount}</Text>
                                                </Col>
                                            </Row>
                                        </View>

                                    </Col>
                                </Row>
                                <Row Hidden={this.checkOutdata == {}}>
                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={this.state.showItemPopupVisible}
                                        onRequestClose={() => {
                                            this.setOrderModalVisible(!this.state.showItemPopupVisible);
                                        }}>
                                        <View style={styles.centeredView}>
                                            <View style={styles.modalView}>
                                                <Row Hidden={this.checkOutdata.cartItems.length == 0}>
                                                    <View style={[CS.MT16, CS.PD8]}>
                                                        <Text style={[CS.font14, CS.FW700]}>Items</Text>{
                                                            this.checkOutdata?.cartItems.map((item) => (
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
                                                                                    <Pressable onPress={() => console.log("")} style={[styles.addBtn, CS.Col]} >
                                                                                        <Text style={[CS.textCenter, CS.font18, { color: '#5CAC7D' }]}>-</Text>
                                                                                    </Pressable>
                                                                                    <Text style={[styles.addBtntext, CS.Col, CS.textCenter, CS.font18]}>{item.quantity}</Text>
                                                                                    <Pressable onPress={() => console.log("")} style={[styles.addBtn, CS.Col]} >
                                                                                        <Icon name='add' color={'#5CAC7D'} size={27} />
                                                                                    </Pressable>
                                                                                </View>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            ))
                                                        }
                                                    </View>
                                                </Row>
                                            </View>
                                        </View>
                                        <View style={[CS.Col]}>
                                            <Pressable onPress={() => this.setModalVisible(false)} style={[{ position: 'absolute', bottom: 30, width: 70, height: 70, borderRadius: 40, backgroundColor: '#fff' }, CS.Col]} >
                                                <Icon name='close-sharp' size={35} />
                                            </Pressable>
                                        </View>
                                    </Modal>
                                </Row>
                            </View>
                        ) : (
                            <View>

                            </View>
                        )
                    }

                </View>
            </Wrapper>

        );
    }
}

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: "center"
    },
    text: {
        color: "white",
        fontSize: 42,
        lineHeight: 84,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#000000c0"
    },
    header: Config.headerStyle,
    headerHeading: Config.headerFontStyle,
    headerLeft: {
        flex: 0.6,
        height: 60,
        justifyContent: 'center'
    },
    headerRight: {
        flex: 0.4,
        alignItems: 'flex-end',
        height: 60,
        justifyContent: 'center'
    },
    headerIcon: {
        marginRight: 10
    },
    orderItemCard: {
        backgroundColor: '#ffffff',
        shadowColor: "#222222",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
        marginBottom: 7
    },
    separator: {
        paddingHorizontal: 15,
        paddingVertical: 7,
        backgroundColor: '#eeeeee'
    },
    tr: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 15
    },
    tdLeft: {
        flex: 0.5
    },
    tdRight: {
        flex: 0.5,
        alignItems: 'flex-end'
    },
    summaryText: {
        fontSize: 14,
        color: '#444444'
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000'
    },
    btnTransparent: {
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    btnTextDark: {
        fontWeight: 'bold',
        color: '#cccccc',
        fontSize: 16
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
});