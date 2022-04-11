import React from "react";
import {
  StyleSheet, View, Text,
  Pressable,
  Image, StatusBar,
  SafeAreaView,
} from "react-native";
import { AppImages } from "../res";
import { MenuDrawer, Row, Col, ProgressiveImage } from './componentIndex';
import Icon from "react-native-vector-icons/Ionicons";
import APIKit from "../APIKit";
import Config from "../Config";
import SyncStorage from 'sync-storage';
export default class DrawerContainer extends React.Component {
  constructor(props) {
    super(props);
    console.log("llll", this.props.token)
    this.state = {
      open: false,
      selectedMenu: 'Home'
    };
    if (SyncStorage.get('Token') !== null) {
      this.props.navigation.navigate('Home')

    }
  }

  async getToken() {
    try {
      const value = await AsyncStorage.getItem('accessToken')
      console.log("vvv", value)
      if (value !== null) {
        Config.userAuthToken = value;
      }
    } catch (e) {
      // error reading value
    }
  }
  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  navigatePage(page) {
    if (APIKit.selectedMenu == page) {
      this.props.navigation.closeDrawer()
    } else {
      this.setState({ selectedMenu: page });
      APIKit.selectedMenu = page
      this.toggleOpen()
      this.props.navigation.navigate(page)
    }
  }

