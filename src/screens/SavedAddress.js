




















import React from 'react';
import {
    View,
    StatusBar, Pressable, SafeAreaView, Modal, BackHandler,
    Text, Image, StyleSheet, TouchableHighlight,
} from 'react-native';
import { Footer, Header, Row, Col, MenuButton, Wrapper, Right, SignIn, Left, RadioButton, ContentLoader, AddAddress, CustomSwipeable } from '../components/componentIndex';
import Icon from "react-native-vector-icons/Ionicons";
const marginTop = Platform.OS === 'ios' ? 0 : 0;
import Config from '../Config';
import { AppImages } from '../res';
import APIKit from '../APIKit';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SwipeListView } from 'react-native-swipe-list-view';
export default class SavedAddress extends React.Component {
    state = {
        isSwiping: false,
        deletePopupVisible: false,
        lastRefresh: Date(Date.now()).toString(),
        showLoader: 1,
        savedAddressList: [],
    };
    updateAddressInterwal;
    constructor(props) {
        super(props);
    }
    onAndroidBackPress = () => {
        this.props.navigation.navigate('Home')
        return true;
    }


    componentDidMount() {

        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
        this.getToken();
        this.updateAddressInterval = setInterval(() => {
            this.setState({ savedAddressList: APIKit.savedAddressList })
        }, 1500)

    }

    getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('accessToken')
            Config.userAuthToken = value;
            console.log("tttt", Config.userAuthToken)
            APIKit.getHeader();
            APIKit.getAddress();
        } catch (e) {
            // error reading valu
        }
    }

    componentWillUnmount() {
        clearInterval(this.updateAddressInterval)
        BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    }

    cancle() {
        this.setModalVisible(false);
        this.setState({ isSelectable: false })
    }
    setModalVisible = (visible) => {
        APIKit.getAddress();
        this.setState({ deletePopupVisible: visible });
    }

    deleteItems() {
        // this.setState({ isSwiping: false })
        fetch(Config.baseUrl + 'user/address/' + this.state.deletedItemId, {
            method: 'DELETE',
            headers: APIKit.CommonHeaders2,
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("deleteItems", responseJson)
                APIKit.getAddress();
                this.setState({ savedAddressList: APIKit.savedAddressList })
                this.setState({ deletePopupVisible: false })
            })
            .catch((error) => {
                console.error("deleteItemserror", error);
                this.setState({ deletePopupVisible: false })
                APIKit.getAddress();
                this.setState({ savedAddressList: APIKit.savedAddressList })
            });
    }

    onDefaultChange(id) {
        APIKit.setDefaultAddress(id);
        APIKit.getAddress();
        this.setState({ savedAddressList: APIKit.savedAddressList })
    }
    updateAddress(id) {
        APIKit.updateAddressId = id
    }

    render() {
        // this.setState({ savedAddressList: APIKit.savedAddressList })
        const CS = Config.style;
        const rightButtons = [
            <TouchableHighlight><Text>Button 1</Text></TouchableHighlight>,
            <TouchableHighlight><Text>Button 2</Text></TouchableHighlight>
        ];
        return (

            <Wrapper style={{ marginTop }}>
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <SafeAreaView style={{ flex: 3, backgroundColor: '#FFFFFF' }} >
                    <Header style={{ paddingTop: 10 }}>
                        <Left style={CS.imageIcon}>
                            <Pressable onPress={() => this.props.navigation.toggleDrawer()}>
                                <Image source={AppImages.sideMenu} style={{ width: 22, height: 22, marginLeft: 0 }} />
                            </Pressable>
                        </Left>

                        <Text style={[CS.font16, CS.FW700]}>Saved Address</Text>
                        <Right>
                            <Pressable onPress={() => this.addAddress()} >
                                <AddAddress title={(<Text style={[{ color: '#5CAC7D', fontSize: 25 }]}>+</Text>)}></AddAddress>
                            </Pressable>
                        </Right>
                    </Header>

                    <View style={{ padding: 10, paddingTop: 0 }}>
                        {this.state.savedAddressList.map((list) => (
                            <View style={{ marginTop: 7, maxHeight: 170 }}>
                                <CustomSwipeable rightButtonWidth={154} key={list._id}
                                    onSwipeRelease={() => this.state.isSwiping ? this.setState({ isSwiping: false }) : this.setState({ isSwiping: true })}
                                    rightButtons={[
                                        <Pressable>
                                            <Row>
                                                <Col style={{ paddingTop: 6 }}>
                                                    <View style={[styles.rightSwipeBtn, { position: 'relative' }]}><Image source={AppImages.Edit} style={{ resizeMode: 'contain', marginLeft: 10, width: 25, height: 25 }}></Image>
                                                        <Row style={{ backgroundColor: '#ffffff', width: 15, height: 145, position: 'absolute', left: -3, borderTopRightRadius: 15, borderBottomRightRadius: 15 }}>
                                                        </Row>
                                                    </View>
                                                </Col>
                                                <Col style={{ paddingTop: 6 }}>
                                                    <Pressable onPress={() => { this.setState({ deletedItemId: list._id }); this.setModalVisible(true); }}>
                                                        <View style={[styles.rightSwipeBtn2]}><Image source={AppImages.Delete} style={{ resizeMode: 'contain', marginLeft: 10, width: 25, height: 25 }}></Image>
                                                            <View style={{ backgroundColor: '#D9AE56', width: 15, height: 145, position: 'absolute', left: -3, borderTopRightRadius: 15, borderBottomRightRadius: 15 }}>
                                                            </View>
                                                        </View>
                                                    </Pressable>
                                                </Col>

                                            </Row>
                                        </Pressable>

                                    ]}>

                                    <Pressable onPress={() => this.onDefaultChange(list._id)}>
                                        <Row style={[{ margin: 0 }]}>
                                            <Image source={AppImages.shadowBorder} style={{ height: 160, width: '100%' }}></Image>
                                        </Row>
                                        <Row style={[{ padding: 10, marginTop: -155 }]} size={12}>
                                            <Col sm={3.5} style={{ alignItems: 'center' }}>
                                                <Image
                                                    source={AppImages.Map2} style={{ resizeMode: 'contain', width: 92, height: 130 }} />
                                                <Image source={AppImages.mapCircle} style={[{ resizeMode: 'contain', width: 35, height: 35, position: 'absolute', top: 52 }, CS.Col]} />
                                            </Col>
                                            <Col sm={8.5} style={{ justifyContent: 'center', paddingLeft: 10 }}><Text style={[CS.font17, CS.FW500]}>{list.nickName}</Text>
                                                <Text style={[CS.font12, CS.FW400, CS.greyText, { paddingTop: 6 }]}>{list.addressLine1},{list.addressLine2}</Text>
                                                <Row style={[CS.MT10]}>
                                                    <Col style={[{ justifyContent: 'center' }]}>
                                                        <Image source={AppImages.telephone} style={{ width: 13, height: 13 }} />
                                                    </Col>
                                                    <Col style={[{ justifyContent: 'center', paddingLeft: 5 }]}>
                                                        <Text style={[CS.font12, CS.FW500, CS.FontMedium, CS.greyText, { color: '#000000', opacity: 0.6 }]}>
                                                            {list.phoneNumber}</Text>
                                                    </Col>
                                                </Row>

                                                <Row style={[CS.MT10]}>
                                                    <Col sm={1.2}>
                                                        <RadioButton style={{
                                                            width: 20,
                                                            height: 20,
                                                            borderColor: '#AAACAE',
                                                            borderWidth: 2,
                                                        }}
                                                            innerBackgroundColor={Config.primaryColor}
                                                            isActive={list.isDefault}
                                                            onPress={() => this.onDefaultChange(list._id)}
                                                            innerContainerStyle={{ height: 14, width: 14 }}></RadioButton>
                                                    </Col>
                                                    <Col sm={8.7} style={[{ justifyContent: 'center' }]}>
                                                        <Text style={[CS.font12, CS.FW500, { color: '#707070' }]}>Default Address</Text>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Pressable>
                                </CustomSwipeable>
                            </View>
                        ))}
                    </View>

                    <Row Hidden={this.state.savedAddressList.length != 0 || APIKit.isAddressListNull} style={[styles.container2, styles.horizontal]} >
                        <Col sm={12} style={[CS.card, CS.col, { height: 130, marginBottom: 15 }]}>
                            <ContentLoader active avatar pRows={3} pWidth={['50%', '100%', '70%']} avatarStyles={{ borderRadius: 3 }} title={false}></ContentLoader>
                        </Col>
                        <Col sm={12} style={[CS.card, CS.col, { height: 130, marginBottom: 15 }]}>
                            <ContentLoader active avatar pRows={3} pWidth={['50%', '100%', '70%']} avatarStyles={{ borderRadius: 3 }} title={false}></ContentLoader>
                        </Col>
                        <Col sm={12} style={[CS.card, CS.col, { height: 130, marginBottom: 15 }]}>
                            <ContentLoader active avatar pRows={3} pWidth={['50%', '100%', '70%']} avatarStyles={{ borderRadius: 3 }} title={false}></ContentLoader>
                        </Col>

                    </Row>
                    <Row>
                        <Col sm={12} style={[CS.Col]} Hidden={this.state.savedAddressList.length != 0 || !APIKit.isAddressListNull}>
                            <Pressable onPress={() => this.addAddress()} >
                                <AddAddress navigation={this.props.navigation} title={(<Text style={[CS.font12, CS.FW500, { color: '#707070' }]}>Add a new address</Text>)}></AddAddress>
                            </Pressable>
                        </Col>
                    </Row>
                    <View>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.deletePopupVisible}
                            onRequestClose={() => {
                                this.setModalVisible(!deletePopupVisible);
                                this.getAddress();
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={[CS.font22, CS.FontBold, CS.FW700]}>Delete address</Text>
                                    <Text style={[CS.greyText, CS.font14, CS.TextCenter, CS.FontRegular, CS.FW400, CS.MT18]}>Are you sure you would like to delete this address?</Text>
                                    <Pressable onPress={() => this.deleteItems()} style={[CS.greenBtn, CS.MT18, { backgroundColor: '#C6345C' }]}>
                                        <Text style={[CS.font16, CS.FontBold, CS.FW700, CS.whiteText]}>Delete</Text>
                                    </Pressable>
                                    <Pressable onPress={() => this.cancle()} style={[CS.greenBtn, { backgroundColor: '#ffffff', borderColor: '#56678942', borderWidth: 2 }]}>
                                        <Text style={[CS.font16, CS.greyText]}>Cancel</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>
                    </View >


                </SafeAreaView>


            </Wrapper>
        );
    }
};

const styles = StyleSheet.create({
    whiteBox: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
    },
    itemContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 10
    },
    rightSwipeBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 145,
        backgroundColor: '#D9AE56',
        width: 78,
        zIndex: 100,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginRight: -10,
    },
    rightSwipeBtn2: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 145,
        backgroundColor: '#C6345C',
        width: 80,
        zIndex: 0,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        // marginLeft: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 29,
        paddingBottom: 40,
        width: 310,
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
    container2: {
        margin: 20,
    },
});

