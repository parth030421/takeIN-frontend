import React from 'react';
import {
    View, ActivityIndicator,
    FlatList, StatusBar, Pressable, SafeAreaView, BackHandler,
    Text, Image, StyleSheet, Modal, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppImages } from '../res';
import { Footer, ContentLoader, Wrapper, CheckBox, Header, Left, Right, Search, AddressSelect, Cuisines, Sorting, LabelIconInput, P, Row, Col, RestaurantList } from '../components/componentIndex';
import Config from '../Config';
import APIKit from '../APIKit';
const marginTop = Platform.OS === 'ios' ? 0 : 0;


export default class RestaurentList extends React.Component {

    ResturentList = [];
    sortingList = [];
    filterList = [];
    state = {
        showLoader: 0,
        filterData: [],
        isListNull: false,
        isSortState: false,
        modalVisible: false,
        selectedTab: 'Sorting',
        sortValue: ''
    };

    constructor(props) {
        super(props);

    }
    onAndroidBackPress = () => {
        this.props.navigation.navigate('Home')
        return true;
    }
    componentDidMount() {

        this.getRestaurantList();
        this.getSortingList();
        this.getFilterList();
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
        if (visible == false) {
            // this.ResturentList = [];
        }
    }

    getSortingList() {
        fetch(Config.baseUrl + 'search/sorting', {
            method: 'GET',
            headers: APIKit.CommonHeaders
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('response', responseJson.success.data.sorting)
                this.sortingList = responseJson.success.data.sorting
                this.sortingList.forEach((item) => {
                    this.setState({ [item._id]: false })
                })
            })
            .catch((error) => {
                this.setState({ showLoader: 1 })
            });
    }
    getFilterList() {
        fetch(Config.baseUrl + 'search/filter', {
            method: 'GET',
            headers: APIKit.CommonHeaders
        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log('response', responseJson.success.data.sorting)
                this.filterList = responseJson.success.data.sorting;
                this.filterList.forEach((item) => {
                    this.setState({ [item._id]: false })
                })
            })
            .catch((error) => {
                this.setState({ showLoader: 1 })
            });
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    }

