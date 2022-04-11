import React from "react";
import {
  View,
  ActivityIndicator,
  StatusBar,
  Pressable,
  SafeAreaView,
  Modal,
  TextInput,
  BackHandler,
  TouchableHighLight,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  LogBox,
  Animated,
} from "react-native";
import {
  Footer,
  Wrapper,
  Header,
  Left,
  Right,
  ContentLoader,
  ScrollViewIndicator,
  SignIn,
  ProgressiveImage,
  Slideshow,
  StarRating,
  Row,
  Col,
  FlatListSlider,
} from "../components/componentIndex";
const marginTop = Platform.OS === "ios" ? 20 : 0;
import Icon from "react-native-vector-icons/Ionicons";
import Config from "../Config";
import APIKit from "../APIKit";
import { AppImages } from "../res";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default class Restaurant extends React.Component {
  isFavorite = false;
  MenuSearchList = [];
  cartDetail;
  state = {
    showLoader: 0,
    selectedIndex: 0,
    favoriteIcon: AppImages.likeWhite,
    searchMenupopup: false,
    MenuSearchList: [],
    searchValue: "",
    position: 1,
    hideLoader2: false,
    interval: null,
    isNull: true,
    isSearchListNull: true,
    isShowMenuPopup: false,
    selectedMenu: "Soups",
    isShowLoginPopup: false,
    EmptyPopupVisible: false,
    bannerImageList: [
      {
        url: "https://source.unsplash.com/1024x768/?nature",
      },
      {
        url: "https://source.unsplash.com/1024x768/?water",
      },
      {
        url: "https://source.unsplash.com/1024x768/?tree",
      },
    ],
  };
  categoryList = [];
  MenuItemsList = [];
  ResturentData = "";
  // bannerImageList = [];
  constructor(props) {
    super(props);
  }
  bannerImageList = [
    {
      image:
        "https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
    },
    {
      image:
        "https://images.unsplash.com/photo-1455620611406-966ca6889d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1130&q=80",
    },
  ];

  isFavoriteRestaurant() {
    // console.log("isFavoriteRestaurant", APIKit.CommonHeaders2)
    fetch(Config.baseUrl + "favourite/restaurant", {
      method: "GET",
      headers: APIKit.CommonHeaders2,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log("isFavoriteRestaurant", responseJson.success.data.favouriteRestaurant)
        if (responseJson.status == true) {
          responseJson.success.data.favouriteRestaurant.forEach((item) => {
            if (item.restaurantId == APIKit.ResturantId) {
              this.isFavorite = true;
              this.setState({ favoriteIcon: AppImages.likePink });
              this.setState({ favoriteId: item._id });
            }
          });
        }
      })
      .catch((error) => {
        console.error("isFavoriteRestaurant", error);
      });
  }

  handleIndexChange = (index) => {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
  };

  getRestaurantDetails = () => {
    const rastaurantId = APIKit.ResturantId; // '6119fe5c95296b0018dbdcd8'  // this.props.route.params.rastaurantId;

    fetch(Config.baseUrl + "restaurant/" + rastaurantId, {
      method: "GET",
      headers: APIKit.CommonHeaders2,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == true) {
          this.ResturentData = responseJson.success.data.restaurant;
          this.categoryList = responseJson.success.data.category;
          console.log("this.categoryList", responseJson.success.data.category);
          if (this.categoryList.length > 1) {
            this.OnTabChange(
              this.categoryList[0]._id,
              this.categoryList[0].categoryName
            );
          } else {
            this.setState({ isNull: false });
            this.setState({ hideLoader2: true });
          }
          if (this.ResturentData.bannerImage.length >= 1) {
            this.ResturentData.bannerImage[0].split(", ").forEach((element) => {
              let image = { url: element };
              this.state.bannerImageList.push(image);
            });
          }
          this.setState({ showLoader: 1 });
        }
      })
      .catch((error) => {
        this.setEmptyModalVisible(true);
        this.setState({ showLoader: 1 });
        console.error("getRestaurantDetails", error);
      });
  };

  addRemoveFavorite() {
    // console.log("header", APIKit.CommonHeaders2)
    if (Config.userAuthToken == null) {
      this.setLoginModalVisible(true);
    } else {
      const rastaurantId = APIKit.ResturantId; // this.props.route.params.rastaurantId;
      if (this.isFavorite) {
        let favoriteId = this.state.favoriteId;
        fetch(Config.baseUrl + "favourite/restaurant/" + favoriteId, {
          method: "DELETE",
          headers: APIKit.CommonHeaders2,
        })
          .then((response) => response.json())
          .then((responseJson) => {
            this.isFavorite = false;
            this.setState({ favoriteIcon: AppImages.likeWhite });
          })
          .catch((error) => {
            console.error("RemoveFavorite", error);
          });
      } else {
        fetch(Config.baseUrl + "favourite/restaurant", {
          method: "POST",
          headers: APIKit.CommonHeaders2,
          body: JSON.stringify({
            payload: {
              restaurantId: rastaurantId,
            },
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            this.isFavorite = true;
            this.setState({ favoriteIcon: AppImages.likePink });
          })
          .catch((error) => {
            console.error("addFavorite", error);
          });
      }
    }
  }

  getMenuItems(menuID) {
    const rastaurantId = APIKit.ResturantId; //this.props.route.params.rastaurantId;
    fetch(
      Config.baseUrl +
        "menu/item?restaurantId=" +
        rastaurantId +
        "&menuCategoryId=" +
        menuID,
      {
        method: "GET",
        headers: APIKit.CommonHeaders2,
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == true) {
          this.MenuItemsList = responseJson.success.data.menuItems;
          if (this.MenuItemsList.length < 1) {
            // console.log("this.MenuItemsList", this.MenuItemsList)
            this.setState({ nullMenu: true });
          } else {
            this.setState({ nullMenu: false });
          }
          this.setState({ hideLoader2: true });
        }
      })
      .catch((error) => {
        console.error("errorerror", error);
        this.setState({ hideLoader2: false });
      });
  }

  OnTabChange(id, tabName) {
    this.MenuItemsList = [];
    this.setState({ nullMenu: false });
    this.setState({ hideLoader2: false });
    this.setState({ selectedTab: id });
    this.setState({ selectedTabName: tabName });
    this.getMenuItems(id);
  }

  onAndroidBackPress = () => {
    this.props.navigation.navigate("Home");
    return true;
  };
  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("accessToken");
      Config.userAuthToken = value;
      // console.log("tttt", Config.userAuthToken)
      APIKit.getHeader();
      this.isFavoriteRestaurant();
      this.getCartItemList();
    } catch (e) {
      // error reading valu
    }
  };
  componentDidMount() {
    if (Platform.OS === "android") {
      BackHandler.addEventListener(
        "hardwareBackPress",
        this.onAndroidBackPress
      );
    }
    this.isFavorite = false;
    this.setState({ favoriteIcon: AppImages.likeWhite });
    this.setState({ showLoader: 0 });

    // this.getMenuCategory();

    this.getToken();
    this.getRestaurantDetails();
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    LogBox.ignoreLogs([
      'Warning: Each child in a list should have a unique "key" prop',
    ]);
    LogBox.ignoreAllLogs();
    this.focusListener = this.props.navigation.addListener("focus", () => {});
  }

  setMenuVisible = (visible) => {
    this.setState({ isShowMenuPopup: visible });
  };
  setModalVisible = (visible) => {
    if (visible == false) {
      this.setState({ MenuSearchList: [] });
    } else {
      setTimeout(() => {
        if (this.textInputField) {
          this.textInputField.focus();
        }
      }, 500);
    }
    this.setState({ searchMenupopup: visible });
  };

  setEmptyModalVisible = (visible) => {
    this.setState({ EmptyPopupVisible: visible });
  };
  searchFood(key) {
    this.setState({ MenuSearchList: [] });
    setInterval(() => {
      // console.log("searchValue", this.state.searchValue)
    }, 1000);

    const rastaurantId = APIKit.ResturantId; //'6119fe5c95296b0018dbdcd8' //this.props.route.params.rastaurantId;
    fetch(
      Config.baseUrl +
        "menu/item?restaurantId=" +
        rastaurantId +
        "&search=" +
        key,
      {
        method: "GET",
        headers: APIKit.CommonHeaders2,
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == true) {
          // this.MenuSearchList = responseJson.success.data.menuItems;
          this.setState({
            MenuSearchList: responseJson.success.data.menuItems,
          });
          // console.log(responseJson.success.data.menuItems.length)
          if (responseJson.success.data.menuItems.length == 0) {
            this.setState({ isSearchListNull: false });
          } else {
            this.setState({ isSearchListNull: true });
          }
        }
      })
      .catch((error) => {
        console.error("errorerror", error);
      });
  }
  componentWillMount() {
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position:
            this.state.position === this.state.bannerImageList.length
              ? 0
              : this.state.position + 1,
        });
      }, 1500),
    });
  }

  getCartItemList() {
    fetch(Config.baseUrl + "cart", {
      method: "GET",
      headers: APIKit.CommonHeaders2,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.cartDetail = responseJson.success.data;
        // console.log("getCartItemList", this.cartDetail, responseJson.success.data.totalAmount, responseJson.success.data.cartItems.length, this.cartDetail)

        // this.cartList.forEach((item) => {
        if (this.cartDetail.restaurant._id == APIKit.ResturantId) {
          // console.log("getCartItemList", responseJson.success.data.totalAmount, responseJson.success.data.cartItems.length, this.cartDetail)

          this.setState({ isRestaurantAdded: true });
          // console.log("getCartItemList", this.cartList)
        }
        // })
      })
      .catch((error) => {
        this.setState({ showLoader: 1 });
      });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.onAndroidBackPress
    );
    clearInterval(this.state.interval);
  }
  goToMenu(id) {
    APIKit.MenuItemId = id;
    this.setModalVisible(false);
    this.props.navigation.navigate("MenuItemDetail");
  }

  selectMenu(value) {
    this.setState({ selectedMenu: value });
    this.setMenuVisible(false);
  }

  setLoginModalVisible = (visible) => {
    this.setState({ isShowLoginPopup: visible });
  };
  closeModal = () => {
    this.setLoginModalVisible(false);
  };
  render() {
    // console.log("isRestaurantAdded", this.state.isRestaurantAdded)
    // this.isFavoriteRestaurant();
    const CS = Config.style;
    const footer = (
      <Pressable
                    onPress={() => {
                      this.props.navigation.navigate("Cart");
                      APIKit.previousScreen =
                        this.props.navigation.state.routeName;
                    }}
                  >
      <Footer>
        <Row>
          <Col sm={12}>
            {this.state.isRestaurantAdded ? (
              <Row style={styles.footerBox} size={12}>
                <Col sm={2} style={CS.col}>
                  <View style={styles.quantityBox}>
                    <Text style={CS.whiteText}>
                      {this.cartDetail.cartItems.length}
                    </Text>
                  </View>
                </Col>
                <Col sm={6} style={[{ justifyContent: "center" }]}>
                  <Text
                    style={[CS.whiteText, CS.font14, CS.FontBold, CS.FW700]}
                  >
                    SAR {APIKit.round(this.cartDetail.totalAmount, 2)}
                  </Text>
                </Col>
                <Col
                  sm={4}
                  style={Object.assign({}, CS.Col, styles.footerBoxText)}
                >
                  <Pressable
                    onPress={() => {
                      this.props.navigation.navigate("Cart");
                      APIKit.previousScreen =
                        this.props.navigation.state.routeName;
                    }}
                  >
                    <Text
                      style={[CS.whiteText, CS.font14, CS.FontBold, CS.FW700]}
                    >
                      View Cart
                    </Text>
                  </Pressable>
                </Col>
              </Row>
            ) : (
              <Row style={[styles.footerBox, { opacity: 0.8 }]} size={12}>
                <Col sm={2} style={[CS.col, styles.footerBoxText]}>
                  <View style={styles.quantityBox}>
                    <Text style={CS.whiteText}>0</Text>
                  </View>
                </Col>
                <Col sm={7} style={[{ justifyContent: "center" }]}>
                  <Text
                    style={[CS.whiteText, CS.font14, CS.FontBold, CS.FW700]}
                  >
                    Minimum order value
                  </Text>
                </Col>
                <Col sm={3} style={[CS.Col, styles.footerBoxText]}>
                  <Text
                    style={[
                      CS.whiteText,
                      CS.font14,
                      CS.FontMedium,
                      CS.FW500,
                      { textAlign: "right" },
                    ]}
                  >
                    SAR 15.00
                  </Text>
                </Col>
              </Row>
            )}
          </Col>
          {/* <Col sm={12}>
                        <Pressable onPress={() => this.props.navigation.navigate('Cart')} style={[{ marginTop: -130, marginLeft: '80%', width: 80, height: 80 }, CS.Col]}>
                            <Image source={AppImages.menuPopup} style={{ resizeMode: 'contain', width: 50, height: 55 }}></Image>
                        </Pressable>
                    </Col> */}
        </Row>
        {/* <View style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width, backgroundColor: '#000000', opacity: 0.7, zIndex: 1000, position: 'absolute', top: 0, left: 0 }}>

                </View> */}
      </Footer>
      </Pressable>
    );
    return this.state.showLoader == 1 ? (
      <View
        style={{
          height: Dimensions.get("window").height,
          minHeight: Dimensions.get("window").height,
        }}
      >
        <Wrapper footer={footer}>
          <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
          {/* <View style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width, backgroundColor: '#000000', opacity: 0.7, zIndex: 1000, position: 'absolute', top: 0, left: 0 }}>
                    <View style={{ height: 321, width: 250, backgroundColor: '#ffffff', opacity: 1, bottom: 50, position: 'absolute' }}>

                    </View>
                </View> */}
          <Slideshow
            dataSource={this.state.bannerImageList}
            position={this.state.position}
            onPositionChanged={(position) => this.setState({ position })}
          />
          <View style={styles.container}>
            <Header style={{ paddingTop: 10 }}>
              <Left>
                <Pressable
                  onPress={() => this.props.navigation.navigate("Home")}
                  style={[styles.backBtnBg, { marginLeft: 0 }]}
                >
                  <Icon name="arrow-back-sharp" size={28} color={"#fff"}></Icon>
                </Pressable>
              </Left>
              <Right>
                <Pressable
                  onPress={() => this.addRemoveFavorite()}
                  style={{ marginLeft: 10 }}
                >
                  <Image
                    source={this.state.favoriteIcon}
                    style={{ resizeMode: "contain", width: 40, height: 40 }}
                  />
                </Pressable>
                <Pressable
                  onPress={() => this.setModalVisible(true)}
                  style={styles.backBtnBg}
                >
                  <Icon name="search-sharp" color={"#fff"} size={25}></Icon>
                </Pressable>
              </Right>
            </Header>
          </View>
          <Row Hidden={this.ResturentData == ""}>
            <View style={styles.content}>
              <View style={[{ backgroundColor: "#ffffff", padding: 5 }]}>
                <Image
                  style={[styles.resturentLogo, { backgroundColor: "#ffffff" }]}
                  source={{ uri: this.ResturentData?.logo }}
                />
              </View>

              <Text
                style={[
                  styles.title,
                  CS.font18,
                  CS.FontBold,
                  CS.FW700,
                  { lineHeight: 18 },
                ]}
              >
                {this.ResturentData?.name}
              </Text>
              <Row style={styles.title}>
                <Text
                  style={[CS.font14, CS.darkGreyText, CS.FW400, CS.FontRegular]}
                  ellipsizeMode="tail"
                  numberOfLines={3}
                >
                  {APIKit?.foodType?.map((food) =>
                    APIKit?.foodType[0] == food ? food : " · " + food
                  )}
                </Text>
                {/* {APIKit.foodType.map((item) => (
                            <Text><Text key={item} style={styles.foodType}>{item}</Text> · </Text>
                        ))} */}
              </Row>
              <Row style={[{ paddingVertical: 5 }]}>
                <Col>
                  <Image
                    source={AppImages.star}
                    style={[{ marginLeft: 2, width: 15, height: 15 }]}
                  />
                </Col>
                <Col>
                  <Image
                    source={AppImages.star}
                    style={[{ marginLeft: 2, width: 15, height: 15 }]}
                  />
                </Col>
                <Col>
                  <Image
                    source={AppImages.star}
                    style={[{ marginLeft: 2, width: 15, height: 15 }]}
                  />
                </Col>
                <Col>
                  <Image
                    source={AppImages.star}
                    style={[{ marginLeft: 2, width: 15, height: 15 }]}
                  />
                </Col>
                <Col>
                  <Image
                    source={AppImages.star}
                    style={[{ marginLeft: 2, width: 15, height: 15 }]}
                  />
                </Col>
                <Col style={[CS.Col, { paddingLeft: 5 }]}>
                  <Text style={[CS.FontMedium, CS.font10, CS.FW500]}>
                    of 4356 review
                  </Text>
                </Col>
              </Row>
              {/* <Text> <Text style={styles.ratingText}>
                            <StarRating rating={this.ResturentData?.avgRatings} /> </Text></Text> */}
              <Row size={12} style={CS.MT5}>
                <Col md={6} style={{ paddingRight: 18 }}>
                  <View style={styles.title}>
                    <Image
                      source={AppImages.watch}
                      style={{ resizeMode: "contain", width: 23, height: 17 }}
                    />
                    <Text
                      style={[
                        CS.font12,
                        CS.FontRegular,
                        CS.FW400,
                        { color: "#333333" },
                      ]}
                    >
                      {this.ResturentData?.deliveryTime}
                    </Text>
                  </View>
                </Col>
                <Col md={6}>
                  <View style={styles.title}>
                    <Image
                      source={AppImages.delivery3}
                      style={{ resizeMode: "contain", width: 23, height: 17 }}
                    />
                    <Text
                      style={[
                        CS.font12,
                        CS.FontRegular,
                        CS.FW400,
                        { color: "#333333" },
                      ]}
                    >
                      15.00 -35.00 SAR
                    </Text>
                  </View>
                </Col>
              </Row>

              <Row size={12} style={Config.style.MT5}>
                {/* {this.ResturentData?.deliveryType[0] == "Take-In" ? ( */}
                <Col>
                  <Image
                    source={AppImages.Type1}
                    style={{
                      resizeMode: "contain",
                      flex: 1,
                      width: 90,
                      height: 22,
                      marginRight: 5,
                    }}
                  />
                </Col>
                {/* ) : (<View></View>)}
                            {this.ResturentData?.deliveryType[1] == "Dine-in" ? ( */}
                <Col>
                  <Image
                    source={AppImages.Type2}
                    style={{
                      resizeMode: "contain",
                      flex: 1,
                      width: 90,
                      height: 22,
                      marginRight: 5,
                    }}
                  />
                </Col>
                {/* ) : (<View></View>)}
                            {this.ResturentData?.deliveryType[1] == "Dine-in" ? ( */}
                <Col>
                  <Image
                    source={AppImages.Type3}
                    style={{
                      resizeMode: "contain",
                      flex: 1,
                      width: 90,
                      height: 22,
                      marginRight: 5,
                    }}
                  />
                </Col>
                {/* ) : (<View></View>)} */}
              </Row>
              {/* <Row style={styles.groupOrderBox} size={12}>
                            <Col sm={6} style={CS.col}>
                                <Text style={CS.whiteText}>Ordering with Friends</Text>
                            </Col>
                            <Col sm={6} style={CS.col}>
                                <Pressable onPress={() => this.props.navigation.navigate('Home')} style={styles.groupOrderButton}>
                                    <Text style={CS.whiteText}>Start Group Order</Text>
                                </Pressable>
                            </Col>
                        </Row> */}
            </View>
          </Row>
          <Row Hidden={this.categoryList?.length == 0}>
            <ScrollView
              horizontal={true}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={"handled"}
              showsHorizontalScrollIndicator={false}
              style={styles.orderAgainBox}
            >
              <Row size={24}>
                {this.categoryList?.map((item) => (
                  <Pressable
                    onPress={() =>
                      this.OnTabChange(item._id, item.categoryName)
                    }
                  >
                    <Col
                      style={
                        this.state.selectedTab == item._id
                          ? styles.tabSelected
                          : styles.tabUnSelected
                      }
                    >
                      <Text
                        style={[
                          this.state.selectedTab == item._id
                            ? CS.greenText
                            : CS.greyText,
                          CS.Font12,
                          CS.FontMedium,
                          CS.FW500,
                        ]}
                      >
                        {item.categoryName}
                      </Text>
                    </Col>
                  </Pressable>
                ))}
              </Row>
            </ScrollView>
          </Row>
          <Row Hidden={this.state.isNull} size={12}>
            <Col style={[CS.Col, CS.MT18]} sm={12}>
              <Text style={[styles.title, { textAlign: "center" }]}>
                No data available for this restaurant
              </Text>
            </Col>
          </Row>
          <Row Hidden={!this.state.nullMenu} size={12}>
            <Col style={[CS.Col, CS.MT18]} sm={12}>
              <Text style={[styles.title, { textAlign: "center" }]}>
                No Items available in this category
              </Text>
            </Col>
          </Row>
          <Row style={CS.MT16} Hidden={this.MenuItemsList?.length == 0}>
            <Text
              style={Object.assign(
                {},
                CS.font16,
                CS.FontBold,
                CS.FW700,
                CS.ML12
              )}
            >
              {this.state.selectedTabName}
            </Text>
            {this.MenuItemsList?.map((item) => (
              <Pressable>
                <Row
                  style={Object.assign({}, CS.MT12, styles.menuListBox)}
                  size={12}
                >
                  <Col sm={9}>
                    <Pressable onPress={() => this.goToMenu(item._id)}>
                      <Text
                        style={Object.assign(
                          {},
                          CS.font14,
                          CS.FontMedium,
                          CS.FW500,
                          { lineHeight: 16 }
                        )}
                      >
                        {item.name}® - {item.calaries} Cal
                      </Text>
                      <Text
                        style={[
                          CS.font10,
                          CS.greyText,
                          CS.FontRegular,
                          { color: "$707070", paddingVertical: 8 },
                        ]}
                      >
                        {item.description}
                      </Text>
                      <Col md={6} style={{ paddingRight: 18, display: "flex" }}>
                        <Text
                          style={Object.assign(
                            {},
                            CS.MT12,
                            CS.FontBold,
                            styles.price,
                            CS.font14,
                            CS.FW700
                          )}
                        >
                          SAR {item.amount}
                        </Text>
                      </Col>
                    </Pressable>
                  </Col>

                  <Col sm={3}>
                    <View style={{ borderRadius: 20, height: 85, width: 85 }}>
                      <ProgressiveImage
                        style={{ width: 85, height: 85, marginTop: -5 }}
                        uri={item.image}
                        resizeMode="contain"
                      />
                    </View>
                  </Col>
                </Row>
              </Pressable>
            ))}
          </Row>
          <Row Hidden={this.state.hideLoader2}>
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

          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.searchMenupopup}
              onRequestClose={() => {
                this.setModalVisible(false);
              }}
            >
              <View style={CS.centeredView}>
                <View style={CS.modalView}>
                  <View style={[Config.style.MT12]}>
                    <Row>
                      <Col sm={10.5} style={[CS.Col]}>
                        <View style={CS.searchBox}>
                          <Row size={12}>
                            <Col sm={1}>
                              <Pressable>
                                <Image
                                  source={AppImages.searchBlue}
                                  style={{
                                    width: 19,
                                    height: 19,
                                    marginTop: 3,
                                  }}
                                />
                              </Pressable>
                            </Col>
                            <Col sm={11}>
                              <TextInput
                                ref={(ref) => {
                                  this.textInputField = ref;
                                }}
                                returnKeyType="done"
                                onChangeText={(text) => {
                                  this.searchFood(text);
                                  this.setState({ searchValue: text });
                                }}
                                placeholder={"Search 55 menu items"}
                                placeholderStyle={CS.font16}
                                placeholderTextColor={"#999999"}
                                style={[
                                  CS.searchBoxInput,
                                  CS.FontRegular,
                                  CS.font16,
                                  CS.FW400,
                                ]}
                                textBreakStrategy={"simple"}
                              />
                            </Col>
                          </Row>
                        </View>
                      </Col>
                      <Col sm={1.5} style={[CS.Col]}>
                        <Pressable onPress={() => this.setModalVisible(false)}>
                          <Image
                            source={AppImages.grayBGClose}
                            style={{ width: 36, height: 36, marginTop: 3 }}
                          />
                          {/* <Icon name='close-sharp' size={30}></Icon> */}
                        </Pressable>
                      </Col>
                      <Col sm={12}></Col>
                    </Row>

                    <ScrollView
                      horizontal={false}
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps={"handled"}
                      showsHorizontalScrollIndicator={false}
                    >
                      <View style={CS.MT16}>
                        <Row size={12} Hidden={this.state.isSearchListNull}>
                          <Col style={[CS.Col, CS.MT18]} sm={12}>
                            <Text
                              style={[styles.title, { textAlign: "center" }]}
                            >
                              ITEM NOT FOUND!
                            </Text>
                          </Col>
                        </Row>
                        <Row Hidden={this.state.searchValue == ""}>
                          {this.state.MenuSearchList.map((item) => (
                            <Pressable onPress={() => this.goToMenu(item._id)}>
                              <Row
                                style={Object.assign(
                                  {},
                                  CS.MT12,
                                  styles.menuListBox
                                )}
                                size={12}
                              >
                                <Col sm={10}>
                                  <Text
                                    style={Object.assign(
                                      {},
                                      CS.font14,
                                      CS.FontBold
                                    )}
                                  >
                                    {item.name}® - {item.calaries} Cal
                                  </Text>
                                  <Text
                                    style={Object.assign(
                                      {},
                                      CS.font10,
                                      CS.greyText,
                                      CS.FontRegular,
                                      CS.FW400,
                                      { color: "#707070" }
                                    )}
                                  >
                                    {item.description}
                                  </Text>
                                  <Col
                                    md={6}
                                    style={{
                                      paddingRight: 18,
                                      display: "flex",
                                    }}
                                  >
                                    <Text
                                      style={Object.assign(
                                        {},
                                        CS.MT12,
                                        styles.price,
                                        CS.FontBold,
                                        CS.font14,
                                        CS.FW700
                                      )}
                                    >
                                      SAR {item.amount}
                                    </Text>
                                  </Col>
                                </Col>
                                <Col sm={2}>
                                  <View
                                    style={{
                                      borderRadius: 20,
                                      height: 63,
                                      width: 63,
                                    }}
                                  >
                                    <ProgressiveImage
                                      style={{ width: 63, height: 63 }}
                                      uri={item.image}
                                      resizeMode="contain"
                                    />
                                  </View>
                                </Col>
                              </Row>
                            </Pressable>
                          ))}
                        </Row>
                      </View>
                    </ScrollView>

                    {/* <Row style={[Config.style.MT16]}>
                                        <Col sm={10}>
                                            <Text style={[Config.style.FW700, Config.style.font16]}>Recent search</Text>
                                        </Col>
                                        <Col sm={2}>
                                            <Pressable>
                                                <Text style={[Config.style.font16, Config.style.FW500, { color: '#C6345C' }]}>Clear all</Text>
                                            </Pressable>
                                        </Col>
                                    </Row> */}
                    {/* <RestaurantList restaurantList={this.props.restaurantList}></RestaurantList> */}
                    {/* <Row style={[Config.style.MT16]}>
                                        <Col sm={10}>
                                            <Text style={[Config.style.FW700, Config.style.font16]}>Recommend for you</Text>
                                        </Col>
                                    </Row> */}
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </Wrapper>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.isShowMenuPopup}
          onRequestClose={() => {
            this.setMenuVisible(false);
          }}
        >
          <Pressable
            style={CS.blurBGView}
            onPressOut={() => {
              this.setMenuVisible(false);
            }}
          >
            <View
              style={[
                CS.modalView,
                {
                  width: 250,
                  height: 321,
                  marginBottom: 120,
                  borderRadius: 10,
                  padding: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                },
              ]}
            >
              <ScrollViewIndicator
                shouldIndicatorHide={false}
                scrollIndicatorStyle={{
                  backgroundColor: "#5CAC7D",
                  width: 12,
                  opacity: 1,
                  borderRadius: 10,
                  marginLeft: -2,
                }}
                scrollIndicatorContainerStyle={{
                  backgroundColor: "#F4F4F4",
                  width: 16,
                  marginVertical: 5,
                }}
              >
                <Row
                  Hidden={this.categoryList?.length == 0}
                  style={{
                    marginRight: 22,
                    marginLeft: 15,
                    paddingTop: 10,
                    paddingRight: 5,
                  }}
                >
                  {/* {this.categoryList.map((list) => ( */}
                  <Pressable>
                    <Row>
                      <Col sm={12}>
                        <Pressable onPress={() => this.selectMenu("Soups")}>
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "Soups"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Soups
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable
                          onPress={() => this.selectMenu("Appetizers")}
                        >
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "Appetizers"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Appetizers
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable
                          onPress={() => this.selectMenu("WestrenMeals")}
                        >
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "WestrenMeals"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Westren Meals
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable
                          onPress={() => this.selectMenu("WestrenSandwiches")}
                        >
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "WestrenSandwiches"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Westren Sandwiches
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable
                          onPress={() => this.selectMenu("GrilledMeat")}
                        >
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "GrilledMeat"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Grilled Meat
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable onPress={() => this.selectMenu("Meals")}>
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "Meals"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Meals
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable onPress={() => this.selectMenu("Pastries")}>
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "Pastries"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Pastries
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable onPress={() => this.selectMenu("Burger")}>
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "Burger"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Burger
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable
                          onPress={() => this.selectMenu("GrilledMeat")}
                        >
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "GrilledMeat"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Grilled Meat
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable onPress={() => this.selectMenu("Meals")}>
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "Meals"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Meals
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable onPress={() => this.selectMenu("Pastries")}>
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "Pastries"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Pastries
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>

                      <Col sm={12}>
                        <Pressable
                          onPress={() => this.selectMenu("Appetizers")}
                        >
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "Appetizers"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Appetizers
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable
                          onPress={() => this.selectMenu("WestrenMeals")}
                        >
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "WestrenMeals"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Westren Meals
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable
                          onPress={() => this.selectMenu("WestrenSandwiches")}
                        >
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "WestrenSandwiches"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Westren Sandwiches
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable
                          onPress={() => this.selectMenu("GrilledMeat")}
                        >
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "GrilledMeat"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Grilled Meat
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable onPress={() => this.selectMenu("Meals")}>
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "Meals"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Meals
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                      <Col sm={12}>
                        <Pressable onPress={() => this.selectMenu("Pastries")}>
                          <Text
                            style={[
                              CS.font16,
                              this.state.selectedMenu == "Pastries"
                                ? [CS.greenText, CS.FontBold]
                                : [CS.FontRegular, CS.FW400],
                            ]}
                          >
                            Pastries
                          </Text>
                        </Pressable>
                      </Col>
                      <Col sm={12} style={Config.style.listDivider}></Col>
                    </Row>
                  </Pressable>
                  {/* ))} */}
                </Row>
              </ScrollViewIndicator>
            </View>
            <View
              style={[
                {
                  width: 57,
                  height: 57,
                  position: "absolute",
                  bottom: 115,
                  right: 10,
                },
              ]}
            >
              <Pressable onPress={() => this.setMenuVisible(false)}>
                <Image
                  source={AppImages.menuPopup}
                  style={[{ width: 57, height: 57 }]}
                />
              </Pressable>
            </View>
          </Pressable>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isShowLoginPopup}
          onRequestClose={() => {
            this.setLoginModalVisible(!this.state.isShowLoginPopup);
          }}
        >
          <View style={CS.blurBGView}>
            <View
              style={[
                styles.modalView,
                { width: "100%", padding: 0, paddingBottom: 0 },
              ]}
            >
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
          visible={this.state.EmptyPopupVisible}
          onRequestClose={() => {
            this.setEmptyModalVisible(!this.state.EmptyPopupVisible);
          }}
        >
          <View style={CS.blurBGView}>
            <View style={[CS.modalView, { width: 300, height: 200 }]}>
              <Text style={[CS.font24, CS.FW700]}>Alert</Text>
              <Text
                style={[
                  CS.greyText,
                  CS.font14,
                  CS.TextCenter,
                  CS.FW400,
                  CS.MT18,
                ]}
              >
                No Information is Avilable For This Restaurant
              </Text>

              <Pressable
                onPress={() => this.props.navigation.navigate("Home")}
                style={[
                  CS.greenBtn,
                  {
                    backgroundColor: "#ffffff",
                    borderColor: "#56678942",
                    borderWidth: 2,
                  },
                ]}
              >
                <Text style={[CS.font16, CS.greyText]}>Go To Home</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <View
          style={[
            {
              zIndex: 1,
              width: 57,
              height: 57,
              position: "absolute",
              bottom: 120,
              right: 10,
            },
          ]}
        >
          <Pressable onPress={() => this.setMenuVisible(true)}>
            <Row>
              <Col sm={12} style={[CS.Col, CS.MT5]}>
                <Image
                  source={AppImages.menuPopup}
                  style={[{ width: 60, height: 60 }]}
                />
              </Col>
            </Row>
          </Pressable>
        </View>
      </View>
    ) : (
      <View style={[styles.container2, styles.horizontal]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: "row",
    width: "100%",
  },
  petItemListContainer: {
    width: "100%",
  },
  customScrollBar: {
    backgroundColor: "#ccc",
    borderRadius: 3,
    width: 6,
  },
  customScrollBarBackground: {
    backgroundColor: "#232323",
    borderRadius: 3,
    height: "100%",
    width: 6,
  },
  container2: {
    flex: 1,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  container: {
    height: 216,
    borderBottomWidth: 1,
    backgroundColor: "transparent",
    marginTop: -200,
  },
  headerIcon: {
    marginLeft: 20,
  },
  headerIcon1: {
    backgroundColor: "#442B7E",
    width: 38,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: 0,
    // marginRight: 10
  },
  headerBox: {
    paddingTop: 20,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    height: 70,
    marginTop: 5,
    padding: 10,
  },
  backBtnBg: {
    backgroundColor: "#5B5B5B3D",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginLeft: 10,
  },
  resturentLogo: {
    marginTop: -50,
    margin: "auto",
    width: 75,
    height: 75,
    borderRadius: 37,
  },
  quantityBox: {
    borderRadius: 15,
    borderColor: "#fff",
    borderWidth: 2,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    marginTop: -50,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //     width: 0,
    //     height: 3,
    // },
    // shadowOpacity: 0.29,
    // shadowRadius: 4.65,
    // elevation: 7,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: 2
  },
  foodType: {
    paddingHorizontal: 5,
    color: "#707070",
  },
  ratingText: {
    fontSize: 10,
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  groupOrderBox: {
    backgroundColor: "#442B7E",
    width: "100%",
    marginTop: 15,
    height: 77,
    padding: 15,
  },

  groupOrderButton: {
    backgroundColor: "#C6345C",
    marginLeft: 20,
    height: 36,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  price: {
    color: "#5CAC7D",
    fontSize: 14,
  },
  footerBox: {
    backgroundColor: "#442B7E",
    width: "100%",
    marginTop: 5,
    borderRadius: 10,
    paddingVertical: 10,
  },
  orderAgainBox: {
    marginTop: 20,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: "#F1F4F3",
    borderRadius: 10,
    height: 46,
    paddingLeft: 15,
    paddingRight: 25,
  },
  orderAgainItem: {
    height: 41,
    borderRadius: 3,
    // minWidth: 105,
    marginVertical: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginRight: 25,
  },
  tabSelected: {
    backgroundColor: "#ffffff",
    color: "#5CAC7D",
    height: 41,
    borderRadius: 3,
    width: "33%",
    marginVertical: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginRight: 0,
    paddingHorizontal: 12,
    minWidth: 100,
    // borderRadius: 10,
  },
  tabUnSelected: {
    backgroundColor: "#F1F4F3",
    color: "#707070",
    height: 41,
    borderRadius: 3,
    width: "33%",
    marginVertical: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginRight: 0,
    paddingHorizontal: 12,
    borderRadius: 10,
    minWidth: 100,
  },
  footerBoxText: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 12,
    // textAlign: 'left'
  },
  menuListBox: {
    margin: 10,
    borderBottomWidth: 1,
    paddingBottom: 15,
    borderColor: "#F1F4F3",
  },
  favoriteIconDisable: {
    color: "#FFFFFF",
  },
});
