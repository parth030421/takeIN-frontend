
import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, ScrollView, Pressable, View, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput } from "react-native";
import { AppImages } from "../../res";
import Icon from "react-native-vector-icons/Ionicons";
import Config from "../../Config";
import { Row, Col } from '../componentIndex';
import AsyncStorage from '@react-native-async-storage/async-storage';
class SignIn extends Component {
    async logout() {
        try {
            await AsyncStorage.removeItem('accessToken');
            Config.userAuthToken = ''
            APIKit.selectedMenu = ''
            this.props.navigation.navigate('Login')
        }
        catch (exception) {
            return false;
        }
    }
    render() {
        const CS = Config.style
        return (
            <Row size={12} style={[styles.modalView]}>
                <Col sm={11}><Text style={[styles.modalText, CS.font20, CS.FW500, CS.FontMedium]}>Login first to continue.</Text></Col>
                <Col sm={1}>
                    <Pressable onPress={() => this.props.closeModal(true)}>
                        <Icon name='close-sharp' size={30}></Icon>
                    </Pressable>
                </Col>
                <Col sm={12}>
                    <Pressable onPress={() => { this.props.navigation.navigate('Login') }} style={[Config.style.greenBtn, CS.Col, { borderColor: '#333333', borderWidth: 2, backgroundColor: '#ffffff' }]}>
                        <Text style={[CS.font14, CS.FontBold, CS.FW700, { color: '#333333' }]}>Sign in</Text>
                    </Pressable>
                </Col>
                <Col sm={12}>
                    <Pressable onPress={() => { this.props.navigation.navigate('Login') }} style={[Config.style.greenBtn, CS.Col]}>
                        <Text style={[CS.font14, CS.FontBold, CS.whiteText, CS.FW700]}>Create new account</Text>
                    </Pressable>
                </Col>

            </Row>
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
        // height: 440,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        paddingBottom: 35,
        paddingTop: 20,
        width: '100%',
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

export default SignIn;