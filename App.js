
// import React from 'react';
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import AppReducer from "./src/reducers";
import { middleware } from "./src/navigations/AppNavigation";
// // import Toast from 'react-native-toast-message';
// // import { locationService } from './src/util/action'
const store = createStore(AppReducer, applyMiddleware(middleware));

// function App() {
//   return (
//     <Provider store={store}>
//       <AppNavigator />
//       {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
//     </Provider>
//   );
// };

// export default App;

import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, Modal, TouchableOpacity } from 'react-native';
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from "react-navigation-stack"
import HomeScreen from './src/screens/HomeScreen';
import Setting from './src/screens/Setting';
import Login from './src/screens/Login';
import DrawerContainer from "./src/components/DrawerContainer";
import Register from "./src/screens/Register";
import MobileVerify from "./src/screens/MobileVerify";
import RestaurentList from "./src/screens/RestaurantList";
import Restaurant from "./src/screens/Restaurant";
import Cart from "./src/screens/Cart";
import MenuItemDetail from "./src/screens/MenuItemDetail";
import FoodPrefered from "./src/screens/PreferedFood";
import Checkout from "./src/screens/Checkout";
import Notifications from "./src/screens/Notifications";
import OrderStatus from "./src/screens/OrderStatus";
import SavedAddress from "./src/screens/SavedAddress";
import Order from "./src/screens/Order";
import Favourite from "./src/screens/Favourite";
import Wallet from "./src/screens/Wallet";
import FansCommunity from "./src/screens/FansCommunity";
import Profile from "./src/screens/Profile";
import Dine from "./src/screens/Dine";
import Deals from "./src/screens/Deals";
import Help from "./src/screens/Help";
import PaymentMethod from "./src/screens/PaymentMethod";
import Payment from "./src/screens/Payment";
import Chat from "./src/screens/Chat";
import ChangeEmail from "./src/screens/ChangeEmail";
import ChangePhone from "./src/screens/ChangePhone";
import { AppImages } from "./src/res";
import Toast from 'react-native-toast-message';
// import NetInfo from "@react-native-community/netinfo";
// import AsyncStorage from "@react-native-community/async-storage";
import OrderTracking from "./src/screens/OrderTracking";
import { LogBox } from 'react-native';
import { SignIn } from './src/components/componentIndex';
import Config from "./src/Config";

import NetInfo from "@react-native-community/netinfo";
import APIKit from "./src/APIKit";
import AwesomeAlert from 'react-native-awesome-alerts';

const Drawer = createDrawerNavigator(
  {//techwinlabs123
    Login: { screen: Login, navigationOptions: { drawerLockMode: 'locked-closed' } },
    Home: { screen: HomeScreen },
    Register: { screen: Register, navigationOptions: { drawerLockMode: 'locked-closed' } },
    MobileVerify: { screen: MobileVerify, navigationOptions: { drawerLockMode: 'locked-closed' } },
    RestaurentList: { screen: RestaurentList, navigationOptions: { drawerLockMode: 'locked-closed' } },
    Restaurant: { screen: Restaurant, navigationOptions: { drawerLockMode: 'locked-closed' } },
    Cart: { screen: Cart, navigationOptions: { drawerLockMode: 'locked-closed' } },
    MenuItemDetail: { screen: MenuItemDetail, navigationOptions: { drawerLockMode: 'locked-closed' } },
    FoodPrefered: { screen: FoodPrefered, navigationOptions: { drawerLockMode: 'locked-closed' } },
    Checkout: { screen: Checkout, navigationOptions: { drawerLockMode: 'locked-closed' } },
    Notifications: { screen: Notifications, navigationOptions: { drawerLockMode: 'locked-closed' } },
    OrderStatus: { screen: OrderStatus, navigationOptions: { drawerLockMode: 'locked-closed' } },
    SavedAddress: { screen: SavedAddress },
    Order: { screen: Order },
    Setting: { screen: Setting },
    Favourite: { screen: Favourite },
    Wallet: { screen: Wallet },
    FansCommunity: { screen: FansCommunity },
    Help: { screen: Help },
    OrderTracking: { screen: OrderTracking, navigationOptions: { drawerLockMode: 'locked-closed' } },
    PaymentMethod: { screen: PaymentMethod, navigationOptions: { drawerLockMode: 'locked-closed' } },
    Payment: { screen: Payment, navigationOptions: { drawerLockMode: 'locked-closed' } },
    Chat: { screen: Chat, navigationOptions: { drawerLockMode: 'locked-closed' } },
    ChangeEmail: { screen: ChangeEmail, navigationOptions: { drawerLockMode: 'locked-closed' } },
    ChangePhone: { screen: ChangePhone, navigationOptions: { drawerLockMode: 'locked-closed' } },
    Profile: { screen: Profile },
    Dine: { screen: Dine },
    Deals: { screen: Deals },
  },
  {
    initialRouteName: "Login",
    unmountInactiveRoutes: true,
    headerMode: "none",
    drawerWidth: '100%',
    contentComponent: props => <DrawerContainer {...props} />
  }
)

const AppNavigator = createStackNavigator(
  {
    Drawer: { screen: Drawer },
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none",
    unmountInactiveRoutes: true
  }
)

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  state = {
    hasViewedVideo: false,
    isShowLoginPopup: false,
  }

  setLoginModalVisible = (visible) => {
    this.setState({ isShowLoginPopup: visible });
  }
  
  componentDidMount = async () => {
    this.state = { showAlert: false };
    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs();//Ignore all log notifications
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        APIKit.isInternetConnected = true
      } else {
        APIKit.isInternetConnected = false
      }
    })
    setTimeout(() => {
      this.setState({ hasViewedVideo: true })
    }, 4700)
    setInterval(() => {
      if (!APIKit.isInternetConnected) {
        this.showAlert();
      } else {
        this.hideAlert();
        // this.setState({});
      }
    }, 1000)
  }

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });

  };
  render() {
    const { showAlert } = this.state;

    return (
      <Provider store={store}>
        <AppContainer />
        <Toast ref={(ref) => Toast.setRef(ref)} />
        {/* <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Whoops!"
          message="There seems to be a problem with your Network Connection"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Reload"
          confirmButtonColor="#442B7E"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        /> */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isShowLoginPopup}
          onRequestClose={() => {
            this.setLoginModalVisible(!this.state.isShowLoginPopup);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <SignIn></SignIn>
            </View>
          </View>
        </Modal>
      </Provider>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 40,
    alignItems: "center",
    flex: 1

  },
  listItem: {
    height: 60,
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    marginLeft: 20
  },
  header: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 20
  },
  sidebarDivider: {
    height: 1,
    width: "100%",
    backgroundColor: "lightgray",
    marginVertical: 10
  }
});