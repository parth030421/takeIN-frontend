import React from 'react';
import {
    StyleSheet,
    Pressable,
    Image,
    View,
    Text,
    SafeAreaView,
    StatusBar, Modal,
    Platform, BackHandler
} from 'react-native';
import { AppImages } from '../res';
import Config from '../Config';
import { Wrapper, Header, Left, MenuButton, Right, Footer, FooterTabs, RestaurantList, Container, Search, Row, Col, AddressSelect, ProgressiveImage } from './../components/componentIndex';
import APIKit from '../APIKit';
const marginTop = Platform.OS === 'ios' ? 0 : 0;
import AsyncStorage from '@react-native-async-storage/async-storage';
import SyncStorage from 'sync-storage';
import Icon from "react-native-vector-icons/Ionicons";
export default class Setting extends React.Component {
    // navigation = useNavigation<any>();
    inputs = {};
    state = {
        email: '',
        password: '',
        FastFood: false,
        Burgers: false,
        Breakfast: false,
        Mexican: false,
        Bakery: false,
        Deserts: false,
        isShowLaunchPopup: false,
        isShowLogout: false
    }

    onAndroidBackPress = () => {
        this.props.navigation.navigate('Home')
        return true;
    }
    componentDidMount() {
        console.log("SyncStorage.get('Token')", SyncStorage.get('Token'))
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
        this.getToken();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    }

    constructor(props) {
        super(props);

    }

