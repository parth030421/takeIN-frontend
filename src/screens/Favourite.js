import React from 'react';
import {
    StyleSheet,
    View, Pressable, Image,
    StatusBar, Text, BackHandler
} from 'react-native';
import { Wrapper, Header, MenuButton, Left, Right, Footer, RestaurantList, Container, Search, Row, Col, AddressSelect, ProgressiveImage } from '../components/componentIndex';
import Icon from "react-native-vector-icons/Ionicons";
import Config from '../Config';
import { AppImages } from '../res';
import APIKit from '../APIKit';

export default class Favourite extends React.Component {

    state = {};
    ResturentList = [];
    onAndroidBackPress = () => {
        this.props.navigation.navigate('Home')
        return true;
    }
    componentDidMount() {
        this.getFavoriteRestaurant();
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
    }

    getFavoriteRestaurant() {
        fetch(Config.baseUrl + 'favourite/restaurant', {
            method: 'GET',
            headers: APIKit.CommonHeaders
        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log("isFavoriteRestaurant", responseJson.success.data.favouriteRestaurant)
                if (responseJson) {
                    this.ResturentList = responseJson.success.data.favouriteRestaurant;
                    console.log("responseJson.success.data", this.ResturentList)
                }

            })
            .catch((error) => {
                console.error("isFavoriteRestaurant", error);
            });
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

            <Wrapper>
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <Header style={{ paddingTop: 10 }}>
                    <Left style={CS.imageIcon}>
                        <Pressable onPress={() => this.props.navigation.toggleDrawer()}>
                            <Image source={AppImages.sideMenu} style={{ width: 22, height: 22, marginLeft: 0 }} />
                        </Pressable>
                    </Left>
                    <Text style={[CS.font16, CS.FW500, CS.MT10]}>Favourite</Text>
                    <Right>
                        {/* <Pressable style={styles.headerIcon}>
                            <Image source={AppImages.selectMenu} style={[{ width: 22, height: 22 }]} />
                        </Pressable> */}
                    </Right>
                </Header>
                <Row style={[{ flex: 1 }, CS.MT14]} Hidden={this.ResturentList.length == 0}>
                    <RestaurantList restaurantList={this.ResturentList} navigation={this.props.navigation}></RestaurantList>
                </Row>
                <Row>
                    <Col style={[CS.Col, CS.MT18]} sm={12} >
                        <Text style={[{ textAlign: 'center', fontSize: 30, fontWeight: 'bold', color: '#5CAC7D' }, CS.FontBold]}>
                            Coming soon</Text>
                    </Col>
                </Row>

            </Wrapper>

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