// import axios from 'axios';
import Config from './Config';
import { ToastAndroid, AlertIOS } from 'react-native';
import Toast from 'react-native-toast-message';
import SyncStorage from 'sync-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
const APIKit = {
    location: {},
    locationTitle: '',
    ResturantId: '',
    MenuItemId: '',
    isAddressListNull: false,
    payAmount: 0,
    isInternetConnected: '',
    CommonHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Config.authToken //'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE0NTljODFmNzY5MDg3MGNmMzg2ZjYiLCJpYXQiOjE2MzgxNjA5NjF9.Ixo9Xfb8BPu-_TTirhK11iyD6YGBFuK7hqvueiA_OoY' //Config.authToken,
    },
    CommonHeaders2: {},
    mobileNumber: '',
    savedAddressList: [],
    cartItemList: [],
    AddAddressPopup: false,
    selectAddressPopup: false,
    searchRestaurentPopup: false,
    searchMenuPopup: false,
    searchPopup: false,
    foodType: [],
    mealType: [],
    updateAddressId: '',
    selectedMenu: 'Home',
    ResturantName: '',
    previousScreen: '',
    isLaunchingSoonPoup: false,
    openAddAddressPopup() {

    },

    getHeader() {
        let token = 'Bearer ' + JSON.parse(Config.userAuthToken)
        this.CommonHeaders2 = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
        console.log("token", this.CommonHeaders2)
    },

    async getToken() {
        try {
            let token = 'Bearer ' + JSON.parse(await AsyncStorage.getItem('accessToken'))
            this.CommonHeaders = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        } catch (e) {
            // error reading valu
        }
    },
    round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    },
    async showHideLaunchingSoonPoup() {
        if (SyncStorage.get('isLaunchingSoonPoup') == true) {
            await SyncStorage.set('isLaunchingSoonPoup', false)
        } else {
            await SyncStorage.set('isLaunchingSoonPoup', true)
        }
    },

    showToast(message, time) {
        if (Platform.OS === 'android') {
            ToastAndroid.showWithGravityAndOffset(
                message, time,
                ToastAndroid.TOP,
                25,
                50
            );
        } else {
            this.showCommonToast(message, time, 'error')
        }
    },
    showCommonToast(message, time, type) {
        Toast.show({
            type: type,// 'success | error | info',
            position: 'top',
            // text1: message,
            text2: message,
            text2Style: { fontSize: 25, fontWeight: 700 },
            visibilityTime: time,
            autoHide: true,
            topOffset: 40,
            // zIndex: 1000,
            bottomOffset: 40,
            onShow: () => { },
            onHide: () => { }, // called when Toast hides (if `autoHide` was set to `true`)
            onPress: () => { },
            props: {} // any custom props passed to the Toast component
        });
    },
    round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    },
    getCartItemList() {
        fetch(Config.baseUrl + 'cart', {
            method: 'GET',
            headers: this.CommonHeaders
        }).then((response) => response.json())
            .then((responseJson) => {
                this.cartItemList = responseJson.success.data.cart
                this.setState({ showLoader: 1 })
            })
            .catch((error) => {
                console.error("getMenuItemDetail", error);
            });
    },

    getAddress() {
        fetch(Config.baseUrl + 'user/address', {
            method: 'GET',
            headers: this.CommonHeaders2
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == true) {
                    this.savedAddressList = responseJson.success.data.address;
                    // SyncStorage.set('savedAddressList', this.savedAddressList);
                    // console.log("adddd", responseJson.success.data.address)
                    if (responseJson.success.data.address.length == 0) {
                        this.isAddressListNull = true
                    } else {
                        this.isAddressListNull = false
                    }
                    this.locationTitle = ""
                    this.savedAddressList.forEach((item) => {
                        if (item.isDefault) {
                            this.locationTitle = item.nickName
                            // this.locationTitle = item.addressLine1.split(',')[0]
                            // console.log("llllllllllllllll", this.locationTitle.length)
                            // if (this.locationTitle.length > 20) {
                            //     this.locationTitle = this.locationTitle.split('-')[0]
                            //     if (this.locationTitle.split('-')[0].length > 20) {
                            //         this.locationTitle = this.locationTitle.split(' ').slice(0, 2).join(' ');

                            //     }
                            // }
                        }
                    })
                }
            })
            .catch((error) => {
                console.error("errorerror", error);
            });
    },

    updateAddress(id, data) {
        fetch(Config.baseUrl + 'user/address/' + id, {
            method: 'PUT',
            headers: this.CommonHeaders2,
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == true) {
                    this.getAddress();
                }
            })
            .catch((error) => {
                console.error("errorerror", error);
            });
    },

    setDefaultAddress(id) {
        let payload;
        this.savedAddressList.forEach((data) => {
            if (data._id == id) {
                data.isDefault = true
                payload = { "payload": { "address": data } }
                this.updateAddress(data._id, payload)
            } else {
                data.isDefault = false
                payload = { "payload": { "address": data } }
                this.updateAddress(data._id, payload)
            }
        })
    },

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

}

export default APIKit;