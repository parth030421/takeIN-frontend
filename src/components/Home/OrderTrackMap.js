
import React, { Component } from "react";
import { Dimensions, Modal, StyleSheet, Text, Image, Pressable, View, CheckBox, TextInput, SafeAreaView, Linking } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { AppImages } from "../../res";
import Icon from "react-native-vector-icons/Ionicons";
import Config from "../../Config";
import { Row, Col, PulseLoader } from '../componentIndex';
import APIKit from "../../APIKit";
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyAXI3puhgpn9khopF9zPl7Q_5O1YP-E_8s';
class OrderTrackMap extends Component {
    state = {
        modalVisible: false,
        formatted_address: '',
        markerData: {
            latitude: 35.1790507,
            longitude: -6.1389008,
        }, mapData: {
            latitude: 35.1790507,
            longitude: -6.1389008,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        },
        coordinates: [
            {
                latitude: 37.3317876,
                longitude: -122.0054812,
            },
            {
                latitude: 37.771707,
                longitude: -122.4053769,
            },
        ],
    };

    onMapPress = (e) => {
        this.setState({
            coordinates: [
                ...this.state.coordinates,
                e.nativeEvent.coordinate,
            ],
        });
    }
    componentDidMount() {
        APIKit.location = { lat: 23.8859, lng: 45.0792 }
        // console.log("location", APIKit.location.lat, APIKit.location.lng)
        this.setState({ latitude: APIKit.location.lat })
        this.setState({ longitude: APIKit.location.lng })
    }

