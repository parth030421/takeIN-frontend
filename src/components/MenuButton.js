import React from 'react'
import {
  StyleSheet, View, Text,
  Pressable,
  Image, BackHandler, Modal,
  SafeAreaView, TouchableOpacity, Platform,
} from "react-native";
// import Modal from "react-native-modal";
import { MenuDrawer, Row, Col, ProgressiveImage } from './componentIndex';
import Icon from "react-native-vector-icons/Ionicons";
import Config from '../Config';
import { AppImages } from '../res';
import APIKit from '../APIKit';

export default class MenuButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedMenu: 'Home'
    };
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  navigatePage(page) {
    this.setState({ selectedMenu: page });
    APIKit.selectedMenu = page
    this.toggleOpen()
    this.props.navigation.navigate(page)
  }

  render() {
    const CS = Config.style
    return (
      <View>
        <Modal
          transparent={true}
          visible={this.state.open}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          // swipeDirection='left'
          // onSwipeComplete={() => {
          //   this.toggleOpen();
          // }}
          animationInTiming={3000}
          onRequestClose={() => {
            this.toggleOpen();
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Row size={12} style={{ backgroundColor: '#442B7E', height: '100%' }}>
                <Col sm={8}>
                  <SafeAreaView style={{ backgroundColor: '#442B7E', width: '100%', height: '100%' }}>
                    <Pressable onPress={this.toggleOpen} style={styles.animatedBox}>
                      <Icon name='close-sharp' size={25} color={'#ffffff'}></Icon>
                    </Pressable>


                    <Pressable onPress={() => this.navigatePage('Home')}>
                      <View style={[styles.menuList, APIKit.selectedMenu == 'Home' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                        <View style={styles.listIcon}>
                          <Image source={AppImages.MenuHome} style={styles.sideIcon} />
                        </View>
                        <Text style={styles.listText}>Home</Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => this.navigatePage('Favourite')}>
                      <View style={[styles.menuList, APIKit.selectedMenu == 'Favourite' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                        <View style={styles.listIcon}>
                          <Image source={AppImages.favourit} style={styles.sideIcon} />
                        </View>
                        <Text style={styles.listText}>Favourite</Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => this.navigatePage('SavedAddress')}>
                      <View style={[styles.menuList, APIKit.selectedMenu == 'SavedAddress' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                        <View style={styles.listIcon}>
                          <Image source={AppImages.favourit} style={styles.sideIcon} />
                        </View>
                        <Text style={styles.listText}>Saved Addresses</Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => this.navigatePage('Order')}>
                      <View style={[styles.menuList, APIKit.selectedMenu == 'Order' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                        <View style={styles.listIcon}>
                          <Image source={AppImages.setting} style={styles.sideIcon} />
                        </View>
                        <Text style={styles.listText}>Orders</Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => this.navigatePage('Wallet')}>
                      <View style={[styles.menuList, APIKit.selectedMenu == 'Wallet' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                        <View style={styles.listIcon}>
                          <Image source={AppImages.wallets} style={styles.sideIcon} />
                        </View>
                        <Text style={styles.listText}>Wallet</Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => this.navigatePage('FansCommunity')}>
                      <View style={[styles.menuList, APIKit.selectedMenu == 'FansCommunity' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                        <View style={styles.listIcon}>
                          <Image source={AppImages.fans} style={styles.sideIcon} />
                        </View>
                        <Text style={styles.listText}>Fans Community</Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => this.navigatePage('Setting')}>
                      <View style={[styles.menuList, APIKit.selectedMenu == 'Setting' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                        <View style={styles.listIcon}>
                          <Image source={AppImages.setting} style={styles.sideIcon} />
                        </View>
                        <Text style={styles.listText}>Settings</Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => this.navigatePage('Login')}>
                      <View style={[styles.menuList, APIKit.selectedMenu == 'Login' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                        <View style={styles.listIcon}>
                          <Image source={AppImages.help} style={styles.sideIcon} />
                        </View>
                        <Text style={styles.listText}>Get Help</Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => this.navigatePage('Register')}>
                      <View style={[styles.menuList, APIKit.selectedMenu == 'Register' ? { backgroundColor: 'rgba(100, 79, 148, 1)' } : { backgroundColor: '#442B7E' }]}>
                        <View style={styles.listIcon}>
                          <Image source={AppImages.about} style={styles.sideIcon} />
                        </View>
                        <Text style={styles.listText}>About Us (0.7)</Text>
                      </View>
                    </Pressable>

                  </SafeAreaView>
                </Col>
                <Col sm={1} style={{ marginTop: 100, marginBottom: 100, borderBottomLeftRadius: 36, borderTopLeftRadius: 36, backgroundColor: '#ffffff', opacity: 0.7 }}>
                </Col>
                <Col sm={3} style={{ marginTop: 65, marginBottom: 65, borderBottomLeftRadius: 36, borderTopLeftRadius: 36, backgroundColor: '#ffffff' }}>



                </Col>
              </Row>


            </View>
          </View>
        </Modal>

        <TouchableOpacity onPress={this.toggleOpen} style={styles.iconBtn}>
          <Image
            source={AppImages.sideMenu} style={{ resizeMode: 'contain', width: 22, height: 22, marginLeft: 0 }} />
        </TouchableOpacity>
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
    justifyContent: 'space-evenly',
    flexDirection: "row",
    margin: 8,
    borderRadius: 10
  },
  listIcon: {
    justifyContent: 'center',
    borderRadius: 20, height: 40, width: 40, alignItems: 'center',
  },
  listText: {
    fontSize: 16, fontWeight: '400', fontFamily: 'Ubuntu-Regular', flex: 0.9, justifyContent: 'center', paddingTop: 10, color: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 2
  },
})