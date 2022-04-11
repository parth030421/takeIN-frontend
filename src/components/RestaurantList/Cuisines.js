
import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, Image, FlatList, Pressable, View, TextInput, ScrollView } from "react-native";
import { AppImages } from "../../res";
import Config from "../../Config";
import Icon from "react-native-vector-icons/Ionicons";
import { Row, Col, Left, CheckBox } from '../componentIndex';
import APIKit from "../../APIKit";
class Cuisines extends Component {
    state = {
        modalVisible: false,
        searchText: '',
    };
    cuisinesList = [];
    selectedCuisinesList = [];
    filterCuisinsList = [];
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
        if (visible == false) {
            let result = Object.entries(this.state).map(([k, v]) => ({ [k]: v }));
            let string = this.selectedCuisinesList.toString().replace(',', '&').replace(',', '&').replace(',', '&').replace(',', '&').replace(',', '&').replace(',', '&').replace(',', '&').replace(',', '&').replace(',', '&').replace(',', '&').replace(',', '&');
            this.props.cuisinsModel(string)
            this.filterCuisinsList = this.cuisinesList;
            this.setState({ searchText: '' })
        }
    }

    componentDidMount() {
        this.getCuisinesList();
    }

    getCuisinesList() {
        fetch('https://d13j9g2ks667w2.cloudfront.net/api/v1/cuisines', {
            method: 'GET',
            headers: APIKit.CommonHeaders
        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log('response', responseJson.success.data.data)
                this.cuisinesList = responseJson.success.data.data;
                this.filterCuisinsList = this.cuisinesList;
                this.cuisinesList.forEach((item) => {
                    this.setState({ [item._id]: false })
                })
            })
            .catch((error) => {
                this.setState({ showLoader: 1 })
            });
    }

    onSortChange(item) {
        if (this.state[item._id] == true) {
            this.setState({ [item._id]: false })
            this.selectedCuisinesList = this.selectedCuisinesList.filter(e => e !== 'cuisines=' + item.cuisines)
        } else {
            this.setState({ [item._id]: true })
            this.selectedCuisinesList.push('cuisines=' + item.cuisines)
        }
    }

    backCuisins() {
        this.cuisinesList.forEach((item) => {
            this.setState({ [item._id]: false })
        })
        this.selectedCuisinesList = []
        this.setModalVisible(!this.state.modalVisible)
    }
    filterItem(text) {
        console.log("yyyy", text)
        if (text == '') {
            this.getCuisinesList();
        }
        this.filterCuisinsList = Object.assign([], this.cuisinesList).filter(
            item => item.cuisines.toLowerCase().indexOf(text.toLowerCase()) > -1)
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
                    <View style={CS.centeredView}>
                        <View style={CS.modalView}>
                            <Row size={12} style={{ paddingVertical: 10 }}>
                                <Col sm={1} style={CS.Col}>
                                    <Pressable onPress={() => { this.backCuisins() }} >
                                        <Image source={AppImages.backBlack} style={{ width: 33, height: 33, marginLeft: 5 }} />
                                    </Pressable>
                                </Col>
                                <Col sm={11}>
                                    <Row style={[styles.searchBox, CS.Col]} size={12}>
                                        <Col sm={2} >
                                            <Pressable>
                                                <Image source={AppImages.searchBlue} style={{ width: 17, height: 17, marginTop: 4 }} />
                                            </Pressable>
                                        </Col>
                                        <Col sm={10}>
                                            <TextInput placeholder={'Search Cuisines'}
                                                onChangeText={text => {
                                                    this.setState({ searchText: text });
                                                    this.filterItem(text)
                                                }}
                                                value={this.state.searchText}
                                                placeholderTextColor={'#999999'} style={[styles.searchBoxInput, CS.font16, CS.FontRegular]} textBreakStrategy={'simple'} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <ScrollView>
                                <Row Hidden={!this.filterCuisinsList.length == 0}>
                                    <Col style={[CS.Col, CS.MT18]} sm={12}>
                                        <Text style={[CS.nullMessage]}>
                                            No Cuisines Found!</Text>
                                    </Col>
                                </Row>
                                <Row style={[Config.style.MT18, { marginBottom: 100 }]} size={12}>
                                    {
                                        this.filterCuisinsList.map((item) => (
                                            <Pressable onPress={() => this.onSortChange(item)} key={item._id}>
                                                <Row size={12} key={item._id} style={{ paddingVertical: 10, borderBottomColor: '#ECECEC', borderBottomWidth: 0.8 }}>
                                                    <Col sm={11} style={{ justifyContent: 'center', paddingLeft: 5 }}>
                                                        <Text style={[CS.font14, CS.FontMedium, CS.FW500]}>{item.cuisines}</Text>
                                                    </Col>
                                                    <Col sm={1} style={[{ textAlign: 'right' }]}>
                                                        <CheckBox
                                                            onClick={() => { this.onSortChange(item) }}
                                                            isChecked={this.state[item._id]}
                                                            disabled={true}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Pressable>
                                        ))
                                    }

                                </Row>


                            </ScrollView>
                            <Pressable onPress={() => this.setModalVisible(!modalVisible)}
                                style={[Config.style.greenBtn, { marginTop: 20, position: 'absolute', bottom: 10 }]}><Text style={[Config.style.whiteText, Config.style.font14]}>Apply</Text></Pressable>
                        </View>
                    </View>
                </Modal>
                <Pressable onPress={() => this.setModalVisible(true)}>
                    <Row>
                        <Col><Image source={AppImages.cuisines} style={{ width: 16, height: 16, marginRight: 5 }} /></Col>
                        <Col><Text style={[Config.style.Font12, Config.style.FW500, { color: '#7C7C7C' }]}>Cuisines</Text></Col>
                    </Row>

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
        width: 380,
        height: 640,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        paddingBottom: 40,
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
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: Config.listBackgroundColor,
        borderBottomColor: Config.listSeparatorColor,
        borderBottomWidth: 2,
    },

    listText: {
        fontSize: 14, fontWeight: 'bold', flex: 0.8, justifyContent: 'center', paddingTop: 10
    },
    listIcon: {
        flex: 0.2,
        marginTop: 5,
        justifyContent: 'flex-end',
        marginRight: -50
    },
    checkbox: {
        alignSelf: "center",
        width: 30,
        height: 30,
        color: Config.primaryColor
    },
    searchBox: {
        backgroundColor: '#F4F4F4',
        height: 53,
        borderRadius: 13,
        padding: 15,
        marginLeft: 18

    },
    searchBoxInput: {
        height: 50,
        padding: 0,
        marginLeft: -20,
        marginTop: -13,
        fontSize: 17,
        width: '100%',
        borderColor: '#bcbcbc',
    },
});

export default Cuisines;