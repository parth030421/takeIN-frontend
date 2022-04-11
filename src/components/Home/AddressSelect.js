
import React, { Component, Suspense } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { AppImages } from "../../res";
import Config from "../../Config";
import { Row, Col, RadioButton, AddAddress } from '../componentIndex';
import Icon from "react-native-vector-icons/Ionicons";
import APIKit from "../../APIKit";

export default class AddressSelect extends React.Component {
    state = {
        modalVisible: false,
        loading: true,
        savedAddressList: []
    };

    setAddModalVisible = (visible) => {
        setInterval(() => {
            if (!APIKit.selectAddressPopup) {
                if (this.props.pageName == 'checkout') {
                    this.props.closeModal(true)
                }
                this.setState({ modalVisible: false });
            }
        }, 1000)
        APIKit.selectAddressPopup = visible
        this.setState({ savedAddressList: APIKit.savedAddressList })
        this.setState({ modalVisible: visible });
    }


    componentDidMount() {
        APIKit.getAddress();
    }
    onDefaultChange(id) {
        APIKit.setDefaultAddress(id);
        APIKit.getAddress();
        APIKit.savedAddressList.forEach((item) => {
            if (item.isDefault) {
                this.locationTitle = item.nickName
                // APIKit.locationTitle = item.addressLine1.split(',')[0]
                // if (APIKit.locationTitle.length > 30) {
                //     APIKit.locationTitle = APIKit.locationTitle.split('-')[0]
                // }
            }
        })
        this.setState({ savedAddressList: APIKit.savedAddressList })
        this.setAddModalVisible(false)
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
                        this.setAddModalVisible(false);
                    }}
                >
                    <TouchableOpacity style={styles.centeredView} onPress={()=>this.setAddModalVisible(false)}>
                        <View style={styles.modalView}>
                            <Row size={12} Hidden={this.state.savedAddressList.length == 0}>
                                <Col sm={11} ><Text style={[styles.modalText, Config.style.font18, Config.style.FW700]}>Select your area</Text></Col>
                                <Col sm={1}>
                                    <Pressable onPress={() => this.setAddModalVisible(!modalVisible)}>
                                        <Icon name='close-sharp' size={30}></Icon>
                                    </Pressable>
                                </Col>
                            </Row>
                            <ScrollView>
                                <Row Hidden={this.state.savedAddressList.length == 0} style={{ paddingTop: 10 }}>
                                    {this.state.savedAddressList.map((list) => (
                                        <Pressable onPress={() => this.onDefaultChange(list._id)}>
                                            <Row key={list._id} >
                                                <Col sm={1}>
                                                    <Image source={AppImages.HomeBlue} style={[Config.style.MR10, { width: 18, height: 18, marginTop: -4 }]} />
                                                </Col>
                                                <Col sm={11}>
                                                    <Text style={[Config.style.font14, Config.style.FW700]}>{list.nickName}</Text>
                                                </Col>
                                                <Col sm={11}>
                                                    <Text style={[Config.style.font16, Config.style.FW500, Config.style.MT5, { textAlign: 'left' }]}>{list.addressLine1} - {list.addressLine2}</Text>
                                                </Col>
                                                <Col sm={1}>
                                                    <RadioButton style={{
                                                        width: 25,
                                                        height: 25,
                                                        borderColor: Config.primaryColor,
                                                        borderWidth: 2,
                                                    }}
                                                        innerBackgroundColor={Config.primaryColor}
                                                        isActive={list.isDefault}
                                                        onPress={() => this.onDefaultChange(list._id)}
                                                        innerContainerStyle={{ height: 18, width: 18 }}></RadioButton></Col>
                                                <Col sm={12} style={Config.style.listDivider}></Col>
                                            </Row>
                                        </Pressable>
                                    ))}
                                </Row>


                            </ScrollView>
                            {/* <Row size={12} style={CS.Col}>
                                <Col sm={11}><Text style={[styles.modalText, Config.style.font18, Config.style.FW700]}>Select your area</Text></Col>
                                <Col sm={1}>
                                    <Pressable onPress={() => this.setAddModalVisible(!modalVisible)}>
                                        <Icon name='close-sharp' size={30}></Icon>
                                    </Pressable>
                                </Col>
                            </Row> */}
                            <Row style={{ paddingTop: 13, height: 43 }}>
                                <Col sm={1}>
                                    <Image source={AppImages.addBlue} style={[Config.style.MR10, { width: 20, height: 20 }]} resizeMode='contain' />
                                </Col>
                                <Col sm={11} >
                                    <Pressable onPress={() => this.setAddModalVisible(!modalVisible)}>
                                        <AddAddress navigation={this.props.navigation} title={'Add New Address'}></AddAddress>
                                    </Pressable>
                                </Col>
                            </Row>
                        </View>
                    </TouchableOpacity>
                </Modal>
                <Pressable onPress={() => this.setAddModalVisible(true)} style={[Config.style.Col]}>

                    {
                        this.props.pageName == 'Home' ?
                            (
                                <View style={CS.Col}>
                                    <Row style={CS.Col}><Text style={[Config.style.greyText, Config.style.font12]}>DELIVER TO</Text></Row>
                                    <Row Hidden={APIKit.savedAddressList == []} style={{marginTop:8}}><Text style={[Config.style.font16, styles.selectedAddress, Config.style.FontMedium, Config.style.FW500]}>{APIKit.locationTitle}</Text></Row>
                                    {
                                        APIKit.locationTitle == '' ? (<View></View>) :
                                            (<Image source={AppImages.downArrowGray} style={[{ marginRight: 5, width: 10, height: 10, marginTop: 2, position: 'absolute', right: -28, bottom: 3 }]} resizeMode='contain' />)

                                    }
                                    {/* <Row Hidden={APIKit.savedAddressList.length != 0 || !APIKit.isAddressListNull} style={{ marginTop: -15 }}>
                                        <Text style={[Config.style.font16, styles.selectedAddress, Config.style.FontMedium, Config.style.FW500]}>Select Address</Text>
                                        <Image source={AppImages.downArrowGray} style={[Config.style.MR10, { width: 10, height: 10, marginTop: -2, position: 'absolute', right: -23, bottom: 5 }]} resizeMode='contain' />
                                    </Row> */}
                                    <Row Hidden={APIKit.savedAddressList != 0} style={{ marginTop: -19 }}>
                                        <Text style={[Config.style.font16, styles.selectedAddress, Config.style.FontMedium, Config.style.FW500]}>Add Address</Text>
                                        <Image source={AppImages.downArrowGray} style={[Config.style.MR10, { width: 10, height: 10, marginTop: -2, position: 'absolute', right: -28, bottom: 5 }]} resizeMode='contain' />
                                    </Row>
                                </View>

                            ) :
                            (
                                <Text style={[CS.font11, CS.FW400, { color: '#C6345C' }]}>Change</Text>
                            )
                    }

                </Pressable>
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
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        // paddingBottom: 40,
        paddingBottom: 8,
        width: '100%',
        maxHeight: '95%',
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
    selectedAddress: {
        fontWeight: 'bold',
        textAlign: 'center'
    }
});
