import React from 'react';
import {
    StyleSheet,
    View, Pressable, Image,
    StatusBar, Text, BackHandler
} from 'react-native';
import { Wrapper, Header, MenuButton, Left, Right, Footer, FooterTabs, Container, Search, Row, Col, AddressSelect, ProgressiveImage } from './../components/componentIndex';
import Icon from "react-native-vector-icons/Ionicons";
import Config from '../Config';
import { AppImages } from '../res';
import APIKit from '../APIKit';
export default class Deals extends React.Component {

    state = {};

    onAndroidBackPress = () => {
        this.props.navigation.navigate('Home')
        return true;
    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    }

    constructor(props) {
        super(props);
    }


    render() {

        const { order } = this.state;
        const CS = Config.style
        return (

            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.9 }}>
                    <Wrapper>
                        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                        <Header style={{ paddingTop: 10 }}>
                            <Left style={CS.imageIcon}>
                                {/* <Pressable onPress={() => this.props.navigation.toggleDrawer()}>
                            <Image source={AppImages.sideMenu} style={{ width: 22, height: 22, marginLeft: 0 }} />
                        </Pressable> */}
                            </Left>
                            <Text style={[CS.font16, CS.FW500, CS.MT10]}>Deals</Text>
                            <Right>
                                {/* <Pressable onPress={() => this.props.navigation.navigate('Notifications')} style={styles.headerIcon}>
                            <Image source={AppImages.Notification} style={{ resizeMode: 'contain', flex: 1, width: 22, height: 20 }} />
                        </Pressable> */}
                                <Pressable onPress={() => { this.props.navigation.navigate('Cart'); APIKit.previousScreen = this.props.navigation.state.routeName }} style={styles.headerIcon}>
                                    <Image source={AppImages.Buy} style={{ resizeMode: 'contain', flex: 1, width: 22, height: 20 }} />
                                </Pressable>
                            </Right>
                        </Header>

                    </Wrapper>
                </View>
                <View style={{ flex: 0.1 }}>
                    <FooterTabs navigation={this.props.navigation}></FooterTabs>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
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