    async getToken() {
        try {
            const value = await AsyncStorage.getItem('accessToken')
            console.log("vvv", value)
            if (value !== null) {
                Config.userAuthToken = value;
            } if (value == null) {
                this.setState({ isShowLogout: true })
            }
        } catch (e) {
            // error reading value
        }
    }
    async logout() {

        try {
            await AsyncStorage.removeItem('accessToken');
            SyncStorage.set('Token', null);
            SyncStorage.set("savedAddressList", undefined);
            SyncStorage.set("OrderList", undefined)
            Config.userAuthToken = ''
            APIKit.selectedMenu = ''
            APIKit.savedAddressList = [];
            this.props.navigation.navigate('Login')
        }
        catch (exception) {
            return false;
        }
    }
    render() {
        const CS = Config.style;
        return (
            <SafeAreaView style={{ flex: 3, marginTop, backgroundColor: '#FFFFFF' }} >
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <Header style={{ paddingTop: 10 }}>
                    <Left style={CS.imageIcon}>
                        <Pressable onPress={() => this.props.navigation.toggleDrawer()}>
                            <Image source={AppImages.sideMenu} style={{ width: 18, height: 19, marginLeft: 0 }} />
                        </Pressable>
                    </Left>
                    <Text style={[CS.font12, CS.FW700, CS.FontBold, CS.MT5]}>Settings</Text>
                    {/* <Right>
                        <Pressable onPress={() => { this.props.navigation.navigate('ChangeEmail'); APIKit.previousScreen = this.props.navigation.state.routeName }} style={styles.headerIcon}>
                            <Image source={AppImages.Buy} style={{ resizeMode: 'contain', width: 22, height: 20, marginRight: 5 }} />
                        </Pressable>
                    </Right> */}
                </Header>
                {/* <Row>
                    <Col style={[CS.Col, CS.MT18]} sm={12} >
                        <Text style={[{ textAlign: 'center', fontSize: 30, fontWeight: 'bold', color: '#5CAC7D' }, CS.FontBold]}>
                            Coming soon</Text>
                    </Col>
                </Row> */}
                <View style={{ padding: 10 }}>
                    <Pressable onPress={() => { this.setState({ isShowLaunchPopup: true }) }}>
                        <Row style={[{ height: 50, borderBottomWidth: 3, borderBottomColor: '#F4F4F4', marginHorizontal: 6 }]}>
                            <Col sm={9} style={[{ justifyContent: 'center' }]}>
                                <Text style={[{ color: '#333333' }, CS.FW500, CS.FontMedium, CS.font14]}>Payment Methods</Text>
                            </Col>
                            <Col sm={3} style={[CS.Col]}>
                                <Row>
                                    <Col sm={9} style={[CS.Col, { alignItems: 'flex-end' }]}></Col>
                                    <Col sm={3} style={[CS.Col, { height: 50 }]}>
                                        <Image source={AppImages.right2} style={styles.arrowIcon} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Pressable>
                    <Pressable onPress={() => { this.setState({ isShowLaunchPopup: true }) }}>
                        <Row style={[{ height: 50, borderBottomWidth: 3, borderBottomColor: '#F4F4F4', marginHorizontal: 6 }]}>
                            <Col sm={9} style={[{ justifyContent: 'center' }]}>
                                <Text style={[{ color: '#333333' }, CS.FW500, CS.FontMedium, CS.font14]}>Change Email Address</Text>
                            </Col>
                            <Col sm={3} style={[CS.Col]}>
                                <Row>
                                    <Col sm={9} style={[CS.Col, { alignItems: 'flex-end' }]}></Col>
                                    <Col sm={3} style={[CS.Col, { height: 50 }]}>
                                        <Image source={AppImages.right2} style={styles.arrowIcon} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Pressable>
                    <Pressable onPress={() => { this.setState({ isShowLaunchPopup: true }) }}>
                        <Row style={[{ height: 50, borderBottomWidth: 3, borderBottomColor: '#F4F4F4', marginHorizontal: 6 }]}>
                            <Col sm={9} style={[{ justifyContent: 'center' }]}>
                                <Text style={[{ color: '#333333' }, CS.FW500, CS.FontMedium, CS.font14]}>Change Phone Number</Text>
                            </Col>
                            <Col sm={3} style={[CS.Col]}>
                                <Row>
                                    <Col sm={9} style={[CS.Col, { alignItems: 'flex-end' }]}></Col>
                                    <Col sm={3} style={[CS.Col, { height: 50 }]}>
                                        <Image source={AppImages.right2} style={styles.arrowIcon} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Pressable>
                    <Pressable>
                        <Row style={[{ height: 50, borderBottomWidth: 3, borderBottomColor: '#F4F4F4', marginHorizontal: 6 }]}>
                            <Col sm={9} style={[{ justifyContent: 'center' }]}>
                                <Text style={[{ color: '#333333' }, CS.FW500, CS.FontMedium, CS.font14]}>Notifications</Text>
                            </Col>
                            <Col sm={3} style={[CS.Col]}>
                                <Row>
                                    <Col sm={9} style={[CS.Col, { alignItems: 'flex-end' }]}>
                                        <Text style={[{ color: '#5CAC7D', justifyContent: 'center' }, CS.FW500, CS.FontMedium, CS.font14]}>Enabled</Text>
                                    </Col>
                                    <Col sm={3} style={[CS.Col]}>
                                        <Image source={AppImages.right2} style={styles.arrowIcon} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Pressable>
                    <View style={styles.divider}></View>
                    <Pressable>
                        <Row style={[{ height: 50, borderBottomWidth: 3, borderBottomColor: '#F4F4F4', marginHorizontal: 6 }]}>
                            <Col sm={9} style={[{ justifyContent: 'center' }]}>
                                <Text style={[{ color: '#333333' }, CS.FW500, CS.FontMedium, CS.font14]}>Language</Text>
                            </Col>
                            <Col sm={3} style={[CS.Col]}>
                                <Row>
                                    <Col sm={9} style={[CS.Col, { alignItems: 'flex-end' }]}>
                                        <Text style={[{ color: '#5CAC7D', justifyContent: 'center' }, CS.FW500, CS.FontMedium, CS.font14]}>English</Text>
                                    </Col>
                                    <Col sm={3} style={[CS.Col]}>
                                        <Image source={AppImages.right2} style={styles.arrowIcon} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Pressable>
                    <Pressable>
                        <Row style={[{ height: 50, borderBottomWidth: 3, borderBottomColor: '#F4F4F4', marginHorizontal: 6 }]}>
                            <Col sm={9} style={[{ justifyContent: 'center' }]}>
                                <Text style={[{ color: '#333333' }, CS.FW500, CS.FontMedium, CS.font14]}>Country</Text>
                            </Col>
                            <Col sm={3} style={[CS.Col]}>
                                <Row>
                                    <Col sm={9} style={[CS.Col, { alignItems: 'flex-end' }]}>
                                        <Text style={[{ color: '#5CAC7D', justifyContent: 'center' }, CS.FW500, CS.FontMedium, CS.font14]}>UAE</Text>
                                    </Col>
                                    <Col sm={3} style={[CS.Col]}>
                                        <Image source={AppImages.right2} style={styles.arrowIcon} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Pressable>
                    <View style={styles.divider}></View>
                    <Row Hidden={this.state.isShowLogout}>
                        <Pressable onPress={() => this.logout()}>
                            <Row style={[{ height: 50, marginHorizontal: 6 }]}>
                                <Col sm={12} style={[{ justifyContent: 'center' }]}>
                                    <Text style={[{ color: '#333333' }, CS.FW500, CS.FontMedium, CS.font14]}>Logout</Text>
                                </Col>
                            </Row>
                        </Pressable>
                    </Row>
                    {/* Hidden={Config.userAuthToken != ''} */}

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.isShowLaunchPopup}
                        onRequestClose={() => {
                            this.setState({ isShowLaunchPopup: !this.state.isShowLaunchPopup })
                        }}>
                        <View style={CS.blurBGView}>
                            <View style={[styles.modalView, styles.launchSoonPopup]}>
                                <Row size={12} >
                                    <Col sm={11} ></Col>
                                    <Col sm={1}>
                                        <Pressable onPress={() => { this.setState({ isShowLaunchPopup: false }) }}>
                                            <Icon name='close-sharp' size={30}></Icon>
                                        </Pressable>
                                    </Col>
                                    <Col sm={12} style={CS.Col}>
                                        <Image source={AppImages.launchingSoon} style={{ width: 261, height: 222, marginTop: 50 }} />
                                    </Col>
                                    <Col sm={12} style={CS.Col}>
                                        <Text style={[CS.font24, CS.FontBold, CS.FW700, CS.MT16]}>Launching Soon</Text>
                                    </Col>
                                    <Col sm={12} style={CS.Col}>
                                        <Text style={[CS.font20, CS.FontRegular, CS.FW400, { color: '#707070', textAlign: 'center', padding: '7%', paddingBottom: 0 }]}>This feature is not available right now but will be launched soon. </Text>
                                    </Col>
                                    <Col sm={12} style={CS.Col}>
                                        <Text style={[CS.font20, CS.FontRegular, CS.FW400, { color: '#442B7E', textAlign: 'center' }]}> Stay tuned!</Text>
                                    </Col>
                                </Row>
                            </View>
                        </View>
                    </Modal>


                </View>
            </SafeAreaView >
        );
    }
};

const styles = StyleSheet.create({
    launchSoonPopup: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: 600,
        padding: 15
    },
    menuList: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: Config.listBackgroundColor,
        borderBottomColor: Config.listSeparatorColor,
        borderBottomWidth: 2,
    },

    listText: {
        fontSize: 14, flex: 0.9, justifyContent: 'center'
    },
    listIcon: {
        flex: 0.1,
        marginTop: 15,
        justifyContent: 'flex-end',
        marginRight: -40
    },
    arrowIcon: {
        width: 10,
        height: 10,
    },
    divider: {
        height: 40,
        backgroundColor: Config.listSeparatorColor,
        marginLeft: -20,
        width: '110%',
        marginTop: -2
    },
    headerText: {
        flex: 1,
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#000000',
        fontWeight: 'bold',
        marginLeft: -20
    },
});

