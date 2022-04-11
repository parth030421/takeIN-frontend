
import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, ScrollView, Pressable, View, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput } from "react-native";
import { AppImages } from "../../res";
import Icon from "react-native-vector-icons/Ionicons";
import Config from "../../Config";
import { Row, Col, TrackMap, GoogleAutocomplete, SignIn } from '../componentIndex';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import APIKit from "../../APIKit";
const keyboardVerticalOffset = Platform.OS === 'ios' ? -20 : -350
class AddAddress extends Component {
    state = {
        AddModalVisible: false,
        Isbuttondisable: true,
        isShowLoginPopup: false

    };

    setModalVisible = (visible) => {
        APIKit.getAddress();
        this.setState({ AddModalVisible: visible });
    }

    setLoginModalVisible = (visible) => {
        this.setState({ isShowLoginPopup: visible });
    }


    componentDidMount() {

    }

    Isbuttondisable() {
        if (this.state.nickName && this.state.addressLine2 && this.state.phoneNumber && APIKit.location != {}) {
            return false
        } else {
            return true
        }
    }

    openMap() {
        // console.log("open")
        this.setModalVisible(false)
    }

    closeModal = () => {
        this.setLoginModalVisible(false);
        this.setModalVisible(false);
    }
    render() {
        const { AddModalVisible } = this.state;
        const CS = Config.style
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={AddModalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(false);
                    }}
                >

                    <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset} style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <Row size={12}>
                                <Col sm={11}><Text style={[styles.modalText, Config.style.font18, Config.style.FW700]}>Add New Address</Text></Col>
                                <Col sm={1}>
                                    <Pressable onPress={() => this.setModalVisible(!AddModalVisible)}>
                                        <Icon name='close-sharp' size={30}></Icon>
                                    </Pressable></Col>
                                <Col sm={12}><Text style={[CS.font14, CS.MT10, CS.FW500, { textAlign: 'left' }]}>Nickname</Text></Col>
                                <Col sm={12}>
                                    <TextInput placeholder={'Home'} returnKeyType='done' onChangeText={text => this.setState({ nickName: text })}
                                        value={this.state.nickName}
                                        maxLength={18} placeholderStyle={{ fontWeight: '500', fontFamily: 'Ubuntu-Regular', fontSize: 12 }} placeholderTextColor={'#999999'} style={[CS.MT5, CS.formInput]} textBreakStrategy={'simple'} />
                                    {this.state.emailValid ? (<Text style={styles.errorText}>Email id is required and should be in correct format</Text>) : null}
                                </Col>
                                <Col sm={12}><Text style={[CS.font14, CS.MT10, CS.FW500]}>Area</Text></Col>
                                <Col sm={12}>
                                    <GoogleAutocomplete></GoogleAutocomplete>
                                </Col>
                                <Col sm={12}><Text style={[CS.font14, CS.MT10, CS.FW500]}>Address</Text></Col>
                                <Col sm={12}>
                                    <TextInput placeholder={'Line 2'} returnKeyType='done' onChangeText={text => this.setState({ addressLine2: text })} style={[CS.MT5, CS.formInput]} placeholderStyle={CS.font16} placeholderTextColor={'#999999'} textBreakStrategy={'simple'} />
                                </Col>
                                <Col sm={12}><Text style={[CS.font14, CS.MT10, CS.FW500]}>Phone number</Text></Col>
                                <Col sm={12}>
                                    <TextInput placeholder={'Phone number'} returnKeyType='done' keyboardType='number-pad' onChangeText={text => this.setState({ phoneNumber: text })} placeholderStyle={CS.font16} placeholderTextColor={'#999999'} style={[CS.MT5, CS.formInput]} textBreakStrategy={'simple'} />
                                </Col>

                                <Col sm={12} Hidden={!this.Isbuttondisable()} style={[CS.Col, CS.greenBtn, CS.MT18, { opacity: 0.5, marginBottom: 40 }]}>
                                    <Text style={[CS.font16, CS.FW500, CS.FontBold, CS.whiteText]}>Set pin on map</Text>
                                </Col>
                                <Col sm={12} Hidden={this.Isbuttondisable()} style={[CS.Col, CS.MT18, { marginBottom: 40 }]}>
                                    <TrackMap addressData={{
                                        "nickName": this.state.nickName,
                                        "addressLine1": this.state.addressLine1,
                                        "addressLine2": this.state.addressLine2,
                                        "phoneNumber": this.state.phoneNumber,
                                        // "isDefault": false
                                    }} closeModal={this.closeModal}></TrackMap>
                                </Col>
                            </Row>








                            {/* <Pressable
                                activeOpacity={0.5}
                                style={[CS.Col, { paddingTop: 10 }, this.Isbuttondisable() ? { opacity: 0.5 } : { opacity: 1 }]} disabled={this.Isbuttondisable()}
                                onPress={() => this.setModalVisible(!modalVisible)}
                            >
                               
                            </Pressable> */}
                        </View>
                    </KeyboardAvoidingView>

                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isShowLoginPopup}
                    onRequestClose={() => {
                        this.setLoginModalVisible(!this.state.isShowLoginPopup);
                    }}>
                    <View style={CS.blurBGView}>
                        <View style={[styles.modalView, { width: '100%', padding: 0, paddingBottom: 0 }]}>
                            <SignIn navigation={this.props.navigation} closeModal={this.closeModal}></SignIn>
                        </View>
                    </View>
                </Modal>

                <Pressable onPress={() => { Config.userAuthToken == null ? this.setLoginModalVisible(true) : this.setModalVisible() }}>
                    <Text style={[CS.font16, CS.FW700]}>{this.props.title}</Text>
                </Pressable>

                {/* <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.searchMenupopup}
                        onRequestClose={() => {
                            this.setModalVisible(!deletePopupVisible);
                        }}>
                        <View style={CS.centeredView}>
                            <View style={CS.modalView}>
                                <View style={[Config.style.MT12]}>
                               
                                                                </View>
                            </View>
                        </View>
                    </Modal>
                </View > */}
            </View >
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    modalView: {
        width: '100%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        paddingBottom: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "left",
        fontWeight: 'bold',
    },
    menuList: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: Config.listBackgroundColor,
        borderBottomColor: Config.listSeparatorColor,
        borderBottomWidth: 2,
        width: '100%',
    },

    listText: {
        fontSize: 14, fontWeight: 'bold', flex: 0.8, justifyContent: 'center', paddingTop: 10
    },
    listIcon: {
        flex: 0.2,
        marginTop: 5,
        justifyContent: 'flex-end',
        marginRight: -30
    },
    checkbox: {
        alignSelf: "center",
        width: 30,
        height: 30,
        color: Config.primaryColor
    },
    boxInput: {
        // borderColor: '#CED6E0',
        // borderWidth: 2
        marginTop: 5
    },

});

export default AddAddress;