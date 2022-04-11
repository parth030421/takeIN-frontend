import React from 'react';
import {
    View,
    Text, Image, StatusBar, Pressable, StyleSheet, BackHandler
} from 'react-native';
import { Wrapper, Header, Left, Right, Footer, RestaurantList, Container, Search, Row, Col, AddressSelect, ProgressiveImage } from './../components/componentIndex';
import Icon from "react-native-vector-icons/Ionicons";
import { AppImages } from '../res';
import Config from '../Config';
import APIKit from '../APIKit';

export default class Notifications extends React.Component {

    state = {};

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
    onAndroidBackPress = () => {
        this.props.navigation.navigate(APIKit.previousScreen)
        return true;
    }
    componentDidMount() {
        this.props.navigation.navigate('Home', {
            isShowLaunchPopup: true
        })
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
    }
    render() {
        const CS = Config.style
        return (

            <Wrapper>
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <Header style={{ paddingTop: 10 }}>
                    <Left style={CS.imageIcon}>
                        <Pressable onPress={() => this.props.navigation.navigate(APIKit.previousScreen)} >
                            <Icon name="arrow-back-sharp" size={28}></Icon>
                        </Pressable>
                    </Left>
                    <Text style={[CS.font16, CS.FW500, CS.MT10]}>Notifications</Text>
                    <Right>

                        <Pressable onPress={() => { this.props.navigation.navigate('Cart'); APIKit.previousScreen = this.props.navigation.state.routeName }} style={styles.headerIcon}>
                            <Image source={AppImages.Buy} style={{ resizeMode: 'contain', flex: 1, width: 22, height: 20 }} />
                        </Pressable>
                    </Right>
                </Header>

                <Container>
                    <Text>Today</Text>
                    <View style={{
                        flex: 1,
                        justifyContent: 'space-evenly',
                        flexDirection: "row",
                        marginTop: 10
                    }}>
                        <View style={{ flex: 0.15 }}>
                            <View style={{ backgroundColor: '#5AA77A', borderRadius: 20, height: 40, width: 40, padding: 8, color: '#FFFFFF' }}>
                                <Image
                                    source={AppImages.tray}
                                    style={{ width: 25, height: 25, resizeMode: 'cover' }}
                                />
                            </View>

                        </View>
                        <View style={{ flex: 0.8 }}>
                            <Text style={CS.font14}>Order Accepted</Text>
                            <Text style={[CS.font10, CS.greyText]}>Pizza hut accepted your order (See Detail)</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={[CS.font10, CS.greyText]}>02:20 pm</Text>
                        </View>
                    </View>
                    <View style={{
                        flex: 1,
                        justifyContent: 'space-evenly',
                        flexDirection: "row",
                        marginTop: 10
                    }}>
                        <View style={{ flex: 0.15 }}>
                            <View style={{ backgroundColor: '#C6345C', borderRadius: 20, height: 40, width: 40, padding: 8, color: '#FFFFFF' }}>
                                <Image
                                    source={AppImages.tray}
                                    style={{ width: 25, height: 25, resizeMode: 'cover' }}
                                />
                            </View>

                        </View>
                        <View style={{ flex: 0.8 }}>
                            <Text style={CS.font14}>Order Rejected</Text>
                            <Text style={[CS.font10, CS.greyText]}>Pizza Hut Rejected your request(See more details)</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={[CS.font10, CS.greyText]}>02:20 pm</Text>
                        </View>
                    </View>
                    <View style={{
                        flex: 1,
                        justifyContent: 'space-evenly',
                        flexDirection: "row",
                        marginTop: 10
                    }}>
                        <View style={{ flex: 0.15 }}>
                            <View style={{ backgroundColor: '#D9ae56', borderRadius: 20, height: 40, width: 40, padding: 8, color: '#FFFFFF' }}>
                                <Image
                                    source={AppImages.tray}
                                    style={{ width: 25, height: 25, resizeMode: 'cover' }}
                                />
                            </View>

                        </View>
                        <View style={{ flex: 0.8 }}>
                            <Text style={[CS.font14]}>Reservation Submited</Text>
                            <Text style={[CS.font10, CS.greyText]}>Your Reservation is submitted successfully and we will get back to you as soon as posible</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={[CS.font10, CS.greyText]}>03:25 pm</Text>
                        </View>
                    </View>

                    <View style={{
                        flex: 1,
                        justifyContent: 'space-evenly',
                        flexDirection: "row",
                        marginTop: 10
                    }}>
                        <View style={{ flex: 0.15 }}>
                            <View style={{ backgroundColor: '#452b7d', borderRadius: 20, height: 40, width: 40, padding: 8, color: '#FFFFFF' }}>
                                <Image
                                    source={AppImages.tray}
                                    style={{ width: 25, height: 25, resizeMode: 'cover' }}
                                />
                            </View>

                        </View>
                        <View style={{ flex: 0.8 }}>
                            <Text style={[CS.font14]}>Order Delivered</Text>
                            <Text style={[CS.font10, CS.greyText]}>Your order is delivered fromPizza Hut, Enjoy your order</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={[CS.font10, CS.greyText]}>02:20 pm</Text>
                        </View>
                    </View>

                    <Text style={{ marginTop: 20 }}>Yesterday</Text>

                    {/* <View style={{
                        flex: 1,
                        justifyContent: 'space-evenly',
                        flexDirection: "row",
                        marginTop: 10
                    }}>
                        <View style={{ flex: 0.15 }}>
                            <View style={{ borderRadius: 20, height: 40, width: 40 }}>
                                <Image
                                    source={require('../../assets/img/PizzaHut.svg')}
                                    style={{ width: 40, height: 40, resizeMode: 'cover' }}
                                />
                            </View>

                        </View>
                        <View style={{ flex: 0.8 }}>
                            <Text style={{ fontSize: 13 }}>Pizza Hut Offer</Text>
                            <Text style={{ color: '#9c9898', fontSize: 11 }}>15 % off on any items in the menu from 1 july to 30 aug</Text>
                            <View>
                                <Image
                                    source={require('../../assets/img/pizza-hut-coupons.png')}
                                    style={{ width: '100%', height: 170, resizeMode: 'cover', borderRadius: 10, marginTop: 5 }}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={{ color: '#9c9898', fontSize: 11 }}>02:20 pm</Text>
                        </View>
                    </View> */}
                    <View style={{
                        flex: 1,
                        justifyContent: 'space-evenly',
                        flexDirection: "row",
                        marginTop: 10
                    }}>
                        <View style={{ flex: 0.15 }}>
                            <View style={{ backgroundColor: '#5AA77A', borderRadius: 20, height: 40, width: 40, padding: 8, color: '#FFFFFF' }}>
                                <Image
                                    source={AppImages.tray}
                                    style={{ width: 25, height: 25, resizeMode: 'cover' }}
                                />
                            </View>

                        </View>
                        <View style={{ flex: 0.8 }}>
                            <Text style={CS.font14}>Order Accepted</Text>
                            <Text style={[CS.font10, CS.greyText]}>Pizza hut accepted your order (See Detail)</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={[CS.font10, CS.greyText]}>02:20 pm</Text>
                        </View>
                    </View>
                    <View style={{
                        flex: 1,
                        justifyContent: 'space-evenly',
                        flexDirection: "row",
                        marginTop: 10
                    }}>
                        <View style={{ flex: 0.15 }}>
                            <View style={{ backgroundColor: '#C6345C', borderRadius: 20, height: 40, width: 40, padding: 8, color: '#FFFFFF' }}>
                                <Image
                                    source={AppImages.tray}
                                    style={{ width: 25, height: 25, resizeMode: 'cover' }}
                                />
                            </View>

                        </View>
                        <View style={{ flex: 0.8 }}>
                            <Text style={CS.font14}>Order Rejected</Text>
                            <Text style={[CS.font10, CS.greyText]}>Pizza Hut Rejected your request(See more details)</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={[CS.font10, CS.greyText]}>02:20 pm</Text>
                        </View>
                    </View>
                    <View style={{
                        flex: 1,
                        justifyContent: 'space-evenly',
                        flexDirection: "row",
                        marginTop: 10
                    }}>
                        <View style={{ flex: 0.15 }}>
                            <View style={{ backgroundColor: '#D9ae56', borderRadius: 20, height: 40, width: 40, padding: 8, color: '#FFFFFF' }}>
                                <Image
                                    source={AppImages.tray}
                                    style={{ width: 25, height: 25, resizeMode: 'cover' }}
                                />
                            </View>

                        </View>
                        <View style={{ flex: 0.8 }}>
                            <Text style={[CS.font14]}>Reservation Submited</Text>
                            <Text style={[CS.font10, CS.greyText]}>Your Reservation is submitted successfully and we will get back to you as soon as posible</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={[CS.font10, CS.greyText]}>03:25 pm</Text>
                        </View>
                    </View>

                    <View style={{
                        flex: 1,
                        justifyContent: 'space-evenly',
                        flexDirection: "row",
                        marginTop: 10
                    }}>
                        <View style={{ flex: 0.15 }}>
                            <View style={{ backgroundColor: '#452b7d', borderRadius: 20, height: 40, width: 40, padding: 8, color: '#FFFFFF' }}>
                                <Image
                                    source={AppImages.tray}
                                    style={{ width: 25, height: 25, resizeMode: 'cover' }}
                                />
                            </View>

                        </View>
                        <View style={{ flex: 0.8 }}>
                            <Text style={[CS.font14]}>Order Delivered</Text>
                            <Text style={[CS.font10, CS.greyText]}>Your order is delivered fromPizza Hut, Enjoy your order</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={[CS.font10, CS.greyText]}>02:20 pm</Text>
                        </View>
                    </View>
                </Container>
            </Wrapper >

        );
    }
}


const styles = StyleSheet.create({
    headerIcon: {
        marginRight: 12
    }

})