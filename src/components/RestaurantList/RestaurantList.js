import React, { Component } from 'react';
import {
    View, LogBox,
    FlatList, StatusBar, Pressable, SafeAreaView,
    Text, Image, StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppImages } from '../../res';
import APIKit from '../../APIKit';
import Config from '../../Config';
import { Footer, Button, Wrapper, Header, Left, Right, Search, AddressSelect, Cuisines, Sorting, LabelIconInput, P, Row, Col, ProgressiveImage } from './../componentIndex';

export default class RestaurantList extends Component {

    state = {
        distanceFromEnd: 10
    };

    componentDidMount() {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }
    handleLoadMore() {

    }
    goToRestaurent(item) {
        APIKit.ResturantId = item._id;
        APIKit.searchPopup = false;
        APIKit.foodType = item.foodType;
        APIKit.ResturantName = item.name
        this.props.navigation.navigate('Restaurant')
    }
    render() {
        const CS = Config.style;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {
                    this.props.restaurantList.map((item) => (
                        <View key={item._id}>
                            <Pressable onPress={() => this.goToRestaurent(item)}>
                                <Row style={{ marginTop: 0, paddingLeft: 8, paddingRight: 5 }}>
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'space-evenly',
                                        flexDirection: "row",
                                        marginTop: 10,
                                        marginBottom: 5
                                    }}>
                                        <View style={{ flex: 0.20, alignItems: 'center' }}>
                                            <View style={{ borderRadius: 20, height: 55, width: 55 }}>
                                                <Image
                                                    source={{
                                                        uri: item?.logo
                                                    }}
                                                    style={{ width: 55, height: 55, resizeMode: 'cover' }}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.listDetailBox}>
                                            <Row size={12}>
                                                <Col><Text style={[CS.font18, CS.FontBold, CS.FW700, { lineHeight: 18 }]}>{item?.name}</Text></Col>
                                                <Col><Image source={AppImages.star} style={[Config.style.MR5, { resizeMode: 'contain', marginLeft: 10, flex: 1, width: 14, height: 14 }]} />
                                                    {/* <Icon style={[Config.style.ML12, { marginTop: -2 }]} name='star' color={'#D9AE56'} size={16} /> */}
                                                </Col>
                                                <Col><Text style={[CS.font12, Config.style.darkGreyText, CS.FontMedium, { lineHeight: 18 }]}>({item?.avgRatings}/5)</Text></Col>
                                            </Row>
                                            <View style={styles.foodType}>
                                                <Text style={[CS.font14, CS.darkGreyText, CS.FW400, CS.FontRegular]} ellipsizeMode='tail' numberOfLines={3}>{item?.mealType?.map((food) => item?.mealType[0] == food ? (food) : (' · ' + food))}</Text>
                                                {/* {item?.foodType.map((food) => (
                                                    <Text key={food} style={Object.assign({}, Config.style.font14, Config.style.greyText)}>{food}<Text> · </Text></Text>
                                                ))} */}
                                            </View>
                                            <Row style={[Config.style.MT5]}>
                                                <Col sm={1}>

                                                    <Image source={AppImages.watch} style={[Config.style.MR10, { resizeMode: 'contain', flex: 1, width: 22, height: 16 }]} />
                                                </Col>
                                                <Col sm={11}>
                                                    <Text style={[Config.style.darkGreyText, CS.font12, CS.FontMedium]}>{item?.deliveryTime} | 30 SAR</Text>
                                                </Col>
                                            </Row>
                                            <Row size={12} >
                                                <Col sm={12}>
                                                    <Row size={12} style={Config.style.MT5} Hidden={item?.deliveryType.length == 0}>
                                                        {item?.deliveryType[0] == "Take-In" ? (
                                                            <Col>
                                                                <Image source={AppImages.Type1} style={{ resizeMode: 'contain', flex: 1, width: 90, height: 22, marginRight: 5 }} />
                                                            </Col>
                                                        ) : (<View></View>)}
                                                        {item?.deliveryType[1] == "Dine-in" ? (
                                                            <Col>
                                                                <Image source={AppImages.Type2} style={{ resizeMode: 'contain', flex: 1, width: 90, height: 22, marginRight: 5 }} />
                                                            </Col>
                                                        ) : (<View></View>)}
                                                        {item?.deliveryType[2] == "Dine-in" ? (
                                                            <Col>
                                                                <Image source={AppImages.Type3} style={{ resizeMode: 'contain', flex: 1, width: 90, height: 22, marginRight: 5 }} />
                                                            </Col>
                                                        ) : (<View></View>)}
                                                    </Row>
                                                    <Row size={12}>
                                                        <Col style={[Config.style.Col]}>
                                                            <Image source={AppImages.offer} style={{ resizeMode: 'contain', marginBottom: -5, flex: 1, width: 14, height: 17, marginTop: 5 }} />
                                                        </Col>
                                                        <Col style={[Config.style.Col, { paddingTop: 8 }]}>
                                                            <Text style={[styles.offerText, Config.style.font12, CS.FontRegular, { textAlign: 'right', marginLeft: 4 }]}>
                                                                15% off orders above SAR 100</Text>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>


                                            {/* <Row size={12} style={Config.style.MT5}>
                                                {item.deliveryType[0] == "Take-In" ? (
                                                    <Col sm={2}>
                                                        <View style={styles.backBtnBg}>
                                                            <Image source={AppImages.Type1} style={{ resizeMode: 'contain', flex: 1, width: 30, height: 30, marginRight: 5 }} />
                                                        </View>
                                                    </Col>
                                                ) : (<View></View>)}
                                                {item.deliveryType[1] == "Dine-in" ? (
                                                    <Col sm={2}>
                                                        <View style={styles.backBtnBg}>
                                                            <Image source={AppImages.Type2} style={{ resizeMode: 'contain', flex: 1, width: 30, height: 30, marginRight: 5 }} />
                                                        </View>
                                                    </Col>
                                                ) : (<View></View>)}
                                                {item.deliveryType[1] == "Dine-in" ? (
                                                    <Col sm={2}>
                                                        <View>
                                                            <Image source={AppImages.Type3} style={{ resizeMode: 'contain', flex: 1, width: 30, height: 30, marginRight: 5 }} />
                                                        </View>
                                                    </Col>
                                                ) : (<View></View>)}
                                                {item.offer ? (
                                                    <Col sm={6}>
                                                        <Text style={Config.style.font14, styles.offerText}><Image source={AppImages.offer} />{item.offer.percentage}% OFF</Text>
                                                    </Col>
                                                ) : (<View></View>)}
                                            </Row> */}
                                        </View>
                                    </View>
                                </Row>
                            </Pressable>
                        </View>
                    ))
                }


            </SafeAreaView>
        );
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
        color: '#C6345C',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    headerIcon: {
        marginLeft: 20
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
    }


})