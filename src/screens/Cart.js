import React from "react";
import {
  View,
  StatusBar,
  Pressable,
  ActivityIndicator,
  CheckBox,
  BackHandler,
  KeyboardAvoidingView,
  Text,
  Image,
  StyleSheet,
  LogBox,
  TextInput,
  Modal,
  PermissionsAndroid,
} from "react-native";
import {
  Footer,
  Header,
  Wrapper,
  Row,
  Col,
  ProgressiveImage,
  Right,
  Left,
  SignIn,
  RadioButton,
  ContentLoader,
} from "../components/componentIndex";
import Icon from "react-native-vector-icons/Ionicons";
const marginTop = Platform.OS === "ios" ? 20 : 0;
import Config from "../Config";
import { AppImages } from "../res";
import APIKit from "../APIKit";
import { useRoute } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import SwipeableView from "react-native-swipeable-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
const keyboardVerticalOffset = Platform.OS === "ios" ? 20 : -520;
export default class Cart extends React.Component {
  isFavorite = false;
  totalAmount;
  restaurantDetail;
  state = {
    showLoader: 0,
    selectedIndex: 0,
    favoriteIcon: AppImages.likeWhite,
    itemQuantity: 1,
    isNull: false,
    isSelectable: false,
    deletePopupVisible: false,
    deletesinglePopupVisible: false,
    isAllSelected: false,
    AdditionalComments: "",
    isConnected: true,
    isDisconnect: false,
    isShowClearButton: false,
    isShowLoginPopup: false,
    AddAddressWarning: false,
    myText: "I'm ready to get swiped!",
    swipedItems:[]
  };
  cartList = [];
  constructor(props) {
    super(props);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.onAndroidBackPress
    );
  }
  onAndroidBackPress = () => {
    this.props.navigation.navigate(APIKit.previousScreen);
    return true;
  };
  async getPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      }
    } catch (err) {
      console.warn(err);
    }
  }
  componentDidMount() {
    console.log("hhh", APIKit.savedAddressList.length);
    if (Platform.OS === "android") {
      BackHandler.addEventListener(
        "hardwareBackPress",
        this.onAndroidBackPress
      );
    }

    this.getToken();
    this.focusListener = this.props.navigation.addListener("willFocus", () => {
      // this.getCartItemList()
      this.getToken();
      LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
      LogBox.ignoreAllLogs();
    });
  }

  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("accessToken");
      if (value !== null) {
        console.log("accessToken", value);
        Config.userAuthToken = value;
        APIKit.getHeader();
        this.getCartItemList();
      } else {
        this.setState({ isNull: true });
        this.setState({ showLoader: 0 });
      }
    } catch (e) {
      // error reading valu
    }
  };

  deleteItems() {
    this.cartList.forEach((item) => {
      if (this.state[item._id] == true) {
        fetch(Config.baseUrl + "cart/item/" + item._id, {
          method: "DELETE",
          headers: APIKit.CommonHeaders2,
        })
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({ isSelectable: false });
            this.setModalVisible(false);
            this.setSingleDeleteModalVisible(false);
            this.getCartItemList();
          })
          .catch((error) => {
            console.error("getMenuItemDetail", error);
          });
      }
    });
  }

  cancle() {
    this.setModalVisible(false);
    this.setSingleDeleteModalVisible(false);
    this.setAddAddressWarning(false);
    this.setState({ isSelectable: false });
  }

  setAddAddressWarning = (visible) => {
    this.setState({ AddAddressWarning: visible });
  };
  setModalVisible = (visible) => {
    this.setState({ deletePopupVisible: visible });
  };

  setSingleDeleteModalVisible = (visible) => {
    this.setState({ deletesinglePopupVisible: visible });
  };
  sortList(a, b) {
    const id1 = a._id.toUpperCase();
    const id2 = b._id.toUpperCase();
    let comparison = 0;
    if (id1 > id2) {
      comparison = 1;
    } else if (id1 < id2) {
      comparison = -1;
    }
    return comparison;
  }

  getCartItemList() {
    fetch(Config.baseUrl + "cart", {
      method: "GET",
      headers: APIKit.CommonHeaders2,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == true) {
          let sortedCartList = [];
          responseJson?.success.data.cartItems.forEach((item) => {
            item.amount = item.amount + this.getExtrasTotal(item.extras);
            item.totalAmount = item.quantity * item.amount;
            sortedCartList.push(item);
          });

          this.cartList = sortedCartList.sort(APIKit.sortList);
          // console.log("this.cartList", this.cartList[1].extras)
          this.restaurantDetail = responseJson?.success.data.restaurant;
          this.totalAmount = responseJson?.success.data.totalAmount;
          this.setState({ showLoader: 1 });
          this.setState({ isNull: false });
          this.cartList.forEach((item) => {
            this.setState({ [item._id]: false });
          });
        } else {
          this.setState({ isNull: true });
          this.setState({ showLoader: 0 });
        }
      })
      .catch((error) => {
        console.error("getMenuItemDetail", error);
        this.setState({ isNull: true });
        this.setState({ showLoader: 0 });
      });
  }

  onQuantityChange(val) {
    if (val == "add") {
      this.setState({ itemQuantity: this.state.itemQuantity + 1 });
    }
    if (val == "sub") {
      if (this.state.itemQuantity != 1) {
        this.setState({ itemQuantity: this.state.itemQuantity - 1 });
      }
    }
  }

  selectAll() {
    if (!this.state.isAllSelected) {
      this.setState({ isAllSelected: true });
      this.cartList.forEach((item) => {
        this.setState({ [item._id]: true });
      });
      this.setState({ isShowClearButton: true });
    } else {
      this.cartList.forEach((item) => {
        this.setState({ [item._id]: false });
      });
      this.setState({ isAllSelected: false });
      this.setState({ isShowClearButton: false });
    }
  }

  clear() {
    this.setModalVisible(true);
  }

  done() {
    this.setState({ isAllSelected: false });
    this.cartList.forEach((item) => {
      this.setState({ [item._id]: false });
    });
    this.setState({ isSelectable: false });
  }

  onRadioChange(item) {
    if (this.state[item._id] == false) {
      this.setState({ [item._id]: true });
      this.setState({ isShowClearButton: true });
    } else {
      this.setState({ [item._id]: false });
      this.setState({ isAllSelected: false });
      if (this.cartList.length == 1) {
        if (this.state[this.cartList[0]._id] == true) {
          this.setState({ isShowClearButton: true });
        } else {
          this.setState({ isShowClearButton: false });
        }
      } else if (this.cartList.length == 2) {
        if (
          this.state[this.cartList[0]._id] == true &&
          this.state[this.cartList[1]._id] == true
        ) {
          this.setState({ isShowClearButton: true });
        } else {
          this.setState({ isShowClearButton: false });
        }
      } else if (this.cartList.length == 3) {
        if (
          this.state[this.cartList[0]._id] == true &&
          this.state[this.cartList[1]._id] == true &&
          this.state[this.cartList[2]._id] == true
        ) {
          this.setState({ isShowClearButton: true });
        } else {
          this.setState({ isShowClearButton: false });
        }
      } else if (this.cartList.length == 4) {
        if (
          this.state[this.cartList[0]._id] == true &&
          this.state[this.cartList[1]._id] == true &&
          this.state[this.cartList[2]._id] == true &&
          this.state[this.cartList[3]._id] == true
        ) {
          this.setState({ isShowClearButton: true });
        } else {
          this.setState({ isShowClearButton: false });
        }
      } else if (this.cartList.length == 5) {
        if (
          this.state[this.cartList[0]._id] == true &&
          this.state[this.cartList[1]._id] == true &&
          this.state[this.cartList[2]._id] == true &&
          this.state[this.cartList[3]._id] == true &&
          this.state[this.cartList[4]._id] == true
        ) {
          this.setState({ isShowClearButton: true });
        } else {
          this.setState({ isShowClearButton: false });
        }
      } else if (this.cartList.length == 6) {
        if (
          this.state[this.cartList[0]._id] == true &&
          this.state[this.cartList[1]._id] == true &&
          this.state[this.cartList[2]._id] == true &&
          this.state[this.cartList[3]._id] == true &&
          this.state[this.cartList[4]._id] == true &&
          this.state[this.cartList[5]._id] == true
        ) {
          this.setState({ isShowClearButton: true });
        } else {
          this.setState({ isShowClearButton: false });
        }
      }
    }
  }

  updateItemQuantity(value, id, quantity) {
    if (value == "add") {
      this.setState({ itemQuantity: this.state.itemQuantity + 1 });
      fetch(Config.baseUrl + "cart/item/" + id, {
        method: "PUT",
        headers: APIKit.CommonHeaders2,
        body: JSON.stringify({
          payload: {
            quantity: quantity + 1,
            additionalComments: "Nothingsdsdasdasdasdasdasdasd",
          },
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.getCartItemList();
        })
        .catch((error) => {
          console.error("PlaceOrderError", error);
        });
    }
    if (value == "sub") {
      if (quantity >= 2) {
        fetch(Config.baseUrl + "cart/item/" + id, {
          method: "PUT",
          headers: APIKit.CommonHeaders2,
          body: JSON.stringify({ payload: { quantity: quantity - 1 } }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            this.getCartItemList();
          })
          .catch((error) => {
            console.error("PlaceOrderError", error);
          });
      } else {
        this.setState({ [id]: true });
        this.setSingleDeleteModalVisible(true);
      }
    }
  }

  goToMenu(id) {
    APIKit.MenuItemId = id;
    this.setModalVisible(false);
    this.props.navigation.navigate("MenuItemDetail");
  }
  addMoreItems(id) {
    APIKit.ResturantId = id;
    this.props.navigation.navigate("Restaurant");
  }
  getExtrasTotal(items) {
    let total = 0;
    items.forEach((item) => {
      total = total + item.amount;
    });
    return total;
  }

  onCommentChange(text) {
    this.setState({ AdditionalComments: text });
  }

  onSwipeLeft(gestureState) {
    this.setState({ myText: "You swiped left!" });
  }

  onSwipeRight(gestureState) {
    this.setState({ myText: "You swiped right!" });
  }
  setLoginModalVisible = (visible) => {
    this.setState({ isShowLoginPopup: visible });
  };

  closeModal = () => {
    this.setLoginModalVisible(false);
  };
  render() {
    const CS = Config.style;

    const footer = (
      <Row
        Hidden={!this.state.showLoader == 0 && !this.cartList.length >= 1}
        style={[CS.topShadow]}
      >
        <Footer>
          <Row
            style={[styles.footerBox, { backgroundColor: "#ffffff" }]}
            Hidden={!this.state.isSelectable}
          >
            <Col sm={1}>
              <RadioButton
                style={{
                  width: 20,
                  height: 20,
                  borderColor: Config.primaryColor,
                  borderWidth: 2,
                }}
                innerBackgroundColor={Config.primaryColor}
                isActive={this.state.isAllSelected}
                onPress={() => this.selectAll()}
                innerContainerStyle={{ height: 14, width: 14 }}
              ></RadioButton>
            </Col>
            <Col sm={9} style={[styles.footerBoxText]}>
              <Pressable onPress={() => this.selectAll()} style={{ width: 80 }}>
                <Text style={[CS.font14]}>Select ALL</Text>
              </Pressable>
            </Col>
            <Col
              sm={2}
              style={[styles.footerBoxText]}
              Hidden={!this.state.isShowClearButton}
            >
              <Pressable onPress={() => this.clear()}>
                <Text style={[CS.font16, CS.FW500, { color: "#C6345C" }]}>
                  Clear
                  <Icon
                    name="chevron-forward-sharp"
                    color={"#ffffff"}
                    size={14}
                  />
                </Text>
              </Pressable>
            </Col>
          </Row>
          <Pressable
            onPress={() => {
              Config.userAuthToken == null
                ? this.setLoginModalVisible(true)
                : APIKit.savedAddressList.length == 0
                ? this.setAddAddressWarning(true)
                : this.props.navigation.navigate("Checkout");
            }}
          >
            <Row
              style={styles.footerBox}
              size={12}
              Hidden={this.state.showLoader == 0 || this.state.isSelectable}
            >
              <Col sm={9} style={[styles.footerBoxText]}>
                <Text
                  style={[CS.whiteText, CS.font14, CS.FontMedium, CS.FW500]}
                >
                  Total SAR {APIKit.round(this.totalAmount, 2)}
                </Text>
              </Col>
              <Col sm={2.5} style={[styles.footerBoxText]}>
                <Text style={[CS.whiteText, CS.font14, CS.FontBold, CS.FW700]}>
                  Checkout
                </Text>
              </Col>
              <Col sm={0.5} style={[CS.Col, { alignItems: "flex-start" }]}>
                <Image
                  source={AppImages.rightWhite}
                  style={{ width: 7, height: 9, marginLeft: -3 }}
                />
              </Col>
            </Row>
          </Pressable>
        </Footer>
      </Row>
    );
    return (
      <Wrapper footer={footer}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <Header style={{ paddingTop: 10 }}>
            <Left style={CS.imageIcon}>
              <Pressable
                onPress={() =>
                  this.props.navigation.navigate(APIKit.previousScreen)
                }
              >
                <Image
                  source={AppImages.backBlack}
                  style={{ width: 33, height: 33 }}
                />
              </Pressable>
            </Left>
            <Pressable style={CS.Col}>
              <Text style={[CS.font16, CS.FW500]}>Cart</Text>
            </Pressable>
            <Right>
              {this.state.isSelectable ? (
                <Pressable
                  onPress={() => this.done()}
                  style={styles.headerIcon}
                >
                  <Text style={CS.font16}>Done</Text>
                </Pressable>
              ) : (
                <Row Hidden={this.state.isNull}>
                  <Pressable
                    onPress={() => this.setState({ isSelectable: true })}
                    style={styles.headerIcon}
                  >
                    <Col
                      Hidden={
                        !this.state.showLoader == 0 &&
                        !this.cartList.length >= 1
                      }
                    >
                      <Image
                        source={AppImages.selectMenu}
                        style={[{ width: 22, height: 22 }, CS.MR18]}
                      />
                    </Col>
                  </Pressable>
                  {/* <Col>
                                    <Pressable onPress={() => this.props.navigation.navigate('Home')} style={styles.headerIcon}>
                                        <Icon name='heart-outline' size={24} color={Config.primaryColor}></Icon>
                                    </Pressable>
                                </Col> */}
                </Row>
              )}
            </Right>
          </Header>

          {this.state.showLoader == 1 ? (
            <View>
              <Row Hidden={this.state.showLoader == 0}>
                <Row style={{ margin: 15 }} size={12}>
                  <Col sm={2}>
                    <View style={{ borderRadius: 20, height: 45, width: 45 }}>
                      <ProgressiveImage
                        style={{ width: 45, height: 45, resizeMode: "cover" }}
                        uri={this.restaurantDetail.logo}
                        resizeMode="contain"
                      />
                    </View>
                  </Col>
                  <Col sm={6}>
                    <Text style={[CS.font15, CS.FontBold, CS.FW700]}>
                      {this.restaurantDetail.name}
                    </Text>
                    <Text
                      style={[
                        CS.font12,
                        CS.greyText,
                        CS.MT5,
                        CS.FW400,
                        CS.FontRegular,
                      ]}
                      ellipsizeMode="tail"
                      numberOfLines={3}
                    >
                      {this?.restaurantDetail?.foodType?.map((food) =>
                        this?.restaurantDetail?.foodType[0] == food
                          ? food
                          : " · " + food
                      )}
                    </Text>
                  </Col>
                  <Col sm={4}>
                    <Pressable
                      onPress={() =>
                        this.addMoreItems(this.restaurantDetail._id)
                      }
                      style={styles.addMoreBtn}
                    >
                      <Icon name="add" size={15} color={"#5CAC7D"}></Icon>
                      <Text style={[CS.font10, CS.greenText]}>
                        Add More Items
                      </Text>
                    </Pressable>
                  </Col>
                </Row>

                <View
                  style={[
                    CS.MT16,
                    CS.PD8,
                    { borderTopColor: "#cccccc", borderTopWidth: 0.5 },
                  ]}
                >
                  <Text style={[CS.greyText, CS.font10, CS.MT5]}>Items</Text>
                  {this.cartList.map((item) => (
                    <SwipeableView
                      btnsArray={[
                        {
                          onPress: () => {
                            this.setState({ [item._id]: true });
                            this.setSingleDeleteModalVisible(true);
                          },
                          props: {style:{backgroundColor:'transparent'}},
                          component: (
                            <View style={{    
                              borderTopRightRadius: 10,
                              borderBottomRightRadius: 10,
                              height: 88,
                              width:100,
                              marginTop: 15,
                              padding: 10,
                              marginRight: 30,
                              alignItems:'center',
                              backgroundColor:'#C6345C'}}>
                              <Image
                                source={AppImages.Delete}
                                style={[{ width: 22, height: 24, marginTop:20,marginLeft:20 }]}
                              />
                            </View>
                          ),
                          autoClose: true
                        },
                      ]}
                    >
                      <Row size={12} key={item._id}>
                        <Col
                          sm={1}
                          Hidden={!this.state.isSelectable}
                          style={CS.Col}
                        >
                          <Pressable
                            onPress={() => this.onRadioChange(item)}
                            style={[{ height: 88, paddingTop: 15 }, CS.Col]}
                          >
                            <RadioButton
                              style={{
                                width: 25,
                                height: 25,
                                borderColor: Config.primaryColor,
                                borderWidth: 2,
                                // paddingTop: 45
                              }}
                              innerBackgroundColor={Config.primaryColor}
                              isActive={this.state[item._id]}
                              onPress={() => this.onRadioChange(item)}
                              innerContainerStyle={{ height: 18, width: 18 }}
                            ></RadioButton>
                          </Pressable>
                        </Col>

                        <Col
                          sm={this.state.isSelectable ? 11 : 12}
                          style={[CS.Col]}
                        >
                          <Pressable
                            onPress={() => this.goToMenu(item.menuItemId)}
                          >
                            <Row
                              style={[
                                styles.itemContainer,
                                this.state.isSelectable
                                  ? { marginRight: -25 }
                                  : { marginRight: 0 },
                              ]}
                            >
                              <Col sm={2.5}>
                                <ProgressiveImage
                                  style={{
                                    width: 66,
                                    height: 66,
                                    marginLeft: -5,
                                  }}
                                  uri={item.image}
                                  resizeMode="contain"
                                />
                              </Col>
                              <Col sm={6} style={{ justifyContent: "center" }}>
                                <Text
                                  style={[CS.font17, CS.FW500, CS.FontMedium]}
                                >
                                  {item.name}
                                </Text>
                                <Row Hidden={item.extras.length == 0}>
                                  <Text
                                    style={[
                                      CS.font10,
                                      CS.greyText,
                                      CS.FW400,
                                      CS.FontRegular,
                                    ]}
                                    ellipsizeMode="tail"
                                    numberOfLines={3}
                                  >
                                    {item.extras.map((food) =>
                                      item.extras[0].name == food.name
                                        ? food.name
                                        : " · " + food.name
                                    )}
                                  </Text>
                                </Row>
                                <Text
                                  style={[
                                    CS.font15,
                                    CS.FW400,
                                    CS.greyText,
                                    CS.FontRegular,
                                  ]}
                                >
                                  SAR {APIKit.round(item.totalAmount, 2)}
                                </Text>
                              </Col>
                              <Col sm={3.5}>
                                <View
                                  style={[
                                    styles.addBtnBox,
                                    CS.MT18,
                                    {
                                      backgroundColor: "#5CAC7D",
                                      borderColor: "#5CAC7D",
                                    },
                                  ]}
                                >
                                  <Pressable
                                    onPress={() =>
                                      this.updateItemQuantity(
                                        "sub",
                                        item._id,
                                        item.quantity
                                      )
                                    }
                                    style={[styles.addBtn, CS.Col]}
                                  >
                                    <Image
                                      source={AppImages.minusGreen}
                                      style={{ width: 12, height: 12 }}
                                    />
                                    {/* <Text style={[CS.textCenter, CS.font18, { color: '#5CAC7D' }]}>-</Text> */}
                                  </Pressable>
                                  <Text
                                    style={[
                                      styles.addBtntext,
                                      CS.Col,
                                      CS.textCenter,
                                      CS.font14,
                                    ]}
                                  >
                                    {item.quantity}
                                  </Text>
                                  <Pressable
                                    onPress={() =>
                                      this.updateItemQuantity(
                                        "add",
                                        item._id,
                                        item.quantity
                                      )
                                    }
                                    style={[styles.addBtn, CS.Col]}
                                  >
                                    <Image
                                      source={AppImages.plusGreen}
                                      style={{ width: 12, height: 12 }}
                                    />
                                    {/* <Icon name='add' color={'#5CAC7D'} size={27} /> */}
                                  </Pressable>
                                </View>
                              </Col>
                            </Row>
                          </Pressable>
                        </Col>
                      </Row>
                    </SwipeableView>
                  ))}
                </View>

                <Row
                  style={[styles.requestContainer]}
                  Hidden={this.state.showLoader == 0}
                >
                  <Col>
                    <Text style={[CS.font16, CS.FW700, CS.FontBold]}>
                      Special Request
                    </Text>
                  </Col>
                  <Col>
                    <Text
                      style={[CS.greyText, CS.ML5, CS.font10, { marginTop: 5 }]}
                    >
                      (optional)
                    </Text>
                  </Col>
                  <Col sm={12}>
                    <TextInput
                      style={[styles.requestInput]}
                      placeholder={"e.g. Anything else we need to know?"}
                      placeholderTextColor={"#999999"}
                      multiline={true}
                      returnKeyType="next"
                      onChangeText={(text) => this.onCommentChange(text)}
                      value={this.state.AdditionalComments}
                      onSubmitEditing={() => {
                        // this.login();
                      }}
                      numberOfLines={4}
                    ></TextInput>
                  </Col>
                </Row>
              </Row>
            </View>
          ) : (
            <View>
              <Row style={[styles.container2]} Hidden={this.state.isNull}>
                <Col sm={12} style={[styles.itemContainer, { borderWidth: 0 }]}>
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
                <Col sm={12} style={[styles.itemContainer, { borderWidth: 0 }]}>
                  <ContentLoader
                    active
                    avatar
                    pRows={3}
                    pWidth={["50%", "100%", "70%"]}
                    avatarStyles={{ borderRadius: 3 }}
                    title={false}
                  ></ContentLoader>
                </Col>
                <Col sm={12} style={[styles.itemContainer, { borderWidth: 0 }]}>
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
          )}

          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.deletesinglePopupVisible}
              onRequestClose={() => {
                this.setSingleDeleteModalVisible(
                  !this.state.deletesinglePopupVisible
                );
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={[CS.font24, CS.FW700]}>Remove Item</Text>
                  <Text
                    style={[
                      CS.greyText,
                      CS.font14,
                      CS.TextCenter,
                      CS.FW400,
                      CS.MT18,
                    ]}
                  >
                    Are you sure you would like remove item from cart?
                  </Text>
                  <Pressable
                    onPress={() => this.deleteItems()}
                    style={[
                      CS.greenBtn,
                      CS.MT18,
                      { backgroundColor: "#C6345C" },
                    ]}
                  >
                    <Text style={[CS.font16, CS.whiteText]}>Remove item</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => this.cancle()}
                    style={[
                      CS.greenBtn,
                      {
                        backgroundColor: "#ffffff",
                        borderColor: "#56678942",
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <Text style={[CS.font16, CS.greyText]}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.AddAddressWarning}
            onRequestClose={() => {
              this.setAddAddressWarning(!this.state.AddAddressWarning);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={[CS.font24, CS.FW700, { textAlign: "center" }]}>
                  Please add address Before checkout
                </Text>

                <Pressable
                  onPress={() => this.cancle()}
                  style={[
                    CS.greenBtn,
                    {
                      backgroundColor: "#ffffff",
                      borderColor: "#56678942",
                      borderWidth: 2,
                    },
                  ]}
                >
                  <Text style={[CS.font16, CS.greyText]}>ok</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.deletePopupVisible}
              onRequestClose={() => {
                this.setModalVisible(!deletePopupVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={[CS.font24, CS.FW700]}>Clear Cart</Text>
                  <Text
                    style={[
                      CS.greyText,
                      CS.font14,
                      CS.TextCenter,
                      CS.FW400,
                      CS.MT18,
                    ]}
                  >
                    Are you sure you would like to Clear your cart?
                  </Text>
                  <Pressable
                    onPress={() => this.deleteItems()}
                    style={[
                      CS.greenBtn,
                      CS.MT18,
                      { backgroundColor: "#C6345C" },
                    ]}
                  >
                    <Text style={[CS.font16, CS.whiteText]}>Empty Cart</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => this.cancle()}
                    style={[
                      CS.greenBtn,
                      {
                        backgroundColor: "#ffffff",
                        borderColor: "#56678942",
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <Text style={[CS.font16, CS.greyText]}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
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
              <View style={CS.LoginModalView}>
                <SignIn
                  navigation={this.props.navigation}
                  closeModal={this.closeModal}
                ></SignIn>
              </View>
            </View>
          </Modal>
          <Row Hidden={!this.state.isNull} style={[{ marginTop: "20%" }]}>
            <Col style={[CS.Col]} sm={12}>
              <Image
                source={AppImages.BuyLight}
                style={[{ width: 145, height: 161 }, CS.MR18]}
              />
            </Col>
            <Col style={[CS.Col, { height: 100 }]} sm={12}>
              <Text style={[CS.font17, CS.greyText, CS.MT18]}>
                Your Cart is Empty
              </Text>
            </Col>
            <Col sm={12} style={CS.PD8}>
              <Pressable
                onPress={() => this.props.navigation.navigate("RestaurentList")}
                style={[CS.greenBtn, CS.MT18]}
              >
                <Text style={[CS.font16, CS.whiteText]}>
                  Browse Restaurants
                </Text>
              </Pressable>
            </Col>
          </Row>
        </KeyboardAvoidingView>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  addBtnBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#999999",
    width: 88,
    height: 30,
    maxHeight: 30,
    borderRadius: 5,
    borderColor: "#999999",
    borderWidth: 1,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 5,
    padding: 0,
    backgroundColor: "#F8F8F8",
  },
  addBtntext: {
    width: 30,
    height: 30,
    paddingTop: 6,
    color: "#ffffff",
  },
  addMoreBtn: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CCCCCC",
    borderRadius: 1,
    margin: 5,
    height: 30,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    maxHeight: 30,
    paddingVertical: 0,
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
    height: 88,
    marginTop: 15,
    padding: 10,
  },
  requestContainer: {
    // borderWidth: 1,
    // borderStyle: 'dashed',
    // borderColor: '#C4C4C4',
    borderRadius: 1,
    padding: 10,
    marginLeft: -2,
    marginRight: -2,
  },
  requestInput: {
    backgroundColor: "#F4F4F4",
    width: "100%",
    borderRadius: 10,
    marginTop: 5,
    textAlignVertical: "top",
    paddingLeft: 10,
    fontWeight: "500",
    fontSize: 12,
    minHeight: 81,
  },
  resturentLogo: {
    marginTop: -50,
    margin: "auto",
    width: 75,
    height: 75,
    borderRadius: 37,
  },
  content: {
    width: "100%",
    marginTop: -50,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
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
    paddingVertical: 12,
    paddingLeft: 15,
    height: 45,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  container2: {
    margin: 20,
  },
  foodType: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
