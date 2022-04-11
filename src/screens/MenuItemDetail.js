import React from "react";
import {
  View,
  StatusBar,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
  KeyboardAvoidingView,
  Text,
  Image,
  StyleSheet,
  LogBox,
  TextInput,
  Modal,
  BackHandler,
  Dimensions,
} from "react-native";
import {
  Footer,
  Wrapper,
  Row,
  Col,
  RadioButton,
  ProgressiveImage,
  Right,
  CheckBox,
  SignIn,
} from "../components/componentIndex";
import Icon from "react-native-vector-icons/Ionicons";
// import CheckBox from '@react-native-community/checkbox';
const marginTop = Platform.OS === "ios" ? 0 : 0;
import Config from "../Config";
import { AppImages } from "../res";
import APIKit from "../APIKit";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
const keyboardVerticalOffset = Platform.OS === "ios" ? 0 : -520;
export default class MenuItemDetail extends React.Component {
  extras;
  choices;
  totalAmount = 0;
  selectedExtra = [];
  selectedChoice = {};
  isAdded = false;
  cartItemDetail = {};
  state = {
    showLoader: 0,
    selectedIndex: 0,
    itemQuantity: 1,
    isAdded: false,
    deletePopupVisible: false,
    AdditionalComments: "",
    isShowLoginPopup: false,
  };
  MenuItemsDetail;
  cartList = [];
  constructor(props) {
    super(props);
  }

