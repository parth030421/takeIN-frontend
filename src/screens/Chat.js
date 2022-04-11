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
import APIKit from '../APIKit';
export default class Chat extends React.Component {

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
            <View style={{ backgroundColor: '#000000', height: '100%', width: '100%' }}>
                {/* <Wrapper >
                    <StatusBar backgroundColor="#d9dde7" barStyle="dark-content" />
                    <Header style={{ paddingTop: 10 }}>
                        <Left style={CS.imageIcon}>
                            <Pressable onPress={() => this.props.navigation.navigate('Home')}>
                                <Icon name='chevron-back-sharp' size={25} ></Icon>
                            </Pressable>
                            <Text style={[CS.font16, CS.FW500, CS.MT10, { height: 33 }]}>Takein Support</Text>
                        </Left>
                        <Right>

                            <Pressable onPress={() => { this.props.navigation.navigate('Cart'); APIKit.previousScreen = this.props.navigation.state.routeName }} style={styles.headerIcon}>

                            </Pressable>
                        </Right>
                    </Header>

                </Wrapper > */}
                <View style={{ backgroundColor: '#d9dde7', height: '100%', width: '100%' }}>
                    <StatusBar backgroundColor="#d9dde7" barStyle="dark-content" />
                    <Header style={{ paddingTop: 40 }}>
                        <Left style={CS.imageIcon}>
                            <Pressable onPress={() => this.props.navigation.navigate('Home')}>
                                <Icon name='chevron-back-sharp' size={25} ></Icon>
                            </Pressable>
                            <Pressable onPress={() => this.props.navigation.navigate('Home')}>
                                <Text style={[CS.font16, CS.FW500, CS.MT10, { height: 33 }]}>Takein Support</Text>
                            </Pressable>
                        </Left>
                        <Right>

                            <Pressable onPress={() => { this.props.navigation.navigate('Cart'); APIKit.previousScreen = this.props.navigation.state.routeName }} style={styles.headerIcon}>

                            </Pressable>
                        </Right>
                    </Header>
                    <Row>
                        <Col style={[CS.Col, CS.MT18]} sm={12} >
                            <Text style={[{ textAlign: 'center', fontSize: 30, fontWeight: 'bold', color: '#5CAC7D' }, CS.FontBold]}>
                                Coming soon</Text>
                        </Col>
                    </Row>
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

});