import React from "react";
import {
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  LogBox,
  Modal,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  StatusBar,
  BackHandler,
} from "react-native";
import {
  Wrapper,
  Header,
  Left,
  MenuButton,
  launchingSoon,
  Right,
  SignIn,
  FooterTabs,
  Footer,
  ContentLoader,
  RestaurantList,
  Container,
  Search,
  Row,
  Col,
  AddressSelect,
  ProgressiveImage,
} from "./../components/componentIndex";
import Config from "./../Config";

import Icon from "react-native-vector-icons/Ionicons";
import { AppImages } from "../res";
import { Notification_sound } from "../res/Notification_sound.wav";
import APIKit from "./../APIKit";
// import { connect } from "react-redux";
// import countries from '../res/countries';
// import AsyncStorage from '@react-native-community/async-storage';
import SyncStorage from "sync-storage";
const marginTop = Platform.OS === "ios" ? 35 : 10;
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotification from "react-native-push-notification";
import { getUniqueId } from "react-native-device-info";

class Home extends React.Component {
  ResturentList = [];
  OrderList = [];
  bannerList = [];
  MealType = [];
  state = {
    showLoader: 0,
    showBannerLoader: 0,
    // users: countries,
    currentPage: 0,
    actionSheet: false,
    closeActionSheet: true,
    isShowMiddleSection: true,
    restaurantEmpty: false,
    isConnected: true,
    isDisconnect: false,
    isfilterMealTypeNull: true,
    isShowLoginPopup: false,
    isLaunchingSoonPoup: true,
  };

  setLoginModalVisible = (visible) => {
    this.setState({ isShowLoginPopup: visible });
  };