  setLoginModalVisible = (visible) => {
    this.setState({ isShowLoginPopup: visible });
  };
  closeModal = () => {
    this.setLoginModalVisible(false);
  };
  resetPage() {
    this.totalAmount = 0;
    this.selectedExtra = [];
    this.selectedChoice = {};
    this.isAdded = false;
    this.cartItemDetail = {};
    this.MenuItemsDetail = "";
    this.getMenuItemDetail();
    setTimeout(() => {
      // this.getCartItemList();
    }, 500);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.onAndroidBackPress
    );
  }

  onAndroidBackPress = () => {
    this.props.navigation.navigate("Restaurant");
    return true;
  };

  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("accessToken");
      if (value !== null) {
        Config.userAuthToken = value;
        APIKit.getHeader();
        this.getCartItemList();
      }
    } catch (e) {
      // error reading valu
    }
  };

  componentDidMount() {
    this.getToken();
    if (Platform.OS === "android") {
      BackHandler.addEventListener(
        "hardwareBackPress",
        this.onAndroidBackPress
      );
    }
    // this.resetPage();
    // this.getMenuItemDetail();
    // this.getCartItemList();
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    LogBox.ignoreAllLogs();
    this.focusListener = this.props.navigation.addListener("willFocus", () => {
      this.resetPage();
      // this.getCartItemList();
    });
  }

  getMenuItemDetail() {
    this.MenuItemsDetail = [];
    let menuId = APIKit.MenuItemId; //this.props.route.params.menuId;
    fetch(Config.baseUrl + "menu/item/" + menuId, {
      method: "GET",
      headers: APIKit.CommonHeaders2,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.MenuItemsDetail = responseJson.success.data.menuItem[0];
        this.totalAmount = this.MenuItemsDetail.amount;
        this.totalCalories = this.MenuItemsDetail.calories;
        if (this.MenuItemsDetail.itemDetails.extras) {
          this.extras = this.MenuItemsDetail.itemDetails.extras;
          this.extras.forEach((item) => {
            this.setState({ [item._id]: false });
          });
        }
        if (this.MenuItemsDetail.itemDetails.choices) {
          this.choices = this.MenuItemsDetail.itemDetails.choices;
          this.choices.forEach((item) => {
            this.setState({ [item._id]: false });
          });
          this.setState({ [this.choices[0]._id]: true });
          // this.totalAmount = this.totalAmount + this.choices[0].amount;
          // this.totalCalories = this.totalCalories + this.choices[0].calories
          this.selectedChoice = this.choices[0];
          this.setState({ showLoader: 1 });
        }
      })
      .catch((error) => {
        console.error("getMenuItemDetail", error);
      });
  }

  onQuantityChange(val) {
    if (val == "add") {
      this.setState({ itemQuantity: this.state.itemQuantity + 1 });
      // this.totalAmount = this.totalAmount * this.state.itemQuantity
      setTimeout(() => {
        if (this.state.isAdded) {
          this.updateItem();
        }
      }, 500);
    }
    if (val == "sub") {
      if (this.state.itemQuantity != 1) {
        this.setState({ itemQuantity: this.state.itemQuantity - 1 });
        setTimeout(() => {
          if (this.state.isAdded) {
            this.updateItem();
          }
        }, 500);
        // this.totalAmount = this.totalAmount * this.state.itemQuantity
      }
    }
  }

  updateItem() {
    this.cartItemDetail = {
      quantity: this.state?.cartAddedItem?.quantity + this.state?.itemQuantity,
      choices: this.selectedChoice,
      extras: this.selectedExtra,
      additionalComments: this.state?.AdditionalComments,
      menuItemId: APIKit.MenuItemId,
    };
    fetch(Config.baseUrl + "cart/item/" + this.state?.cartAddedItem?._id, {
      method: "PUT",
      headers: APIKit.CommonHeaders2,
      body: JSON.stringify({ payload: this.cartItemDetail }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == true) {
          this.setState({ isAdded: true });
          APIKit.showCommonToast("Item Added in your Cart", 3000, "success");
          this.props.navigation.navigate("Restaurant");
          // this.resetPage();
        }
      })
      .catch((error) => {
        console.error("PlaceOrderError", error);
      });
  }

  addItemInCart() {
    if (Config.userAuthToken == null) {
      this.setLoginModalVisible(true);
    } else if (
      this.state?.isSameItemAdded ||
      JSON.stringify(this.state?.cartAddedItem?.extras) ==
        JSON.stringify(this.selectedExtra)
    ) {
      this.updateItem();
    } else {
      this.cartItemDetail = {
        quantity: this.state.itemQuantity,
        choices: this.selectedChoice,
        extras: this.selectedExtra,
        additionalComments: this.state.AdditionalComments,
        menuItemId: APIKit.MenuItemId, // '6124a8bae6281400181a5407' //this.props.route.params.menuId;
      };
      fetch(Config.baseUrl + "cart", {
        method: "POST",
        headers: APIKit.CommonHeaders2,
        body: JSON.stringify({ payload: this.cartItemDetail }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == true) {
            this.setState({ isAdded: true });
            APIKit.showCommonToast("Item Added in your Cart", 3000, "success");
            this.props.navigation.navigate("Restaurant");
          } else {
            let errorMessage = responseJson.error.code;
            if (errorMessage == "ORDER_NOT_ALLOWED_FROM_CROSS_RESTAURANTS") {
              this.setModalVisible(true);
            }

          }
        })
        .catch((error) => {
          console.error("addItemInCarterror", error);
        });
    }
  }

  onCheckboxChange(item) {
    if (this.state[item._id] == true) {
      this.setState({ [item._id]: false });
      this.totalAmount = this.totalAmount - item.amount;
      this.totalCalories = this.totalCalories - item.calories;
      this.selectedExtra.splice(
        this.selectedExtra.findIndex(function (i) {
          return i._id === item._id;
        }),
        1
      );
      if (this.state.isAdded) {
        this.updateItem();
      }
    } else {
      this.setState({ [item._id]: true });
      this.totalAmount = this.totalAmount + item.amount;
      this.totalCalories = this.totalCalories + item.calories;
      this.selectedExtra.push(item);
      if (this.state.isAdded) {
        this.updateItem();
      }
    }
  }

  getCartItemList() {
    fetch(Config.baseUrl + "cart", {
      method: "GET",
      headers: APIKit.CommonHeaders2,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.cartList = responseJson.success.data.cartItems.sort(
          APIKit.sortList
        );

        this.cartList.forEach((item) => {
          if (item.menuItemId == APIKit.MenuItemId) {
            this.setState({ isSameItemAdded: true });
            this.setState({ cartAddedItem: item });
            // }
          }
        });
      })
      .catch((error) => {
        this.setState({ showLoader: 1 });
      });
  }

  getExtrasTotal(items) {
    let total = 0;
    items.forEach((item) => {
      total = total + item.amount;
    });
    return total;
  }

  onRadioChange(item) {
    if (this.state[item._id] == false) {
      this.choices.forEach((choice) => {
        if (this.state[choice._id] == true) {
          this.setState({ [choice._id]: false });
          this.totalAmount = this.totalAmount - choice.amount;
          this.totalCalories = this.totalCalories - choice.calories;
        }
      });
      this.setState({ [item._id]: true });
      this.selectedChoice = item;
      this.totalAmount = this.totalAmount + item.amount;
      this.totalCalories = this.totalCalories + item.calories;
    }
  }

  round(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  }

  deleteItems() {
    let deleteResponse = [];
    this.cartList.forEach((item) => {
      fetch(Config.baseUrl + "cart/item/" + item._id, {
        method: "DELETE",
        headers: APIKit.CommonHeaders2,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == true) {
            deleteResponse.push(responseJson);
            if (this.cartList.length == deleteResponse.length) {
              this.setModalVisible(false);
              this.addItemInCart();
            }
          }
        })
        .catch((error) => {
          console.error("deleteItems", error);
        });
    });
  }

  cancle() {
    this.setModalVisible(false);
  }

  setModalVisible = (visible) => {
    this.setState({ deletePopupVisible: visible });
  };

  onCommentChange(text) {
    this.setState({ AdditionalComments: text });
    //this.updateItem();
  }
  render() {
    const CS = Config.style;
    const footer = (
      <Pressable
       onPress={() => this.addItemInCart()}
      >
      <Footer>
        <Row style={styles.footerBox} size={12}>
          <Col sm={3} style={[CS.Col, styles.footerBoxText]}>
            <Text style={[CS.whiteText, CS.font14, CS.FW500, CS.FontMedium]}>
              SAR {this.round(this.totalAmount * this.state.itemQuantity, 2)}
            </Text>
          </Col>

          <Col sm={9} style={Object.assign({}, CS.Col, styles.footerBoxText)}>
            <Pressable
              onPress={() => this.addItemInCart()}
              style={[{ height: 45, alignSelf: "flex-end", padding: 14 }]}
            >
              <Text style={[CS.whiteText, CS.font14, CS.FontBold, CS.FW700]}>
                Add To Cart
              </Text>
            </Pressable>
          </Col>
        </Row>
      </Footer>
      </Pressable>
    );
    return this.state.showLoader == 1 ? (
      <Wrapper footer={footer}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
        <ProgressiveImage
          style={styles.image}
          uri={this.MenuItemsDetail?.image}
          resizeMode="contain"
        />
        <Pressable
          onPress={() => this.props.navigation.navigate("Restaurant")}
          style={[styles.backBtnBg, { marginLeft: 4 }]}
        >
          <Icon name="arrow-back-sharp" size={28} color={"#fff"}></Icon>
        </Pressable>
        <Pressable
          onPress={() => {
            this.props.navigation.navigate("Cart");
            APIKit.previousScreen = this.props.navigation.state.routeName;
          }}
          style={[
            styles.backBtnBg,
            {
              backgroundColor: "#ffffff",
              left: Dimensions.get("window").width - 50,
            },
          ]}
        >
          <Image source={AppImages.Buy} style={{ width: 25, height: 28 }} />
        </Pressable>
        <View style={[CS.ML14, CS.MT16]}>
          <Text style={[CS.font22, CS.FW700, CS.FontBold]}>
            {this.MenuItemsDetail?.name}
          </Text>
          <Text
            style={[
              CS.font14,
              CS.greyText,
              CS.FontRegular,
              CS.FW400,
              { color: "#707070", padding: 8, paddingLeft: 0 },
            ]}
          >
            {this.MenuItemsDetail?.description}
          </Text>
          <Text style={[CS.font12, CS.boldText, CS.MT14]}>
            <Image
              source={AppImages.calories}
              style={{
                width: 15,
                height: 16,
                resizeMode: "contain",
                marginBottom: -3,
              }}
            />
            {" " + this.totalCalories * this.state.itemQuantity} Calories -{" "}
            <Text style={[CS.font12, CS.FontRegular, { color: "#999999" }]}>
              Calories may change based on addition
            </Text>
          </Text>
          <Row size={12} style={[CS.MT18]}>
            <Col sm={8}>
              <View
                style={[
                  styles.addBtnBox,
                  this.state.itemQuantity > 0
                    ? { backgroundColor: "#5CAC7D", borderColor: "#5CAC7D" }
                    : { backgroundColor: "#999999", borderColor: "#999999" },
                ]}
              >
                <Pressable
                  onPress={() => this.onQuantityChange("sub")}
                  style={[styles.addBtn, CS.Col]}
                >
                  <Image
                    source={AppImages.minusGreen}
                    style={{ width: 12, height: 12 }}
                  />
                </Pressable>
                <Text
                  style={[styles.addBtntext, CS.Col, CS.textCenter, CS.font18]}
                >
                  {this.state.itemQuantity}
                </Text>
                <Pressable
                  onPress={() => this.onQuantityChange("add")}
                  style={[styles.addBtn, CS.Col]}
                >
                  <Image
                    source={AppImages.plusGreen}
                    style={{ width: 13, height: 13 }}
                  />
                </Pressable>
              </View>
            </Col>
            <Col sm={4}>
              <Text style={[CS.font20, CS.FW700, CS.FontBold]}>
                SAR {this.MenuItemsDetail?.amount}
              </Text>
            </Col>
          </Row>
          {/* <Row Hidden={this.choices.length == 0}> */}
          {/* <View>
                        <Row style={[CS.MT18]}>
                            <Col sm={3}><Text style={[CS.font16, CS.FW700]}>Your Choice</Text></Col>
                            <Col sm={2}><Text style={[CS.font10, CS.greyText, CS.Col, CS.MT5]}>(Choose 1)</Text></Col>
                        </Row>
                    </View>
                    <View style={styles.cardShadow}>
                        <View style={styles.cardContainer}>
                            {this.choices.map((item) => (
                                <Pressable onPress={() => this.onRadioChange(item)}>
                                    <Row >
                                        <Col sm={11} style={[styles.cardCol]}>
                                            <Text style={[CS.font14, CS.FW500]}>{item.name}</Text>
                                        </Col>
                                        <Col sm={1} style={[styles.cardCol]}>
                                            <RadioButton style={[CS.radioPrimary]}
                                                innerBackgroundColor={Config.primaryColor}
                                                isActive={this.state[item._id]}
                                                onPress={() => this.onRadioChange(item)}
                                                innerContainerStyle={{ height: 18, width: 18 }}></RadioButton>
                                        </Col>
                                    </Row>
                                </Pressable>
                            ))}
                        </View>
                    </View> */}
          {/* </Row> */}

          <Row style={[CS.MT18]}>
            <Col>
              <Text style={[CS.font16, CS.FW700, CS.FontBold]}>Extras</Text>
            </Col>
            <Col>
              <Text
                style={[CS.font10, CS.greyText, CS.Col, CS.MT5, CS.FontRegular]}
              >
                (Optional)
              </Text>
            </Col>
          </Row>
          <View style={styles.cardShadow}>
            <View style={styles.cardContainer}>
              {this.extras?.map((item) => (
                <Pressable onPress={() => this.onCheckboxChange(item)}>
                  <Row>
                    <Col sm={9} style={[styles.cardCol]}>
                      <Text style={[CS.font16, CS.FW700, CS.FontBold]}>
                        Extras
                      </Text>
                    </Col>
                    <Col sm={2} style={[styles.cardCol]}>
                      <Text style={[CS.font14, CS.FW400, CS.FontLight]}>
                        SAR {item.amount}
                      </Text>
                    </Col>
                    <Col sm={1} style={[styles.cardCol]}>
                      <Pressable style={{ flexDirection: "row", marginTop: 3 }}>
                        <CheckBox
                          onClick={() => {
                            this.onCheckboxChange(item);
                          }}
                          isChecked={this.state[item._id]}
                        />
                      </Pressable>
                    </Col>
                  </Row>
                </Pressable>
              ))}
            </View>
          </View>
          <Row style={[CS.MT18]}>
            <Col>
              <Text style={[CS.font16, CS.FW700]}>Additional Comments</Text>
            </Col>
            <Col>
              <Text
                style={[
                  CS.font10,
                  CS.greyText,
                  CS.Col,
                  CS.MT5,
                  { paddingLeft: 5 },
                ]}
              >
                (Optional)
              </Text>
            </Col>
            <Col sm={12}>
              <TextInput
                style={[styles.requestInput]}
                placeholder={"e.g. Bring extra sauce..."}
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
          <Row style={[CS.MT18]}></Row>
        </View>
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
                  Are you sure you would like to replace restaurant?
                </Text>
                <Pressable
                  onPress={() => this.deleteItems()}
                  style={[CS.greenBtn, CS.MT18, { backgroundColor: "#C6345C" }]}
                >
                  <Text style={[CS.font16, CS.whiteText]}>Replace Item</Text>
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
        </KeyboardAvoidingView>
      </Wrapper>
    ) : (
      <View style={[styles.container2, styles.horizontal]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addBtnBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#999999",
    width: 104,
    height: 34,
    borderRadius: 5,
    borderColor: "#999999",
    borderWidth: 1,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 5,
    // padding: 3,
    backgroundColor: "#F8F8F8",
  },
  addBtntext: {
    width: 38,
    height: 32,
    paddingTop: 6,
    color: "#ffffff",
  },
  cardShadow: {
    borderRadius: 10,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    margin: 10,
    marginLeft: 0,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    // height: 94,
    paddingLeft: 15,
    paddingRight: 15,
  },
  cardCol: {
    justifyContent: "center",
    height: 50,
    borderBottomWidth: 0.5,
    borderColor: "#ECECEC",
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
    marginTop: -220,
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
  backBtnBg: {
    backgroundColor: "#5B5B5B3D",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginLeft: 10,
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 100,
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
    borderRadius: 10,
    height: 45,
  },
  orderAgainBox: {
    marginTop: 20,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: "#F1F4F3",
    borderRadius: 10,
    height: 46,
    paddingLeft: 15,
    paddingRight: 15,
  },
  orderAgainItem: {
    height: 41,
    borderRadius: 3,
    minWidth: 105,
    marginVertical: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginRight: 15,
  },
  tabSelected: {
    backgroundColor: "#ffffff",
    color: "#5CAC7D",
    height: 41,
    borderRadius: 3,
    minWidth: 105,
    marginVertical: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginRight: 15,
  },
  tabUnSelected: {
    backgroundColor: "#F1F4F3",
    color: "#707070",
    height: 41,
    borderRadius: 3,
    paddingHorizontal: 10,
    marginVertical: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginRight: 15,
  },
  footerBoxText: {
    justifyContent: "center",
    alignItems: "center",
  },
  menuListBox: {
    margin: 10,
    borderBottomWidth: 1,
    paddingBottom: 15,
    borderColor: "#cccccc",
  },
  favoriteIconDisable: {
    color: "#FFFFFF",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: 414,
    height: 278,
    resizeMode: "contain",
  },
  requestContainer: {
    borderRadius: 1,
    marginLeft: -2,
    marginRight: -2,
  },
  requestInput: {
    backgroundColor: "#F4F4F4",
    width: "98%",
    borderRadius: 10,
    marginTop: 5,
    textAlignVertical: "top",
    paddingLeft: 10,
    height: 80,
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
});