    getSort(value) {
        console.log("this.state.sortValue", this.state.sortValue)
        fetch(Config.baseUrl + 'restaurant/sort?OrderBy=' + value, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
       
            .then((responseJson) => {
                if (responseJson.status == true) {
                    console.log("this.state.sortValue", responseJson.success.data.restaurant.length)
                    if (responseJson.success.data.restaurant.length != undefined) {
                        this.ResturentList = responseJson.success.data.restaurant;
                        this.setState({ showLoader: 1 })
                        // console.log("this.state.sortValue", this.ResturentList)
                    } else {
                        this.setState({ isListNull: true })
                        this.ResturentList = []
                    }
                }
            })
            .catch((error) => {
                console.error("errorerror", error);
            });
    }

    getFilterRestaurantList(delivery, minOrder, newRest, openNow) {
        console.log("filter", delivery, minOrder, newRest, openNow)
        if (delivery == true) { delivery = 'FD' } else { delivery = '' }
        if (minOrder == true) { minOrder = 'minOrder' } else { minOrder = '' }
        if (newRest == true) { newRest = 'new' } else { newRest = '' }
        if (openNow == true) { openNow = 'open' } else { openNow = '' }
        fetch(Config.baseUrl + 'restaurant/filter?FD=' + delivery + '&minOrder=' + minOrder + '&new=' + newRest + '&open=' + openNow, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == true) {
                    this.ResturentList = responseJson.success.data.restaurants;
                   
                    this.setState({ isfilterMealTypeNull: true })
                    setTimeout(() => {
                        this.setState({ isListNull: true })
                    }, 3000)
                }
            })
            .catch((error) => {
                console.error("errorerror", error);
            });
    }

    getRestaurantList = () => {
        console.log("this.state.getRestaurantList", this.state.sortValue)
        fetch(Config.baseUrl + 'restaurant', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == true) {
                    this.ResturentList = responseJson.success.data.restaurant;
                    console.log("this.ResturentList", this.ResturentList)
                    this.setState({ showLoader: 1 })
                }
            })
            .catch((error) => {
                console.error("errorerror", error);
            });
    };

    handleLoadMore = async () => {
        // console.log("handleLoadMore")
        this.setState({
            currentPage: this.state.currentPage + 1
        })
    }

    // closeModal = (delivery, minOrder, newRest, openNow) => {
    //     this.getFilterRestaurantList(delivery, minOrder, newRest, openNow)
    // }

    OnTabChange(currentTab) {
        this.setState({ selectedTab: currentTab })
    }

    // sortModel = (value) => {
    //     this.setState({ showLoader: 1 })
    //     this.ResturentList.length = 0;
    //     this.ResturentList = [];
    //     this.getSort(value)
    // }


    applySorting() {
        this.setState({ isListNull: false });
        this.ResturentList = [];
        this.setModalVisible(!this.state.modalVisible);
        this.getSort(this.state.sortValue)
        this.filterList.forEach((item) => {
            this.onCheckboxChange(!item);
            // this.setState({ [list._id]: false })
        })
    }

    handelSorting(){
        this.setState({ isListNull: false }); 
        this.ResturentList = []; 
        this.setState({ sortValue: '' }); 
        this.getFilterRestaurantList(this.state['6135ac440c571f0018a28489'], this.state['6135ac6d0c571f0018a2848a'], false, this.state['6135abfb0c571f0018a28486']); 
    }

    onCheckboxChange(item) {
        if (this.state[item._id] == true) {
            this.setState({ [item._id]: false })
        } else {
            this.setState({ [item._id]: true })
        }
    }

    onSortChange(item) {
        this.sortingList.forEach((list) => {
            this.setState({ [list._id]: false })
        })
        this.setState({ [item._id]: true })
        if (item.value == "A to Z") {
            this.setState({ sortValue: 'A-to-Z' });
            // this.getSort(this.state.sortValue)
        }
        if (item.value == "Z to A") {
            this.setState({ sortValue: 'Z-to-A' })
            // this.getSort(this.state.sortValue)
        }
        if (item.value == "Top Rated") {
            this.setState({ sortValue: 'top-rated' })
            // this.getSort(this.state.sortValue)
        }
        if (item.value == "Recommended") {
            this.setState({ sortValue: 'Recommended' })
            // this.getSort(this.state.sortValue)
        }

    }

    clearAll() {
        this.filterList.forEach((item) => {
            this.setState({ [item._id]: false })
        })
        this.sortingList.forEach((item) => {
            this.setState({ [item._id]: false })
        })
    }

    cuisinsModel = (value) => {
        this.ResturentList.length = 0;
        this.ResturentList = [];
        console.log("URL", 'https://d13j9g2ks667w2.cloudfront.net/api/v1/restaurant?' + value)
        if (value != '') {
            // this.setState({ showLoader: 0 })
            this.ResturentList = []
            fetch('https://d13j9g2ks667w2.cloudfront.net/api/v1/restaurant?' + value, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log("this.responseJson", responseJson)
                    if (responseJson.status == true) {

                        this.ResturentList = responseJson.success.data.restaurant;
                        if (this.ResturentList == undefined) {
                            this.ResturentList = []
                        }
                        this.setState({ showLoader: 1 })
                        this.setState({ isfilterMealTypeNull: true })
                        setTimeout(() => {
                            this.setState({ isListNull: true })
                        }, 3000)
                    } else if (responseJson.error.code = 'RESTAURANT_NOT_FOUND') {
                        this.setState({ showLoader: 1 })
                        this.ResturentList = []
                        this.setState({ isListNull: true })
                        console.log("this.responseJson", responseJson)
                    }
                })
                .catch((error) => {
                    console.error("errorerror", error);
                });
        } else {
            this.getRestaurantList();
        }
    }

    render() {
        const { modalVisible } = this.state;
        const CS = Config.style;
        return (
            <Wrapper style={{ marginTop }}>
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <Header style={{ paddingTop: 10 }}>
                    <Left style={CS.imageIcon}>
                        <Pressable onPress={() => this.props.navigation.navigate('Home')} >
                            <Image source={AppImages.backBlack} style={{ width: 33, height: 33 }} />
                        </Pressable>
                    </Left>
                    <AddressSelect pageName="Home"></AddressSelect>
                    <Right>
                        <Pressable onPress={() => { Config.userAuthToken == '' ? this.setLoginModalVisible(true) : this.props.navigation.navigate('Notifications'); APIKit.previousScreen = this.props.navigation.state.routeName }} style={styles.headerIcon}>
                            <Image source={AppImages.Notification} style={{ width: 26, height: 26 }} />
                        </Pressable>
                        <Pressable onPress={() => { this.props.navigation.navigate('Cart'); APIKit.previousScreen = this.props.navigation.state.routeName }} style={styles.headerIcon}>
                            <Image source={AppImages.Buy} style={{ resizeMode: 'contain', flex: 1, width: 22, height: 20, marginRight: 5 }} />
                        </Pressable>
                    </Right>
                </Header>
                <Row size={12} style={{ marginTop: 0 }}>
                    <Col sm={4} style={styles.filterBoxCol}>
                        <Pressable onPress={() => this.setModalVisible(true)}>
                            <Row>
                                <Col><Image source={AppImages.filter} style={{ width: 16, height: 16, marginRight: 5 }} /></Col>
                                <Col><Text style={[Config.style.Font12, Config.style.FW500, { color: '#7C7C7C' }]}>Filters</Text></Col>
                            </Row>
                        </Pressable>
                        {/* <Sorting closeModal={this.closeModal} sortModel={this.sortModel} ></Sorting> */}
                    </Col>
                    <Col sm={4} style={styles.filterBoxCol}>
                        <Cuisines cuisinsModel={this.cuisinsModel}></Cuisines>
                    </Col>
                    <Col sm={4} style={styles.filterBoxCol}>
                        <Row>
                            <Col><Image source={AppImages.search3} style={{ width: 16, height: 16, marginRight: 5 }} /></Col>
                            <Col><Text style={[Config.style.Font12, Config.style.FW500, { color: '#7C7C7C' }]}>Search</Text></Col>
                        </Row>
                        {/* <Search restaurantList={this.ResturentList}></Search> */}
                    </Col>
                </Row>

                <Row style={[{ flex: 1 }, CS.MT14]} Hidden={this.ResturentList.length == 0}>
                    <RestaurantList restaurantList={this.ResturentList} navigation={this.props.navigation}></RestaurantList>
                </Row>
                <Row style={[styles.container2, styles.horizontal]} Hidden={this.ResturentList.length != 0 || this.state.isListNull}>
                    <Col sm={12} style={[CS.itemContainer, { borderWidth: 0 }]}>
                        <ContentLoader active avatar pRows={3} pWidth={['50%', '100%', '70%']} avatarStyles={{ borderRadius: 3 }} title={false} outP></ContentLoader>
                    </Col>
                    <Col sm={12} style={[CS.itemContainer, { borderWidth: 0 }]}>
                        <ContentLoader active avatar pRows={3} pWidth={['50%', '100%', '70%']} avatarStyles={{ borderRadius: 3 }} title={false}></ContentLoader>
                    </Col>
                    <Col sm={12} style={[CS.itemContainer, { borderWidth: 0 }]}>
                        <ContentLoader active avatar pRows={3} pWidth={['50%', '100%', '70%']} avatarStyles={{ borderRadius: 3 }} title={false}></ContentLoader>
                    </Col>
                </Row>
                <Row Hidden={!this.state.isListNull || this.ResturentList.length != 0}>
                    <Col style={[CS.Col, CS.MT18]} sm={12}>
                        <Text style={[CS.nullMessage]}>
                            RESTAURANT NOT FOUND!</Text>
                    </Col>
                </Row>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {

                        this.setModalVisible(!this.state.modalVisible);
                    }}
                >

                    <View style={CS.centeredView}>
                        <View style={CS.modalView}>
                            <Row style={[Config.style.MT18]}>
                                <Col sm={9}>
                                    <Pressable onPress={() => this.setModalVisible(false)} >
                                        <Icon name='close-sharp' size={25} style={[Config.style.MT5]}></Icon>
                                    </Pressable>
                                </Col>
                                <Col sm={3} style={[{ justifyContent: 'center' }]}>
                                    <Pressable onPress={() => this.clearAll()}>
                                        <Text style={[Config.style.font16, Config.style.FontMedium, Config.style.FW500, { color: '#C6345C', textAlign: 'right' }]}>Clear all</Text>
                                    </Pressable>
                                </Col>
                            </Row>
                            <Row size={12} style={[Config.style.MT12, styles.tabBox]}>
                                <Pressable onPress={() => this.OnTabChange('Sorting')}>
                                    <Col sm={3} style={this.state.selectedTab == 'Sorting' ? styles.tabSelected : styles.tabUnSelected}>
                                        <Text style={[this.state.selectedTab == 'Sorting' ? Config.style.greenText : Config.style.greyText, Config.style.Font12]}>Sorting</Text>
                                    </Col>
                                </Pressable>
                                <Pressable onPress={() => this.OnTabChange('Filters')}>
                                    <Col sm={3} style={this.state.selectedTab == 'Filters' ? styles.tabSelected : styles.tabUnSelected}>
                                        <Text style={[this.state.selectedTab == 'Filters' ? Config.style.greenText : Config.style.greyText, Config.style.Font12]}>Filters</Text>
                                    </Col>
                                </Pressable>
                            </Row>
                            <Row style={[Config.style.MT12]} size={12}>
                                <Row Hidden={this.state.selectedTab == 'Filters'}>
                                    {
                                        this.sortingList.map((item) => (
                                            <Pressable onPress={() => this.onSortChange(item)}>
                                                <Row size={12} key={item._id} style={{ paddingVertical: 10, borderBottomColor: '#ECECEC', borderBottomWidth: 0.8 }}>
                                                    <Col sm={11} style={{ justifyContent: 'center', paddingLeft: 5 }}>
                                                        <Text style={[CS.font14, CS.FontMedium, CS.FW500]}>{item.value}</Text>
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
                                    <Pressable onPress={() => { this.applySorting()}}
                                        style={[Config.style.greenBtn, { marginTop: 20 }]}><Text style={[Config.style.whiteText, Config.style.font14]}>Apply</Text></Pressable>
                                </Row>
                                <Row Hidden={this.state.selectedTab == 'Sorting'}>
                                    {
                                        this.filterList.map((item) => (
                                            <Pressable onPress={() => this.onCheckboxChange(item)}>
                                                <Row size={12} key={item._id} style={{ paddingVertical: 10, borderBottomColor: '#ECECEC', borderBottomWidth: 0.8 }}>
                                                    <Col sm={11} style={{ justifyContent: 'center', paddingLeft: 5 }}>
                                                        <Text style={[CS.font14, CS.FontMedium, CS.FW500]}>{item.value}</Text>
                                                    </Col>
                                                    <Col sm={1} style={[{ textAlign: 'right' }]}>
                                                        <CheckBox
                                                            onClick={() => { this.onCheckboxChange(item) }}
                                                            isChecked={this.state[item._id]}
                                                            disabled={true}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Pressable>
                                        ))
                                    }
                                    <Pressable onPress={() => {this.handelSorting(),this.setModalVisible(!modalVisible); }}
                                        style={[Config.style.greenBtn, { marginTop: 20 }]}><Text style={[Config.style.whiteText, Config.style.font14]}>Apply</Text></Pressable>
                                </Row>
                            </Row>
                        </View>
                    </View>
                </Modal>
            </Wrapper>
        )
    }
}


const styles = StyleSheet.create({
    container2: {
        flex: 1,
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },
    backBtnBg: {
        backgroundColor: '#5CAC7D33',
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginRight: 8
    },
    listDetailBox: {
        flex: 0.8,
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderBottomColor: '#EBEBEB'
    },
    foodType: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    offerText: {
        color: '#442B7E',
        fontWeight: 'bold',
        textAlign: 'right'
    },
    headerIcon: {
        marginLeft: 12
    },
    headerBox: {
        paddingTop: 20
    },
    filterBoxCol: {
        borderWidth: 1,
        borderColor: '#cccccc',
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Ubuntu-Medium'
    },
    container2: {
        margin: 20
    },
    tabBox: {
        height: 46,
        width: Dimensions.get('window').width - 35,
        backgroundColor: '#F1F4F3',
        borderRadius: 10,
        paddingLeft: 3,

    },
    tabSelected: {
        backgroundColor: '#ffffff',
        color: '#5CAC7D',
        height: 41,
        borderRadius: 3,
        minWidth: Dimensions.get('window').width / 2 - 21,
        marginVertical: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,

    },
    tabUnSelected: {
        backgroundColor: '#F1F4F3',
        color: '#707070',
        height: 41,
        borderRadius: 3,
        marginVertical: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        minWidth: Dimensions.get('window').width / 2 - 21,
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    modalView: {
        height: 640,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        paddingBottom: 40,
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
        maxWidth: '100%'
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
        width: '100%',
    },

    listText: {
        fontSize: 14, fontWeight: 'bold', flex: 0.8, justifyContent: 'center', paddingTop: 10
    },
    listIcon: {
        flex: 0.2,
        marginTop: 5,
        justifyContent: 'flex-end',
        marginRight: -40
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
        width: 340,
        borderRadius: 13,
        padding: 15,
        marginLeft: 18

    },
    searchBoxInput: {
        height: 50,
        padding: 0,
        marginLeft: -20,
        marginTop: -10,
        fontSize: 17,
        borderColor: '#bcbcbc',
    },
})