import React from 'react';
import {
    StyleSheet,
    Pressable,
    Image,
    View,
    Text,
    SafeAreaView,
    StatusBar,
    Platform,
    BackHandler, Modal
} from 'react-native';
import { AppImages } from '../res';
import Config from '../Config';
import LottieView from 'lottie-react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { Footer, Button, Wrapper, Header, Left, Right, H4, Container, Space, Row, Col, H3, LabelIconInput, P, SelectPhoneCode } from '../components/componentIndex';
const marginTop = Platform.OS === 'ios' ? 0 : 0;
import APIKit from '../APIKit';
export default class OrderStatus extends React.Component {
    state = {
        ShowLaunchPopup: false
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
    onAndroidBackPress = () => {
        this.props.navigation.navigate('Home')
        return true;
    }
    componentDidMount() {
        // setTimeout(() => {
        //     this.setShowLaunchPopup(true)
        // }, 1500)
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
    }

    setShowLaunchPopup = (visible) => {
        this.setState({ ShowLaunchPopup: visible });
    }

    closeModal = () => {
        this.setShowLaunchPopup(false);
    }

    render() {
        const CS = Config.style;
        const footer = (
            <Footer>
                <Row>
                    <Col Hidden={APIKit.orderStatus == 'error'} sm={12}>
                        <Pressable onPress={() => this.props.navigation.navigate('Home')}
                            style={[CS.greenBtn]} >
                            <Text style={[CS.boldText, CS.whiteText]}>Home</Text>
                        </Pressable>
                    </Col>
                    <Col Hidden={APIKit.orderStatus == 'done'} sm={12}>
                        <Pressable onPress={() => { APIKit.previousScreen = 'Home'; this.props.navigation.navigate('Cart') }}
                            style={[CS.greenBtn]} >
                            <Text style={[CS.boldText, CS.whiteText]}>Back to cart</Text>
                        </Pressable>
                    </Col>
                </Row>
            </Footer>
        );
        return (
            <Wrapper footer={footer} style={{ marginTop }}>
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <Row>
                    <Col Hidden={APIKit.orderStatus == 'error'}>
                        <Row>
                            <Col sm={12}>
                                <Pressable onPress={() => this.props.navigation.navigate('Home')} style={{ margin: 18 }} >
                                    <Icon name='close' size={30}></Icon>
                                </Pressable>
                            </Col>
                        </Row>
                        <Row style={[{ marginTop: '20%' }]}>
                            <Col style={[CS.Col]} sm={12}>
                                <Image source={AppImages.doneGIF} style={{ width: 180, height: 180, marginLeft: 0 }} />
                            </Col>
                            <Col style={[CS.Col]} sm={12}><Text style={[CS.MT18, CS.FontBold, { fontSize: 30, fontWeight: '700', color: '#442B7E', paddingVertical: 0, padding: 55, textAlign: 'center' }]}>
                                Order successfully placed</Text></Col>
                            <Col style={[CS.Col]} sm={12}><Text style={[CS.MT18, CS.FontRegular, { fontSize: 16, fontWeight: '400', padding: 15, paddingVertical: 0, textAlign: 'center', color: '#333333' }]}>Explore the app, Find some peace of mind to prepare for meditation.</Text></Col>
                        </Row>
                    </Col>
                    <Col Hidden={APIKit.orderStatus == 'done'}>
                        <Row>
                            <Col sm={12}>
                                <Pressable onPress={() => { APIKit.previousScreen = 'Home'; this.props.navigation.navigate('Cart') }} style={{ margin: 18 }} >
                                    <Icon name='close' size={30}></Icon>
                                </Pressable>
                            </Col>
                        </Row>
                        <Row style={[{ marginTop: '20%' }]}>
                            <Col style={[CS.Col]} sm={12}>
                                <Image source={AppImages.errorGIF} style={{ width: 180, height: 180, marginLeft: 0 }} />
                            </Col>
                            <Col style={[CS.Col]} sm={12}><Text style={[CS.MT18, CS.FontBold, { fontSize: 30, fontWeight: '700', color: '#C6345C', paddingVertical: 0, padding: 55, textAlign: 'center' }]}>
                                Something went
                                wrong!</Text></Col>
                            <Col style={[CS.Col]} sm={12}><Text style={[CS.MT18, CS.FontRegular, { fontSize: 16, fontWeight: '400', padding: 15, paddingVertical: 0, textAlign: 'center', color: '#333333' }]}>Explore the app, Find some peace of mind to prepare for meditation.</Text></Col>
                        </Row>
                    </Col>
                </Row>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.ShowLaunchPopup}
                    onRequestClose={() => {
                        navigation.setParams({ isShowLaunchPopup: false })
                        // navigation.getParam('isShowLaunchPopup') = false
                    }}>
                    <View style={CS.blurBGView}>
                        <View style={[styles.modalView, styles.launchSoonPopup]}>
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
                                    <Pressable onPress={() => this.closeModal()}
                                        style={[CS.greenBtn]} >
                                        <Text style={[CS.boldText, CS.whiteText]}>order now</Text>
                                    </Pressable>
                                </Col>
                                <Col sm={12} style={[CS.Col, { paddingTop: 10 }]}>
                                    <Pressable onPress={() => this.closeModal()}>
                                        <Text style={[CS.boldText, { color: '#9586A8' }]}>Dismiss</Text>
                                    </Pressable>
                                </Col>
                            </Row>
                        </View>
                    </View>
                </Modal>
            </Wrapper>
        )
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

})