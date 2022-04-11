import React from 'react';
import {
    StyleSheet,
    View, Pressable, Image,
    StatusBar, Text, BackHandler
} from 'react-native';
import { Wrapper, Header, MenuButton, Left, Right, Footer, RestaurantList, Container, Search, Row, Col, AddressSelect, ProgressiveImage } from './../components/componentIndex';
import Icon from "react-native-vector-icons/Ionicons";
import Config from '../Config';
import { AppImages } from '../res';
export default class Wallet extends React.Component {

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

            <Wrapper>
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <Header style={{ paddingTop: 10 }}>
                    <Left style={CS.imageIcon}>
                        <Pressable onPress={() => this.props.navigation.toggleDrawer()}>
                            <Image source={AppImages.sideMenu} style={{ width: 22, height: 22, marginLeft: 0 }} />
                        </Pressable>
                    </Left>
                    <Text style={[CS.font16, CS.FW500, CS.MT10]}>Wallet</Text>
                    <Right>
                        {/* <Pressable onPress={() => this.props.navigation.navigate('Notifications')} style={styles.headerIcon}>
                            <Image source={AppImages.Notification} style={{ resizeMode: 'contain', flex: 1, width: 22, height: 20 }} />
                        </Pressable> */}
                        <Pressable onPress={() => { this.props.navigation.navigate('Cart'); APIKit.previousScreen = this.props.navigation.state.routeName }} style={styles.headerIcon}>
                            <Image source={AppImages.Buy} style={{ resizeMode: 'contain', flex: 1, width: 22, height: 20 }} />
                        </Pressable>
                    </Right>
                </Header>
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

});