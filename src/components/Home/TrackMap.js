import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Image,
  Pressable,
  View,
  CheckBox,
  TextInput,
  SafeAreaView,
  Dimensions,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { AppImages } from "../../res";
import Icon from "react-native-vector-icons/Ionicons";
import Config from "../../Config";
import { Row, Col, PulseLoader } from "../componentIndex";
import APIKit from "../../APIKit";
const latitudeDelta = 0.025;
const longitudeDelta = 0.025;
class TrackMap extends Component {
  state = {
    modalVisible: false,
    formatted_address: "",
    markerData: {
      latitude: 35.1790507,
      longitude: -6.1389008,
    },
    mapData: {
      latitude: 35.1790507,
      longitude: -6.1389008,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
  };

  componentDidMount() {
    // console.log("location", APIKit.location.lat, APIKit.location.lng)
    this.setState({ latitude: APIKit.location.lat });
    this.setState({ longitude: APIKit.location.lng });
  }

  onRegionChange = (region) => {
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        region.latitude +
        "," +
        region.longitude +
        "&key=" +
        "AIzaSyAXI3puhgpn9khopF9zPl7Q_5O1YP-E_8s"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log("formar", responseJson.results[0])
        this.setState({
          formatted_address: JSON.stringify(
            responseJson.results[0].formatted_address
          ).replace('"', ""),
        });
      });
  };

  setModalVisible = (visible) => {
    APIKit.getAddress();
    this.setState({ modalVisible: visible });
  };

  addAddress() {
    this.props.addressData.location = {
      coordinates: [APIKit.location.lng, APIKit.location.lat],
    };
    this.props.addressData.addressLine1 = this.state.formatted_address;
    let payload = {
      payload: {
        address: this.props.addressData,
      },
    };
    console.log("add Address Request", payload.payload.address);

    fetch(Config.baseUrl + "user/address", {
      method: "POST",
      headers: APIKit.CommonHeaders2,
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == true) {
          console.log("add Address Response", responseJson);
          // APIKit.setDefaultAddress(id);
          APIKit.getAddress();
          APIKit.selectAddressPopup = false;
          this.setModalVisible(false);
          this.props.closeModal(true);
        } else {
          APIKit.showCommonToast("ERROR IN SAVE ADDRESS", 1500, "error");
          this.setModalVisible(false);
        }
      })
      .catch((error) => {
        console.error("addAddresserror", error);
      });
  }

  render() {
    const { modalVisible } = this.state;
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
                    style={styles.map}
                    initialRegion={{
                      latitude: APIKit.location.lat,
                      longitude: APIKit.location.lng,
                      longitudeDelta: 0.004,
                      latitudeDelta: 0.009,
                    }}
                    onRegionChangeComplete={this.onRegionChange}
                  />
                  <View style={styles.markerFixed}>
                    <Image
                      style={styles.marker}
                      source={AppImages.Marker}
                      resizeMode={"contain"}
                    />
                    {/* <PulseLoader size={150} /> */}
                  </View>
                  <SafeAreaView style={styles.header}>
                    <Row size={12}>
                      <Col sm={1.5}>
                        <Pressable
                          onPress={() => this.setModalVisible(!modalVisible)}
                        >
                          <Icon
                            name="close-sharp"
                            size={30}
                            style={{ marginLeft: 10 }}
                          ></Icon>
                        </Pressable>
                      </Col>
                      <Col sm={9} style={Config.style.Col}>
                        <Text
                          style={[
                            styles.modalText,
                            Config.style.font14,
                            Config.style.FW700,
                            { textAlign: "center" },
                          ]}
                        >
                          {this.state.formatted_address}
                        </Text>
                      </Col>
                      <Col sm={1.5}></Col>
                    </Row>
                  </SafeAreaView>
                  <SafeAreaView style={styles.footer}>
                    <Pressable
                      onPress={() => this.addAddress()}
                      style={[Config.style.greenBtn, styles.footerBtn]}
                    >
                      <Text
                        style={[Config.style.whiteText, Config.style.font14]}
                      >
                        Confirm location
                      </Text>
                    </Pressable>
                  </SafeAreaView>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Pressable
          onPress={() => this.setModalVisible(true)}
          style={[
            Config.style.Col,
            Config.style.greenBtn,
            { width: Dimensions.get("window").width - 25 },
          ]}
        >
          <Text style={[styles.btnText]}>Set pin on map</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapcontainer: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  markerFixed: {
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
    position: "absolute",
    top: "50%",
  },
  marker: {
    height: 52,
    width: 25,
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
    position: "absolute",
    top: "50%",
  },
  footer: {
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: 0,
    position: "absolute",
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    top: 0,
    position: "absolute",
    width: "100%",
    padding: 15,
  },
  region: {
    color: "#fff",
    lineHeight: 20,
    margin: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalView: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    width: "100%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    color: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  footerBtn: {
    position: "absolute",
    bottom: 10,
  },
  modalText: {
    width: 200,
  },
});

export default TrackMap;