    onRegionChange = region => {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + region.latitude + ',' + region.longitude + '&key=' + 'AIzaSyAXI3puhgpn9khopF9zPl7Q_5O1YP-E_8s')
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("formar", responseJson.results[0])
                this.setState({ formatted_address: JSON.stringify(responseJson.results[0].formatted_address).replace('"', '') })

            })
    }

    setModalVisible = (visible) => {
        // APIKit.getAddress();
        this.setState({ modalVisible: visible });
    }

    render() {

        const { modalVisible } = this.state;
        const CS = Config.style
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={this.props.dismiss}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.mapcontainer}>
                                <View style={styles.map}>
                                    <MapView
                                        initialRegion={{
                                            latitude: LATITUDE,
                                            longitude: LONGITUDE,
                                            latitudeDelta: LATITUDE_DELTA,
                                            longitudeDelta: LONGITUDE_DELTA,
                                        }}
                                        style={StyleSheet.absoluteFill}
                                        ref={c => this.mapView = c}
                                        onPress={this.onMapPress}
                                        onRegionChangeComplete={this.onRegionChange}
                                    >
                                        {this.state.coordinates.map((coordinate, index) =>
                                            <Marker
                                                coordinate={this.state.coordinates[0]}
                                                description={"Here is Restaurant"}
                                            >
                                                <Image source={AppImages.mapStart} style={{ height: 50, width: 50 }} />
                                            </Marker>
                                        )}
                                        {this.state.coordinates.map((coordinate, index) =>
                                            <Marker
                                                coordinate={this.state.coordinates[1]}
                                                description={"Your Location"}
                                            >
                                                <Image source={AppImages.mapEnd} style={{ height: 63, width: 50 }} />
                                            </Marker>
                                        )}
                                        {this.state.coordinates.map((coordinate, index) =>
                                            <Marker
                                                coordinate={{
                                                    latitude: 37.75464820000001,
                                                    longitude: -122.4023174,
                                                }}
                                                description={"Delivery man is here"}
                                            >
                                                <Image source={AppImages.delivery5} style={{ height: 50, width: 50 }} />
                                            </Marker>
                                        )}
                                        {/* <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} /> */}
                                        {(this.state.coordinates.length >= 2) && (
                                            <MapViewDirections
                                                origin={this.state.coordinates[0]}
                                                destination={this.state.coordinates[1]}
                                                apikey={GOOGLE_MAPS_APIKEY}
                                                strokeWidth={4}
                                                strokeColor="#5CAC7D"
                                            />
                                        )}
                                    </MapView>


                                    <SafeAreaView style={styles.header}>
                                        <Row size={12}>
                                            <Col sm={1.5}>
                                                <Pressable onPress={() => this.setModalVisible(!modalVisible)}>
                                                    <Icon name='close-sharp' size={30} style={{ marginLeft: 10 }}></Icon>
                                                </Pressable>
                                            </Col>
                                            <Col sm={9} style={Config.style.Col}><Text style={[styles.modalText, Config.style.font16, Config.style.FW500, CS.FontMedium, { textAlign: 'center' }]}>#896589_TK</Text></Col>
                                            <Col sm={1.5} style={{ justifyContent: 'flex-end' }}>
                                                {/* <Pressable >
                                                    <Image source={AppImages.about2} style={[{ width: 22, height: 22, marginTop: 7 }]} />
                                                </Pressable> */}
                                            </Col>
                                        </Row>
                                    </SafeAreaView>
                                    <SafeAreaView style={styles.footer}>
                                        <Row style={[CS.card, { margin: 15, borderColor: '#442B7E', borderTopWidth: 5, padding: 0 }]}>
                                            <Col style={[CS.Col, { height: 98, borderBottomWidth: 2, borderBottomColor: '#E5E5E5' }]} sm={12}>
                                                <Text style={[CS.font24, CS.FontBold, CS.FW700]}>Within 30 min</Text>
                                                <Text style={[CS.font14, CS.FontRegular, CS.FW400, CS.MT10]}>The driver is on his way to your door step</Text>
                                            </Col>
                                            <Col style={[CS.Col, { height: 70, paddingHorizontal: 47 }]} sm={12}>
                                                <Text style={[CS.font14, CS.FontRegular, CS.FW400, { textAlign: 'center', color: '#707070' }]}>This shop delivers with its own rider, so the estimated time might not be same.</Text>
                                            </Col>
                                        </Row>
                                        <Row size={12} style={[CS.Col, { margin: 15, height: 68, borderColor: '#E5E5E5', backgroundColor: '#ffffff', borderRadius: 13, borderWidth: 2, padding: 0 }]}>
                                            <Col style={[CS.Col]} sm={2.5}>
                                                <Image source={AppImages.DBoy} style={[{ width: 50, height: 50, borderWidth: 3, borderColor: '#442B7E', borderRadius: 6, marginTop: 3 }]} />
                                                <Image source={AppImages.verify} style={[{ width: 18, height: 20, position: 'absolute', top: 43, left: 49 }]} />
                                            </Col>
                                            <Col style={[{ justifyContent: 'center' }]} sm={5.5}>
                                                <Text style={[CS.font16, CS.FontMedium, CS.FW500]}>Ahmed Ali</Text>
                                                <Text style={[CS.font12, CS.FontMedium, CS.FW500, { color: '#8950FC' }]}>Vaccinated</Text>
                                            </Col>
                                            <Col style={[CS.Col]} sm={4}>
                                                <Pressable onPress={() => Linking.openURL('tel:8901007953')} style={[Config.style.greenBtn, CS.Col, { marginRight: 15, height: 37, width: 88, borderRadius: 35 }]}>
                                                    <Row>
                                                        <Col>
                                                            <Image source={AppImages.callWhite} style={[{ width: 15, height: 15, marginRight: 8 }]} />
                                                        </Col>
                                                        <Col>
                                                            <Text style={[CS.font14, CS.FontMedium, CS.whiteText, CS.FW500]}>Call</Text>
                                                        </Col>
                                                    </Row>
                                                </Pressable>
                                            </Col>
                                        </Row>
                                    </SafeAreaView>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Pressable style={styles.headerIcon} onPress={() => this.setModalVisible(true)}>
                    <Text style={[CS.font14, CS.FontMedium, CS.FW500, CS.MT10, { color: '#5CAC7D', textDecorationLine: 'underline' }]}>Track the order</Text>
                </Pressable>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    mapcontainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },

    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '50%'
    },
    marker: {
        height: 52,
        width: 25,
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '50%'
    },
    footer: {
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
        bottom: 0,
        position: 'absolute',
        width: '100%',
        paddingHorizontal: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        top: 0,
        position: 'absolute',
        width: '100%',
        padding: 15
    },
    region: {
        color: '#fff',
        lineHeight: 20,
        margin: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    modalView: {
        width: '100%',
        height: '100%',
        backgroundColor: "white",
        borderRadius: 20,
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
    btnText: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        color: '#ffffff'
    },
    footerBtn: {
        position: 'absolute',
        bottom: 10,

    },
    modalText: {
        width: 200
    }

});

export default OrderTrackMap;