
import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Config from "../../Config";
import { AppImages } from "../../res";
import { Row, Col, Left, Center } from '../componentIndex';
class SelectPhoneCode extends Component {
    state = {
        modalVisible: false,
        selectedCountry: { "name": "Saudi Arabia", "flag": AppImages.SA, "code": AppImages.SA, "dial_code": "+966" },
    };

    countriesCode = [
        { "name": "Saudi Arabia", "flag": AppImages.SA, "code": AppImages.SA, "dial_code": "+966" },
        { "name": "UAE", "flag": AppImages.UAE, "code": AppImages.UAE, "dial_code": "+971" },
        { "name": "Egypt", "flag": "🇪🇬", "code": AppImages.EG, "dial_code": "+20" },
        { "name": "Bahrain", "flag": "🇧🇭", "code": AppImages.BR, "dial_code": "+973" },
        { "name": "Qatar", "flag": "🇶🇦", "code": AppImages.QR, "dial_code": "+974" },
        { "name": "Kuwait", "flag": "🇰🇼", "code": AppImages.KW, "dial_code": "+965" },
        { "name": "Yemen", "flag": "🇾🇪", "code": AppImages.YM, "dial_code": "+967" },
        { "name": "Jordan", "flag": "🇯🇴", "code": AppImages.JD, "dial_code": "+962" },
        { "name": "India", "flag": "🇮🇳", "code": AppImages.IN, "dial_code": "+91" }
    ]

    selectedFlag = { "name": "Saudi Arabia", "flag": "🇸🇦", "code": "SA", "dial_code": "+966" }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    onSelectCode(item) {
        console.log("sss", item)
        this.props.parentCallback(item);
        this.setState({ selectedCountry: item })
        // if (item.code == '+966') {
        //     this.selectedFlag = '+966';
        // } else {
        //     this.selectedFlag = item.flag;
        // }

        this.setModalVisible(false);
    }

    componentDidMount() {

    }

    render() {
        const { modalVisible } = this.state;
        const CS = Config.style;
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!modalVisible);
                    }}
                >
                    <Pressable style={styles.centeredView} onPressOut={() => { this.setModalVisible(false) }}>
                        <View style={styles.modalView}>
                            <ScrollView keyboardShouldPersistTaps={'handled'} style={{ width: 260 }}>
                                {this.countriesCode.map((item) => (
                                    <Pressable key={item.dial_code} onPress={() => this.onSelectCode(item)} >
                                        <Row style={styles.menuList}>
                                            <Col sm={2} style={[CS.Col]}>
                                                <Image source={item.code} style={{ resizeMode: 'contain', width: 29, height: 19, marginRight: 5 }} />

                                            </Col>
                                            <Col sm={6.5} >
                                                <Text style={[styles.listText, CS.font18, CS.FW400]}>{item.name}</Text>
                                            </Col>
                                            <Col sm={3.5} style={[CS.Col]}>
                                                <Text style={[styles.listText, CS.font18, CS.FW400, CS.FontRegular, { color: '#999999', marginLeft: 15 }]}>{item.dial_code}</Text>
                                            </Col>
                                        </Row>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    </Pressable>
                </Modal>
                <Pressable onPress={() => this.setModalVisible(true)}>
                    <Row size={12}>
                        <Col>
                            <Image source={this.state.selectedCountry.code} style={{ width: 37, height: 24, marginTop: 6 }} />
                        </Col>
                        <Col>
                            <Text style={[CS.FW400, CS.font28, CS.FontRegular, { color: '#999999', marginLeft: 2 }]}>{this.state.selectedCountry.dial_code}</Text>
                        </Col>
                    </Row>

                </Pressable>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#00000030'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        width: 275,
        height: 384,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
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
        // paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: Config.listBackgroundColor,
        borderBottomColor: Config.listSeparatorColor,
        borderBottomWidth: 2,
        width: 260,
    },

    listText: {
        fontSize: 30,
    },
    listIcon: {
        fontSize: 28,
        marginTop: 4
    },
    flagBox: {
        fontSize: 28,
        paddingTop: 0,
        maxHeight: 25
        // maxWidth: 70,
        // justifyContent: 'center',
        // alignItems: 'center',
    }
});

export default SelectPhoneCode;