  closeModal = () => {
    this.setLoginModalVisible(false);
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.onAndroidBackPress
    );
  }

  onAndroidBackPress = () => {
    BackHandler.exitApp();
  };
  constructor(props) {
    super(props);
  }

  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("accessToken");
      Config.userAuthToken = value;
      if (value !== null) {
        console.log("accessToken", value);
        Config.userAuthToken = value;
        APIKit.getHeader();
        if ((await SyncStorage.get("OrderList")) == undefined) {
          this.getOrderList();
        } else {
          this.OrderList = await SyncStorage.get("OrderList");
        }

        if ((await SyncStorage.get("savedAddressList")) == undefined) {
          APIKit.getAddress();
        } else {
          APIKit.savedAddressList = await SyncStorage.get("savedAddressList");
        }
      }
      this.setState({
        isLaunchingSoonPoup: SyncStorage.set("isLaunchingSoonPoup"),
      });
      if ((await SyncStorage.get("MealType")) == null) {
        this.getMealType();
      } else {
        this.MealType = await SyncStorage.get("MealType");
      }
      if ((await SyncStorage.get("bannerList")) == undefined) {
        this.getBannerList();
      } else {
        this.bannerList = await SyncStorage.get("bannerList");
      }

      if ((await SyncStorage.get("ResturentList")) == undefined) {
        this.getRestaurantList();
      } else {
        this.ResturentList = await SyncStorage.get("ResturentList");
      }
    } catch (e) {
      // error reading valu
    }
  };


  handlePushNotification() {
    console.log('handlePush')
    PushNotification.configure({
      onRegister: async function (token) {
        const deviceId = getUniqueId();
        const cookieMonsterId = await AsyncStorage.getItem("userId");
        const isRegistered = await AsyncStorage.getItem("RegisterKey");
        if (isRegistered === "true") {
          console.log("device already registered");
        } else {
          fetch(Config.baseUrl + "push/notification", {
            method: "POST",
            headers: APIKit.CommonHeaders,
            body: JSON.stringify({
              payload: {
                cookieMonsterId: cookieMonsterId,
                fcmToken: token.token,
                deviceId: deviceId,
                platform: Platform.OS,
              },
            }),
          })
            .then((response) => response.json())
            .then(async (responseJson) => {
              await AsyncStorage.setItem("RegisterKey", "true");            
            })
            .catch((error) => {
              this.setState({ isConnected: false });
            });
            
        }
        console.log(deviceId , 'deviceId')
        console.log(token.token , 'token.token')
      },
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        PushNotification.localNotification({
          id: notification.id ,
          title: notification.title,
          message: notification.message,
          smallIcon: "ic_notification",
          soundName: Notification_sound,  
        })
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);
      },
      onRegistrationError: function (err) {
        // console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
 
  }

  componentDidMount() {
    this.handlePushNotification();
    this.getToken();
    if (Platform.OS === "android") {
      BackHandler.addEventListener(
        "hardwareBackPress",
        this.onAndroidBackPress
      );
    }
    APIKit.selectedMenu = "Home";
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.setState({ isConnected: true });
        setTimeout(() => {
          this.getMealType(); 
          this.getRestaurantList();
          this.getBannerList();
          if (Config.userAuthToken != null) {
            this.getOrderList();
            APIKit.getAddress();
          }
        }, 10000);
        this.convertdate();
        APIKit.selectAddressPopup = false;
        APIKit.searchPopup = false;
      } else {
        this.setState({ isConnected: false });
        this.ResturentList = [];
        this.OrderList = [];
        this.bannerList = [];
        this.MealType = [];
      }
    });
  }

  reloadApp() {
    this.getRestaurantList();
    this.getBannerList();
    this.convertdate();
    this.getMealType();
    if (Config.userAuthToken != null) {
      this.getOrderList();
      APIKit.getAddress();
    }
    APIKit.selectAddressPopup = false;
    APIKit.searchPopup = false;
  }

  async getRestaurantList() {
    fetch(Config.baseUrl + "restaurant", {
      method: "GET",
      headers: APIKit.CommonHeaders,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == true) {
          this.ResturentList = responseJson.success.data.restaurant;
          const storeData = async (responseJson) => {
            try {
              await SyncStorage.set(
                "ResturentList",
                responseJson.success.data.restaurant
              );
            } catch (e) {}
          };
          this.setState({ showLoader: 1 });
        }
      })
      .catch((error) => {
        this.setState({ isConnected: false });
      });
  }

  handleLoadMore = async () => {
    this.setState({
      currentPage: this.state.currentPage + 1,
    });
  };

  async getBannerList() {
    fetch(Config.baseUrl + "home-banner", {
      method: "GET",
      headers: APIKit.CommonHeaders,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.bannerList = responseJson.success.data.data;
        const storeData = async (responseJson) => {
          try {
            await SyncStorage.set("bannerList", responseJson.success.data.data);
          } catch (e) {}
        };
        this.setState({ showBannerLoader: 1 });
      })
      .catch((error) => {
        console.error("getBannerList Network ewwwwwww", JSON.stringify(error));
      });
  }

  async getOrderList() {
    fetch(Config.baseUrl + "order", {
      method: "GET",
      headers: APIKit.CommonHeaders2,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == true) {
          this.OrderList = responseJson.success.data
            .sort(function (a, b) {
              var c = new Date(a.orderDate);
              var d = new Date(b.orderDate);
              return c - d;
            })
            .reverse();
          const storeData = async (responseJson) => {
            try {
              await SyncStorage.set("OrderList", this.OrderList);
            } catch (e) {}
          };
        }
        this.setState({ showBannerLoader: 1 });
      })
      .catch((error) => {
        console.error("getOrderList error", error);
      });
  }

  filterMealType(type) {
    if (type.mealType == this.state.selectedCat) {
      this.setState({ selectedCat: "" });
      this.getRestaurantList();
      this.setState({ isfilterMealTypeNull: true });
    } else {
      fetch(Config.baseUrl + "restaurant?mealTypeName=" + type.mealType, {
        method: "GET",
        headers: APIKit.CommonHeaders,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({ selectedCat: type.mealType });
          if (responseJson.status == true) {
            this.setState({ selectedCat: type.mealType });
            this.ResturentList = responseJson.success.data.restaurant;
            this.setState({ isfilterMealTypeNull: true });
          } else {
            // console.log("getRestaurantList", responseJson)
            if (responseJson.error.code == "RESTAURANT_NOT_FOUND!") {
              this.ResturentList = [];
              this.setState({ isfilterMealTypeNull: false });
            }
          }
          // this.setState({ isShowMiddleSection: false })
          this.setState({ showLoader: 1 });
          // }
        })
        .catch((error) => {
          this.setState({ selectedCat: type.mealType });
          console.error("getRestaurantListerror", error);
        });
    }
  }

  async getMealType() {
    fetch(Config.baseUrl + "meal-type", {
      method: "GET",
      headers: APIKit.CommonHeaders,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == true) {
          this.MealType = responseJson.success.data.data;
          const storeData = async (responseJson) => {
            try {
              await SyncStorage.set("MealType", responseJson.success.data.data);
            } catch (e) {}
          };
          this.setState({ showLoader: 1 });
        }
      })
      .catch((error) => {
        console.error("getMealType", error);
      });
  }

  convertdate(convertDate) {
    let date = new Date(convertDate);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    let format = (d, a = d.toString().split` `) => a[2] + " " + a[1];
    return format(date) + " " + strTime;
  }

  goToRestaurent(id) {
    APIKit.ResturantId = id;
    this.props.navigation.navigate("Restaurant");
  }

  render() {
    const CS = Config.style;
    const { navigation } = this.props;
    this.setState();
    const footer = (
      <Footer>
        {/* <FooterTabs navigation={this.props.navigation}></FooterTabs> */}
      </Footer>
    );
    return (
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <View style={{ flex: 0.9 }}>
          <ScrollView
            style={{ marginTop: marginTop }}
            keyboardShouldPersistTaps={"handled"}
          >
            <Wrapper navigation={this.props.navigation}>
              <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

              <Header>
                <Left style={CS.imageIcon}>
                  <Pressable
                    onPress={() => this.props.navigation.toggleDrawer()}
                  >
                    <Image
                      source={AppImages.sideMenu}
                      style={{ width: 22, height: 22, marginLeft: 0 }}
                    />
                  </Pressable>
                </Left>
                <AddressSelect
                  pageName="Home"
                  navigation={this.props.navigation}
                ></AddressSelect>
                <Right>
                  <Pressable
                    onPress={() => {
                      Config.userAuthToken == ""
                        ? this.setLoginModalVisible(true)
                        : this.props.navigation.navigate("Notifications");
                      APIKit.previousScreen =
                        this.props.navigation.state.routeName;
                    }}
                    style={styles.headerIcon}
                  >
                    <Image
                      source={AppImages.Notification}
                      style={{ width: 26, height: 26 }}
                    />
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      Config.userAuthToken == ""
                        ? this.setLoginModalVisible(true)
                        : this.props.navigation.navigate("Cart");
                      APIKit.previousScreen =
                        this.props.navigation.state.routeName;
                    }}
                    style={styles.headerIcon}
                  >
                    <Image
                      source={AppImages.Buy}
                      style={{ width: 25, height: 28 }}
                    />
                  </Pressable>
                  {/* <Pressable onPress={() => { this.props.navigation.navigate('Cart'); APIKit.previousScreen = this.props.navigation.state.routeName }} style={styles.headerIcon}>
                    <Image source={AppImages.Buy} style={{ width: 25, height: 28 }} />
                  </Pressable> */}
                </Right>
              </Header>

              <Container>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <View style={[CS.Col, styles.searchBox]}>
                    <Row size={12}>
                      <Col sm={1.2} style={CS.Col}>
                        <Pressable>
                          <Image
                            source={AppImages.searchBlue}
                            style={{ width: 19, height: 19 }}
                          />
                          {/* <Icon name='search-sharp' color={Config.primaryColor} size={25} style={{ zIndex: 10 }}></Icon> */}
                        </Pressable>
                      </Col>
                      <Col sm={10.8}>
                        <Search
                          restaurantList={this.ResturentList}
                          navigation={this.props.navigation}
                        ></Search>
                      </Col>
                    </Row>
                  </View>
                </View>
              </Container>

              <Row
                size={12}
                style={[CS.PD15]}
                Hidden={this.MealType.length == 0}
              >
                {Platform.OS === "ios" ? (
                  this.MealType.map((type) => (
                    <Col key={type._id} sm={3} style={[CS.col]}>
                      <Pressable
                        onPress={() => this.filterMealType(type)}
                        style={[
                          styles.categoryBox,
                          this.state.selectedCat == type.mealType
                            ? { backgroundColor: "#5CAC7D" }
                            : { backgroundColor: "#F1F2F6" },
                        ]}
                      >
                        {type.mealType == "Breakfast" ? (
                          <Image
                            source={
                              this.state.selectedCat == type.mealType
                                ? AppImages.breakfCatWhite
                                : AppImages.breakfCatBlack
                            }
                            style={styles.MealImage}
                          />
                        ) : (
                          <View></View>
                        )}
                        {type.mealType == "Lunch" ? (
                          <Image
                            source={
                              this.state.selectedCat == type.mealType
                                ? AppImages.lunchCatWhite
                                : AppImages.lunchCatBlack
                            }
                            style={styles.MealImage}
                          />
                        ) : (
                          <View></View>
                        )}
                        {type.mealType == "Dinner" ? (
                          <Image
                            source={
                              this.state.selectedCat == type.mealType
                                ? AppImages.dinnerCatWhite
                                : AppImages.dinnerCatBlack
                            }
                            style={styles.MealImage}
                          />
                        ) : (
                          <View></View>
                        )}
                        {type.mealType == "Dessert" ? (
                          <Image
                            source={
                              this.state.selectedCat == type.mealType
                                ? AppImages.desertCatWhite
                                : AppImages.desertCatBlack
                            }
                            style={[styles.MealImage, { width: 23 }]}
                          />
                        ) : (
                          <View></View>
                        )}
                      </Pressable>
                      <Text
                        style={[
                          styles.categoryTitle,
                          CS.FW400,
                          CS.FontRegular,
                          CS.font12,
                        ]}
                      >
                        {type.mealType}
                      </Text>
                    </Col>
                  ))
                ) : (
                  <SafeAreaView>
                    <ScrollView
                      horizontal={true}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={[
                        {
                          justifyContent: "space-between",
                          alignItems: "center",
                        },
                        this.MealType.length < 3
                          ? { width: "auto" }
                          : { width: "100%" },
                      ]}
                      showsHorizontalScrollIndicator={false}
                    >
                      {this.MealType.map((type) => (
                        <Col
                          key={type._id}
                          sm={3}
                          style={[
                            CS.col,
                            this.MealType.length > 3
                              ? { paddingLeft: 0 }
                              : { paddingRight: 10 },
                          ]}
                        >
                          <Pressable
                            onPress={() => this.filterMealType(type)}
                            style={[
                              styles.categoryBox,
                              this.state.selectedCat == type.mealType
                                ? { backgroundColor: "#5CAC7D" }
                                : { backgroundColor: "#F1F2F6" },
                            ]}
                          >
                            {type.mealType == "Breakfast" ? (
                              <Image
                                source={
                                  this.state.selectedCat == type.mealType
                                    ? AppImages.breakfCatWhite
                                    : AppImages.breakfCatBlack
                                }
                                style={styles.MealImage}
                              />
                            ) : (
                              <View></View>
                            )}
                            {type.mealType == "Lunch" ? (
                              <Image
                                source={
                                  this.state.selectedCat == type.mealType
                                    ? AppImages.lunchCatWhite
                                    : AppImages.lunchCatBlack
                                }
                                style={styles.MealImage}
                              />
                            ) : (
                              <View></View>
                            )}
                            {type.mealType == "Dinner" ? (
                              <Image
                                source={
                                  this.state.selectedCat == type.mealType
                                    ? AppImages.dinnerCatWhite
                                    : AppImages.dinnerCatBlack
                                }
                                style={styles.MealImage}
                              />
                            ) : (
                              <View></View>
                            )}
                            {type.mealType == "Dessert" ? (
                              <Image
                                source={
                                  this.state.selectedCat == type.mealType
                                    ? AppImages.desertCatWhite
                                    : AppImages.desertCatBlack
                                }
                                style={[styles.MealImage, { width: 23 }]}
                              />
                            ) : (
                              <View></View>
                            )}
                          </Pressable>
                          <Text
                            style={[
                              styles.categoryTitle,
                              CS.FontRegular,
                              CS.FW400,
                              CS.font12,
                            ]}
                          >
                            {type.mealType}
                          </Text>
                        </Col>
                      ))}
                    </ScrollView>
                  </SafeAreaView>
                )}
              </Row>

              <View style={{ marginBottom: 100 }}>
                <Row Hidden={!this.state.isShowMiddleSection}>
                  <Row Hidden={this.OrderList.length == 0}>
                    <Text
                      style={[
                        CS.font16,
                        CS.FontBold,
                        CS.FW700,
                        CS.MT5,
                        CS.ML12,
                      ]}
                    >
                      Order Again
                    </Text>
                    <SafeAreaView>
                      <ScrollView
                        horizontal={true}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style=
                        {styles.orderAgainBox}
                      >
                        {this.OrderList.slice(0, 5).map((item) => (
                          <View
                            key={item._id}
                            style={[styles.orderAgainItem, { height: 138 }]}
                          >
                            <Row style={{ margin: 15 }}>
                              <Col sm={3}>
                                <View
                                  style={{
                                    borderRadius: 20,
                                    height: 53,
                                    width: 53,
                                  }}
                                >
                                  <ProgressiveImage
                                    style={{ width: 53, height: 53 }}
                                    uri={item?.restaurants[0]?.logo}
                                  />
                                </View>
                              </Col>
                              <Col sm={5}>
                                <Text
                                  style={[
                                    CS.font17,
                                    CS.FontBold,
                                    { lineHeight: 21 },
                                  ]}
                                >
                                  {item?.restaurants[0]?.name}
                                </Text>
                                <Text
                                  style={[
                                    CS.font13,
                                    CS.greyText,
                                    CS.FontRegular,
                                  ]}
                                >
                                  {this.convertdate(item?.orderDate)}
                                </Text>
                              </Col>
                              <Col sm={4}>
                                <Text
                                  style={[
                                    CS.font15,
                                    CS.greenText,
                                    CS.FW400,
                                    CS.FontRegular,
                                    { textAlign: "right", paddingTop: 3 },
                                  ]}
                                >
                                  SAR {APIKit.round(item?.payableAmount, 2)}
                                </Text>
                              </Col>
                              <Col sm={3}></Col>
                              <Col sm={9} style={[{ height: 43 }]}>
                                <Text
                                  style={[
                                    CS.font15,
                                    CS.FontRegular,
                                    CS.greyText,
                                    CS.FW400,
                                  ]}
                                  ellipsizeMode="tail"
                                  numberOfLines={3}
                                >
                                  {item?.cartItems.map((menu) =>
                                    item?.cartItems[0].name == menu.name
                                      ? menu.quantity + " " + menu.name
                                      : " · " + menu.quantity + " " + menu.name
                                  )}
                                </Text>
                              </Col>
                            </Row>
                          </View>
                        ))}
                      </ScrollView>
                    </SafeAreaView>
                  </Row>
                  <Row Hidden={this.bannerList.length == 0}>
                    {this.bannerList.length == 1 ? (
                      <Row style={{ padding: 12 }}>
                        {this.bannerList.map((banner) => (
                          <View
                            key={banner?._id}
                            style={[
                              styles.orderAgainItem,
                              { width: "100%", marginLeft: 0, paddingLeft: 0 },
                            ]}
                          >
                            <Image
                              style={styles.bannerImage}
                              source={{ uri: banner?.backgroundImage }}
                            />
                            <View
                              style={{
                                position: "absolute",
                                zIndex: 10,
                                paddingTop: 21,
                                paddingLeft: 19,
                                paddingRight: "40%",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#0000003d",
                                borderRadius: 10,
                              }}
                            >
                              <Text
                                style={[
                                  CS.whiteText,
                                  CS.font24,
                                  CS.FW700,
                                  CS.FontBold,
                                ]}
                              >
                                {banner?.title}
                              </Text>
                              <Text
                                style={[
                                  CS.whiteText,
                                  CS.font14,
                                  CS.FW500,
                                  CS.FontMedium,
                                  CS.MT10,
                                ]}
                              >
                                {banner?.description}
                              </Text>
                              <Pressable
                                onPress={() =>
                                  this.props.navigation.navigate(
                                    "RestaurentList"
                                  )
                                }
                              >
                                <Row size={12} style={{ marginTop: 20 }}>
                                  <Col>
                                    <Image
                                      source={AppImages.rightWhite}
                                      style={[
                                        styles.arrowIcon,
                                        { marginLeft: 0 },
                                      ]}
                                    />
                                  </Col>
                                  <Col>
                                    <Text
                                      style={[
                                        CS.FontBold,
                                        CS.whiteText,
                                        CS.font15,
                                        { paddingLeft: 8 },
                                      ]}
                                    >
                                      Order now
                                    </Text>
                                  </Col>
                                </Row>
                              </Pressable>
                            </View>
                          </View>
                        ))}
                      </Row>
                    ) : (
                      <ScrollView
                        horizontal={true}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={[styles.orderAgainBox, {}]}
                      >
                        {this.bannerList.map((banner) => (
                          <View key={banner._id} style={styles.orderAgainItem}>
                            <Image
                              style={styles.bannerImage}
                              source={{ uri: banner?.backgroundImage }}
                            />
                            <View
                              style={{
                                position: "absolute",
                                zIndex: 10,
                                paddingTop: 21,
                                paddingLeft: 19,
                                paddingRight: "40%",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#0000003d",
                                borderRadius: 10,
                              }}
                            >
                              <Text style={[CS.font24, CS.whiteText, CS.FW700]}>
                                {banner.title}
                              </Text>
                              <Text
                                style={[
                                  CS.font14,
                                  CS.whiteText,
                                  CS.FW500,
                                  CS.MT5,
                                ]}
                              >
                                {banner?.description}
                              </Text>
                              <Pressable
                                onPress={() =>
                                  this.props.navigation.navigate(
                                    "RestaurentList"
                                  )
                                }
                              >
                                <Row size={12}>
                                  <Col>
                                    <Image
                                      source={AppImages.rightWhite}
                                      style={styles.arrowIcon}
                                    />
                                  </Col>
                                  <Col>
                                    <Text style={[CS.FontBold, CS.font14]}>
                                      Order now
                                    </Text>
                                  </Col>
                                </Row>
                              </Pressable>
                            </View>
                          </View>
                        ))}
                      </ScrollView>
                    )}
                  </Row>
                </Row>

                <Row size={12} Hidden={!this.state.isConnected}>
                  <Col sm={9} style={styles.viewRestCol}>
                    <Row>
                      <Text style={[CS.font16, CS.FontBold, CS.FW700, CS.MT10]}>
                        Nearby Restaurants
                      </Text>
                    </Row>
                    <Row Hidden={this.ResturentList.length == 0}>
                      <Text
                        style={[CS.font16, CS.FontRegular, CS.darkGreyText]}
                      >
                        {this.ResturentList.length} restaurants near you
                      </Text>
                    </Row>
                  </Col>
                  <Col sm={3} style={CS.col}>
                    <Pressable
                      onPress={() =>
                        this.props.navigation.navigate("RestaurentList")
                      }
                      style={styles.viewAllBtn}
                    >
                      <Row size={12}>
                        <Col>
                          <Text style={[CS.FontBold, CS.font14]}>ALL</Text>
                        </Col>
                        <Col>
                          <Image
                            source={AppImages.right2}
                            style={styles.arrowIcon}
                          />
                        </Col>
                      </Row>
                    </Pressable>
                  </Col>
                </Row>
                {/* RestaurentList */}
                {/* <Row size={12} style={[CS.MT14, CS.ML10]} Hidden={this.state.isConnected}>
                  <Col>
                    <Pressable onPress={() => this.setState({ selectedTab: 'FreeDelivery' })} style={[styles.sortBtn, this.state.selectedTab == 'FreeDelivery' ? { backgroundColor: '#442B7E', } : { backgroundColor: '#F1F4F3', }]}>
                      <Text style={[CS.font14, CS.FontRegular, CS.FW400, this.state.selectedTab == 'FreeDelivery' ? { color: '#ffffff', } : { color: '#333333' }]}>Free Delivery</Text>
                    </Pressable>
                  </Col>
                  <Col>
                    <Pressable onPress={() => this.setState({ selectedTab: 'TopRated' })} style={[styles.sortBtn, this.state.selectedTab == 'TopRated' ? { backgroundColor: '#442B7E', } : { backgroundColor: '#F1F4F3', }]}>
                      <Text style={[CS.font14, CS.FontRegular, CS.FW400, this.state.selectedTab == 'TopRated' ? { color: '#ffffff', } : { color: '#333333' }]}>Top Rated</Text>
                    </Pressable>
                  </Col>
                  <Col>
                    <Pressable onPress={() => this.setState({ selectedTab: 'Offers' })} style={[styles.sortBtn, this.state.selectedTab == 'Offers' ? { backgroundColor: '#442B7E', } : { backgroundColor: '#F1F4F3', }]}>
                      <Text style={[CS.font14, CS.FontRegular, CS.FW400, this.state.selectedTab == 'Offers' ? { color: '#ffffff', } : { color: '#333333' }]}>Offers</Text>
                    </Pressable>
                  </Col>
                </Row> */}
                <Row Hidden={this.state.isfilterMealTypeNull} size={12}>
                  <Col style={[CS.Col, CS.MT18]} sm={12}>
                    <Text style={[CS.nullMessage]}>RESTAURANT NOT FOUND!</Text>
                  </Col>
                </Row>
                <Row Hidden={this.ResturentList.length == []} style={[CS.MT14]}>
                  <RestaurantList
                    restaurantList={this.ResturentList}
                    navigation={this.props.navigation}
                  ></RestaurantList>
                </Row>

                <Row Hidden={this.state.isConnected} style={[CS.PD15]}>
                  <Col style={[CS.Col]} sm={12}>
                    <Image
                      source={AppImages.NoConnection}
                      style={[{ width: 145, height: 161 }]}
                    />
                  </Col>
                  <Col style={[CS.Col]} sm={12}>
                    <Text
                      style={[
                        CS.font15,
                        CS.FontBold,
                        CS.FW700,
                        CS.greyText,
                        CS.MT10,
                      ]}
                    >
                      Connection Lost!
                    </Text>
                  </Col>
                  <Col style={[CS.Col]} sm={12}>
                    <Text
                      style={[
                        CS.font15,
                        CS.greyText,
                        CS.MT10,
                        CS.textCenter,
                        CS.FontRegular,
                        CS.FW400,
                      ]}
                    >
                      Your Mobile is not connected to the internet, Check your
                      connection!
                    </Text>
                  </Col>
                  <Col sm={12} style={[CS.Col]}>
                    <Pressable
                      onPress={() => this.reloadApp()}
                      style={[
                        CS.greenBtn,
                        CS.MT18,
                        { backgroundColor: "#999999", width: 134, height: 42 },
                      ]}
                    >
                      <Row size={12}>
                        <Col>
                          <Text style={[CS.font14, CS.whiteText, CS.FontBold]}>
                            Reload
                          </Text>
                        </Col>
                        <Col style={{ paddingLeft: 5 }}>
                          <Image
                            source={AppImages.reload}
                            style={[{ width: 20, height: 20 }]}
                          />
                        </Col>
                      </Row>
                      {/* <Text style={[CS.font14, CS.whiteText, CS.FontBold]}>Reload</Text>
                <Image source={AppImages.reload} style={[{ width: 22, height: 22 }]} /> */}
                    </Pressable>
                  </Col>
                </Row>
                <Row
                  style={[styles.container2, styles.horizontal]}
                  Hidden={
                    this.ResturentList.length != 0 ||
                    !this.state.isConnected ||
                    !this.state.isfilterMealTypeNull
                  }
                >
                  <Col sm={12} style={[CS.itemContainer, { borderWidth: 0 }]}>
                    <ContentLoader
                      active
                      avatar
                      pRows={3}
                      pWidth={["50%", "100%", "70%"]}
                      avatarStyles={{ borderRadius: 3 }}
                      title={false}
                      outP
                    ></ContentLoader>
                  </Col>
                  <Col sm={12} style={[CS.itemContainer, { borderWidth: 0 }]}>
                    <ContentLoader
                      active
                      avatar
                      pRows={3}
                      pWidth={["50%", "100%", "70%"]}
                      avatarStyles={{ borderRadius: 3 }}
                      title={false}
                    ></ContentLoader>
                  </Col>
                  <Col sm={12} style={[CS.itemContainer, { borderWidth: 0 }]}>
                    <ContentLoader
                      active
                      avatar
                      pRows={3}
                      pWidth={["50%", "100%", "70%"]}
                      avatarStyles={{ borderRadius: 3 }}
                      title={false}
                    ></ContentLoader>
                  </Col>
                </Row>
              </View>

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
              <Modal
                animationType="slide"
                transparent={true}
                visible={navigation.getParam("isShowLaunchPopup") == true}
                onRequestClose={() => {
                  navigation.setParams({ isShowLaunchPopup: false });
                  // navigation.getParam('isShowLaunchPopup') = false
                }}
              >
                <View style={CS.blurBGView}>
                  <View style={[styles.modalView, styles.launchSoonPopup]}>
                    <Row size={12}>
                      <Col sm={11}></Col>
                      <Col sm={1}>
                        <Pressable
                          onPress={() =>
                            navigation.setParams({ isShowLaunchPopup: false })
                          }
                        >
                          <Icon name="close-sharp" size={30}></Icon>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={CS.Col}>
                        <Image
                          source={AppImages.launchingSoon}
                          style={{ width: 261, height: 222, marginTop: 50 }}
                        />
                      </Col>
                      <Col sm={12} style={CS.Col}>
                        <Text
                          style={[CS.font24, CS.FontBold, CS.FW700, CS.MT16]}
                        >
                          Launching Soon
                        </Text>
                      </Col>
                      <Col sm={12} style={CS.Col}>
                        <Text
                          style={[
                            CS.font20,
                            CS.FontRegular,
                            CS.FW400,
                            {
                              color: "#707070",
                              textAlign: "center",
                              padding: "7%",
                              paddingBottom: 0,
                            },
                          ]}
                        >
                          This feature is not available right now but will be
                          launched soon.{" "}
                        </Text>
                      </Col>
                      <Col sm={12} style={CS.Col}>
                        <Text
                          style={[
                            CS.font20,
                            CS.FontRegular,
                            CS.FW400,
                            { color: "#442B7E", textAlign: "center" },
                          ]}
                        >
                          {" "}
                          Stay tuned!
                        </Text>
                      </Col>
                    </Row>
                  </View>
                </View>
              </Modal>
            </Wrapper>
          </ScrollView>
        </View>
        <View style={[{ flex: 0.1 }]}>
          {/* <Pressable onPress={() => this.props.navigation.navigate('Chat')} style={[{ height: 94, width: 64, backgroundColor: '#F2F2F1', position: 'absolute', top: -180, borderRadius: 10, right: '5%' }]}>
            <Row>
              <Col sm={12} style={[CS.Col, CS.MT5]}>
                <Icon name='close-sharp' size={25}></Icon>
              </Col>
              <Col sm={12} style={[CS.Col, CS.MT5]}>
                <Image source={AppImages.UserPic} style={[{ width: 52, height: 52 }]} />
              </Col>
            </Row>
          </Pressable> */}
          <View
            style={[
              {
                height: 45,
                width: "90%",
                backgroundColor: "#C6345C",
                position: "absolute",
                top: -70,
                borderRadius: 10,
                left: "5%",
              },
            ]}
          >
            <Row style={{ height: 45 }} size={12}>
              <Col sm={2} style={[CS.col, { height: 45 }]}>
                <Image
                  source={AppImages.dominos}
                  style={[{ width: 30, height: 30 }]}
                />
                {/* <View style={styles.quantityBox}><Text style={CS.whiteText}>{this.cartDetail.cartItems.length}</Text></View> */}
              </Col>
              <Col sm={6} style={[{ height: 45, justifyContent: "center" }]}>
                <Text
                  style={[CS.whiteText, CS.font14, CS.FontMedium, CS.FW500]}
                >
                  Out for delivery
                </Text>
              </Col>
              <Col
                sm={4}
                style={[CS.Col, styles.footerBoxText, { height: 45 }]}
              >
                <Pressable
                  onPress={() =>
                    this.props.navigation.navigate("OrderTracking", {
                      id: this.OrderList?.reverse()[0]?._id,
                    })
                  }
                >
                  <Text
                    style={[CS.whiteText, CS.font14, CS.FontBold, CS.FW700]}
                  >
                    Track order
                  </Text>
                </Pressable>
              </Col>
            </Row>
          </View>
          <FooterTabs navigation={this.props.navigation}></FooterTabs>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  launchSoonPopup: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 600,
    padding: 15,
  },
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
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  titleWrapper: {},
  MealImage: {
    resizeMode: "contain",
    flex: 1,
    width: 36,
    height: 36,
  },

  contentContainer: {
    flex: 1, // pushes the footer to the end of the screen
  },
  footer: {
    height: 100,
  },
  headerIcon: {
    marginLeft: 12,
    paddingRight: 5,
  },
  headerBox: {
    paddingTop: 20,
  },
  searchBox: {
    backgroundColor: "#F4F4F4",
    height: 53,
    width: "100%",
    borderRadius: 13,
    padding: 15,
  },
  searchBoxInput: {
    height: 50,
    padding: 0,
    marginLeft: -40,
    marginTop: -10,
    fontSize: 17,
    borderColor: "#bcbcbc",
  },
  filterBox: {
    height: 53,
    width: 53,
    borderRadius: 13,
    backgroundColor: "#452B7D",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBox: {
    height: 76,
    width: 76,
    backgroundColor: "#F1F2F6",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTitle: {
    textAlign: "center",
    marginTop: 5,
  },
  orderAgainBox: {
    marginTop: 8,
    marginLeft: 10,
  },
  horScroll: {
    marginTop: 8,
    marginLeft: 14,
  },
  orderAgainItem: {
    width: 300,
    height: 153,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    margin: 4,
    marginBottom: 0,
  },
  arrowIcon: {
    resizeMode: "contain",
    flex: 1,
    width: 10,
    marginLeft: 5,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 13,
  },
  viewAllBtn: {
    borderRadius: 10,
    borderWidth: 2,
    width: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#cccccc",
  },
  viewRestCol: {
    padding: 10,
    paddingLeft: 15,
    paddingTop: 0,
  },
  sortBtn: {
    // width: 108,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,
    marginRight: 8,
  },
  backBtnBg: {
    backgroundColor: "#5B5B5B3D",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginRight: 8,
  },
  listDetailBox: {
    flex: 0.8,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: "#EBEBEB",
  },
  foodType: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  offerText: {
    color: "#442B7E",
    fontWeight: "bold",
    textAlign: "right",
  },
  tabBox: {
    flex: 1,
    justifyContent: "space-evenly",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "109%",
    height: 73,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    // marginBottom: -15,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: 0,
    marginLeft: "-1%",
  },
  tabBoxIcon: {
    height: 76,
    width: 76,
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
    marginTop: -23,
  },
  ratingText: {
    marginTop: -10,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default Home;