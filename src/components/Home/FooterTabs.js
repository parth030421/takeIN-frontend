import React, { Component } from "react";
import {
  View,
  ActivityIndicator,
  FlatList,
  StatusBar,
  Pressable,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { AppImages } from "../../res";
import APIKit from "../../APIKit";
import Config from "../../Config";
import {
  SignIn,
  Footer,
  Button,
  Wrapper,
  Header,
  Left,
  Right,
  Search,
  AddressSelect,
  Cuisines,
  Sorting,
  LabelIconInput,
  P,
  Row,
  Col,
  ImageSlider,
} from "./../componentIndex";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default class FooterTabs extends Component {
  state = {
    distanceFromEnd: 10,
    isShowLoginPopup: false,
  };
  setLoginModalVisible = (visible) => {
    this.setState({ isShowLoginPopup: visible });
  };

  closeModal = () => {
    this.setLoginModalVisible(false);
  };

  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  handleLoadMore() {}
  goToRestaurent(id) {
    APIKit.ResturantId = id;
    APIKit.searchPopup = false;
    this.props.navigation.navigate("Restaurant");
  }
  showLaunchPopup(status) {
    this.props.navigation.navigate("Home", {
      isShowLaunchPopup: status,
    });
  }
  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("accessToken");
      Config.userAuthToken = value;
    } catch (e) {
      // error reading valu
    }
  };
  render() {
    const CS = Config.style;
    return (
      <Row
        size={12}
        style={[CS.tabBox, { backgroundColor: "#ffffff", height: 80 }]}
      >
        <Col sm={3}>
          <Pressable
            onPress={() => this.props.navigation.navigate("Home")}
            style={[CS.col, { paddingTop: 15 }]}
          >
            {this.props.navigation.state.routeName == "Home" ? (
              <Image
                source={AppImages.HomePink}
                style={{ width: 22, height: 22 }}
              />
            ) : (
              <Image
                source={AppImages.HomeGray}
                style={{ width: 22, height: 22 }}
              />
            )}
            <Text
              style={[
                CS.FontRegular,
                CS.font12,
                CS.FW400,
                this.props.navigation.state.routeName == "Home"
                  ? { color: "#C6345C" }
                  : { color: "#AAACAE" },
              ]}
            >
              Home
            </Text>
          </Pressable>
        </Col>
        <Col sm={3}>
          <Pressable
            style={[CS.col, { paddingTop: 15 }]}
            onPress={() => this.showLaunchPopup(true)}
          >
            <Image source={AppImages.tab2} style={{ width: 22, height: 22 }} />
            <Text
              style={[
                CS.FontRegular,
                CS.font12,
                CS.FW400,
                { color: "#AAACAE" },
              ]}
            >
              Deals
            </Text>
          </Pressable>
        </Col>
        <Col sm={3}>
          <Pressable
            style={[CS.col, { paddingTop: 15 }]}
            onPress={() => this.showLaunchPopup(true)}
          >
            <Image source={AppImages.tab3} style={{ width: 22, height: 22 }} />
            <Text
              style={[
                CS.FontRegular,
                CS.font12,
                CS.FW400,
                { color: "#AAACAE" },
              ]}
            >
              Dine
            </Text>
          </Pressable>
        </Col>
        <Col sm={3}>
          <Pressable
            onPress={() => {
              Config.userAuthToken == null
                ? console.log("")
                : this.props.navigation.navigate("Profile");
            }}
            style={[CS.col, { paddingTop: 14 }]}
          >
            {this.props.navigation.state.routeName == "Profile" ? (
              <Image
                source={AppImages.menuUserActive}
                style={{
                  width: 46,
                  height: 46,
                  resizeMode: "contain",
                  borderColor: "#C6345C",
                  marginTop: -1,
                }}
              />
            ) : (
              <Image
                source={AppImages.menu_user}
                style={{
                  width: 46,
                  height: 46,
                  resizeMode: "contain",
                  marginTop: -1,
                }}
              />
            )}
          </Pressable>
        </Col>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isShowLoginPopup}
          onRequestClose={() => {
            this.setLoginModalVisible(!this.state.isShowLoginPopup);
          }}
        >
          <View style={CS.blurBGView}>
            <View style={styles.modalView}>
              <SignIn
                navigation={this.props.navigation}
                closeModal={this.closeModal}
              ></SignIn>
            </View>
          </View>
        </Modal>
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  tabBox: {
    borderRadius: 16,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  tabBoxIcon: {
    // height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBoxIconQR: {
    height: 76,
    width: 76,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#452B7D",
    marginTop: -33,
  },
});
