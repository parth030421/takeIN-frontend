import React from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack'
import {
  createReactNavigationReduxMiddleware,
  createReduxContainer
} from "react-navigation-redux-helpers";
import Home from "../screens/HomeScreen";
import RestaurentList from "../screens/RestaurantList";
import Login from "../screens/Login";
import Restaurant from "../screens/Restaurant";
import Cart from "../screens/Cart";
import MenuItemDetail from "../screens/MenuItemDetail";
import FoodPrefered from "../screens/PreferedFood";
import Checkout from "../screens/Checkout";
import SavedAddress from "../screens/SavedAddress";
import Register from "../screens/Register";
import Config from "../Config";
import MobileVerify from "../screens/MobileVerify";
import OrderStatus from "../screens/OrderStatus";
import Notifications from "../screens/Notifications";
import Order from "../screens/Order";
import Setting from "../screens/Setting";
import Favourite from "../screens/Favourite";
import Wallet from "../screens/Wallet";
import FansCommunity from "../screens/FansCommunity";
import Help from "../screens/Help";

const CS = Config.style;
const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0
  }
});

const middleware = createReactNavigationReduxMiddleware(
  state => state.nav
);

// login stack
const LoginStack = createStackNavigator(
  {
    Login: { screen: Login },
  },
  {
    initialRouteName: "Welcome",
    headerMode: "float",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "red",
      headerTitleStyle: styles.headerTitleStyle
    }),
    cardStyle: { backgroundColor: "#FFFFFF" }
  }
);


const RootNavigator = createStackNavigator(
  {
    Login: { screen: Login },
    DrawerStack: { screen: LoginStack },
    LoginStack: { screen: Login },
    Register: { screen: Register },
    Home: { screen: Home },

    MobileVerify: { screen: MobileVerify },
    RestaurentList: { screen: RestaurentList },
    Restaurant: { screen: Restaurant },
    Cart: { screen: Cart },
    MenuItemDetail: { screen: MenuItemDetail },
    FoodPrefered: { screen: FoodPrefered },
    Checkout: { screen: Checkout },
    Notifications: { screen: Notifications },
    OrderStatus: { screen: OrderStatus },
    SavedAddress: { screen: SavedAddress },
    Order: { screen: Order },
    Setting: { screen: Setting },
    Favourite: { screen: Favourite },
    Wallet: { screen: Wallet },
    FansCommunity: { screen: FansCommunity },
    Help: { screen: Help }
  },
  {
    // Default config for all screens
    headerMode: "none",
    initialRouteName: "Home",
    transitionConfig: noTransitionConfig,
    navigationOptions: ({ navigation }) => ({
      color: "black"
    })
  }
);

const AppWithNavigationState = createReduxContainer(RootNavigator, "root");

const mapStateToProps = state => ({
  state: state.nav
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    color: "black",
    flex: 1,
  },
  tabBox: {
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: "row",
    position: 'absolute',
    bottom: 0,
    width: '109%',
    height: 73,
    backgroundColor: '#ffffff',
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
    marginLeft: '-1%'
  },
  tabBoxIcon: {
    height: 76,
    width: 76,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBoxIconQR: {
    height: 76,
    width: 76,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#452B7D',
    marginTop: -23
  },
  ratingText: {
    marginTop: -10
  }
});

export { RootNavigator, AppNavigator, middleware };
