import React from 'react';
import {
    StyleSheet,
    View, Pressable, Image, ScrollView, TextInput,
    StatusBar, Text, BackHandler, Dimensions
} from 'react-native';
import { Wrapper, Header, MenuButton, Left, RestaurantList, Right, Footer, ContentLoader, Container, Search, Row, Col, AddressSelect, ProgressiveImage } from './../components/componentIndex';
import Icon from "react-native-vector-icons/Ionicons";
import Config from '../Config';
import { AppImages } from '../res';
import APIKit from '../APIKit';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { WebView } from 'react-native-webview';

export default class Order extends React.Component {

    state = {
        selectedTab: 'Delivery',
        SearchList: [],
        isOrderFound: true
    };
    OrderList = [];
    onAndroidBackPress = () => {
        this.props.navigation.navigate('Home')
        return true;
    }
    getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('accessToken')
            if (value !== null) {
                console.log("accessToken", value)
                Config.userAuthToken = value;
                APIKit.getHeader();
                this.getOrderList();
            }
        } catch (e) {
            // error reading valu
        }
    }
    componentDidMount() {
        this.getToken();
        // window.ReactNativeWebView.postMessage(JSON.stringify({ 'dtata': "sdsdsd" }))
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }

    }

    searchFood(key) {
        this.setState({ SearchList: [] })
        setInterval(() => {
            // console.log("searchValue", this.state.searchValue)
        }, 1000)
        console.log(key)
        fetch(Config.baseUrl + 'restaurant?search=' + key, {
            method: 'GET',
            headers: APIKit.CommonHeaders2
        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson)

                if (responseJson.status == true) {
                    // this.SearchList = responseJson.success.data.menuItems;
                    this.setState({ SearchList: responseJson.success.data.restaurant })

                    this.setState({ isNull: true })
                } else {
                    if (responseJson.error.status == false) {
                        this.setState({ isNull: false })
                    } else {
                        this.setState({ isNull: true })
                    }
                    // this.setState({ isNull: false })
                }
                if (responseJson.error) {
                    this.setState({ isNull: false })
                } else {
                    this.setState({ isNull: true })
                }
            })
            .catch((error) => {
                console.error("errorerror", error);
                this.setState({ isNull: false })
            });
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    }

    constructor(props) {
        super(props);
        // this.removeItemValue();
    }

    async removeItemValue() {
        try {
            await AsyncStorage.removeItem('accessToken');
            Config.userAuthToken = ''
        }
        catch (exception) {
            return false;
        }
    }
    onMessage(data) {
        console.log("dauuu", data)
        // props.navigation.navigate("Home");
    }
    PlaceOrder() {
        let { Payfort } = require('react-native').NativeModules;
        let options = {
            isLive: false, // true for production, false for sandbox
            access_code: 'abcdxyzqwerty', // Access Code
            command: 'AUTHORIZATION', //Command (AUTHORIZATION, PURCHASE)
            merchant_identifier: 'poilkjyhm', //The Merchant Identifier
            merchant_reference: 'XYZ9239-yu8100', //The Merchant’s unique order number (XYZ9239-yu8100)
            merchant_extra: '', //Extra data sent by merchant. Will be received and sent back as received. Will not be displayed in any report
            merchant_extra1: '', //Extra data sent by merchant. Will be received and sent back as received. Will not be displayed in any report
            merchant_extra2: '', //Extra data sent by merchant. Will be received and sent back as received. Will not be displayed in any report
            merchant_extra3: '', //Extra data sent by merchant. Will be received and sent back as received. Will not be displayed in any report
            merchant_extra4: '', //Extra data sent by merchant. Will be received and sent back as received. Will not be displayed in any report
            customer_name: '', //The customer’s name
            customer_email: 'email@domain.com', //The customer’s email (email@domain.com)
            phone_number: '', //The customer’s phone number (00962797219966)
            payment_option: '', //Payment option (MASTERCARD,VISA,AMEX)
            language: 'en', // The checkout page and messages language (en, ar)
            currency: 'EGP', //The currency of the transaction’s amount in ISO code 3 (EGP)
            amount: '1000', //The transaction’s amount
            eci: 'ECOMMERCE', //Ecommerce indicator (ECOMMERCE)
            order_description: '' //A description of the order
        };
        Payfort.initPayfort(options, (err, results) => {
            if (err) {
                console.log("error initializing Payfort: ", err);
                return;
            }
            // Payfort initialized...
            console.log(results)
        });
    }
    OnTabChange(currentTab) {
        this.setState({ selectedTab: currentTab })
    }

    getOrderList() {
        fetch(Config.baseUrl + 'order', {
            method: 'GET',
            headers: APIKit.CommonHeaders2
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("getOrderList", responseJson)
                if (responseJson.status == true) {
                    console.log("getOrderList", responseJson.success.data)
                    this.OrderList = responseJson.success.data.sort(function (a, b) {
                        var c = new Date(a.orderDate);
                        var d = new Date(b.orderDate);
                        return c - d;
                    }).reverse();
                } else {
                    this.setState({ isOrderFound: false })
                }
                this.setState({ showBannerLoader: 1 })

            })
            .catch((error) => {
                console.error("getOrderList error", error);
            });
    }

    convertdate(convertDate) {
        let date = new Date(convertDate)
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        let format = (d, a = d.toString().split` `) => a[2] + " " + a[1];
        return format(date) + ' ' + strTime;
    }

    render() {

        const { order } = this.state;
        const CS = Config.style
        return (

            <Wrapper>

                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <Header style={{ paddingTop: 10 }}>
                    <Left style={CS.imageIcon}>
                        <Pressable onPress={() => this.props.navigation.toggleDrawer()}>
                            <Image source={AppImages.sideMenu} style={{ width: 22, height: 22, marginLeft: 0 }} />
                        </Pressable>
                    </Left>
                    <Text style={[CS.font16, CS.FW500, CS.MT10]}>Orders</Text>
                    <Right>
                        {/* <Pressable onPress={() => this.props.navigation.navigate('Notifications')} style={styles.headerIcon}>
                            <Image source={AppImages.Notification} style={{ resizeMode: 'contain', flex: 1, width: 22, height: 20 }} />
                        </Pressable> */}
                        <Pressable onPress={() => { this.props.navigation.navigate('Cart'); APIKit.previousScreen = this.props.navigation.state.routeName }} style={styles.headerIcon}>
                            <Image source={AppImages.Buy} style={{ resizeMode: 'contain', flex: 1, width: 22, height: 20, marginRight: 5 }} />
                        </Pressable>
                    </Right>
                </Header>
                <View>
                    <Row size={12} style={[Config.style.MT12, styles.tabBox]}>

                        <Pressable onPress={() => this.OnTabChange('Delivery')}>
                            <Col sm={3} style={this.state.selectedTab == 'Delivery' ? styles.tabSelected : styles.tabUnSelected}>
                                <Text style={[this.state.selectedTab == 'Delivery' ? Config.style.greenText : Config.style.greyText, Config.style.Font12]}>Delivery</Text>
                            </Col>
                        </Pressable>
                        <Pressable>
                            <Col sm={3} style={this.state.selectedTab == 'Pickup' ? styles.tabSelected : styles.tabUnSelected}>
                                <Text style={[this.state.selectedTab == 'Pickup' ? Config.style.greenText : Config.style.greyText, Config.style.Font12]}>Pickup</Text>
                            </Col>
                        </Pressable>
                        <Pressable>
                            <Col sm={3} style={this.state.selectedTab == 'Reservation' ? styles.tabSelected : styles.tabUnSelected}>
                                <Text style={[this.state.selectedTab == 'Reservation' ? Config.style.greenText : Config.style.greyText, Config.style.Font12]}>Reservation</Text>
                            </Col>
                        </Pressable>
                    </Row>
                </View>
                <View style={{ padding: 10, paddingTop: 10 }}>
                    {this.OrderList.map((list) => (
                        <View>
                            <Pressable >
                                <Row style={[CS.card]} size={12}>
                                    <Col sm={1}>
                                        <Row >
                                            <View style={{ backgroundColor: '#D9AE56', width: 29, height: 141, borderRadius: 10 }}>
                                                <Text style={[{ transform: [{ rotate: '270deg' }], width: 141, marginLeft: -58, marginTop: 30 }, CS.FW500, CS.FontMedium, CS.font14, CS.whiteText]}>In - Progress</Text>
                                            </View>
                                        </Row>
                                        {/* <Row Hidden={list?.restaurants[0].name != 'Dominos'}>
                                            <View style={{ backgroundColor: '#D9AE56', width: 29, height: 141, borderRadius: 10 }}>
                                                <Text style={[{ transform: [{ rotate: '270deg' }], width: 141, marginLeft: -58, marginTop: 30 }, CS.FW500, CS.FontMedium, CS.font14, CS.whiteText]}>In - Progress</Text>
                                            </View>
                                        </Row>
                                        <Row Hidden={list?.restaurants[0].name != 'Burger King'}>
                                            <View style={{ backgroundColor: '#C4C4C4', width: 29, height: 141, borderRadius: 10 }}>
                                                <Text style={[{ transform: [{ rotate: '270deg' }], width: 141, marginLeft: -58, marginTop: 30 }, CS.FW500, CS.FontMedium, CS.font14, CS.whiteText]}>Order Placed</Text>
                                            </View>
                                        </Row>
                                        <Row Hidden={list?.restaurants[0].name != 'Pizza hut'}>
                                            <View style={{ backgroundColor: '#442B7E', width: 29, height: 141, borderRadius: 10 }}>
                                                <Text style={[{ transform: [{ rotate: '270deg' }], width: 141, marginLeft: -58, marginTop: 50 }, CS.FW500, CS.FontMedium, CS.font14, CS.whiteText]}>Order Accepted</Text>
                                            </View>
                                        </Row>
                                        <Row Hidden={list?.restaurants[0].name != 'KFC'}>
                                            <View style={{ backgroundColor: '#C6345C', width: 29, height: 141, borderRadius: 10 }}>
                                                <Text style={[{ transform: [{ rotate: '270deg' }], width: 141, marginLeft: -58, marginTop: 50 }, CS.FW500, CS.FontMedium, CS.font14, CS.whiteText]}>Order Delivered</Text>
                                            </View>
                                        </Row>
                                        <Row Hidden={list?.restaurants[0].name != 'Pizza hut New'}>
                                            <View style={{ backgroundColor: '#C6345C', width: 29, height: 141, borderRadius: 10 }}>
                                                <Text style={[{ transform: [{ rotate: '270deg' }], width: 141, marginLeft: -58, marginTop: 50 }, CS.FW500, CS.FontMedium, CS.font14, CS.whiteText]}>Order Delivered</Text>
                                            </View>
                                        </Row> */}
                                    </Col>
                                    <Col sm={11} style={{ paddingLeft: 10 }}><Text style={[CS.font17, CS.FW500]}>{list.nickName}</Text>
                                        <Row style={{ margin: 10, marginTop: -10 }} size={12}>
                                            <Col sm={1.5}>
                                                <View style={{ borderRadius: 20, height: 30, width: 30 }}>
                                                    <ProgressiveImage style={{ width: 30, height: 30 }}
                                                        uri={list?.restaurants[0]?.logo} />
                                                </View>
                                            </Col>
                                            <Col sm={6.5} style={{ justifyContent: 'center' }}>
                                                <Text style={[CS.font18, CS.FontBold, CS.FW400]}>{list?.restaurants[0]?.name}</Text>
                                            </Col>
                                            <Col sm={4} style={CS.Col}>
                                                <Text style={[CS.font12, CS.FontRegular, CS.FW400, { lineHeight: 19 }]}>#73452950</Text>
                                            </Col>
                                            <Col sm={12}>
                                                <Text style={[CS.font12, CS.FontRegular, CS.FW400, { lineHeight: 19 }]}>Branch Name : king fahid st </Text>
                                            </Col>
                                            <Col sm={12}>
                                                <Text style={[CS.font12, CS.FontRegular, CS.FW400, { lineHeight: 19 }]}>{this.convertdate(list?.orderDate)} </Text>
                                            </Col>
                                            <Col sm={12}>
                                                <Text style={[CS.font12, CS.FontBold, CS.FW700, { lineHeight: 19 }]}>Total Order Amount :  </Text>
                                            </Col>
                                            <Col sm={12}>
                                                <Text style={[CS.font24, CS.FontBold, CS.FW700, { color: '#442B7E', fontSize: 27 }]}>{APIKit.round(list?.payableAmount, 2)}</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Pressable>
                        </View>
                    ))}
                </View>

                <Row Hidden={this.OrderList.length != 0 || this.state.isOrderFound == false} style={[styles.container2, styles.horizontal]} >
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
                <Row Hidden={this.state.isOrderFound != false || this.OrderList.length == 0}>
                    <Col style={[CS.Col, CS.MT18]} sm={12}>
                        <Text style={[CS.nullMessage]}>
                            PREVIOUS ORDERS NOT FOUND!</Text>
                    </Col>
                </Row>

            </Wrapper>

        );
    }
}

const styles = StyleSheet.create({
    tabBox: {
        height: 46,
        backgroundColor: '#F1F4F3',
        borderRadius: 10,
        paddingLeft: 3,
        marginHorizontal: 10,
        width: Dimensions.get('window').width - 23,

    },
    tabSelected: {
        backgroundColor: '#ffffff',
        color: '#5CAC7D',
        height: 41,
        borderRadius: 3,
        minWidth: Dimensions.get('window').width / 3 - 10,
        marginVertical: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        width: '33%'

    },
    tabUnSelected: {
        backgroundColor: '#F1F4F3',
        color: '#707070',
        height: 41,
        borderRadius: 3,
        paddingHorizontal: 10,
        marginVertical: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        minWidth: Dimensions.get('window').width / 3 - 10,
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
    }
});