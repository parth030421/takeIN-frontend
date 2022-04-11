
import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, Image, BackHandler, TouchableOpacity, Keyboard, InteractionManager, Pressable, View, CheckBox, TextInput, ScrollView } from "react-native";
import { AppImages } from "../../res";
import Config from "../../Config";
import { Row, Col, Left, Center, RestaurantList } from '../componentIndex';
import Icon from "react-native-vector-icons/Ionicons";
import APIKit from "../../APIKit";
import SyncStorage from 'sync-storage';
class Search extends Component {
    state = {
        modalVisible: false,
        searchMenupopup: false,
        SearchList: [],
        searchValue: '',
        isNull: true
    };
    textinput;
    ResturentList = [];
    setModalVisible = (visible) => {
        this.getList();
        this.setState({ isNull: true })
        if (visible == false) {
            this.setState({ SearchList: [] })
        } else {
            setTimeout(() => {
                if (this.textInputField) {
                    this.textInputField.focus();
                }
            }, 500);
        }
        setInterval(() => {
            if (!APIKit.searchPopup) {
                this.setState({ modalVisible: false });
            }
        }, 1000)
        APIKit.searchPopup = visible
        this.setState({ modalVisible: visible });
    }

    async getList() {
        this.ResturentList = await SyncStorage.get("ResturentList")
    }
    componentWillUnmount() {

        BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    }

    searchFood(key) {
        this.setState({ SearchList: [] })
        setInterval(() => {
            // console.log("searchValue", this.state.searchValue)
        }, 1000)
        console.log(key)
        fetch(Config.baseUrl + 'restaurant?search=' + key, {
            method: 'GET',
            headers: APIKit.CommonHeaders
        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson)

                if (responseJson.status == true) {
                    // this.SearchList = responseJson.success.data.menuItems;
                    this.setState({ SearchList: responseJson.success.data.restaurant })

                    this.setState({ isNull: true })
                } else {
                    console.log(responseJson)
                    if (responseJson.error.status == false) {
                        this.setState({ isNull: false })
                    } else {
                        this.setState({ isNull: true })
                    }
                    // this.setState({ isNull: false })
                }
                if (responseJson.error) {
                    this.setState({ isNull: false })
                } else {
                    this.setState({ isNull: true })
                }
            })
            .catch((error) => {
                console.error("errorerror", error);
                this.setState({ isNull: false })
            });
    }

    render() {
        const CS = Config.style;
        const { modalVisible } = this.state;
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(false);
                    }}>
                    <View style={CS.centeredView}>
                        <View style={CS.modalView}>

                            <ScrollView keyboardShouldPersistTaps={'handled'} style={[Config.style.MT12]}>
                                <Row>
                                    <Col sm={12}>
                                        <Pressable onPress={() => this.setModalVisible(false)} >
                                            <Icon name='close' size={30}></Icon>
                                        </Pressable>
                                    </Col>
                                    <Col sm={12}><Text style={[Config.style.font24, CS.MT10, CS.FontBold, Config.style.FW700]}>Search</Text></Col>

                                    <Col sm={12}>
                                        <View style={CS.searchBox}>
                                            <Row size={12}>
                                                <Col>
                                                    <Pressable>
                                                        <Image source={AppImages.searchBlue} style={{ width: 19, height: 19, marginTop: 3 }} />
                                                    </Pressable>
                                                </Col>
                                                <Col sm={11}>
                                                    <TextInput ref={(ref) => { this.textInputField = ref }} returnKeyType='done' onChangeText={text => { this.searchFood(text); this.setState({ searchValue: text }); }} placeholder={'Search food or restaurants'} placeholderStyle={CS.font16} placeholderTextColor={'#999999'} style={[CS.searchBoxInput, CS.greyText, CS.FW400, CS.font16, CS.FontRegular, { color: '#999999' }]} />
                                                </Col>
                                            </Row>
                                        </View>
                                    </Col>
                                    <Col style={[CS.Col, CS.MT18]} sm={12} Hidden={this.state.isNull}>
                                        <Text style={[{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', }, CS.FontBold]}>
                                            RESTAURANT NOT FOUND!</Text>
                                    </Col>
                                </Row>
                                <View style={CS.MT5}>
                                    <Row Hidden={this.state.searchValue == ""}>
                                        <RestaurantList restaurantList={this.state.SearchList} navigation={this.props.navigation}></RestaurantList>
                                    </Row>
                                </View>

                                <Row style={[Config.style.MT16]}>
                                    <Col sm={9}>
                                        <Text style={[Config.style.FW700, Config.style.font16]}>Recent search</Text>
                                    </Col>
                                    <Col sm={3}>
                                        <Pressable>
                                            {/* <Text style={[Config.style.font12, Config.style.FW500, CS.FontBold, { color: '#C6345C', textAlign: 'right' }]}>Clear all</Text> */}
                                        </Pressable>
                                    </Col>
                                    <Col sm={12} style={{ height: 200 }}>
                                        <RestaurantList restaurantList={this.props.restaurantList.slice(0, 2)} navigation={this.props.navigation}></RestaurantList>
                                    </Col>
                                    <Col sm={12}>
                                        <Text style={[Config.style.FW700, Config.style.font16]}>Recommended for you</Text>
                                    </Col>
                                    <Col sm={12} style={{ height: 300 }}>
                                        <RestaurantList restaurantList={this.props.restaurantList.slice(2, 4)} navigation={this.props.navigation}></RestaurantList>
                                    </Col>
                                </Row>

                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <Pressable onPress={() => this.setModalVisible(true)}>
                    <Text style={[CS.greyText, CS.FW400, CS.font16, CS.FontRegular, { color: '#999999', marginLeft: 5 }]}>Search food or restaurants</Text>
                </Pressable>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    modalView: {
        backgroundColor: "white",
        padding: 0,
        width: '100%',
        height: '100%',
        // alignItems: "center",
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },

    searchBox: {
        backgroundColor: '#F4F4F4',
        height: 53,
        width: '100%',
        borderRadius: 13,
        padding: 15,
        marginTop: 12
    },
    searchBoxInput: {
        height: 50,
        padding: 0,
        marginLeft: -20,
        marginTop: -10,
        fontSize: 17,
        borderColor: '#bcbcbc',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: 2
    },
});

export default Search;