  showLaunchPopup(status) {
    this.props.navigation.navigate('Home', {
      isShowLaunchPopup: status
    })
  }
  render() {
    const { navigation } = this.props;
    const CS = Config.style;
    return (
      <View>
        <Row size={12} style={{ backgroundColor: '#442B7E', height: '100%' }}>
          <Col sm={8}>
            <SafeAreaView style={{ backgroundColor: '#442B7E', width: '100%', height: '100%' }}>
              <Pressable onPress={() => this.props.navigation.closeDrawer()} style={styles.animatedBox}>
                <Icon name='close-sharp' size={25} color={'#ffffff'}></Icon>
              </Pressable>

              <Pressable onPress={() => { this.navigatePage('Home') }}>
                <Row size={12} style={[styles.menuList, APIKit.selectedMenu == 'Home' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                  <Col style={styles.listIcon}><Image source={AppImages.MenuHome} style={styles.sideIcon} /></Col>
                  <Col><Text style={[styles.listText]}>Home</Text></Col>
                </Row>
              </Pressable>
              <Pressable onPress={() => { this.props.navigation.closeDrawer(); this.showLaunchPopup(true) }}>
                <Row size={12} style={[styles.menuList, APIKit.selectedMenu == 'Favourite' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                  <Col style={styles.listIcon}><Image source={AppImages.favourit} style={styles.sideIcon} /></Col>
                  <Col><Text style={[styles.listText]}>Favourite</Text></Col>
                  <Col style={{ justifyContent: 'center' }}><Image source={AppImages.soon} style={[{ width: 45, height: 20, marginLeft: 10 }]} /></Col>
                </Row>
              </Pressable>
              <Pressable onPress={() => { this.navigatePage('SavedAddress') }}>
                <Row size={12} style={[styles.menuList, APIKit.selectedMenu == 'SavedAddress' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                  <Col style={styles.listIcon}><Image source={AppImages.address} style={styles.sideIcon} /></Col>
                  <Col><Text style={[styles.listText]}>Saved Addresses</Text></Col>
                </Row>
              </Pressable>
              <Pressable onPress={() => { this.navigatePage('Order') }}>
                <Row size={12} style={[styles.menuList, APIKit.selectedMenu == 'Order' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                  <Col style={styles.listIcon}><Image source={AppImages.orders} style={styles.sideIcon} /></Col>
                  <Col><Text style={[styles.listText]}>Order</Text></Col>
                </Row>
              </Pressable>

              <Pressable onPress={() => { this.props.navigation.closeDrawer(); this.showLaunchPopup(true) }}>
                <Row size={12} style={[styles.menuList, APIKit.selectedMenu == 'Wallet' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                  <Col style={styles.listIcon}><Image source={AppImages.wallets} style={styles.sideIcon} /></Col>
                  <Col><Text style={[styles.listText]}>Wallet</Text></Col>
                  <Col style={{ justifyContent: 'center' }}><Image source={AppImages.soon} style={[{ width: 45, height: 20, marginLeft: 10 }]} /></Col>
                </Row>
              </Pressable>

              <Pressable onPress={() => { this.props.navigation.closeDrawer(); this.showLaunchPopup(true) }}>
                <Row size={12} style={[styles.menuList, APIKit.selectedMenu == 'FansCommunity' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                  <Col style={styles.listIcon}><Image source={AppImages.fans} style={styles.sideIcon} /></Col>
                  <Col><Text style={[styles.listText]}>Fans Community</Text></Col>
                  <Col style={{ justifyContent: 'center' }}><Image source={AppImages.soon} style={[{ width: 45, height: 20, marginLeft: 10 }]} /></Col>
                </Row>
              </Pressable>

              <Pressable onPress={() => { this.navigatePage('Setting') }}>
                <Row size={12} style={[styles.menuList, APIKit.selectedMenu == 'Setting' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                  <Col style={styles.listIcon}><Image source={AppImages.setting} style={styles.sideIcon} /></Col>
                  <Col><Text style={[styles.listText]}>Settings</Text></Col>
                </Row>
              </Pressable>
              <Pressable onPress={() => { this.props.navigation.closeDrawer(); this.showLaunchPopup(true) }}>
                <Row size={12} style={[styles.menuList, APIKit.selectedMenu == 'Login' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                  <Col style={styles.listIcon}><Image source={AppImages.help} style={styles.sideIcon} /></Col>
                  <Col><Text style={[styles.listText]}>Get Help</Text></Col>
                  <Col style={{ justifyContent: 'center' }}><Image source={AppImages.soon} style={[{ width: 45, height: 20, marginLeft: 10 }]} /></Col>
                </Row>
              </Pressable>
              <Pressable onPress={() => { this.props.navigation.closeDrawer(); this.showLaunchPopup(true) }}>
                <Row size={12} style={[styles.menuList, APIKit.selectedMenu == 'AboutUs' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                  <Col style={styles.listIcon}><Image source={AppImages.about} style={styles.sideIcon} /></Col>
                  <Col><Text style={[styles.listText]}>About Us (0.70)</Text></Col>
                  <Col style={{ justifyContent: 'center' }}><Image source={AppImages.soon} style={[{ width: 45, height: 20, marginLeft: 10 }]} /></Col>
                </Row>
              </Pressable>

            </SafeAreaView>
          </Col>
          
            <Col sm={1} style={{ marginTop: 100, marginBottom: 100, borderBottomLeftRadius: 36, borderTopLeftRadius: 36, backgroundColor: '#ffffff', opacity: 0.7 }}>
            <Pressable onPress={() => this.props.navigation.closeDrawer()} style={styles.col}></Pressable>
          </Col>
          
          
          <Col sm={3} style={{ marginTop: 65, marginBottom: 65, borderBottomLeftRadius: 36, borderTopLeftRadius: 36, backgroundColor: '#ffffff' }}>
          <Pressable onPress={() => this.props.navigation.closeDrawer()} style={styles.col}></Pressable>
          </Col>
          
        </Row>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sideIcon: {
    resizeMode: 'contain', flex: 1, width: 20, height: 20
  },
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
  modalView: {
    backgroundColor: "white",
    padding: 0,
    width: '100%',
    height: '100%',
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  animatedBox: {
    backgroundColor: "#442B7E",
    padding: 6, marginTop: 10, marginBottom: 10,
    height: 50,
    paddingLeft: 18,
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 40,

  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 20
  },

  menuList: {
    borderRadius: 10,
    justifyContent: 'center',
    margin: 10
  },
  listIcon: {
    justifyContent: 'center',
    borderRadius: 20,
    height: 40,
    width: 40,
    alignItems: 'center',
    paddingLeft: 20
  },
  listText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Ubuntu-Regular',
    justifyContent: 'center',
    color: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingTop: 10
  },
  col:{
    flex:1
  }
});
